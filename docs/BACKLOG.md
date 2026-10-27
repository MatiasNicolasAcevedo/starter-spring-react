# Cola del starter

Acción y prompt en [STATUS](STATUS.md). Objetivo del dueño: dejar la base pulida y al día; primero obtener el diagnóstico de T-009. Sin aceptación final ni adopción de otra aplicación inferidas.

## En vuelo

| Tarea | Estado | Resultado |
|---|---|---|
| [T-009](tasks/T-009-starter-readiness.md) | mergeable | R2 favorable; pendiente veredicto y CI del HEAD final y MERGED confirmado |

## Hechas recientes

- [T-008](tasks/T-008-junie-merge-continuation.md): MERGED confirmado y conciliado al preparar T-009.
- [T-007](tasks/T-007-agent-operating-rules.md): MERGED confirmado y conciliado en T-008.
- [T-006](tasks/T-006-adoption-handoff.md): MERGED confirmado y conciliado en T-007.
- [T-005](tasks/T-005-generic-baseline.md): MERGED confirmado y conciliado en T-006.

## Por refinar

Tras MERGED confirmado de T-009, frontera prepara contratos de corrección/validación desde hallazgos comprobados dentro del objetivo aceptado. Esas tareas todavía no están definidas ni ready. Clasificación, límites, responsable, aceptación y pruebas en el [diagnóstico T-009](tasks/T-009-starter-readiness.md#registro-de-candidatos-y-pendientes):

- R-02 · Despliegue compartido: pendiente externo P3, dueño/proveedor/región/contrato de [DEPLOYMENT](DEPLOYMENT.md).
- R-03 · Rendimiento FULL: mejora opcional P2, priorizar desde TIMING propio conservando aislamiento, negativos y cleanup.
- R-04 · Estados del tablero/conteos repetidos: mejora opcional P2 con dos huecos del checker reproducidos; frontera especifica corrección posterior.
- R-05a/b · TEMP: hipótesis P3 no reproducida por la sonda actual; imágenes efímeras: mejora opcional P3 con ownership por definir, sin prune.
- R-06 · Callback OIDC fallido con sesión previa: hipótesis de bug descartada para replay ya cubierto; política de cierre explícita y límite de variantes/Google real. Cualquier cambio UX requiere contrato posterior.

R-08 cerrado técnicamente el 2026-10-27 bajo la decisión de cierre práctico del dueño: STARTER actual completo verde con los 133 tests/client intactos, causa histórica desconocida y riesgo residual explícitos. T-009 pendiente de veredicto final y merge; no done antes de MERGED. R-01 corrige la exclusión de T-009 de la copia; R-07 conserva Google real/aceptación final como pendientes externos del dueño. Ninguna fila acredita adopción ni producción.
