---
id: T-004
status: ready
priority: P1
size: M
executor: frontier
role: planner
milestone: M0
counts_for_cycle: false
product_cycle: null
spec: null
branch: chore/t-004-clean-adoption
pr: null
depends_on: [T-003]
---
# T-004 · E · Ensayo de adopción

## Objetivo
Cumplir E de [ROADMAP](../ROADMAP.md): demostrar que una idea se adopta desde otra copia limpia con la base y documentación propias, sin copiar el kit, conforme [PROJECT_CONTEXT](../../PROJECT_CONTEXT.md#adopción-futura). D está MERGED y conciliada como template beta; su evidencia no acredita este ensayo. Este documento es el contrato canónico de E, con reglas y matriz E-AC; spec null es intencional para no duplicar un contrato de validación sin API nueva.

## Alcance
Una copia temporal limpia propia del SHA publicado de esta rama, exportada sin Git/kit/ignorados/artefactos/configuración privada. Seguir README literalmente con defaults ficticios primero y una identidad/contexto distintos después; registrar cualquier paso faltante como defecto, sin ocultarlo mediante preparación manual. La ruta GitHub template se comprueba documentalmente y con isTemplate=true del mismo repo; no crear otro repositorio ni afirmar que se ensayó su creación.

Contexto de ensayo: «Biblioteca Demo», slug biblioteca-demo, paquete org.demo.biblioteca, titular Equipo Demo. A partir del formulario propio, describir un MVP ficticio de catálogo personal: un usuario administra títulos propios, otro no puede leerlos ni modificarlos; fuera de alcance préstamos, pagos y notificaciones. Usar la referencia existente para probar el recorrido y ubicar el primer flujo futuro, sin implementar un dominio nuevo. Completar el contexto después de apply y comprobar que se conserva al verificar/retomar; no volver a inicializar cambios propios.

Actor permitido: agente sobre copias y recursos ficticios nuevos con namespace/labels propios. Denegado: cualquier volumen/proyecto preexistente o ajeno. Preflight de puertos y labels antes de crear; proyectos y fixtures de puertos distintos para coexistencia. down/up debe conservar los datos de la copia antes de destruir exclusivamente sus recursos de ensayo; ningún prune ni hosts globales. No operar Google real, origen, kit, otros repos, protecciones, releases o costos nuevos. El kit se conserva hasta E MERGED y validada; su retiro posterior corresponde al dueño.

## Impacto
Ensayo y evidencia de adopción, contexto ficticio y documentación necesaria del recorrido. Sin funcionalidades de negocio, rutas/schema API, auth/CSRF/propiedad, migraciones ni UI nuevas planificadas. Conservar inventario, wrappers/locks y umbrales. Corregir solo un defecto demostrado dentro del recorrido; reproducir rojo antes del arreglo y probar negativos críticos. Un cambio de alcance/arquitectura requiere decisión del dueño.

## Leer antes
- AGENTS raíz/server/client y protocolo [implementer](../agents/implementer.md); AUTONOMY y PROVENANCE.
- PROJECT_CONTEXT · Adopción futura, README · Crear una aplicación y su primer flujo, formulario docs/templates/project-context.md.
- SETUP · Personalización, modo local, cleanup y TR-02/03/05/11/12/15/16; TESTING · FULL local/CI liviana y Personalización D.
- HANDOFF y ARCHITECTURE/ADR/REFERENCE para contexto, crecimiento y retiro seguro de referencia.
- [Cierre de T-003](T-003-initializer-beta.md#reconciliación-posterior-al-merge--2026-10-19) y ROADMAP · corte de D.

## División secuencial y archivos previstos
Una tarea y un PR en chore/t-004-clean-adoption; no sesiones ni agentes paralelos. Registrar evidencia en esta tarea/PR, estado breve en STATUS/BACKLOG/HANDOFF/ROADMAP/README y logs saneados ignorados bajo .orchestrator/t-004. La copia y sus artefactos no se publican. Reutilizar scripts existentes; un script/fix adicional solo ante una carencia reproducida, con justificación y pruebas antes de incluirlo.

| Unidad | Depende | Trabajo | Salida |
|---|---|---|---|
| E1 · copia/contexto | D done | Congelar SHA/base, exportar copia sin Git/kit/ignorados, formulario propio, dry-run/apply/idempotencia y contexto distinto; inspeccionar T-000/tableros/AUTONOMY de la copia | E-AC-01/02; cero crédito o permisos heredados |
| E2 · recorrido literal | E1 | Instalar/levantar/check, DB vacía, login/CRUD/dos identidades, health/UI/Swagger en nginx y Vite a1280/375, down/up con persistencia y coexistencia aislada | E-AC-03/04/05; comandos/exit/resultado real y cleanup propios |
| E3 · validación | E2 | Corregir solo fallos demostrados; congelar fuentes y ejecutar un FULL local sin opciones en la copia personalizada, con mismos suites/negativos y huellas antes/después | E-AC-06; FULL propio válido de adopción, no FULL heredado D |
| E4 · evidencia/entrega | E3 | Trazar E-AC y los22 criterios a fuentes propias, publicar único PR E/CI liviana y entregar a reviewer nuevo | E-AC-07; sin done/STARTER_VALIDADO antes de merge y evidencia suficiente |

Antes de E2/E3 dejar checkpoint con SHA/base, comandos, rutas absolutas de copia/logs, namespaces únicos/fixtures, cleanup y próximo paso. No editar Bash/fuentes durante el gate. Si hay fixes técnicos en el starter, aplicar esos mismos cambios a una copia recreada y probar las fuentes finales; demostrar correspondencia entre lo publicado y lo ensayado. El FULL de la copia no acredita por sí solo un cambio técnico distinto en el checkout del starter; su gate de entrega sigue TESTING. Sin fixes técnicos, no repetir FULL del starter solo por su cierre Markdown. No FULL anidado ni gate nuevo.

## Aceptación y pruebas
| ID | Resultado exigido | Comprobación/evidencia prevista | Resultado real |
|---|---|---|---|
| E-AC-01 | Copia limpia trazable, sin dependencia operativa del kit | SHA/base y listado de exportación; formulario/enlaces propios; exclusiones y ausencia de Git/kit/ignorados, sin leer secretos | Pendiente |
| E-AC-02 | Identidad/contexto propios y T-000 de adopción sin permisos ni éxitos heredados | CLI README dry-run/apply/idempotencia, nombre/título/API/paquete/titular conectados; docs-check, inspección de contexto/T-000/AUTONOMY/HANDOFF0/22 de la copia | Pendiente |
| E-AC-03 | Instalación/arranque conectados desde DB vacía, ambos proxies y tamaños | Comandos literales README/SETUP con .env.example/fixture ficticia; check, API/DB/health/UI reales; Swagger JSON/config/Try it out y denegaciones nginx/Vite; desktop1280/móvil375 | Pendiente |
| E-AC-04 | Login local, CRUD y límites de propiedad/CSRF/logout comprobados en copia | Suites existentes con API/DB/OIDC reales; dos identidades, usuario ajeno y negativos; crear dato ficticio, down/up y comprobar mismo dato/identidad | Pendiente |
| E-AC-05 | Coexistencia sin cruzar puertos/DB/volúmenes, cleanup solo propio | Dos stacks nuevos propios en puertos/labels distintos, datos A no aparecen en B; detener/retomar A sin alterar B; labels container-a/network/volume0/0/0 al finalizar ambos, sin tocar recursos anteriores | Pendiente |
| E-AC-06 | FULL local propio válido de la aplicación personalizada | Node>=24 host, comando sin opciones `bash scripts/verify.sh` con .env.example/proyectos nuevos explícitos; docs/server clean verify/client verify/e2e verdes, huellas antes/después, tiempos/exit/log saneado y cleanup; no mocks de API propia | Pendiente |
| E-AC-07 | Guía permite derivar primer flujo; cierre/revisión/merge verificables | Ubicar módulos, permisos, migración y tests del flujo ficticio en arquitectura existente; trazabilidad de22 criterios con evidencia fechada; CI liviana HEAD/base, reviewer distinto/APROBADO y MERGED confirmados | Pendiente |

Conservar suites, assertions, cobertura, retries y deadlines. No añadir dispatcher/atestaciones/automatizaciones. Los tests de D se reutilizan como instrumentos, sus resultados no como ejecución E. La aceptación S-03 de HANDOFF permite Google real como pendiente externo explícito con responsable/acción; no simular un smoke Google. La checklist del starter permanece0/22 NO_LISTO en planificación; en E solo cambia un criterio al aportar evidencia propia suficiente, con conteo/prompt coherentes. No STARTER_VALIDADO mientras E esté abierta ni sin22/22 y todas las tareas done; reconciliar el hecho del merge conforme merger, usando el cierre canónico del PR y sin commits en rama mergeada. Tras E MERGED y validada, única continuidad PROVENANCE; no ejecutar esa constancia desde E.

## Checkpoint planner · 2026-10-19
Rol planner; Codex desktop/API y terminal PowerShell/git/gh, familia expuesta GPT-6; runtime exacto y esfuerzo efectivo no expuestos. Sol/high solicitado; sin simular selección, delegar ni abrir sesiones/modelos. Precondición de corte D comprobada antes de editar, evidencia canónica en T-003: main local/tracking/remoto `6c5d4cd5395bdf871bc9bbbb5a536dcb53a44551`, árbol limpio, PR abiertos[], PR#4 MERGED/APROBADO R1/CI final/árbol idéntico e isTemplate=true del mismo repo; T-003 mergeable y T-004 draft al inicio. El dueño pidió continuar; se concreta el contrato de E y la conciliación D en el primer avance de su rama exacta, sin ejecutar el ensayo.

Validación propia de este avance: `node scripts/docs-check.mjs` exit0 (45 Markdown/5 tareas/HANDOFF0/22); `node --test "scripts/ci/*.test.mjs"`94/94 exit0, cero fallos/cancelados/omitidos,46,37s; incluye13 controles documentales y30 casos CLI con copias temporales propias retiradas por sus tests. `git diff --check` exit0. Solo siete Markdown modificados, fuentes técnicas/base intactas; sin FULL nuevo, recursos Docker/copia de adopción creados ni pruebas E ejecutadas. Kit ignorado y ausente de Git/índice. Publicación en esta rama sin PR separado; comprobar clasificación DOCS_ONLY del commit y HEAD local/tracking/remoto/árbol limpio al entregar. SHA final consultable en Git, sin autorreferencia a un commit futuro. Próximo rol implementer en sesión nueva, mismo HEAD publicado/base y contrato, según STATUS; no otra planificación sin cambio material.

## Resultado
Contrato completo y dependencias cumplidas: ready para sesión implementadora nueva. E no ejecutada; aceptación y evidencias pendientes. Sin PR documental separado; planificación se publica en la misma rama que usará el único PR E. D done/template beta; adopción todavía no validada, HANDOFF0/22 NO_LISTO y kit conservado.
