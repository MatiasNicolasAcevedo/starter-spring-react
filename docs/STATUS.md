# Estado del starter

| Campo | Valor |
|---|---|
| Tarea y contrato | [T-009](tasks/T-009-starter-readiness.md) |
| Estado | changes_requested |
| Acción actual | Conciliar las contradicciones del diagnóstico señaladas en la revisión R1 de T-009 |
| Rama / PR | codex/t-009-starter-readiness · [PR10](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/10) |

R1 detectó contradicciones documentales sobre la ejecución final y el estado de R-08; detalle y evidencia en T-009. R-08 permanece cerrado técnicamente con causa histórica desconocida y riesgo residual explícitos. T-009 no está done antes de MERGED confirmado; aceptación final del Starter pendiente del dueño.

### Prompt de la siguiente sesión

```text
Retomar únicamente T-009/PR10 como implementer en sesión nueva. Leer AGENTS.md, PROJECT_CONTEXT.md, STATUS, T-009 y su revisión R1, implementer, AUTONOMY y TESTING pertinentes. Comprobar árbol/índice, PR10 exacta con `gh pr view 10 --repo MatiasNicolasAcevedo/starter-spring-react --json number,url,state,isDraft,headRefOid,baseRefOid,baseRefName,statusCheckRollup`, HEAD/base publicados y comentario de R1; una consulta fallida no verifica publicación. Precondición: PR abierta en la misma rama y evidencia de gate/fuentes/base vigentes; si cambiaron, revalidar lo afectado.

Corregir las contradicciones documentales R1: la fila de uso local debe distinguir la corrida histórica interrumpida del STARTER final verde que sí ejecutó nginx/Vite, persistencia y proxies; la introducción de candidatos debe reflejar R-08 cerrado técnicamente; actualizar R-03 con los tiempos finales disponibles y su contexto. Conservar causa histórica desconocida y riesgo residual, sin afirmar reparación de timeout. No cambiar aplicación, tests, configuración, versiones o permisos; no repetir H4 ni STARTER por Markdown con fuentes técnicas/base iguales. Registrar corrección y evidencia, ejecutar docs-check y diff-check, publicar rutas explícitas en la misma PR y verificar HEAD remoto. Devolver a revisión independiente en otra sesión con prompt completo para revalidar R1, CI y elegibilidad de merge. Si existe bloqueo, registrar causa, evidencia, responsable y dato necesario; no iniciar otra tarea ni aceptar el Starter por el dueño.
```
