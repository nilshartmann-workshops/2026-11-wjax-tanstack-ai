import type { antwortSendenToolDef } from "@huetly/shared/tool-definitions";
import type { ToolApprovalInterrupt } from "@tanstack/ai-client";
import { fetchServerSentEvents } from "@tanstack/ai-react";
import { createChatHook } from "@tanstack/ai-react/ui";

import { AssistantMessage } from "#/components/chat/AssistantMessage";
import { FreigabeCard } from "#/components/chat/FreigabeCard";
import { UserMessage } from "#/components/chat/UserMessage";
import Markdown from "#/components/Markdown";

/**
 * Alles, was TanStack AI über den Chat von hütly wissen muss: die Verbindung
 * zum Chat-Server, die Tools und welche Komponente welchen Teil einer
 * Nachricht rendert. Die Oberfläche drumherum steht in `ChatPanel.tsx`.
 */
const chatOptions = {
  connection: fetchServerSentEvents("/api/chat"),
};

export const { useAppChat } = createChatHook({
  options: chatOptions,
  components: {
    layout: ({ Messages }) => {
      return (
        <div className="chat-messages">
          <Messages />
        </div>
      );
    },
    message: ({ message, Parts }) => {
      // 🕵️‍♂️ Erzählen: die Chat-Route im Server, sie liefert AG-UI-Events als Server-Sent Events
      console.log("Message", message);

      if (message.role === "user") {
        return (
          <UserMessage>
            <Parts />
          </UserMessage>
        );
      }

      return (
        <AssistantMessage>
          <Parts />
        </AssistantMessage>
      );
    },
  },
  partsComponents: {
    // 🕵️‍♂️ Zeigen: eine Nachricht ist kein String, sondern eine Liste von parts, je Art eine Komponente
    text: ({ part }) => {
      console.log("Part", part);
      return <Markdown className="chat-text" content={part.content} />;
    },
    thinking: ({ part }) => {
      if (part.content === "") {
        return null;
      }

      // 🕵️‍♂️ Erzählen: Claude schickt eine Zusammenfassung der Gedanken, in Schüben und vor der Antwort
      return (
        <details className="chat-thinking" open>
          <summary>Gedanken des Assistenten</summary>
          {part.content}
        </details>
      );
    },
    fallback: ({ part }) => {
      return <p className="chat-note">Unbekannter Part: {part.type}</p>;
    },
  },
});

type AntwortFreigabeProps = {
  interrupt: ToolApprovalInterrupt<typeof antwortSendenToolDef>;
};

function AntwortFreigabe({ interrupt }: AntwortFreigabeProps) {
  return (
    <FreigabeCard
      eintragId={interrupt.originalArgs.eintragId}
      text={interrupt.originalArgs.text}
      disabled={interrupt.status === "submitting"}
      // todo: Veröffentlichen und Ablehnen
    />
  );
}
