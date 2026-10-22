import { useMutation } from "@tanstack/react-query";

import { markInterested } from "#/lib/api.ts";

type InterestedButtonProps = { postId: string; count: number };

export function InterestedButton({ postId, count }: InterestedButtonProps) {
  const mutation = useMutation({
    mutationFn: () => markInterested(postId),
    onSuccess: (_data, _vars, _result, context) => {
      return context.client.invalidateQueries({
        queryKey: ["posts", "list"],
      });
    },
  });

  const isPending = mutation.isPending;

  return (
    <button
      type="button"
      onClick={() => mutation.mutate()}
      disabled={isPending}
      className="interested-chip"
    >
      {isPending ? (
        <span className="interested-run" style={{ fontSize: 13 }}>
          🐢
        </span>
      ) : (
        <>
          <span className="interested-emoji" style={{ fontSize: 13 }}>
            🤝
          </span>
          {count} interessiert
        </>
      )}
    </button>
  );
}
