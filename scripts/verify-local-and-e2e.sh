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
  "$@" & CHILD=$!
  local code=0
  while true; do
    code=0; wait "$CHILD" || code=$?
    kill -0 "$CHILD" 2>/dev/null || break
  done
  CHILD=''
  [[ "$SIGNAL_CODE" == 0 ]] || exit "$SIGNAL_CODE"
  return "$code"
}
run node --test scripts/probe-dev-stack.test.mjs
run bash scripts/test-local-guards.sh
run bash scripts/test-dev-stack.sh nginx
run bash scripts/test-dev-stack.sh vite
run bash scripts/test-dev-stack-failures.sh
run bash scripts/test-local-copy.sh
run node scripts/test-auth-proxies.mjs
exec bash scripts/e2e.sh
