import { type Request, type Response, Router } from "express";

import {
  type Angebot,
  angebote,
  type Antwort,
  antworten,
  type Gesuch,
  gesuche,
  nextAntwortId,
  nextGesuchId,
  type Tierart,
  TIERARTEN,
} from "./data.ts";

/**
 * Die REST-API von hütly. Sie existiert vor dem Assistenten und bleibt von
 * ihm unberührt.
 */
const router = Router();

router.get("/gesuche", (req: Request, res: Response) => {
  const tierart = req.query.tierart as string | undefined;
  if (tierart !== undefined && !isTierart(tierart)) {
    badRequest(res, `Unbekannte Tierart: '${tierart}'`);
    return;
  }

  const result = gesuche
    .filter((gesuch) => tierart === undefined || gesuch.tierart === tierart)
    .sort(byNewest);

  res.json(result);
});

router.post("/gesuche", (req: Request, res: Response) => {
  const { tierart } = req.body ?? {};
  const fields = [
    "titel",
    "autor",
    "beschreibung",
    "tier",
    "zeitraum",
    "ort",
  ] as const;

  const missing = fields.find((field) => isBlank(req.body?.[field]));
  if (missing) {
    badRequest(res, `${missing} ist ein Pflichtfeld`);
    return;
  }
  if (!isTierart(tierart)) {
    badRequest(res, "tierart ist ein Pflichtfeld");
    return;
  }

  const gesuch: Gesuch = {
    id: nextGesuchId(),
    titel: String(req.body.titel).trim(),
    autor: String(req.body.autor).trim(),
    beschreibung: String(req.body.beschreibung).trim(),
    tier: String(req.body.tier).trim(),
    tierart,
    zeitraum: String(req.body.zeitraum).trim(),
    ort: String(req.body.ort).trim(),
    erstelltAm: new Date().toISOString(),
  };

  gesuche.unshift(gesuch);
  res.status(201).json(gesuch);
});

router.get("/gesuche/:id", (req: Request, res: Response) => {
  const gesuch = gesuche.find((gesuch) => gesuch.id === req.params.id);
  if (!gesuch) {
    notFound(res);
    return;
  }
  res.json(gesuch);
});

router.get("/angebote", (req: Request, res: Response) => {
  const tierart = req.query.tierart as string | undefined;
  if (tierart !== undefined && !isTierart(tierart)) {
    badRequest(res, `Unbekannte Tierart: '${tierart}'`);
    return;
  }

  const result = angebote
    .filter(
      (angebot) =>
        tierart === undefined || angebot.erfahrungMit.includes(tierart),
    )
    .sort(byNewest);

  res.json(result);
});

router.get("/angebote/:id", (req: Request, res: Response) => {
  const angebot = angebote.find((angebot) => angebot.id === req.params.id);
  if (!angebot) {
    notFound(res);
    return;
  }
  res.json(angebot);
});

/**
 * Art und Titel eines Eintrags, ohne dass der Aufrufer wissen muss, ob es ein
 * Gesuch oder ein Angebot ist. Gebraucht wird das, wo nur eine Id vorliegt,
 * etwa unter einer Antwort.
 */
router.get("/eintraege/:id", (req: Request, res: Response) => {
  const eintrag = findEintrag(req.params.id);
  if (!eintrag) {
    notFound(res);
    return;
  }
  res.json(eintrag);
});

router.get("/antworten", (req: Request, res: Response) => {
  const eintragId = req.query.eintragId;
  if (!findEintrag(eintragId)) {
    notFound(res);
    return;
  }

  const result = antworten
    .filter((antwort) => antwort.eintragId === eintragId)
    .sort(byNewest);

  res.json(result);
});

router.post("/antworten", (req: Request, res: Response) => {
  const { eintragId, autor, text } = req.body ?? {};
  if (!findEintrag(eintragId)) {
    notFound(res);
    return;
  }
  if (isBlank(autor)) {
    badRequest(res, "autor ist ein Pflichtfeld");
    return;
  }
  if (isBlank(text)) {
    badRequest(res, "text ist ein Pflichtfeld");
    return;
  }

  const antwort: Antwort = {
    id: nextAntwortId(),
    eintragId: String(eintragId),
    autor: String(autor).trim(),
    text: String(text).trim(),
    erstelltAm: new Date().toISOString(),
  };

  antworten.push(antwort);
  res.status(201).json(antwort);
});

/** Das MailWidget im Kopf der Seite schickt hier hin. Es passiert nichts. */
router.post("/newsletter", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

export default router;

function findEintrag(id: unknown) {
  const gesuch: Gesuch | undefined = gesuche.find((gesuch) => gesuch.id === id);
  if (gesuch) {
    return { art: "Gesuch", id: gesuch.id, titel: gesuch.titel };
  }
  const angebot: Angebot | undefined = angebote.find(
    (angebot) => angebot.id === id,
  );
  if (angebot) {
    return { art: "Angebot", id: angebot.id, titel: angebot.titel };
  }
  return undefined;
}

function isTierart(value: unknown): value is Tierart {
  return TIERARTEN.includes(value as Tierart);
}

function isBlank(value: unknown) {
  return value === undefined || value === null || String(value).trim() === "";
}

function byNewest(a: { erstelltAm: string }, b: { erstelltAm: string }) {
  return b.erstelltAm.localeCompare(a.erstelltAm);
}

function badRequest(res: Response, error: string) {
  res.status(400).json({ error });
}

function notFound(res: Response) {
  res.status(404).json({ error: "Nicht gefunden" });
}
