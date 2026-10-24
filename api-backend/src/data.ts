import { readFileSync } from "node:fs";

/**
 * Der komplette Datenbestand von hütly, im Speicher.
 *
 * Die Beispieldaten liegen in `data.json` und werden beim Start eingelesen.
 * Ein Neustart stellt den Ausgangszustand wieder her. Während des Vortrags
 * läuft dieser Prozess deshalb durch, damit freigegebene Antworten stehen
 * bleiben.
 */

export const TIERARTEN = [
  "Katze",
  "Hund",
  "Reptil",
  "Pflanze",
  "Sonstiges",
] as const;
export type Tierart = (typeof TIERARTEN)[number];

/** Ein Gesuch: Jemand braucht Betreuung für sein Tier oder seine Pflanze. */
export type Gesuch = {
  id: string;
  titel: string;
  autor: string;
  beschreibung: string;
  tier: string;
  tierart: Tierart;
  zeitraum: string;
  ort: string;
  erstelltAm: string;
};

/** Ein Angebot: Jemand bietet an, Tiere oder Pflanzen zu betreuen. */
export type Angebot = {
  id: string;
  titel: string;
  autor: string;
  ueberMich: string;
  erfahrungMit: Array<Tierart>;
  zeitraum: string;
  ort: string;
  erstelltAm: string;
};

/**
 * Eine Antwort unter einem Gesuch oder einem Angebot. Gesuch und Angebot
 * heißen zusammen Eintrag.
 */
export type Antwort = {
  id: string;
  eintragId: string;
  autor: string;
  text: string;
  erstelltAm: string;
};

type Data = {
  gesuche: Array<Gesuch>;
  angebote: Array<Angebot>;
  antworten: Array<Antwort>;
};

const data: Data = JSON.parse(
  readFileSync(new URL("./data.json", import.meta.url), "utf-8"),
);

export const gesuche = data.gesuche;
export const angebote = data.angebote;
export const antworten = data.antworten;

/**
 * Die Präfixe der Ids sind nur zum Lesen da: g für Gesuche, a für Angebote,
 * aw für Antworten. Die API leitet aus ihnen nichts ab.
 */
let nextGesuchNumber = gesuche.length + 1;
let nextAntwortNumber = antworten.length + 1;

export function nextGesuchId() {
  return `g${nextGesuchNumber++}`;
}

export function nextAntwortId() {
  return `aw${nextAntwortNumber++}`;
}
