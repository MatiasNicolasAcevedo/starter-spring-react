# Estado del starter

| Campo | Valor |
|---|---|
| Tarea y contrato | [T-007](tasks/T-007-agent-operating-rules.md) |
| Estado | in_review |
| Acción actual | Revisión independiente R1 de PR8; gate STARTER propio completo y cleanup correctos |
| Rama / PR | codex/t-007-agent-operating-rules · [PR8](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/8) |

Evidencia, fuentes/base y pendiente en T-007. Sin APROBADO ni MERGED propios; CI del HEAD final se comprueba en GitHub. Las futuras copias reciben estas reglas al usar la versión revisada e integrada, sin heredar tarea, permisos ni resultados del mantenimiento.

### Prompt de la siguiente sesión

```text
Sesión nueva e independiente de frontera reviewer para T-007/PR8 del Starter, rama codex/t-007-agent-operating-rules. Leer AGENTS.md, PROJECT_CONTEXT.md, docs/STATUS.md, docs/tasks/T-007-agent-operating-rules.md, AUTONOMY, TESTING y protocolo reviewer. Consultar gh pr view 8 --repo MatiasNicolasAcevedo/starter-spring-react --json number,url,state,mergedAt,mergeCommit,headRefOid,baseRefOid,baseRefName,statusCheckRollup. Si OPEN, revisar el diff completo, reglas heredables y exclusión de mantenimiento, rojo/verde y gate STARTER de las mismas fuentes/base, huellas y cleanup; ejecutar dirigidos pertinentes sin repetir FULL por una transición solo Markdown con evidencia válida. Publicar APROBADO o CAMBIOS REQUERIDOS con HEAD/base exactos y CI vigente, máximo dos rondas. Continuar el merger del mismo PR solo si es elegible según AUTONOMY; confirmar MERGED, fecha y SHA mediante nueva consulta explícita a GitHub. Si ya está MERGED, confirmar esos datos y entregar el regreso al dueño sin commits en main ni en rama mergeada. No hay otra tarea predefinida ready ni autorización para operar otras aplicaciones. Entregar siempre el prompt completo y copiable del siguiente rol/acción, con pendiente y condición de salida; conciliación de done en el primer avance de una futura rama autorizada.
```
