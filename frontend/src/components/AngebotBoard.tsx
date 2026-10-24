import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";

import { AngebotList } from "#/components/AngebotList";
import { angeboteQueryOptions } from "#/lib/api.ts";

/** Die Pinnwand der Angebote. */
export function AngebotBoard() {
  return (
    <div className="page-wrapper" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <Suspense
        fallback={<div className="loading-state">Angebote werden geladen…</div>}
      >
        <Board />
      </Suspense>
    </div>
  );
}

function Board() {
  const { data: angebote } = useSuspenseQuery(angeboteQueryOptions());

  return (
    <>
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title" style={{ marginBottom: 6 }}>
          Alle Angebote
        </h1>
        <p style={{ color: "#6b5744", fontSize: 15, margin: 0 }}>
          Diese Leute übernehmen Betreuung. {angebote.length} Einträge.
        </p>
      </div>

      <AngebotList angebote={angebote} />
    </>
  );
}
