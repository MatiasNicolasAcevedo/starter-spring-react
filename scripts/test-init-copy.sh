#!/usr/bin/env bash
# D: current non-ignored sources -> disposable copy -> initialize -> real backend/client verification.
# Never a nested FULL, never a new repository or persistent application data.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
export MSYS_NO_PATHCONV=1
task_snapshot="$(mktemp -d "${TMPDIR:-/tmp}/starter-d-copy.XXXXXX")"
task_copy_root="$(cd "$task_snapshot" && pwd -P)"
PROJECT="starter-verify-init-$(date +%s)-$$"
CHILD=''
resources() { local flags=-q; [[ "$1" != container ]] || flags=-aq; docker "$1" ls "$flags" --filter "label=com.docker.compose.project=$PROJECT"; }
for kind in container network volume; do existing="$(resources "$kind")" || exit 2; [[ -z "$existing" ]] || exit 2; done
cleanup() {
  local original=$? failed=0 kind id ids remaining
  trap - EXIT INT TERM HUP
  if [[ -n "$CHILD" ]]; then kill -TERM "$CHILD" 2>/dev/null || true; wait "$CHILD" 2>/dev/null || true; fi
  for kind in container network volume; do
    ids="$(resources "$kind")" || { failed=1; continue; }
    for id in $ids; do
      if [[ "$kind" == container ]]; then docker container rm -f "$id" >/dev/null || failed=1
      else docker "$kind" rm "$id" >/dev/null || failed=1; fi
    done
    remaining="$(resources "$kind")" || failed=1
    [[ -z "$remaining" ]] || failed=1
  done
  if [[ -d "$task_snapshot" && ! -L "$task_snapshot" && "$(cd "$task_snapshot" && pwd -P)" == "$task_copy_root"
    && "${task_copy_root##*/}" == starter-d-copy.* ]]; then
    rm -rf -- "$task_copy_root" || failed=1
  else failed=1; fi
  [[ "$original" != 0 || "$failed" == 0 ]] || original=1
  if [[ "$failed" == 0 ]]; then echo "D copy: cleanup labels container/network/volume=0/0/0; result=$original"
  else echo "D copy: cleanup FAILED; result=$original"; fi
  exit "$original"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
trap 'exit 129' HUP
git ls-files --cached --others --exclude-standard -z > "$task_snapshot/files"
while IFS= read -r -d '' path; do
  [[ "$path" != plantilla/* && "$path" != .git/* && ! -L "$path" ]] || exit 2
done < "$task_snapshot/files"
tar -cf "$task_snapshot/source.tar" --null -T "$task_snapshot/files"
mkdir "$task_snapshot/repo"
tar -xf "$task_snapshot/source.tar" -C "$task_snapshot/repo"
[[ ! -e "$task_snapshot/repo/plantilla" && ! -e "$task_snapshot/repo/.git" && ! -e "$task_snapshot/repo/.env" ]]
native_snapshot="$task_snapshot"
if command -v cygpath >/dev/null 2>&1; then native_snapshot="$(cygpath -m "$task_snapshot")"; fi
node --input-type=module - "$native_snapshot/repo" <<'NODE'
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const identity = JSON.parse(readFileSync('project-identity.json', 'utf8'));
if (identity.initialized) console.log('D copy: existing product copied without reinitalizing its edited context/code');
else {
  const result = spawnSync(process.execPath, ['scripts/init-project.mjs', '--root', process.argv[2], '--name', 'Agenda Demo', '--slug', 'agenda-demo', '--package', 'org.demo.agenda', '--holder', 'Equipo Demo'], { encoding: 'utf8' });
  if (result.status !== 0) { process.stderr.write(result.stderr); process.exit(result.status ?? 1); }
  const applied = spawnSync(process.execPath, ['scripts/init-project.mjs', '--root', process.argv[2], '--name', 'Agenda Demo', '--slug', 'agenda-demo', '--package', 'org.demo.agenda', '--holder', 'Equipo Demo', '--apply'], { stdio: 'inherit' });
  if (applied.status !== 0) process.exit(applied.status ?? 1);
}
NODE
node --input-type=module - "$native_snapshot" <<'NODE'
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { TEXT_FILES, RESET_FILES, ARCHIVE_FILES, IDENTITY_FILE } from './scripts/lib/init-project-manifest.mjs';
const temp = process.argv[2];
const mutable = new Set([...TEXT_FILES, ...RESET_FILES, ...ARCHIVE_FILES, IDENTITY_FILE]);
let preserved = 0;
for (const path of readFileSync(join(temp, 'files')).toString().split('\0').filter(Boolean)) {
  if (mutable.has(path) || /^server\/src\/(main|test)\/java\//.test(path)) continue;
  assert.deepEqual(readFileSync(join(temp, 'repo', path)), readFileSync(path), `changed immutable source: ${path}`);
  preserved++;
}
// POM identity is the sole Maven difference; all dependencies/plugins/versions/scopes stay byte-identical.
const initialized = JSON.parse(readFileSync('project-identity.json', 'utf8')).initialized;
let pom = readFileSync(join(temp, 'repo/server/pom.xml'), 'utf8').replace(/\r\n/g, '\n');
if (!initialized) pom = pom.replace('<groupId>org.demo</groupId>', '<groupId>com.example</groupId>')
    .replace('<artifactId>agenda-demo-server</artifactId>', '<artifactId>starter-server</artifactId>')
    .replace('<name>Agenda Demo Server</name>', '<name>Starter Server</name>');
assert.equal(pom, readFileSync('server/pom.xml', 'utf8').replace(/\r\n/g, '\n'));
console.log(`D copy: ${preserved} immutable source files identical, including locks/wrappers/migrations/auth; POM inventory identical`);
NODE
run() {
  "$@" & CHILD=$!
  local code=0; wait "$CHILD" || code=$?; CHILD=''; return "$code"
}
cd "$task_snapshot/repo"
node scripts/docs-check.mjs
run node --test scripts/test-init-adopted.mjs scripts/ci/docs-check.test.mjs
run docker compose --env-file .env.example -p "$PROJECT" --profile verify run --rm server-tests ./mvnw -B -ntp spotless:check clean verify
run docker compose --env-file .env.example -p "$PROJECT" --profile verify run --build --rm client-tests
echo 'D copy: personalized backend clean verify + client verify + docs-check PASS; not adoption E.'
