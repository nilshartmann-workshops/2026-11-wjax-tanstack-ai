import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";

import { getRepliesByPostIdQueryOptions } from "#/lib/api.ts";
import type { Reply } from "#/types.ts";

type RepliesListProps = {
  postId: string;
};

export function RepliesList({ postId }: RepliesListProps) {
  const { data: replies } = useSuspenseQuery(
    getRepliesByPostIdQueryOptions(postId),
  );
  // Der Assistent verlinkt seine Antwort mit deren Id als Hash. Ohne die
  // Hervorhebung landet man an der richtigen Stelle und sucht dann, welche der
  // ähnlichen Karten die neue ist.
  const linkedReplyId = useLocation({ select: (location) => location.hash });

  return (
    <div>
      <div className="replies-header">
        <h2 className="card-title">Antworten ({replies.length})</h2>
      </div>

      {replies.length === 0 ? (
        <div className="empty-replies">
          <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>Noch keine Antwort</p>
          <p style={{ fontSize: 14, color: "#6b5744", margin: 0 }}>
            Sei die erste Person, die sich meldet!
          </p>
        </div>
      ) : (
        <div className="replies-list">
          {replies.map((reply) => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              highlighted={reply.id === linkedReplyId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type ReplyCardProps = {
  reply: Reply;
  highlighted: boolean;
};

function ReplyCard({ reply, highlighted }: ReplyCardProps) {
  return (
    // Die Id ist die Sprungmarke: Der Assistent verlinkt nach dem
    // Veröffentlichen auf genau diese Antwort.
    <div
      className={twMerge("reply-card", highlighted && "reply-card-new")}
      id={reply.id}
    >
      <div className="reply-card-header">
        <div className="reply-author-row">
          <div className="reply-avatar">{reply.author[0].toUpperCase()}</div>
          <span className="reply-author-name">@{reply.author}</span>
        </div>
        <span className="reply-date">
          {new Date(reply.createdAt).toLocaleDateString("de-DE", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>
      <p className="reply-text">{reply.text}</p>
    </div>
  );
}
