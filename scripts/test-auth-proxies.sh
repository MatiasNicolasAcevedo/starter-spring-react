#!/usr/bin/env bash
# Signal owner for the real proxy matrix. Native Node on Windows cannot catch external TERM.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
export MSYS_NO_PATHCONV=1
export STARTER_PROXY_PROJECT="starter-auth-proxy-$(date +%s%3N)-$$"
project=$STARTER_PROXY_PROJECT
resources() {
  local flags=-q
  [[ "$1" != container ]] || flags=-aq
  docker "$1" ls "$flags" --filter "label=com.docker.compose.project=$project"
}
# Reject reuse before installing any teardown.
for kind in container network volume; do
  ids=$(resources "$kind")
  [[ -z "$ids" ]] || exit 2
done
task_dir=$(mktemp -d)
export STARTER_PROXY_STOP_FILE="$task_dir/signal"
if command -v cygpath >/dev/null 2>&1; then STARTER_PROXY_STOP_FILE=$(cygpath -m "$STARTER_PROXY_STOP_FILE"); fi
CHILD='' SIGNAL_CODE=0
on_signal() {
  [[ "$SIGNAL_CODE" != 0 ]] || SIGNAL_CODE=$1
  # Let the in-flight Compose operation finish, then the worker stops at its next boundary.
  # Killing native Node would orphan that operation and bypass finally on Windows.
  printf '%s' "$SIGNAL_CODE" > "$task_dir/signal"
}
trap 'on_signal 130' INT
trap 'on_signal 143' TERM
trap 'on_signal 129' HUP
wait_worker() {
  local code=0
  while true; do
    code=0; wait "$CHILD" || code=$?
    kill -0 "$CHILD" 2>/dev/null || break
  done
  CHILD=''
  return "$code"
}
cleanup() {
  local original=$? failed=0 ids
  trap - EXIT
  [[ -z "$CHILD" ]] || wait_worker || true
  # Also owns cleanup if the worker failed before reaching its finally block.
  docker compose --env-file scripts/fixtures/auth-test.env.example -p "$project" \
    -f docker-compose.yml -f compose.auth-test.yml --profile dev \
    down --volumes --remove-orphans || failed=1
  for kind in container network volume; do
    ids=$(resources "$kind") || { failed=1; continue; }
    [[ -z "$ids" ]] || failed=1
  done
  rm -f "$task_dir/signal"
  rmdir "$task_dir"
  [[ "$failed" == 0 ]] || { echo 'Proxy phase cleanup failed.' >&2; [[ "$original" != 0 ]] || original=1; }
  [[ "$SIGNAL_CODE" == 0 ]] || original=$SIGNAL_CODE
  exit "$original"
}
trap cleanup EXIT
[[ "$SIGNAL_CODE" == 0 ]] || exit "$SIGNAL_CODE"
node scripts/test-auth-proxies.mjs "$@" & CHILD=$!
code=0; wait_worker || code=$?
exit "$code"
