# Estado del starter

| Campo | Valor |
|---|---|
| Tarea y contrato | [T-008](tasks/T-008-junie-merge-continuation.md) |
| Estado | in_review |
| Acción actual | Revisión independiente de PR9; si aprueba y es elegible, continuar merger sin confirmación rutinaria del dueño |
| Rama / PR | codex/t-008-junie-merge-continuation · [PR9](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/9) |

Gate STARTER verde, evidencia y checkpoint en T-008. T-007 conciliada done mediante consulta explícita de PR8. No hay otra tarea predefinida ready; cada copia decide su autonomía propia.

### Prompt de la siguiente sesión

```text
Revisar únicamente T-008/PR9 del Starter en una sesión nueva, distinta de su implementación. Leer AGENTS.md, PROJECT_CONTEXT.md, docs/STATUS.md, docs/tasks/T-008-junie-merge-continuation.md y sus referencias concretas, docs/AUTONOMY.md, docs/TESTING.md y docs/agents/reviewer.md. Precondición: consultar gh pr view 9 --repo MatiasNicolasAcevedo/starter-spring-react --json number,url,state,isDraft,mergedAt,mergeCommit,headRefOid,baseRefOid,baseRefName,statusCheckRollup; comprobar árbol limpio, HEAD/base publicados y evidencia saneada del gate STARTER. Si OPEN, revisar el diff completo, el permiso explícito de Junie para merge elegible, la continuidad con prompt ante bloqueantes y la exclusión de T-008 en copias sin heredar permisos. Conservar el gate si fuentes/base/evidencia coinciden; no repetir FULL por la transición Markdown. Publicar APROBADO o CAMBIOS REQUERIDOS con HEAD/base exactos y CI propia del HEAD final, máximo dos rondas. Si aprueba y AUTONOMY sigue satisfecha, continuar docs/agents/merger.md para el mismo PR, sin pedir nueva confirmación al dueño por ser Junie; squash ligado al SHA revisado, sin bypass. Confirmar MERGED, mergedAt y mergeCommit.oid con consulta explícita a GitHub antes de anunciar merge. Si hay bloqueo o problema, registrar causa/evidencia/intentos, responsable, dato/capacidad/decisión necesaria y entregar siempre el prompt completo y copiable para resolverlo. Salida: veredicto y merge confirmado o retoma concreta, sin iniciar otra tarea. Si ya está MERGED, confirmar fecha/SHA y devolver a frontera/dueño para decidir el siguiente objetivo: no hay otra tarea predefinida ready. Conciliar T-008 done/STATUS/cola en el primer avance de esa futura rama autorizada, nunca main ni rama mergeada; no hacer commits después de APROBADO. Entregar en la respuesta final el único prompt vigente actualizado al estado remoto real.
```
