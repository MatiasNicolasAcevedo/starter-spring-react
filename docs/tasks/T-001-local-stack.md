---
id: T-001
status: ready
executor: frontier
role: implementer
milestone: M0
counts_for_cycle: false
product_cycle: null
spec: S-002
branch: chore/t-001-local-stack
pr: null
depends_on: [T-000]
---
# T-001 · B · Arranque mínimo conectado

## Objetivo
Implementar exclusivamente B de [ROADMAP](../ROADMAP.md) conforme [S-002](../specs/S-002-local-stack.md): desarrollo local persistente sin Google, UI/API/DB conectados, readiness DB exacta por ambos proxies y Swagger opt-in real. Predecesora T-000 done, PR #1 MERGED y ambas CI FULL verificadas; evidencia en T-000.

## Alcance
CLI `scripts/dev.sh up/check/down` con modo local/proxy/proyecto explícitos, fixture/overlay local y runners containerizados; persistencia y rollback propios; health Actuator con DB y publicación GET exacta, UI con estado real y recuperación; ensayos nginx/Vite, 1280/375, Swagger, DB vacía y retoma. Conservar dev-auth efímero, auth/ADR/protocolos/negativos, wrappers/locks/versiones y gates vigentes.
No CRUD ni migración de C, inicializador/template de D, adopción de E, Google real, recursos ajenos, hosts globales, origen ni protecciones. Sin ampliar dependencias: reusar pins inventariados. Una tarea/PR activos; implementar solo en sesión nueva tras verificar el checkpoint.

## Impacto antes de implementar
Comportamiento: nueva entrada de desarrollo persistente, readiness falla ante DB caída y recupera. API: añadir publicación exacta de GET `/actuator/health/readiness` por nginx/Vite, sin cambiar system/info/auth; respuesta pública solo status. Permisos/propiedad: anónimo puede leer esa readiness, sin ampliar acceso a otros Actuator o recursos privados; CLI valida propiedad de todos sus recursos antes de mutar. Datos: volumen local propio persiste en down/restart/rebuild; sin cambios a V1 ni migración prevista. UI: estado conjunto API/DB en `/`, loading/error/reintento/recuperación accesibles, sin éxito basado solo en nombre/versión. Esta sesión únicamente cambia planificación/documentos, sin aplicar esos comportamientos.

## División secuencial antes de editar código
M0 permite tareas mayores por diseño, pero B se divide en cuatro unidades con salida verificable. No son tareas/PR paralelos; conservar T-001 y su rama exacta. Los destinos nuevos son previstos; si crecen, subdividir la unidad en commits pequeños sin ampliar aceptación ni abrir otra parte. Cada unidad tiene su checkpoint, pruebas dirigidas y dependencia de la anterior.

| Unidad | Depende | Resultado / destinos principales previstos | Prueba de salida |
|---|---|---|---|
| B1 · lifecycle persistente | A done | `scripts/dev.sh`, helper de propiedad/rollback dedicado, `compose.local.yml`, fixture local y `scripts/probe-dev-stack.mjs`; reusar dev-auth sin cambiar su contrato. Primero propiedad/CLI/probe base, luego persistencia/rollback en commits separados | B-AC-01/05/06/07; ensayo containerizado `scripts/test-dev-stack.sh` con segundo proyecto centinela ficticio; antes de B2 el probe comprueba solo su base, no declara cumplimiento total de check |
| B2 · readiness DB y frontera | B1 | `application.yaml`, `client/nginx.conf`, `client/vite.config.ts`; `ReadinessIT` y ampliación de `test-auth-proxies.mjs`; conectar check a readiness | B-AC-02/03/04; rojo actual sin DB en readiness y ruta ausente; DB real UP → DOWN → UP y vecinos denegados en ambos proxies |
| B3 · estado de pantalla | B2 | `features/system/api.ts`, hook de readiness dedicado, `SystemInfoPanel.tsx` y sus tests; HTTP/Query/Zod compartidos | B-AC-03/09; loading/503 tras UP/HTML/recuperación/reintento, roles/teclado; nombre/versión sin cambio de contrato |
| B4 · ensayo integrado y cierre | B3 | `e2e/tests/local-stack.spec.ts`, extensión de `swagger.spec.ts`, runner/overlay del ensayo y documentación README/SETUP/TESTING/ARCHITECTURE; gate debe ejecutar las nuevas regresiones reproducibles | B-AC-01…11; nginx/Vite 1280/375, DB vacía/persistencia/fallos/señales, Swagger y HMR; FULL local/CI publicados y cleanup 0/0/0 |

Antes de mutar fixtures de HMR, guardar/restaurar bytes en finally. Antes de fallo/señales/DB outage usar solo stack de ensayo nuevo y propio, nunca el desarrollo del dueño. No editar scripts Bash en ejecución. No sustituir un ensayo portable por Edge/Node del host.

## Aceptación y pruebas
Matriz obligatoria B-AC-01…11 en S-002, sin flexibilizar ROADMAP ni suite heredada. El check final exige contenido real API/health/OIDC y no solo HTTP 200. Ventana UI caída/recuperación 30 s con revalidación 5 s, probes acotados sin aumentar deadlines/retries existentes. Mantener PostgreSQL 18.6, sesión/CSRF/perfiles reales sin fallback, OpenAPI/Swagger opt-in de ADR 0003 y negativos de metadata/Host por ambos proxies.
Bugfix de readiness y cualquier regresión: demostrar rojo pertinente antes del arreglo; reglas críticas requieren negativo que detecte su ausencia y control positivo, sin mocks de API propia en E2E. Mantener suites completas de auth y dev-auth; `test` no acredita IT PostgreSQL. No actualizar aceptación/tests/umbrales para pasar.
Integrar ensayos nuevos en el gate correspondiente de forma reproducible, no dejarlos solo como comandos manuales. FULL de B: `bash scripts/verify.sh` sin opciones con env-file ficticio/proyectos explícitos, clean verify con IT, client completo y Playwright real. Matrices CI/docs y pruebas de lifecycle/proxies relevantes también deben pasar. Revisión independiente sobre HEAD/base publicados y CI FULL, sin autorrevisión ni merge propio. T-001 sigue distinta de done mientras el PR esté abierto.

## Checkpoint ejecutable antes de operaciones largas
Base conciliada: `47184f725f8a89528acac0aa3e7383f2334258de`; primer commit documental `0310e73e77e7200c0445df285138acbc1792ddbc`. Antes de implementar comparar HEAD local/tracking/remoto de `chore/t-001-local-stack`, árbol limpio, main sin cambios, T-001 ready y ningún PR abierto. La planificación queda publicada por push de esta rama sin PR; implementer reutiliza rama, transiciona in_progress con tarea/STATUS/BACKLOG/HANDOFF coherentes, commit/push de tablero y abre el único PR draft según protocolo. No recrear rama desde main perdiendo estos commits.

Inicio de sesión implementer: leer AGENTS raíz/server/client, AUTONOMY, STATUS/BACKLOG/HANDOFF/ROADMAP, T-001/S-002, protocolo implementer y SETUP TR-01…TR-12/TESTING; registrar identidad/impacto reales antes de editar. Línea de base propia antes de código: `COMPOSE_ENV_FILES=.env.example COMPOSE_PROJECT_NAME=starter-b-baseline-<unico> STARTER_E2E_PROJECT=starter-e2e-b-baseline-<unico> STARTER_SERVER_TESTS=container bash scripts/verify.sh`, con Git Bash y Node >=24 para el controlador FULL. Sustituir sufijos por nombres únicos y comprobar ausencia por labels antes de usarlos.

Antes de baseline y cada ensayo largo registrar en tarea/PR: fecha, HEAD/base exactos, comandos, env-file ficticio, nombres/labels/puertos propios, fase y pendientes, rutas locales ignoradas a logs saneados, salida real y plan de cleanup. Logs locales previstos TEMP/starter-B-<ensayo>-<unico>.log; reportes saneados en e2e/artifacts del proyecto; no publicar brutos/cookies/tokens/claims ni datos personales. Inspeccionar labels de container -a/network/volume antes y después; rechazar recursos previos. En desarrollo down conserva datos; solo cleanup de ensayos nuevos termina en 0/0/0. No atribuir a B el FULL de A ni una ejecución DOCS_ONLY de planificación.

Al completar cada unidad registrar archivos/criterios/comandos/resultados/rojos restaurados y siguiente unidad. Límite de bloqueo: máximo dos rondas de revisión y tres correcciones distintas; después checkpoint y dueño. Antes de publicar implementación: gate FULL, documentación coherente, kit ignorado/fuera de Git/índice/imágenes, rutas explícitas en staging, push y HEAD remoto confirmado. Cierre documental posterior al código verde; ready/in_review solo con evidencia del SHA publicado, revisor nuevo; ningún inicio de C.

## Registro de planificación · 2026-10-17
Rol planner, sesión nueva; Codex desktop/API con terminal PowerShell/Git Bash; familia declarada GPT-6. Runtime exacto y esfuerzo efectivo no expuestos: preferencia Sol/high no atribuida como selección efectiva. Sin delegación ni otra sesión/modelo. Precondiciones de A/main/CI consultadas antes de editar; primer commit reconcilia T-000/STATUS/BACKLOG/HANDOFF. Revisión de ciclo registrada en ROADMAP; S-002 alineada con brief autorizado, una tarea ready y C…E draft. Planificación publicada en la rama de tarea conforme planner §7, sin PR documental separado.
Validación documental propia: `node scripts/docs-check.mjs` exit 0 (41 Markdown, 5 tareas, HANDOFF 0/22); `git diff --check` exit 0. Diff limitado a siete Markdown operativos/spec, sin código, wrappers/locks/dependencias ni tareas C…E. Consulta previa al push: main remoto conserva el squash, rama de B aún inexistente en remoto y PR abiertos `[]`. Ningún recurso Docker creado, cleanup no aplica. Comprobar clasificación del diff completo y HEAD local/tracking/remoto tras commit/push; resultados exactos en cierre de sesión.

## Resultado
Plan refinado, ready para implementación en sesión nueva. B no implementada; sin pruebas funcionales ni FULL local/CI de B en esta sesión. HANDOFF mantiene 0/22, NO_LISTO y criterios heredados; sin beta/template/adopción validada. La única retoma operativa vigente está en STATUS.
