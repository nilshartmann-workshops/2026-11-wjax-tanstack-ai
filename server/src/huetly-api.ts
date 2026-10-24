/**
 * Die Fassade zum API-Server von hütly.
 *
 * Die Tools des Assistenten rufen nur diese Funktionen auf. Dahinter steht
 * hier ein kleiner Node-Prozess, in einer echten Anwendung euer bestehendes
 * Backend, etwa ein Spring-Boot-Dienst.
 */

const API_URL = "http://localhost:26080/api";

/**
 * Der Nutzer, in dessen Namen der Assistent schreibt. Es gibt keine
 * Anmeldung. Der Name steht hier und nicht in einem Tool-Parameter, damit
 * das Modell ihn nicht wählen kann.
 */
export const CURRENT_USER = "nils";

export type Tierart = "Katze" | "Hund" | "Reptil" | "Pflanze" | "Sonstiges";

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

/** Gesuch oder Angebot, nur mit Art und Titel. */
export type Eintrag = {
  art: "Gesuch" | "Angebot";
  id: string;
  titel: string;
};

export type Antwort = {
  id: string;
  eintragId: string;
  autor: string;
  text: string;
  erstelltAm: string;
};

export type Filter = {
  tierart?: Tierart;
  ort?: string;
  zeitraum?: string;
};

/**
 * Sucht unter den Gesuchen. Ort und Zeitraum sind Freitext und treffen, wenn
 * sie im jeweiligen Feld vorkommen (Hamburg trifft Hamburg-Altona).
 */
export async function gesucheSuchen(filter: Filter = {}) {
  const gesuche: Array<Gesuch> = await get(`/gesuche${tierartParam(filter)}`);
  return gesuche.filter((gesuch) => matches(gesuch, filter));
}

/**
 * Sucht unter den Angeboten. Die Tierart trifft, wenn das Angebot Erfahrung
 * mit ihr hat.
 */
export async function angeboteSuchen(filter: Filter = {}) {
  const angebote: Array<Angebot> = await get(
    `/angebote${tierartParam(filter)}`,
  );
  return angebote.filter((angebot) => matches(angebot, filter));
}

/**
 * Liefert Art und Titel eines Eintrags oder `undefined`, wenn es ihn nicht
 * gibt.
 */
export async function eintragLaden(
  eintragId: string,
): Promise<Eintrag | undefined> {
  const response = await fetch(`${API_URL}/eintraege/${eintragId}`);
  if (response.status === 404) {
    return undefined;
  }
  return checked(response).json();
}

export async function antwortSenden(
  eintragId: string,
  text: string,
): Promise<Antwort> {
  const response = await fetch(`${API_URL}/antworten`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eintragId, autor: CURRENT_USER, text }),
  });
  return checked(response).json();
}

async function get(path: string) {
  return checked(await fetch(`${API_URL}${path}`)).json();
}

function tierartParam(filter: Filter) {
  return filter.tierart
    ? `?${new URLSearchParams({ tierart: filter.tierart })}`
    : "";
}

function matches(eintrag: { ort: string; zeitraum: string }, filter: Filter) {
  return (
    contains(eintrag.ort, filter.ort) &&
    contains(eintrag.zeitraum, filter.zeitraum)
  );
}

function contains(value: string, search: string | undefined) {
  return !search || value.toLowerCase().includes(search.toLowerCase());
}

function checked(response: Response) {
  if (!response.ok) {
    throw new Error(`hütly API: ${response.status} ${response.url}`);
  }
  return response;
}
