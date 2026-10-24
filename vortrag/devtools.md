# Devtools für TanStack AI

Prompt zum Testen:

```
Ich habe im Juli Zeit und wohne in Hamburg. Wer sucht dort jemanden für sein Tier?
```

So zeigst du es:

1. Schick den Prompt ab. Im Chat steht über der Antwort eine leere Pfote.
2. Öffne die Devtools und klick links auf `huetly-assistent`.
3. Zeig unter „Conversation“ den Aufruf von `gesucheSuchen`: die Argumente,
   die das Modell gewählt hat, und das Ergebnis, das der Server
   zurückgegeben hat. Genau dieses Ergebnis fehlt im Chat noch.

Der Knopf der Devtools sitzt links unten, ein runder Knopf mit Palme. Ein
Klick öffnet unten das Panel „TanStack Devtools“ mit dem Plugin „TanStack AI“.

Gesehen am 2026-11-03, nach dem Prompt oben:

- Links steht jeder Chat-Hook mit seiner `threadId`, hier `useChat` mit
  `huetly-assistent`, darüber Zähler für Nachrichten, Tools und Läufe.
- Rechts daneben steht der Reiter „Conversation“. Er zeigt das Gespräch so,
  wie es zum Modell geht: die Frage, dann `tool call gesucheSuchen` mit
  „Input“ (`{"ort": "Hamburg", "zeitraum": "Juli"}`) und „Output“, dann
  `tool result` und die Antwort.
- Ganz rechts steht die „User View“, also das, was im Chat zu sehen ist.
