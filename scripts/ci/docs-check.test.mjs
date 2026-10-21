// Real workspace mutations prove that a generic handoff cannot inherit verification.
import { after, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const temporary = mkdtempSync(join(tmpdir(), 'starter-docs-check-'));
const excluded = new Set(['.git', 'plantilla', 'node_modules', 'target', 'dist', 'coverage', 'artifacts', '__pycache__',
  '.orchestrator', '.idea', '.vscode', 'playwright-report', 'test-results', 'blob-report']);
cpSync(root, temporary, { recursive: true, filter: source => {
  const name = basename(source);
  return !excluded.has(name) && !(name.startsWith('.env') && !name.endsWith('.example')) && !/\.(log|local|pem|p12|jks)$/.test(name);
} });
const firstTask = 'docs/tasks/' + readdirSync(join(temporary, 'docs/tasks')).find(name => /^T-\d{3}-.*\.md$/.test(name));
const firstId = firstTask.match(/T-\d{3}/)[0];
const originals = new Map(['docs/HANDOFF.md', 'docs/STATUS.md', 'docs/BACKLOG.md',
  ...readdirSync(join(temporary, 'docs/tasks')).map(name => 'docs/tasks/' + name), '.github/workflows/ci.yml', '.github/workflows/full.yml',
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

// Own the whole board arrangement, including STATUS/WIP, independently of live task states.
const arrangeBoard = (state = 'done', milestone = 'M0') => {
  for (const path of originals.keys()) if (path.startsWith('docs/tasks/')) {
    change(path, text => text.replace(/^status: \w+/m, 'status: done'));
  }
  change(firstTask, text => text.replace(/^status: \w+/m, `status: ${state}`)
    .replace(/^milestone: \w+/m, `milestone: ${milestone}`).replace(/^pr: .*$/m, 'pr: null'));
  change('docs/BACKLOG.md', () => `# Cola\n\n| Tarea | Estado |\n|---|---|\n| [${firstId}](tasks/${firstTask.split('/').pop()}) | ${state} |\n`);
  change('docs/STATUS.md', () => `# Estado\n\n| Tarea y contrato | [${firstId}](${firstTask.replace('docs/', '')}) |\n| Estado | ${state} |\n\n### Prompt de la siguiente sesión\n\x60\x60\x60text\nRetomar ${firstId}.\n\x60\x60\x60\n`);
};
const completeHandoff = () => change('docs/HANDOFF.md', text => text
  .replace('`NO_LISTO`', '`STARTER_VALIDADO`').replace(/— \d+\/22 verificados/, '— 22/22 verificados')
  .replace(/^(\| [A-Z]-\d{2} \|[^|]*\|)[^|]*\|[^|]*\|/gm,
    '$1 verificado | Propia: 2026-10-21 fixture ficticia del checker |'));

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
  change('docs/HANDOFF.md', text => text.replace(/^(\| C-01 \|[^|]*\|)[^|]*\|[^|]*\|/m,
    '$1 verificado | Heredada: sin ejecución propia |'));
  rejects(/requiere evidencia propia fechada/);
});
test('a completed verdict cannot bypass pending criteria and tasks', () => {
  change('docs/HANDOFF.md', text => text.replace('`NO_LISTO`', '`STARTER_VALIDADO`'));
  rejects(/STARTER_VALIDADO exige 22\/22/);
});
test('STATUS must report the actual handoff count', () => {
  change('docs/STATUS.md', text => text + '\nHANDOFF del starter: 22/22 verificados\n');
  rejects(/distinto de HANDOFF/);
});
test('backlog and task state must agree', () => {
  // Legacy tables still validate explicit states; a modern queue need not repeat them.
  arrangeBoard('in_progress');
  writeFileSync(join(temporary, 'docs/BACKLOG.md'), `# Cola\n\n## Bloqueadas\n| Tarea | Estado | Salida |\n|---|---|---|\n| [${firstId}](tasks/${firstTask.split('/').pop()}) | blocked | fixture |\n`);
  rejects(new RegExp(`${firstId} figura como blocked, frontmatter dice`));
});

for (const state of ['draft', 'blocked', 'in_review', 'mergeable', 'done']) {
  test(`H01: coherent ${state} board passes and a real disagreement rejects`, () => {
    arrangeBoard(state);
    let result = run(); assert.equal(result.status, 0, result.stderr);
    writeFileSync(join(temporary, 'docs/BACKLOG.md'), readFileSync(join(temporary, 'docs/BACKLOG.md'), 'utf8')
      .replace(`| ${state} |`, `| ${state === 'blocked' ? 'draft' : 'blocked'} |`));
    rejects(new RegExp(`${firstId} figura como .*frontmatter dice ${state}`));
  });
}

test('H02: complete M0 with future M1 draft passes adoption', () => {
  arrangeBoard(); completeHandoff();
  const result = run(); assert.equal(result.status, 0, result.stderr);
  const path = join(temporary, 'docs/tasks/T-997-future-product.md');
  try {
    writeFileSync(path, `---\nid: T-997\nstatus: draft\nexecutor: junie\nrole: implementer\nmilestone: M1\npr: null\ndepends_on: [${firstId}]\n---\n`);
    const future = run(); assert.equal(future.status, 0, future.stderr);
  } finally { rmSync(path); }
});

for (const state of ['draft', 'ready', 'blocked', 'in_progress', 'in_review', 'changes_requested', 'mergeable']) {
  test(`H02: unfinished M0 ${state} rejects complete criteria`, () => {
    arrangeBoard(state); completeHandoff();
    if (state === 'ready') writeFileSync(join(temporary, firstTask), readFileSync(join(temporary, firstTask), 'utf8')
      .replace(/^depends_on:.*$/m, 'depends_on: []'));
    rejects(/STARTER_VALIDADO exige 22\/22/);
  });
}
test('H02: no M0 cannot validate an empty adoption scope', () => {
  arrangeBoard(); completeHandoff();
  for (const path of originals.keys()) if (path.startsWith('docs/tasks/')) {
    writeFileSync(join(temporary, path), readFileSync(join(temporary, path), 'utf8').replace(/^milestone: M0$/m, 'milestone: M1'));
  }
  rejects(/STARTER_VALIDADO exige 22\/22/);
});
test('H02: completed M0 cannot bypass a pending criterion', () => {
  arrangeBoard(); completeHandoff();
  writeFileSync(join(temporary, 'docs/HANDOFF.md'), readFileSync(join(temporary, 'docs/HANDOFF.md'), 'utf8')
    .replace(/^(\| C-01 \|[^|]*\|) verificado/m, '$1 pendiente').replace('— 22/22', '— 21/22'));
  rejects(/STARTER_VALIDADO exige 22\/22/);
});

test('daily progress updates task and STATUS without rewriting queue or HANDOFF', () => {
  const statusTask = originals.get('docs/STATUS.md').match(/\| Tarea y contrato \|.*?(T-\d{3})/)[1];
  const filename = readdirSync(join(temporary, 'docs/tasks')).find(name => name.startsWith(statusTask + '-'));
  const path = join(temporary, 'docs/tasks', filename), before = readFileSync(path, 'utf8');
  try {
    writeFileSync(path, before.replace(/^status: \w+/m, 'status: in_progress'));
    change('docs/STATUS.md', text => text.replace(/^(\| Estado \|) [a-z_]+ \|/m, '$1 in_progress |'));
    change('docs/BACKLOG.md', () => `# Cola\n\n- [${statusTask}](tasks/${filename}): trabajo actual y próxima dependencia.\n`);
    const result = run(); assert.equal(result.status, 0, result.stderr);
    assert.equal(readFileSync(join(temporary, 'docs/HANDOFF.md'), 'utf8'), originals.get('docs/HANDOFF.md'));
  } finally { writeFileSync(path, before); }
});

test('simplified queue still rejects an unlisted active task and unknown task', () => {
  change('docs/BACKLOG.md', () => '# Cola\n');
  const filename = readdirSync(join(temporary, 'docs/tasks')).find(name => name.startsWith(firstId + '-'));
  change(firstTask, text => text.replace(/^status: \w+/m, 'status: in_progress'));
  rejects(new RegExp(`${firstId} \\(in_progress\\) no figura`));
  change('docs/BACKLOG.md', text => text + `\n- [T-999](tasks/${filename})\n`);
  rejects(/T-999 sin archivo de tarea/);
});

test('STATUS rejects two competing prompts', () => {
  change('docs/STATUS.md', text => text + '\n```text\nOtro prompt\n```\n');
  rejects(/único prompt vigente/);
});

test('small ready task needs no separate spec or cycle counters', () => {
  const path = join(temporary, 'docs/tasks/T-998-small-fixture.md');
  try {
    writeFileSync(path, '---\nid: T-998\nstatus: ready\nexecutor: junie\nrole: implementer\nmilestone: M1\nspec: null\npr: null\ndepends_on: []\n---\n## Objetivo\nBorde observable.\n## Alcance\nUna transformación.\n## Aceptación\nComando y resultado.\n');
    change('docs/BACKLOG.md', text => text + '\n- [T-998](tasks/T-998-small-fixture.md): siguiente.\n');
    const result = run(); assert.equal(result.status, 0, result.stderr);
  } finally { rmSync(path); }
});
test('a second active task is rejected', () => {
  // Arrange two active tasks regardless of the live board's current lifecycle state.
  change(firstTask, text => text.replace(/^status: \w+/m, 'status: in_progress'));
  const path = join(temporary, 'docs/tasks/T-999-negative-fixture.md');
  const old = originals.get(firstTask).replace(new RegExp(`^id: ${firstId}$`, 'm'), 'id: T-999').replace(/^depends_on:.*$/m, 'depends_on: []');
  try {
    writeFileSync(path, old.replace(/^status: \w+/m, 'status: in_progress'));
    assert.match(readFileSync(path, 'utf8'), /^status: in_progress$/m);
    rejects(/más de una tarea en vuelo/);
  } finally { rmSync(path); }
});

test('application FULL cannot invoke the expensive legacy wrapper', () => {
  change('scripts/verify.sh', text => text.replace('exec bash scripts/e2e.sh', 'exec bash scripts/verify-local-and-e2e.sh'));
  rejects(/debe ejecutar Playwright real directamente/);
});
test('starter gate cannot omit tooling', () => {
  change('scripts/verify.sh', text => text.replace('--starter) suites=(docs server client tooling e2e)', '--starter) suites=(docs server client e2e)'));
  rejects(/perfil STARTER sin matriz tooling/);
});
test('manual STARTER cannot skip tooling', () => {
  change('.github/workflows/full.yml', text => text.replace('run: bash scripts/verify.sh --tooling', 'run: echo skip'));
  rejects(/perfil STARTER remoto sin tooling/);
});
