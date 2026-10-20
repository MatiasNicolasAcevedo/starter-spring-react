// Critical guards run against disposable source copies, never apply to the maintenance checkout.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, readdirSync, lstatSync, copyFileSync, cpSync, rmSync, symlinkSync, linkSync, unlinkSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync, execFileSync } from 'node:child_process';
import { JAVA_FILES, TEXT_FILES, RESET_FILES, REMOVE_FILES, IDENTITY_FILE } from './lib/init-project-manifest.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const initialized = JSON.parse(readFileSync(join(root, IDENTITY_FILE), 'utf8')).initialized;
if (initialized) {
  await import('./test-init-adopted.mjs');
} else {
const home = mkdtempSync(join(tmpdir(), 'starter-init-test-'));
const baseline = join(home, 'baseline');
mkdirSync(baseline);
const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root }).toString().split('\0').filter(Boolean);
for (const path of files) {
  assert.ok(!/^(?:plantilla|\.git)\//.test(path));
  assert.ok(!lstatSync(join(root, path)).isSymbolicLink());
  mkdirSync(dirname(join(baseline, path)), { recursive: true });
  copyFileSync(join(root, path), join(baseline, path));
}
let index = 0;
const fixture = () => {
  const path = join(home, `copy-${index++}`);
  cpSync(baseline, path, { recursive: true });
  return path;
};
const entries = ['--name', 'Agenda Demo', '--slug', 'agenda-demo', '--package', 'org.demo.agenda', '--holder', 'Equipo Demo'];
const run = (path, args = entries, apply = false) => spawnSync(process.execPath, [join(root, 'scripts/init-project.mjs'), '--root', path, ...args, ...(apply ? ['--apply'] : [])], { encoding: 'utf8' });
const snapshot = path => {
  const out = {};
  const visit = (dir, prefix = '') => {
    for (const name of readdirSync(dir).sort()) {
      const next = join(dir, name), key = prefix + name;
      const info = lstatSync(next);
      if (info.isSymbolicLink()) out[key] = 'LINK';
      else if (info.isDirectory()) { out[key + '/'] = 'DIR'; visit(next, key + '/'); }
      else out[key] = readFileSync(next).toString('base64');
    }
  };
  visit(path);
  return out;
};
const rejectUnchanged = (path, args = entries, pattern) => {
  const before = snapshot(path);
  const result = run(path, args, true);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  if (pattern) assert.match(result.stderr, pattern);
  assert.deepEqual(snapshot(path), before, 'a rejected plan must write nothing');
};
after(() => rmSync(home, { recursive: true, force: true }));

test('help is available without inputs; default dry-run has zero byte/path changes and an explicit plan', () => {
  const help = spawnSync(process.execPath, [join(root, 'scripts/init-project.mjs'), '--help'], { encoding: 'utf8' });
  assert.equal(help.status, 0);
  assert.match(help.stdout, /Dry-run por defecto/);
  const path = fixture(), before = snapshot(path);
  const result = run(path);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^DRY-RUN: [1-9]/);
  const java = Object.entries(JAVA_FILES).flatMap(([kind, list]) => list.map(file => `server/src/${kind}/java/org/demo/agenda/${file}`));
  const writes = [...TEXT_FILES, ...RESET_FILES, ...java, IDENTITY_FILE].sort();
  assert.deepEqual(result.stdout.split('\n').filter(s => s.startsWith('write ')).map(s => s.slice(6)).sort(), writes);
  assert.deepEqual(snapshot(path), before);
});

test('apply connects identity and resets adoption, preserves inventory/auth/migrations and is byte/path idempotent', () => {
  const path = fixture();
  for (const dir of ['plantilla', '.git']) { mkdirSync(join(path, dir)); writeFileSync(join(path, dir, 'sentinel'), 'do not touch'); }
  writeFileSync(join(path, '.env'), 'private canary, never print');
  writeFileSync(join(path, 'outside-list.txt'), 'untouched');
  const before = snapshot(path);
  let result = run(path, entries, true);
  assert.equal(result.status, 0, result.stderr);
  const first = snapshot(path);
  assert.ok(!existsSync(join(path, 'docs/archive')), 'a new application must not receive maintenance history');
  const modified = new Set([...Object.keys(before), ...Object.keys(first)].filter(key => before[key] !== first[key] && !key.endsWith('/')));
  const allowed = new Set([...TEXT_FILES, ...RESET_FILES, ...REMOVE_FILES, IDENTITY_FILE,
    ...Object.entries(JAVA_FILES).flatMap(([kind, list]) => list.flatMap(file => [`server/src/${kind}/java/com/example/starter/${file}`, `server/src/${kind}/java/org/demo/agenda/${file}`]))]);
  for (const key of modified) assert.ok(allowed.has(key), `unexpected mutation ${key}`);
  assert.match(readFileSync(join(path, 'server/pom.xml'), 'utf8'), /<artifactId>agenda-demo-server<\/artifactId>/);
  assert.equal(JSON.parse(readFileSync(join(path, 'client/src/project-identity.json'), 'utf8')).name, 'Agenda Demo');
  assert.match(readFileSync(join(path, 'docs/AUTONOMY.md'), 'utf8'), /Pendiente de decisión del dueño/);
  assert.match(readFileSync(join(path, 'docs/tasks/T-000-adoption.md'), 'utf8'), /status: draft/);
  assert.equal(readdirSync(join(path, 'docs/tasks')).length, 1);
  const agents = readFileSync(join(path, 'AGENTS.md'), 'utf8');
  assert.match(agents, /^# AGENTS · Agenda Demo/);
  assert.match(agents, /org.demo.agenda/);
  assert.match(agents, /HANDOFF solo en adopción\/traspaso/);
  assert.doesNotMatch(agents, /starter-only|Mantenimiento de esta base|GPT-6.1/);
  assert.match(readFileSync(join(path, 'docs/ORCHESTRATION.md'), 'utf8'), /Estados de tarea/);
  assert.doesNotMatch(readFileSync(join(path, 'docs/tasks/T-000-adoption.md'), 'utf8'), /counts_for_cycle|product_cycle/);
  assert.match(readFileSync(join(path, 'docs/templates/junie-trial.md'), 'utf8'), /ejecución y resultado todavía pendientes/);
  assert.match(readFileSync(join(path, 'README.md'), 'utf8'), /Trabajo diario con Junie/);
  assert.doesNotMatch(readFileSync(join(path, 'README.md'), 'utf8'), /A\/B\/C\/D|E lista|PR#4/);
  for (const removed of REMOVE_FILES) assert.ok(!existsSync(join(path, removed)), 'maintenance tasks must not be inherited');
  assert.doesNotMatch(readFileSync(join(path, 'PROJECT_CONTEXT.md'), 'utf8'), /Mantenimiento de esta base|MERGED/i);
  result = spawnSync(process.execPath, ['scripts/docs-check.mjs'], { cwd: path, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  result = spawnSync(process.execPath, ['--test', 'scripts/ci/docs-check.test.mjs'], { cwd: path, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  for (const apply of [true, false, false]) {
    result = run(path, entries, apply);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /: 0 operaciones/);
    assert.deepEqual(snapshot(path), first);
  }
  rejectUnchanged(path, entries.map(s => s === 'Agenda Demo' ? 'Otra Agenda' : s));
  writeFileSync(join(path, 'PROJECT_CONTEXT.md'), '# Contexto completado por el dueño\n');
  rejectUnchanged(path, entries, /modificada o parcial/);
});

for (const [label, value, key] of [
  ['escape slug', '../escape', '--slug'], ['slash slug', 'a/b', '--slug'], ['windows slug', 'a\\b', '--slug'],
  ['uppercase slug', 'Bad', '--slug'], ['trailing slug', 'bad-', '--slug'], ['empty name', '', '--name'],
  ['control', 'Agenda\nDemo', '--name'], ['markup', '<Agenda>', '--name'], ['path holder', '../Equipo', '--holder'],
  ['reserved package', 'org.class.demo', '--package'], ['restricted package', 'org.record.demo', '--package'],
  ['JVM protected namespace', 'java.demo', '--package'],
  ['package escape', 'org/../demo', '--package'], ['package empty segment', 'org..demo', '--package'], ['Windows device segment', 'org.con.demo', '--package'],
]) test(`invalid input rejects before writes: ${label}`, () => {
  const args = [...entries]; args[args.indexOf(key) + 1] = value;
  rejectUnchanged(fixture(), args);
});
for (const args of [[], [...entries, '--unknown'], [...entries, '--name', 'Duplicado'], entries.slice(0, -1)]) test(`unknown/duplicate/incomplete inputs reject: ${JSON.stringify(args)}`, () => rejectUnchanged(fixture(), args));

test('R1: adoption keeps a generic deployment proposal without maintenance decisions', () => {
  const path = fixture();
  const maintenance = readFileSync(join(path, 'docs/DEPLOYMENT.md'), 'utf8');
  assert.match(maintenance, /Decisión del dueño 2026-10-20: portfolio personal/);
  assert.match(maintenance, /4 vCPU compartidas y 8 GB RAM/);
  assert.match(maintenance, /US\$10–15\/mes/);
  const result = run(path, entries, true);
  assert.equal(result.status, 0, result.stderr);
  const proposal = readFileSync(join(path, 'docs/DEPLOYMENT.md'), 'utf8');
  assert.doesNotMatch(proposal, /Decisión del dueño|2026-10-20|portfolio personal|4–5 proyectos|US\$10–15|Punto de partida aceptado|techo acordado|starter-only/);
  assert.match(proposal, /Pendiente de decisión del dueño/);
  assert.match(proposal, /PostgreSQL 18 compartido/);
  assert.match(proposal, /OIDC\/sesión\/CSRF/);
  assert.match(proposal, /sin SUPERUSER\/CREATEDB\/CREATEROLE/);
  assert.match(proposal, /backup\/restore/);
  const first = snapshot(path);
  assert.equal(run(path, entries, true).status, 0);
  assert.deepEqual(snapshot(path), first);
  writeFileSync(join(path, 'docs/DEPLOYMENT.md'), proposal + '\nDecisión propia posterior.\n');
  rejectUnchanged(path, entries, /modificada o parcial/);
});

test('R2: source and adopted technical guides reference current contracts without retired phases', () => {
  const path = fixture();
  const obsolete = /parte C|regresiones de B|Entorno de A|\(B\)|Objetivo aceptado|Alcance y secuencia|B agrega/;
  const guides = ['docs/specs/S-003-reference-security.md', 'docs/SETUP.md', 'docs/ARCHITECTURE.md'];
  for (const guide of guides) assert.doesNotMatch(readFileSync(join(path, guide), 'utf8'), obsolete, guide);
  const result = run(path, entries, true);
  assert.equal(result.status, 0, result.stderr);
  for (const guide of guides) assert.doesNotMatch(readFileSync(join(path, guide), 'utf8'), obsolete, guide);
  const spec = readFileSync(join(path, guides[0]), 'utf8');
  assert.match(spec, /\[S-001\]\(S-001-auth-google.md\)/);
  assert.match(spec, /\[S-002\]\(S-002-local-stack.md\)/);
  assert.match(spec, /C-AC-10/);
  assert.match(spec, /ReferenceItemIT/);
});

test('deployment boundary is required and rejects missing, repeated or reversed markers before writes', () => {
  for (const transform of [
    text => text.replace('<!-- starter-only:start -->', ''),
    text => text.replace('<!-- starter-only:end -->', ''),
    text => text.replace('starter-only:start', 'starter-only:swap').replace('starter-only:end', 'starter-only:start').replace('starter-only:swap', 'starter-only:end'),
    text => text + '\n<!-- starter-only:start -->\n',
    text => text + '\n<!-- starter-only:end -->\n',
  ]) {
    const path = fixture(), file = join(path, 'docs/DEPLOYMENT.md');
    writeFileSync(file, transform(readFileSync(file, 'utf8')));
    rejectUnchanged(path, entries, /Frontera de despliegue del starter ausente/);
  }
  const path = fixture();
  unlinkSync(join(path, 'docs/DEPLOYMENT.md'));
  rejectUnchanged(path, entries, /requerido ausente/);
});

test('missing source and altered late marker reject before any writes', () => {
  const path = fixture();
  writeFileSync(join(path, 'server/Dockerfile'), 'incompatible');
  rejectUnchanged(path, entries, /Marcador/);
  const missing = fixture();
  unlinkSync(join(missing, 'LICENSE'));
  rejectUnchanged(missing, entries, /requerido ausente/);
});

test('invalid instruction boundary rejects before writes rather than inheriting starter obligations', () => {
  for (const transform of [
    text => text.replace('<!-- starter-only:start -->', ''),
    text => text.replace('<!-- starter-only:end -->', ''),
    text => text.replace('starter-only:start', 'starter-only:swap').replace('starter-only:end', 'starter-only:start').replace('starter-only:swap', 'starter-only:end'),
    text => text + '\n<!-- starter-only:start -->\n',
  ]) {
    const path = fixture(), file = join(path, 'AGENTS.md');
    writeFileSync(file, transform(readFileSync(file, 'utf8')));
    rejectUnchanged(path, entries, /Frontera de instrucciones del starter ausente/);
  }
});
test('additional Java source and partial identity reject', () => {
  const path = fixture();
  writeFileSync(join(path, 'server/src/main/java/Extra.java'), 'unlisted');
  rejectUnchanged(path, entries, /Inventario Java/);
  const partial = fixture();
  const identity = JSON.parse(readFileSync(join(partial, IDENTITY_FILE), 'utf8'));
  writeFileSync(join(partial, IDENTITY_FILE), JSON.stringify({ ...identity, name: 'Changed too early' }));
  rejectUnchanged(partial, entries, /Estado inicial incompatible/);
});
test('changed versioned ignores cannot turn an allowlisted destination into an ignored write', () => {
  const path = fixture();
  writeFileSync(join(path, '.gitignore'), readFileSync(join(path, '.gitignore'), 'utf8') + '\nLICENSE\n');
  rejectUnchanged(path, entries, /ignorados incompatibles/);
});
test('partial client identity rejects before overwriting any source', () => {
  const path = fixture();
  writeFileSync(join(path, 'client/src/project-identity.json'), '{"name":"Changed too early"}\n');
  rejectUnchanged(path, entries, /Identidad del client incompatible/);
});
test('adoption resets every criterion even when the template previously verified it', () => {
  const path = fixture(), handoff = join(path, 'docs/HANDOFF.md');
  writeFileSync(handoff, readFileSync(handoff, 'utf8').replace(/\| heredado \|/g, '| verificado |'));
  const result = run(path, entries, true); assert.equal(result.status, 0, result.stderr);
  const reset = readFileSync(handoff, 'utf8');
  assert.doesNotMatch(reset, /\| verificado \|/);
  assert.equal([...reset.matchAll(/\| pendiente \|/g)].length, 22);
  assert.match(reset, /NO_LISTO.*0\/22/);
});
test('rename target and adoption task collisions reject', () => {
  for (const target of ['server/src/main/java/org/demo/agenda/ServerApplication.java', 'docs/tasks/T-000-adoption.md']) {
    const path = fixture(); mkdirSync(dirname(join(path, target)), { recursive: true }); writeFileSync(join(path, target), 'sentinel');
    rejectUnchanged(path);
  }
});
test('junction/symlink ancestor and leaf plus hardlinks reject; outside sentinel remains identical', () => {
  const outside = join(home, 'outside'); mkdirSync(outside);
  const sentinel = join(outside, 'LICENSE');
  const license = readFileSync(join(baseline, 'LICENSE'), 'utf8');
  writeFileSync(sentinel, license);
  const path = fixture();
  unlinkSync(join(path, 'LICENSE'));
  // Windows file symlinks require an unrelated OS privilege; junctions exercise the same lstat guard.
  symlinkSync(process.platform === 'win32' ? outside : sentinel, join(path, 'LICENSE'), process.platform === 'win32' ? 'junction' : 'file');
  rejectUnchanged(path, entries, /Enlace/);
  rmSync(join(path, 'LICENSE')); linkSync(sentinel, join(path, 'LICENSE'));
  rejectUnchanged(path, entries, /Enlace/);
  const another = fixture(); rmSync(join(another, 'server/src/main/java'), { recursive: true });
  const externalJava = join(outside, 'java');
  cpSync(join(baseline, 'server/src/main/java'), externalJava, { recursive: true });
  const javaBefore = snapshot(externalJava);
  symlinkSync(externalJava, join(another, 'server/src/main/java'), process.platform === 'win32' ? 'junction' : 'dir');
  rejectUnchanged(another, entries, /Enlace/);
  const alias = join(home, 'alias'); symlinkSync(fixture(), alias, process.platform === 'win32' ? 'junction' : 'dir');
  const result = run(alias, entries, true); assert.equal(result.status, 1); assert.match(result.stderr, /Enlace/);
  assert.equal(readFileSync(sentinel, 'utf8'), license);
  assert.deepEqual(snapshot(externalJava), javaBefore);
});

test('an initialized missing file or reappearing maintenance source cannot bypass the guard', () => {
  const path = fixture(); assert.equal(run(path, entries, true).status, 0);
  const removed = REMOVE_FILES[0];
  writeFileSync(join(path, removed), 'partial sentinel');
  rejectUnchanged(path);
  unlinkSync(join(path, removed)); unlinkSync(join(path, 'LICENSE'));
  rejectUnchanged(path);
});

test('Unicode/maximum visible name and unchanged Java package remain valid and idempotent', () => {
  for (const name of ['Ágenda del taller', 'A'.repeat(100), '中'.repeat(45)]) {
    const path = fixture(), args = [...entries];
    args[args.indexOf('--name') + 1] = name;
    args[args.indexOf('--package') + 1] = 'com.example.starter';
    const result = run(path, args, true); assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(readFileSync(join(path, 'client/src/project-identity.json'), 'utf8')).name, name);
    assert.ok(readFileSync(join(path, 'server/src/main/resources/application.yaml'), 'utf8').includes('name: '+JSON.stringify(name)));
    const first = snapshot(path); assert.equal(run(path, args, true).status, 0); assert.deepEqual(snapshot(path), first);
  }
});

}
