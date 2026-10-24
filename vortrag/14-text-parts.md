# 14: useAppChat im Chat-Panel, Text-Parts rendern

Prompt zum Testen:

```
Hallo! Was kannst du für mich tun?
```

Die Antwort erscheint Stück für Stück im Panel. In der Konsole des Browsers
stehen je Nachricht `Message` und je Text-Part `Part`.

## Netzwerk-Tab, Terminal und Message

- Im Netzwerk-Tab steht der rohe Strom: ein AG-UI-Event je `data:`-Zeile, mit
  `messageId`, `timestamp` und Angaben zum Modell.
- Im Terminal des Chat-Servers stehen dieselben Events. Die Middleware gibt
  davon nur `type`, `delta` und den Namen eines Tools aus.
- `useChat` setzt die Events zu Nachrichten zusammen: `{ id, role, parts }`.
  Jedes `TEXT_MESSAGE_CONTENT` hängt sein `delta` an `part.content` an.
  Einzelne Events, Zeitstempel und Angaben zum Modell sind darin nicht mehr
  enthalten.

Deshalb steht `Message` während des Streamings mehrfach in der Konsole, jedes
Mal mit etwas mehr Text.

Die `threadId` ist frei gewählt. Sie darf sich zwischen zwei Renderings nicht
ändern, sonst legt `useChat` einen neuen Client an, und das Gespräch ist leer.
In den Devtools erscheint sie als Name des Chats.
