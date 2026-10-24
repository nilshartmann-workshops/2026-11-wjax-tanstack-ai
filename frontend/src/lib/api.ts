import { queryOptions } from "@tanstack/react-query";

import type {
  CreateAntwortInput,
  CreateGesuchInput,
  Tierart,
} from "#/types.ts";
import {
  AngebotSchema,
  AntwortSchema,
  EintragSchema,
  GesuchSchema,
} from "#/types.ts";

// Kein BASE_URL: Der Vite-Dev-Server leitet /api an das Backend auf Port 26080
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

function tierartParam(tierart?: Tierart) {
  return tierart ? `?${new URLSearchParams({ tierart })}` : "";
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const gesucheQueryOptions = (tierart?: Tierart) =>
  queryOptions({
    queryKey: ["gesuche", "list", tierart ?? null],
    async queryFn() {
      return GesuchSchema.array().parse(
        await fetchJson(`/gesuche${tierartParam(tierart)}`),
      );
    },
  });

export const gesuchQueryOptions = (gesuchId: string) =>
  queryOptions({
    queryKey: ["gesuche", "detail", gesuchId],
    async queryFn() {
      return GesuchSchema.parse(await fetchJson(`/gesuche/${gesuchId}`));
    },
  });

export const angeboteQueryOptions = (tierart?: Tierart) =>
  queryOptions({
    queryKey: ["angebote", "list", tierart ?? null],
    async queryFn() {
      return AngebotSchema.array().parse(
        await fetchJson(`/angebote${tierartParam(tierart)}`),
      );
    },
  });

export const angebotQueryOptions = (angebotId: string) =>
  queryOptions({
    queryKey: ["angebote", "detail", angebotId],
    async queryFn() {
      return AngebotSchema.parse(await fetchJson(`/angebote/${angebotId}`));
    },
  });

export const eintragQueryOptions = (eintragId: string) =>
  queryOptions({
    queryKey: ["eintraege", "detail", eintragId],
    async queryFn() {
      return EintragSchema.parse(await fetchJson(`/eintraege/${eintragId}`));
    },
  });

export const antwortenQueryOptions = (eintragId: string) =>
  queryOptions({
    queryKey: ["antworten", "list", eintragId],
    async queryFn() {
      return AntwortSchema.array().parse(
        await fetchJson(`/antworten?${new URLSearchParams({ eintragId })}`),
      );
    },
  });

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function createGesuch(input: CreateGesuchInput) {
  return GesuchSchema.parse(await postJson("/gesuche", input));
}

export async function createAntwort(
  eintragId: string,
  input: CreateAntwortInput,
) {
  return AntwortSchema.parse(
    await postJson("/antworten", { eintragId, ...input }),
  );
}

export async function subscribeNewsletter(email: string) {
  return postJson("/newsletter", { email });
}
