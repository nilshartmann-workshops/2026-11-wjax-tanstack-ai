import { AngebotCard } from "#/components/AngebotCard";
import type { Angebot } from "#/types.ts";

type AngebotListProps = { angebote: Array<Angebot> };

export function AngebotList({ angebote }: AngebotListProps) {
  return (
    <div className="posts-grid">
      {angebote.map((angebot) => (
        <AngebotCard key={angebot.id} angebot={angebot} />
      ))}
    </div>
  );
}
