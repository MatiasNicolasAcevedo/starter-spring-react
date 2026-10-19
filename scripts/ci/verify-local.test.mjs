// Exercise the actual gate with harmless runners in an isolated directory: no Docker or application data.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const workspace = mkdtempSync(join(tmpdir(), 'starter-local-gate-'));
const scripts = join(workspace, 'scripts');
const bin = join(workspace, 'bin');
mkdirSync(scripts);
mkdirSync(bin);
copyFileSync(fileURLToPath(new URL('../verify.sh', import.meta.url)), join(scripts, 'verify.sh'));
writeFileSync(join(scripts, 'verify-local-and-e2e.sh'), '#!/usr/bin/env bash\necho e2e >> "$CALLS"\nexit 0\n');
writeFileSync(join(bin, 'docker'), `#!/usr/bin/env bash
if [[ "$*" == *" down "* ]]; then exit 0; fi
suite=""
for arg in "$@"; do
  case "$arg" in docs-check) suite=docs;; server-tests) suite=server;; client-tests) suite=client;; esac
done
[[ -n "$suite" ]] || exit 99
echo "$suite" >> "$CALLS"
[[ "$suite" != "$FAIL_SUITE" ]]
`);
chmodSync(join(bin, 'docker'), 0o755);
after(() => rmSync(workspace, { recursive: true, force: true }));
const bash = process.platform === 'win32' ? 'C:/Program Files/Git/bin/bash.exe' : 'bash';

function run(failSuite) {
  const calls = join(workspace, `calls-${failSuite || 'green'}.txt`);
  const inherited = Object.fromEntries(Object.entries(process.env).filter(([key]) => key.toUpperCase() !== 'PATH'));
  const result = spawnSync(bash, ['scripts/verify.sh'], {
    cwd: workspace, encoding: 'utf8',
    env: { ...inherited, PATH: `${bin}${delimiter}${process.env.PATH}`, CALLS: calls.replaceAll('\\', '/'),
      FAIL_SUITE: failSuite, STARTER_SERVER_TESTS: 'container' },
  });
  assert.ifError(result.error);
  assert.ok(existsSync(calls), result.stdout + result.stderr);
  return { ...result, calls: readFileSync(calls, 'utf8').trim().split(/\r?\n/) };
}

test('FULL still executes docs, backend, client and E2E when every suite succeeds', () => {
  const result = run('');
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.deepEqual(result.calls, ['docs', 'server', 'client', 'e2e']);
});

for (const [suite, expected] of [['docs', ['docs']], ['server', ['docs', 'server']], ['client', ['docs', 'server', 'client']]]) {
  test(`FULL stops after ${suite} fails and never starts subsequent suites`, () => {
    const result = run(suite);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.deepEqual(result.calls, expected);
    assert.match(result.stdout, /NO EJECUTADA \(fallo previo\)/);
    assert.match(result.stdout, /FALLÓ \(exit 1\)/);
  });
}
