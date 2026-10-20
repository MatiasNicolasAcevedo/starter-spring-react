#!/usr/bin/env bash
# Compatibility entry: starter tooling plus real Playwright. Daily app gate calls e2e.sh directly.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
CHILD='' SIGNAL_CODE=0
on_signal() { SIGNAL_CODE=$1; [[ -z "$CHILD" ]] || kill -TERM "$CHILD" 2>/dev/null || true; }
trap 'on_signal 130' INT
trap 'on_signal 143' TERM
trap 'on_signal 129' HUP
run() {
  local stage_started=$SECONDS
  "$@" & CHILD=$!
  local code=0
  while true; do
    code=0; wait "$CHILD" || code=$?
    kill -0 "$CHILD" 2>/dev/null || break
  done
  CHILD=''
  printf 'TIMING integration=%s seconds=%s exit=%s\n' "$*" "$((SECONDS - stage_started))" "$code"
  [[ "$SIGNAL_CODE" == 0 ]] || exit "$SIGNAL_CODE"
  return "$code"
}
run bash scripts/verify-tooling.sh
run bash scripts/e2e.sh
