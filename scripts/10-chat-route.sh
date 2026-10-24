#!/usr/bin/env bash
# Ruft die Chat-Route des Chat-Servers auf, so wie es später useChat tut. Der
# Body ist ein AG-UI-RunAgentInput. Fehlt eins der Felder, antwortet der Server
# mit 500. Zurück kommen AG-UI-Events.
#
# Aufruf: scripts/10-chat-route.sh ["Frage"]
# Der Chat-Server muss laufen (pnpm dev:server).
set -euo pipefail

frage="${1:-Was ist hütly? Ein Satz.}"
frage_json=$(node -e 'console.log(JSON.stringify(process.argv[1]))' "$frage")

curl -sN localhost:26081/api/chat -d '{
  "threadId": "t1", "runId": "r1",
  "messages": [{ "id": "m1", "role": "user", "content": '"$frage_json"' }],
  "tools": [], "context": [], "state": {}, "forwardedProps": {}
}'
echo
