import { createFileRoute } from "@tanstack/react-router";

import { PostBoard } from "#/components/PostBoard";
import { getPostsQueryOptions } from "#/lib/api.ts";

export const Route = createFileRoute("/posts/")({
  component: RequestsPage,
  loader({ context }) {
    return context.queryClient.ensureQueryData(getPostsQueryOptions("Gesuch"));
  },
});

function RequestsPage() {
  return <PostBoard type="Gesuch" />;
}
