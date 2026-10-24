import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";

import { antwortenQueryOptions } from "#/lib/api.ts";
import type { Antwort } from "#/types.ts";

type AntwortListProps = {
  eintragId: string;
};

export function AntwortList({ eintragId }: AntwortListProps) {
  const { data: antworten } = useSuspenseQuery(
    antwortenQueryOptions(eintragId),
  );
  // Der Assistent verlinkt seine Antwort mit deren Id als Hash. Ohne die
  // Hervorhebung landet man an der richtigen Stelle und sucht dann, welche der
  // ähnlichen Karten die neue ist.
  const linkedAntwortId = useLocation({ select: (location) => location.hash });

  return (
    <div>
      <div className="antworten-header">
        <h2 className="card-title">Antworten ({antworten.length})</h2>
      </div>

      {antworten.length === 0 ? (
        <div className="empty-antworten">
          <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>Noch keine Antwort</p>
          <p style={{ fontSize: 14, color: "#6b5744", margin: 0 }}>
            Sei die erste Person, die sich meldet!
          </p>
        </div>
      ) : (
        <div className="antworten-list">
          {antworten.map((antwort) => (
            <AntwortCard
              key={antwort.id}
              antwort={antwort}
              highlighted={antwort.id === linkedAntwortId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type AntwortCardProps = {
  antwort: Antwort;
  highlighted: boolean;
};

function AntwortCard({ antwort, highlighted }: AntwortCardProps) {
  return (
    // Die Id ist die Sprungmarke: Der Assistent verlinkt nach dem
    // Veröffentlichen auf genau diese Antwort.
    <div
      className={twMerge("reply-card", highlighted && "reply-card-new")}
      id={antwort.id}
    >
      <div className="reply-card-header">
        <div className="reply-author-row">
          <div className="reply-avatar">{antwort.autor[0].toUpperCase()}</div>
          <span className="reply-author-name">@{antwort.autor}</span>
        </div>
        <span className="reply-date">
          {new Date(antwort.erstelltAm).toLocaleDateString("de-DE", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>
      <p className="reply-text">{antwort.text}</p>
    </div>
  );
}
