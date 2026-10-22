import { type Request, type Response, Router } from "express";

import {
  CATEGORIES,
  type Category,
  nextPostId,
  nextReplyId,
  type Post,
  POST_TYPES,
  type PostType,
  posts,
  type Reply,
  replies,
} from "./data.ts";

/// Die REST-API von hütly. Sie existiert vor dem Assistenten und bleibt von
/// ihm unberührt.
///
/// Hinweis zu `/posts`: Beide Pinnwände liegen unter demselben Pfad und werden
/// mit `?type=Gesuch` oder `?type=Angebot` auseinandergehalten.
const router = Router();

router.get("/posts", (req: Request, res: Response) => {
  const type = req.query.type as string | undefined;
  const category = req.query.category as string | undefined;
  const orderBy = (req.query.orderBy as string | undefined) ?? "date";

  if (type !== undefined && !isPostType(type)) {
    badRequest(res, `Unbekannte Art: '${type}'`);
    return;
  }
  if (category !== undefined && !isCategory(category)) {
    badRequest(res, `Unbekannte Kategorie: '${category}'`);
    return;
  }

  const result = posts
    .filter((post) => type === undefined || post.type === type)
    .filter((post) => category === undefined || post.category === category)
    .sort(orderBy === "interested" ? byInterested : byNewest);

  res.json(result);
});

router.post("/posts", (req: Request, res: Response) => {
  const { type, category } = req.body ?? {};
  const fields = [
    "title",
    "author",
    "description",
    "animal",
    "timeframe",
    "location",
  ] as const;

  const missing = fields.find((field) => isBlank(req.body?.[field]));
  if (missing) {
    badRequest(res, `${missing} ist ein Pflichtfeld`);
    return;
  }
  if (!isPostType(type)) {
    badRequest(res, "type ist ein Pflichtfeld");
    return;
  }
  if (!isCategory(category)) {
    badRequest(res, "category ist ein Pflichtfeld");
    return;
  }

  const post: Post = {
    id: nextPostId(type),
    type,
    title: String(req.body.title).trim(),
    author: String(req.body.author).trim(),
    description: String(req.body.description).trim(),
    animal: String(req.body.animal).trim(),
    timeframe: String(req.body.timeframe).trim(),
    location: String(req.body.location).trim(),
    category,
    interested: 0,
    createdAt: new Date().toISOString(),
  };

  posts.unshift(post);
  res.status(201).json(post);
});

router.get("/posts/:id", (req: Request, res: Response) => {
  const post = findPost(req.params.id);
  if (!post) {
    notFound(res);
    return;
  }
  res.json(post);
});

router.put("/posts/:id/interested", (req: Request, res: Response) => {
  const post = findPost(req.params.id);
  if (!post) {
    notFound(res);
    return;
  }
  post.interested += 1;
  res.json(post);
});

router.get("/posts/:id/replies", (req: Request, res: Response) => {
  if (!findPost(req.params.id)) {
    notFound(res);
    return;
  }

  const result = replies
    .filter((reply) => reply.postId === req.params.id)
    .sort(byNewest);

  res.json(result);
});

router.post("/posts/:id/replies", (req: Request, res: Response) => {
  if (!findPost(req.params.id)) {
    notFound(res);
    return;
  }

  const { author, text } = req.body ?? {};
  if (isBlank(author)) {
    badRequest(res, "author ist ein Pflichtfeld");
    return;
  }
  if (isBlank(text)) {
    badRequest(res, "text ist ein Pflichtfeld");
    return;
  }

  const reply: Reply = {
    id: nextReplyId(),
    postId: String(req.params.id),
    author: String(author).trim(),
    text: String(text).trim(),
    createdAt: new Date().toISOString(),
  };

  replies.push(reply);
  res.status(201).json(reply);
});

/// Das MailWidget im Kopf der Seite schickt hier hin. Es passiert nichts.
router.post("/newsletter", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

export default router;

function findPost(id: unknown) {
  return posts.find((post) => post.id === id);
}

function isPostType(value: unknown): value is PostType {
  return POST_TYPES.includes(value as PostType);
}

function isCategory(value: unknown): value is Category {
  return CATEGORIES.includes(value as Category);
}

function isBlank(value: unknown) {
  return value === undefined || value === null || String(value).trim() === "";
}

function byNewest(a: { createdAt: string }, b: { createdAt: string }) {
  return b.createdAt.localeCompare(a.createdAt);
}

function byInterested(a: Post, b: Post) {
  return b.interested - a.interested;
}

function badRequest(res: Response, error: string) {
  res.status(400).json({ error });
}

function notFound(res: Response) {
  res.status(404).json({ error: "Post not found" });
}
