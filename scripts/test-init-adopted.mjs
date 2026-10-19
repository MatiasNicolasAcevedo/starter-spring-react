// The adopted product verifies its own initialized state; it never reapplies fictional starter defaults.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, readFileSync, writeFileSync, rmSync, lstatSync, readdirSync, symlinkSync, linkSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = fileURLToPath(new URL('..', import.meta.url));
const home = mkdtempSync(join(tmpdir(), 'starter-adopted-init-'));
const copy = join(home, 'copy');
const excluded = new Set(['.git', 'plantilla', 'node_modules', 'target', 'dist', 'coverage', 'artifacts', '.orchestrator', '.idea', '.vscode', 'playwright-report', 'test-results', 'blob-report', '__pycache__']);
cpSync(root, copy, { recursive: true, filter: source => {
  const name = basename(source);
  return !excluded.has(name) && !(name.startsWith('.env') && !name.endsWith('.example')) && !/\.(log|local|pem|p12|jks)$/.test(name) && !lstatSync(source).isSymbolicLink();
} });
const identity = JSON.parse(readFileSync(join(copy, 'project-identity.json'), 'utf8'));
const args = ['--root', copy, '--name', identity.name, '--slug', identity.slug, '--package', identity.packageName, '--holder', identity.holder, '--apply'];
const run = overrides => spawnSync(process.execPath, [join(copy, 'scripts/init-project.mjs'), ...(overrides ?? args)], { encoding: 'utf8' });
const snapshot = () => {
  const out = {};
  const visit = dir => { for (const entry of readdirSync(join(copy, dir), { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) visit(path);
    else if (!entry.isSymbolicLink()) out[path] = readFileSync(join(copy, path)).toString('base64');
  } };
  visit(''); return out;
};
after(() => rmSync(home, { recursive: true, force: true }));
test('repeat initialization preserves the adopted product, including edits, and docs-check still evaluates its own criteria', () => {
  const before = snapshot();
  for (let i = 0; i < 2; i++) {
    const result = run();
    // A product may already have completed context or new features; the CLI must preserve those edits.
    if (result.status === 0) assert.match(result.stdout, /0 operaciones/);
    else { assert.equal(result.status, 1); assert.match(result.stderr, /modificada o parcial|Inventario Java incompatible|Archivo requerido ausente/); }
  }
  assert.deepEqual(snapshot(), before);
  const result = spawnSync(process.execPath, ['scripts/docs-check.mjs'], { cwd: copy, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
});
test('adopted identity rejects new inputs and edited files without overwriting them', () => {
  const before = snapshot(), incompatible = [...args]; incompatible[incompatible.indexOf('--slug') + 1] = 'different-product';
  assert.equal(run(incompatible).status, 1); assert.deepEqual(snapshot(), before);
  const path = join(copy, 'PROJECT_CONTEXT.md'), original = readFileSync(path);
  try { writeFileSync(path, 'own edited context'); const edited = snapshot(); assert.equal(run().status, 1); assert.deepEqual(snapshot(), edited); }
  finally { writeFileSync(path, original); }
});
test('adopted identity rejects root junctions and hardlinks while preserving external bytes', () => {
  const alias = join(home, 'alias'); symlinkSync(copy, alias, process.platform === 'win32' ? 'junction' : 'dir');
  const linked = [...args]; linked[1] = alias;
  const before = snapshot(); assert.equal(run(linked).status, 1); assert.deepEqual(snapshot(), before);
  const licensePath = join(copy, 'LICENSE'), original = readFileSync(licensePath), external = join(home, 'external-license');
  writeFileSync(external, original); unlinkSync(licensePath); linkSync(external, licensePath);
  try { assert.equal(run().status, 1); assert.deepEqual(readFileSync(external), original); }
  finally { unlinkSync(licensePath); writeFileSync(licensePath, original); }
});
