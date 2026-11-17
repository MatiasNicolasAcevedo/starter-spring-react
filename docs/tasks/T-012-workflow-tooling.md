---
id: T-012
status: ready
priority: P1
size: M
milestone: M1
spec: null
depends_on: []
branch: codex/t-012-workflow-tooling
role: implementer
executor: frontier
counts_for_cycle: false
pr: null
---
# T-012 · El inicializador y docs-check entregan el flujo nuevo

## Objetivo
Una aplicación creada desde esta base nace con el [flujo de trabajo](../WORKFLOW.md) ya aplicado: su STATUS, BACKLOG, ROADMAP, AUTONOMY y T-000 generados hablan de tres roles, modo del proyecto, gate diario y gates diferidos, y docs-check protege la higiene mínima. Hoy los documentos operativos del starter ya describen el flujo, pero los textos que genera el inicializador todavía piden FULL al cierre y cadencia de cinco tareas.

Siguiente tarea predefinida: [T-013](T-013-targeted-e2e.md), que solo espera el MERGED de esta.

## Alcance y decisiones resueltas
Incluye:
- `scripts/lib/init-project-documents.mjs`: los textos generados para `docs/STATUS.md`, `docs/BACKLOG.md`, `docs/ROADMAP.md`, `docs/AUTONOMY.md`, `docs/HANDOFF.md` y `docs/tasks/T-000-adoption.md`.
  - STATUS generado: tabla, sección `## Gates diferidos` con «Sin integrado propio todavía» y prompt con la plantilla de WORKFLOW (LEER, PRECONDICIÓN, ACCIÓN, GATE, SALIDA), sin placeholders.
  - AUTONOMY generado: además de lo actual, pide declarar el modo (`FRONTERA_CONTINUA` o `LOTES_JUNIE`) e incluye la sección «Decisiones vigentes del dueño» vacía. No hereda las decisiones del starter.
  - ROADMAP generado: conserva la fila `Cadencia efectiva` con un entero (docs-check la exige) y describe el lote y la revisión de lote en lugar del control cada cinco tareas.
  - T-000 generado: la aceptación pide gate diario y registra `FULL/STARTER: DIFERIDO POR EL DUEÑO`; el integrado de adopción lo ordena el dueño.
- `scripts/docs-check.mjs`: `docs/WORKFLOW.md` pasa a ser archivo obligatorio; STATUS falla si supera 60 líneas o si no tiene la sección `## Gates diferidos`.
- Tests de ambos en `scripts/ci/docs-check.test.mjs` y `scripts/test-init-project.mjs`.
- `docs/STATUS.md` del starter ya cumple ambas reglas nuevas; verificarlo.

Excluye: cambiar `verify.sh`, workflows, el clasificador o cualquier suite; tocar código de aplicación; el filtro de E2E (T-013) y el despliegue (T-014). No se relaja ninguna validación existente.

Decisión resuelta: el límite de STATUS es de 60 líneas contadas sobre el archivo completo, incluido el prompt. Los proyectos derivados que ya existen lo adoptan cuando actualicen su docs-check; esta tarea no los modifica.

## Leer antes
- [WORKFLOW](../WORKFLOW.md), completo.
- `scripts/lib/init-project-documents.mjs`, completo (37 líneas).
- `scripts/docs-check.mjs`, bloques 1 y 7.
- `scripts/test-init-project.mjs`, aserciones sobre documentos generados.
- [TESTING](../TESTING.md#gate-diario).

## Archivos y pasos
1. Rojo: tests nuevos en `scripts/ci/docs-check.test.mjs` (falta WORKFLOW, STATUS de 61 líneas, STATUS sin «Gates diferidos») y en `scripts/test-init-project.mjs` (STATUS generado contiene `## Gates diferidos` y `GATE:`; T-000 generado contiene `DIFERIDO POR EL DUEÑO`; AUTONOMY generado contiene `LOTES_JUNIE`).
2. Implementar las tres reglas de docs-check y los textos generados.
3. Verde y regresiones.
4. Agregar esta tarea a la evidencia y dejar T-013 lista.

## Aceptación y pruebas
| Criterio observable | Capa elegida y por qué | Comando exacto (directorio/entorno) | Resultado esperado |
|---|---|---|---|
| AC-01 docs-check exige WORKFLOW y limita STATUS | Unitaria Node con fixtures: regla determinista | `node --test scripts/ci/docs-check.test.mjs` en la raíz | Rojo antes, verde después; casos previos intactos |
| AC-02 la copia inicializada nace con el flujo nuevo | Test Node del inicializador sobre copia temporal | `node --test scripts/test-init-project.mjs` en la raíz | Verde con las aserciones nuevas |
| AC-03 el starter sigue válido | Checker real | `node scripts/docs-check.mjs` y `node --test "scripts/ci/*.test.mjs"` en la raíz | Exit 0 |
| AC-04 la copia generada pasa su propio docs-check | Test existente de copia | Incluido en AC-02 | Verde |

Gate diario: los cuatro comandos anteriores, `git diff --check` y `bash scripts/verify.sh --policy origin/main` solo para anotar el perfil, que será STARTER. `FULL/STARTER: DIFERIDO POR EL DUEÑO`: no ejecutar `--starter`, `--tooling` ni FULL sin orden expresa.

## Checkpoint vigente
Contrato preparado por frontera el 2026-11-16 junto con la adopción documental del flujo. Sin rama ni PR todavía. No se ejecutó ninguna prueba de esta tarea.

## Correcciones significativas
| Fecha / SHA o pendiente de commit | Problema y causa comprobada | Corrección | Prueba y resultado |
|---|---|---|---|

## Prompts de salida
Al publicar la implementación o una corrección (para el reviewer):
```text
Actuá como frontera reviewer de T-012 en MatiasNicolasAcevedo/starter-spring-react. Sesión nueva, distinta de la que implementó.

LEER: AGENTS.md, docs/STATUS.md, docs/agents/reviewer.md, docs/WORKFLOW.md y docs/tasks/T-012-workflow-tooling.md.
PRECONDICIÓN: el PR de la rama codex/t-012-workflow-tooling está abierto contra main; consultalo con gh pr view y --repo explícito y tomá su HEAD. Si no existe o ya está MERGED, informar el estado real y entregar el prompt corregido.
ACCIÓN: 1) Revisar el diff completo contra AC-01 a AC-04. 2) Correr node --test scripts/ci/docs-check.test.mjs, node --test scripts/test-init-project.mjs, node --test "scripts/ci/*.test.mjs" y node scripts/docs-check.mjs. 3) Comprobar que no se relajó ninguna validación previa. 4) Con hallazgos: CAMBIOS REQUERIDOS y prompt de corrección. 5) Sin hallazgos: commit de transición, verify-required verde, APROBADO, squash y MERGED confirmado.
GATE: diario. FULL y STARTER están diferidos: no ejecutarlos sin orden expresa del dueño.
SALIDA: PR mergeado y confirmado, o lista cerrada de hallazgos. Terminar con el prompt de la sesión siguiente en STATUS y completo en la respuesta final.
```

Al aprobar y mergear (para la tarea siguiente):
```text
Actuá como frontera implementer de T-013 en MatiasNicolasAcevedo/starter-spring-react. Sesión nueva.

LEER: AGENTS.md, docs/STATUS.md, docs/agents/implementer.md, docs/WORKFLOW.md y docs/tasks/T-013-targeted-e2e.md.
PRECONDICIÓN: el PR de T-012 figura MERGED en GitHub (gh pr view con --repo, state, mergedAt y mergeCommit.oid). Si no, informar el estado real y entregar el prompt corregido.
ACCIÓN: 1) Rama codex/t-013-targeted-e2e desde main actualizado. 2) Primer commit: conciliar T-012 done y T-013 ready en tarea, BACKLOG y STATUS. 3) Implementar el contrato de T-013. 4) Gate diario y PR.
GATE: diario. FULL y STARTER están diferidos: no ejecutarlos sin orden expresa del dueño.
SALIDA: PR de T-013 publicado y listo para revisión. Terminar con el prompt de reviewer en STATUS y completo en la respuesta final.
```

## Cierre y siguiente tarea
No done hasta MERGED comprobado. La sesión siguiente concilia esta tarea en el primer commit de la rama de T-013.
