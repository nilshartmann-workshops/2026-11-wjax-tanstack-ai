import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";

import { InterestedBox } from "#/components/InterestedBox";
import { PostDetailCard } from "#/components/PostDetailCard";
import { PostDetailLoadingIndicator } from "#/components/PostDetailLoadingIndicator";
import { RepliesList } from "#/components/RepliesList.tsx";
import { RepliesLoadingState } from "#/components/RepliesLoadingState.tsx";
import { ReplyForm } from "#/components/ReplyForm.tsx";
import {
  getPostQueryOptions,
  getRepliesByPostIdQueryOptions,
} from "#/lib/api.ts";

export const Route = createFileRoute("/posts/$postId")({
  component: PostDetailPage,
  loader({ context, params }) {
    // Die Antworten laufen im Hintergrund mit, auf den Eintrag selbst warten wir.
    context.queryClient.ensureQueryData(
      getRepliesByPostIdQueryOptions(params.postId),
    );
    return context.queryClient.ensureQueryData(
      getPostQueryOptions(params.postId),
    );
  },
});

function PostDetailPage() {
  const { postId } = Route.useParams();

  return (
    <div
      className="page-wrapper-md"
      style={{ paddingTop: 40, paddingBottom: 40 }}
    >
      <Suspense fallback={<PostDetailLoadingIndicator />}>
        <PostDetail postId={postId} />
      </Suspense>
    </div>
  );
}

type PostDetailProps = {
  postId: string;
};

function PostDetail({ postId }: PostDetailProps) {
  const { data: post } = useSuspenseQuery(getPostQueryOptions(postId));

  return (
    <>
      {/* Zurueck an die Pinnwand, von der der Eintrag stammt. */}
      {post.type === "Gesuch" ? (
        <Link to="/posts" className="back-link">
          ← Zurück zu den Gesuchen
        </Link>
      ) : (
        <Link to="/offers" className="back-link">
          ← Zurück zu den Angeboten
        </Link>
      )}

      <PostDetailCard post={post}>
        <InterestedBox postId={postId} interested={post.interested} />
      </PostDetailCard>

      <Suspense fallback={<RepliesLoadingState />}>
        <RepliesList postId={postId} />
      </Suspense>
      <ReplyForm postId={postId} postType={post.type} />
    </>
  );
}
