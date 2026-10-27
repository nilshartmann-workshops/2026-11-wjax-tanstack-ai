import { ChatEingabe } from "#/components/chat/ChatEingabe";
import { useAppChat } from "#/components/chat/huetly-chat";

type ChatPanelProps = {
  onClose: () => void;
};

/** Das Panel des Assistenten: Kopfzeile, Nachrichtenliste und Eingabe. */
export function ChatPanel({ onClose }: ChatPanelProps) {
  // 🕵️‍♂️ Erzählen: unter der Haube useChat, es setzt die AG-UI-Events zu Nachrichten zusammen
  // 🕵️‍♂️ Erzählen: eine feste threadId für das eine Gespräch im Panel
  const chat = useAppChat({ threadId: "huetly-assistent" });

  function send(text: string) {
    void chat.sendMessage(text);
  }

  return (
    <aside className="chat-panel">
      <header className="chat-panel-header">
        <span className="chat-panel-title">🐾 hütly-Assistent</span>
        <div className="chat-panel-tools">
          {chat.isLoading && (
            // 🕵️‍♂️ Erzählen: stop() bricht den Stream ab, der Text bis hierher bleibt stehen
            <button
              type="button"
              className="chat-panel-btn"
              onClick={chat.stop}
            >
              Stopp
            </button>
          )}
          {chat.messages.length > 0 && (
            // 🕵️‍♂️ Erzählen: clear() leert das Gespräch und bricht einen laufenden Stream ab
            <button
              type="button"
              className="chat-panel-btn"
              onClick={chat.clear}
            >
              Neues Gespräch
            </button>
          )}
          <button type="button" className="chat-panel-btn" onClick={onClose}>
            Schließen
          </button>
        </div>
      </header>

      <ChatEingabe onSend={send} />

      <div className="chat-scroll">
        <p className="chat-note">
          Frag mich nach Gesuchen und Angeboten, oder lass mich auf eins
          antworten.
        </p>

        <chat.AppChat />
      </div>
    </aside>
  );
}
