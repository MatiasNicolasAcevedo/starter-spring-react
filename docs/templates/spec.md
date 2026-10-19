---
id: S-NNN
status: draft
version: 1
milestone: M1
tasks: []
---
# S-NNN · Nombre de la capacidad

<!-- Copiar a docs/specs/S-NNN-slug.md. Una spec por capacidad/épica de una iteración; agrupar varias tareas pequeñas. version es revisión del contrato, no necesariamente versión del producto. No repetir contexto ni protocolos. -->

## Iteración y objetivo de salida
Versión/iteración del producto, objetivo observable y alcance/exclusiones. Criterios que demuestran el objetivo cumplido; dependencia de otras specs si existe. Punto acordado para volver a frontera: objetivo completo o decisión fuera del contrato, nunca simplemente terminar una tarea. ROADMAP agrupa estas specs y sus objetivos.

## Problema y usuario
Necesidad, evidencia y resultado observable. Referencias: PROJECT_CONTEXT §…, F-…, RN-…, CA-….

## Historias y reglas
Como … quiero … para …
Reglas, límites, permisos (actor permitido y denegado), propiedad del recurso y casos borde. Separar lo confirmado de lo propuesto.

## Criterios de aceptación
| ID | Dado / cuando / entonces | CA del contexto | Nivel de prueba | Archivo de test | Tarea |
|---|---|---|---|---|---|
| AC-01 | … | CA-… | unit / integration / e2e | por definir al refinar | T-NNN |

## Contrato backend
Método y ruta, request/response con ejemplos ficticios, status, validación, ProblemDetail, permisos y efectos sobre los datos.

## Frontend
Rutas, interacción, estados loading/empty/error/validación/success/sin permiso, accesibilidad y responsive (375 px).

## Datos y compatibilidad
Migraciones, constraints, datos de demo ficticios, compensación/reversión y restricciones.

## Fuera de alcance
Exclusiones concretas.

## Tareas y dependencias
Ordenar la secuencia completa de esta capacidad, con una salida verificable por tarea. Cada tarea tiene referencias/decisiones/comandos resueltos y dependencias; completar los contratos antes de entregarlos a Junie. Puede quedar draft solo esperando dependencias, con motivo explícito, y pasar a ready al cumplirse sin otro planner. Máximo cinco ready y WIP1; las demás siguen definidas en cola, sin ejecutarse en paralelo.

| Tarea | Resultado observable | Depende de | Estado se consulta en | Salida para continuar |
|---|---|---|---|---|
| T-NNN | … | … | Enlace a su tarea | Criterio/test y MERGED |

## Validación de planificación
Autor/sesión, fecha, supuestos, versión aprobada y decisiones del dueño si aplican. `approved` = alineada con el brief y la política; no simula aprobación humana.
