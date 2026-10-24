# 10: Chat-Route im Server

## Die Route mit curl aufrufen

```bash
scripts/10-chat-route.sh
```

```bash
scripts/10-chat-route.sh "Wie heißt du?"
```

Der Chat-Server muss laufen. Er schreibt jeden AG-UI-Event ins Terminal.

```bash
pnpm dev:server
```

Das Skript schickt einen Request, wie ihn später `useChat` schickt. Der Body
ist ein AG-UI-`RunAgentInput`. Fehlt eins der Felder, antwortet der Server
mit 500.

## Die Route zeigen

Die Route steht schon im Startpunkt. Gezeigt wird sie, nicht getippt:

- `server/src/chat-server.ts`: die Route mit `chat()`. Das Ergebnis geht mit
  `toServerSentEventsResponse()` zurück.
- `server/src/chat-server-config.ts`: Adapter, System-Prompt und Middleware.
  Die Route übergibt sie mit `...chatOptions` an `chat()`.

Erzählen:

- Die Events heißen jetzt für jeden Anbieter gleich: `RUN_STARTED`,
  `TEXT_MESSAGE_START`, `TEXT_MESSAGE_CONTENT`, `TEXT_MESSAGE_END`,
  `RUN_FINISHED`. Das ist AG-UI.
- Der Denkteil kommt als `REASONING_…`. Bei Claude ist der Text leer und
  steckt verschlüsselt in `REASONING_ENCRYPTED_VALUE`.
- `hütly` kennt das Modell erst, sobald der System-Prompt gefüllt ist
  (siehe unten).
- Die `threadId` in `RUN_STARTED` ist `t1`, die Route reicht sie durch.
  `chat()` verlangt sie, ohne sie kompiliert die Route nicht.
- Im Terminal des Chat-Servers stehen dieselben Events, mitgeschrieben von
  einer Middleware in `server/src/log-events.ts`.

## Den System-Prompt füllen

Im Startpunkt steht in `server/src/system-prompt.ts` nur ein Platzhalter.
Frag zuerst mit dem Platzhalter:

```bash
scripts/10-chat-route.sh "Was ist hütly? Ein Satz."
```

Ersetze den Platzhalter durch diese Sätze und frag noch einmal:

```
Du bist der Assistent von hütly, einer Plattform für Haustier- und Pflanzenbetreuung.
Antworte auf Deutsch, kurz und freundlich.
```

## Den Adapter live wechseln

```bash
HUETLY_MODEL=sonnet pnpm dev:server
```

```bash
HUETLY_MODEL=gemma pnpm dev:server
```
