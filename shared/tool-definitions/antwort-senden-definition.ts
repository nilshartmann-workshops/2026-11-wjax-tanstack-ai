import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

/**
 * Sendet eine Antwort unter ein Gesuch oder ein Angebot.
 *
 * Im Schema stehen nur Eintrag und Text. Der Autor kommt nie vom Modell,
 * sondern aus der Fassade.
 */
export const antwortSendenToolDef = toolDefinition({
  name: "antwortSenden",
  description:
    "Sendet eine Antwort unter ein Gesuch oder ein Angebot, im Namen des Nutzers.",
  inputSchema: z.object({
    eintragId: z
      .string()
      .describe("Id des Gesuchs oder Angebots aus der Suche, etwa g1 oder a3"),
    text: z.string().describe("Der Text der Antwort"),
  }),
  outputSchema: z.object({ antwortId: z.string(), eintragId: z.string() }),
  // 🕵️‍♂️ Zeigen: der Lauf hält an, bis der Nutzer entschieden hat
  needsApproval: true,
});
