# Estado del starter

| Campo | Valor |
|---|---|
| Tarea y contrato | [T-008](tasks/T-008-junie-merge-continuation.md) |
| Estado | mergeable |
| Acción actual | R1 favorable; publicar APROBADO con CI propia del HEAD documental final y continuar merger de PR9 |
| Rama / PR | codex/t-008-junie-merge-continuation · [PR9](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/9) |

Revisión R1 y gate STARTER conservado en T-008; veredicto vinculante y confirmación de merge en PR9. T-007 conciliada done. No hay otra tarea predefinida ready; cada copia decide su autonomía propia.

### Prompt de la siguiente sesión

```text
Retomar únicamente el cierre de T-008/PR9 del Starter. Leer AGENTS.md, PROJECT_CONTEXT.md, docs/STATUS.md, docs/tasks/T-008-junie-merge-continuation.md, docs/AUTONOMY.md, docs/TESTING.md y docs/agents/merger.md. Precondición: consultar gh pr view 9 --repo MatiasNicolasAcevedo/starter-spring-react --json number,url,state,isDraft,mergedAt,mergeCommit,headRefOid,baseRefOid,baseRefName,statusCheckRollup. Si OPEN, completar APROBADO de la revisión independiente R1 con HEAD/base exactos y CI propia del HEAD final, o continuar merger únicamente con ese veredicto vigente, árbol limpio y elegibilidad reconsultada según AUTONOMY; squash ligado al SHA revisado, sin bypass ni confirmación rutinaria adicional del dueño. Si cambió HEAD/base o falta evidencia, volver a revisión/verificación dentro del máximo de dos rondas; conservar el gate STARTER si fuentes/base/evidencia coinciden, sin repetir FULL por Markdown. Si MERGED, confirmar fecha y mergeCommit.oid mediante la consulta explícita y devolver a frontera/dueño en otra sesión para decidir el siguiente objetivo: no hay otra tarea predefinida ready ni nueva implementación autorizada. Pendiente/responsable: dueño decide objetivo y alcance; salida: decisión explícita antes de preparar nueva tarea/rama. Conciliar T-008 done, STATUS y cola en el primer avance de esa futura rama autorizada, nunca main ni rama mergeada; no hacer commits después de APROBADO. Si hay bloqueo o problema, registrar causa/evidencia/intentos, responsable, dato/capacidad/decisión necesaria y entregar siempre el prompt completo y copiable para resolverlo. Entregar el único prompt vigente actualizado al estado remoto real, sin iniciar otra tarea en esta sesión.
```
