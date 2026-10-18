#!/usr/bin/env bash
# Interrupt the actual proxy phase, never a mock. --verify exercises the complete gate prefix as well.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
export MSYS_NO_PATHCONV=1
task_dir=$(mktemp -d)
task_pid='' task_project=''
resources() {
  local flags=-q
  [[ "$1" != container ]] || flags=-aq
  docker "$1" ls "$flags" --filter "label=com.docker.compose.project=$task_project"
}
cleanup() {
  local original=$?
  trap - EXIT
  if [[ -n "$task_pid" ]]; then kill -TERM "$task_pid" 2>/dev/null || true; wait "$task_pid" || true; fi
  # Emergency teardown only AFTER recording a failed assertion. Never turns a red result green.
  if [[ -n "$task_project" ]]; then
    docker compose --env-file scripts/fixtures/auth-test.env.example -p "$task_project" \
      -f docker-compose.yml -f compose.auth-test.yml -f scripts/fixtures/compose.proxy-test.yml \
      --profile dev down --volumes --remove-orphans > "$task_dir/cleanup.log" 2>&1 || original=1
    for kind in container network volume; do [[ -z "$(resources "$kind")" ]] || original=1; done
  fi
  rm -f "$task_dir/run.log" "$task_dir/cleanup.log"
  rmdir "$task_dir"
  exit "$original"
}
trap cleanup EXIT
case "${1:-}" in
  --verify) command=(bash scripts/verify.sh --e2e) ;;
  '') command=(bash scripts/test-auth-proxies.sh) ;;
  *) exit 2 ;;
esac
"${command[@]}" > "$task_dir/run.log" 2>&1 & task_pid=$!
deadline=$((SECONDS + 1800))
until [[ -n "$task_project" ]]; do
  task_project=$(sed -n 's/^Proxy assay project=\(starter-auth-proxy-[0-9]*-[0-9]*\)$/\1/p' "$task_dir/run.log" | head -n 1 | tr -d '\r')
  [[ "$SECONDS" -lt "$deadline" ]] && kill -0 "$task_pid" 2>/dev/null || { echo 'Proxy phase did not start' >&2; exit 1; }
  sleep 0.2
done
[[ "$task_project" =~ ^starter-auth-proxy-[0-9]+-[0-9]+$ ]] || exit 2
deadline=$((SECONDS + 300))
until [[ $(resources container | wc -w) == 3 ]]; do
  [[ "$SECONDS" -lt "$deadline" ]] && kill -0 "$task_pid" 2>/dev/null || exit 1
  sleep 0.2
done
kill -TERM "$task_pid"
code=0; wait "$task_pid" || code=$?; task_pid=''
counts=()
for kind in container network volume; do
  ids=$(resources "$kind")
  counts+=("$(printf '%s' "$ids" | wc -w | tr -d ' ')")
done
printf 'Proxy SIGTERM: exit=%s; container-a/network/volume=%s/%s/%s; project=%s\n' "$code" "${counts[@]}" "$task_project"
[[ "$code" == 143 ]]
[[ "${counts[*]}" == '0 0 0' ]]
grep -q 'Proxy worker interrupted at operation boundary (143).' "$task_dir/run.log"
! grep -q 'Proxy contract passed' "$task_dir/run.log"
if [[ "${1:-}" == --verify ]]; then
  grep -q 'e2e     INTERRUMPIDA (señal; exit 143 tras su cleanup)' "$task_dir/run.log"
  ! grep -q 'Proxy phase cleanup failed.' "$task_dir/run.log"
fi
