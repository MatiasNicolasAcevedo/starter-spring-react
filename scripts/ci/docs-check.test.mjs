// Real workspace mutations prove that a generic handoff cannot inherit verification.
import { after, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const temporary = mkdtempSync(join(tmpdir(), 'starter-docs-check-'));
const excluded = new Set(['.git', 'plantilla', 'node_modules', 'target', 'dist', 'coverage', 'artifacts', '__pycache__']);
cpSync(root, temporary, { recursive: true, filter: (source) => !excluded.has(basename(source)) });
const originals = new Map(['docs/HANDOFF.md', 'docs/STATUS.md', 'docs/BACKLOG.md',
  'docs/tasks/T-000-starter-extraction.md', '.github/workflows/ci.yml', '.github/workflows/full.yml',
  'scripts/verify.sh'].map(path => [path, readFileSync(join(temporary, path), 'utf8')]));
const change = (path, transform) => writeFileSync(join(temporary, path), transform(originals.get(path)));
const run = () => spawnSync(process.execPath, ['scripts/docs-check.mjs'], { cwd: temporary, encoding: 'utf8' });
const rejects = (pattern) => {
  const result = run();
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, pattern);
};
afterEach(() => { for (const [path, text] of originals) writeFileSync(join(temporary, path), text); });
after(() => rmSync(temporary, { recursive: true, force: true }));

test('current generic contract passes without Git or the local kit', () => {
  const result = run();
  assert.equal(result.status, 0, result.stderr);
});
test('remote FULL cannot become automatic', () => {
  change('.github/workflows/full.yml', text => text.replace('  workflow_dispatch:', '  pull_request:'));
  rejects(/FULL remoto debe ser exclusivamente manual/);
});
test('local FULL cannot lose E2E while remote CI becomes lighter', () => {
  change('scripts/verify.sh', text => text.replace('FULL) echo "docs server client e2e"', 'FULL) echo "docs server client"'));
  rejects(/FULL no ejecuta la suite e2e/);
});
test('manual aggregate rejects a missing E2E dependency', () => {
  change('.github/workflows/full.yml', text => text.replace('needs: [classify, docs, server, client, e2e]', 'needs: [classify, docs, server, client]'));
  rejects(/full-result no depende de e2e/);
});
test('automatic CI retains the required check name', () => {
  change('.github/workflows/ci.yml', text => text.replace('  verify-required:', '  renamed:'));
  rejects(/falta check requerido verify-required/);
});
test('a missing criterion rejects the handoff', () => {
  change('docs/HANDOFF.md', text => text.replace(/^\| O-01 .*\n/m, ''));
  rejects(/falta el criterio O-01/);
});
test('duplicate criteria reject the handoff', () => {
  change('docs/HANDOFF.md', text => text + text.match(/^\| O-01 .*$/m)[0] + '\n');
  rejects(/criterio repetido O-01/);
});
test('unknown criteria reject the handoff', () => {
  change('docs/HANDOFF.md', text => text.replace('| O-01 |', '| O-09 |'));
  rejects(/criterio desconocido O-09/);
});
test('inherited evidence cannot be declared verified', () => {
  change('docs/HANDOFF.md', text => text.replace('| heredado |', '| verificado |'));
  rejects(/requiere evidencia propia fechada/);
});
test('a completed verdict cannot bypass pending criteria and tasks', () => {
  change('docs/HANDOFF.md', text => text.replace('`NO_LISTO`', '`STARTER_VALIDADO`'));
  rejects(/STARTER_VALIDADO exige 22\/22/);
});
test('STATUS must report the actual handoff count', () => {
  change('docs/STATUS.md', text => text.replace('0/22 verificados', '22/22 verificados'));
  rejects(/distinto de HANDOFF/);
});
test('backlog and task state must agree', () => {
  change('docs/tasks/T-000-starter-extraction.md', text => text.replace(/status: \w+/, 'status: blocked'));
  rejects(/frontmatter dice blocked/);
});
test('a second active task is rejected', () => {
  // Arrange two active tasks regardless of the live board's current lifecycle state.
  change('docs/tasks/T-000-starter-extraction.md', text => text.replace(/^status: \w+/m, 'status: in_progress'));
  const path = join(temporary, 'docs/tasks/T-001-local-stack.md');
  const old = readFileSync(path, 'utf8');
  try {
    writeFileSync(path, old.replace(/^status: \w+/m, 'status: in_progress'));
    assert.match(readFileSync(path, 'utf8'), /^status: in_progress$/m);
    rejects(/más de una tarea en vuelo/);
  } finally { writeFileSync(path, old); }
});
