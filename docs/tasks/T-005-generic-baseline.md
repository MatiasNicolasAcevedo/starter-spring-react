---
id: T-005
status: in_progress
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
role: implementer
executor: frontier
pr: 6
---
# T-005 · Base inicial genérica y operación económica

## Objetivo
Presentar una base inicial autosuficiente, sin referencias al producto de origen ni bitácoras de construcción. Medir el costo temporal de FULL y proponer alojamiento para varias aplicaciones dentro de US$10–15/mes.

## Alcance
Autorización del dueño 2026-10-20: limpiar documentación/historia operativa; conservar código, versiones, controles y pruebas útiles. La aplicación nueva recibe únicamente contexto, tareas, permisos y evidencia propios. Ampliación del dueño: gate cotidiano de aplicación con docs/backend/frontend/Playwright; separar mantenimiento de herramientas por alcance, sin borrar suites. Proponer VPS compartido y un PostgreSQL con bases/roles separados; sin contratar, desplegar, operar Google real ni copiar/borrar el kit. Historia recuperable en Git, sin reescribir commits.

## Aceptación
- AC-01: árbol actual sin identificadores del origen, fases antiguas ni tareas/specs de construcción obsoletas; documentación breve y enlaces válidos.
- AC-02: el inicializador no copia historias del mantenimiento ni permisos/evidencia; mantiene dry-run, guardias, idempotencia y compilación de copia. Regresión roja antes del arreglo.
- AC-03: FULL informa duración de suites y etapas de infraestructura; diagnóstico distingue mediciones de estimaciones; gate cotidiano reduce al menos 50% frente a 2513.545 s en este entorno, conservando backend/IT/client/Playwright. Matriz de herramientas exigida solo ante cambios pertinentes, clasificación conservadora y sin declarar parciales como gate completo.
- AC-04: decisión registrada de portfolio personal, VPS 4 vCPU/8 GB, sin despliegue hasta tener una app; propuesta operativa con varias apps, un PostgreSQL, aislamiento, TLS, backups y límites; precios oficiales fechados, costos recurrentes/renovación y decisión de proveedor pendiente del dueño.
- AC-05: docs-check, regresiones afectadas y FULL local válidos; PR propio a revisión independiente. Esta sesión no revisa ni mergea su implementación.

## Pruebas y checkpoint
Rol planner/implementer de frontera por autorización del dueño; Codex desktop/API, familia GPT-6 expuesta, runtime exacto y esfuerzo efectivo no verificables. Sin delegación ni selección simulada. Terminal/Git/gh, Python/Node/Git Bash/Docker, web/Context7 y fuentes oficiales. Impacto: documentos, personalización, selección y observabilidad del gate; aplicación/API/auth/datos/UI sin cambios. Una assertion previa fortalece la precondición de un test de sesión; client/AGENTS leído.

Base remota comprobada cbaf5b0aaca3212f9c08d870a085a6ba85c8d0b3; mismo PR #6/rama, sin otro trabajo activo. La ampliación partió del HEAD publicado 19804b8aa1a31e6c6f9ee0a25a3a9136d33a0cf3/CI 39477282410 success; no se reutilizan como validación del HEAD que se publica ahora. HEAD y CI final propios deben quedar en el comentario de publicación.

Evidencia ignorada propia en .orchestrator/t-005: full* (diagnóstico anterior), profiles-application*, profiles-tooling*, profiles-summary.json, profiles-red.log y profiles-final-ci-restored.log. No editar fuentes durante gates. Preflight vacío; .env.example/fixtures y proyectos propios; cleanup por labels exactos, nunca prune ni datos ajenos. Cada ensayo hijo comprueba su propio cleanup.

- Diagnóstico anterior: FULL exhaustivo 2513.545 s, exit 0, cleanup 0/0/0 y huellas iguales. Sirve como comparación temporal; la ampliación tiene pruebas nuevas.
- Gate cotidiano exacto: COMPOSE_ENV_FILES=.env.example COMPOSE_PROJECT_NAME=starter-verify-t005-application-20261020 STARTER_E2E_PROJECT=starter-e2e-t005-application-20261020 STARTER_SERVER_TESTS=container bash scripts/verify.sh, sin opciones. Exit 0 en 711.331 s (11m51.3s), reducción 71.7%; cumple meta <=1256.77 s. Backend 91 unitarios/slices +75 IT PostgreSQL, client 133, Playwright 15/15 sin fallos/errores/omitidos. Huellas de todos los archivos antes/después idénticas; cleanup propio container/network/volume 0/0/0.
- Mantenimiento: mismo entorno/base con proyectos starter-verify-t005-tooling-20261020 / starter-e2e-t005-tooling-20261020, comando bash scripts/verify.sh --tooling. Exit 0, 1837.722 s, huellas iguales y cleanup propio 0/0/0. Inicializador, copia compilable, guardias, nginx/Vite, nueve fallos/rollback/datos, copia sin Git/kit y señales/proxies completos. Se ejecuta aquí porque el PR modifica tooling; no en cada diff APPLICATION.
- Matriz local equivalente a CI: 111/111 exit 0 (49.4 s), con configuración final. Regresiones de perfiles primero rojas contra runners anteriores. Prueba del despacho real y fail-fast con runners ficticios; no mockea API propia en E2E. Backend/client/Playwright no pierden casos, assertions, cobertura, retries ni deadlines.

| Etapa cotidiana | Tiempo de pared |
|---|---|
| Docs | 5 s |
| Backend completo | 241 s |
| Frontend completo | 46 s |
| Stack/Playwright/saneador/cleanup | 417 s |

Tiempos secuenciales de pared, no perfil de CPU/I/O ni promesa para otra máquina/app. Tras medir aplicación solo se restauró el timeout global del job remoto a los 45 min previos, validado por matriz CI/docs-check; no cambió ninguna fuente de aplicación. La comparación de huellas demuestra que esa es la única diferencia técnica entre ambos gates. Tooling final y publicación conservan exactamente las mismas fuentes técnicas; cierre posterior solo Markdown no repite suites si base/fuentes coinciden.

## Correcciones significativas
- Regresión roja propia: una app nueva recibía docs/archive. El inicializador retira tareas de mantenimiento sin archivarlas; mantiene guardias, dry-run/idempotencia y compilación. Dirigidos previos 48/48 y matriz/copia actuales verdes.
- Primer FULL anterior falló en client 132/133, cleanup completo; attempt1-* conservado. El test exigía conservar datos sin esperar la carga inicial. Se añadió esa precondición sin debilitar assertions/casos/cobertura/timeouts/retries; dirigido 19/19 y gates completos verdes, sin código de aplicación modificado.
- La matriz exhaustiva se ejecutaba en toda tarea: se separan aplicación y tooling; clasificador conservador exige STARTER para scripts/Compose/dependencias/configuración compartida/desconocidos. Pruebas de rutas, secuencia, no duplicación y fail-fast verdes. Se corrigió la reutilización de un archivo de llamadas entre fixtures de selección.

## Entrega y pendientes
Publicar esta ampliación en el mismo PR; después cerrar documentación a in_review/reviewer y exigir CI propia del HEAD final. Esta sesión implementó: no aprueba ni mergea su trabajo. Limpieza del árbol actual, historia Git conservada sin reescribir; adopciones sin historia ni permisos/evidencia heredados. Kit no copiado/borrado.

Decisión del dueño: portfolio personal, 4–5 proyectos alternables, VPS 4 vCPU/8 GB, frontend/backend juntos y PG compartido por bases/roles. Presupuesto máximo US$10–15/mes. Primero desarrollar apps; proveedor/región/dominio y precio/stock/latencia desde Argentina se revalidan al contratar. DEPLOYMENT registra camino y candidatos, sin infraestructura configurada, pagos, deploy, datos reales ni Google real. La base sigue en ajuste para el uso del dueño.
