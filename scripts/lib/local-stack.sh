#!/usr/bin/env bash
# No implicit .env, no adoption by name, no persistent-volume removal in normal lifecycle.
local_error() { echo "$1" >&2; return 2; }
local_resources() {
  local flags=-q
  [[ "$1" != container ]] || flags=-aq
  docker "$1" ls "$flags" --filter "label=com.docker.compose.project=$PROJECT"
}
local_owned() {
  local kind=$1 id=$2 labels
  labels='{{index .Labels "io.starter.local.owner"}}|{{index .Labels "io.starter.local.source"}}|{{index .Labels "io.starter.local.mode"}}|{{index .Labels "io.starter.local.proxy"}}|{{index .Labels "io.starter.local.origin"}}|{{index .Labels "io.starter.local.oidc-port"}}|{{index .Labels "com.docker.compose.project"}}'
  [[ "$kind" != container ]] || labels="${labels//.Labels/.Config.Labels}"
  [[ "$(docker "$kind" inspect --format "$labels" "$id")" == "v1|$STARTER_LOCAL_SOURCE|local|$PROXY|$APP_PUBLIC_URL|$LOCAL_OIDC_PORT|$PROJECT" ]] ||
    local_error 'Local project ownership mismatch; no resources changed.'
}
local_validate_resources() {
  local kind id ids
  for kind in container network volume; do
    ids="$(local_resources "$kind")" || return 1
    for id in $ids; do local_owned "$kind" "$id" || return 2; done
  done
  # Validate expected names too: an unlabelled resource must not be silently adopted by Compose.
  for kind in network volume; do
    local name="${PROJECT}_default"
    [[ "$kind" != volume ]] || name="${PROJECT}_db-data"
    if docker "$kind" inspect "$name" >/dev/null 2>&1; then local_owned "$kind" "$name" || return 2; fi
  done
  for id in db oidc server client client-dev; do
    local name="${PROJECT}-${id}-1"
    if docker container inspect "$name" >/dev/null 2>&1; then local_owned container "$name" || return 2; fi
  done
}
local_compose() {
  docker "${COMPOSE_ARGS[@]}" "$@" &
  LOCAL_CHILD=$!
  local code=0
  wait "$LOCAL_CHILD" || code=$?
  LOCAL_CHILD=''
  return "$code"
}
local_signal() {
  if [[ -n "${LOCAL_CHILD:-}" ]]; then
    kill -TERM "$LOCAL_CHILD" 2>/dev/null || true
    wait "$LOCAL_CHILD" 2>/dev/null || true
    LOCAL_CHILD=''
  fi
  exit "$1"
}
local_rollback() {
  local original=$? failed=0 kind id ids previous
  trap - EXIT INT TERM HUP
  if [[ "$original" != 0 ]]; then
    for kind in container network volume; do
      ids="$(local_resources "$kind")" || { failed=1; continue; }
      case "$kind" in container) previous=$BEFORE_CONTAINERS ;; network) previous=$BEFORE_NETWORKS ;; volume) previous=$BEFORE_VOLUMES ;; esac
      for id in $ids; do
        [[ " $previous " != *" $id "* ]] || continue
        if local_owned "$kind" "$id"; then
          if [[ "$kind" == container ]]; then docker container rm -f "$id" >/dev/null || failed=1
          else docker "$kind" rm "$id" >/dev/null || failed=1; fi
        else failed=1; fi
      done
    done
  fi
  [[ "$failed" == 0 ]] || echo 'Local rollback failed; inspect only this project labels.' >&2
  # Preserve original failure/signal. A cleanup failure never reports success.
  [[ "$original" != 0 || "$failed" == 0 ]] || original=1
  exit "$original"
}
local_port_guard() {
  local service=$1 port=$2 running
  running="$(docker container ls -q --filter "label=com.docker.compose.project=$PROJECT" --filter "label=com.docker.compose.service=$service")" || return 1
  [[ -z "$running" ]] || return 0
  # Real bind on loopback, before build/up. --rm removes this short-lived guard even on process failure.
  docker run --rm --label "com.docker.compose.project=$PROJECT" \
    --label io.starter.local.owner=v1 --label "io.starter.local.source=$STARTER_LOCAL_SOURCE" \
    --label io.starter.local.mode=local --label "io.starter.local.proxy=$PROXY" \
    --label "io.starter.local.origin=$APP_PUBLIC_URL" --label "io.starter.local.oidc-port=$LOCAL_OIDC_PORT" \
    -p "127.0.0.1:$port:43210" node:24.21.0-alpine node -e 'process.exit(0)' >/dev/null 2>&1 ||
    local_error 'Local port unavailable; no application resources started.'
}
