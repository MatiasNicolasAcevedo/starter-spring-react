---
id: T-010
status: in_progress
priority: P2
size: S
milestone: M1
spec: S-004
depends_on: [T-009]
branch: codex/t-010-docs-check-board
role: implementer
executor: junie
counts_for_cycle: false
pr: null
---
# T-010 · Validar estados explícitos y aislar mantenimiento en copias

## Objetivo

El checker rechaza estados explícitos inválidos en el tablero y una copia inicializada no hereda los contratos de esta iteración de mantenimiento. R-04 de T-009 documenta `in_progres` aceptado; el inventario actual enumera exclusiones por archivo, y aún no incluye S-004 ni T-010/T-011.

## Alcance

Implementar S-004 regla 1: detectar columna `Estado` por encabezado de tabla Markdown y validar la celda de cada fila con enlace de tarea en esa tabla, incluso vacía o desconocida; aceptar estados válidos con o sin backticks y exigir coincidencia con frontmatter. No interpretar otras columnas como estado. Mantener tablas sin esa columna, listas simplificadas, estados válidos, sección y WIP. En `scripts/lib/init-project-manifest.mjs` agregar explícitamente S-004 y ambas tareas a REMOVE_FILES; sin exclusiones genéricas, ni eliminar archivos del checkout. Rutas técnicas previstas: `scripts/docs-check.mjs`, `scripts/ci/docs-check.test.mjs`, manifest y `scripts/test-init-project.mjs`. Sin modificar aplicación, versiones ni permisos.

Leer [S-004](../specs/S-004-document-verification.md), [diagnóstico T-009](T-009-starter-readiness.md#registro-de-candidatos-y-pendientes), [implementer](../agents/implementer.md), [TESTING](../TESTING.md) y [SETUP](../SETUP.md#verificación-desde-powershell). Adoptar esta rama y planificación sin reset; verificar PR10 MERGED y main/PR reales antes de iniciar. Registrar rol/modelo/herramienta/esfuerzo expuestos e impacto en esta tarea.

## Aceptación

- Primero agregar regresiones y demostrar rojo: `in_progres`, celda vacía y estado válido distinto al frontmatter; positivos para cada estado válido, backticks y tablas/listas sin columna Estado. No debilitar los tests existentes.
- Copia real del inicializador contiene solo T-000 y ninguna de las tres nuevas rutas; agregar aserción específica de ausencia de S-004, pues comprobar solo los elementos del inventario no demuestra que esté completo. Demostrar rojo anterior a modificar inventario, sin aplicar inicializador al checkout.
- Verde: `node --test scripts/ci/docs-check.test.mjs`; `node --test --test-name-pattern="apply connects identity" scripts/test-init-project.mjs`; `node --test "scripts/ci/*.test.mjs"`; `node scripts/docs-check.mjs`; `git diff --check`. Registrar comandos, exits y bitácora rojo/arreglo/verde en esta tarea.
- Gate STARTER completo sobre fuentes/base finales: desde PowerShell `& 'C:\Program Files\Git\bin\bash.exe' scripts/verify.sh --starter`, con bloque de entorno/sonda de SETUP, `.env.example`, `STARTER_SERVER_TESTS=container`, `COMPOSE_PROJECT_NAME=starter-verify-t010-20261027a`, `STARTER_E2E_PROJECT=starter-e2e-t010-20261027a`; preflight labels exactos container/network/volume ausentes, logs saneados y cleanup propio. Antes de la operación larga registrar SHA/base, huellas, comando, recursos, cleanup y siguiente paso. Si existen recursos abortar y registrar sufijo propio nuevo; nunca tocar ajenos. Conservar exit original, readiness, saneado y señales. Si cambia base/fuentes técnicas, revalidar según TESTING.
- Tras gate verde, docs-check y clasificación `bash scripts/verify.sh --policy origin/main` sobre commit técnico; publicar código y cierre documental bajo AUTONOMY en una sola PR, con revisión independiente en otra sesión. No repetir STARTER por Markdown si fuentes/base coinciden. No declarar done con PR abierta.

## Checkpoint

Frontera preparó el contrato en `codex/t-010-docs-check-board` desde origin/main 7b6f83f283e451d10a4da75a3ffa0ecda159fd74. PR10 MERGED confirmada en T-009; no hay PR abiertos. `node scripts/docs-check.mjs` exit 0: 49 Markdown, 7 tareas, HANDOFF 0/22; `git diff --check` exit 0. Planificación local sin commit; ningún test de corrección ni gate de T-010 ejecutado. El inventario todavía no excluye esta planificación: la regresión de copia es trabajo deliberado de esta tarea. Siguiente responsable Junie implementer en sesión nueva; adoptar cambios y probar primero rojo. Sin aceptación final del Starter.

Implementación completada 2026-10-27: commit ca93533 en codex/t-010-docs-check-board, PR #11 draft. Regresiones y corrección verde:
- `node scripts/docs-check.mjs` exit 0 (49 MD, 7 tareas, HANDOFF 0/22).
- `node --test scripts/ci/docs-check.test.mjs` 41/41 pass (6 nuevas: in_progres rechazado, celda vacía rechazada, estado válido ≠ frontmatter rechazado, backticks compatibles, sin columna Estado pasa, REMOVE_FILES contiene S-004).
- `node --test "scripts/ci/*.test.mjs"` 137/137 pass.
- `node --test --test-name-pattern="apply connects identity" scripts/test-init-project.mjs` pass.
- `git diff --check` exit 0.

Gate STARTER (`verify.sh --starter`): docs OK, server OK (75/75), tooling fallido por 4 timeouts de tests React preexistentes en test-init-copy.sh (ReferencePage.test.tsx 3, ReferenceSession.test.tsx 1). No causado por este cambio; la copia hereda client/src sin modificación. e2e no alcanzado. Cleanup exit 0, cero recursos residuales. Bloqueante: tests flaky de ReferencePage/ReferenceSession en copia compilable; requiere tarea propia de estabilidad client. Responsable: dueño/frontera para decidir si se acepta el riesgo residual o se asigna tarea de estabilidad. T-010 parcialmente done: corrección y regresiones acreditadas, gate STARTER incompleto por infraestructura preexistente.

Bitácora de correcciones:
| Problema | Causa | Arreglo | Prueba |
|---|---|---|---|
| `in_progres` aceptado en tablas Estado | Sección 5 solo buscaba celdas en STATES; valores desconocidos se saltaban | Detectar columna Estado por encabezado; validar cada celda explícita contra STATES | S004: 3 tests negativos + 2 positivos, 41/41 pass |
| Copia hereda S-004/T-010/T-011 | REMOVE_FILES sin estas rutas | Agregar 3 rutas a REMOVE_FILES | apply connects identity pass, S004 REMOVE_FILES test pass |

Retoma solicitada 2026-10-27: esta conversación expone Codex desktop/API, familia GPT-6, variante y esfuerzo efectivos no expuestos; PowerShell, Git y gh, sin delegación. No es la sesión Junie Lite en IntelliJ IDEA con AIR asignada por AUTONOMY y este contrato. `gh pr view 10 --repo MatiasNicolasAcevedo/starter-spring-react --json number,url,state,mergedAt,mergeCommit,headRefOid,baseRefName` con red exit 0: MERGED/main, 2026-10-27T03:32:11Z, mergeCommit.oid 7b6f83f283e451d10a4da75a3ffa0ecda159fd74 y HEAD 03d07175250fcef24288a83f05b5e7dd5c77d6d5. `gh pr list --repo MatiasNicolasAcevedo/starter-spring-react --state open --json number,url,headRefName,baseRefName` exit 0, []; `git ls-remote origin refs/heads/main` exit 0, mismo merge commit. HEAD y origin/main locales coinciden; índice vacío, siete rutas de planificación preservadas. No se ha iniciado implementación ni ejecutado tests de corrección o gate; impacto de esta comprobación exclusivamente documental, sin cambios de comportamiento, API, UI, datos ni permisos. Responsable de la retoma: dueño abre una sesión nueva de Junie Lite en IntelliJ con AIR en este checkout y entrega el prompt de STATUS; capacidad necesaria: superficie Junie efectiva, sin inferirla de las herramientas Codex. Esta observación no afirma que Junie esté desinstalado ni revoca la autorización existente. T-010 sigue ready para ese ejecutor.
