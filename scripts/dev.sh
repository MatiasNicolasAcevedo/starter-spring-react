#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
source scripts/lib/local-stack.sh
export MSYS_NO_PATHCONV=1
unset COMPOSE_FILE COMPOSE_PROFILES COMPOSE_ENV_FILES COMPOSE_PROJECT_NAME
ACTION=${1:-}; [[ $# == 0 ]] || shift
MODE='' PROXY='' PROJECT='' ENV_FILE=scripts/fixtures/local.env.example
declare -A SEEN
while [[ $# -gt 0 ]]; do
  [[ $# -ge 2 && -z "${SEEN[$1]:-}" ]] || { local_error 'Invalid local CLI arguments.'; exit 2; }
  SEEN[$1]=1
  case "$1" in
    --mode) MODE=$2 ;; --proxy) PROXY=$2 ;; --project) PROJECT=$2 ;; --env-file) ENV_FILE=$2 ;;
    *) local_error 'Invalid local CLI arguments.'; exit 2 ;;
  esac
  shift 2
done
[[ "$MODE" == local && "$PROXY" =~ ^(nginx|vite)$ && "$ACTION" =~ ^(up|check|down)$ &&
   "$PROJECT" =~ ^starter-dev-[a-z0-9][a-z0-9-]{0,47}$ && "$PROJECT" != starter-dev-auth-* ]] || {
  local_error 'Usage: dev.sh up|check|down --mode local --proxy nginx|vite --project starter-dev-<unique> [--env-file local-parameters]'; exit 2;
}
[[ -f "$ENV_FILE" && "$(basename "$ENV_FILE")" != .env ]] || { local_error 'Explicit local parameters file required; .env is forbidden.'; exit 2; }
# Only literal documented parameters; never execute file contents or load Google credentials.
export CLIENT_PORT=5175 CLIENT_DEV_PORT=5176 LOCAL_OIDC_PORT=8090 STARTER_API_DOCS_ENABLED=false
declare -A KEYS
while IFS= read -r line || [[ -n "$line" ]]; do
  line=${line%$'\r'}
  [[ -n "$line" && "$line" != \#* ]] || continue
  [[ "$line" =~ ^(CLIENT_PORT|CLIENT_DEV_PORT|LOCAL_OIDC_PORT|STARTER_API_DOCS_ENABLED)=([a-z0-9]+)$ ]] || { local_error 'Invalid local parameter (values withheld).'; exit 2; }
  key=${BASH_REMATCH[1]} value=${BASH_REMATCH[2]}
  [[ -z "${KEYS[$key]:-}" ]] || { local_error 'Duplicate local parameter.'; exit 2; }
  KEYS[$key]=1
  if [[ "$key" == STARTER_API_DOCS_ENABLED ]]; then
    [[ "$value" == true || "$value" == false ]] || { local_error 'Invalid documentation switch.'; exit 2; }
  else
    [[ "$value" =~ ^[1-9][0-9]{3,4}$ && "$value" -ge 1024 && "$value" -le 65535 ]] || { local_error 'Invalid local port.'; exit 2; }
  fi
  export "$key=$value"
done < "$ENV_FILE"
[[ "$CLIENT_PORT" != "$CLIENT_DEV_PORT" && "$LOCAL_OIDC_PORT" != "$CLIENT_PORT" && "$LOCAL_OIDC_PORT" != "$CLIENT_DEV_PORT" ]] || { local_error 'Local ports must be distinct.'; exit 2; }
SERVICE=client PUBLIC_PORT=$CLIENT_PORT
[[ "$PROXY" != vite ]] || { SERVICE=client-dev; PUBLIC_PORT=$CLIENT_DEV_PORT; }
export APP_PUBLIC_URL="http://127.0.0.1:$PUBLIC_PORT" STARTER_LOCAL_PROXY=$PROXY STARTER_LOCAL_SOURCE="$(pwd -P)"
export POSTGRES_DB=starter_auth_test POSTGRES_USER=starter_auth_test POSTGRES_PASSWORD=fictitious-auth-test-only
export GOOGLE_CLIENT_ID='' GOOGLE_CLIENT_SECRET=''
COMPOSE_ARGS=(compose --env-file scripts/fixtures/auth-test.env.example -p "$PROJECT"
  -f docker-compose.yml -f compose.auth-test.yml -f compose.local.yml --profile oidc --profile dev --profile local)
local_validate_resources
case "$ACTION" in
  up)
    # A repeated up must not rebuild/recreate a live owned stack or discard its in-memory session.
    live=1
    for service in db oidc server "$SERVICE"; do
      [[ -n "$(docker container ls -q --filter "label=com.docker.compose.project=$PROJECT" --filter "label=com.docker.compose.service=$service")" ]] || live=0
    done
    if [[ "$live" == 1 ]]; then
      local_compose run --rm --no-deps local-probe
      echo "Local development already running: $PROJECT $PROXY $APP_PUBLIC_URL."
      exit 0
    fi
    BEFORE_CONTAINERS="$(local_resources container | tr '\n' ' ')"
    BEFORE_NETWORKS="$(local_resources network | tr '\n' ' ')"
    BEFORE_VOLUMES="$(local_resources volume | tr '\n' ' ')"
    trap local_rollback EXIT
    trap 'local_signal 130' INT
    trap 'local_signal 143' TERM
    trap 'local_signal 129' HUP
    local_port_guard "$SERVICE" "$PUBLIC_PORT"
    local_port_guard oidc "$LOCAL_OIDC_PORT"
    local_compose build server "$SERVICE"
    local_compose up -d --wait --wait-timeout 300 db oidc server "$SERVICE"
    # Provider has no in-image healthcheck: bounded protocol checks from a pinned runner.
    deadline=$((SECONDS + 60))
    until local_compose run --rm --no-deps local-probe; do
      [[ "$SECONDS" -lt "$deadline" ]] || { local_error 'Local readiness deadline exceeded.'; exit 1; }
      sleep 1 & LOCAL_CHILD=$!; wait "$LOCAL_CHILD"; LOCAL_CHILD=''
    done
    echo "Local development ready: $PROJECT $PROXY $APP_PUBLIC_URL (down preserves its data)." ;;
  check|down)
    [[ -n "$(local_resources volume)" ]] || { local_error 'Unknown local project; no resources changed.'; exit 2; }
    if [[ "$ACTION" == check ]]; then
      for service in db oidc server "$SERVICE"; do
        [[ -n "$(docker container ls -q --filter "label=com.docker.compose.project=$PROJECT" --filter "label=com.docker.compose.service=$service")" ]] || { local_error 'Local service unavailable.'; exit 1; }
      done
      local_compose run --rm --no-deps local-probe
    else
      local_compose down --timeout 10
      [[ -z "$(local_resources container)" && -z "$(local_resources network)" ]] || { local_error 'Local down incomplete.'; exit 1; }
      echo 'Local development stopped; owned data volume preserved.'
    fi ;;
esac
