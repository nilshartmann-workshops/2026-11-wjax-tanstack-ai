import { serve } from "@hono/node-server";
import {
  chat,
  chatParamsFromRequestBody,
  toServerSentEventsResponse,
} from "@tanstack/ai";
import { ServerEventBus } from "@tanstack/devtools-event-bus/server";
import { Hono } from "hono";

import { chatOptions } from "./chat-server-config.ts";
import { modelName } from "./model.ts";
import { slowDown } from "./slow-down.ts";

/**
 * Der Chat-Server von hütly. Hier läuft der Assistent: Er spricht mit dem
 * Modell und ruft über die Fassade in `huetly-api.ts` den API-Server auf.
 *
 * Er startet bei jeder Änderung neu. Die Daten liegen im API-Server und
 * überstehen das.
 */
const app = new Hono();

// Demo-Hilfe, siehe slow-down.ts. Ohne den Header x-huetly-slow tut sie nichts.
app.use("/api/chat", slowDown);

app.post("/api/chat", async (c) => {
  // 🕵️‍♂️ Erzählen: der Body ist ein AG-UI-RunAgentInput, nichts TanStack-Eigenes
  const params = await chatParamsFromRequestBody(await c.req.json());

  // 🕵️‍♂️ Erzählen: chat() liefert einen Strom von AG-UI-Events
  const stream = chat({
    ...chatOptions,
    messages: params.messages,
    // 🕵️‍♂️ Erzählen: die threadId benennt das Gespräch, chat() verlangt sie
    threadId: params.threadId,
    // 🕵️‍♂️ Fallstrick: ohne diese drei geht ein unterbrochener Lauf nicht weiter, und es gibt keinen Fehler
    runId: params.runId,
    parentRunId: params.parentRunId,
    resume: params.resume,
  });

  return toServerSentEventsResponse(stream);
});

const port = 26081;

serve({ fetch: app.fetch, port }, () => {
  console.log(
    `hütly Chat-Server läuft auf http://localhost:${port} mit ${modelName}`,
  );
});

// Über diesen Bus holen sich die Devtools im Browser die Events von chat().
await new ServerEventBus().start();
