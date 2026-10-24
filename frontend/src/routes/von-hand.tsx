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

/**
 * Der Hook schickt die Nachrichten an `/api/chat` und setzt die gestreamten
 * AG-UI-Events selbst zu Textnachrichten zusammen, ganz ohne TanStack AI im
 * Browser.
 */
function useHandmadeChat() {
  // todo: fetch an /api/chat, den Stream lesen, die Events zu Nachrichten zusammensetzen
  const messages: Array<TextMessage> = [];
  const isLoading = false;

  async function sendMessage(text: string) {}

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
