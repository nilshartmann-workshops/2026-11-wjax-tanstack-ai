import { createFileRoute } from "@tanstack/react-router";

import { AngebotBoard } from "#/components/AngebotBoard";
import { angeboteQueryOptions } from "#/lib/api.ts";

export const Route = createFileRoute("/angebote/")({
  component: AngebotePage,
  loader({ context }) {
    return context.queryClient.ensureQueryData(angeboteQueryOptions());
  },
});

function AngebotePage() {
  return <AngebotBoard />;
}
