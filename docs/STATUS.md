# Estado del starter

| Campo | Valor |
|---|---|
| Tarea y contrato | [T-009](tasks/T-009-starter-readiness.md) |
| Estado | in_review |
| Acción actual | Revisión independiente de la corrección R1 y elegibilidad de PR10 |
| Rama / PR | codex/t-009-starter-readiness · [PR10](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/10) |

R1 fue corregida en el diagnóstico; R-08 permanece cerrado técnicamente con causa histórica desconocida y riesgo residual explícitos. T-009 no está done antes de MERGED confirmado; aceptación final del Starter pendiente del dueño.

### Prompt de la siguiente sesión

```text
Retomar únicamente T-009/PR10 como reviewer independiente en sesión nueva, distinta de la implementación. Leer AGENTS.md, PROJECT_CONTEXT.md, STATUS, T-009 y su revisión R1, los protocolos reviewer y merger, AUTONOMY y TESTING pertinentes. Comprobar árbol/índice, rama y PR10 exacta con `gh pr view 10 --repo MatiasNicolasAcevedo/starter-spring-react --json number,url,state,isDraft,headRefName,headRefOid,baseRefOid,baseRefName,statusCheckRollup`, HEAD/base publicados, comentario R1 y CI del HEAD final; una consulta fallida no verifica publicación.

Precondición: PR abierta en la misma rama, HEAD/base vigentes y evidencia del STARTER aplicable a las fuentes técnicas y base actuales. Revisar las correcciones R1 de uso local, cierre técnico R-08 y tiempos/contexto R-03 frente al gate y sus límites; conservar causa histórica desconocida y riesgo residual sin afirmar reparación. Ejecutar docs-check, diff-check y verificaciones dirigidas pertinentes. No repetir STARTER ni H4 por Markdown con fuentes técnicas/base iguales; revalidar lo afectado si cambiaron o falta evidencia. Registrar hallazgos y publicar veredicto independiente con SHA HEAD/base y evidencia en PR10; comprobar CI y todas las condiciones de AUTONOMY. Si es elegible, el revisor puede continuar como merger en la misma sesión, sin bypass y ligado al SHA revisado; verificar MERGED en GitHub. Si existe bloqueo, registrar causa, evidencia, responsable y dato necesario. No iniciar otra tarea ni aceptar el Starter por el dueño; entregar el único prompt vigente completo.
```
