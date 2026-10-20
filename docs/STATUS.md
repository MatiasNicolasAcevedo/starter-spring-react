# Estado del starter

| Campo | Valor |
|---|---|
| Tarea y contrato | [T-005](tasks/T-005-generic-baseline.md) |
| Estado | mergeable |
| Acción actual | Revisión R1/R2 favorable; publicar veredicto con CI propia del HEAD documental y continuar merger del mismo PR |
| Rama / PR | codex/t-005-generic-baseline · [PR #6](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/6) |

La base sigue en ajuste para el uso del dueño. Evidencia y comandos en la tarea; HEAD/CI propios del cierre en el comentario de publicación más reciente del PR. Proveedor/región/dominio pendientes para cuando exista una app; ningún despliegue ni ejecución Junie acreditados. Kit sin operar.

### Prompt de la siguiente sesión
```text
Retomar T-005/PR #6 en sesión nueva. Leer AGENTS, PROJECT_CONTEXT, tarea y último checkpoint de revisión R1/R2, AUTONOMY, TESTING y protocolo merger. Primero consultar estado remoto: si sigue OPEN, completar únicamente el merge elegible según el último APROBADO con HEAD/base/checks exactos; si falta veredicto vigente, devolver a revisión. Si está MERGED, confirmar SHA/fecha y reconciliar T-005/STATUS en el primer avance de una futura rama autorizada, nunca en main ni en la rama mergeada. El objetivo de mantenimiento vuelve a frontera/dueño: no hay otra tarea predefinida ready; no inventar ni iniciar implementación. Preservar cambios ajenos y evidencia válida, sin repetir suites largas por cierre Markdown. CI liviana no acredita FULL remoto. Sin operación Junie automática, compra/deploy, Google/datos reales, otros repos ni kit; sin aceptación/adopción por herencia.
```
