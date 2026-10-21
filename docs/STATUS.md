# Estado del starter

| Campo | Valor |
|---|---|
| Tarea y contrato | [T-006](tasks/T-006-adoption-handoff.md) |
| Estado | mergeable |
| Acción actual | R1 favorable; publicar APROBADO con CI propia del HEAD documental y continuar merger del mismo PR |
| Rama / PR | codex/t-006-adoption-handoff · [PR #7](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/7) |

Contrato, revisión R1 y evidencia en la tarea; veredicto vinculante y confirmación de merge en el PR. Esta mejora no acredita adopción de aplicaciones ni ejecución Junie. No hay otra tarea predefinida ready en el starter.

### Prompt de la siguiente sesión
```text
Retomar únicamente el cierre de T-006/PR #7. Leer AGENTS, PROJECT_CONTEXT, tarea/checkpoint R1, AUTONOMY, TESTING y protocolo merger. Primero comprobar el estado remoto: si OPEN, completar veredicto con CI propia y HEAD/base exactos o continuar merge únicamente con APROBADO vigente, checks verdes y elegibilidad reconsultada; si falta evidencia, devolver a revisión dentro del límite de dos rondas. Si MERGED, confirmar fecha/SHA y devolver al dueño para preparar adopción acotada en aplicación propia en otra sesión, sin operar esa aplicación desde aquí. No hay otra tarea predefinida ready ni implementación autorizada en este starter. Conciliar T-006/STATUS/cola únicamente en el primer avance de una futura rama autorizada, nunca en main ni en la rama mergeada; no hacer commits después de APROBADO. Mejora del starter mergeada no acredita adopción propia ni producto iniciado. Conservar el gate válido mientras fuentes/base coincidan; sin protecciones nuevas, datos reales, otros repos, despliegue ni kit.
```
