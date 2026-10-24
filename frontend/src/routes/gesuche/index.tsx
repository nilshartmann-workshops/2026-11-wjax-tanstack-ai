import { createFileRoute } from "@tanstack/react-router";

import { GesuchBoard } from "#/components/GesuchBoard";
import { gesucheQueryOptions } from "#/lib/api.ts";

export const Route = createFileRoute("/gesuche/")({
  component: GesuchePage,
  loader({ context }) {
    return context.queryClient.ensureQueryData(gesucheQueryOptions());
  },
});

function GesuchePage() {
  return <GesuchBoard />;
}
