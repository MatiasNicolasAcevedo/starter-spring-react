---
id: T-002
status: in_review
priority: P1
size: M
executor: frontier
role: implementer
milestone: M0
counts_for_cycle: false
product_cycle: null
spec: S-003
spec_version: 1
branch: chore/t-002-reference-security
pr: 3
depends_on: [T-001]
---
# T-002 · C · Referencia removible y seguridad por dueño

## Objetivo
Entregar exclusivamente C de [ROADMAP](../ROADMAP.md) conforme [S-003 v1](../specs/S-003-reference-security.md): CRUD privado de elementos ficticios, paginación, migración propia, formulario RHF/Zod, permisos por dueño y E2E. B ya MERGED con CI FULL PR/main comprobadas en [T-001](T-001-local-stack.md#reconciliación-posterior-al-merge--2026-10-18). Contexto: PROJECT_CONTEXT, «Alcance y secuencia»; sin IDs de negocio heredados.

## Alcance
Referencia aislada `reference`/`reference-items`, V2, DTOs/servicio/repositorio, `/reference` y navegación, pruebas de propiedad/CSRF/sesión/cache, cobertura propia y guía para quitar/reemplazar. Conservar auth S-001, disponibilidad/lifecycle B, Swagger ADR 0003 y versiones/wrappers/locks. No implementar D/E, inicializador/template/adopción, optimización de gates, callback futuro, Google real, recursos ajenos, hosts globales, origen ni protecciones. Una tarea/PR; trabajo secuencial sin delegación.

## Impacto previsto
Comportamiento: CRUD privado y paginado, sin dominio comercial. API: cinco operaciones de S-003 con DTOs/errores seguros/no-store; contratos auth/system/readiness intactos. Permisos/propiedad: solo dueño de sesión, ajeno/ausente 404 indistinguibles; visitante 401 y mutaciones con CSRF. Datos: V2 aditiva con FK a app_user, timestamps UTC y UUID v7; no tocar V1 ni borrar datos persistentes existentes. UI: `/reference`, formularios/estados accesibles y limpieza de datos por identidad. La sesión planner aplica únicamente documentos, sin cambiar comportamiento ejecutable, API, permisos, datos o UI.

## Leer antes
1. [S-003](../specs/S-003-reference-security.md), contrato completo y C-AC-01…10.
2. [ARCHITECTURE](../ARCHITECTURE.md), backend/datos, seguridad y frontend; AGENTS raíz/server/client.
3. [S-001](../specs/S-001-auth-google.md), sesión/CSRF/cache y perfiles; ADR 0002/0003.
4. [TESTING](../TESTING.md), FULL/cobertura/negativos y [SETUP](../SETUP.md), comandos y TR-01…TR-16.
5. [implementer](../agents/implementer.md), [AUTONOMY](../AUTONOMY.md) y prompt/checkpoint de STATUS.

## División secuencial y archivos previstos
Excepción M0 a tamaño orientativo: cuatro unidades verificables en una tarea/PR, sin sesiones/modelos paralelos. Antes de cambios adicionales justificar relación con criterio y registrarlos aquí; no ampliar aceptación.

| Unidad | Depende | Destinos previstos / salida | Prueba de salida |
|---|---|---|---|
| C1 datos y reglas | B done | `server/src/main/resources/db/migration/V2__create_reference_item.sql`; `server/src/main/java/com/example/starter/reference/` entidad/repositorio/servicio/DTOs internos; tests `reference/` | C-AC-01/02/03/05; migrar DB vacía y V1 existente, PostgreSQL/Clock, aislamiento y orden; subdividir datos/servicio si crece |
| C2 API y permisos | C1 | controller/DTOs web/errores de feature, matchers exactos en `security/SecurityConfig.java`, pruebas `SecurityConfigTest` y `reference/*Test/*IT`, contrato OpenAPI | C-AC-02…05; HTTP con dos identidades/CSRF real, 401/403/404, owner injection y vecinos denegados; negativos que detecten ausencia de autorización |
| C3 UI y sesión | C2 | `client/src/features/reference/` api/hooks/lista/formulario/tests; conexiones `app/AppRoutes.tsx`/`AppShell.tsx`; reusar HTTP/RHF/Zod/Query y sesión | C-AC-05…07; providers reales, respuestas retenidas, logout/expiración/cambio a B, keyboard/errores; sin cache poblada por mutaciones tardías |
| C4 prueba integrada y retiro | C3 | `e2e/tests/reference.spec.ts` y fixtures propias, integración runner existente, JaCoCo en `server/pom.xml` y thresholds en `client/vite.config.ts`, guía `docs/REFERENCE.md` y enlaces de arquitectura/README/TESTING | C-AC-08…10; navegador real 1280/375 y dos usuarios, cobertura 80/70 con negativo, guía de retiro, FULL/CI y cleanup0/0/0 |

No marcar C1…C4 como tareas separadas ni iniciar D/E. Los destinos nuevos son previstos, no pruebas ya presentes. Mantener centinela de denegación de auth y las suites OIDC completas. Si un bug requiere modificar infraestructura compartida, reproducir rojo y aplicar solo arreglo mínimo ligado al criterio, sin refactor oportunista.

## Aceptación y pruebas
Matriz canónica C-AC-01…10 en S-003, con estados todavía pendientes. Servicio autoriza y repositorio filtra por dueño; ocultar botones no prueba seguridad. MockMvc oidcLogin solo acredita permisos: protocolo/login/logout/renovación se siguen probando por HTTP/OIDC real y E2E, sin mocks de API propia en navegador. Comparar datos/conteos antes/después de denegaciones. Logout con mutación en vuelo debe fallar si se escribe cache desde la respuesta tardía; no basta afirmar que clear de MutationCache cancela la request.
JaCoCo unit+IT combinado y v8 incluyen código de referencia sin tests, al menos 80% líneas/70% ramas de dominio/servicios y API/hooks; mantener las reglas base, sin exclusiones para pasar. Probar rechazo bajo umbral. Bugfix demuestra rojo antes del arreglo; reglas críticas requieren negativos efectivos, sin bajar asserts/suites/retries/deadlines.
Gate de cierre de C/M0: `bash scripts/verify.sh` FULL sin opciones con `.env.example`, proyectos únicos y backend container. CI FULL final sobre HEAD/base publicados con los seis jobs success; revisión independiente en sesión nueva. No atribuir FULL de B o DOCS_ONLY de esta planificación como pruebas de C.

## Checkpoint de planificación · 2026-10-18
Rol planner nuevo; Codex desktop/API, PowerShell/Git Bash, familia declarada GPT-6. Runtime exacto/esfuerzo efectivo no expuestos; preferencia Sol/high sin simular selección, delegación u otra sesión/modelo. Impacto efectivo exclusivamente documental. Precondiciones y evidencia remota canónica en cierre de T-001; corte de B en ROADMAP.
Rama exacta creada desde main local/tracking/remoto `881b365ab2cd2e3ec87031b44ec58b1ec324a3ef`, árbol limpio inicial y cero PR abiertos. Primer commit de esta rama concilia T-001 done junto con STATUS/BACKLOG/HANDOFF, corte de B y este contrato. La planificación se publica por push sin PR, conforme planner; implementer reutiliza estos commits, no recrea rama desde main.
Validación documental propia: `node scripts/docs-check.mjs` exit0 (42 Markdown, 5 tareas, HANDOFF 0/22); `node --test scripts/ci/*.test.mjs` exit0, **56/56**, sin fallos/omitidos; `git diff --check` exit0. La primera matriz en sandbox no pudo crear `.git/config` de su fixture temporal; repetida completa fuera del sandbox sin cambiar tests. Kit ignorado/fuera de Git; índice se comprueba antes del commit. Ningún stack/dato Docker creado, cleanup no aplica. Clasificación del diff publicado y HEAD local/tracking/remoto se confirman al cierre, sin nuevo commit solo para narrar el SHA. No se acredita FULL ni pruebas de C, ni se abre PR documental separado.

## Inicio implementer contratado (histórico)
Precondición: T-001 done/PR #2 MERGED; T-002 ready/S-003 v1 approved, árbol limpio, ningún PR abierto; rama local/tracking/remoto coinciden y su primer commit tiene padre exacto `881b365ab2cd2e3ec87031b44ec58b1ec324a3ef`; diff publicado exclusivamente documental de este plan; main local/tracking/remoto sigue en ese squash y su CI FULL está success. Si no coincide, sin cambios y devolver STATUS vigente.
Retomar rama, registrar identidad/impacto reales y transicionar T-002 in_progress con tarea/STATUS/BACKLOG/HANDOFF coherentes; commit/push del tablero y abrir único PR draft según implementer. Ejecutar baseline propia antes del código, con preflight labels0/0/0:
```bash
COMPOSE_ENV_FILES=.env.example COMPOSE_PROJECT_NAME=starter-verify-c-baseline-20261018-01 STARTER_E2E_PROJECT=starter-e2e-c-baseline-20261018-01 STARTER_SERVER_TESTS=container bash scripts/verify.sh
```
Comprobar ausencia de ambos nombres y elegir sufijo nuevo si ya existen. Antes de cada operación larga registrar SHA/base, fecha, comando, fase, namespaces/puertos, ruta local ignorada a log y cleanup previsto. Logs brutos solo TEMP/artefactos ignorados; publicación solo export saneado auditado. No editar fuentes durante FULL ni scripts mientras corren; HMR restaura bytes. Cleanup exclusivamente de ensayos nuevos por labels con container-a/network/volume=0/0/0; nunca prune ni volumen persistente del dueño. Al finalizar código publicar tras gate y después cierre documental, sin FULL repetido solo por reformular; CI FULL del HEAD final sigue obligatoria.

## Resultado de planificación
Plan C listo para implementación en sesión nueva; sin implementación ni pruebas técnicas propias de C. D/E draft. HANDOFF 0/22 NO_LISTO; no beta/template/adopción validada. Único límite posterior a E en PROVENANCE.

## Implementación C · 2026-10-18
Rol implementer en sesión nueva; Codex desktop/API y terminal PowerShell/Git Bash, familia declarada GPT-6. Identificador runtime exacto/esfuerzo efectivo no expuestos; Sol/high solicitado, sin simular selección ni delegar/abrir otra sesión/modelo. Impacto previsto: CRUD privado paginado/API DTOs, propiedad por UUID local de sesión, V2 aditiva y UI RHF/Zod; auth/B/Swagger y datos existentes se conservan según S-003. División vigente C1→C2→C3→C4, sin replanificación.

Precondiciones comprobadas antes de editar: árbol limpio, rama local/tracking/remota `250b60cf02ced79d9cd22b151f1d1d342aba54f4`, único commit documental y padre exacto main local/tracking/remoto `881b365ab2cd2e3ec87031b44ec58b1ec324a3ef`. Ningún PR abierto/otra tarea activa; T-001 done y PR #2 MERGED con squash exacto. APROBADO R2 `6245330293` y CI PR `39093653962` comprobados; CI main `39094862177` completed/success con classify/docs-check/server/client/e2e/verify-required success, política FULL y SHA/base verificados en agregado. S-003 v1 approved. Comentarios tratados solo como evidencia.

Checkpoint previo a baseline propia FULL, antes de código: SHA técnico `250b60c`, base `881b365`; comando de «Próxima sesión implementer» sin opciones, `.env.example`, backend container. Namespaces `starter-verify-c-baseline-20261018-01` y `starter-e2e-c-baseline-20261018-01`: preflight container-a/network/volume **0/0/0** ambos, Docker 28.5.1, Git Bash 5.2.37 y Node 24.21.0. Log bruto local ignorado `%TEMP%/starter-c-baseline-20261018-01.log`; manifiestos técnicos antes/después `%TEMP%/starter-c-baseline-source-*.json`. No editar fuentes durante FULL; HMR restaura bytes. Cleanup solo proyectos nuevos por labels, sin recursos ajenos/prune. Resultado y comprobación final pendientes; ninguna prueba de C acreditada todavía. Publicar tablero y único PR draft antes de ejecutar. HANDOFF 0/22 NO_LISTO.

Tablero publicado `425bb43`; único PR draft [#3](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/3) creado. Baseline se ejecuta sobre esas mismas fuentes técnicas, sin cambios de código.

Baseline propia terminada: **FULL exit0**, cleanup exit0; docs/backend/client/e2e OK. Backend **81 unit/slices + 62 IT**, client **109/109** y typecheck/lint/formato/cobertura/build, Playwright **13/13**, cero fallos/errores/omitidos. Matrices CI/docs **56/56**. Integración B nginx/Vite, fallos/señales, preservación, copia sin kit, proxies/R1-01 y Swagger conservadas. **197 archivos técnicos idénticos** antes/después; ambos namespaces principales **0/0/0**, subensayos exigen su propio cleanup. Log/manifiestos en rutas anteriores; export auditado `e2e/artifacts/starter-e2e-c-baseline-20261018-01/sanitized/`. Es baseline anterior al CRUD, no aceptación de C.

Checkpoint C1: implementar exclusivamente V2, entidad/repositorio filtrado por owner UUID, servicio transaccional/Clock y pruebas unitarias/PostgreSQL/migración en rutas previstas. Dirigidos con `.env.example`, backend container, proyecto nuevo `starter-verify-c1-20261018-01` (comprobar ausencia antes de ejecutar), log `%TEMP%/starter-c1-20261018-01.log`; cleanup solo de ese namespace. C2 HTTP sigue después de C1 verificable. Cambio adicional previsto para C2: hacer reutilizables los helpers OIDC HTTP de test existentes para `reference/ReferenceItemIT`, manteniendo las pruebas y semántica heredadas; necesario para C-AC-03/04 sin duplicar protocolo ni inyectar sesión.

C1 intento 01: unitarios **4/4**, repositorio PostgreSQL **3/3**; migración roja por contar marcador Flyway de creación de schema como migración versionada (3 entradas frente a 2). Corregida la suposición del test nuevo: exige versiones exactamente 1/2 y checksum de V1 preservado; no cambia contrato/código para ocultar un fallo. Cleanup exit0. Repetir mismo dirigido/formato con namespace nuevo `starter-verify-c1-20261018-02`, preflight0/0/0, log `%TEMP%/starter-c1-20261018-02.log` y cleanup propio; sin C2 hasta verde.

C1 intento 02 **exit0**, unit **4/4** e IT **4/4**, sin fallos/errores/omitidos; Spotless/clean verify verdes, cleanup exit0. V1→V2 conserva identidad/checksum; DB vacía/JPA validate/propiedad/orden/constraints comprobados. C2: cinco operaciones exactas, body estricto solo en la feature, errores seguros/no-store/OpenAPI y dos identidades por HTTP OIDC. Dirigido previsto: mismo runner con proyecto nuevo `starter-verify-c2-20261018-01`, preflight0/0/0, log `%TEMP%/starter-c2-20261018-01.log`, sin modificar fuentes durante el dirigido; cleanup propio al terminar. Negativos críticos de propiedad/CSRF después del positivo, restaurando fuentes antes del gate final.

C2 intento 01 rojo: el slice `rejectsInvalidPaginationAndUuidWithoutLeakingRejectedValues` detectó UUID inválido reflejado en `ProblemDetail.instance` por el comportamiento automático MVC. Arreglo mínimo en advice de referencia: instancia fija de colección para solicitudes inválidas, sin cambiar el manejador global ni el assert. Cleanup exit0. Repetir dirigido completo con proyecto nuevo `starter-verify-c2-20261018-02`, mismo preflight/cleanup y log `%TEMP%/starter-c2-20261018-02.log`; no se acredita IT hasta su ejecución.

C2 intento 02: **16 unit/slices verdes** y migración/repositorio/OIDC/OpenAPI verdes; dos casos HTTP rojos detectaron `Instant` nanosegundo en respuesta POST frente al redondeo microsegundo de PostgreSQL al releer. Arreglo mínimo en Clock del servicio de referencia: truncar a micros antes de persistir/responder; conserva comparación exacta POST/GET y agrega unit de precisión. Cleanup exit0. Repetir dirigido completo como `starter-verify-c2-20261018-03`, mismo preflight/cleanup, log `%TEMP%/starter-c2-20261018-03.log`. Sin bajar precisión del assert ni alterar schema/auth.

C2 intento 03 **exit0**, **17 unit/slices + 14 IT**, cero fallos/errores/omitidos; Spotless/clean verify y cleanup exit0. Incluye protocolo OIDC heredado y cinco tests OpenAPI (los cuatro previos conservados). Antes de C3, negativos temporales en proyecto nuevo `starter-verify-c2-negative-20261018-01`: quitar filtro de recurso, quitar filtro de listado, ignorar CSRF solo referencia; `test-compile failsafe:integration-test failsafe:verify -Dit.test=ReferenceItemIT#caso` sobre HTTP real, exige fallo de assertion y cero errores de infraestructura. Restauración byte a byte en finally, log `%TEMP%/starter-c2-negative-20261018-01.log`, preflight/cleanup0/0/0; ningún mutante se publica. AuthOpenApi expone solo clase/constantes para reutilizar esquemas existentes, sin cambiar su customizer ni Swagger.

Negativos C2 detectados por HTTP real: recurso sin dueño **200 vs 404**, listado sin dueño **1 vs 0**, CSRF ignorado **201 vs 403**; cada uno falla por assertion, errores0. Fuentes restauradas, cleanup exit0 y labels **0/0/0**. C2 listo para C3.

Checkpoint C3: API/hooks/esquemas, formulario RHF/Zod y ruta/enlace `/reference`, pruebas con providers reales y respuestas retenidas. Reproducir primero 401 tardío de identidad anterior antes de cualquier arreglo del HTTP compartido (C-AC-07); si confirmado, guardia opcional de vigencia de sesión en RequestOptions, usada por referencia, manteniendo comportamiento de auth/transporte sin esa opción. Dirigidos host con dependencias existentes del lock: `npm test -- --run ...` y checks client; logs `%TEMP%/starter-c3-*.log`, sin recursos Docker. No cambiar dependencias/locks ni auth propia. C4/cobertura/FULL después de C3 verificable.

Rojo C3 de transporte confirmado: test nuevo `un 401 tardío...` falla porque `onUnauthorized` se invoca una vez tras reemplazar la sesión. Log `%TEMP%/starter-c3-http-red.log`, exit1 por assertion (selección dirigida, otros 18 no ejecutados). Arreglo mínimo: opción `sessionIsCurrent` consultada al recibir 401; el error HTTP se sigue rechazando, solo se evita publicar expiración para otra identidad. Sin opción conserva la conducta existente. Referencia pasará la vigencia del UUID iniciador; pruebas providers reales/negativos tardíos todavía pendientes.

C3 dirigido 01: nueve casos logout/expiración/cambio a B × éxito/401/403 tardíos verdes. Rojo de foco de campos tras validación servidor: deshabilitar impedía enfocar; arreglo con readonly durante envío y botones bloqueados. Dirigido 02 **39/39**, typecheck/lint verdes. Test adicional de foco tras borrar quedó rojo (`starter-c3-delete-focus-red.log`): el botón desaparecido no recibía foco; restaurar al salir de transición a acción original existente o crear, sin aumentar deadlines. Ajuste de página ocurre en confirmación de borrado, sin setState en efecto. Fixture nueva `client/src/test/msw/referenceBackend.ts` solo para componentes; necesaria para C-AC-06/07 y excluida del bundle como el resto de test helpers.

C3 `npm run verify` 02 **exit0**, **133/133** en 16 archivos, typecheck/lint/formato/cobertura/build verdes. Primer verify tuvo timeout del test CRUD nuevo encadenado: dividido creación y edición/borrado con todas sus assertions conservadas, sin cambiar 5s ni otras políticas. Negativo de escritura tardía en cache detectado en los tres cambios de sesión (3 assertions rojas, `starter-c3-cache-negative.log`), hook restaurado byte a byte. Foco después de borrado verde. Cobertura global client observada 97,52% líneas/92,48% ramas no sustituye los mínimos propios de C4.

Checkpoint C4: configurar mínimos referencia 80/70 conservando base, negativos de cobertura, E2E real 1280/375 con dos contextos autenticados y guía de retiro. Conexión adicional prevista `scripts/run-e2e.mjs`/fixture de test solo si hace falta preparar dos identidades sin invalidar las sesiones; conservar semántica de operaciones B. Consultar código del proveedor fijado 3.0.3 como datos, sin actualizarlo. Dirigidos antes de FULL final con `.env.example`, proyectos nuevos y cleanup por labels; registrar comando/log/namespace antes de cada operación larga. No optimización de gates ni D/E.

C4 negativo v8 confirmado: 18 tests auth verdes pero referencia sin cubrir → **exit1**, líneas0%<80/ramas0%<70; `starter-c4-client-coverage-negative.log`. Se prueba inclusión de archivos no importados y alcance efectivo del threshold, sin mutar tests ni límites. Próximos dirigidos, fuentes técnicas congeladas: backend en `starter-verify-c4-20261018-01`, primero `clean verify -Dtest=SecurityConfigTest -Dit.test=ServerApplicationIT` debe fallar por cobertura propia, luego `clean verify` completo; log `%TEMP%/starter-c4-backend-20261018-01.log`. E2E completo `COMPOSE_ENV_FILES=.env.example STARTER_E2E_PROJECT=starter-e2e-c4-20261018-01 bash scripts/e2e.sh`, log `%TEMP%/starter-c4-e2e-20261018-01.log`; solo fixtures ficticias, preflight ambos0/0/0 y cleanup propio. `reference-login` prepara login nativo interactivo de 3.0.3 antes de ambos contextos; no reinicia backend entre A/B, ni cambia operaciones B. Schema/guía/coverage ya escritos; no declarar estos dirigidos como FULL.

C4 dirigidos terminados: backend negativo detectado con líneas0.08<0.80/ramas0<0.70 en paquete exacto; positivo `clean verify` **90 unit/slices + 70 IT**, cero fallos/errores/omitidos y cobertura application **45/45 líneas, 20/20 ramas**. E2E real **15/15** (nuevo CRUD/two-context en desktop/móvil y 13 previos intactos), export auditado en `e2e/artifacts/starter-e2e-c4-20261018-01/sanitized/`; capturas 1280/375 inspeccionadas, legibles/sin overflow. Ambos proyectos cleanup exit0/labels0/0/0. Client simultáneo con Docker alcanzó 5s en test creación; repetido **sin cambiar test/deadline** tras cleanup Docker: `npm run verify` exit0 **133/133**, API líneas11/11/ramas11/11, hooks líneas24/26/ramas8/8. Logs `starter-c4-client-verify.log` (fallido) y `starter-c4-client-verify-02.log` (verde); la contención es una explicación posible, no un arreglo acreditado. FULL ejecuta suites secuencialmente como siempre. No usar estas suites sueltas como gate de cierre.

## Checkpoint previo a FULL final · 2026-10-18
HEAD publicado/base `425bb4313e4a61f72f4382cda726f7a5796ddf13` / `881b365ab2cd2e3ec87031b44ec58b1ec324a3ef`; C1→C4 implementadas localmente, único PR #3 draft. Comando sin opciones:
```bash
COMPOSE_ENV_FILES=.env.example COMPOSE_PROJECT_NAME=starter-verify-c-full-20261018-01 STARTER_E2E_PROJECT=starter-e2e-c-full-20261018-01 STARTER_SERVER_TESTS=container bash scripts/verify.sh
```
Exigir preflight0/0/0 de ambos nombres nuevos, `.env.example`/fixtures ficticias y backend container; puertos locales de subensayos según SETUP/TESTING, sin modificar hosts ni Google real. Log bruto local ignorado `%TEMP%/starter-c-full-20261018-01.log`; manifiestos técnicos incluyendo archivos nuevos `%TEMP%/starter-c-full-source-before.json` y `starter-c-full-source-after.json`. No editar fuentes mientras corre; HMR restaura bytes. Cleanup verify exclusivamente por su proyecto propio y subensayos por labels; comprobar 0/0/0 y huella idéntica. Pendiente salida FULL real, publicación técnica y cierre documental agrupado después, CI FULL del HEAD final y retoma reviewer distinta; sin autorrevisión/merge. HANDOFF 0/22 NO_LISTO; D/E draft.

## Cierre implementer · 2026-10-18
**FULL final propio sin opciones exit0**, duración **34m12s**, cleanup exit0: docs/server/client/e2e OK. **90 unit/slices + 70 IT PostgreSQL**, **133 tests client/16 archivos** y todos sus checks, **15 Playwright** (1280/375); reportes comprobados sin fallos, errores ni omitidos. Auth/OIDC/CSRF/perfiles/proxies/lifecycle B/Swagger íntegros. Recuperación DB nginx 1280/375 **22,981/15,924 s**, Vite **15,918/16,929 s**, HMR restaurado. R1-01 propio: exit143 y labels0/0/0 antes de emergencia; después matriz completa verde. Export auditado `e2e/artifacts/starter-e2e-c-full-20261018-01/sanitized/`; brutos permanecen locales ignorados.

**224 archivos técnicos idénticos** antes/después, incluidos nuevos; manifiestos SHA256 **2522f7df93703c03be20d5458f316bd603630c4c782ef7bb1d8c7555acd18cea**. Comprobación final independiente de **ocho namespaces observados 0/0/0**: los dos principales y seis subensayos; cada script exige además cleanup propio. Sin edición técnica durante FULL. Código probado publicado en **`6541ec145da9491b18e87baebb31b88c64368cb6`**, HEAD local/tracking/remoto comprobados, main conserva `881b365ab2cd2e3ec87031b44ec58b1ec324a3ef` y único PR #3 draft. Este cierre posterior es documental y su padre exacto debe ser ese SHA técnico. No repetir FULL local por este cierre; CI FULL del HEAD final obligatoria.

| Criterio | Comprobación propia implementer; revisión independiente pendiente |
|---|---|
| C-AC-01 | MigrationIT DB vacía/V1, checksum e identidad preservados; RepositoryIT/PostgreSQL/JPA validate/constraints |
| C-AC-02 | ServiceTest/ControllerTest/ReferenceItemIT y navegador: cinco operaciones, DTO/Location/UUID v7/Clock micros, fechas inmutables y conteos |
| C-AC-03 | Dos sesiones HTTP y dos contextos OIDC simultáneos; ajeno/ausente 404 y A intacto; negativos de recurso/listado sin dueño detectados |
| C-AC-04 | Cookie/header CSRF real, visitante/denegaciones/inyección/campos inmutables y métodos/vecinos; negativo CSRF ignorado detectado |
| C-AC-05 | Trim/límites UTF-16/duplicados, orden con desempate PostgreSQL y páginas vacías/fuera de rango; Zod/errores seguros; rojos de UUID reflejado y precisión persistida corregidos |
| C-AC-06 | Providers reales, estados/foco/teclado, RHF/Zod y último elemento de página; E2E/capturas propias legibles sin overflow 1280/375 |
| C-AC-07 | 9 casos retenidos logout/expiración/cambio a B × éxito/401/403; cache A vacía, B sin refetch/expiración/mensajes/renovación ajena; escritura tardía mutante roja; HTTP 401 tardío rojo antes del arreglo |
| C-AC-08 | 15/15 Playwright sin API mock y regresiones completas nginx/Vite en FULL; fixture interactiva solo test con claves estables entre A/B |
| C-AC-09 | JaCoCo application 45/45 líneas y 20/20 ramas; client API 11/11 líneas/11/11 ramas, hooks 24/26 líneas/8/8 ramas; reglas 80/70 y negativos de cobertura ausente rechazados |
| C-AC-10 | [Guía de retiro](../REFERENCE.md), OpenAPI de código y cuatro casos previos intactos; FULL/cleanup/huella propios; CI final/revisión como precondición observable |

Tarea/STATUS/BACKLOG/HANDOFF transicionan juntos a **in_review**, no done. Validación de cierre: docs-check exit0 (43 Markdown/5 tareas/0 de 22), matrices CI/documentales 56/56 sin fallos/omitidos y diff-check verde; kit ignorado/fuera de Git/índice. PR ready tras conciliar la ejecución push vigente según TR-07; esperar **CI FULL completed/success del HEAD final exacto**, política/base/HEAD en agregado y classify/docs-check/server/client/e2e/verify-required success sin omisiones. Run/SHA/resultado se registran en PR #3 sin commit autorreferencial. Árbol final limpio y HEAD local/tracking/remoto/PR idénticos. Único prompt vigente en STATUS para sesión reviewer nueva; esta sesión no publica APROBADO ni mergea. D/E draft, HANDOFF **0/22 NO_LISTO**, sin beta/template/adopción validada. Google real pendiente externo del dueño; ningún acceso a origen/recursos ajenos/protecciones. Único límite posterior a E en PROVENANCE.
