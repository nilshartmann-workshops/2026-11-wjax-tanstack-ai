import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

import { tierart } from "./tierart.ts";

/**
 * Das Client-Tool für ein neues Gesuch. Es füllt nur das Formular vor,
 * veröffentlicht wird mit dem Knopf im Formular.
 */
export const gesuchVorbereitenToolDef = toolDefinition({
  name: "gesuchVorbereiten",
  description:
    "Füllt in der Anwendung das Formular für ein neues Gesuch vor. Der Nutzer prüft es und veröffentlicht es selbst.",
  inputSchema: z.object({
    titel: z.string().describe("Kurzer, freundlicher Titel"),
    beschreibung: z
      .string()
      .describe("Zwei bis drei Sätze über das Tier und die Betreuung"),
    tier: z
      .string()
      .optional()
      .describe("Welches Tier, etwa 2 Landschildkröten"),
    zeitraum: z.string().optional().describe("Wann, etwa 3 Wochen im Juli"),
    ort: z.string().optional().describe("Wo, etwa Hamburg-Altona"),
    tierart: tierart.optional().describe("Tierart, auch Pflanzen zählen dazu"),
  }),
});
