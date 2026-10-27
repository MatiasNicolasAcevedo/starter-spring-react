---
id: S-004
status: approved
version: 1
milestone: M1
tasks: [T-010, T-011]
---
# S-004 · Verificación documental del mantenimiento

## Iteración y objetivo de salida

Resolver los dos huecos reproducidos R-04 de [T-009](../tasks/T-009-starter-readiness.md#registro-de-candidatos-y-pendientes), sin romper tableros simplificados ni la adopción propia. Salida: ambas tareas mergeadas y conciliadas, regresiones y gate correspondiente acreditados; volver a frontera para evaluar el objetivo del dueño y los pendientes, sin declarar su aceptación. WIP una tarea/PR; T-011 espera T-010. La evidencia de T-009 registra que el checker aceptó `in_progres` explícito y un segundo conteo contradictorio; no implica que los documentos reales fueran incoherentes.

## Contrato

1. En una tabla de BACKLOG con encabezado `Estado`, validar la celda de estado de cada fila de tarea aunque su valor sea desconocido, y rechazar error o desacuerdo. Las listas y tablas sin columna Estado siguen admitidas; se mantienen validación de sección, WIP y referencias.
2. Validar cada conteo explícito del formato existente `— N/22 verificados` en HANDOFF y cada `HANDOFF del starter/producto: N/22 verificados` en STATUS contra los criterios reales; todo conteo contradictorio debe fallar, no solo el primero. Conservar el conteo obligatorio de HANDOFF y la opcionalidad del de STATUS; no exigir textos adicionales.
3. No heredar esta spec ni sus tareas de mantenimiento en una copia inicializada; conservar la identidad, autonomía, pruebas y controles de copia existentes.

## Tareas y dependencias

| Tarea | Resultado | Dependencia | Salida |
|---|---|---|---|
| [T-010](../tasks/T-010-docs-check-board.md) | Estado explícito válido y exclusión del inventario de mantenimiento | T-009 done | PR mergeada y consulta remota confirmada |
| [T-011](../tasks/T-011-docs-check-counts.md) | Todos los conteos explícitos coherentes | T-010 done | PR mergeada y consulta remota confirmada |

Ambas tareas definen rojo/verde, negativos y STARTER. No alterar aplicación, auth, API, permisos, UI, versiones, locks, cobertura, deadlines ni datos. R-03 no tiene duplicación demostrada; R-05a requiere reproducción y R-05b una decisión de ownership/cache; no convertirlos en arreglos especulativos. R-06 no justifica cambio de auth. R-07 y despliegue siguen externos al dueño. R-08 conserva causa histórica desconocida y riesgo residual; no se afirma reparación.

## Validación de planificación

Frontera, 2026-10-27, contrato dentro del objetivo confirmado en PROJECT_CONTEXT, sin decisiones adicionales de permisos o arquitectura. `approved` significa alineación con ese brief, no aceptación humana final.
