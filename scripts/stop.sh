#!/usr/bin/env bash
# Beendet Frontend, API-Server und Chat-Server. Gesucht wird der Prozess, der
# auf dem jeweiligen Port lauscht. Hilft, wenn ein Prozess nach dem Schließen
# der IDE oder des Terminals weiterläuft und den Port belegt.
#
# Aufruf: scripts/stop.sh          beendet alle drei
#         scripts/stop.sh 26081    beendet nur den Prozess auf diesem Port
# `pnpm dev:server` und `pnpm dev:frontend` rufen es vor dem Start für ihren
# eigenen Port auf.
set -uo pipefail

stop_port() {
  local port=$1
  local pids
  pids=$(lsof -ti "tcp:$port" -sTCP:LISTEN)
  if [ -z "$pids" ]; then
    return
  fi
  kill $pids
  # Warten, bis der Port frei ist, sonst scheitert ein direkt folgender Start
  for _ in $(seq 1 30); do
    if ! lsof -ti "tcp:$port" -sTCP:LISTEN >/dev/null; then
      break
    fi
    sleep 0.1
  done
  echo "Prozess auf :$port beendet, PID $(echo $pids)."
}

if [ $# -gt 0 ]; then
  for port in "$@"; do
    stop_port "$port"
  done
else
  stop_port 26000
  stop_port 26080
  stop_port 26081
fi
