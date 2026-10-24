import { angeboteSuchenToolDef } from "@huetly/shared/tool-definitions";

import * as api from "../huetly-api.ts";

/**
 * Die Implementierung mit `.server()`. Sie läuft im Chat-Server und ruft den
 * API-Server nur über die Fassade auf.
 */
export const angeboteSuchenTool = angeboteSuchenToolDef.server(
  async (filter) => {
    console.log("angeboteSuchen", filter);
    const angebote = await api.angeboteSuchen(filter);
    return angebote.map(uebersichtAngebot);
  },
);

/** Die Suche liefert dem Modell nur eine Übersicht, ohne die langen Texte. */
function uebersichtAngebot(angebot: api.Angebot) {
  return {
    id: angebot.id,
    titel: angebot.titel,
    erfahrungMit: angebot.erfahrungMit,
    zeitraum: angebot.zeitraum,
    ort: angebot.ort,
  };
}
