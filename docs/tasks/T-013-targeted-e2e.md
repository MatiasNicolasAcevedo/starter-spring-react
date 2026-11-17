---
id: T-013
status: draft
priority: P1
size: M
milestone: M1
spec: null
depends_on: [T-012]
branch: codex/t-013-targeted-e2e
role: implementer
executor: frontier
counts_for_cycle: false
pr: null
---
# T-013 · E2E dirigido con filtro y proyecto

## Objetivo
`bash scripts/e2e.sh --grep "patrón" --project desktop` ejecuta solo los casos Playwright que coinciden, en un solo proyecto, con el mismo stack real, readiness, artefactos y cleanup que la suite completa. Es la pieza que hace posible el [gate diario](../TESTING.md#gate-diario): en una aplicación derivada la suite completa pasó los 100 minutos y el filtro resolvió la iteración.

Draft solo por la dependencia de T-012; todas las decisiones están resueltas. Siguiente tarea predefinida: [T-014](T-014-single-container-deploy.md).

## Alcance y decisiones resueltas
Incluye:
- `scripts/e2e.sh`: acepta `--grep <patrón>` y `--project <desktop|mobile>`, los valida, rechaza opciones desconocidas y los pasa al runner. Sin argumentos conserva exactamente el comportamiento actual.
- `scripts/run-e2e.mjs`: recibe y reenvía esos argumentos a Playwright sin interpretarlos como shell.
- `scripts/ci/e2e-arguments.test.mjs`: test Node con runner ficticio para la validación y el reenvío de argumentos, incluido en el job liviano de CI.
- TESTING: quitar la frase condicional «si `scripts/e2e.sh` todavía no acepta…» del gate diario.

Fuente de referencia: la implementación ya probada en el repositorio hermano DevNotes (`scripts/e2e.sh`, `scripts/run-e2e.mjs`, `scripts/ci/e2e-arguments.test.mjs`). Portar solo lo genérico: dejar fuera las variables y fixtures de voz, OCR y portabilidad de ese producto.

Excluye: cambiar specs de Playwright, timeouts, retries, workers o el contenido de la suite; tocar `verify.sh` más allá de lo que exija el reenvío.

## Leer antes
- `scripts/e2e.sh` y `scripts/run-e2e.mjs` de este repo.
- Los mismos dos archivos y `scripts/ci/e2e-arguments.test.mjs` en DevNotes, como referencia de lectura.
- `e2e/README.md`.
- [TESTING](../TESTING.md#gate-diario) y [SETUP](../SETUP.md#verificación-desde-powershell).

## Archivos y pasos
1. Rojo: `scripts/ci/e2e-arguments.test.mjs` con casos de filtro válido, proyecto inválido, opción desconocida y ejecución sin argumentos.
2. Implementar el análisis de argumentos en `e2e.sh` y el reenvío en `run-e2e.mjs`.
3. Ensayo real único: un spec corto de la base con `--grep` y `--project desktop`, namespace propio y cleanup comprobado.
4. Actualizar TESTING y `e2e/README.md`.

## Aceptación y pruebas
| Criterio observable | Capa elegida y por qué | Comando exacto (directorio/entorno) | Resultado esperado |
|---|---|---|---|
| AC-01 argumentos validados y reenviados | Unitaria Node con runner ficticio | `node --test scripts/ci/e2e-arguments.test.mjs` en la raíz | Rojo antes, verde después |
| AC-02 el filtro corre solo lo pedido contra el stack real | Un E2E real dirigido | `STARTER_E2E_PROJECT=starter-e2e-t013 bash scripts/e2e.sh --grep "system" --project desktop` en la raíz, Git Bash | Solo los casos que coinciden, exit 0, sin recursos residuales con ese label |
| AC-03 sin argumentos no cambia nada | Test de argumentos más lectura del diff | Incluido en AC-01 | Mismo comando final que antes |
| AC-04 herramientas y documentos válidos | Checkers | `node --test "scripts/ci/*.test.mjs"` y `node scripts/docs-check.mjs` | Exit 0 |

Gate diario: los comandos anteriores, `git diff --check` y `--policy` para anotar el perfil (STARTER). `FULL/STARTER: DIFERIDO POR EL DUEÑO`. Como la tarea cambia el runner de E2E, el cierre **recomienda** al dueño el integrado en el registro de STATUS; no lo ejecuta.

## Checkpoint vigente
Contrato preparado por frontera el 2026-11-16. Sin rama ni PR. No se ejecutó nada.

## Correcciones significativas
| Fecha / SHA o pendiente de commit | Problema y causa comprobada | Corrección | Prueba y resultado |
|---|---|---|---|

## Prompts de salida
Al publicar la implementación o una corrección (para el reviewer):
```text
Actuá como frontera reviewer de T-013 en MatiasNicolasAcevedo/starter-spring-react. Sesión nueva, distinta de la que implementó.

LEER: AGENTS.md, docs/STATUS.md, docs/agents/reviewer.md, docs/WORKFLOW.md y docs/tasks/T-013-targeted-e2e.md.
PRECONDICIÓN: el PR de la rama codex/t-013-targeted-e2e está abierto contra main; consultalo con gh pr view y --repo explícito y tomá su HEAD. Si no, informar el estado real y entregar el prompt corregido.
ACCIÓN: 1) Revisar el diff contra AC-01 a AC-04 y confirmar que sin argumentos el comando final no cambió. 2) Correr node --test scripts/ci/e2e-arguments.test.mjs, node --test "scripts/ci/*.test.mjs" y node scripts/docs-check.mjs. 3) Repetir el E2E dirigido de AC-02 con namespace propio y comprobar el cleanup. 4) Con hallazgos: CAMBIOS REQUERIDOS y prompt de corrección. 5) Sin hallazgos: commit de transición, verify-required verde, APROBADO, squash y MERGED confirmado.
GATE: diario. FULL y STARTER están diferidos: no ejecutarlos sin orden expresa del dueño.
SALIDA: PR mergeado y confirmado, o lista cerrada de hallazgos. Terminar con el prompt de la sesión siguiente en STATUS y completo en la respuesta final.
```

Al aprobar y mergear (para la tarea siguiente):
```text
Actuá como frontera implementer de T-014 en MatiasNicolasAcevedo/starter-spring-react. Sesión nueva.

LEER: AGENTS.md, docs/STATUS.md, docs/agents/implementer.md, docs/WORKFLOW.md, docs/DEPLOYMENT.md y docs/tasks/T-014-single-container-deploy.md.
PRECONDICIÓN: el PR de T-013 figura MERGED en GitHub (gh pr view con --repo, state, mergedAt y mergeCommit.oid). Si no, informar el estado real y entregar el prompt corregido.
ACCIÓN: 1) Rama codex/t-014-single-container-deploy desde main actualizado. 2) Primer commit: conciliar T-013 done y T-014 ready. 3) Implementar el contrato de T-014. 4) Gate diario y PR.
GATE: diario. FULL y STARTER están diferidos: no ejecutarlos sin orden expresa del dueño.
SALIDA: PR de T-014 publicado y listo para revisión. Terminar con el prompt de reviewer en STATUS y completo en la respuesta final.
```

## Cierre y siguiente tarea
No done hasta MERGED comprobado. La sesión siguiente concilia esta tarea en el primer commit de la rama de T-014.
