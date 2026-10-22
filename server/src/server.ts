import { serve } from "@hono/node-server";
import { Hono } from "hono";

/// Der Chat-Server von hütly. Hier läuft der Assistent: Er spricht mit dem
/// Modell und ruft über die Fassade in `huetly-api.ts` den API-Server auf.
///
/// Er startet bei jeder Änderung neu. Die Daten liegen im API-Server und
/// überstehen das.
const app = new Hono();

// todo: POST /api/chat

const port = 63081;

serve({ fetch: app.fetch, port }, () => {
  console.log(`hütly Chat-Server läuft auf http://localhost:${port}`);
});
