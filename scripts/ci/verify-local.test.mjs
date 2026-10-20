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
for (const [file, suite] of [['e2e.sh', 'e2e'], ['verify-tooling.sh', 'tooling'], ['verify-local-and-e2e.sh', 'legacy']]) {
  writeFileSync(join(scripts, file), `#!/usr/bin/env bash
echo ${suite} >> "$CALLS"
[[ "${suite}" != "$FAIL_SUITE" ]]
`);
}
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

let runIndex = 0;
function run(failSuite, args = []) {
  const calls = join(workspace, `calls-${++runIndex}-${failSuite || 'green'}.txt`);
  const inherited = Object.fromEntries(Object.entries(process.env).filter(([key]) => key.toUpperCase() !== 'PATH'));
  const result = spawnSync(bash, ['scripts/verify.sh', ...args], {
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

for (const [args, expected] of [
  [[], ['docs', 'server', 'client', 'e2e']],
  [['--starter'], ['docs', 'server', 'client', 'tooling', 'e2e']],
  [['--tooling'], ['tooling']],
  [['--e2e'], ['e2e']],
  [['--fast'], ['docs', 'server', 'client']],
]) {
  test(`profile ${args.join(' ') || 'application'} executes its actual runners exactly once`, () => {
    const result = run('', args);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.deepEqual(result.calls, expected);
  });
}
test('starter gate stops at a tooling failure before Playwright', () => {
  const result = run('tooling', ['--starter']);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.deepEqual(result.calls, ['docs', 'server', 'client', 'tooling']);
});

test('actual tooling entry runs every retained regression and stops on failure', () => {
  const dir = mkdtempSync(join(tmpdir(), 'starter-tooling-entry-'));
  try {
    mkdirSync(join(dir, 'scripts'));
    mkdirSync(join(dir, 'bin'));
    copyFileSync(fileURLToPath(new URL('../verify-tooling.sh', import.meta.url)), join(dir, 'scripts/verify-tooling.sh'));
    const shellCommands = ['test-init-copy.sh', 'test-local-guards.sh', 'test-dev-stack.sh',
      'test-dev-stack-failures.sh', 'test-local-copy.sh', 'test-auth-proxies-signals.sh', 'test-auth-proxies.sh'];
    const fixture = '#!/usr/bin/env bash\ncommand="${0##*/} $*"\necho "$command" >> "$CALLS"\n[[ "$command" != "$FAIL_COMMAND" ]]\n';
    for (const command of shellCommands) writeFileSync(join(dir, 'scripts', command), fixture);
    writeFileSync(join(dir, 'bin/node'), '#!/usr/bin/env bash\necho "node $*" >> "$CALLS"\n');
    chmodSync(join(dir, 'bin/node'), 0o755);
    const expected = ['node --test scripts/probe-dev-stack.test.mjs', 'node --test scripts/test-init-project.mjs',
      'test-init-copy.sh ', 'test-local-guards.sh ', 'test-dev-stack.sh nginx', 'test-dev-stack.sh vite',
      'test-dev-stack-failures.sh ', 'test-local-copy.sh ', 'test-auth-proxies-signals.sh ', 'test-auth-proxies.sh '];
    for (const fail of ['', 'test-dev-stack.sh nginx']) {
      const calls = join(dir, `calls-${fail ? 'red' : 'green'}`);
      const inherited = Object.fromEntries(Object.entries(process.env).filter(([key]) => key.toUpperCase() !== 'PATH'));
      const result = spawnSync(bash, ['scripts/verify-tooling.sh'], { cwd: dir, encoding: 'utf8',
        env: { ...inherited, PATH: `${join(dir, 'bin')}${delimiter}${process.env.PATH}`,
          CALLS: calls.replaceAll('\\', '/'), FAIL_COMMAND: fail } });
      assert.ifError(result.error);
      assert.equal(result.status, fail ? 1 : 0, result.stdout + result.stderr);
      const actual = readFileSync(calls, 'utf8').trimEnd().split(/\r?\n/).map(line => line.trim());
      assert.deepEqual(actual, (fail ? expected.slice(0, 5) : expected).map(line => line.trim()));
      assert.match(result.stdout, /TIMING integration=/);
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
