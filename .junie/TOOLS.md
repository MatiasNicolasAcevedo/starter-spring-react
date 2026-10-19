# Herramientas externas de Junie

Fuente canónica del inventario declarado y de la última disponibilidad comprobada de MCP servers y Agent Skills para este proyecto. Sirve a Junie CLI y al plugin de IntelliJ IDEA/AIR; no configura, instala ni autoriza herramientas. Reglas y permisos en [AGENTS](../AGENTS.md) y [AUTONOMY](../docs/AUTONOMY.md).

## Estado y procedencia
Inventario declarado por el dueño el 2026-10-19: cinco MCP y siete skills. Inspección de este checkout ese día: antes de crear este documento no existía `.junie/`; no hay configuración MCP ni skills de proyecto observadas. Esto no demuestra ausencia en el IDE, contexto ACP o configuración global del dueño. No se inspeccionan archivos privados globales ni secretos. No se ha observado una sesión Junie ni un runtime Qwen; las herramientas expuestas a Codex no acreditan las de Junie.

Estados: **declarado** = informado sin comprobar disponibilidad; **activo verificado** = listado en la sesión indicada y sonda pertinente exitosa; **filtrado/deshabilitado** = existe pero no está expuesto/habilitado en ese contexto; **no instalado** = ausencia comprobada en el alcance indicado, sin generalizar a otros; **error/autorización pendiente** = existe y no se puede usar. Una definición en disco no basta para afirmar activo. Registrar fecha, superficie CLI/IDE/ACP, alcance proyecto/usuario/cliente y evidencia saneada al cambiar un estado.

## MCP servers
| Herramienta | Uso previsto | Estado actual | Alcance/evidencia |
|---|---|---|---|
| Context7 | Documentación actualizada de librerías y frameworks | declarado | Dueño; disponibilidad en Junie pendiente |
| Playwright | Automatización del navegador | declarado | Dueño; disponibilidad en Junie pendiente |
| ChromeDevTools | Snapshot, red, performance y screenshots de Chrome | declarado | Dueño; disponibilidad en Junie pendiente |
| GitHub | Repositorios, PRs, issues, commits y búsqueda | declarado | Dueño; disponibilidad en Junie pendiente |
| junie-cli-docs | Documentación interna de Junie; puede presentarse como subagente según la instalación | declarado | Dueño; naturaleza y acceso efectivos pendientes; no habilita delegación por sí solo |

No se ha confirmado ninguno activo o filtrado en Junie. Los cinco pueden provenir de proyecto, usuario o cliente ACP; verificar el origen real antes de registrar una ruta.

## Agent Skills
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
- Ruta estándar actual de MCP de proyecto: `.junie/mcp/mcp.json`; skills: `.junie/skills/<nombre>/SKILL.md`. `.junie/mcp.json`, mencionado por el dueño, no se observó en este checkout: comprobar si su instalación usa una ruta personalizada/otra versión antes de mover nada. No crear ambas como configuraciones duplicadas.
- El formato MCP de proyecto se comparte entre CLI e IDE. Leer la misma configuración requiere la misma raíz/checkout, rutas de búsqueda y versión compatibles. En ACP también puede haber herramientas aportadas por el cliente. Una conexión de debugger o DataGrip del IDE no se vuelve automáticamente utilizable por un CLI aislado.
- La configuración de usuario bajo `~/.junie/` depende de usuario, host y contexto de ejecución y no viaja con Git. En la instalación declarada por el dueño los contextos globales se gestionan por separado; verificar cada superficie, sin inferir igualdad ni aislamiento únicamente por el nombre del agente.
- Versionar este inventario no instala MCP/skills, no concede acceso GitHub/BD ni publica credenciales. Una configuración futura solo se versiona saneada y con versiones/rutas revisadas; no registrar tokens, headers privados, variables sensibles ni respuestas con datos reales.
- Si una herramienta no está disponible, usar el comando local ya autorizado por la tarea cuando demuestre lo mismo. Si es indispensable, registrar el bloqueo y requisito concreto; no instalar, autenticar, abrir subagentes ni ampliar permisos por cuenta propia. Las reglas de sesión, seguridad y revisión prevalecen sobre una sugerencia de skill.

Fuentes oficiales consultadas el 2026-10-19: [MCP en CLI/IDE](https://junie.jetbrains.com/docs/junie-cli-mcp-configuration.html), [Agent Skills](https://junie.jetbrains.com/docs/agent-skills.html). Describen el mecanismo general, sin acreditar esta instalación.

## Comprobación y mantenimiento
Al adoptar el template, cambiar herramientas o preparar el traspaso, el dueño/Junie consulta `/mcp` y `/skills` en las superficies que vaya a usar; no se abre otra sesión desde un agente para hacerlo. Registrar solo nombres, estado/origen y fecha; si se declara activo, una sonda de lectura pertinente y saneada. No operar cuentas Google, BD real o recursos ajenos para verificarlo. Skills vinculadas al IDE pueden quedar limitadas a esa superficie.

Actualizar las filas existentes; las correcciones de una tarea viven en su bitácora, sin duplicar una cronología aquí. En una copia nueva este catálogo es inventario heredado declarado, nunca evidencia de herramientas activas: revalidar en T-000 y referenciarlo desde su PROJECT_CONTEXT completado. [HANDOFF E-01](../docs/HANDOFF.md) comprueba documentación y límites explícitos; no exige instalar todo el catálogo para empezar un MVP.
