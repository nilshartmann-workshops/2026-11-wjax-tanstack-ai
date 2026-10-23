import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import Markdown from "#/components/Markdown";

/**
 * Eine eigene Seite für den Chat von Hand. Sie hat mit dem Panel des
 * Assistenten nichts zu tun und zeigt nur Text.
 */
export const Route = createFileRoute("/von-hand")({
  component: HandmadeChatPage,
});

type TextMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type AgUiEvent = {
  type: string;
  messageId?: string;
  delta?: string;
};

/**
 * Der Hook schickt die Nachrichten an `/api/chat` und setzt die gestreamten
 * AG-UI-Events selbst zu Textnachrichten zusammen, ganz ohne TanStack AI im
 * Browser.
 */
function useHandmadeChat() {
  // 🕵️‍♂️ Erzählen: was useChat für uns erledigt, hier von Hand und nur für Text
  const [messages, setMessages] = useState<Array<TextMessage>>([]);
  const [isLoading, setIsLoading] = useState(false);

  function handleEvent(event: AgUiEvent) {
    if (event.type === "TEXT_MESSAGE_START") {
      const message: TextMessage = {
        id: event.messageId ?? crypto.randomUUID(),
        role: "assistant",
        content: "",
      };
      setMessages((current) => [...current, message]);
    }
    if (event.type === "TEXT_MESSAGE_CONTENT") {
      setMessages((current) =>
        current.map((message) =>
          message.id === event.messageId
            ? { ...message, content: message.content + event.delta }
            : message,
        ),
      );
    }
    // 🕵️‍♂️ Fallstrick: Tool-Calls, Denken, Unterbrechungen und Abbrechen fehlen hier ganz
  }

  async function sendMessage(text: string) {
    const userMessage: TextMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    const history = [...messages, userMessage];
    setMessages(history);
    setIsLoading(true);

    // 🕵️‍♂️ Erzählen: derselbe AG-UI-RunAgentInput wie im curl-Aufruf
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        threadId: "von-hand",
        runId: crypto.randomUUID(),
        messages: history,
        tools: [],
        context: [],
        state: {},
        forwardedProps: {},
      }),
    });

    // 🕵️‍♂️ Zeigen: Bytes lesen, an Leerzeilen trennen, die data:-Zeilen parsen
    const reader = response
      .body!.pipeThrough(new TextDecoderStream())
      .getReader();
    let buffer = "";
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) {
        break;
      }
      buffer += chunk.value;
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";
      for (const event of events) {
        if (event.startsWith("data: ")) {
          handleEvent(JSON.parse(event.slice("data: ".length)));
        }
      }
    }
    setIsLoading(false);
  }

  return { messages, isLoading, sendMessage };
}

function HandmadeChatPage() {
  const [draft, setDraft] = useState("");
  const chat = useHandmadeChat();

  function send(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.trim() === "") {
      return;
    }
    void chat.sendMessage(draft.trim());
    setDraft("");
  }

  return (
    <div
      className="page-wrapper-sm"
      style={{ paddingTop: 40, paddingBottom: 40 }}
    >
      <h1 className="page-title">Chat von Hand</h1>

      <div className="chat-turn">
        {chat.messages.map((message) =>
          message.role === "user" ? (
            <p key={message.id} className="chat-user">
              {message.content}
            </p>
          ) : (
            <Markdown
              key={message.id}
              className="chat-text"
              content={message.content}
            />
          ),
        )}
        {chat.isLoading && <p className="chat-note">…</p>}
      </div>

      <form className="chat-form" onSubmit={send}>
        <input
          className="form-input"
          placeholder="Was suchst du?"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit" className="btn-reply-submit">
          Senden
        </button>
      </form>
    </div>
  );
}
