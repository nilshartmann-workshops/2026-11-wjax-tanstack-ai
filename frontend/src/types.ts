import { z } from "zod";

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const TierartSchema = z.enum([
  "Katze",
  "Hund",
  "Reptil",
  "Pflanze",
  "Sonstiges",
]);
export type Tierart = z.infer<typeof TierartSchema>;

/** Ein Gesuch: Jemand braucht Betreuung für sein Tier oder seine Pflanze. */
export const GesuchSchema = z.object({
  id: z.string(),
  titel: z.string(),
  autor: z.string(),
  beschreibung: z.string(),
  tier: z.string(),
  tierart: TierartSchema,
  zeitraum: z.string(),
  ort: z.string(),
  erstelltAm: z.iso.datetime(),
});
export type Gesuch = z.infer<typeof GesuchSchema>;

/** Ein Angebot: Jemand bietet an, Tiere oder Pflanzen zu betreuen. */
export const AngebotSchema = z.object({
  id: z.string(),
  titel: z.string(),
  autor: z.string(),
  ueberMich: z.string(),
  erfahrungMit: z.array(TierartSchema),
  zeitraum: z.string(),
  ort: z.string(),
  erstelltAm: z.iso.datetime(),
});
export type Angebot = z.infer<typeof AngebotSchema>;

/**
 * Gesuch oder Angebot, nur mit Art und Titel. So liefert ihn die API, wenn
 * nur die Id bekannt ist.
 */
export const EintragSchema = z.object({
  art: z.enum(["Gesuch", "Angebot"]),
  id: z.string(),
  titel: z.string(),
});
export type Eintrag = z.infer<typeof EintragSchema>;

/** Eine Antwort unter einem Gesuch oder einem Angebot. */
export const AntwortSchema = z.object({
  id: z.string(),
  eintragId: z.string(),
  autor: z.string(),
  text: z.string(),
  erstelltAm: z.iso.datetime(),
});
export type Antwort = z.infer<typeof AntwortSchema>;

export const CreateAntwortSchema = z.object({
  autor: z.string().min(1, "Benutzername darf nicht leer sein."),
  text: z.string().min(1, "Antwort darf nicht leer sein."),
});
export type CreateAntwortInput = z.infer<typeof CreateAntwortSchema>;

/**
 * POST /api/gesuche
 * Neues Gesuch erstellen.
 */
export const CreateGesuchSchema = z.object({
  titel: z.string().min(1),
  autor: z.string().min(1),
  beschreibung: z.string().min(1),
  tier: z.string().min(1),
  zeitraum: z.string().min(1),
  ort: z.string().min(1),
  tierart: TierartSchema,
});
export type CreateGesuchInput = z.infer<typeof CreateGesuchSchema>;
