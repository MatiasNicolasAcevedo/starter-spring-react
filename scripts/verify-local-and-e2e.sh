#!/usr/bin/env bash
# FULL integration entry. An incomplete local lifecycle must fail the same e2e job; no extra check/protection.
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
run node --test scripts/probe-dev-stack.test.mjs
run node --test scripts/test-init-project.mjs
run bash scripts/test-init-copy.sh
run bash scripts/test-local-guards.sh
run bash scripts/test-dev-stack.sh nginx
run bash scripts/test-dev-stack.sh vite
run bash scripts/test-dev-stack-failures.sh
run bash scripts/test-local-copy.sh
run bash scripts/test-auth-proxies-signals.sh
run bash scripts/test-auth-proxies.sh
run bash scripts/e2e.sh
