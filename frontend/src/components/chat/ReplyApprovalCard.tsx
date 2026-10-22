import { useQuery } from "@tanstack/react-query";

import { getPostQueryOptions } from "#/lib/api.ts";

/// Der Nutzer, in dessen Namen veröffentlicht wird. Es gibt keine Anmeldung,
/// aber auf der Karte muss stehen, wessen Name unter der Antwort steht.
const CURRENT_USER = "nils";

type ReplyApprovalCardProps = {
  postId: string;
  text: string;
  disabled: boolean;
  onApprove: () => void;
  onReject: () => void;
  onCancel: () => void;
};

/// Fragt, ob eine Antwort veröffentlicht werden soll, die der Assistent
/// formuliert hat.
///
/// Die Karte zeigt den Vorschlag so, wie er später erscheint: dieser Text,
/// unter diesem Eintrag, unter diesem Namen. Ein Dialog nach dem Muster "Tool
/// createReply mit Argumenten {...} ausführen?" wird weggeklickt.
export function ReplyApprovalCard({
  postId,
  text,
  disabled,
  onApprove,
  onReject,
  onCancel,
}: ReplyApprovalCardProps) {
  return (
    <section className="chat-approval">
      <h3 className="chat-approval-title">Antwort veröffentlichen?</h3>

      <blockquote className="chat-approval-text">{text}</blockquote>

      <p className="chat-approval-meta">
        unter <ReplyTarget postId={postId} />, als @{CURRENT_USER}
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
        <button
          type="button"
          className="btn-cancel"
          disabled={disabled}
          onClick={onCancel}
        >
          Abbrechen
        </button>
      </div>
    </section>
  );
}

type ReplyTargetProps = { postId: string };

/// Nennt den Eintrag, unter dem die Antwort landet.
///
/// Der Titel kommt aus dem Query-Cache der Anwendung: Auf der Karte soll
/// stehen, was jetzt gilt.
function ReplyTarget({ postId }: ReplyTargetProps) {
  const { data: post } = useQuery(getPostQueryOptions(postId));

  if (!post) {
    return <em>{`Eintrag ${postId}`}</em>;
  }

  return (
    <em>
      {post.type} „{post.title}“
    </em>
  );
}
