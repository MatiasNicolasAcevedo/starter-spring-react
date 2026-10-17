#!/usr/bin/env bash
# Test adapter: only inject real failures or signals, never fabricate successful Docker/API output.
set -euo pipefail
args=("$@")
case "${STARTER_LOCAL_FAULT:-}" in
  build-TERM|startup-TERM)
    for i in "${!args[@]}"; do
      if [[ "${args[$i]}" == build && "$STARTER_LOCAL_FAULT" == build-TERM ]]; then
        kill -TERM "$PPID"; exit 1
      elif [[ "${args[$i]}" == up && "$STARTER_LOCAL_FAULT" == startup-TERM ]]; then
        "$STARTER_LOCAL_DOCKER" "${args[@]:0:$i}" up -d db oidc
        echo 'Local startup signal after real partial db/oidc creation.'
        kill -TERM "$PPID"; exit 1
      fi
    done ;;
  build|up|cleanup)
    for i in "${!args[@]}"; do
      if [[ "${args[$i]}" == build && "$STARTER_LOCAL_FAULT" == build ]]; then
        args=("${args[@]:0:$i}" -f scripts/fixtures/compose.local-build-failure.yml "${args[@]:$i}"); break
      elif [[ "${args[$i]}" == up && "$STARTER_LOCAL_FAULT" != build ]]; then
        args=("${args[@]:0:$i}" -f scripts/fixtures/compose.local-up-failure.yml "${args[@]:$i}"); break
      fi
    done
    if [[ "$STARTER_LOCAL_FAULT" == cleanup && " $* " == *' container rm '* ]]; then
      "$STARTER_LOCAL_DOCKER" "${args[@]}"
      exit 29
    fi ;;
  readiness|INT|TERM|HUP)
    if [[ " $* " == *' run --rm --no-deps local-probe '* ]]; then
      if [[ "$STARTER_LOCAL_FAULT" == readiness ]]; then
        for i in "${!args[@]}"; do
          if [[ "${args[$i]}" == run ]]; then "$STARTER_LOCAL_DOCKER" "${args[@]:0:$i}" stop oidc >/dev/null; break; fi
        done
      else
        kill -"$STARTER_LOCAL_FAULT" "$PPID"
        exit 1
      fi
    fi ;;
esac
exec "$STARTER_LOCAL_DOCKER" "${args[@]}"
