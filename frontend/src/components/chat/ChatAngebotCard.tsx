import { useQuery } from "@tanstack/react-query";

import { AngebotCard } from "#/components/AngebotCard";
import { angebotQueryOptions } from "#/lib/api.ts";

type ChatAngebotCardProps = {
  angebotId: string;
};

/**
 * Zeigt ein Angebot, das der Assistent gefunden hat, mit der Karte der
 * Pinnwand. Wie bei den Gesuchen kommt aus dem Tool-Ergebnis nur die Id.
 */
export function ChatAngebotCard({ angebotId }: ChatAngebotCardProps) {
  const { data: angebot, isPending } = useQuery(angebotQueryOptions(angebotId));

  if (isPending) {
    return <p className="chat-note">Angebot {angebotId} wird geladen…</p>;
  }

  if (!angebot) {
    return <p className="chat-note">Angebot {angebotId} gibt es nicht mehr.</p>;
  }

  return <AngebotCard angebot={angebot} />;
}
