#!/usr/bin/env bash
# Real engine assays; no host Node/Maven/browser required. All resources are new and fictitious.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
export MSYS_NO_PATHCONV=1
PROXY=${1:?nginx or vite required}
[[ "$PROXY" == nginx || "$PROXY" == vite ]] || exit 2
PROJECT="starter-dev-b1-$PROXY-$(date +%s)-$$"
if [[ -n "${STARTER_LOCAL_TEST_PREFIX:-}" ]]; then
  [[ "$STARTER_LOCAL_TEST_PREFIX" =~ ^starter-dev-test-[a-z0-9][a-z0-9-]{0,25}$ ]] || exit 2
  PROJECT="$STARTER_LOCAL_TEST_PREFIX-$PROXY"
fi
SENTINEL="starter-dev-b1-sentinel-$(date +%s)-$$"
export STARTER_LOCAL_PROXY=$PROXY STARTER_LOCAL_SOURCE="$(pwd -P)" LOCAL_OIDC_PORT=18090
export APP_PUBLIC_URL=http://127.0.0.1:15175
[[ "$PROXY" != vite ]] || export APP_PUBLIC_URL=http://127.0.0.1:15176
export STARTER_LOCAL_ARTIFACTS="$(pwd)/e2e/artifacts/$PROJECT"
if command -v cygpath >/dev/null 2>&1; then export STARTER_LOCAL_ARTIFACTS="$(cygpath -m "$STARTER_LOCAL_ARTIFACTS")"; fi
export CLIENT_PORT=15175 CLIENT_DEV_PORT=15176 STARTER_API_DOCS_ENABLED=true
args=(--mode local --proxy "$PROXY" --project "$PROJECT" --env-file scripts/fixtures/local-assay.env.example)
compose_args=(compose --env-file scripts/fixtures/auth-test.env.example -p "$PROJECT" -f docker-compose.yml -f compose.auth-test.yml -f compose.local.yml --profile oidc --profile dev --profile local)
TASK_CHILD='' BROWSER_PID=''
compose() {
  docker "${compose_args[@]}" "$@" & TASK_CHILD=$!
  local code=0; wait "$TASK_CHILD" || code=$?; TASK_CHILD=''; return "$code"
}
dev() {
  bash scripts/dev.sh "$@" & TASK_CHILD=$!
  local code=0; wait "$TASK_CHILD" || code=$?; TASK_CHILD=''; return "$code"
}
browser_async() {
  docker "${compose_args[@]}" run --rm --no-deps local-browser node harness/local-stack.mjs "$1" & BROWSER_PID=$!
}
wait_marker() {
  local deadline=$((SECONDS + 30))
  until [[ -f "$STARTER_LOCAL_ARTIFACTS/$1" ]]; do
    [[ "$SECONDS" -lt "$deadline" ]] && kill -0 "$BROWSER_PID" 2>/dev/null || return 1
    sleep 0.2
  done
}
fingerprint() { compose exec -T db psql -U starter_auth_test -d starter_auth_test -Atc "SELECT id::text || '|' || created_at::text FROM app_user ORDER BY id"; }
resources() {
  local flags=-q
  [[ "$1" != container ]] || flags=-aq
  docker "$1" ls "$flags" --filter "label=com.docker.compose.project=$2"
}
for project in "$PROJECT" "$SENTINEL"; do
  for kind in container network volume; do [[ -z "$(resources "$kind" "$project")" ]] || exit 2; done
done
[[ ! -e "$STARTER_LOCAL_ARTIFACTS" ]] || exit 2
task_temp="$(mktemp -d)"
# The CLI and portable browser assay must remain usable when these host tools are unavailable.
for tool in node mvn psql; do printf '#!/usr/bin/env bash\nexit 77\n' > "$task_temp/$tool"; chmod +x "$task_temp/$tool"; done
export PATH="$task_temp:$PATH"
cleanup() {
  local original=$? failed=0 kind ids
  trap - EXIT INT TERM HUP
  for pid in "$TASK_CHILD" "$BROWSER_PID"; do
    if [[ -n "$pid" ]]; then kill -TERM "$pid" 2>/dev/null || true; wait "$pid" 2>/dev/null || true; fi
  done
  if [[ -f "$task_temp/source.tsx" ]]; then cp "$task_temp/source.tsx" client/src/features/system/SystemInfoPanel.tsx || failed=1; fi
  # These namespaces were absent before the trap. Only exact project labels are eligible.
  for project in "$PROJECT" "$SENTINEL"; do
    for kind in container network volume; do
      ids="$(resources "$kind" "$project")" || { failed=1; continue; }
      for id in $ids; do
        if [[ "$kind" == container ]]; then docker container rm -f "$id" >/dev/null || failed=1
        else docker "$kind" rm "$id" >/dev/null || failed=1; fi
      done
      [[ -z "$(resources "$kind" "$project")" ]] || failed=1
    done
  done
  rm -f "$task_temp/node" "$task_temp/mvn" "$task_temp/psql" "$task_temp/source.tsx"; rmdir "$task_temp"
  [[ "$failed" == 0 ]] || echo 'Local assay cleanup failed.' >&2
  [[ "$original" != 0 || "$failed" == 0 ]] || original=1
  exit "$original"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
trap 'exit 129' HUP
# On Linux, a bind source created by Docker belongs to root; host-side IPC/HMR must remain writable.
mkdir -p "$STARTER_LOCAL_ARTIFACTS"
expect_rejected() {
  local code=0
  dev "$@" > /dev/null 2>&1 || code=$?
  [[ "$code" != 0 ]] || { echo 'Unsafe local operation was accepted.' >&2; exit 1; }
}
docker volume create --label "com.docker.compose.project=$SENTINEL" "${SENTINEL}_db-data" >/dev/null
expect_rejected up --mode local --proxy "$PROXY" --project "$SENTINEL"
docker volume inspect "${SENTINEL}_db-data" >/dev/null
expect_rejected up --mode local --proxy "$PROXY" --project starter-dev-auth-forbidden
expect_rejected up --proxy "$PROXY" --project "$PROJECT"
expect_rejected down "${args[@]}"
dev up "${args[@]}"
volume="$(resources volume "$PROJECT")"
[[ -n "$volume" ]]
containers="$(resources container "$PROJECT" | sort)"
dev up "${args[@]}"
[[ "$containers" == "$(resources container "$PROJECT" | sort)" ]]
dev check "${args[@]}"
compose build local-browser
compose run --rm --no-deps local-browser
row="$(fingerprint)"
[[ "$row" =~ ^[a-f0-9-]{36}\| && "$(echo "$row" | wc -l)" == 1 ]]
for action in restart rebuild; do
  if [[ "$action" == restart ]]; then compose restart server
  else compose up -d --build --force-recreate --wait --wait-timeout 300 server; fi
  compose up -d --wait --wait-timeout 300 server
  compose run --rm --no-deps local-browser node harness/local-stack.mjs expired-login
  [[ "$row" == "$(fingerprint)" ]]
done
containers="$(resources container "$PROJECT" | sort)"
expect_rejected down --mode local --proxy "$([[ "$PROXY" == nginx ]] && echo vite || echo nginx)" --project "$PROJECT" --env-file scripts/fixtures/local-assay.env.example
[[ "$containers" == "$(resources container "$PROJECT" | sort)" ]]
compose run --rm --no-deps local-browser node harness/local-stack.mjs swagger
for width in 1280 375; do
  rm -f "$STARTER_LOCAL_ARTIFACTS/outage-ready" "$STARTER_LOCAL_ARTIFACTS/outage-down" "$STARTER_LOCAL_ARTIFACTS/outage-restart" "$STARTER_LOCAL_ARTIFACTS/outage-restart-ready" "$STARTER_LOCAL_ARTIFACTS/outage-up"
  browser_async "outage-$width"
  wait_marker outage-ready
  compose stop db
  wait_marker outage-down
  code=0; dev check "${args[@]}" >/dev/null 2>&1 || code=$?
  [[ "$code" != 0 ]]
  # Start the unchanged recovery window before start, after the separate negative check.
  touch "$STARTER_LOCAL_ARTIFACTS/outage-restart"
  wait_marker outage-restart-ready
  compose start db
  wait_marker outage-up
  wait "$BROWSER_PID"; BROWSER_PID=''
  dev check "${args[@]}"
done
if [[ "$PROXY" == vite ]]; then
  cp client/src/features/system/SystemInfoPanel.tsx "$task_temp/source.tsx"
  cp "$task_temp/source.tsx" "$STARTER_LOCAL_ARTIFACTS/SystemInfoPanel.original.tsx"
  browser_async hmr
  wait_marker hmr-ready
  sed 's/Servidor conectado/Servidor HMR ficticio/' "$task_temp/source.tsx" > client/src/features/system/SystemInfoPanel.tsx
  wait_marker hmr-observed
  cp "$task_temp/source.tsx" client/src/features/system/SystemInfoPanel.tsx
  wait "$BROWSER_PID"; BROWSER_PID=''
fi
dev down "${args[@]}"
[[ -z "$(resources container "$PROJECT")" && -z "$(resources network "$PROJECT")" && "$volume" == "$(resources volume "$PROJECT")" ]]
dev down "${args[@]}"
dev up "${args[@]}"
[[ "$volume" == "$(resources volume "$PROJECT")" ]]
dev check "${args[@]}"
compose run --rm --no-deps local-browser node harness/local-stack.mjs expired-login
[[ "$row" == "$(fingerprint)" ]]
dev down "${args[@]}"
echo "B1: $PROXY idempotence/ownership/down-up/volume preservation passed; cleanup follows by exact labels."
