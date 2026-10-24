import { History } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

/** Unter diesem Schlüssel stehen die zuletzt gesendeten Prompts im Browser. */
const HISTORY_KEY = "huetly-chat-historie";

/** So viele Prompts merkt sich die Historie. */
const HISTORY_SIZE = 20;

/** So hoch wird das Textfeld höchstens, danach scrollt es. */
const MAX_HEIGHT_PX = 240;

type ChatEingabeProps = {
  onSend: (text: string) => void;
};

/**
 * Die Eingabe des Assistenten: ein Textfeld, das mit dem Text wächst, und
 * eine Historie der zuletzt gesendeten Prompts.
 *
 * Enter schickt ab, Shift+Enter beginnt eine neue Zeile. Das Textfeld lässt
 * sich auch von Hand größer ziehen, automatisch wächst es nur, wenn der Text
 * nicht mehr hineinpasst. Die Historie liegt im
 * `localStorage` und überlebt ein Neuladen der Seite. Ein Klick auf einen
 * Eintrag setzt den Prompt nur ins Textfeld, abgeschickt wird er erst mit
 * „Senden“.
 */
export function ChatEingabe({ onSend }: ChatEingabeProps) {
  const [draft, setDraft] = useState("");
  const [history, setHistory] = useState(readHistory);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const grownRef = useRef(false);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    // Nach dem Senden schrumpft ein automatisch gewachsenes Feld zurück
    if (draft === "" && grownRef.current) {
      textarea.style.height = "";
      grownRef.current = false;
      return;
    }

    // scrollHeight zählt den Rahmen nicht mit, die Höhe des Felds schon
    const border = textarea.offsetHeight - textarea.clientHeight;
    const needed = textarea.scrollHeight + border;
    if (needed <= textarea.offsetHeight) {
      return;
    }
    textarea.style.height = `${Math.min(needed, MAX_HEIGHT_PX)}px`;
    grownRef.current = true;
  }, [draft]);

  function send(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (text === "") {
      return;
    }

    onSend(text);
    setDraft("");

    const newHistory = [text, ...history.filter((h) => h !== text)].slice(
      0,
      HISTORY_SIZE,
    );
    setHistory(newHistory);
    writeHistory(newHistory);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  }

  function choose(text: string) {
    setDraft(text);
    dialogRef.current?.close();
    textareaRef.current?.focus();
  }

  return (
    <form className="chat-form" onSubmit={send}>
      <textarea
        ref={textareaRef}
        className="form-input chat-input"
        rows={2}
        placeholder="Was suchst du?"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="chat-form-actions">
        <button
          type="button"
          className="chat-history-btn"
          onClick={() => dialogRef.current?.showModal()}
        >
          <History size={14} />
          Zuletzt gesendet
        </button>
        <button type="submit" className="btn-reply-submit">
          Senden
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="chat-history"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
      >
        <header className="chat-history-header">
          <span className="chat-panel-title">Zuletzt gesendet</span>
          <button
            type="button"
            className="chat-panel-btn"
            onClick={() => dialogRef.current?.close()}
          >
            Schließen
          </button>
        </header>
        <HistoryList history={history} onChoose={choose} />
      </dialog>
    </form>
  );
}

type HistoryListProps = {
  history: Array<string>;
  onChoose: (text: string) => void;
};

/** Die Prompts der Historie, jeder vollständig und mit seinen Zeilenumbrüchen. */
function HistoryList({ history, onChoose }: HistoryListProps) {
  if (history.length === 0) {
    return <p className="chat-note">Noch nichts gesendet.</p>;
  }

  return (
    <ul className="chat-history-list">
      {history.map((text) => (
        <li key={text}>
          <button
            type="button"
            className="chat-history-entry"
            onClick={() => onChoose(text)}
          >
            {text}
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * Liest die Historie. Der Zugriff auf `localStorage` kann scheitern, etwa in
 * einem privaten Fenster, dann beginnt die Historie leer.
 */
function readHistory(): Array<string> {
  try {
    const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
    if (!Array.isArray(stored)) {
      return [];
    }
    return stored.filter((entry) => typeof entry === "string");
  } catch {
    return [];
  }
}

/** Schreibt die Historie. Scheitert das, geht nur die Historie verloren. */
function writeHistory(history: Array<string>) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // die Historie ist eine Bequemlichkeit, der Chat funktioniert auch ohne
  }
}
