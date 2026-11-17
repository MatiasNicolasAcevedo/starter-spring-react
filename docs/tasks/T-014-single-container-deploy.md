---
id: T-014
status: draft
priority: P2
size: M
milestone: M1
spec: null
depends_on: [T-013]
branch: codex/t-014-single-container-deploy
role: implementer
executor: frontier
counts_for_cycle: false
pr: null
---
# T-014 · Imagen de un solo contenedor lista para un PaaS

## Objetivo
La base trae la imagen de despliegue descrita en [DEPLOYMENT](../DEPLOYMENT.md#camino-corto-un-contenedor-en-un-paas): React compilado, nginx y Spring Boot en un contenedor, con su prueba local de humo. Una aplicación nueva puede publicarse en un Web Service Docker con un PostgreSQL gestionado sin rehacer ese trabajo.

Draft solo por la dependencia de T-013. Es la última tarea predefinida de esta serie: su prompt de salida vuelve a frontera planner.

## Alcance y decisiones resueltas
Incluye:
- `deploy/render/Dockerfile` multietapa y `deploy/render/Dockerfile.dockerignore`, con las mismas versiones fijadas de Node, Temurin y nginx que ya usa la base.
- `deploy/render/entrypoint.sh`: valida `PORT`, genera la configuración de nginx, arranca Spring en loopback y nginx en `PORT`, termina ambos si uno cae y reenvía TERM/INT.
- `deploy/render/compose.smoke.yml`: imagen final, PostgreSQL 18 aparte, OIDC ficticio y límites de memoria y CPU parecidos a un plan chico, en puertos de loopback.
- `scripts/ci/test-render-entrypoint.sh`: prueba del entrypoint con procesos ficticios (puerto inválido, caída de un proceso, señales).
- Ajustes mínimos de `client/nginx.conf` y `client/19-public-origin.sh` para escuchar en un puerto configurable, sin cambiar el contrato de origen del ADR 0002.
- Inicializador: los nombres propios de la imagen (jar del servidor, archivo pid) se personalizan con la identidad; agregar los archivos nuevos a las listas del manifiesto y cubrirlo en sus tests.
- DEPLOYMENT: reemplazar la frase «los archivos no están todavía en esta base» por la receta de prueba local.

Fuente de referencia: `deploy/render/` y `scripts/ci/test-render-entrypoint.sh` del repositorio hermano DevNotes, donde esta imagen ya está en uso. Portar solo lo genérico: sin variables de voz, OCR ni sondas de actividad de ese producto.

Excluye: crear recursos en cualquier proveedor, credenciales, Google real, dominios, costos y auto-deploy; todo eso lo decide y opera el dueño. No se agrega `render.yaml` ni automatización de despliegue.

## Leer antes
- [DEPLOYMENT](../DEPLOYMENT.md#camino-corto-un-contenedor-en-un-paas).
- [ADR 0002](../adr/0002-google-oidc-session-csrf-and-proxy.md).
- `client/nginx.conf`, `client/19-public-origin.sh`, `client/Dockerfile` y `server/Dockerfile` de este repo.
- `deploy/render/` de DevNotes, como referencia de lectura.
- `scripts/lib/init-project-manifest.mjs`.

## Archivos y pasos
1. Rojo: `scripts/ci/test-render-entrypoint.sh` y los casos del inicializador para los archivos nuevos.
2. Dockerfile, entrypoint, dockerignore y Compose de humo.
3. Ensayo local único de la imagen: build, readiness `200` con `UP`, ruta interna recargada, API sin sesión `401`, memoria pico leída y cleanup.
4. Manifiesto del inicializador y DEPLOYMENT.

## Aceptación y pruebas
| Criterio observable | Capa elegida y por qué | Comando exacto (directorio/entorno) | Resultado esperado |
|---|---|---|---|
| AC-01 el entrypoint valida, coordina y termina | Shell con procesos ficticios | `bash scripts/ci/test-render-entrypoint.sh` en la raíz, Git Bash | Rojo antes, verde después |
| AC-02 la imagen arranca y sirve un único origen | Ensayo real de humo | `docker compose --env-file .env.example -p starter-render-smoke-t014 -f deploy/render/compose.smoke.yml up -d --build --wait --wait-timeout 300` y `curl -fsS http://127.0.0.1:18080/actuator/health/readiness` | `status: UP`; después `down --volumes` del mismo proyecto sin residuos |
| AC-03 una copia personalizada conserva una imagen coherente | Test Node del inicializador | `node --test scripts/test-init-project.mjs` | Verde con los archivos nuevos |
| AC-04 herramientas y documentos válidos | Checkers | `node --test "scripts/ci/*.test.mjs"` y `node scripts/docs-check.mjs` | Exit 0 |

Registrar en la tarea el tiempo hasta readiness y la memoria pico del ensayo. Gate diario: los comandos anteriores, `git diff --check` y `--policy` (STARTER). `FULL/STARTER: DIFERIDO POR EL DUEÑO`. La tarea agrega Docker y toca el inicializador: el cierre **recomienda** el integrado en el registro de STATUS; no lo ejecuta.

## Checkpoint vigente
Contrato preparado por frontera el 2026-11-16. Sin rama ni PR. No se ejecutó nada.

## Correcciones significativas
| Fecha / SHA o pendiente de commit | Problema y causa comprobada | Corrección | Prueba y resultado |
|---|---|---|---|

## Prompts de salida
Al publicar la implementación o una corrección (para el reviewer):
```text
Actuá como frontera reviewer de T-014 en MatiasNicolasAcevedo/starter-spring-react. Sesión nueva, distinta de la que implementó.

LEER: AGENTS.md, docs/STATUS.md, docs/agents/reviewer.md, docs/WORKFLOW.md, docs/DEPLOYMENT.md y docs/tasks/T-014-single-container-deploy.md.
PRECONDICIÓN: el PR de la rama codex/t-014-single-container-deploy está abierto contra main; consultalo con gh pr view y --repo explícito y tomá su HEAD. Si no, informar el estado real y entregar el prompt corregido.
ACCIÓN: 1) Revisar el diff contra AC-01 a AC-04, el contrato de origen del ADR 0002 y que no haya secretos ni recursos de proveedor. 2) Correr bash scripts/ci/test-render-entrypoint.sh, node --test scripts/test-init-project.mjs, node --test "scripts/ci/*.test.mjs" y node scripts/docs-check.mjs. 3) Repetir el ensayo de humo de AC-02 con namespace propio y comprobar el cleanup. 4) Con hallazgos: CAMBIOS REQUERIDOS y prompt de corrección. 5) Sin hallazgos: commit de transición, verify-required verde, APROBADO, squash y MERGED confirmado.
GATE: diario. FULL y STARTER están diferidos: no ejecutarlos sin orden expresa del dueño.
SALIDA: PR mergeado y confirmado, o lista cerrada de hallazgos. Terminar con el prompt de la sesión siguiente en STATUS y completo en la respuesta final.
```

Al aprobar y mergear (vuelve a frontera):
```text
Actuá como frontera planner en MatiasNicolasAcevedo/starter-spring-react. Sesión nueva.

LEER: AGENTS.md, docs/STATUS.md, docs/agents/planner.md, docs/WORKFLOW.md, docs/BACKLOG.md y docs/tasks/T-014-single-container-deploy.md.
PRECONDICIÓN: el PR de T-014 figura MERGED en GitHub (gh pr view con --repo, state, mergedAt y mergeCommit.oid). Si no, informar el estado real y entregar el prompt corregido.
ACCIÓN: 1) Conciliar T-014 done. 2) Presentar al dueño el registro de gates diferidos con las tres tareas T-012 a T-014 mergeadas y recomendar el integrado STARTER, sin ejecutarlo. 3) Revisar «Por refinar» de BACKLOG con el dueño y contratar lo que elija.
GATE: diario. FULL y STARTER están diferidos: no ejecutarlos sin orden expresa del dueño.
SALIDA: serie T-012 a T-014 conciliada y siguiente objetivo decidido por el dueño. Terminar con el prompt de la sesión siguiente en STATUS y completo en la respuesta final.
```

## Cierre y siguiente tarea
No done hasta MERGED comprobado. Con esta tarea termina la serie de integración; la continuación la decide el dueño con frontera.
