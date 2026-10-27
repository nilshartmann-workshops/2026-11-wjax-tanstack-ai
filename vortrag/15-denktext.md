# 15: Denktext mit reasoning und thinking-Part

Prompt zum Testen:

```
Ich habe drei Schildkröten und bin im Juli zwei Wochen weg. Worauf muss ich bei einer Betreuung achten?
```

Über der Antwort steht aufgeklappt „Gedanken des Assistenten“. In der Konsole
hat die Nachricht jetzt einen Part vom Typ `thinking` vor dem Text.

Im System-Prompt steht ein neuer Satz: „Überlege vor jeder Suche kurz, wonach
du suchst und warum.“ Ohne ihn denkt das Modell bei den Suchen nicht
zuverlässig nach.

## Was der Denktext ist

Das Modell denkt zuerst und antwortet danach. Gedanken und Antwort laufen nie
gleichzeitig. Gemessen am 2026-11-03 mit Sonnet und dem Prompt oben:

| ms | Event |
|---|---|
| 1722 | `RUN_STARTED`, `REASONING_START` |
| 3112–3361 | erster Schub `REASONING_MESSAGE_CONTENT` |
| 4403–4405 | zweiter Schub, fast alles auf einmal |
| 4406 | `TEXT_MESSAGE_START` |
| 4406–8051 | die Antwort |

Der Denktext ist nicht der rohe Gedankengang. Bei `summary: true` schickt
Claude eine Zusammenfassung, die ein separates Modell schreibt. Sie kommt in
Schüben, der größte direkt vor der Antwort. Oft ist sie englisch, auch wenn
das Gespräch deutsch ist. Der eigentliche Gedankengang steht verschlüsselt in
`REASONING_ENCRYPTED_VALUE`.

Erzählen: „Das Modell denkt erst und antwortet dann. Bei Claude sehen wir
dabei eine Zusammenfassung der Gedanken, nicht die Gedanken selbst, und die
kommt in Schüben. Bei einer so einfachen Frage ist sie kurz.“
