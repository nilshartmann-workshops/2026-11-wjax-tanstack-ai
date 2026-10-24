import type { antwortSendenToolDef } from "@huetly/shared/tool-definitions";
import type { ToolApprovalInterrupt } from "@tanstack/ai-client";
import { fetchServerSentEvents } from "@tanstack/ai-react";
import { createChatHook } from "@tanstack/ai-react/ui";

import { FreigabeCard } from "#/components/chat/FreigabeCard";

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
    message: ({ Parts }) => {
      // todo: Blase für Nutzer, ChatTurn für Assistent
      return <Parts />;
    },
  },
  partsComponents: {
    // todo: Text
    thinking: () => {
      // todo: Denktext
      return null;
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
