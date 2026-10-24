import { useQuery } from "@tanstack/react-query";

import { eintragQueryOptions } from "#/lib/api.ts";

/**
 * Der Nutzer, in dessen Namen veröffentlicht wird. Es gibt keine Anmeldung,
 * aber auf der Karte muss stehen, wessen Name unter der Antwort steht.
 */
const CURRENT_USER = "nils";

type FreigabeCardProps = {
  eintragId: string;
  text: string;
  disabled: boolean;
  onApprove?: () => void;
  onReject?: () => void;
};

/**
 * Fragt, ob eine Antwort veröffentlicht werden soll, die der Assistent
 * formuliert hat.
 *
 * Die Karte zeigt den Vorschlag so, wie er später erscheint: dieser Text,
 * unter diesem Eintrag, unter diesem Namen. Ein Dialog nach dem Muster "Tool
 * antwortSenden mit Argumenten {...} ausführen?" wird weggeklickt.
 */
export function FreigabeCard({
  eintragId,
  text,
  disabled,
  onApprove,
  onReject,
}: FreigabeCardProps) {
  return (
    <section className="chat-approval">
      <h3 className="chat-approval-title">Antwort veröffentlichen?</h3>

      <blockquote className="chat-approval-text">{text}</blockquote>

      <p className="chat-approval-meta">
        unter <EintragTitel eintragId={eintragId} />, als @{CURRENT_USER}
      </p>

      <div className="chat-approval-actions">
        <button
          type="button"
          className="btn-reply-submit"
          disabled={disabled}
          onClick={onApprove}
        >
          Veröffentlichen
        </button>
        <button
          type="button"
          className="btn-cancel"
          disabled={disabled}
          onClick={onReject}
        >
          Ablehnen
        </button>
      </div>
    </section>
  );
}

type EintragTitelProps = { eintragId: string };

/**
 * Nennt den Eintrag, unter dem die Antwort landet.
 *
 * Der Titel kommt aus dem Query-Cache der Anwendung: Auf der Karte soll
 * stehen, was jetzt gilt.
 */
function EintragTitel({ eintragId }: EintragTitelProps) {
  const { data: eintrag } = useQuery(eintragQueryOptions(eintragId));

  if (!eintrag) {
    return <em>{`Eintrag ${eintragId}`}</em>;
  }

  return (
    <em>
      {eintrag.art} „{eintrag.titel}“
    </em>
  );
}
