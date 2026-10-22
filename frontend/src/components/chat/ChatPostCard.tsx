import { useQuery } from "@tanstack/react-query";

import { PostCard } from "#/components/PostCard";
import { getPostQueryOptions } from "#/lib/api.ts";

type ChatPostCardProps = {
  postId: string;
};

/// Zeigt einen Eintrag, den der Agent gefunden hat, mit der Karte der
/// Listenseite.
///
/// Der Agent liefert Daten, keine Komponenten: Aus dem Tool-Ergebnis kommt die
/// Id, alles Weitere aus demselben Query-Cache, aus dem auch `/posts` liest.
/// Nach einem Reload zeigt die Karte damit den aktuellen Stand und nicht den
/// aus dem Nachrichtenverlauf.
export function ChatPostCard({ postId }: ChatPostCardProps) {
  const { data: post, isPending } = useQuery(getPostQueryOptions(postId));

  if (isPending) {
    return <p className="chat-note">Eintrag {postId} wird geladen…</p>;
  }

  if (!post) {
    return <p className="chat-note">Eintrag {postId} gibt es nicht mehr.</p>;
  }

  return <PostCard post={post} />;
}
