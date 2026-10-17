#!/usr/bin/env node
// Validación documental determinista de Starter (docs/TESTING.md). Sin dependencias npm ni acceso a red.
// Valida solo archivos del producto: el kit local plantilla/ se excluye y nunca es requisito.
// Uso: node scripts/docs-check.mjs   (exit 0 = ok, 1 = errores)
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['.git', 'node_modules', 'target', 'dist', 'plantilla', 'coverage', 'playwright-report',
  'test-results', 'blob-report', '.orchestrator', '.idea', '.vscode', 'archive']);
const errors = [];
const fail = (file, message) => errors.push(`${file}: ${message}`);
const rel = (abs) => relative(ROOT, abs).split(sep).join('/');
const read = (p) => readFileSync(join(ROOT, p), 'utf8').replace(/\r\n/g, '\n');

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(abs, out);
    } else out.push(abs);
  }
  return out;
}
const files = walk(ROOT).map(rel);
const markdown = files.filter((f) => f.endsWith('.md'));

// 1. Archivos operativos obligatorios
const REQUIRED = ['PROJECT_CONTEXT.md', 'LICENSE', 'README.md', 'CONTRIBUTING.md', 'AGENTS.md', 'CLAUDE.md',
  ...['PROJECT', 'ARCHITECTURE', 'ROADMAP', 'BACKLOG', 'STATUS', 'HANDOFF', 'AUTONOMY', 'ORCHESTRATION', 'SETUP',
    'TESTING'].map((d) => `docs/${d}.md`),
  ...['planner', 'implementer', 'reviewer', 'merger'].map((r) => `docs/agents/${r}.md`),
  ...['task', 'spec', 'adr'].map((t) => `docs/templates/${t}.md`)];
for (const f of REQUIRED) if (!existsSync(join(ROOT, f))) fail(f, 'archivo obligatorio ausente');

// 2. Cada CLAUDE.md solo importa su AGENTS.md hermano, y cada AGENTS.md tiene su CLAUDE.md
for (const f of files.filter((p) => p.split('/').pop() === 'CLAUDE.md')) {
  if (read(f).trim() !== '@AGENTS.md') fail(f, 'debe contener exactamente "@AGENTS.md"');
  const sibling = join(dirname(f), 'AGENTS.md');
  if (!existsSync(join(ROOT, sibling))) fail(f, 'no existe AGENTS.md hermano');
}
for (const f of files.filter((p) => p.split('/').pop() === 'AGENTS.md')) {
  if (!existsSync(join(ROOT, dirname(f), 'CLAUDE.md'))) fail(f, 'falta CLAUDE.md hermano con @AGENTS.md');
}

// 3. Enlaces Markdown relativos existentes y sin dependencia del kit local
function stripFences(text) {
  return text.replace(/^(```|~~~)[\s\S]*?^\1/gm, '');
}
for (const f of markdown) {
  const body = stripFences(read(f));
  for (const m of body.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const target = m[1];
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const path = decodeURIComponent(target.split('#')[0]);
    if (/(^|\/)plantilla\//.test(path)) fail(f, `enlace obligatorio al kit local: ${target}`);
    if (!existsSync(join(ROOT, dirname(f), path))) fail(f, `enlace roto: ${target}`);
  }
}

// 4. Tareas: frontmatter, estados, dependencias y WIP
const STATES = ['draft', 'ready', 'in_progress', 'in_review', 'changes_requested', 'mergeable', 'done', 'blocked'];
const IN_FLIGHT = new Set(['in_progress', 'in_review', 'changes_requested', 'mergeable']);
function frontmatter(f) {
  const m = read(f).match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const data = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-z_]+):\s*(.*?)\s*(#.*)?$/);
    if (!kv) continue;
    let v = kv[2];
    if (v.startsWith('[')) v = v.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean);
    else if (v === 'null' || v === '') v = null;
    else if (v === 'true' || v === 'false') v = v === 'true';
    else if (/^\d+$/.test(v)) v = Number(v);
    data[kv[1]] = v;
  }
  return data;
}
const tasks = new Map();
for (const f of files.filter((p) => /^docs\/tasks\/T-\d{3}-[a-z0-9-]+\.md$/.test(p))) {
  const fm = frontmatter(f);
  if (!fm) { fail(f, 'sin frontmatter'); continue; }
  const id = f.match(/T-\d{3}/)[0];
  if (fm.id !== id) fail(f, `id ${fm.id} no coincide con el archivo`);
  if (tasks.has(id)) fail(f, `id duplicado ${id}`);
  if (!STATES.includes(fm.status)) fail(f, `status inválido: ${fm.status}`);
  if (!['frontier', 'junie'].includes(fm.executor)) fail(f, `executor inválido: ${fm.executor}`);
  if (!['planner', 'implementer', 'reviewer', 'merger'].includes(fm.role)) fail(f, `role inválido: ${fm.role}`);
  if (typeof fm.counts_for_cycle !== 'boolean') fail(f, 'counts_for_cycle debe ser booleano');
  if (fm.pr !== null && !Number.isInteger(fm.pr)) fail(f, 'pr debe ser null o un número');
  if (!Array.isArray(fm.depends_on)) fail(f, 'depends_on debe ser una lista');
  if (fm.milestone === 'M0' && (fm.executor !== 'frontier' || fm.counts_for_cycle !== false)) {
    fail(f, 'las tareas de M0 son executor frontier y counts_for_cycle false');
  }
  if (fm.milestone !== 'M0' && fm.status === 'ready' && !fm.product_cycle) fail(f, 'ready posterior a M0 sin product_cycle');
  if (fm.status === 'ready') {
    const body = read(f);
    for (const h of ['## Objetivo', '## Alcance', '## Aceptación']) if (!body.includes(h)) fail(f, `ready sin sección "${h}"`);
  }
  tasks.set(id, { ...fm, file: f });
}
for (const [id, t] of tasks) {
  for (const dep of t.depends_on ?? []) if (!tasks.has(dep)) fail(t.file, `dependencia inexistente ${dep}`);
  if (t.status === 'ready' && (t.depends_on ?? []).some((d) => tasks.get(d)?.status !== 'done')) {
    fail(t.file, 'ready con dependencias no terminadas');
  }
  const seen = new Set();
  const visit = (cur) => {
    if (cur === id && seen.size) return fail(t.file, 'ciclo de dependencias');
    if (seen.has(cur)) return;
    seen.add(cur);
    for (const d of tasks.get(cur)?.depends_on ?? []) visit(d);
  };
  for (const d of t.depends_on ?? []) visit(d);
}
const inFlight = [...tasks.values()].filter((t) => IN_FLIGHT.has(t.status) || (t.status === 'blocked' && t.pr));
if (inFlight.length > 1) fail('docs/tasks', `más de una tarea en vuelo: ${inFlight.map((t) => t.id).join(', ')}`);
const ready = [...tasks.values()].filter((t) => t.status === 'ready');
if (ready.length > 5) fail('docs/tasks', `más de cinco tareas ready (${ready.length})`);

// 5. BACKLOG: estado de cada fila coincide con el frontmatter y la sección
const SECTION_STATES = { 'En vuelo': [...IN_FLIGHT, 'blocked'], 'Listas': ['ready'], 'Bloqueadas': ['blocked', 'draft'],
  'Hechas recientes': ['done'] };
if (existsSync(join(ROOT, 'docs/BACKLOG.md'))) {
  let section = null;
  const listed = new Set();
  for (const line of read('docs/BACKLOG.md').split('\n')) {
    const h = line.match(/^## (.+)$/);
    if (h) { section = h[1].trim(); continue; }
    const row = line.match(/^\|(.+)\|$/);
    if (!row) continue;
    const cells = row[1].split('|').map((c) => c.trim());
    const idCell = cells.find((c) => /\[T-\d{3}\]\(tasks\//.test(c));
    if (!idCell) continue;
    const id = idCell.match(/T-\d{3}/)[0];
    const task = tasks.get(id);
    if (!task) { fail('docs/BACKLOG.md', `${id} sin archivo de tarea`); continue; }
    listed.add(id);
    const state = cells.find((c) => STATES.includes(c.replace(/`/g, '')))?.replace(/`/g, '');
    if (state !== task.status) fail('docs/BACKLOG.md', `${id} figura como ${state}, frontmatter dice ${task.status}`);
    const allowed = SECTION_STATES[section];
    if (allowed && !allowed.includes(task.status)) fail('docs/BACKLOG.md', `${id} (${task.status}) en sección "${section}"`);
  }
  for (const t of [...inFlight, ...ready]) if (!listed.has(t.id)) fail('docs/BACKLOG.md', `${t.id} (${t.status}) no figura`);
}

// 6. HANDOFF genérico: 22 criterios, sin historia operativa ni crédito por herencia.
const CRITERIA = ['C-01', 'C-02', 'C-03', 'E-01', 'E-02', 'E-03', 'B-01', 'B-02', 'B-03', 'S-01', 'S-02', 'S-03',
  'V-01', 'V-02', 'V-03', 'G-01', 'G-02', 'G-03', 'H-01', 'H-02', 'H-03', 'O-01'];
let verified = null;
if (existsSync(join(ROOT, 'docs/HANDOFF.md'))) {
  const handoff = read('docs/HANDOFF.md');
  const found = new Map();
  for (const line of handoff.split('\n')) {
    const match = line.match(/^\|\s*([A-Z]-\d{2})\s*\|([^|]*)\|\s*`?([a-z_]+)`?\s*\|([^|]*)\|/);
    if (!match) continue;
    const [, id, text, state, evidence] = match;
    if (!CRITERIA.includes(id)) fail('docs/HANDOFF.md', `criterio desconocido ${id}`);
    if (found.has(id)) fail('docs/HANDOFF.md', `criterio repetido ${id}`);
    if (!['heredado', 'pendiente', 'verificado', 'bloqueado'].includes(state)) fail('docs/HANDOFF.md', `${id}: estado inválido`);
    if (!text.trim()) fail('docs/HANDOFF.md', `${id}: criterio vacío`);
    if (state === 'verificado' && (!evidence.includes('Propia:') || /heredad/i.test(evidence) || !/\d{4}-\d{2}-\d{2}/.test(evidence))) {
      fail('docs/HANDOFF.md', `${id}: verificado requiere evidencia propia fechada; herencia no acredita ejecución`);
    }
    found.set(id, state);
  }
  for (const id of CRITERIA) if (!found.has(id)) fail('docs/HANDOFF.md', `falta el criterio ${id}`);
  verified = [...found.values()].filter((state) => state === 'verificado').length;
  const verdict = handoff.match(/^- \*\*Veredicto:\*\* `(NO_LISTO|STARTER_VALIDADO)`/m)?.[1];
  if (!verdict) fail('docs/HANDOFF.md', 'veredicto genérico ausente o inválido');
  if (verdict === 'STARTER_VALIDADO' && (verified !== 22 || [...tasks.values()].some(t => t.status !== 'done'))) {
    fail('docs/HANDOFF.md', 'STARTER_VALIDADO exige 22/22 y todas las partes done');
  }
  const count = handoff.match(/— (\d+)\/22 verificados/);
  if (!count || Number(count[1]) !== verified) fail('docs/HANDOFF.md', 'conteo de verificados incoherente');
  if (!/`(POR_SESION|CICLO_AUTOMATICO_VERIFICADO)`/.test(handoff)) fail('docs/HANDOFF.md', 'modalidad de continuidad ausente');
  if (!/`(AUTOMATICO_ELEGIBLE|MANUAL_POR_DUENO)`/.test(handoff)) fail('docs/HANDOFF.md', 'modalidad de merge ausente');
}

// 7. STATUS: próxima acción coherente con la tarea, conteo de HANDOFF y prompt sin placeholders
if (existsSync(join(ROOT, 'docs/STATUS.md'))) {
  const status = read('docs/STATUS.md');
  const taskRow = status.match(/^\|\s*Tarea y contrato\s*\|([^\n]*)\|$/m)?.[1] ?? '';
  const id = taskRow.match(/T-\d{3}/)?.[0];
  const stateRow = status.match(/^\|\s*Estado\s*\|\s*`?([a-z_]+)`?\s*\|$/m)?.[1];
  if (!id || !tasks.has(id)) fail('docs/STATUS.md', 'la próxima acción no referencia una tarea existente');
  else {
    if (stateRow !== tasks.get(id).status) fail('docs/STATUS.md', `estado ${stateRow} ≠ frontmatter ${tasks.get(id).status}`);
    if (inFlight.length === 1 && inFlight[0].id !== id) fail('docs/STATUS.md', `la tarea en vuelo es ${inFlight[0].id}`);
    if (!taskRow.includes(tasks.get(id).file.replace(/^docs\//, ''))) fail('docs/STATUS.md', 'falta el enlace al contrato');
  }
  const prompt = status.match(/### Prompt de la siguiente sesión\s*\n```text\n([\s\S]*?)```/)?.[1];
  if (!prompt) fail('docs/STATUS.md', 'falta el prompt de la siguiente sesión');
  else {
    if (id && !prompt.includes(id)) fail('docs/STATUS.md', `el prompt no menciona ${id}`);
    if (/T-NNN|S-NNN|<[a-z][^>]*>|\bTODO\b|\bTBD\b/.test(prompt)) fail('docs/STATUS.md', 'el prompt contiene placeholders');
  }
  const count = status.match(/HANDOFF del starter:\s*(\d+)\/22 verificados/)?.[1];
  if (verified !== null && Number(count) !== verified) fail('docs/STATUS.md', `conteo ${count}/22 distinto de HANDOFF ${verified}/22`);
  if (existsSync(join(ROOT, 'docs/BACKLOG.md'))) {
    const next = read('docs/BACKLOG.md').match(/^Próxima acción:[^\n]*/m)?.[0] ?? '';
    if (id && !next.includes(id)) fail('docs/BACKLOG.md', `la próxima acción no coincide con STATUS (${id})`);
  }
}

// 8. ROADMAP: cadencia entera positiva
if (existsSync(join(ROOT, 'docs/ROADMAP.md'))) {
  const cadence = read('docs/ROADMAP.md').match(/Cadencia efectiva\s*\|\s*(\d+)/)?.[1];
  if (!cadence || Number(cadence) < 1) fail('docs/ROADMAP.md', 'cadencia efectiva ausente o inválida');
}

// 9. Coherencia de configuración versionada
const pgCompose = existsSync(join(ROOT, 'docker-compose.yml')) && read('docker-compose.yml').match(/image:\s*(postgres:[^\s]+)/)?.[1];
const tcFile = 'server/src/test/java/com/example/starter/TestcontainersConfiguration.java';
const pgTc = existsSync(join(ROOT, tcFile)) && read(tcFile).match(/POSTGRES_IMAGE\s*=\s*"([^"]+)"/)?.[1];
if (!pgCompose || pgCompose !== pgTc) fail('docker-compose.yml', `imagen PostgreSQL distinta de Testcontainers (${pgCompose} vs ${pgTc})`);
const phaseCi = existsSync(join(ROOT, '.github/workflows/ci.yml')) && read('.github/workflows/ci.yml').match(/GATE_PHASE:\s*(\w+)/)?.[1];
const phaseSh = existsSync(join(ROOT, 'scripts/verify.sh')) && read('scripts/verify.sh').match(/^GATE_PHASE="(\w+)"/m)?.[1];
if (!phaseCi || phaseCi !== phaseSh) fail('scripts/verify.sh', `GATE_PHASE distinto de ci.yml (${phaseSh} vs ${phaseCi})`);
if (phaseSh && !read('docs/TESTING.md').includes(`**Fase actual: \`${phaseSh}\`**`)) fail('docs/TESTING.md', `no declara la fase ${phaseSh}`);
// FULL: verify.sh ejecuta e2e y la CI tiene job e2e evaluado por el agregado verify-required (base heredada).
if (phaseSh === 'FULL' && phaseCi === 'FULL') {
  const ci = read('.github/workflows/ci.yml');
  if (!/^ {2}e2e:\n/m.test(ci)) fail('.github/workflows/ci.yml', 'fase FULL sin job e2e');
  const needs = ci.match(/^ {2}verify-required:\n[\s\S]*?^ {4}needs: \[([^\]]*)\]/m)?.[1].split(',').map((s) => s.trim()) ?? [];
  for (const job of ['classify', 'docs', 'server', 'client', 'e2e']) {
    if (!needs.includes(job)) fail('.github/workflows/ci.yml', `verify-required no depende de ${job}`);
  }
  if (!ci.includes('E2E: ${{ needs.e2e.result }}') || !ci.includes('run: node scripts/ci/verify-required.mjs')) {
    fail('.github/workflows/ci.yml', 'verify-required no evalúa e2e con scripts/ci/verify-required.mjs');
  }
  if (!read('scripts/verify.sh').includes('FULL) echo "docs server client e2e"')) fail('scripts/verify.sh', 'FULL no ejecuta la suite e2e');
}
// Node: misma versión en CI, en el runner docs-check de Compose y en la imagen del client.
const nodeCi = existsSync(join(ROOT, '.github/workflows/ci.yml')) && read('.github/workflows/ci.yml').match(/NODE_VERSION:\s*([\d.]+)/)?.[1];
const nodeCompose = existsSync(join(ROOT, 'docker-compose.yml')) && read('docker-compose.yml').match(/image:\s*node:([\d.]+)/)?.[1];
const nodeClient = existsSync(join(ROOT, 'client/Dockerfile')) && read('client/Dockerfile').match(/^FROM node:([\d.]+)/m)?.[1];
if (!nodeCi || nodeCi !== nodeCompose || nodeCi !== nodeClient) {
  fail('client/Dockerfile', `versión de Node distinta entre ci.yml, docker-compose.yml y client/Dockerfile (${nodeCi} / ${nodeCompose} / ${nodeClient})`);
}

if (errors.length) {
  console.error(`docs-check: ${errors.length} error(es)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`docs-check: OK (${markdown.length} Markdown, ${tasks.size} tareas, HANDOFF ${verified}/22 verificados)`);
