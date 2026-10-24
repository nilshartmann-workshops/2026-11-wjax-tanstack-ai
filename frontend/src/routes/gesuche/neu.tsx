import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { TIERART_CONFIGS } from "#/config/tierart-config.ts";
import { createGesuch } from "#/lib/api.ts";
import type { CreateGesuchInput } from "#/types.ts";
import { CreateGesuchSchema } from "#/types.ts";

/**
 * Ein Entwurf kann in der URL stehen (`?titel=...&ort=...`) und füllt dann
 * das Formular vor. Veröffentlicht wird trotzdem erst mit dem Knopf. Ändert
 * sich der Entwurf, wird die Seite neu aufgebaut, weil das Formular seine
 * Vorgaben nur beim ersten Rendern liest.
 */
export const Route = createFileRoute("/gesuche/neu")({
  component: NeuesGesuchPage,
  validateSearch: CreateGesuchSchema.omit({ autor: true }).partial(),
  remountDeps: ({ search }) => search,
});

function NeuesGesuchPage() {
  const navigate = useNavigate();
  const entwurf = Route.useSearch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateGesuchInput>({
    resolver: zodResolver(CreateGesuchSchema),
    defaultValues: entwurf,
  });

  const mutation = useMutation({
    mutationFn: (data: CreateGesuchInput) => createGesuch(data),
    onSuccess: (_data, _vars, _result, context) => {
      context.client.invalidateQueries({ queryKey: ["gesuche", "list"] });
      navigate({ to: "/gesuche" });
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

      <h1 className="page-title">Gesuch einstellen</h1>
      <p style={{ color: "#6b5744", marginBottom: 36 }}>
        Beschreib uns dein Tier und wann du Hilfe brauchst — die Community
        hilft!
      </p>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="form-stack-lg"
      >
        <FormField
          name="titel"
          label="Titel"
          placeholder="z.B. Wer kümmert sich um meine Schildkröten?"
          register={register}
          errors={errors}
        />
        <FormField
          name="autor"
          label="Dein Benutzername"
          placeholder="z.B. felix.node"
          register={register}
          errors={errors}
        />
        <FormField
          name="tier"
          label="Tier / Pflanze"
          placeholder="z.B. 2 Landschildkröten, sehr eigenständig"
          register={register}
          errors={errors}
        />
        <FormField
          name="zeitraum"
          label="Zeitraum"
          placeholder="z.B. 3 Wochen im Juli"
          register={register}
          errors={errors}
        />
        <FormField
          name="ort"
          label="Ort"
          placeholder="z.B. Hamburg-Altona"
          register={register}
          errors={errors}
        />

        <div>
          <label className="form-label">Tierart</label>
          <Controller
            name="tierart"
            control={control}
            render={({ field }) => (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TIERART_CONFIGS.map((cat) => (
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
                      name="tierart"
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
          {errors.tierart && (
            <p className="form-error">{errors.tierart.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Beschreibung</label>
          <textarea
            placeholder="Erzähl uns mehr über dein Tier und was ihr braucht…"
            rows={4}
            className={twMerge(
              "form-input form-textarea-lg",
              errors.beschreibung && "error",
            )}
            {...register("beschreibung")}
          />
          {errors.beschreibung && (
            <p className="form-error">{errors.beschreibung.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className={twMerge("btn-submit", mutation.isSuccess && "success")}
        >
          {mutation.isSuccess
            ? "✓ Gesuch veröffentlicht!"
            : mutation.isPending
              ? "Wird gespeichert…"
              : "Gesuch veröffentlichen →"}
        </button>
      </form>
    </div>
  );
}

type TextFieldName = Exclude<
  keyof CreateGesuchInput,
  "tierart" | "beschreibung"
>;

type FormFieldProps = {
  name: TextFieldName;
  label: string;
  placeholder: string;
  register: UseFormRegister<CreateGesuchInput>;
  errors: FieldErrors<CreateGesuchInput>;
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
