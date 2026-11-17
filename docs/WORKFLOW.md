# Flujo de trabajo

Fuente única del proceso diario. [AGENTS](../AGENTS.md) lo resume, [AUTONOMY](AUTONOMY.md) fija permisos y el modo del proyecto, [TESTING](TESTING.md) detalla comandos y [ORCHESTRATION](ORCHESTRATION.md) los estados. Si otro documento contradice este flujo, vale este y se corrige el otro en la misma tarea.

## Niveles de ejecutor

| Nivel | Qué es | Qué hace |
|---|---|---|
| `frontera` | El modelo de máxima capacidad disponible en la sesión que abre el dueño. No se fija marca, versión ni herramienta: hoy puede ser uno y mañana otro | Planifica, decide alcance y arquitectura, revisa lotes, corrige lo difícil. También implementa y revisa cuando el proyecto está en `FRONTERA_CONTINUA` |
| `junie` | Un modelo de menor capacidad (Junie en IntelliJ/AIR u otro equivalente) | Ejecuta contratos cerrados: implementa, revisa y mergea tareas ya especificadas. No decide alcance, arquitectura ni permisos |

El frontmatter de la tarea usa `executor: frontier` o `executor: junie`. Cada sesión registra una vez en el checkpoint la herramienta y el modelo realmente expuestos; las reglas nunca dependen de un modelo concreto.

## Tres roles, tres prompts

```
planner ──► implementer ──► reviewer ──► (MERGED) ──► implementer de la tarea siguiente
(frontera)       ▲              │
                 └── hallazgos ─┘   mismo PR, sesión implementer nueva
```

| Rol | Sesión | Entrada | Salida | Prompt que deja |
|---|---|---|---|---|
| [planner](agents/planner.md) | Frontera | Idea, contexto o lote terminado | Specs y tareas con contrato completo | implementer de la primera tarea |
| [implementer](agents/implementer.md) | Nivel de la tarea | Una tarea `ready` o hallazgos de revisión | Un PR con gate diario verde | reviewer de ese PR |
| [reviewer](agents/reviewer.md) | Otra sesión, nunca la autora | Un PR publicado | `APROBADO` + squash merge confirmado, o hallazgos concretos | implementer de la tarea siguiente, o implementer de corrección |

- Una sesión nueva por rol y por tarea. Una tarea y un PR en vuelo.
- **El reviewer mergea.** Si aprueba, continúa en la misma sesión con el squash y confirma `MERGED` en GitHub; no hay sesión de merger aparte. [merger](agents/merger.md) queda solo para retomar un merge que no pudo completarse.
- Los hallazgos vuelven a una sesión implementer nueva, en el mismo PR y la misma rama. Máximo dos rondas de revisión por tarea; después decide el dueño o frontera.
- El planner entra cuando falta contrato: idea nueva, lote agotado o decisión de alcance, arquitectura o permisos. No se alterna planner/implementer por cada tarea.

## Modos del proyecto

AUTONOMY declara uno. El dueño lo cambia cuando quiere; el cambio se registra allí con fecha.

| Modo | Cuándo conviene | Quién hace cada rol |
|---|---|---|
| `FRONTERA_CONTINUA` | Proyecto grande, en uso real o con cambios delicados | Frontera planifica, implementa y revisa, siempre en sesiones separadas |
| `LOTES_JUNIE` | Proyecto chico o en crecimiento, tareas bien acotadas | Frontera planifica el lote y lo audita al final; Junie implementa, revisa y mergea cada tarea |

### Ciclo de un lote (`LOTES_JUNIE`)

1. **Planificación de lote (frontera, planner).** Un lote `L-NN` de unas diez tareas (ocho a doce) agrupadas en specs, todas con contrato completo y prompts de salida prefabricados. Registrar en BACKLOG el lote, el SHA de `main` del que parte y el orden.
2. **Ejecución (junie).** implementer → reviewer que mergea → implementer de la siguiente, sin volver a frontera. Junie habilita la tarea siguiente al comprobar el `MERGED` de la anterior.
3. **Corte del lote.** Al mergear la última tarea, al agotar dos rondas de revisión o ante una decisión fuera de contrato, el prompt de cierre se dirige a frontera.
4. **Revisión de lote (frontera, sesión nueva).** Lee el código real del diff acumulado `SHA base del lote..main`, no los checkpoints. Corre el gate diario sobre lo tocado. Clasifica hallazgos en *corregir ahora*, *deuda al BACKLOG* o *sin acción*.
5. **Ajustes (frontera).** Lo que hay que corregir ahora va en una tarea de ajuste del lote con su PR, revisado y mergeado por otra sesión de frontera.
6. **Lecciones.** Lo que frontera tuvo que corregirle dos veces a Junie se convierte en regla del AGENTS de la capa o en la plantilla de tarea, en ese mismo PR de ajuste.
7. **Siguiente lote.** Frontera recomienda o no el gate integrado diferido, actualiza ROADMAP si cambió el rumbo y planifica `L-NN+1`.

## Gates

| Gate | Presupuesto | Contenido | Quién lo dispara |
|---|---|---|---|
| **Diario** | Unos 20 minutos en total | Pruebas unitarias y de componente de lo tocado; IT dirigido si cambia persistencia, consulta o permiso; typecheck del cliente; **E2E dirigido** del flujo afectado con filtro y un solo proyecto; `node scripts/docs-check.mjs`; `git diff --check`; CI `verify-required` verde | El implementer al cerrar; el reviewer repite solo lo que el riesgo pida |
| **Diferido** | Más de 20–30 minutos | FULL de aplicación, suite E2E completa, STARTER, tooling completo, workflow remoto integrado | **Solo el dueño, con una orden expresa en la sesión** |

Reglas del gate diferido:

- Es el estado por defecto de todo proyecto. No se ejecuta al cerrar una tarea, al revisar, al terminar un lote ni porque `--policy` informe `FULL` o `STARTER`: esa clasificación se registra y nada más.
- La tarea anota `FULL/STARTER: DIFERIDO POR EL DUEÑO`. Nunca «aprobado», «satisfecho» ni «no aplica».
- Un agente **solo puede recomendarlo**, en una línea del cierre y en el registro de STATUS, cuando se cumple alguna de estas condiciones: cierre de lote o unas diez tareas mergeadas desde el último integrado; antes de un deploy a producción o una entrega; cambios en dependencias, lockfiles, Docker/Compose, workflows, autenticación o migraciones; o una regresión que los dirigidos no explican.
- STATUS lleva el registro «Gates diferidos»: SHA y fecha del último integrado válido, tareas mergeadas desde entonces y la recomendación vigente. Es la deuda visible, no un bloqueo.
- Cuando el dueño lo ordena: congelar fuentes, checkpoint con SHA/base y recursos propios, una sola corrida sobre el diff acumulado desde el último integrado, evidencia en la tarea y actualización del registro.
- Si una corrida dirigida supera el presupuesto, detenerla, registrar comando y duración, acotar el filtro y seguir. Si no hay forma de acotar, es una corrida diferida: preguntar al dueño.

Mergear exige gate diario verde sobre el HEAD publicado, `verify-required` verde y `APROBADO` de una sesión distinta. No exige el gate diferido.

## Cierre de sesión: el prompt siguiente

Ninguna sesión termina sin esto, también si hubo errores, pruebas rojas o un bloqueo. En orden:

1. **Tarea:** checkpoint vigente reemplazado (hecho, pendiente, SHA, comandos con exit).
2. **STATUS:** tabla al día y el único prompt de la sesión siguiente. Commit y push en la rama de la tarea.
3. **Respuesta final:** las últimas líneas son el mismo prompt, completo, dentro de un bloque de código, listo para copiar. No cerrar con un resumen, una pregunta o una oferta de continuar.

Plantilla del prompt. El planner la deja prefabricada en cada tarea; quien cierra completa los datos reales:

```text
Actuá como <frontera|Junie> <rol> de <T-NNN> en <owner/repo>. Sesión nueva.

LEER: AGENTS.md, docs/STATUS.md, docs/agents/<rol>.md, docs/tasks/<archivo de la tarea> y <spec o AGENTS de la capa>.
PRECONDICIÓN: <hecho comprobable con un comando, por ejemplo gh pr view N con --repo y state MERGED, o PR N abierto en el HEAD sha>. Si no se cumple, informar el estado real y entregar el prompt corregido.
ACCIÓN: <tres a seis pasos concretos>.
GATE: diario (dirigidos, E2E filtrado, docs-check). FULL y STARTER están diferidos: no ejecutarlos sin orden expresa del dueño.
SALIDA: <resultado observable>. Terminar con el prompt de la sesión siguiente en STATUS y completo en la respuesta final.
```

Qué prompt corresponde a cada cierre:

| Cierre | Prompt que se entrega |
|---|---|
| Planner publica contratos | implementer de la primera tarea `ready` |
| Implementer publica o corrige | reviewer del mismo PR, con número de PR y SHA del HEAD |
| Reviewer pide cambios | implementer de corrección: mismo PR, lista cerrada de hallazgos con su condición de cierre |
| Reviewer aprueba y confirma `MERGED` | implementer de la tarea siguiente, que concilia la anterior en su primer commit |
| Se mergeó la última tarea del lote | frontera, revisión de lote, con el SHA base y la lista de tareas |
| No queda tarea especificada | frontera planner, con el objetivo pendiente |
| Bloqueo o decisión del dueño | frontera o dueño, con causa, evidencia, lo ya intentado y la pregunta exacta |
| El prompt recibido ya estaba ejecutado | Consultar el estado real y entregar el paso vigente |

El reviewer no puede commitear después del merge. Por eso deja en STATUS, en su commit de transición a `mergeable`, el prompt de la tarea siguiente con la precondición «PR N MERGED», y lo repite en el chat después de confirmar el merge.

## Higiene

- **STATUS corto.** Tabla, tres a cinco líneas de contexto, registro de gates diferidos, pendientes del dueño y el prompt. Unas cuarenta líneas como máximo. El historial vive en las tareas, los PR y Git: al conciliar una tarea se borra su párrafo de STATUS.
- **Decisiones del dueño en un solo lugar.** Van a «Decisiones vigentes» de AUTONOMY con fecha. Al caducar se borran; Git las conserva. No se siembran excepciones fechadas en AGENTS, TESTING ni en los protocolos.
- **Worktrees y ramas.** Quien crea un worktree de revisión lo elimina al cerrar la sesión. Las ramas mergeadas se borran. El reviewer trabaja sobre el SHA publicado, no sobre el checkout del autor.
- **Sin archivos sueltos.** Diffs, logs, borradores y capturas de trabajo van a `.orchestrator/`, que está ignorado, nunca a la raíz ni a `docs/`. Lo que no se versiona se borra al cerrar o se anota en la tarea.
- **`main` limpio.** El checkout principal vuelve a `main` actualizado al terminar una tarea mergeada. Stashes y ramas locales viejas se listan en la revisión de lote para que el dueño decida.
