# KI-Agenten in React: Ein praktischer Einstieg in TanStack AI

Beispielanwendung zu meinem Vortrag auf der W-JAX 2026. hütly ist eine kleine Plattform mit zwei Pinnwänden: An der einen hängen Gesuche („Wer hütet meine Schildkröten?“), an der anderen Angebote („Ich gehe im Sommer mit deinem Hund raus“). Im Vortrag bekommt hütly einen Assistenten, gebaut mit [TanStack AI](https://tanstack.com/ai).

## Branches

Dieses Repository enthält mehrere Stände der Anwendung:

- `main`: der Ausgangsstand, von dem das Live Coding startet
- [`schritte`](https://github.com/ORG/TEILNEHMER-REPO/tree/schritte): alle Schritte, die ich zeigen wollte, je ein Commit pro Thema. In der [Commit-Liste](https://github.com/ORG/TEILNEHMER-REPO/commits/schritte/) siehst du sie einzeln. **Der beste Einstieg,** sieh dir einfach den Diff jedes Commits an.
- [`live_coding`](https://github.com/ORG/TEILNEHMER-REPO/tree/live_coding): der Code, den ich während des Vortrags tatsächlich geschrieben habe

## Aufbau

```
backend/    API-Server (Port 63080): die REST-API von hütly, Daten im Speicher
frontend/   die React-Anwendung (Port 63000), Vite, TanStack Router und Query
server/     Chat-Server (Port 63081): hier läuft der Assistent mit TanStack AI
```

Der API-Server steht für euer bestehendes Backend, in einer Java-Anwendung etwa ein Spring-Boot-Dienst. Der Chat-Server spricht ihn nur über die Fassade in `server/src/huetly-api.ts` an. Das Frontend erreicht beide Server über den Proxy von Vite, deshalb braucht keiner von ihnen CORS.

## Beispiele

TODO: Aufzählung dessen, was hier zu sehen ist, je Zeile ein Thema mit der Stelle im Code.

## Getting started

Du brauchst:

- Node.js 24 und [pnpm](https://pnpm.io)
- einen API-Schlüssel für Claude von Anthropic, oder [Ollama](https://ollama.com) mit dem Modell `gemma4:31b-mlx` (`ollama pull gemma4:31b-mlx`)

Pakete installieren, einmal im Wurzelverzeichnis:

```bash
pnpm install
```

Dann die drei Prozesse in je einem Terminal starten:

```bash
cd backend && pnpm start
cd server && pnpm dev
cd frontend && pnpm dev
```

Die Anwendung läuft danach auf http://localhost:63000.

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
cd server && pnpm dev

# Claude Haiku
cd server && HUETLY_MODEL=haiku pnpm dev

# Gemma lokal, ohne Konto und ohne Netz
cd server && HUETLY_MODEL=gemma pnpm dev
```

Läuft Ollama nicht auf `localhost:11434`, gibst du die Adresse mit: `HUETLY_MODEL=gemma OLLAMA_BASE_URL=http://... pnpm dev`.

Welches Modell läuft, steht in der ersten Zeile, die der Chat-Server ausgibt.

Geprüft wird alles mit `pnpm check` im Wurzelverzeichnis (Formatierung, Linter, TypeScript).

## Kontakt

Bei Fragen, Anmerkungen oder Rückmeldungen melde dich gerne. Meine Kontaktdaten findest du hier: https://nilshartmann.net/kontakt
