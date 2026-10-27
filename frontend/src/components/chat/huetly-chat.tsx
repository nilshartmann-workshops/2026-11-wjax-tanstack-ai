import {
  angeboteSuchenToolDef,
  antwortSendenToolDef,
  gesucheSuchenToolDef,
  gesuchVorbereitenToolDef,
} from "@huetly/shared/tool-definitions";
import type { ToolApprovalInterrupt } from "@tanstack/ai-client";
import { fetchServerSentEvents } from "@tanstack/ai-react";
import { createChatHook, type ToolProps } from "@tanstack/ai-react/ui";

import { AntwortGesendetCard } from "#/components/chat/AntwortGesendetCard";
import { AssistantMessage } from "#/components/chat/AssistantMessage";
import { ChatAngebotCard } from "#/components/chat/ChatAngebotCard";
import { ChatGesuchCard } from "#/components/chat/ChatGesuchCard";
import { FreigabeCard } from "#/components/chat/FreigabeCard";
import { UserMessage } from "#/components/chat/UserMessage";
import Markdown from "#/components/Markdown";
import { router } from "#/router";

// 🕵️‍♂️ Zeigen: die Wirkung erscheint in der Anwendung, nicht im Chatfenster
// 🕵️‍♂️ Fallstrick: kein useNavigate, die Optionen stehen außerhalb jeder Komponente
const gesuchVorbereitenTool = gesuchVorbereitenToolDef.client((entwurf) => {
  void router.navigate({ to: "/gesuche/neu", search: entwurf });
  // 🕵️‍♂️ Erzählen: das Modell erfährt, dass noch nichts veröffentlicht ist
  return { result: "Formular geöffnet, der Nutzer veröffentlicht selbst" };
});

/**
 * Alles, was TanStack AI über den Chat von hütly wissen muss: die Verbindung
 * zum Chat-Server, die Tools und welche Komponente welchen Teil einer
 * Nachricht rendert. Die Oberfläche drumherum steht in `ChatPanel.tsx`.
 */
const chatOptions = {
  connection: fetchServerSentEvents("/api/chat"),
  // 🕵️‍♂️ Erzählen: nur die Definitionen, ausgeführt wird auf dem Server; sie typisieren part.output
  // 🕵️‍♂️ Erzählen: ein Client-Tool bringt seine Implementierung mit und läuft hier im Browser
  tools: [
    gesucheSuchenToolDef,
    angeboteSuchenToolDef,
    gesuchVorbereitenTool,
    antwortSendenToolDef,
  ],
};

export const { useAppChat, useChatContext } = createChatHook({
  options: chatOptions,
  components: {
    layout: ({ Messages, Interrupts }) => {
      return (
        <div className="chat-messages">
          <Messages />
          {/* 🕵️‍♂️ Fallstrick: ohne <Interrupts /> erscheint die Freigabe nirgends, auch ohne Fehler */}
          <Interrupts />
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
  // 🕵️‍♂️ Zeigen: je Tool eine Komponente, fehlt eine, meckert der Compiler
  toolsComponents: {
    gesucheSuchen: ({ part }) => {
      if (part.state !== "complete") {
        return <ToolLaeuft part={part} />;
      }

      // 🕵️‍♂️ Zeigen: aus dem Ergebnis kommt nur die Id, die Karte ist die der Pinnwand
      return (
        <div className="chat-cards">
          {part.output?.map((gesuch) => (
            <ChatGesuchCard key={gesuch.id} gesuchId={gesuch.id} />
          ))}
        </div>
      );
    },
    angeboteSuchen: ({ part }) => {
      if (part.state !== "complete") {
        return <ToolLaeuft part={part} />;
      }

      return (
        <div className="chat-cards">
          {part.output?.map((angebot) => (
            <ChatAngebotCard key={angebot.id} angebotId={angebot.id} />
          ))}
        </div>
      );
    },
    gesuchVorbereiten: ({ part }) => {
      if (part.state !== "complete") {
        return null;
      }

      return <p className="chat-note">📝 Formular geöffnet</p>;
    },
    antwortSenden: ({ part }) => {
      if (!part.output?.antwortId) {
        return null;
      }

      return (
        <AntwortGesendetCard
          eintragId={part.output.eintragId}
          antwortId={part.output.antwortId}
        />
      );
    },
  },
  interruptsComponents: {
    // 🕵️‍♂️ Zeigen: die Freigabe hängt am Tool, nicht an der Nachricht
    tools: {
      antwortSenden: AntwortFreigabe,
    },
    generic: {},
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
      onApprove={() => interrupt.resolveInterrupt(true)}
      onReject={() => interrupt.resolveInterrupt(false)}
    />
  );
}

type ToolLaeuftProps = ToolProps<typeof chatOptions>;

function ToolLaeuft({ part }: ToolLaeuftProps) {
  // 🕵️‍♂️ Erzählen: die Komponenten bekommen den Chat nicht als Prop, sondern aus dem Kontext
  const chat = useChatContext();

  // 🕵️‍♂️ Fallstrick: nach stop() bleibt der Part unfertig stehen, deshalb nur im laufenden Lauf
  if (!chat.isLoading) {
    return null;
  }

  // 🕵️‍♂️ Erzählen: ein ehrlicher Ladezustand statt eines Spinners
  return (
    <div className="chat-tool">
      <span className="chat-tool-label">
        ⏳ {part.name} ({part.state})
      </span>
      <code className="chat-tool-args">{part.arguments}</code>
    </div>
  );
}
