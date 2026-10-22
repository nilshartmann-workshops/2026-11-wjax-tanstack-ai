import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";

import {
  getPostQueryOptions,
  getRepliesByPostIdQueryOptions,
} from "#/lib/api.ts";

type ReplyPublishedProps = { postId: string; replyId: string };

/// Verlinkt eine Antwort, die der Assistent veröffentlicht hat, und
/// aktualisiert den Query-Cache der Anwendung.
///
/// Der Assistent hat geschrieben, ohne dass die Anwendung davon wusste. Ohne
/// die Invalidierung zeigt die Detailseite daneben weiter die alte
/// Antwortliste.
export function ReplyPublished({ postId, replyId }: ReplyPublishedProps) {
  const queryClient = useQueryClient();
  const { data: post } = useQuery(getPostQueryOptions(postId));

  useEffect(() => {
    void queryClient.invalidateQueries({
      queryKey: getRepliesByPostIdQueryOptions(postId).queryKey,
    });
  }, [queryClient, postId]);

  return (
    <p className="chat-note">
      Deine Antwort steht jetzt unter{" "}
      <Link
        to="/posts/$postId"
        params={{ postId }}
        hash={replyId}
        className="chat-link"
      >
        {post ? `„${post.title}“` : `Eintrag ${postId}`}
      </Link>
    </p>
  );
}
