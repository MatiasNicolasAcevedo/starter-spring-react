#!/usr/bin/env bash
# Snapshot tracked and new non-ignored sources, never .git/kit/reports/dependencies. No new repository.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
export MSYS_NO_PATHCONV=1
task_snapshot="$(mktemp -d "${TMPDIR:-/tmp}/starter-b-copy.XXXXXX")"
task_copy_root="$(cd "$task_snapshot" && pwd -P)"
PROJECT="starter-dev-copy-$(date +%s)-$$"
CHILD=''
resources() { local flags=-q; [[ "$1" != container ]] || flags=-aq; docker "$1" ls "$flags" --filter "label=com.docker.compose.project=$PROJECT"; }
for kind in container network volume; do [[ -z "$(resources "$kind")" ]] || exit 2; done
cleanup() {
  local original=$? failed=0 kind id
  trap - EXIT INT TERM HUP
  if [[ -n "$CHILD" ]]; then kill -TERM "$CHILD" 2>/dev/null || true; wait "$CHILD" 2>/dev/null || true; fi
  for kind in container network volume; do
    for id in $(resources "$kind"); do
      if [[ "$kind" == container ]]; then docker container rm -f "$id" >/dev/null || failed=1
      else docker "$kind" rm "$id" >/dev/null || failed=1; fi
    done
    [[ -z "$(resources "$kind")" ]] || failed=1
  done
  # Resolve and verify the exact mktemp target before recursive removal, including on Windows.
  if [[ -d "$task_snapshot" && ! -L "$task_snapshot" && "$(cd "$task_snapshot" && pwd -P)" == "$task_copy_root"
    && "${task_copy_root##*/}" == starter-b-copy.* ]]; then
    rm -rf -- "$task_copy_root" || failed=1
  else failed=1; fi
  [[ "$original" != 0 || "$failed" == 0 ]] || original=1
  exit "$original"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
trap 'exit 129' HUP
git ls-files --cached --others --exclude-standard -z > "$task_snapshot/files"
while IFS= read -r -d '' path; do
  [[ "$path" != plantilla/* && "$path" != .git/* ]] || exit 2
done < "$task_snapshot/files"
tar -cf "$task_snapshot/source.tar" --null -T "$task_snapshot/files"
mkdir "$task_snapshot/repo"
tar -xf "$task_snapshot/source.tar" -C "$task_snapshot/repo"
[[ ! -e "$task_snapshot/repo/plantilla" && ! -e "$task_snapshot/repo/.git" ]]
dev() {
  (cd "$task_snapshot/repo" && exec bash scripts/dev.sh "$@" --mode local --proxy nginx --project "$PROJECT" --env-file scripts/fixtures/local-copy.env.example) &
  CHILD=$!
  local code=0; wait "$CHILD" || code=$?; CHILD=''; return "$code"
}
dev up
dev check
volume="$(resources volume)"
[[ -n "$volume" ]]
dev down
[[ -z "$(resources container)" && -z "$(resources network)" && "$volume" == "$(resources volume)" ]]
dev up
dev check
dev down
[[ "$volume" == "$(resources volume)" ]]
echo 'B4: source copy without Git/kit ran literal README up/check/down/resume; own cleanup follows.'
