# Estado del starter

| Campo | Valor |
|---|---|
| Tarea y contrato | [T-007](tasks/T-007-agent-operating-rules.md) |
| Estado | mergeable |
| Acción actual | R1 favorable; publicar APROBADO con CI propia del HEAD documental y continuar merger de PR8 |
| Rama / PR | codex/t-007-agent-operating-rules · [PR8](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/8) |

Evidencia y revisión R1 en T-007; veredicto vinculante y confirmación de merge en PR8. Gate STARTER conservado por fuentes/base idénticas. Las futuras copias reciben las reglas integradas sin heredar tarea, permisos ni resultados del mantenimiento. No hay otra tarea predefinida ready.

### Prompt de la siguiente sesión

```text
Retomar únicamente el cierre de T-007/PR8 del Starter. Leer AGENTS.md, PROJECT_CONTEXT.md, docs/STATUS.md, docs/tasks/T-007-agent-operating-rules.md, docs/AUTONOMY.md, docs/TESTING.md y docs/agents/merger.md. Precondición: consultar gh pr view 8 --repo MatiasNicolasAcevedo/starter-spring-react --json number,url,state,mergedAt,mergeCommit,headRefOid,baseRefOid,baseRefName,statusCheckRollup. Si OPEN, completar APROBADO de la revisión independiente R1 con HEAD/base exactos y CI propia, o continuar merger únicamente con ese veredicto vigente y elegibilidad reconsultada según AUTONOMY. Cambios de HEAD/base o evidencia insuficiente vuelven a revisión dentro del máximo de dos rondas; no repetir FULL por Markdown con fuentes/base/evidencia válidas. Si MERGED, confirmar fecha y mergeCommit.oid mediante esa consulta y devolver al dueño en una sesión de frontera para decidir el siguiente objetivo o preparación de una nueva copia, sin operar otras aplicaciones desde aquí. No hay otra tarea predefinida ready ni nueva implementación autorizada. Pendiente: decisión del dueño; salida: objetivo y alcance explícitos antes de preparar una nueva tarea/rama. Conciliar T-007 done, STATUS y cola únicamente en el primer avance de esa futura rama autorizada, nunca main ni rama mergeada; no hacer commits después de APROBADO. Mejora del Starter integrada no acredita adopción de una aplicación ni producto iniciado. Entregar siempre este prompt completo y copiable, actualizado al estado remoto real.
```
