import { GesuchCard } from "#/components/GesuchCard";
import type { Gesuch } from "#/types.ts";

type GesuchListProps = { gesuche: Array<Gesuch> };

export function GesuchList({ gesuche }: GesuchListProps) {
  return (
    <div className="posts-grid">
      {gesuche.map((gesuch) => (
        <GesuchCard key={gesuch.id} gesuch={gesuch} />
      ))}
    </div>
  );
}
