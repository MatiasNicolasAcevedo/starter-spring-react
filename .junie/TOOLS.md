# Herramientas externas de Junie

Fuente canónica del inventario declarado y de la última disponibilidad comprobada de herramientas, agentes integrados y Agent Skills para este proyecto. Sirve a Junie CLI y al plugin de IntelliJ IDEA/AIR; no configura, instala ni autoriza herramientas. Reglas y permisos en [AGENTS](../AGENTS.md) y [AUTONOMY](../docs/AUTONOMY.md).

## Estado y procedencia
El catálogo siguiente describe usos posibles; no acredita una instalación del starter ni de una copia. Cada sesión comprueba únicamente las funciones necesarias en su propio entorno. Las herramientas de otro agente no acreditan las de Junie. No inspeccionar archivos privados globales ni secretos.

Naturaleza y estado son ejes separados. Naturaleza: **MCP**, **skill**, **agente integrado** o **pendiente de clasificar**; el nombre no determina el mecanismo. Estados de evidencia: **declarado** (informado, sin disponibilidad comprobada), **expuesto/listado** (visible en esa sesión, sin llamada acreditada), **verificado** (acción pertinente exitosa en el alcance indicado). Listar no verifica ejecución. Una skill contiene instrucciones: leerla no demuestra que su MCP o integración funcione. Registrar además filtrado/deshabilitado, no instalado o error/autorización pendiente solo con evidencia y alcance concretos.

Cada cambio de estado registra fecha, superficie CLI/IDE/ACP, alcance proyecto/usuario/cliente y evidencia saneada; referenciar la tarea, sin copiar cronologías ni generalizar entre superficies. Una definición en disco no basta. Si antes se escribió «activo verificado», conservar su evidencia y precisar qué función se verificó.

## Catálogo de herramientas
| Herramienta | Naturaleza declarada | Uso previsto | Estado | Alcance/evidencia |
|---|---|---|---|---|
| Context7 | MCP | Documentación de librerías y frameworks | declarado | Catálogo; comprobar solo si lo requiere la tarea |
| Playwright | MCP | Automatización del navegador | declarado | Catálogo; comprobar en la superficie usada |
| ChromeDevTools | MCP | Snapshot, red, performance y screenshots | declarado | Catálogo; comprobar en la superficie usada |
| GitHub | MCP | Repositorios, PRs, issues y checks | declarado | Catálogo; gh autorizado puede cubrir la función sin verificar este MCP |
| junie-cli-docs | pendiente de clasificar | Documentación interna de Junie | declarado | Puede ser agente integrado según instalación; no clasificar como MCP por su nombre ni habilitar delegación |

Sin evidencia propia no se afirma exposición ni verificación de ninguna entrada.

## Agent Skills
Naturaleza de estas entradas: skill. Todas permanecen declaradas; disponibilidad e integración requieren evidencia de la superficie usada.

| Skill | Uso previsto | Estado actual | Alcance/evidencia |
|---|---|---|---|
| context7 | Docs de librerías mediante Context7 MCP | declarado | Dueño; requiere también el MCP disponible |
| database-connection-management | Conexiones BD en DataGrip/IDE | declarado | Dueño; integración IDE pendiente; solo BD ficticia propia para pruebas |
| demo-setup | Configuración de `/demo` | declarado | Dueño; no crear demo sin necesidad de la tarea |
| frontend-design | Diseño de interfaces web | declarado | Dueño; conservar stack y componentes del proyecto |
| ij-debugger | Análisis de runtime con debugger de IntelliJ | declarado | Dueño; depende de integración IDE y proceso autorizado |
| java-engineer | Políticas y buenas prácticas Java | declarado | Dueño; contrastar con Java21 y AGENTS del backend |
| spring-boot-engineer | Spring Boot4.x/Framework7/Security7/Hibernate7/Jackson3 | declarado | Dueño; compatibilidad con versiones efectivas pendiente, no autoriza actualizarlas |

La skill es instrucción reutilizable, el MCP expone herramientas: disponer de uno no demuestra disponer del otro. Consultar solo las skills pertinentes, sin cargar todas por rutina.

## Configuración y límites
- Rutas de referencia de MCP de proyecto: `.junie/mcp/mcp.json`; skills: `.junie/skills/<nombre>/SKILL.md`. No inferir instalación desde estas rutas; comprobar el mecanismo expuesto sin leer configuración privada. No crear configuraciones duplicadas.
- El formato MCP de proyecto se comparte entre CLI e IDE. Leer la misma configuración requiere la misma raíz/checkout, rutas de búsqueda y versión compatibles. En ACP también puede haber herramientas aportadas por el cliente. Una conexión de debugger o DataGrip del IDE no se vuelve automáticamente utilizable por un CLI aislado.
- La configuración de usuario bajo `~/.junie/` depende de usuario, host y contexto de ejecución y no viaja con Git. Verificar cada superficie, sin inferir igualdad ni aislamiento únicamente por el nombre del agente.
- Versionar este inventario no instala MCP/skills, no concede acceso GitHub/BD ni publica credenciales. Una configuración futura solo se versiona saneada y con versiones/rutas revisadas; no registrar tokens, headers privados, variables sensibles ni respuestas con datos reales.
- Si una herramienta no está disponible, usar el comando local ya autorizado por la tarea cuando demuestre lo mismo. Si es indispensable, registrar el bloqueo y requisito concreto; no instalar, autenticar, abrir subagentes ni ampliar permisos por cuenta propia. Las reglas de sesión, seguridad y revisión prevalecen sobre una sugerencia de skill.

Fuentes oficiales consultadas el 2026-10-19: [MCP en CLI/IDE](https://junie.jetbrains.com/docs/junie-cli-mcp-configuration.html), [Agent Skills](https://junie.jetbrains.com/docs/agent-skills.html). Describen el mecanismo general, sin acreditar esta instalación.

## Comprobación y mantenimiento
Al adoptar el template, cambiar herramientas o preparar el traspaso, el dueño/Junie consulta el listado pertinente disponible en las superficies que vaya a usar; no se abre otra sesión desde un agente para hacerlo. Registrar solo nombres, estado/origen y fecha; para pasar de expuesto/listado a verificado, una acción pertinente y saneada con resultado real. No operar cuentas Google, BD real o recursos ajenos para verificarlo. Skills vinculadas al IDE pueden quedar limitadas a esa superficie.

Actualizar las filas existentes; las correcciones de una tarea viven en su bitácora, sin duplicar una cronología aquí. En una copia nueva este catálogo es inventario heredado declarado, nunca evidencia de herramientas activas: revalidar en T-000 y referenciarlo desde su PROJECT_CONTEXT completado. [HANDOFF E-01](../docs/HANDOFF.md) comprueba documentación y límites explícitos; no exige instalar todo el catálogo para empezar un MVP.

## Mínimo temprano por función
Antes de entregar adopción a revisión, acordar ejecutor, revisor y superficie en T-000/AUTONOMY y comprobar lectura/edición del repo, terminal/pruebas, Git/PR/CI autorizado y devolución de resultados. La evidencia procede del actor que ejecuta: frontera no acredita Junie con sus propias herramientas. Los detalles y pendientes viven en T-000, con responsable y condición de salida. Herramientas opcionales no requieren instalación ni invocación para empezar; un MCP GitHub no es obligatorio si gh autorizado acredita la función. [Traspaso y veredictos](../docs/ORCHESTRATION.md).
