# 60: Ein Modell nach Drehbuch und ein Test mit fakeText

Den Chat-Server mit dem Drehbuch statt mit einem Modell starten:

```bash
HUETLY_MODEL=fake pnpm dev:server
```

Prompts zum Testen, die das Drehbuch versteht:

```
Gibt es Katzensitter in Hamburg im Juli?
```

```
Wer sucht jemanden für Reptilien?
```

```
Antworte auf das erste
```

Den Test im Terminal laufen lassen:

```bash
cd server && pnpm test
```
