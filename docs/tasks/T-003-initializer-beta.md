---
id: T-003
status: in_progress
priority: P1
size: M
executor: frontier
role: implementer
milestone: M0
counts_for_cycle: false
product_cycle: null
spec: S-004
spec_version: 1
branch: chore/t-003-initializer-beta
pr: 4
depends_on: [T-002]
---
# T-003 · D · Personalización y beta

## Objetivo
Cumplir D mínima de [ROADMAP](../ROADMAP.md) y el [destino autosuficiente](../../PROJECT_CONTEXT.md#adopción-futura): personalización segura, formulario corto y guía hasta el primer flujo. Contrato [S-004 v1](../specs/S-004-initializer-beta.md), alineado con la decisión del dueño del 2026-10-18. C done/MERGED; E sigue draft.

## Alcance
Inicializador Node con lista explícita de escrituras, dry-run por defecto, apply/idempotencia y ensayo compilable en copia temporal; reinicio de contexto/documentos para T-000 propia, formulario y guía breve en fuentes canónicas. Una tarea/PR de M0, implementación únicamente en sesión nueva. Beta/template del mismo repo condicionados al cierre de D según S-004; no habilitarlos en esta planificación.
Sin otros repos, Google real, datos/volúmenes ajenos, hosts globales, origen, cambios de protecciones, releases ni E. Sin automatizaciones semanales/dispatcher, nuevas dependencias o infraestructura adicional. No copiar/borrar el kit ni convertir sus preguntas en alcance obligatorio.

## Impacto
Planner: solo documentos, conciliación T-002 done y corte de C. Implementación prevista: identidad de la copia, CLI y documentos propios; sin API/rutas/auth/permisos/propiedad nuevos, migraciones ni operaciones sobre DB. UI conserva comportamiento y personaliza solo identidad pertinente. Mantener dependencias/versiones/wrappers/locks y todas las suites/umbrales; no acreditar pruebas de D/HANDOFF con evidencia C.

## Leer antes
- S-004 v1 y PROJECT_CONTEXT · Adopción futura/decisión del 2026-10-18.
- ROADMAP · cierre mínimo, límites y corte de C; T-002 · reconciliación posterior al merge.
- TESTING · validación local y CI liviana; SETUP · copia/entorno/cleanup y TR-02/03/05/12/15/16.
- REFERENCE · retiro seguro, ARCHITECTURE y ADR existentes; DEPENDENCIES para comparar inventario.
- AGENTS raíz/server/client, protocolo implementer y AUTONOMY; HANDOFF/STATUS/BACKLOG vigentes.

## División secuencial antes de editar código
No son tareas ni PRs paralelos. D1 concreta la lista de archivos usando las fuentes vigentes, sin replanificar la tarea ready ni pedir aprobación ordinaria.

| Unidad | Depende | Destinos y resultado | Salida verificable |
|---|---|---|---|
| D1 · escrituras y guardias | C done | Inventariar destinos/renombres exactos del CLI y reset documental; comenzar `scripts/test-init-project.mjs` con fixtures/copia propia, sin tocar este checkout con apply | D-AC-01/03; contrato/lista revisables, rechazos previos a escritura y centinelas intactos |
| D2 · personalización | D1 | `scripts/init-project.mjs` y su matriz; identidad coherente Java main/test, config, nombres de proyecto y MIT; lockfiles solo con gestor si corresponde | D-AC-02/06; dos apply idénticos, copia compila, inventario y migraciones intactos |
| D3 · contexto y guía | D2 | `docs/templates/project-context.md`, plantillas propias de reinicio y README/SETUP con enlaces ARCHITECTURE/ADR/REFERENCE; sin manual duplicado | D-AC-04/05; copia sin kit, T-000/HANDOFF/AUTONOMY propios, docs-check y contexto ficticio suficiente |
| D4 · integración y cierre | D3 | Conectar matriz/ensayo al gate pertinente; documentación/evidencia mínima; FULL local propio y publicación del único PR D | D-AC-06/07; revisión distinta, CI liviana exacta y merge. Solo después habilitar/comprobar template beta del mismo repo |

Antes de operaciones largas: checkpoint con comandos, SHA/base, proyectos nuevos, logs saneados, pendientes y cleanup por labels. La copia temporal debe excluir `.git`, kit, ignorados, artefactos y configuración privada. No invocar otro FULL desde dentro de FULL. Fallo técnico requiere diagnóstico antes de repetir; bugfix demuestra rojo previo y guardias críticas negativos efectivos.

Inventario relevante comprobado por planner: `scripts/docs-check.mjs` fija hoy la ruta Java de Testcontainers y el rótulo de conteo de STATUS; `scripts/ci/docs-check.test.mjs` fija el nombre de T-000 del starter. D1/D2 deben adaptar esas conexiones para que la copia personalizada conserve los mismos controles/negativos después de renombrar/reiniciar, sin omitirlos ni aceptar una validación vacía. Es parte del ensayo compilable/docs-check, sin ampliar el producto.

## Aceptación y pruebas
Matriz D-AC-01…07 canónica en S-004, toda **pendiente de implementación**. Iterar con dirigidos de CLI/docs/copia; un FULL local sin opciones al cerrar fuentes técnicas, huella antes/después, base/HEAD, resultados/cleanup propios. Client verify incluye typecheck/lint/formato/tests/cobertura/build y backend clean verify incluye PostgreSQL IT/JaCoCo. Publicar código al pasar gate, cerrar documentación agrupada, CI automática liviana y revisión independiente sobre SHA/base exactos. Repetir FULL solo bajo las condiciones de TESTING; no exigir CI automática de main ni remoto FULL manual por rutina.

No done mientras PR abierto; no autorrevisión ni merge de implementación propia. Beta/template solo después del merge D comprobado; E/adopción validadas no se heredan de D. Marcar template es la autorización específica de ROADMAP, sin modificar protecciones.

## Checkpoint planner · 2026-10-18
Rol planner, Codex desktop/API y PowerShell; familia expuesta GPT-6, runtime exacto/esfuerzo efectivo no expuestos. Sol/high solicitado, sin simular selección, delegar ni abrir sesiones/modelos. Main de partida `193f5a763af9ae61726daf20d30ae4ce8d5ce59d`; PR#3/R2/CI final y árbol del squash comprobados en cierre de T-002. Primer avance de la rama exacta D concilia C y publica este refinamiento, sin PR documental separado. SHA final de planificación se obtiene de Git; ninguna prueba D ejecutada ni beta habilitada. Próximo rol implementer en sesión nueva, mismo árbol publicado y base; único prompt vigente en STATUS. T-004 draft, HANDOFF0/22 NO_LISTO; continuidad posterior solo en PROVENANCE.

Validación de esta planificación: `node scripts/docs-check.mjs` exit0 (44 Markdown/5 tareas/HANDOFF0/22), `node --test "scripts/ci/*.test.mjs"` **64/64 exit0**, sin fallos/cancelados/omitidos; incluye13 regresiones documentales. Primer intento de matrices restringido por permisos del sandbox al crear Git temporal/objetos MSYS; misma orden fuera del sandbox verde, sin modificar tests. `git diff --check` exit0; solo ocho Markdown documentales A/M, sin fuentes técnicas/locks/workflows modificados; clasificador DOCS_ONLY del commit publicado comprobable contra la base. Kit ignorado y ausente de Git/índice. Sin FULL nuevo, CI automática de main/rama sin PR ni recursos Docker levantados por planner. Commit/push en esta misma rama; confirmar HEAD local/tracking/remoto y árbol limpio al entregar, sin PR documental separado.

## Resultado
Planificación ready de D; implementación, pruebas propias, PR/revisión/merge y template beta pendientes. No volver a planificar sin cambio material. Reconciliación C y corte de ciclo incluidos en este avance, sin crédito adicional de HANDOFF.

## Inicio implementer · 2026-10-18
Codex desktop/API, terminal PowerShell/Git Bash; familia expuesta GPT-6, identificador runtime exacto y esfuerzo efectivo no expuestos. Sol/high solicitado; sin simular selección, delegación ni otras sesiones/modelos. Impacto: CLI/identidad y documentos propios de la copia, sin cambios de API/auth/permisos/propiedad/schema/UI de negocio.

Precondición comprobada: HEAD/tracking/remoto `fff878acb69699b9823f0ac9d9d36284ba5252ff`, primer y único commit documental D obtenido con git log; main local/tracking/remoto `193f5a763af9ae61726daf20d30ae4ce8d5ce59d`; árbol limpio, PR abiertos `[]`, PR#3 MERGED en ese squash. T-002 done, T-003 ready/S-004 v1 approved y T-004 draft. CI de C consultada, sin repetir FULL ni exigir CI de ramas sin PR.

D1→D4 secuenciales según tabla existente. Inicio de tablero; próximo avance concreta lista de escrituras y negativos antes de sustituciones. Ningún recurso Docker ni copia de ensayo creado todavía. HANDOFF 0/22 NO_LISTO; beta/template pendientes de revisión/merge D.

## D1 · Lista de escrituras y guardias
Lista canónica revisable antes de sustituciones: `scripts/lib/init-project-manifest.mjs`. Enumera cada Java relativo bajo main/test (solo esos archivos cambian de paquete/ruta); TEXT_FILES contiene coordenadas propias Maven/Docker, nombre de aplicación/Compose, UI y expectativas de identidad, licencia y documentos conectados. RESET_FILES reinicia README/contexto/reglas/tablero/autonomía y T-000-adoption. ARCHIVE_FILES mueve los cinco registros A…E y S-004 a docs/archive/starter, reajustando únicamente sus enlaces relativos. project-identity.json público registra entradas y hashes para detectar estado parcial/reaplicación incompatible; no contiene secretos ni permisos.

No se cambia nombre npm: starter-client/e2e son identificadores internos estables, lockfiles intactos. Variables STARTER_*, namespaces de los harness y migraciones permanecen estables. PROVENANCE permanece byte a byte y no se activa su prompt en la copia. Las guardias rechazan argumentos, paquete/palabras reservadas, destinos fuera de raíz, enlaces/junctions/hardlinks, colisiones, archivos ausentes/adicionales del árbol Java y personalización parcial. Primero se construye y valida todo el plan; apply solo después. Matriz dirigida con centinelas fuera de lista/copia, snapshots completos e idempotencia. E/S no se promete transaccional. No ejecutar apply en este checkout.

## Checkpoint D2/D3 antes del ensayo compilable · 2026-10-18
Base 193f5a763af9ae61726daf20d30ae4ce8d5ce59d; último commit publicado de inicio 92ea282 (obtener SHA completo con Git), PR#4 draft propio. Fuentes técnicas locales aún sin publicar. CLI y documentos implementados según inventario D1; apply únicamente en copias temporales.

Dirigido inicial: 23/24 pasan; el caso de symlink de archivo falla con EPERM del host Windows antes de probar la guardia. Fixture corregida para usar junction en Windows y symlink de archivo en Linux, manteniendo hardlink, ancestro/root enlazados y centinelas externos. Matrices CLI/herramientas en ejecución; sin resultado verde atribuido todavía.

Próxima operación larga: bash scripts/test-init-copy.sh, log saneado ignorado, proyecto propio starter-verify-init-<timestamp>-<pid>, .env.example ficticia; snapshot por git ls-files sin Git/kit/ignorados. Sin servidor de app ni Google: backend clean verify/Testcontainers y client verify, docs-check e igualdad de fuentes inmutables/POM; no FULL anidado. Cleanup al salir por labels del proyecto propio y eliminación de la copia temporal solo tras validar ruta absoluta/prefijo. No editar el Bash durante ejecución. FULL local de cierre todavía pendiente.

### Rojo comprobado y corrección de identidad
Primer ensayo compilable (`.orchestrator/t-003/init-copy.log`, proyecto starter-verify-init-1792373928-1030): exit1, backend clean verify 4m00s; 75 IT, un fallo exacto ApiDocsEnabledIT esperaba Starter y recibió Agenda Demo; client no ejecutado, cleanup 0/0/0. Sin alterar aserción ni contratos: el nombre público pasa a configuración starter.name y los dos tests que lo comprueban reciben esa configuración. Cliente: un chequeo dirigido con Prettier detectó formato roto al reemplazar literales (AppRoutes/AuthSession con Agenda Demo; más con nombre largo); identidad central JSON para UI/expectativas, sin omitir controles de formato. Inventario D1 actualizado antes de aplicar las nuevas sustituciones.

Matriz tras correcciones iniciales: 25/25 exit0, incluidas guardias Windows device/junction/hardlink y snapshots. Herramientas previas64/64 verdes; nueva matriz se incorpora al mismo job liviano, sin check/infra nuevos. Se conserva pendiente del nuevo ensayo y FULL final. Scripts de smoke/outage leen la identidad pública para no exigir Starter en aplicaciones futuras. El ensayo inicializado conserva cambios propios y no vuelve a aplicar defaults ficticios.

### Negativo documental en copia reiniciada
Ensayo siguiente (`init-copy-fixed.log`) detectó un negativo heredado inefectivo: cambiaba solo el literal heredado y la copia tiene pendiente; 15/16 pruebas pasan y ese test falla antes de arrancar Docker. Se corrige la mutación para marcar C-01 verificado con evidencia heredada explícita cualquiera sea su estado previo, manteniendo la exigencia de rechazo. Cleanup propio0/0/0, sin backend/client ejecutados en ese intento. Repetir dirigido tras este rojo; no lanzar FULL hasta resolverlo.

### Relocación Java y orden de imports
`init-copy-green.log` no fue verde: 75/75 IT pasan (incluido el fallo anterior de nombre), pero Spotless detecta22 archivos cuyo orden de imports cambió al mover com.example.starter a org.demo.agenda; exit1, 5m05s y cleanup0/0/0. Corrección acotada: ordenar los grupos static/ordinarios del inventario Java al trasladarlo; sin invocar herramientas desde el inicializador. El ensayo comprueba Spotless antes de clean verify para fallar temprano, manteniendo todos los unitarios/IT/JaCoCo y su check final.

Cierre de dirigidos previos: client verify host exit0, 16 archivos/133 tests y build; herramientas92/92 exit0, sin omitidos. Se agregaron negativos de ignorados versionados y reset de los22 criterios independientemente de su evidencia previa, y nombres Unicode/longitud máxima/paquete sin cambio. El contexto original también se archiva explícitamente para conservar los anchors históricos; la copia mantiene su PROJECT_CONTEXT nuevo. Último dirigido de copia y luego FULL propio pendientes; no se publica éxito ni se pasa a revisión todavía.

Guardia final JVM: un dirigido a --package java.demo demostró rojo (apply permitido en fixture, exit0 indebido); el CLI ahora rechaza java.* antes de escrituras. No se opera esa fixture fuera del test. Guardias críticas y copia final se comprueban antes del FULL. Lista de ignorados versionados fijada como guardia de lectura, sin acceder a .git; modificarla requiere revisión de compatibilidad, no escribir sobre archivos ignorados.

### Diagnóstico de client en copia y concurrencia medida
`init-copy-final.log`: backend green, 91 unit/slices +75 IT, JaCoCo y Spotless (66 Java limpios); client typecheck/lint/formato pasan, pero133 tests dieron3 fallos en preparación/timeout de ReferencePage/ReferenceSession. Cleanup0/0/0. No se atribuye a la personalización ni se reintenta FULL.

Probe client-only en copia descartable, mismos133 casos/cobertura/deadlines, instrumentación temporal de getComputedStyle y tiempos de handlers sin cuerpos/credenciales, ningún cambio de assertions. `client-copy-probe.log`: exit1,131/133; dos fallos iniciales,16 workers totales, startup medio2,68s, duración20,91s; visitante6 llamadas de estilos/496,7ms y2036ms fallido; primera sesión167 llamadas/998,7ms, timeout5029ms. Docker dispone12 CPUs/14,6GB. Se reprodujo el fallo también sin las otras verificaciones propias corriendo.

Experimento cambiando solo concurrencia a4: `client-copy-four-workers.log` exit0,133/133; startup medio1,31s; visitante695ms, estilos22 llamadas/152,7ms; duración23,13s, sin ahorro global demostrado. Fuentes de producto/assertions/aislamiento/umbrales/retries/deadlines intactos en el experimento; todos los cambios instrumentales solo en la copia que se limpia0/0/0. Corrección materializada en client/vite.config.ts maxWorkers4 y TESTING. No cambiar infraestructura global ni suites de negocio/seguridad. Primeros hooks explícitos de concurrencia siguen dentro de los mismos nueve casos.

Título del navegador conectado a la identidad pública JSON del client (sin generar/formatear HTML por nombre); E2E exige título igual al nombre real de API. Cubiertos nombres Unicode/100 caracteres y paquete sin traslado en matriz. Resumen Swagger sin marca fija. Typecheck/formato de este ajuste verdes. Repetir una copia compilable sin instrumentación y luego congelar fuentes/FULL; dirigidos offline93/93 exit0 conservados, actualizados antes del gate.

## Checkpoint antes del FULL local final · 2026-10-18
Copia compilable sin instrumentación verde (`.orchestrator/t-003/init-copy-closure.log`, starter-verify-init-1792375392-325):182 fuentes inmutables idénticas/POM inventario idéntico, docs-check y16 negativos/controles documentales-adopción, backend clean verify4m22s (91 unit/slices +75 IT, JaCoCo, Spotless66 limpios), client verify133/133, build y cleanup0/0/0; exit0. Ninguna adopción E acreditada.

Guardia adicional de identidad client parcial: rojo exit1 del test porque el CLI permitía apply (log client-identity-guard-red.log), luego validación de JSON/default conocido antes de cualquier escritura. Fuentes finales sin instrumentación; test suite offline final en tools-final-source.log, resultado real por consultar antes de iniciar FULL.

Base/main local/tracking/remoto y PR#4 base193f5a763af9ae61726daf20d30ae4ce8d5ce59d; HEAD local/tracking/remoto/PR92ea282d32a7cb55decb9393f3cb79e0966b2d38 (inicio implementer), fuentes técnicas locales aún sin publicar. Única tarea/PR activos, draft; sin autorrevisión ni merge. Huella completa/técnica antes y después en .orchestrator/t-003/fingerprint-before.json / fingerprint-after.json, obtenidas del listado Git no ignorado sin kit, con SHA por archivo; no inventar SHA de commit futuro.

Comando de cierre, sin opciones:
```bash
COMPOSE_ENV_FILES=.env.example COMPOSE_PROJECT_NAME=starter-verify-d-20261018-231126 STARTER_E2E_PROJECT=starter-e2e-d-20261018-231126 STARTER_SERVER_TESTS=container bash scripts/verify.sh
```
Control local ignorado `.orchestrator/t-003/run-full.sh`; salida `.orchestrator/t-003/full.log`. Preflight rechaza cualquier container/network/volume de esos dos namespaces antes de build. Fixtures ficticias explícitas, sin Google real. El wrapper limpia solo IDs con sus labels exactas, conserva exit no cero y rechaza si no puede listar/limpiar. Los ensayos internos conservan sus namespaces/traps/negativos y cleanup propios. No editar fuentes ni Bash durante FULL. Al retorno: comprobar exit/resumen, cero labels propios y huellas iguales; ante fallo diagnosticar antes de repetir.

Pendiente: FULL propio y publicación del código si pasa; después cierre documental agrupado, CI liviana del HEAD/base publicados y reviewer nuevo. D sigue in_progress, beta/template solo después de revisión/merge D; T-004 draft y HANDOFF0/22 NO_LISTO. Continuidad final exclusivamente PROVENANCE.
