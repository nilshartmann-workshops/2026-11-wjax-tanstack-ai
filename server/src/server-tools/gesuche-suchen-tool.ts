import { gesucheSuchenToolDef } from "@huetly/shared/tool-definitions";

import * as api from "../huetly-api.ts";

// 🕵️‍♂️ Erzählen: .server() ist die Implementierung, sie ruft nur die Fassade
export const gesucheSuchenTool = gesucheSuchenToolDef.server(async (filter) => {
  console.log("gesucheSuchen", filter);
  const gesuche = await api.gesucheSuchen(filter);
  return gesuche.map(uebersichtGesuch);
});

/** Die Suche liefert dem Modell nur eine Übersicht, ohne die langen Texte. */
function uebersichtGesuch(gesuch: api.Gesuch) {
  return {
    id: gesuch.id,
    titel: gesuch.titel,
    tier: gesuch.tier,
    tierart: gesuch.tierart,
    zeitraum: gesuch.zeitraum,
    ort: gesuch.ort,
  };
}
