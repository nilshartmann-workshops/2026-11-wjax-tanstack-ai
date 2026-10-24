# 20: Server-Tool gesucheSuchen über die Fassade

Prompt zum Testen:

```
Ich habe im Juli Zeit und wohne in Hamburg. Wer sucht dort jemanden für sein Tier?
```

So zeigst du den Schritt:

1. Schick den Prompt vor der Änderung ab. Das Modell kann nicht suchen und
   sagt, es habe keinen Zugriff auf Gesuche. In der Konsole steht nichts Neues.
2. Schreib das Tool. Der Chat-Server startet von selbst neu. Klick auf „Neues
   Gespräch“ und schick denselben Prompt noch einmal ab. Die Antwort nennt
   jetzt echte Gesuche aus Hamburg: die Landschildkröten in Altona und die
   zwei Katzen in Barmbek.
3. Über der Antwort steht eine leere Pfote. Sie ist die Nachricht mit dem
   Aufruf des Tools, für den es noch keine Komponente gibt.
4. Öffne die Konsole des Browsers. Dort steht die Warnung
   `Missing tools.gesucheSuchen component`. Das Ergebnis selbst bleibt im
   Chat unsichtbar.
5. Im Terminal des Chat-Servers steht `gesucheSuchen` mit dem Filter, den das
   Modell geschickt hat. Daneben stehen `TOOL_CALL_START`, `TOOL_CALL_ARGS`
   und `TOOL_CALL_RESULT` und danach der zweite Durchlauf des Modells.

Fallstrick: Ohne „Neues Gespräch“ schickt `useChat` die alte Antwort mit, und
das Modell bleibt womöglich dabei, dass es keinen Zugriff hat.

Das Ergebnis des Tools zeigst du anschließend in den Devtools.
