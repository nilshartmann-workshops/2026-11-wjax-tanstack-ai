import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller, useForm, useWatch } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { CATEGORY_CONFIGS } from "#/config/category-config.ts";
import { createPost } from "#/lib/api.ts";
import type { CreatePostInput } from "#/types.ts";
import { CreatePostSchema } from "#/types.ts";

/// Die beiden Pinnwaende, wie sie im Formular zur Wahl stehen.
const POST_TYPES = [
  { value: "Gesuch", label: "🔎 Ich suche Betreuung" },
  { value: "Angebot", label: "🤝 Ich biete Betreuung an" },
] as const;

/// Ein Entwurf kann in der URL stehen (`?title=...&location=...`) und füllt
/// dann das Formular vor. Veröffentlicht wird trotzdem erst mit dem Knopf.
/// Ändert sich der Entwurf, wird die Seite neu aufgebaut, weil das Formular
/// seine Vorgaben nur beim ersten Rendern liest.
export const Route = createFileRoute("/posts/new")({
  component: NewPostPage,
  validateSearch: CreatePostSchema.omit({ type: true, author: true }).partial(),
  remountDeps: ({ search }) => search,
});

function NewPostPage() {
  const navigate = useNavigate();
  const draft = Route.useSearch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: { type: "Gesuch" as const, ...draft },
  });

  // Dieselbe Maske fuellt beide Pinnwaende. Die Richtung entscheidet nur, wie
  // die Felder beschriftet sind und wo der Eintrag danach steht.
  const type = useWatch({ control, name: "type" });
  const isRequest = type === "Gesuch";

  const mutation = useMutation({
    mutationFn: (data: CreatePostInput) => createPost(data),
    onSuccess: (data, _vars, _result, context) => {
      context.client.invalidateQueries({ queryKey: ["posts", "list"] });
      navigate({ to: data.type === "Gesuch" ? "/posts" : "/offers" });
    },
  });

  return (
    <div
      className="page-wrapper-sm"
      style={{ paddingTop: 40, paddingBottom: 40 }}
    >
      <Link to="/" className="back-link">
        ← Zurück
      </Link>

      <h1 className="page-title">
        {isRequest ? "Gesuch einstellen" : "Angebot einstellen"}
      </h1>
      <p style={{ color: "#6b5744", marginBottom: 36 }}>
        {isRequest
          ? "Beschreib uns dein Tier und wann du Hilfe brauchst — die Community hilft!"
          : "Sag uns, wen du wann betreuen würdest — die Community meldet sich."}
      </p>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="form-stack-lg"
      >
        <div>
          <label className="form-label">Was stellst du ein?</label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {POST_TYPES.map((option) => (
                  <label
                    key={option.value}
                    className="category-radio-label"
                    style={{
                      background:
                        field.value === option.value ? "#fdf6ec" : "#fff",
                      color:
                        field.value === option.value ? "#8a5a1b" : "#6b5744",
                      borderColor:
                        field.value === option.value ? "#e8b96a" : "#f5ede0",
                    }}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={option.value}
                      checked={field.value === option.value}
                      onChange={() => field.onChange(option.value)}
                      style={{ display: "none" }}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        <FormField
          name="title"
          label="Titel"
          placeholder={
            isRequest
              ? "z.B. Wer kümmert sich um meine Schildkröten?"
              : "z.B. Gassi in Hamburg, auch bei Schietwetter"
          }
          register={register}
          errors={errors}
        />
        <FormField
          name="author"
          label="Dein Benutzername"
          placeholder="z.B. felix.node"
          register={register}
          errors={errors}
        />
        <FormField
          name="animal"
          label="Tier / Pflanze"
          placeholder={
            isRequest
              ? "z.B. 2 Landschildkröten, sehr eigenständig"
              : "z.B. Hunde jeder Größe"
          }
          register={register}
          errors={errors}
        />
        <FormField
          name="timeframe"
          label="Zeitraum"
          placeholder="z.B. 3 Wochen im Juli"
          register={register}
          errors={errors}
        />
        <FormField
          name="location"
          label="Ort"
          placeholder="z.B. Hamburg-Altona"
          register={register}
          errors={errors}
        />

        <div>
          <label className="form-label">Kategorie</label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {CATEGORY_CONFIGS.map((cat) => (
                  <label
                    key={cat.id}
                    className="category-radio-label"
                    style={{
                      background: field.value === cat.id ? cat.soft : "#fff",
                      color: field.value === cat.id ? cat.text : "#6b5744",
                      borderColor:
                        field.value === cat.id ? cat.color : "#f5ede0",
                    }}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={field.value === cat.id}
                      onChange={() => field.onChange(cat.id)}
                      style={{ display: "none" }}
                    />
                    {cat.emoji} {cat.label}
                  </label>
                ))}
              </div>
            )}
          />
          {errors.category && (
            <p className="form-error">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Beschreibung</label>
          <textarea
            placeholder={
              isRequest
                ? "Erzähl uns mehr über dein Tier und was ihr braucht…"
                : "Erzähl uns, welche Tiere du betreust und was du mitbringst…"
            }
            rows={4}
            className={twMerge(
              "form-input form-textarea-lg",
              errors.description && "error",
            )}
            {...register("description")}
          />
          {errors.description && (
            <p className="form-error">{errors.description.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className={twMerge("btn-submit", mutation.isSuccess && "success")}
        >
          {mutation.isSuccess
            ? `✓ ${type} veröffentlicht!`
            : mutation.isPending
              ? "Wird gespeichert…"
              : `${type} veröffentlichen →`}
        </button>
      </form>
    </div>
  );
}

type TextFieldName = Exclude<
  keyof CreatePostInput,
  "type" | "category" | "description"
>;

type FormFieldProps = {
  name: TextFieldName;
  label: string;
  placeholder: string;
  register: UseFormRegister<CreatePostInput>;
  errors: FieldErrors<CreatePostInput>;
};

function FormField({
  name,
  label,
  placeholder,
  register,
  errors,
}: FormFieldProps) {
  const error = errors[name];
  return (
    <div>
      <label className="form-label">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className={twMerge("form-input", error && "error")}
        {...register(name)}
      />
      {error && <p className="form-error">{error.message}</p>}
    </div>
  );
}
