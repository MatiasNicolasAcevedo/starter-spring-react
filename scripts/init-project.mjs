#!/usr/bin/env node
// Offline, explicit plan, all guards before the first write. No Git, shell or dependency manager.
import { lstatSync, readFileSync, readdirSync, mkdirSync, writeFileSync, unlinkSync, rmdirSync } from 'node:fs';
import { resolve, relative, dirname, sep, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { JAVA_FILES, TEXT_FILES, RESET_FILES, ARCHIVE_FILES, GUARD_FILES, IDENTITY_FILE, archivePath } from './lib/init-project-manifest.mjs';
import { adoptionDocuments } from './lib/init-project-documents.mjs';

const DEFAULT = { name: 'Starter', slug: 'starter', packageName: 'com.example.starter', holder: 'Matias Nicolas Acevedo' };
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const reserved = new Set(('abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while true false null _ var yield record sealed permits when module open requires transitive exports opens to uses provides with').split(' '));
const help = `Uso (Node >=24, copia propia limpia):
node scripts/init-project.mjs --name "Agenda Demo" --slug agenda-demo --package org.demo.agenda --holder "Equipo Demo" [--root ruta] [--apply]
Dry-run por defecto: muestra el plan sin escribir. --apply aplica la lista de scripts/lib/init-project-manifest.mjs.
Nombre/titular: letras Unicode, números, espacios y . , ( ) _ -; sin rutas ni controles (1..100 caracteres).
Slug: letra inicial, minúsculas/números/guiones (2..50). Paquete: al menos dos segmentos Java en minúsculas, sin palabras reservadas ni namespace java.*.
No acepta secretos/contexto privado. No invoca Git/red/Docker/npm. No modifica locks/migraciones/auth ni retira la referencia.
Repetir las mismas entradas es idempotente mientras la copia inicializada conserve sus archivos; tras editarla no reinicializar.
E/S no transaccional: ante fallo conservar copia descartable y diagnóstico, no reintentar sobre un estado parcial.
Guía: README y docs/SETUP.md. --help no requiere otras entradas.`;

function argumentsFor(args) {
  if (args.length === 1 && args[0] === '--help') return null;
  const values = {};
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    if (!['--name', '--slug', '--package', '--holder', '--root', '--apply'].includes(key) || key in values) throw new Error('Argumento desconocido o repetido');
    if (key === '--apply') values[key] = true;
    else {
      const value = args[++i];
      if (!value || value.startsWith('--')) throw new Error('Argumento incompleto');
      values[key] = value;
    }
  }
  for (const key of ['--name', '--slug', '--package', '--holder']) if (!values[key]) throw new Error('Faltan entradas explícitas; consultar --help');
  const identity = { name: values['--name'], slug: values['--slug'], packageName: values['--package'], holder: values['--holder'] };
  for (const text of [identity.name, identity.holder]) {
    if (text !== text.trim() || !/^[\p{L}\p{N} .(),_-]{1,100}$/u.test(text) || !/[\p{L}\p{N}]/u.test(text)) throw new Error('Nombre/titular inválido');
  }
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(identity.slug) || identity.slug.length < 2 || identity.slug.length > 50) throw new Error('Slug inválido');
  if (identity.packageName.startsWith('java.') || identity.packageName.length > 150 || !/^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+$/.test(identity.packageName) || identity.packageName.split('.').some(s => reserved.has(s) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/.test(s))) throw new Error('Paquete Java inválido');
  return { identity, root: resolve(values['--root'] ?? process.cwd()), apply: values['--apply'] === true };
}

function initialize({ root, identity, apply = false }) {
  root = resolve(root);
  // Inspect every ancestor (including root itself), never follow junctions/symlinks or hardlinked files.
  const inspect = (path, required = false, directory = false) => {
    const absolute = resolve(root, path);
    if (absolute !== root && (relative(root, absolute).startsWith(`..${sep}`) || relative(root, absolute) === '..' || resolve(root, path) !== absolute)) throw new Error('Destino fuera de raíz');
    const chain = [];
    for (let p = absolute; ; p = dirname(p)) { chain.unshift(p); if (dirname(p) === p) break; }
    let info;
    for (const p of chain) {
      try { info = lstatSync(p); } catch (error) { if (error.code === 'ENOENT' && !required) return null; throw new Error('Archivo requerido ausente'); }
      if (info.isSymbolicLink() || (!info.isDirectory() && p !== absolute) || (info.isFile() && info.nlink > 1)) throw new Error('Enlace o ruta incompatible');
    }
    if (info && !(directory ? info.isDirectory() : info.isFile())) throw new Error('Tipo de destino incompatible');
    return info;
  };
  inspect('', true, true);
  const read = path => { inspect(path, true); return readFileSync(resolve(root, path), 'utf8').replace(/\r\n/g, '\n'); };
  let current;
  try { current = JSON.parse(read(IDENTITY_FILE)); } catch { throw new Error('Identidad ausente o incompatible'); }
  if (current.schema !== 1 || typeof current.initialized !== 'boolean') throw new Error('Identidad incompatible');
  const treeFiles = start => {
    const out = [];
    const visit = path => {
      inspect(path, true, true);
      for (const entry of readdirSync(resolve(root, path), { withFileTypes: true })) {
        const next = `${path}/${entry.name}`;
        if (entry.isDirectory()) visit(next);
        else { inspect(next, true); out.push(next); }
      }
    };
    visit(start);
    return out.sort();
  };
  const javaPaths = packageName => Object.entries(JAVA_FILES).flatMap(([kind, files]) => files.map(file => `server/src/${kind}/java/${packageName.replaceAll('.', '/')}/${file}`));
  const assertJavaTree = packageName => {
    const actual = ['main', 'test'].flatMap(kind => treeFiles(`server/src/${kind}/java`)).sort();
    if (JSON.stringify(actual) !== JSON.stringify(javaPaths(packageName).sort())) throw new Error('Inventario Java incompatible');
  };
  if (current.initialized) {
    if (Object.keys(DEFAULT).some(key => current[key] !== identity[key]) || !current.files || !Array.isArray(current.absent)) throw new Error('Reinicialización incompatible');
    assertJavaTree(current.packageName);
    const expected = [...TEXT_FILES, ...RESET_FILES, ...ARCHIVE_FILES.map(archivePath), ...javaPaths(current.packageName)].sort();
    if (JSON.stringify(Object.keys(current.files).sort()) !== JSON.stringify(expected)) throw new Error('Inventario de identidad incompatible');
    const absent = [...ARCHIVE_FILES.filter(path => !RESET_FILES.includes(path)), ...javaPaths(DEFAULT.packageName).filter(path => !javaPaths(current.packageName).includes(path))].sort();
    if (JSON.stringify(current.absent) !== JSON.stringify(absent)) throw new Error('Inventario ausente incompatible');
    for (const [path, digest] of Object.entries(current.files)) if (hash(read(path)) !== digest) throw new Error('Copia inicializada modificada o parcial');
    for (const path of current.absent) if (inspect(path)) throw new Error('Colisión de estado inicializado');
    return [];
  }
  if (Object.keys(DEFAULT).some(key => current[key] !== DEFAULT[key])) throw new Error('Estado inicial incompatible');
  for (const [path, digest] of Object.entries(GUARD_FILES)) if (hash(read(path)) !== digest) throw new Error('Reglas de ignorados incompatibles');
  assertJavaTree(DEFAULT.packageName);
  const plan = new Map();
  const remove = new Set();
  const put = (path, content, fresh = false) => {
    if (plan.has(path)) throw new Error('Colisión del plan');
    if (fresh && inspect(path)) throw new Error('Colisión de destino');
    if (!fresh) inspect(path, true);
    plan.set(path, content);
  };
  const linkTargets = new Map(ARCHIVE_FILES.map(path => [path, archivePath(path)]));
  const rewriteLinks = (text, from, to) => text.replace(/(\[[^\]]*\]\()([^\s)]+)(\))/g, (all, prefix, target, suffix) => {
    if (/^(https?:|mailto:|#)/.test(target)) return all;
    const [path, anchor] = target.split('#');
    const resolved = posix.normalize(posix.join(posix.dirname(from), path));
    const destination = linkTargets.get(resolved) ?? resolved;
    return prefix + posix.relative(posix.dirname(to), destination) + (anchor ? `#${anchor}` : '') + suffix;
  });
  for (const path of ARCHIVE_FILES) {
    const destination = archivePath(path);
    put(destination, '> Registro histórico del starter. No acredita estado, pruebas ni permisos de este producto.\n\n' + rewriteLinks(read(path), path, destination), true);
    if (!RESET_FILES.includes(path)) remove.add(path);
  }
  const replace = (text, old, value) => {
    if (!text.includes(old)) throw new Error('Marcador de identidad incompatible');
    return text.replaceAll(old, value);
  };
  const packagePath = identity.packageName.replaceAll('.', '/');
  for (const [kind, files] of Object.entries(JAVA_FILES)) for (const file of files) {
    const source = `server/src/${kind}/java/com/example/starter/${file}`;
    const destination = `server/src/${kind}/java/${packagePath}/${file}`;
    let text = replace(read(source), 'com.example.starter', identity.packageName);
    // Package relocation can change alphabetical import order (e.g. com -> org).
    // Preserve static/ordinary groups without invoking Maven or a formatter from the initializer.
    const imports = [...text.matchAll(/^import [^;\n]+;$/gm)];
    if (imports.length) {
      const statics = imports.map(match => match[0]).filter(line => line.startsWith('import static ')).sort();
      const ordinary = imports.map(match => match[0]).filter(line => !line.startsWith('import static ')).sort();
      const sorted = [statics.join('\n'), ordinary.join('\n')].filter(Boolean).join('\n\n');
      text = text.slice(0, imports[0].index) + sorted + text.slice(imports.at(-1).index + imports.at(-1)[0].length);
    }
    put(destination, text, destination !== source);
    if (destination !== source) remove.add(source);
  }
  for (const path of TEXT_FILES) {
    let text = read(path);
    if (path === 'server/pom.xml') {
      text = replace(text, '<groupId>com.example</groupId>', `<groupId>${identity.packageName.split('.').slice(0, -1).join('.')}</groupId>`);
      text = replace(text, '<artifactId>starter-server</artifactId>', `<artifactId>${identity.slug}-server</artifactId>`);
      text = replace(text, '<name>Starter Server</name>', `<name>${identity.name} Server</name>`);
    } else if (path === 'server/Dockerfile') text = replace(text, 'starter-server', `${identity.slug}-server`);
    else if (path.endsWith('application.yaml')) {
      text = replace(text, 'starter-server', `${identity.slug}-server`);
      text = replace(text, 'name: \"Starter\"', `name: ${JSON.stringify(identity.name)}`);
    }
    else if (path === 'docker-compose.yml') text = replace(text, '\nname: starter\n', `\nname: ${identity.slug}\n`);
    else if (path === 'client/src/project-identity.json') {
      let client;
      try { client = JSON.parse(text); } catch { throw new Error('Identidad del client incompatible'); }
      if (client?.name !== DEFAULT.name || Object.keys(client).join(',') !== 'name') throw new Error('Identidad del client incompatible');
      text = JSON.stringify({ name: identity.name }, null, 2) + '\n';
    }
    else if (path === 'LICENSE') text = replace(text, DEFAULT.holder, identity.holder);
    else if (path.startsWith('client/') || path.startsWith('e2e/')) text = replace(text, 'Starter', identity.name);
    else {
      text = text.replaceAll('com.example.starter', identity.packageName).replaceAll('com/example/starter', packagePath)
        .replaceAll('groupId com.example', `groupId ${identity.packageName.split('.').slice(0, -1).join('.')}`).replaceAll('artifactId starter-server', `artifactId ${identity.slug}-server`);
      text = rewriteLinks(text, path, path);
    }
    put(path, text);
  }
  const documents = adoptionDocuments(identity, read);
  if (JSON.stringify(Object.keys(documents).sort()) !== JSON.stringify([...RESET_FILES].sort())) throw new Error('Inventario documental incompatible');
  for (const [path, text] of Object.entries(documents)) put(path, text, path === 'docs/tasks/T-000-adoption.md');
  const state = { schema: 1, initialized: true, ...identity, files: Object.fromEntries([...plan].map(([path, text]) => [path, hash(text)])), absent: [...remove].sort() };
  put(IDENTITY_FILE, JSON.stringify(state, null, 2) + '\n');
  // Every source, destination, ancestor, collision and marker has been checked at this point.
  const operations = [...plan.keys()].map(path => `write ${path}`).concat([...remove].map(path => `remove ${path}`));
  if (apply) {
    for (const [path, content] of plan) {
      if (path === IDENTITY_FILE) continue; // State is written last; partial failures fail closed on the next attempt.
      mkdirSync(dirname(resolve(root, path)), { recursive: true });
      writeFileSync(resolve(root, path), content);
    }
    for (const path of remove) unlinkSync(resolve(root, path));
    const directories = new Set([...remove].filter(path => path.startsWith('server/src/')).flatMap(path => {
      const dirs = [];
      for (let dir = posix.dirname(path); !dir.endsWith('/java'); dir = posix.dirname(dir)) dirs.push(dir);
      return dirs;
    }));
    for (const dir of [...directories].sort((a, b) => b.length - a.length)) if (readdirSync(resolve(root, dir)).length === 0) rmdirSync(resolve(root, dir));
    writeFileSync(resolve(root, IDENTITY_FILE), plan.get(IDENTITY_FILE));
  }
  return operations;
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  try {
    if (Number(process.versions.node.split('.')[0]) < 24) throw new Error('Se requiere Node >=24');
    const options = argumentsFor(process.argv.slice(2));
    if (!options) console.log(help);
    else {
      const operations = initialize(options);
      console.log(`${options.apply ? 'APPLY' : 'DRY-RUN'}: ${operations.length} operaciones`);
      for (const operation of operations) console.log(operation);
    }
  } catch (error) {
    // Fixed diagnostics only. Never include filesystem/private file contents or echo CLI inputs.
    console.error(`init-project: ${error.code ? 'Error de E/S; copia posiblemente parcial' : error.message}`);
    process.exitCode = 1;
  }
}
