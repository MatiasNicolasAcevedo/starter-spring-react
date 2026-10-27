# Cola del starter

Acción y prompt en [STATUS](STATUS.md). Objetivo del dueño: dejar la base pulida y al día; sin aceptación final ni adopción de otra aplicación inferidas.

## En vuelo

| Tarea | Estado | Resultado |
|---|---|---|
| [T-010](tasks/T-010-docs-check-board.md) | in_progress | Estado explícito del tablero y aislamiento de esta planificación en copias |

## Bloqueadas

| Tarea | Estado | Dependencia |
|---|---|---|
| [T-011](tasks/T-011-docs-check-counts.md) | draft | T-010 done y MERGED confirmado |

## Hechas recientes

- [T-009](tasks/T-009-starter-readiness.md): diagnóstico MERGED confirmado y conciliado; R-08 causa desconocida y riesgo residual.
- [T-008](tasks/T-008-junie-merge-continuation.md): MERGED confirmado y conciliado.
- [T-007](tasks/T-007-agent-operating-rules.md): MERGED confirmado y conciliado.
- [T-006](tasks/T-006-adoption-handoff.md): MERGED confirmado y conciliado.
- [T-005](tasks/T-005-generic-baseline.md): MERGED confirmado y conciliado.

## Por refinar

- R-02 · Despliegue compartido: pendiente externo P3, dueño/proveedor/región/contrato de [DEPLOYMENT](DEPLOYMENT.md).
- R-03 · Rendimiento FULL: mejora opcional P2; tooling domina la corrida medida, sin duplicación demostrada ni comparación controlada. Evaluar al retorno a frontera con evidencia, preservando controles.
- R-05a · TEMP: hipótesis P3 no reproducida; requiere caso mínimo antes de cambiar ownership. R-05b · imágenes efímeras: mejora P3; falta decidir identificación propia y tradeoff cache/espacio, sin prune.
- R-06 · Callback OIDC: bug para replay descartado por evidencia; cambio de política UX requiere contrato y decisión del dueño.
- R-07 · Google real y aceptación final: pendientes externos del dueño, evidencia saneada y propia de cada adopción.

R-04 se ejecuta en [S-004](specs/S-004-document-verification.md). R-08 cerrada técnicamente por validación actual, sin causa histórica ni reparación acreditadas; riesgo residual de recurrencia. Ninguna fila acredita adopción ni producción.
