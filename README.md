# KI-Agenten in React: Ein praktischer Einstieg in TanStack AI

Beispielanwendung zu meinem Vortrag auf der W-JAX 2026. hütly ist eine kleine Plattform mit zwei Pinnwänden: An der einen hängen Gesuche („Wer hütet meine Schildkröten?“), an der anderen Angebote („Ich gehe im Sommer mit deinem Hund raus“). Im Vortrag bekommt hütly einen Assistenten, gebaut mit [TanStack AI](https://tanstack.com/ai).

## Branches

Dieses Repository enthält mehrere Stände der Anwendung:

- `main`: der Ausgangsstand, von dem das Live Coding startet
- [`schritte`](https://github.com/nilshartmann-workshops/2026-11-wjax-tanstack-ai/tree/schritte): alle Schritte, die ich zeigen wollte, je ein Commit pro Thema. In der [Commit-Liste](https://github.com/nilshartmann-workshops/2026-11-wjax-tanstack-ai/commits/schritte/) siehst du sie einzeln. **Der beste Einstieg,** sieh dir einfach den Diff jedes Commits an.
- [`live_coding`](https://github.com/nilshartmann-workshops/2026-11-wjax-tanstack-ai/tree/live_coding): der Code, den ich während des Vortrags tatsächlich geschrieben habe

## Aufbau

```
api-backend/  API-Server (Port 26080): die REST-API von hütly, Daten im Speicher
frontend/     die React-Anwendung (Port 26000), Vite, TanStack Router und Query
server/       Chat-Server (Port 26081): hier läuft der Assistent mit TanStack AI
shared/       die Tool-Definitionen, der Vertrag zwischen Chat-Server und Browser
```

Der API-Server steht für euer bestehendes Backend, in einer Java-Anwendung etwa ein Spring-Boot-Dienst. Der Chat-Server spricht ihn nur über die Fassade in `server/src/huetly-api.ts` an. Das Frontend erreicht beide Server über den Proxy von Vite, deshalb braucht keiner von ihnen CORS.

## Getting started

Du brauchst:

- Node.js 24 und [pnpm](https://pnpm.io)
- einen API-Schlüssel für Claude von Anthropic, oder [Ollama](https://ollama.com) mit dem Modell `gemma4:31b-mlx` (`ollama pull gemma4:31b-mlx`)

Pakete installieren, einmal im Wurzelverzeichnis:

```bash
pnpm install
```

Dann die drei Prozesse in je einem Terminal starten, jeweils im Wurzelverzeichnis:

```bash
pnpm dev:api
pnpm dev:server
pnpm dev:frontend
```

Die Anwendung läuft danach auf http://localhost:26000.

Läuft ein Prozess weiter, nachdem du die IDE oder das Terminal geschlossen hast, beendet `scripts/stop.sh` alle drei. `pnpm dev:server` beendet einen alten Chat-Server vor dem Start selbst.

### Das Modell wählen

Der Chat-Server liest beim Start `HUETLY_MODEL`. Groß- und Kleinschreibung ist egal.

| `HUETLY_MODEL` | Modell | braucht |
|---|---|---|
| `sonnet` (Standard) | Claude Sonnet 5.5 | `HUETLY_ANTHROPIC_API_KEY` |
| `haiku` | Claude Haiku 5.5 | `HUETLY_ANTHROPIC_API_KEY` |
| `gemma` | Gemma 4 über Ollama | ein laufendes Ollama |

```bash
# Claude Sonnet, der Schlüssel steht in der Umgebung
export HUETLY_ANTHROPIC_API_KEY=sk-ant-...
pnpm dev:server

# Claude Haiku
HUETLY_MODEL=haiku pnpm dev:server

# Gemma lokal, ohne Konto und ohne Netz
HUETLY_MODEL=gemma pnpm dev:server
```

Statt den Schlüssel jedes Mal zu exportieren, kannst du die Zeile mit `export` in die Datei `~/huetly-key.sh` schreiben. `pnpm dev:server` und `scripts/05-anthropic-direkt.sh` laden sie, wenn es sie gibt.

Läuft Ollama nicht auf `localhost:11434`, gibst du die Adresse mit: `HUETLY_MODEL=gemma OLLAMA_BASE_URL=http://... pnpm dev:server`.

Welches Modell läuft, steht in der ersten Zeile, die der Chat-Server ausgibt.

Der Chat-Server schreibt jeden AG-UI-Event ins Terminal.

Die Aufrufe mit `curl` aus dem Vortrag liegen fertig in `scripts/`, zum Beispiel `scripts/10-chat-route.sh`.

Geprüft wird alles mit `pnpm check` im Wurzelverzeichnis (Formatierung, Linter, TypeScript).

## Kontakt

Bei Fragen, Anmerkungen oder Rückmeldungen melde dich gerne. Meine Kontaktdaten findest du hier: https://nilshartmann.net/kontakt
