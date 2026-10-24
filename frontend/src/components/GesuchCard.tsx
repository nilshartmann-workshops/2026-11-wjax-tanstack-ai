import { Link } from "@tanstack/react-router";

import {
  formatDate,
  MetaRow,
  TITLE_LINK_CLASS,
} from "#/components/card-parts.tsx";
import { TierartBadge } from "#/components/TierartBadge";
import { getTierartConfig } from "#/config/tierart-config.ts";
import type { Gesuch } from "#/types.ts";

type GesuchCardProps = {
  gesuch: Gesuch;
};

export function GesuchCard({ gesuch }: GesuchCardProps) {
  const cat = getTierartConfig(gesuch.tierart);

  return (
    <article
      className="post-card"
      style={{ "--cat-color": cat.color } as React.CSSProperties}
    >
      <div className="post-card-header">
        <TierartBadge tierart={gesuch.tierart} />
        <span className="post-card-date">{formatDate(gesuch.erstelltAm)}</span>
      </div>

      <h3 className="post-card-title">
        <Link
          preload="intent"
          to="/gesuche/$gesuchId"
          params={{ gesuchId: gesuch.id }}
          className={TITLE_LINK_CLASS}
        >
          {gesuch.titel}
        </Link>
      </h3>

      <div className="post-card-meta">
        <MetaRow icon="📍" text={gesuch.ort} />
        <MetaRow icon="⏱️" text={gesuch.zeitraum} />
        <MetaRow icon="🐾" text={gesuch.tier} />
      </div>

      <div
        className="post-card-footer"
        style={{ borderColor: `${cat.color}80` }}
      >
        <span className="post-card-author">von @{gesuch.autor}</span>
      </div>
    </article>
  );
}
