---
id: T-NNN
status: draft
priority: P1
size: S
milestone: M1
spec: null
depends_on: []
branch: codex/t-nnn-slug
role: implementer
executor: junie
pr: null
---
# T-NNN · Un resultado observable

<!-- Frontera completa todos los valores antes de ready. Estado canónico aquí; STATUS enlaza la actual y BACKLOG ordena la cola. Campos/estados en docs/ORCHESTRATION.md. No copiar esta plantilla como otra tarea activa sin autorización. -->

## Objetivo
Qué podrá observar el usuario o qué defecto dejará de ocurrir; referencia al contexto solo si aporta intención necesaria.

## Alcance y decisiones resueltas
Incluye/excluye; conducta y errores elegidos. API/schema, actor permitido/denegado, datos/migración y estados UI solo cuando apliquen. Ninguna decisión de arquitectura pendiente para el ejecutor.

## Leer antes
Hasta cinco referencias a archivos/secciones concretas; AGENTS de la capa afectada. No mandar a leer todo el proyecto.

## Archivos y pasos
Archivos previstos y 2–4 pasos ejecutables. Si hace falta ampliar capas o resolver otra decisión, devolver a frontera; una corrección ordinaria del contrato continúa.

## Aceptación y pruebas
| Criterio observable | Capa elegida y por qué | Comando exacto (directorio/entorno) | Resultado esperado |
|---|---|---|---|
| AC-01 | Unitario/componente/integración/E2E según riesgo | Completar antes de ready | Completar |

Bugfix: demostrar rojo antes de arreglar. Conservar regresiones y umbrales. Dirigidos durante iteración; FULL de cierre técnico o DOCS_ONLY según TESTING; escribir aquí comandos finales con namespaces propios si corresponden. No añadir E2E por costumbre.

## Checkpoint vigente
Rol/modelo/herramienta/esfuerzo reales una vez. Hecho y pendiente en pocas líneas; SHA/base conocidos; comando, exit, alcance y log saneado. Antes de una operación larga incluir recursos propios y cleanup. Ante bloqueo: causa, reproducción, intentos distintos y decisión/dato necesario. El prompt único de retoma vive en STATUS.

## Cierre
Criterios/evidencia, PR y revisión pendientes o confirmados. No done hasta MERGED comprobado. Actualizar STATUS al cambiar acción/rol; BACKLOG si cambia la cola; HANDOFF solo si afecta aceptación/traspaso. No reescribir cuatro documentos por cada corrección.
