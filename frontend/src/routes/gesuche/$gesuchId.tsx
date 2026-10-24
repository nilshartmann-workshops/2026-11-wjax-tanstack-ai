import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";

import { AntwortForm } from "#/components/AntwortForm.tsx";
import { AntwortList } from "#/components/AntwortList.tsx";
import { AntwortLoadingIndicator } from "#/components/AntwortLoadingIndicator.tsx";
import { DetailLoadingIndicator } from "#/components/DetailLoadingIndicator";
import { GesuchDetailCard } from "#/components/GesuchDetailCard";
import { antwortenQueryOptions, gesuchQueryOptions } from "#/lib/api.ts";

export const Route = createFileRoute("/gesuche/$gesuchId")({
  component: GesuchDetailPage,
  loader({ context, params }) {
    // Die Antworten laufen im Hintergrund mit, auf das Gesuch selbst warten wir.
    context.queryClient.ensureQueryData(antwortenQueryOptions(params.gesuchId));
    return context.queryClient.ensureQueryData(
      gesuchQueryOptions(params.gesuchId),
    );
  },
});

function GesuchDetailPage() {
  const { gesuchId } = Route.useParams();

  return (
    <div
      className="page-wrapper-md"
      style={{ paddingTop: 40, paddingBottom: 40 }}
    >
      <Suspense fallback={<DetailLoadingIndicator />}>
        <GesuchDetail gesuchId={gesuchId} />
      </Suspense>
    </div>
  );
}

function GesuchDetail({ gesuchId }: { gesuchId: string }) {
  const { data: gesuch } = useSuspenseQuery(gesuchQueryOptions(gesuchId));

  return (
    <>
      <Link to="/gesuche" className="back-link">
        ← Zurück zu den Gesuchen
      </Link>

      <GesuchDetailCard gesuch={gesuch} />

      <Suspense fallback={<AntwortLoadingIndicator />}>
        <AntwortList eintragId={gesuchId} />
      </Suspense>
      <AntwortForm eintragId={gesuchId} art="Gesuch" />
    </>
  );
}
