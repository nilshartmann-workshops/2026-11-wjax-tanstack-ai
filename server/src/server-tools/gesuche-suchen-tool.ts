import * as api from "../huetly-api.ts";

// todo: gesucheSuchen

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
