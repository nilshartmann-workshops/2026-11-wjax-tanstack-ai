import { aiDevtoolsPlugin } from "@tanstack/react-ai-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { enableAiDevTools, enableQueryDevTools } from "#/demo-config.ts";

/**
 * Die Devtools von TanStack AI und TanStack Query. Beide Knöpfe liegen links
 * unten nebeneinander, rechts unten sitzt der Knopf des Assistenten.
 */
export function Devtools() {
  return (
    <>
      <AiDevtools />
      <QueryDevtools />
    </>
  );
}

/**
 * Die Devtools von TanStack AI: Nachrichten, Läufe, Tool-Aufrufe mit Ein- und
 * Ausgabe. Die Events von `chat()` kommen über den Event-Bus des Chat-Servers
 * (Port 4206), die des Browsers direkt von `useChat`.
 */
function AiDevtools() {
  if (!enableAiDevTools) {
    return null;
  }

  return (
    <TanStackDevtools
      plugins={[aiDevtoolsPlugin()]}
      config={{ triggerMode: "fixed", position: "bottom-left" }}
      eventBusConfig={{ connectToServerBus: true }}
    />
  );
}

/**
 * Die Devtools von TanStack Query. Ihr Knopf steht rechts neben dem von
 * TanStack AI, oder allein links unten, wenn die abgeschaltet sind.
 */
function QueryDevtools() {
  if (!enableQueryDevTools) {
    return null;
  }

  let className = "query-devtools-trigger";
  if (enableAiDevTools) {
    className += " query-devtools-trigger-next-to-ai";
  }

  return (
    <div className={className}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="relative" />
    </div>
  );
}
