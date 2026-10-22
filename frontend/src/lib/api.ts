import { queryOptions } from "@tanstack/react-query";

import type {
  CategoryId,
  CreatePostInput,
  CreateReplyInput,
  PostType,
} from "#/types.ts";
import { PostSchema, ReplySchema } from "#/types.ts";

// Kein BASE_URL: Der Vite-Dev-Server leitet /api an das Backend auf Port 63080
// weiter (siehe vite.config.ts). Damit braucht das Backend kein CORS.

async function fetchJson(path: string, init?: RequestInit) {
  const res = await fetch(`/api${path}`, init);
  if (!res.ok) {
    throw new Error(`${init?.method ?? "GET"} /api${path} — ${res.status}`);
  }
  return res.json();
}

async function postJson(path: string, body: unknown) {
  return fetchJson(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const getPostsQueryOptions = (type?: PostType, category?: CategoryId) =>
  queryOptions({
    queryKey: ["posts", "list", type ?? null, category ?? null],
    async queryFn() {
      const params = new URLSearchParams();
      if (type) {
        params.set("type", type);
      }
      if (category) {
        params.set("category", category);
      }
      const search = params.size > 0 ? `?${params}` : "";
      return PostSchema.array().parse(await fetchJson(`/posts${search}`));
    },
  });

export const getPostQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["posts", "detail", postId],
    async queryFn() {
      return PostSchema.parse(await fetchJson(`/posts/${postId}`));
    },
  });

export const getRepliesByPostIdQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["replies", "list", postId],
    async queryFn() {
      return ReplySchema.array().parse(
        await fetchJson(`/posts/${postId}/replies`),
      );
    },
  });

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function createPost(input: CreatePostInput) {
  return PostSchema.parse(await postJson("/posts", input));
}

export async function createReply(postId: string, input: CreateReplyInput) {
  return ReplySchema.parse(await postJson(`/posts/${postId}/replies`, input));
}

export async function markInterested(postId: string) {
  return PostSchema.parse(
    await fetchJson(`/posts/${postId}/interested`, { method: "PUT" }),
  );
}

export async function subscribeNewsletter(email: string) {
  return postJson("/newsletter", { email });
}
