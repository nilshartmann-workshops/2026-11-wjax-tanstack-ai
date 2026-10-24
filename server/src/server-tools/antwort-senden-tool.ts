import { antwortSendenToolDef } from "@huetly/shared/tool-definitions";

import * as api from "../huetly-api.ts";

/**
 * Die Implementierung mit `.server()`. Sie läuft im Chat-Server und ruft den
 * API-Server nur über die Fassade auf.
 */
export const antwortSendenTool = antwortSendenToolDef.server(async (input) => {
  const antwort = await api.antwortSenden(input.eintragId, input.text);
  return { antwortId: antwort.id, eintragId: antwort.eintragId };
});
