import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { createReply, getRepliesByPostIdQueryOptions } from "#/lib/api.ts";
import type { CreateReplyInput, PostType } from "#/types.ts";
import { CreateReplySchema } from "#/types.ts";

type ReplyFormProps = {
  postId: string;
  postType: PostType;
};

export function ReplyForm({ postId, postType }: ReplyFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateReplySchema),
  });

  const replyMutation = useMutation({
    mutationFn: (input: CreateReplyInput) => createReply(postId, input),
    onSuccess: (_data, _vars, _result, context) => {
      reset();
      return context.client.invalidateQueries({
        queryKey: getRepliesByPostIdQueryOptions(postId).queryKey,
      });
    },
  });

  const isPending = replyMutation.isPending;

  // Unter einem Gesuch meldet sich jemand, der betreuen wuerde, unter einem
  // Angebot jemand, der Betreuung braucht.
  const placeholder =
    postType === "Gesuch"
      ? "Erzähl kurz, warum du die richtige Person bist…"
      : "Erzähl kurz, worum es bei dir geht…";

  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad/.test(navigator.platform);
  const shortcutHint = isMac ? "⌘↵" : "Strg+↵";

  const onSubmit = (data: CreateReplyInput) => replyMutation.mutate(data);

  return (
    <details className="reply-form-wrap">
      <summary className="reply-form-summary">
        <h3 className="reply-form-title">Deine Antwort</h3>
        <ChevronDown className="reply-form-chevron" size={20} />
      </summary>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !isPending) {
            handleSubmit(onSubmit)();
          }
        }}
        className="form-stack"
      >
        <div>
          <label className="form-label">Dein Benutzername</label>
          <input
            placeholder="z.B. cat_lover_99"
            className={twMerge("form-input", errors.author && "error")}
            {...register("author")}
          />
          {errors.author && (
            <p className="form-error">{errors.author.message}</p>
          )}
        </div>
        <div>
          <label className="form-label">Deine Antwort</label>
          <textarea
            placeholder={placeholder}
            rows={3}
            className={twMerge(
              "form-input form-textarea",
              errors.text && "error",
            )}
            {...register("text")}
          />
          {errors.text && <p className="form-error">{errors.text.message}</p>}
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="btn-reply-submit"
          >
            {isPending ? (
              "Wird gesendet…"
            ) : (
              <>
                Antwort abschicken
                <span className="ml-2 text-xs opacity-50">{shortcutHint}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </details>
  );
}
