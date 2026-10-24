import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

import { tierart } from "./tierart.ts";

/**
 * Sucht an der Pinnwand der Angebote.
 *
 * Die Pinnwand steckt im Toolnamen und nicht in einem Enum im Schema. Für die
 * Wahl zwischen Gesuchen und Angeboten hat das Modell nur Name und
 * `description`.
 */
export const angeboteSuchenToolDef = toolDefinition({
  name: "angeboteSuchen",
  description:
    "Sucht Angebote. In einem Angebot bietet jemand an, Tiere oder Pflanzen zu betreuen.",
  inputSchema: z.object({
    tierart: tierart.optional().describe("Tierart, auch Pflanzen zählen dazu"),
    ort: z
      .string()
      .optional()
      .describe("Nur die Stadt, ein Wort, etwa Hamburg"),
    zeitraum: z
      .string()
      .optional()
      .describe("Nur der Monat, ein Wort, etwa Juli"),
  }),
  outputSchema: z.array(
    z.object({
      id: z.string(),
      titel: z.string(),
      erfahrungMit: z.array(tierart),
      zeitraum: z.string(),
      ort: z.string(),
    }),
  ),
});
