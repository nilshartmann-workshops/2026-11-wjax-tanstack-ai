import type { MiddlewareHandler } from "hono";

/**
 * Demo-Hilfe: verlangsamt die Antworten des Assistenten, damit Streaming und
 * Ladezustand auf dem Beamer zu sehen sind. Eingeschaltet wird sie im
 * Frontend mit `slowResponseMs` in `demo-config.ts`. Der Vite-Proxy schickt
 * den Wert als Header `x-huetly-slow` mit.
 *
 * Sie sitzt vor der Route und verzögert die fertigen SSE-Events. Deshalb
 * wirkt sie, ganz gleich, wie `chat()` in der Route aufgerufen wird:
 *
 * - vor jedem Stück Text oder Denktext eine Pause von `ms`
 * - nach den Argumenten eines Tool-Aufrufs eine Pause von 25 × `ms`
 */
export const slowDown: MiddlewareHandler = async (c, next) => {
  const ms = Number(c.req.header("x-huetly-slow") ?? 0);
  await next();
  if (!(ms > 0) || c.res.body === null) {
    return;
  }
  c.res = new Response(c.res.body.pipeThrough(delayEvents(ms)), c.res);
};

function delayEvents(ms: number) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new TransformStream<Uint8Array, Uint8Array>({
    async transform(bytes, controller) {
      buffer += decoder.decode(bytes, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const event of events) {
        const type = eventType(event);
        if (
          type === "TEXT_MESSAGE_CONTENT" ||
          type === "REASONING_MESSAGE_CONTENT"
        ) {
          await sleep(ms);
        }
        controller.enqueue(encoder.encode(event + "\n\n"));
        if (type === "TOOL_CALL_END") {
          await sleep(25 * ms);
        }
      }
    },
    flush(controller) {
      if (buffer !== "") {
        controller.enqueue(encoder.encode(buffer));
      }
    },
  });
}

function eventType(event: string) {
  const data = event
    .split("\n")
    .find((line) => line.startsWith("data:"))
    ?.slice("data:".length);
  try {
    return data === undefined ? undefined : JSON.parse(data).type;
  } catch {
    return undefined;
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
