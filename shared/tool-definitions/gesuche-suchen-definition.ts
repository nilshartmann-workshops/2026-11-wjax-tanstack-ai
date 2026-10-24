import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

import { tierart } from "./tierart.ts";

// 🕵️‍♂️ Erzählen: chat() prüft die Argumente gegen das Schema, ein falscher Wert geht als Fehler an das Modell zurück
const suchFilter = z.object({
  tierart: tierart.optional().describe("Tierart, auch Pflanzen zählen dazu"),
  ort: z.string().optional().describe("Nur die Stadt, ein Wort, etwa Hamburg"),
  zeitraum: z
    .string()
    .optional()
    .describe("Nur der Monat, ein Wort, etwa Juli"),
});

export const gesucheSuchenToolDef = toolDefinition({
  name: "gesucheSuchen",
  description:
    "Sucht Gesuche. In einem Gesuch braucht jemand Betreuung für sein Tier oder seine Pflanze.",
  inputSchema: suchFilter,
});
