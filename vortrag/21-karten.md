# 21: Suchergebnis als Karte der Pinnwand

Prompt zum Testen:

```
Ich habe im Juli Zeit und wohne in Hamburg. Wer sucht dort jemanden für sein Tier?
```

So zeigst du den Schritt:

1. Öffne vorher die Devtools und zeig den Aufruf von `gesucheSuchen` aus dem
   letzten Gespräch: die Argumente (`ort: "Hamburg"`, `zeitraum: "Juli"`) und
   das Ergebnis. Dieses Ergebnis wird gleich zur Karte.
2. Zeig im Editor das `outputSchema` und danach `part.output` in der
   Komponente. Fahr mit der Maus darüber: Der Typ kommt aus dem Schema.
3. Schick den Prompt ab. Unter der Antwort stehen die Gesuche als Karten, wie
   auf der Pinnwand. Ein Klick auf eine Karte führt zum Gesuch.
4. Die Warnung in der Konsole ist weg. Der neue Satz im Systemprompt
   verhindert, dass der Text die Gesuche noch einmal aufzählt.
