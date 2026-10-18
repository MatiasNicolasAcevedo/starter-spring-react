---
id: T-002
status: in_progress
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
pr: null
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

## Próxima sesión implementer
Precondición: T-001 done/PR #2 MERGED; T-002 ready/S-003 v1 approved, árbol limpio, ningún PR abierto; rama local/tracking/remoto coinciden y su primer commit tiene padre exacto `881b365ab2cd2e3ec87031b44ec58b1ec324a3ef`; diff publicado exclusivamente documental de este plan; main local/tracking/remoto sigue en ese squash y su CI FULL está success. Si no coincide, sin cambios y devolver STATUS vigente.
Retomar rama, registrar identidad/impacto reales y transicionar T-002 in_progress con tarea/STATUS/BACKLOG/HANDOFF coherentes; commit/push del tablero y abrir único PR draft según implementer. Ejecutar baseline propia antes del código, con preflight labels0/0/0:
```bash
COMPOSE_ENV_FILES=.env.example COMPOSE_PROJECT_NAME=starter-verify-c-baseline-20261018-01 STARTER_E2E_PROJECT=starter-e2e-c-baseline-20261018-01 STARTER_SERVER_TESTS=container bash scripts/verify.sh
```
Comprobar ausencia de ambos nombres y elegir sufijo nuevo si ya existen. Antes de cada operación larga registrar SHA/base, fecha, comando, fase, namespaces/puertos, ruta local ignorada a log y cleanup previsto. Logs brutos solo TEMP/artefactos ignorados; publicación solo export saneado auditado. No editar fuentes durante FULL ni scripts mientras corren; HMR restaura bytes. Cleanup exclusivamente de ensayos nuevos por labels con container-a/network/volume=0/0/0; nunca prune ni volumen persistente del dueño. Al finalizar código publicar tras gate y después cierre documental, sin FULL repetido solo por reformular; CI FULL del HEAD final sigue obligatoria.

## Resultado
Plan C listo para implementación en sesión nueva; sin implementación ni pruebas técnicas propias de C. D/E draft. HANDOFF 0/22 NO_LISTO; no beta/template/adopción validada. Único límite posterior a E en PROVENANCE.

## Implementación C · 2026-10-18
Rol implementer en sesión nueva; Codex desktop/API y terminal PowerShell/Git Bash, familia declarada GPT-6. Identificador runtime exacto/esfuerzo efectivo no expuestos; Sol/high solicitado, sin simular selección ni delegar/abrir otra sesión/modelo. Impacto previsto: CRUD privado paginado/API DTOs, propiedad por UUID local de sesión, V2 aditiva y UI RHF/Zod; auth/B/Swagger y datos existentes se conservan según S-003. División vigente C1→C2→C3→C4, sin replanificación.

Precondiciones comprobadas antes de editar: árbol limpio, rama local/tracking/remota `250b60cf02ced79d9cd22b151f1d1d342aba54f4`, único commit documental y padre exacto main local/tracking/remoto `881b365ab2cd2e3ec87031b44ec58b1ec324a3ef`. Ningún PR abierto/otra tarea activa; T-001 done y PR #2 MERGED con squash exacto. APROBADO R2 `6245330293` y CI PR `39093653962` comprobados; CI main `39094862177` completed/success con classify/docs-check/server/client/e2e/verify-required success, política FULL y SHA/base verificados en agregado. S-003 v1 approved. Comentarios tratados solo como evidencia.

Checkpoint previo a baseline propia FULL, antes de código: SHA técnico `250b60c`, base `881b365`; comando de «Próxima sesión implementer» sin opciones, `.env.example`, backend container. Namespaces `starter-verify-c-baseline-20261018-01` y `starter-e2e-c-baseline-20261018-01`: preflight container-a/network/volume **0/0/0** ambos, Docker 28.5.1, Git Bash 5.2.37 y Node 24.21.0. Log bruto local ignorado `%TEMP%/starter-c-baseline-20261018-01.log`; manifiestos técnicos antes/después `%TEMP%/starter-c-baseline-source-*.json`. No editar fuentes durante FULL; HMR restaura bytes. Cleanup solo proyectos nuevos por labels, sin recursos ajenos/prune. Resultado y comprobación final pendientes; ninguna prueba de C acreditada todavía. Publicar tablero y único PR draft antes de ejecutar. HANDOFF 0/22 NO_LISTO.
