# 40: antwortSenden mit needsApproval, Freigabekarte

Prompts zum Testen, nacheinander im selben Gespräch:

```
Wer sucht jemanden für Reptilien?
```

```
Antworte auf das erste.
```

Im Chat erscheint die Freigabekarte mit dem Text des Assistenten. Erst
nach „Veröffentlichen“ steht die Antwort unter dem Gesuch. Mit
„Ablehnen“ fragt der Assistent, was er ändern soll.

In den System-Prompt kommen die Sätze zu `antwortSenden`:

```
Wenn der Nutzer dich bittet, jemandem zu schreiben, formuliere den Text selbst und rufe antwortSenden auf. Frage nicht nach, was du schreiben sollst.
Lehnt der Nutzer deinen Text ab, frage, was du ändern sollst.
Du schreibst im Namen von ${CURRENT_USER}.
```

Im Netzwerk-Tab endet der erste Request an `/api/chat`, sobald die
Freigabekarte erscheint. Erst „Veröffentlichen“ oder „Ablehnen“ startet
einen zweiten Request. In seinem Body stehen der unterbrochene Lauf als
`parentRunId` und die Entscheidung unter `resume`.
