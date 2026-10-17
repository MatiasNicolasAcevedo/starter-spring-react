#!/usr/bin/env bash
# Critical refusal controls use only this assay's fresh, fictitious sentinel resources.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
export MSYS_NO_PATHCONV=1
PROJECT="starter-dev-guards-$(date +%s)-$$"
SENTINEL="starter-dev-guards-sentinel-$(date +%s)-$$"
task_temp="$(mktemp -d)"
resources() { local flags=-q; [[ "$1" != container ]] || flags=-aq; docker "$1" ls "$flags" --filter "label=com.docker.compose.project=$2"; }
for project in "$PROJECT" "$SENTINEL"; do
  for kind in container network volume; do [[ -z "$(resources "$kind" "$project")" ]] || exit 2; done
done
cleanup() {
  local original=$? failed=0 id
  trap - EXIT INT TERM HUP
  for id in $(resources container "$SENTINEL"); do docker container rm -f "$id" >/dev/null || failed=1; done
  for project in "$PROJECT" "$SENTINEL"; do
    for kind in container network volume; do [[ -z "$(resources "$kind" "$project")" ]] || failed=1; done
  done
  rm -f "$task_temp/parameters" "$task_temp/.env" "$task_temp/executed"; rmdir "$task_temp"
  [[ "$original" != 0 || "$failed" == 0 ]] || original=1
  exit "$original"
}
trap cleanup EXIT
args=(--mode local --proxy nginx --project "$PROJECT")
reject() {
  local code=0
  bash scripts/dev.sh "$@" >/dev/null 2>&1 || code=$?
  [[ "$code" == 2 ]] || { echo 'Expected local guard rejection absent.' >&2; exit 1; }
  for kind in container network volume; do [[ -z "$(resources "$kind" "$PROJECT")" ]] || exit 1; done
}
for parameters in 'GOOGLE_CLIENT_SECRET=fictitious-canary' 'APP_PUBLIC_URL=http://example.invalid' 'CLIENT_PORT=80' 'CLIENT_PORT=65536' 'CLIENT_PORT=15177
CLIENT_PORT=15178' 'CLIENT_PORT=15177
LOCAL_OIDC_PORT=15177' 'STARTER_API_DOCS_ENABLED=yes'; do
  printf '%s\n' "$parameters" > "$task_temp/parameters"
  reject up "${args[@]}" --env-file "$task_temp/parameters"
done
printf 'CLIENT_PORT=$(touch "%s/executed")\n' "$task_temp" > "$task_temp/parameters"
reject up "${args[@]}" --env-file "$task_temp/parameters"
[[ ! -e "$task_temp/executed" ]]
printf '%s\n' 'CLIENT_PORT=15177' > "$task_temp/.env"
reject up "${args[@]}" --env-file "$task_temp/.env"
reject up "${args[@]}" --mode local
reject up --mode google --proxy nginx --project "$PROJECT"
reject up --mode local --proxy nginx --project starter
printf '%s\n' CLIENT_PORT=15177 CLIENT_DEV_PORT=15178 LOCAL_OIDC_PORT=18091 > "$task_temp/parameters"
id="$(docker run -d --label "com.docker.compose.project=$SENTINEL" -p 127.0.0.1:15177:43210 node:24.21.0-alpine node -e 'setInterval(()=>{},1000)')"
reject up "${args[@]}" --env-file "$task_temp/parameters"
[[ "$(resources container "$SENTINEL")" == "${id:0:12}" ]]
[[ "$(docker container inspect --format '{{.State.Running}}' "$id")" == true ]]
echo 'B1: invalid parameters/mode/namespace/duplicate flags/occupied port rejected; sentinel unchanged; target 0/0/0.'
