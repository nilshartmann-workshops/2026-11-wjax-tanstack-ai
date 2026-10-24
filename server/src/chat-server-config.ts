import { createChatOptions } from "@tanstack/ai";

import { logEvents } from "./log-events.ts";
import { chatAdapter } from "./model.ts";
import { SYSTEM_PROMPT } from "./system-prompt.ts";

/**
 * Was den Assistenten von hütly ausmacht. Die Route in `chat-server.ts`
 * übergibt das an `chat()`, zusammen mit dem, was der Browser schickt.
 */
export const chatOptions = createChatOptions({
  adapter: chatAdapter,
  systemPrompts: [SYSTEM_PROMPT],
  // Schreibt jeden AG-UI-Event ins Terminal
  middleware: logEvents,
});
