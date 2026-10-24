import { formatDate, InfoGridItem } from "#/components/card-parts.tsx";
import Markdown from "#/components/Markdown.tsx";
import { TierartBadge } from "#/components/TierartBadge";
import { getTierartConfig } from "#/config/tierart-config.ts";
import type { Gesuch } from "#/types.ts";

type GesuchDetailCardProps = {
  gesuch: Gesuch;
};

export function GesuchDetailCard({ gesuch }: GesuchDetailCardProps) {
  const cat = getTierartConfig(gesuch.tierart);

  return (
    <div className="post-detail-card" style={{ borderColor: `${cat.color}60` }}>
      <div className="post-detail-header" style={{ background: cat.soft }}>
        <div className="post-detail-header-row">
          <TierartBadge tierart={gesuch.tierart} size="lg" />
          <span style={{ fontSize: 13, color: cat.text, fontWeight: 500 }}>
            {formatDate(gesuch.erstelltAm)}
          </span>
        </div>
        <h1 className="post-detail-title">{gesuch.titel}</h1>
        <p className="post-detail-author">von @{gesuch.autor}</p>
      </div>

      <div className="post-detail-body">
        <Markdown
          className="post-description prose"
          content={gesuch.beschreibung}
        />

        <div className="info-grid">
          <InfoGridItem icon="📍" label="Ort" value={gesuch.ort} />
          <InfoGridItem icon="⏱️" label="Zeitraum" value={gesuch.zeitraum} />
          <InfoGridItem icon="🐾" label="Tier/Pflanze" value={gesuch.tier} />
        </div>
      </div>
    </div>
  );
}
