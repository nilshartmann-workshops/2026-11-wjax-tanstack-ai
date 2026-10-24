import { useState } from "react";

import { ChatPanel } from "#/components/chat/ChatPanel";

/**
 * Der Assistent: geschlossen ein Knopf rechts unten, offen das Chat-Panel.
 *
 * Er hängt im Root-Layout und nicht auf einer eigenen Seite: Er bleibt beim
 * Navigieren stehen, und man sieht die Antwortliste daneben aktuell werden.
 */
export function ChatAssistant() {
  const [open, setOpen] = useState(true);

  if (open) {
    return <ChatPanel onClose={() => setOpen(false)} />;
  }

  return (
    <button
      type="button"
      className="chat-open-btn"
      onClick={() => setOpen(true)}
    >
      🐾 Assistent
    </button>
  );
}
