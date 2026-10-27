# Estado del starter

| Campo | Valor |
|---|---|
| Tarea y contrato | [T-010](tasks/T-010-docs-check-board.md) |
| Estado | in_progress |
| Acción actual | Junie implementa S-004 regla 1 y 3: checker rechaza estados inválidos en tablas con columna Estado; REMOVE_FILES incluye S-004/T-010/T-011 |
| Rama / PR | codex/t-010-docs-check-board · sin PR |

T-009 MERGED y conciliada; S-004 ordena dos correcciones de R-04. T-011 espera T-010. La retoma en Codex comprobó la precondición pero no expone la superficie Junie asignada; evidencia en T-010. R-08 conserva causa histórica desconocida y riesgo residual; la aceptación final corresponde al dueño.

### Prompt de la siguiente sesión

```text
El dueño abre una sesión nueva de Junie Lite en IntelliJ IDEA con AIR sobre este checkout y le entrega T-010 en la rama codex/t-010-docs-check-board. La retoma anterior fue en Codex, no en la superficie Junie asignada, y solo verificó PR10 y el estado local; no implementó ni ejecutó tests. Junie lee AGENTS.md, PROJECT_CONTEXT.md, STATUS, T-010, S-004, el protocolo implementer, AUTONOMY y TESTING/SETUP pertinentes; consulta .junie/TOOLS.md para capacidades efectivas. Precondición: preservar los cambios de planificación locales sin reset, comprobar árbol/índice, HEAD y main remoto, PR abiertas y confirmar con gh pr view 10 --repo MatiasNicolasAcevedo/starter-spring-react --json number,url,state,mergedAt,mergeCommit,headRefOid,baseRefName que PR10 está MERGED con fecha y mergeCommit.oid válidos. Una consulta fallida no verifica el merge.

Adoptar la conciliación y ejecutar el contrato T-010: primero demostrar rojo para estados explícitos inválidos y copia que hereda S-004/tareas; corregir mínimamente checker e inventario, conservar compatibilidad de tablero simplificado y controles existentes, y registrar rojo/verde y resultados. Antes del gate STARTER completo, preparar checkpoint, preflight de recursos propios y cleanup exacto según la tarea y SETUP. Mantener versiones, permisos, tests y límites de seguridad; no afirmar reparación de R-08 ni aceptar el Starter. Con gate y docs-check verdes, publicar código y cierre bajo AUTONOMY en una sola PR; entregar revisión independiente en sesión distinta. Ante bloqueo, registrar causa, evidencia, responsable y capacidad o decisión necesaria. Salida: tarea y PR con evidencia o checkpoint verificable, y único prompt completo vigente para el siguiente rol y tarea.
```
