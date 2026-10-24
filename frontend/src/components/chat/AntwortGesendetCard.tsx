import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";

import { antwortenQueryOptions, eintragQueryOptions } from "#/lib/api.ts";

type AntwortGesendetCardProps = { eintragId: string; antwortId: string };

/**
 * Verlinkt eine Antwort, die der Assistent gesendet hat, und aktualisiert den
 * Query-Cache der Anwendung.
 *
 * Der Assistent hat geschrieben, ohne dass die Anwendung davon wusste. Ohne
 * die Invalidierung zeigt die Detailseite daneben weiter die alte
 * Antwortliste.
 */
export function AntwortGesendetCard({
  eintragId,
  antwortId,
}: AntwortGesendetCardProps) {
  const queryClient = useQueryClient();
  const { data: eintrag } = useQuery(eintragQueryOptions(eintragId));

  useEffect(() => {
    void queryClient.invalidateQueries({
      queryKey: antwortenQueryOptions(eintragId).queryKey,
    });
  }, [queryClient, eintragId]);

  if (!eintrag) {
    return <p className="chat-note">Deine Antwort ist gesendet.</p>;
  }

  return (
    <p className="chat-note">
      Deine Antwort steht jetzt unter{" "}
      {eintrag.art === "Gesuch" ? (
        <Link
          to="/gesuche/$gesuchId"
          params={{ gesuchId: eintragId }}
          hash={antwortId}
          className="chat-link"
        >
          „{eintrag.titel}“
        </Link>
      ) : (
        <Link
          to="/angebote/$angebotId"
          params={{ angebotId: eintragId }}
          hash={antwortId}
          className="chat-link"
        >
          „{eintrag.titel}“
        </Link>
      )}
    </p>
  );
}
