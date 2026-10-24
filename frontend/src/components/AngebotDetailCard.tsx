import { formatDate, InfoGridItem } from "#/components/card-parts.tsx";
import Markdown from "#/components/Markdown.tsx";
import { TierartBadge } from "#/components/TierartBadge";
import { getTierartConfig } from "#/config/tierart-config.ts";
import type { Angebot } from "#/types.ts";

type AngebotDetailCardProps = {
  angebot: Angebot;
};

export function AngebotDetailCard({ angebot }: AngebotDetailCardProps) {
  const cat = getTierartConfig(angebot.erfahrungMit[0]);

  return (
    <div className="post-detail-card" style={{ borderColor: `${cat.color}60` }}>
      <div className="post-detail-header" style={{ background: cat.soft }}>
        <div className="post-detail-header-row">
          <div className="flex flex-wrap gap-2">
            {angebot.erfahrungMit.map((tierart) => (
              <TierartBadge key={tierart} tierart={tierart} size="lg" />
            ))}
          </div>
          <span style={{ fontSize: 13, color: cat.text, fontWeight: 500 }}>
            {formatDate(angebot.erstelltAm)}
          </span>
        </div>
        <h1 className="post-detail-title">{angebot.titel}</h1>
        <p className="post-detail-author">von @{angebot.autor}</p>
      </div>

      <div className="post-detail-body">
        <Markdown
          className="post-description prose"
          content={angebot.ueberMich}
        />

        <div className="info-grid">
          <InfoGridItem icon="📍" label="Ort" value={angebot.ort} />
          <InfoGridItem icon="⏱️" label="Zeitraum" value={angebot.zeitraum} />
          <InfoGridItem
            icon="🐾"
            label="Erfahrung mit"
            value={angebot.erfahrungMit.join(", ")}
          />
        </div>
      </div>
    </div>
  );
}
