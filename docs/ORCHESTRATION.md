# Orquestación y estados

Contrato mínimo para encadenar sesiones. **No hay dispatcher instalado:** la continuidad es `POR_SESION` y el dueño abre cada sesión pegando el prompt de [STATUS.md](STATUS.md#prompt-de-la-siguiente-sesión). Este documento fija los valores que validan las tareas y docs-check; no describe la configuración interna de Junie Lite.

## Estados de tarea
| Estado | Significado | Próximo rol |
|---|---|---|
| `draft` | Falta refinar contrato o dependencias | planner |
| `ready` | Contrato completo, dependencias cumplidas, puede tomarse | implementer |
| `in_progress` | Misma tarea, rama y PR activos | implementer |
| `in_review` | Implementación publicada; revisión pendiente | reviewer |
| `changes_requested` | Hallazgos concretos; conserva rama y PR | implementer |
| `mergeable` | Veredicto vigente y checks verdes; merge pendiente | merger (normalmente la sesión revisora) |
| `done` | GitHub confirma MERGED y el cierre documental está reconciliado | siguiente tarea predefinida / frontera al objetivo |
| `blocked` | Falta dato, permiso, dependencia o solución tras intentos acotados | rol indicado por el bloqueo |

- **En vuelo:** `in_progress`, `in_review`, `changes_requested`, `mergeable`, o `blocked` con `pr` asignado. Máximo una tarea en vuelo (WIP 1 tarea / 1 PR de tarea).
- `blocked` sin PR describe una tarea que espera una dependencia; no está en vuelo.
- Máximo cinco tareas `ready`. `done` nunca se usa para un PR abierto o simplemente cerrado.

## Campos de frontmatter validados
| Campo | Valores |
|---|---|
| `id` | `T-NNN` único; coincide con el nombre del archivo `docs/tasks/T-NNN-slug.md` |
| `status` | uno de los estados anteriores |
| `executor` | `frontier` (GPT-6.1 Sol u Opus 5.5; el checkpoint registra cuál) o `junie` (Junie Lite). Las tareas de M0 son `frontier` |
| `role` | `planner`, `implementer`, `reviewer`, `merger` |
| `depends_on` | lista de IDs existentes, sin ciclos |
| `product_cycle` | Opcional, solo si ayuda a agrupar un objetivo; no bloquea una tarea pequeña ready |
| `counts_for_cycle` | Opcional/legado, booleano si existe; nunca true en M0. No requiere otro contador diario |
| `pr` | `null` o número de PR real |

## Responsabilidad de cada documento

| Documento | Función y cuándo cambia |
|---|---|
| PROJECT_CONTEXT | Problema, MVP, reglas/permisos y aceptación del dueño; cambia con intención de producto |
| STATUS | Enlace a tarea actual, estado resumido y único prompt; cambia al cambiar acción/rol/bloqueo |
| Tarea | Estado canónico, decisiones, archivos/comandos, checkpoint y evidencia; progreso ordinario aquí |
| BACKLOG | Orden y dependencia de la siguiente tarea; índice sin estados repetidos. Tablas históricas con estado, si existen, deben concordar |
| HANDOFF | Aceptación/traspaso; cambia al aportar evidencia o invalidar un criterio, no con cada fix |
| ROADMAP | Objetivos e hitos; revisión cada cinco tareas de producto mergeadas, hito o cambio relevante |

La cadencia se consulta en tareas mergeadas; no exige mantener contadores duplicados. Las tareas autosuficientes pueden usar spec null. PROJECT es un índice del contexto, sin otro brief que mantener. Las tareas de mantenimiento no se copian al producto.

## Continuidad mínima vigente
Frontera deja ROADMAP por versiones/iteraciones, specs agrupadas por capacidad/épica y sus tareas pequeñas con decisiones resueltas. Puede haber muchas tareas definidas, aunque solo cinco ready y una en vuelo. Una tarea draft puede estar completa y esperar únicamente la dependencia indicada; Junie la habilita al comprobarla sin pedir otro planner. Si falta una decisión de verdad, no la trata como ready.

Secuencia diaria: implementación Junie → revisión en sesión distinta (también Junie si está autorizado y tiene capacidad) → merge elegible confirmado → siguiente tarea Junie predefinida. El dueño copia el único prompt vigente y abre la sesión del rol indicado. No hay alternancia obligatoria con frontera. La revisión de avance cada cinco tareas puede hacerla Junie; el regreso a frontera se fija por objetivo cumplido de iteración o por decisiones/bloqueos que excedan el contrato.

El tablero agrupa En curso, Siguientes y Hechas, o una cola equivalente que identifique la actual y la siguiente con su dependencia, enlazando contratos. El inicializador entrega la cola mínima de T-000; al empezar producto se organiza la iteración propia. Los estados exactos se marcan en las tareas y STATUS refleja solo la actual. Pasar una entrada a Hechas exige MERGED comprobado y reconciliación, nunca solo tests verdes. La sesión revisora confirma el merge en el PR; el siguiente implementer concilia done en su nueva rama sin editar la ya mergeada. El prompt de continuación indica cuál sigue y esa comprobación inicial.

Checkpoint vigente para retoma; tabla breve por tarea para correcciones significativas; evidencia y PR/Git para trabajo anterior. No convertir el tablero en diario ni crear copias de cada estado. Esto deja trazabilidad sin una bitácora de cada edición.

STATUS contiene un único prompt ejecutable; la tarea guarda evidencia y siguiente experimento. Un bloqueo incluye causa concreta y salida propuesta; si falta autorización, preguntar la decisión necesaria en vez de repetir el prompt condicionado. Una decisión nueva se registra y sustituye la precondición anterior.

Dispatcher, adaptador de resultados JSON, locks y automatizaciones de sesiones quedan fuera del cierre del starter. Reconsiderar esa infraestructura solo con una tarea futura y necesidad observada.
