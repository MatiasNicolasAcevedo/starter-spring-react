#!/usr/bin/env bash
# Separate bounded failure assays, after B1's normal lifecycle. Own fresh namespaces only.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
export MSYS_NO_PATHCONV=1
export STARTER_LOCAL_DOCKER="$(command -v docker)"
task_temp="$(mktemp -d)"
PROJECT="starter-dev-b1-fault-$(date +%s)-$$"
TASK_CHILD=''
run_dev() {
  # Background children otherwise inherit ignored SIGINT; reset before the shell installs its actual traps.
  env --default-signal=INT,TERM,HUP bash scripts/dev.sh "$@" & TASK_CHILD=$!
  local code=0; wait "$TASK_CHILD" || code=$?; TASK_CHILD=''; return "$code"
}
args=(--mode local --proxy nginx --project "$PROJECT" --env-file scripts/fixtures/local-failures.env.example)
resources() {
  local flags=-q; [[ "$1" != container ]] || flags=-aq
  "$STARTER_LOCAL_DOCKER" "$1" ls "$flags" --filter "label=com.docker.compose.project=$PROJECT"
}
for kind in container network volume; do [[ -z "$(resources "$kind")" ]] || exit 2; done
cleanup() {
  local original=$? failed=0 kind id
  trap - EXIT INT TERM HUP
  if [[ -n "$TASK_CHILD" ]]; then kill -TERM "$TASK_CHILD" 2>/dev/null || true; wait "$TASK_CHILD" 2>/dev/null || true; fi
  for kind in container network volume; do
    for id in $(resources "$kind"); do
      if [[ "$kind" == container ]]; then "$STARTER_LOCAL_DOCKER" container rm -f "$id" >/dev/null || failed=1
      else "$STARTER_LOCAL_DOCKER" "$kind" rm "$id" >/dev/null || failed=1; fi
    done
    [[ -z "$(resources "$kind")" ]] || failed=1
  done
  rm -f "$task_temp/docker"; rmdir "$task_temp"
  [[ "$original" != 0 || "$failed" == 0 ]] || original=1
  exit "$original"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
trap 'exit 129' HUP
cp scripts/fixtures/docker-local-fault.sh "$task_temp/docker"
chmod +x "$task_temp/docker"
export PATH="$task_temp:$PATH"
for scenario in build up readiness build-TERM startup-TERM INT TERM HUP cleanup; do
  export STARTER_LOCAL_FAULT=$scenario
  code=0
  log="${TMPDIR:-/tmp}/starter-B-b1-$scenario-$PROJECT.log"
  run_dev up "${args[@]}" > "$log" 2>&1 || code=$?
  case "$scenario" in
    INT) [[ "$code" == 130 ]] ;; TERM) [[ "$code" == 143 ]] ;; HUP) [[ "$code" == 129 ]] ;;
    build-TERM) [[ "$code" == 143 ]] ;;
    startup-TERM) [[ "$code" == 143 ]]; grep -Fq 'Local startup signal after real partial' "$log" ;;
    build) [[ "$code" != 0 ]]; grep -Fq 'Dockerfile.intentionally-absent-T-001' "$log" ;;
    up) [[ "$code" != 0 ]]; grep -Fq 'exited (42)' "$log" ;;
    readiness) [[ "$code" != 0 ]]; grep -Fq 'Local readiness deadline exceeded.' "$log" ;;
    cleanup) [[ "$code" != 0 ]]; grep -Fq 'Local rollback failed;' "$log" ;;
  esac
  for kind in container network volume; do [[ -z "$(resources "$kind")" ]] || exit 1; done
  echo "B1: $scenario exit=$code, rollback 0/0/0"
done
export STARTER_LOCAL_FAULT=''
run_dev up "${args[@]}"
run_dev down "${args[@]}"
volume="$(resources volume)"
[[ -n "$volume" ]]
export STARTER_LOCAL_FAULT=up
code=0
run_dev up "${args[@]}" > "${TMPDIR:-/tmp}/starter-B-b1-preserve-$PROJECT.log" 2>&1 || code=$?
[[ "$code" != 0 && "$volume" == "$(resources volume)" && -z "$(resources container)" && -z "$(resources network)" ]]
export STARTER_LOCAL_FAULT=''
run_dev up "${args[@]}"
run_dev check "${args[@]}"
for service in server client; do
  id="$("$STARTER_LOCAL_DOCKER" container ls -aq --filter "label=com.docker.compose.project=$PROJECT" --filter "label=com.docker.compose.service=$service")"
  [[ -n "$id" ]]
  "$STARTER_LOCAL_DOCKER" container rm -f "$id" >/dev/null
done
partial="$(resources container | sort)"
network="$(resources network)"
[[ -n "$partial" && -n "$network" ]]
export STARTER_LOCAL_FAULT=up
code=0
run_dev up "${args[@]}" > "${TMPDIR:-/tmp}/starter-B-b1-partial-$PROJECT.log" 2>&1 || code=$?
[[ "$code" != 0 && "$partial" == "$(resources container | sort)" && "$network" == "$(resources network)" && "$volume" == "$(resources volume)" ]]
export STARTER_LOCAL_FAULT=''
run_dev up "${args[@]}"
run_dev check "${args[@]}"
run_dev down "${args[@]}"
echo 'B1: failed up preserved previous owned containers/network/volume; next up/check/down recovered; cleanup follows.'
