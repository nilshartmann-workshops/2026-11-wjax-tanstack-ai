# 05: Ein Modell ohne TanStack AI

Bevor TanStack AI ins Spiel kommt: So antwortet ein Modell, wenn man es
direkt fragt. Ein Aufruf an Claude mit `curl`, mit System-Prompt und
gestreamt.

Das Skript lädt `~/huetly-key.sh`, wenn es die Datei gibt. Sonst muss
`HUETLY_ANTHROPIC_API_KEY` im Terminal exportiert sein. Der Schlüssel
erscheint so nicht auf dem Bildschirm.

```bash
scripts/05-anthropic-direkt.sh
```

Mit eigener Frage: `scripts/05-anthropic-direkt.sh "Wie heißt du?"`

Erzählen:

- Der System-Prompt ist nur ein Feld. Mehr weiß das Modell über unsere
  Anwendung nicht.
- Die Antwort kommt nicht am Stück, sondern als Server-Sent Events:
  `message_start`, `content_block_start`, viele `content_block_delta` mit ein
  paar Zeichen, `message_stop`.
- Ein Ladezustand mit „lädt“ und „fertig“ bildet das nicht ab.
- Das Format ist das von Anthropic. Ollama, OpenAI und Gemini streamen je
  anders.

## Die Überleitung

TanStack AI übersetzt in beide Richtungen: Zum Modell hin spricht ein Adapter
das Format des Anbieters, zur Oberfläche hin kommen immer AG-UI-Events, aus
denen `useChat` im Browser Nachrichten zusammensetzt.
