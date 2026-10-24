import { ChatEingabe } from "#/components/chat/ChatEingabe";

type ChatPanelProps = {
  onClose: () => void;
};

/** Das Panel des Assistenten: Kopfzeile, Nachrichtenliste und Eingabe. */
export function ChatPanel({ onClose }: ChatPanelProps) {
  // todo: Chat aus huetly-chat.tsx holen

  function send(text: string) {
    // todo: Nachricht an den Assistenten schicken
  }

  return (
    <aside className="chat-panel">
      <header className="chat-panel-header">
        <span className="chat-panel-title">🐾 hütly-Assistent</span>
        <div className="chat-panel-tools">
          {/* todo: Stopp */}
          {/* todo: Neues Gespräch */}
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

        {/* todo: Nachrichten */}
      </div>
    </aside>
  );
}
