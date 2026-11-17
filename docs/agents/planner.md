# Protocolo · planner de frontera

Entra cuando falta contrato: idea nueva, lote agotado, o una decisión de alcance, arquitectura o permisos. No se alterna con el implementer por cada tarea. Proceso general en [WORKFLOW](../WORKFLOW.md).

1. **Leer y conciliar.** STATUS, tarea activa, contexto aceptado y estado real de Git/PR. Reutilizar la idea y las respuestas disponibles. Preguntar al dueño solo lo que cambia MVP, datos, reglas, permisos o aceptación, y marcar confirmado/propuesto/pendiente.
2. **Contexto.** Completar PROJECT_CONTEXT desde el [formulario breve](../templates/project-context.md). Conservar la arquitectura existente y resolver lo necesario para el primer resultado útil. AUTONOMY registra el modo del proyecto y las decisiones vigentes del dueño. No trasladar tareas del mantenimiento del starter a la aplicación.
3. **Specs.** Una [spec](../templates/spec.md) por capacidad o épica, con el contrato que comparten varias tareas. Una tarea autosuficiente usa `spec: null`. Detallar el desarrollo cercano y dejar los objetivos lejanos sin infraestructura hipotética.
4. **Tareas.** Cada [tarea](../templates/task.md) entrega un resultado observable con decisiones ya resueltas: hasta cinco referencias concretas, archivos previstos, dos a cuatro pasos, aceptación y la prueba más chica que demuestra el riesgo según [TESTING](../TESTING.md#elegir-pruebas-para-una-tarea-pequeña). Comandos exactos y ejecutables, con el filtro del E2E dirigido si hay flujo de usuario; nunca nombres ficticios. Orientación: tres a cinco archivos de código por tarea. Dividir cuando haya decisiones independientes, más de un resultado o demasiadas capas.
5. **Prompts prefabricados.** Completar en cada tarea la sección «Prompts de salida»: el de reviewer y el de la tarea siguiente, con rutas y nombres reales. El ejecutor solo completa número de PR y SHA. Es lo que garantiza la continuidad con un modelo de menor capacidad.
6. **Lote** (modo `LOTES_JUNIE`). Unas diez tareas ordenadas, con dependencias explícitas. Registrar en BACKLOG el identificador `L-NN`, el SHA de `main` del que parte y la tarea que lo cierra. Hasta cinco `ready`; el resto `draft` solo por dependencia, con la razón escrita, para que el ejecutor las habilite al comprobar el `MERGED` anterior sin otra sesión de planner. El prompt de salida de la última tarea es la revisión de lote.
7. **Gates.** El contrato pide el gate diario. No incluir FULL, suite E2E completa, STARTER ni tooling como paso de cierre: están diferidos y solo los ordena el dueño. Si el lote toca dependencias, Docker/Compose, workflows, autenticación o migraciones, dejar la recomendación en el registro de STATUS.
8. **Publicar.** Un PR de planificación solo con documentación (specs, tareas, BACKLOG, ROADMAP, STATUS), con docs-check y `verify-required` verdes. El dueño revisa el plan en la sesión; con su conformidad expresa el planner hace el squash y confirma `MERGED`. Sin esa conformidad, queda abierto y el prompt lo indica.
9. **Cerrar la sesión** como indica [AGENTS](../../AGENTS.md#cierre-de-sesión), con el prompt de implementer de la primera tarea `ready`.

## Revisión de lote
Sesión nueva de frontera al terminar un lote Junie, antes de planificar el siguiente.

1. Leer el diff acumulado `SHA base del lote..main` y el código resultante; los checkpoints no alcanzan. Recorrer la aplicación en el flujo principal del lote.
2. Correr el gate diario sobre lo tocado. Buscar lo que un modelo de menor capacidad suele dejar: reglas duplicadas, pruebas que no afirman nada, manejo de errores ausente, estados de UI sin cubrir, permisos sin negativo, deriva respecto de ARCHITECTURE y documentación que ya no describe el código.
3. Clasificar cada hallazgo: corregir ahora, deuda al BACKLOG o sin acción. Lo que se corrige ahora va a una tarea de ajuste del lote con su PR, revisado y mergeado por otra sesión de frontera.
4. Convertir en regla lo que hubo que corregir dos veces: AGENTS de la capa o plantilla de tarea, dentro del PR de ajuste.
5. Actualizar el registro de gates diferidos de STATUS y recomendar o no el integrado. Listar ramas locales, stashes, worktrees y archivos sin versionar que quedaron, para que el dueño decida.
6. Planificar el lote siguiente con los pasos de arriba.

En adopción, acordar ejecutor, revisor, superficie y AUTONOMY propia; contrastar capacidades efectivas y exigir la comprobación mínima temprana por función en T-000 ([TOOLS](../../.junie/TOOLS.md) es canónico). Dejar la primera tarea de producto con contrato completo antes de entregar la adopción. Configuración de Junie: [SETUP](../SETUP.md#instrucciones-de-junie-en-intellij-idea-y-air).
