import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";

import { AngebotDetailCard } from "#/components/AngebotDetailCard";
import { AntwortForm } from "#/components/AntwortForm.tsx";
import { AntwortList } from "#/components/AntwortList.tsx";
import { AntwortLoadingIndicator } from "#/components/AntwortLoadingIndicator.tsx";
import { DetailLoadingIndicator } from "#/components/DetailLoadingIndicator";
import { angebotQueryOptions, antwortenQueryOptions } from "#/lib/api.ts";

export const Route = createFileRoute("/angebote/$angebotId")({
  component: AngebotDetailPage,
  loader({ context, params }) {
    // Die Antworten laufen im Hintergrund mit, auf das Angebot selbst warten wir.
    context.queryClient.ensureQueryData(
      antwortenQueryOptions(params.angebotId),
    );
    return context.queryClient.ensureQueryData(
      angebotQueryOptions(params.angebotId),
    );
  },
});

function AngebotDetailPage() {
  const { angebotId } = Route.useParams();

  return (
    <div
      className="page-wrapper-md"
      style={{ paddingTop: 40, paddingBottom: 40 }}
    >
      <Suspense fallback={<DetailLoadingIndicator />}>
        <AngebotDetail angebotId={angebotId} />
      </Suspense>
    </div>
  );
}

function AngebotDetail({ angebotId }: { angebotId: string }) {
  const { data: angebot } = useSuspenseQuery(angebotQueryOptions(angebotId));

  return (
    <>
      <Link to="/angebote" className="back-link">
        ← Zurück zu den Angeboten
      </Link>

      <AngebotDetailCard angebot={angebot} />

      <Suspense fallback={<AntwortLoadingIndicator />}>
        <AntwortList eintragId={angebotId} />
      </Suspense>
      <AntwortForm eintragId={angebotId} art="Angebot" />
    </>
  );
}
