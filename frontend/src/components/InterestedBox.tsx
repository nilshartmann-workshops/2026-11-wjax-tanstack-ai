import { useMutation } from "@tanstack/react-query";

import { getPostQueryOptions, markInterested } from "#/lib/api.ts";

type InterestedBoxProps = {
  postId: string;
  interested: number;
};

export function InterestedBox({ postId, interested }: InterestedBoxProps) {
  const mutation = useMutation({
    mutationFn: () => markInterested(postId),
    onSuccess: (_data, _vars, _result, context) => {
      return context.client.invalidateQueries({
        queryKey: getPostQueryOptions(postId).queryKey,
      });
    },
  });

  const interestedHot = interested > 10;
  const style = {
    background: interestedHot ? "#fce8dc" : "#fdf8f2",
    borderColor: interestedHot ? "#e8835a60" : "#f5ede060",
  };

  return (
    <div className="interested-box" style={style}>
      <div>
        <div className="interested-box-title">
          <InterestedIcon animating={mutation.isPending} /> {interested} Person
          {interested !== 1 ? "en" : ""} interessiert
        </div>
        <div className="interested-box-sub">
          {interested > 15
            ? "Sehr beliebt! Schnell sein lohnt sich."
            : "Meld dich auch, wenn du helfen kannst!"}
        </div>
      </div>
      <button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="btn-primary interested-btn"
      >
        <span
          className={mutation.isPending ? "interested-btn-label-hidden" : ""}
        >
          Ich bin interessiert!
        </span>
        {mutation.isPending && (
          <span className="interested-run" style={{ fontSize: 16 }}>
            🐢
          </span>
        )}
      </button>
    </div>
  );
}

type InterestedIconProps = { animating: boolean };

function InterestedIcon({ animating }: InterestedIconProps) {
  return <span className={animating ? "heartbeat" : ""}>🤝</span>;
}
