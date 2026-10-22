import { createFileRoute } from "@tanstack/react-router";

import { PostBoard } from "#/components/PostBoard";
import { getPostsQueryOptions } from "#/lib/api.ts";

export const Route = createFileRoute("/offers/")({
  component: OffersPage,
  loader({ context }) {
    return context.queryClient.ensureQueryData(getPostsQueryOptions("Angebot"));
  },
});

function OffersPage() {
  return <PostBoard type="Angebot" />;
}
