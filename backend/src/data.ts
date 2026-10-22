import { readFileSync } from "node:fs";

/// Der komplette Datenbestand von hütly, im Speicher.
///
/// Die Beispieldaten liegen in `posts.json` und werden beim Start eingelesen.
/// Ein Neustart stellt den Ausgangszustand wieder her. Während des Vortrags
/// läuft dieser Prozess deshalb durch, damit freigegebene Antworten stehen
/// bleiben.

export const CATEGORIES = [
  "Katze",
  "Hund",
  "Reptil",
  "Pflanze",
  "Sonstiges",
] as const;
export type Category = (typeof CATEGORIES)[number];

/// Die Pinnwand: Beim Gesuch wird Betreuung gebraucht, beim Angebot wird sie
/// übernommen.
export const POST_TYPES = ["Gesuch", "Angebot"] as const;
export type PostType = (typeof POST_TYPES)[number];

export type Post = {
  id: string;
  type: PostType;
  title: string;
  author: string;
  description: string;
  animal: string;
  timeframe: string;
  location: string;
  category: Category;
  interested: number;
  createdAt: string;
};

/// Eine Antwort unter einem Gesuch oder einem Angebot.
export type Reply = {
  id: string;
  postId: string;
  author: string;
  text: string;
  createdAt: string;
};

type Data = { posts: Array<Post>; replies: Array<Reply> };

const data: Data = JSON.parse(
  readFileSync(new URL("./posts.json", import.meta.url), "utf-8"),
);

export const posts = data.posts;
export const replies = data.replies;

const ID_PREFIX: Record<PostType, string> = { Gesuch: "r", Angebot: "a" };

/// Je Pinnwand ein eigener Zähler, damit die Ids ihren Buchstaben behalten.
const nextPostNumber: Record<PostType, number> = {
  Gesuch: posts.filter((post) => post.type === "Gesuch").length + 1,
  Angebot: posts.filter((post) => post.type === "Angebot").length + 1,
};

let nextReplyNumber = replies.length + 1;

export function nextPostId(type: PostType) {
  return `${ID_PREFIX[type]}${nextPostNumber[type]++}`;
}

export function nextReplyId() {
  return `c${nextReplyNumber++}`;
}
