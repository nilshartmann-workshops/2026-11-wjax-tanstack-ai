import type { ChatMiddleware } from "@tanstack/ai";

/**
 * Schreibt jeden AG-UI-Event, den chat() erzeugt, ins Terminal. So sieht man,
 * was auf dem Draht zum Browser läuft.
 */
export const logEvents: Array<ChatMiddleware> = [
  {
    onChunk(ctx, chunk) {
      console.log(
        chunk.type,
        "toolCallName" in chunk ? chunk.toolCallName : "",
        "delta" in chunk ? chunk.delta : "",
        "outcome" in chunk ? chunk.outcome : "",
      );
    },
  },
];
