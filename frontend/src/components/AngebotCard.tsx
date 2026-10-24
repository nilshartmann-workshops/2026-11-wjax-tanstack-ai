import { Link } from "@tanstack/react-router";

import {
  formatDate,
  MetaRow,
  TITLE_LINK_CLASS,
} from "#/components/card-parts.tsx";
import { TierartBadge } from "#/components/TierartBadge";
import { getTierartConfig } from "#/config/tierart-config.ts";
import type { Angebot } from "#/types.ts";

type AngebotCardProps = {
  angebot: Angebot;
};

export function AngebotCard({ angebot }: AngebotCardProps) {
  // Die Farbe der Karte kommt von der ersten Tierart.
  const cat = getTierartConfig(angebot.erfahrungMit[0]);

  return (
    <article
      className="post-card"
      style={{ "--cat-color": cat.color } as React.CSSProperties}
    >
      <div className="post-card-header">
        <div className="flex flex-wrap gap-1">
          {angebot.erfahrungMit.map((tierart) => (
            <TierartBadge key={tierart} tierart={tierart} />
          ))}
        </div>
        <span className="post-card-date">{formatDate(angebot.erstelltAm)}</span>
      </div>

      <h3 className="post-card-title">
        <Link
          preload="intent"
          to="/angebote/$angebotId"
          params={{ angebotId: angebot.id }}
          className={TITLE_LINK_CLASS}
        >
          {angebot.titel}
        </Link>
      </h3>

      <div className="post-card-meta">
        <MetaRow icon="📍" text={angebot.ort} />
        <MetaRow icon="⏱️" text={angebot.zeitraum} />
      </div>

      <div
        className="post-card-footer"
        style={{ borderColor: `${cat.color}80` }}
      >
        <span className="post-card-author">von @{angebot.autor}</span>
      </div>
    </article>
  );
}
