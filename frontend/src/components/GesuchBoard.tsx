import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";

import { GesuchList } from "#/components/GesuchList";
import { gesucheQueryOptions } from "#/lib/api.ts";

/** Die Pinnwand der Gesuche. */
export function GesuchBoard() {
  return (
    <div className="page-wrapper" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <Suspense
        fallback={<div className="loading-state">Gesuche werden geladen…</div>}
      >
        <Board />
      </Suspense>
    </div>
  );
}

function Board() {
  const { data: gesuche } = useSuspenseQuery(gesucheQueryOptions());

  return (
    <>
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title" style={{ marginBottom: 6 }}>
          Alle Gesuche
        </h1>
        <p style={{ color: "#6b5744", fontSize: 15, margin: 0 }}>
          Diese Leute brauchen Betreuung. {gesuche.length} Einträge.
        </p>
      </div>

      <GesuchList gesuche={gesuche} />
    </>
  );
}
