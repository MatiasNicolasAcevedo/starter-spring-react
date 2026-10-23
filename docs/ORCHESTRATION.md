# Orquestación y estados

Contrato mínimo para encadenar sesiones. **No hay dispatcher instalado:** la continuidad es `POR_SESION` y el dueño abre cada sesión pegando el prompt de [STATUS.md](STATUS.md#prompt-de-la-siguiente-sesión). Este documento fija los valores que validan las tareas y docs-check; no describe una instalación concreta. Ejecutores/superficies se acuerdan en la adopción; naturaleza y disponibilidad canónicas en [TOOLS](../.junie/TOOLS.md).

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
| `executor` | `frontier` o `junie`; registrar modelo/herramienta/esfuerzo realmente expuestos en la sesión, sin imponer una instalación a las copias. Las tareas de M0 son `frontier` |
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

## Cierre de adopción y primera tarea
`STARTER_VALIDADO` cierra el alcance de base/adopción: exige 22/22 criterios con evidencia propia fechada, al menos una tarea M0 y todas las tareas M0 done. No exige terminar futuras tareas de producto: M1 draft no invalida adopción; la aceptación de producto depende de sus contratos. Una M0 abierta o el alcance M0 vacío lo rechazan. El mantenimiento del propio starter también conserva NO_LISTO mientras haya una M0 abierta; sus pruebas no acreditan una aplicación.

Durante T-000, frontera acuerda ejecutor, revisor independiente y superficie, AUTONOMY propia y capacidades efectivas. La comprobación mínima temprana por función y evidencia antes de revisión se registra en T-000; [TOOLS](../.junie/TOOLS.md) distingue declarado/expuesto-listado/verificado de la naturaleza. No exigir el catálogo opcional completo ni repetir decisiones aceptadas.

Antes de entregar adopción, frontera deja la primera tarea de producto especificada, aunque permanezca draft por T-000. El cierre de merge informa «adopción mergeada; producto todavía no iniciado», enlaza MERGED y nombra la conciliación inicial en la siguiente rama. El único prompt de STATUS identifica esa tarea y la comprobación previa; no inicia producto en la sesión que cierra adopción. Si falta contrato o decisión, la salida es frontera con evidencia concreta.

## Hechos de entrega y traspaso
| Hecho | Evidencia / responsable | Condición de salida |
|---|---|---|
| Entrega del autor | Implementer: alcance, HEAD/base, pruebas y pendientes publicados | Revisión independiente pendiente identificada; no equivale a aceptación |
| Aceptación del dueño | Dueño: decisión propia de contexto/alcance/permisos en su documento canónico | Decisión referenciada una vez; no sustituye gate ni veredicto técnico |
| Gate | Ejecutor: fuentes/base, comandos/exit, logs y cleanup según TESTING | Evidencia válida del alcance; CI liviana no acredita FULL |
| APROBADO | Reviewer de otra sesión: HEAD/base exactos, evidencia y CI vigentes | Permite comprobar elegibilidad de merge; no significa MERGED |
| MERGED | Merger autorizado: confirmación GitHub y commit de merge enlazados | Siguiente sesión concilia done en nueva rama y toma solo tarea predefinida |

Cada traspaso explicita **pendiente, responsable y condición de salida**, también si falta aceptación, capacidad, gate, revisión o merge. Máximo dos rondas de revisión y tres correcciones distintas por bloqueo. Al agotar el límite: checkpoint con causa/evidencia/intentos, decisión necesaria y propuesta completa de cierre (quién corrige, quién revisa independientemente y qué habilita merge). Una revisión adicional requiere decisión específica del dueño; no hay excepción permanente ni aprobación propia. La corrección/aceptación posterior no produce APROBADO por sí sola. Conservar evidencia válida sin repetir suites ni pedir aceptaciones rutinarias por cambiar de rol.

## Confirmación de hechos en GitHub

Con operaciones GitHub autorizadas en AUTONOMY, consultar la PR exacta con repositorio explícito al adoptar una dependencia en una sesión nueva, después de solicitar merge y antes de anunciar MERGED, conciliar done o habilitar la tarea siguiente. Sustituir los argumentos por valores reales de AUTONOMY/tarea:

```text
gh pr view <numero-real> --repo <owner/repo-real> --json number,url,state,mergedAt,mergeCommit,headRefOid,baseRefName
```

Exigir exit 0, identidad de PR/repositorio y base correctas; para merge exigir además `state == MERGED`, `mergedAt` no nulo y `mergeCommit.oid` no vacío. Registrar una vez en la tarea comando, exit, respuesta mínima, fecha de consulta y SHA completo; el cierre al dueño enlaza PR y SHA confirmado. Verificar también existencia/identidad remota antes de anunciar una PR publicada. No inferir hechos desde un número escrito en STATUS o un chat anterior.

| Respuesta de GitHub | Acción |
|---|---|
| MERGED con identidad/base, fecha y SHA válidos | Acreditar merge; conciliar/habilitar según rol y dependencia |
| OPEN o merge solicitado/en cola | Mantener dependencia pendiente; nombrar próximo responsable y acción |
| CLOSED sin merge o PR inexistente | No acreditar merge ni publicación inexistente; corregir la discrepancia |
| Error de consulta o respuesta incompleta | Informar «merge no verificado», causa saneada y siguiente comprobación; no inferir OPEN ni MERGED |

Git merge/rebase/cherry-pick, fetch/pull, contenido en main local, CI verde, APROBADO, auto-merge solicitado y exit 0 de gh pr merge no sustituyen esta consulta. Una PR abierta no habilita al implementer a mergearla; siguen vigentes revisión independiente, gate y AUTONOMY. Si documentos y GitHub discrepan, registrar la causa y conciliar en la rama/rol autorizados.

## Prompt obligatorio al cierre

Cada respuesta final de sesión incluye el prompt completo y copiable de la siguiente sesión, con tarea/rol, referencias concretas, precondición comprobable, acción y salida. Antes de publicar el cierre documental, STATUS contiene ese mismo prompt y refleja el pendiente real. Si el recibido ya se ejecutó, consultar el estado y entregar el paso vigente, sin limitarse a informar que ya se hizo. Un bloqueo también entrega la acción concreta que lo resuelve y su responsable.

Implementación/corrección termina con prompt de revisión independiente; revisión con hallazgos entrega prompt de corrección; revisión elegible puede continuar el merger autorizado del mismo PR. Tras MERGED confirmado, entregar en el chat el prompt de conciliación y próxima tarea predefinida. STATUS puede conservar el prompt anterior escrito antes del merge: su precondición exige reconsultar GitHub y derivar el paso vigente. No commitear en la rama mergeada para actualizarlo; la siguiente sesión lo concilia en el primer avance de su nueva rama autorizada. Si no existe tarea siguiente o hay decisión fuera de contrato, entregar prompt de frontera con el pendiente específico. No iniciar otra implementación en la sesión que cierra esta.
