# 22: Server-Tool angeboteSuchen

Prompts zum Testen, nacheinander im selben Gespräch:

```
Ich bin im Juli zwei Wochen weg und brauche in Hamburg jemanden für meine Katzen.
```

```
Ich wohne in Hamburg-Barmbek und habe im Juli zwei Wochen Zeit. Mit Katzen kenne ich mich aus, mit Reptilien gar nicht. Welches Gesuch passt am besten zu mir?
```

Definition und `.server()` liegen schon fertig im Startpunkt, in
`shared/tool-definitions/angebote-suchen-definition.ts` und
`server/src/server-tools/angebote-suchen-tool.ts`. Sie folgen demselben
Muster wie `gesucheSuchen`.

So zeigst du den Schritt:

1. Zeig kurz die Definition. Erzählen: Die Pinnwand steckt im Toolnamen,
   nicht in einem Enum. Für die Wahl hat das Modell nur Name und
   `description`.
2. Trag `angeboteSuchenTool` im Chat-Server in `tools` ein
   (`server/src/chat-server-config.ts`).
3. Trag `angeboteSuchenToolDef` im Browser in `chatOptions.tools` ein.
   Der Compiler meldet sofort, dass in `toolsComponents` der Eintrag
   `angeboteSuchen` fehlt.
4. Ergänze die Karte und schick den ersten Prompt ab. Das Modell ruft
   `angeboteSuchen` auf, und die Karte „Zwei Katzen gleichzeitig sind kein
   Problem“ aus Barmbek erscheint.
5. Zeig den Denktext. Darin steht, wie das Modell sich für die Pinnwand
   entscheidet.
6. Schick den zweiten Prompt ab. Jetzt wählt das Modell `gesucheSuchen`.

Der Satz im System-Prompt („Wenn der Nutzer erzählt, …“) steht im Commit,
live kannst du ihn übergehen. Ergänze ihn erst, wenn das Modell zurückfragt,
statt zu suchen.
