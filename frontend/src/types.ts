import { z } from "zod";

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const CategoryIdSchema = z.enum([
  "Katze",
  "Hund",
  "Reptil",
  "Pflanze",
  "Sonstiges",
]);
export type CategoryId = z.infer<typeof CategoryIdSchema>;

/**
 * Die Pinnwand, an der eine Veröffentlichung hängt: Beim Gesuch wird Betreuung
 * gebraucht, beim Angebot wird sie übernommen.
 */
export const PostTypeSchema = z.enum(["Gesuch", "Angebot"]);
export type PostType = z.infer<typeof PostTypeSchema>;

export const PostSchema = z.object({
  id: z.string(),
  type: PostTypeSchema,
  title: z.string(),
  author: z.string(),
  description: z.string(),
  animal: z.string(),
  timeframe: z.string(),
  location: z.string(),
  category: CategoryIdSchema,
  interested: z.number().int().nonnegative(),
  createdAt: z.iso.datetime(),
});
export type Post = z.infer<typeof PostSchema>;

/** Eine Antwort unter einem Gesuch oder einem Angebot. */
export const ReplySchema = z.object({
  id: z.string(),
  postId: z.string(),
  author: z.string(),
  text: z.string(),
  createdAt: z.iso.datetime(),
});
export type Reply = z.infer<typeof ReplySchema>;

export const CreateReplySchema = z.object({
  author: z.string().min(1, "Benutzername darf nicht leer sein."),
  text: z.string().min(1, "Antwort darf nicht leer sein."),
});
export type CreateReplyInput = z.infer<typeof CreateReplySchema>;

/**
 * POST /api/posts
 * Neues Gesuch oder neues Angebot erstellen.
 */
export const CreatePostSchema = z.object({
  type: PostTypeSchema,
  title: z.string().min(1),
  author: z.string().min(1),
  description: z.string().min(1),
  animal: z.string().min(1),
  timeframe: z.string().min(1),
  location: z.string().min(1),
  category: CategoryIdSchema,
});
export type CreatePostInput = z.infer<typeof CreatePostSchema>;
