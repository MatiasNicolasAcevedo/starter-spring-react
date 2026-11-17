# Estado del starter

| Campo | Valor |
|---|---|
| Tarea y contrato | [T-012](tasks/T-012-workflow-tooling.md) · el inicializador y docs-check entregan el flujo nuevo |
| Estado | ready |
| Acción actual | Frontera implementa T-012 en sesión nueva |
| Rama / PR | `codex/t-012-workflow-tooling`, por crear · sin PR |

El 2026-11-16 el dueño adoptó el [flujo de trabajo](WORKFLOW.md): tres roles (planner, implementer y reviewer que mergea), modo del proyecto, gate diario con pruebas dirigidas y gates largos diferidos. Los documentos operativos ya lo describen. Falta llevarlo a las herramientas: T-012 (textos del inicializador y docs-check) → T-013 (E2E dirigido con filtro) → T-014 (imagen de un contenedor para PaaS). Cola en [BACKLOG](BACKLOG.md).

T-010 y T-011 están mergeadas y conciliadas (S-004 completa). El starter es usable como base hoy; las copias que se creen antes de T-012 reciben el flujo en sus documentos operativos, pero su STATUS y T-000 iniciales todavía usan el texto anterior.

## Gates diferidos

| Dato | Valor |
|---|---|
| Último integrado registrado | Gate STARTER del 2026-10-27, según el checkpoint de [T-010](tasks/T-010-docs-check-board.md) (`2e2a740d`) |
| Mergeado desde entonces | T-011 (docs-check) y la adopción documental del flujo, que agrega tres rutas a `REMOVE_FILES` |
| Recomendación | Correr `--starter` al cerrar T-014, cuando el dueño lo ordene. No antes: T-012 a T-014 tocan las mismas herramientas |

### Prompt de la siguiente sesión

```text
Actuá como frontera implementer de T-012 en MatiasNicolasAcevedo/starter-spring-react. Sesión nueva.

LEER: AGENTS.md, docs/STATUS.md, docs/agents/implementer.md, docs/WORKFLOW.md y docs/tasks/T-012-workflow-tooling.md.
PRECONDICIÓN: main local igual a origin/main, sin PR abiertos (gh pr list --repo MatiasNicolasAcevedo/starter-spring-react --state open) y docs/WORKFLOW.md presente en main. Si la adopción documental del flujo todavía está en un PR abierto, esperar su MERGED e informar.
ACCIÓN: 1) Rama codex/t-012-workflow-tooling desde main actualizado; T-012 in_progress en tarea y STATUS. 2) Tests rojos de AC-01 y AC-02. 3) Implementar las reglas de docs-check y los textos generados por el inicializador. 4) Verde: node --test scripts/ci/docs-check.test.mjs, node --test scripts/test-init-project.mjs, node --test "scripts/ci/*.test.mjs" y node scripts/docs-check.mjs. 5) PR contra main.
GATE: diario. FULL y STARTER están diferidos: no ejecutarlos sin orden expresa del dueño.
SALIDA: PR de T-012 publicado, tarea in_review. Terminar con el prompt de reviewer que trae la tarea, con número de PR y SHA, en STATUS y completo en la respuesta final.
```
