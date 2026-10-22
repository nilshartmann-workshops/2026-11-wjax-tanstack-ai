import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";

import { PostCardList } from "#/components/PostCardList";
import { getPostsQueryOptions } from "#/lib/api.ts";
import type { PostType } from "#/types.ts";

type PostBoardProps = {
  type: PostType;
};

/// Eine der beiden Pinnwaende.
///
/// Gesuche und Angebote unterscheiden sich in der Richtung und in nichts
/// sonst, deshalb rendert beide dieselbe Komponente mit denselben Karten.
export function PostBoard({ type }: PostBoardProps) {
  const heading = type === "Gesuch" ? "Alle Gesuche" : "Alle Angebote";

  return (
    <div className="page-wrapper" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <Suspense
        fallback={
          <div className="loading-state">{heading} werden geladen…</div>
        }
      >
        <Board type={type} heading={heading} />
      </Suspense>
    </div>
  );
}

type BoardProps = { type: PostType; heading: string };

function Board({ type, heading }: BoardProps) {
  const { data: posts } = useSuspenseQuery(getPostsQueryOptions(type));

  const subtitle =
    type === "Gesuch"
      ? "Diese Leute brauchen Betreuung."
      : "Diese Leute übernehmen Betreuung.";

  return (
    <>
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title" style={{ marginBottom: 6 }}>
          {heading}
        </h1>
        <p style={{ color: "#6b5744", fontSize: 15, margin: 0 }}>
          {subtitle} {posts.length} Einträge.
        </p>
      </div>

      <PostCardList posts={posts} />
    </>
  );
}
