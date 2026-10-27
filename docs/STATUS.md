# Estado del starter

| Campo | Valor |
|---|---|
| Tarea y contrato | [T-009](tasks/T-009-starter-readiness.md) |
| Estado | mergeable |
| Acción actual | Publicar veredicto R2 y continuar merger de PR10 si cumple AUTONOMY |
| Rama / PR | codex/t-009-starter-readiness · [PR10](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/10) |

R2 favorable sobre la corrección R1; el veredicto vinculante requiere CI del HEAD final. R-08 conserva causa histórica desconocida y riesgo residual. T-009 no está done antes de MERGED confirmado; aceptación final del Starter pendiente del dueño.

### Prompt de la siguiente sesión

```text
Retomar únicamente T-009/PR10 como reviewer independiente o merger según el estado real. Leer AGENTS.md, PROJECT_CONTEXT.md, STATUS, T-009, reviewer, merger, AUTONOMY y TESTING pertinentes. Consultar `gh pr view 10 --repo MatiasNicolasAcevedo/starter-spring-react --json number,url,state,isDraft,mergedAt,mergeCommit,headRefName,headRefOid,baseRefName,baseRefOid,statusCheckRollup`, comentarios y conversaciones; una consulta fallida no verifica publicación ni merge.

Si OPEN, comprobar HEAD/base publicados, árbol/índice, gate STARTER conservado sobre fuentes técnicas/base vigentes, CI requerida verde y ausencia de bloqueos. Publicar APROBADO independiente ligado a HEAD/base finales si falta y R2 sigue vigente; después efectuar squash sin bypass ligado al SHA aprobado solo con todas las condiciones de AUTONOMY. Si cambió HEAD/base o falta evidencia, revalidar lo afectado y devolver a revisión; no repetir STARTER ni H4 por Markdown con fuentes/base iguales. Verificar MERGED en GitHub con fecha y mergeCommit.oid, y publicar cierre en PR10. Ante bloqueo registrar causa, evidencia, responsable y capacidad o decisión necesaria; no declarar done ni iniciar otra tarea.

Si MERGED confirmado, frontera en sesión nueva concilia T-009 done, STATUS y cola en el primer avance de una nueva rama autorizada, y especifica correcciones ordenadas desde el diagnóstico T-009 dentro del objetivo acordado: no hay otra tarea predefinida ready. Conservar causa histórica R-08 desconocida y riesgo residual; no afirmar reparación ni aceptación del Starter por el dueño. Salida: contratos pequeños con evidencia, dependencia, aceptación y pruebas, y único prompt vigente. No commitear en main ni en la rama mergeada.
```
