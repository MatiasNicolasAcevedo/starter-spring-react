---
id: T-005
status: in_review
priority: P1
size: M
milestone: M0
product_cycle: null
counts_for_cycle: false
spec: null
spec_version: null
depends_on: []
branch: codex/t-005-generic-baseline
risk: standard
role: reviewer
executor: frontier
pr: 6
---
# T-005 · Base inicial genérica y operación económica

## Objetivo
Presentar una base inicial autosuficiente, sin referencias al producto de origen ni bitácoras de construcción. Medir el costo temporal de FULL y proponer alojamiento para varias aplicaciones dentro de US$10–15/mes.

## Alcance
Autorización del dueño 2026-10-20: limpiar documentación/historia operativa; conservar código, versiones, controles y pruebas útiles. La aplicación nueva recibe únicamente contexto, tareas, permisos y evidencia propios. Medir suites y ensayos sin suprimirlos. Proponer VPS compartido y un PostgreSQL con bases/roles separados; sin contratar, desplegar, operar Google real ni copiar/borrar el kit. Historia recuperable en Git, sin reescribir commits.

## Aceptación
- AC-01: árbol actual sin identificadores del origen, fases antiguas ni tareas/specs de construcción obsoletas; documentación breve y enlaces válidos.
- AC-02: el inicializador no copia historias del mantenimiento ni permisos/evidencia; mantiene dry-run, guardias, idempotencia y compilación de copia. Regresión roja antes del arreglo.
- AC-03: FULL informa duración de suites y etapas de infraestructura; diagnóstico distingue mediciones de estimaciones y no reduce controles.
- AC-04: propuesta operativa con varias apps, un PostgreSQL, aislamiento, TLS, backups y límites; precios oficiales fechados, costos recurrentes/renovación y decisión de proveedor pendiente del dueño.
- AC-05: docs-check, regresiones afectadas y FULL local válidos; PR propio a revisión independiente. Esta sesión no revisa ni mergea su implementación.

## Pruebas y checkpoint
Rol planner/implementer de frontera por el pedido del dueño; Codex desktop/API, familia GPT-6 expuesta, runtime exacto y esfuerzo efectivo no verificables. Sin delegación ni selección simulada. Terminal/Git/gh, Python/Node/Git Bash/Docker, web y documentación oficial. Impacto: documentos, personalización y observabilidad del gate; aplicación/API/auth/datos/UI sin cambios. Una assertion previa fortalece la precondición de un test de sesión; client/AGENTS leído.

Base `cbaf5b0aaca3212f9c08d870a085a6ba85c8d0b3`, main remoto comprobado, único trabajo activo. Evidencia ignorada: `.orchestrator/t-005/` (dirigidos, full.log, full-result.json, full-line-times.jsonl, full-before/full-after.json, timing-analysis.json). Fuentes congeladas durante FULL, todas las huellas antes/después idénticas.

Gate exacto: `COMPOSE_ENV_FILES=.env.example COMPOSE_PROJECT_NAME=starter-verify-t005-baseline-20261020 STARTER_E2E_PROJECT=starter-e2e-t005-baseline-20261020 STARTER_SERVER_TESTS=container bash scripts/verify.sh`, sin opciones. Preflight vacío, fixtures y namespaces propios; cleanup por labels, nunca prune, kit/Google real/recursos ajenos sin operar.

Resultado 2026-10-20: FULL exit 0 en 2513.545 s (41m53.5s), cleanup 0/0/0 y huellas iguales. Backend 91 unitarios/slices + 75 IT, client 133, Playwright 15/15 sin omitidos. Dirigidos inicializador/documentación 48/48; dirigido de sesión 19/19. Posteriores cambios solo Markdown conservan la evidencia si base/fuentes técnicas coinciden; docs-check antes de publicar. No se acredita despliegue ni uso real de Junie.

| Etapa medida | Tiempo de pared |
|---|---|
| Docs / backend / client | 4 s / 244 s / 49 s |
| Matriz inicializador / copia compilable / guardias | 48 s / 308 s / 27 s |
| Desarrollo persistente nginx / Vite | 286 s / 297 s |
| Fallos/rollback/preservación | 548 s |
| Copia sin Git/kit / señales proxies / matriz proxies | 120 s / 25 s / 134 s |
| Bloque stack/Playwright/saneador/cleanup | 422 s |

Playwright reporta 383.134 s de ejecución total; suma por casos 180.665 s (diferencia incluye preparación/fixtures/runner). Backend original: Surefire ~39 s, Failsafe ~144 s; Maven total 239 s, wrapper 244 s. Vitest 20.66 s en origen y 17.74 s en copia. Tiempos de pared, no perfil de CPU/I/O puro; etapas secuenciales y red/caché variables. La validación del tooling anterior al bloque final consume 1793 s (29m53s): separar frecuencias por alcance es una propuesta futura, sin suprimir suites en este cambio.

## Correcciones significativas
- Regresión roja propia: la aplicación nueva recibía docs/archive. El inicializador retira tareas de mantenimiento sin archivarlas; conserva guardias, dry-run/idempotencia y compilación. Matriz verde 48/48. Diagnósticos previos resueltos: bajas sin indexar en fixtures y llamada residual al reescritor de enlaces retirado.
- Primer FULL falló en client (132/133; E2E no ejecutada, cleanup completo); evidencia attempt1-* conservada. El test exigía conservar datos sin esperar su carga inicial. Se añadió esa precondición, manteniendo assertions posteriores/casos/cobertura/timeouts/retries. Dirigido 19/19 y FULL final verdes; sin código de aplicación modificado.

## Entrega y pendientes
Limpieza del árbol actual; historial Git conservado sin reescribir. Revisión independiente de este PR pendiente; no merge propio ni done con PR abierto. Proveedor/región/dominio y gasto quedan para el dueño; DEPLOYMENT es propuesta, sin contratación. Kit no copiado/borrado. Implementación publicada en PR #6, commit c048aaa. Esta transición solo Markdown fija in_review/reviewer; exigir CI propia del HEAD final antes del veredicto independiente.

Matriz local equivalente a CI: 99/99 exit 0, 43.8 s; docs-check y diff-check finales exit 0. Cambios posteriores al FULL solo Markdown, huella técnica comprobada idéntica. Árbol sin identificadores del origen ni referencias a la continuidad retirada; 1110 líneas netas menos antes de la transición final. Descripción pública actualizada a Generic Spring Boot, React and PostgreSQL starter; is_template=true y base main conservados. Sin modificación de protecciones, visibilidad ni permisos.
