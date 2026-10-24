#!/usr/bin/env bash
# Fragt Claude direkt über die API von Anthropic, ohne TanStack AI, mit
# System-Prompt und gestreamt. Die Antwort kommt als Server-Sent Events im
# Format von Anthropic.
#
# Aufruf: scripts/05-anthropic-direkt.sh ["Frage"]
# Der Schlüssel kommt aus HUETLY_ANTHROPIC_API_KEY und erscheint nicht auf dem
# Bildschirm. Gibt es die Datei ~/huetly-key.sh, wird sie vorher geladen.
set -euo pipefail

if [ -f ~/huetly-key.sh ]; then
  source ~/huetly-key.sh
fi

if [ -z "${HUETLY_ANTHROPIC_API_KEY:-}" ]; then
  echo "HUETLY_ANTHROPIC_API_KEY ist nicht gesetzt." >&2
  exit 1
fi

frage="${1:-Was ist hütly? Ein Satz.}"
frage_json=$(node -e 'console.log(JSON.stringify(process.argv[1]))' "$frage")

system="Du bist der Assistent von hütly, einer Plattform für Haustier- und Pflanzenbetreuung.
Antworte auf Deutsch, kurz und freundlich."
system_json=$(node -e 'console.log(JSON.stringify(process.argv[1]))' "$system")

curl -sN https://api.anthropic.com/v1/messages \
  -H "x-api-key: $HUETLY_ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-5-5",
    "max_tokens": 300,
    "stream": true,
    "system": '"$system_json"',
    "messages": [{ "role": "user", "content": '"$frage_json"' }]
  }'
echo
