import { useQuery } from "@tanstack/react-query";

import { GesuchCard } from "#/components/GesuchCard";
import { gesuchQueryOptions } from "#/lib/api.ts";

type ChatGesuchCardProps = {
  gesuchId: string;
};

/**
 * Zeigt ein Gesuch, das der Assistent gefunden hat, mit der Karte der
 * Pinnwand.
 *
 * Der Assistent liefert Daten, keine Komponenten: Aus dem Tool-Ergebnis kommt
 * die Id, alles Weitere aus demselben Query-Cache, aus dem auch `/gesuche`
 * liest. Nach einem Reload zeigt die Karte damit den aktuellen Stand und nicht
 * den aus dem Nachrichtenverlauf.
 */
export function ChatGesuchCard({ gesuchId }: ChatGesuchCardProps) {
  const { data: gesuch, isPending } = useQuery(gesuchQueryOptions(gesuchId));

  if (isPending) {
    return <p className="chat-note">Gesuch {gesuchId} wird geladen…</p>;
  }

  if (!gesuch) {
    return <p className="chat-note">Gesuch {gesuchId} gibt es nicht mehr.</p>;
  }

  return <GesuchCard gesuch={gesuch} />;
}
