import { useState } from "react";

type ChatPanelProps = {
  onClose: () => void;
};

/// Das Panel des Assistenten: Kopfzeile, Nachrichtenliste und Eingabe.
///
/// Es zeigt noch keine Nachrichten und schickt nichts ab. Beides kommt mit
/// TanStack AI dazu.
export function ChatPanel({ onClose }: ChatPanelProps) {
  const [draft, setDraft] = useState("");

  function send(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (text === "") {
      return;
    }

    // todo: Nachricht an den Assistenten schicken
    setDraft("");
  }

  return (
    <aside className="chat-panel">
      <header className="chat-panel-header">
        <span className="chat-panel-title">🐾 hütly-Assistent</span>
        <div className="chat-panel-tools">
          <button type="button" className="chat-panel-btn" onClick={onClose}>
            Schließen
          </button>
        </div>
      </header>

      <div className="chat-scroll">
        <p className="chat-note">
          Frag mich nach Gesuchen und Angeboten, oder lass mich auf eins
          antworten.
        </p>

        {/* todo: Nachrichten */}
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
    </aside>
  );
}
