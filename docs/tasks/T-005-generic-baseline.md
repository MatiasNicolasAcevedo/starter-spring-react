---
id: T-005
status: changes_requested
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
Implementación ampliada publicada en 8bbccad931e3aac20a29de267c0065ff468344fa. Cierre solo documental a in_review/reviewer; exigir CI propia del HEAD final antes del veredicto independiente. Regresiones documentales posteriores 20/20 y docs-check exit 0. Esta sesión implementó: no aprueba ni mergea su trabajo. Limpieza del árbol actual, historia Git conservada sin reescribir; adopciones sin historia ni permisos/evidencia heredados. Kit no copiado/borrado.

Decisión del dueño: portfolio personal, 4–5 proyectos alternables, VPS 4 vCPU/8 GB, frontend/backend juntos y PG compartido por bases/roles. Presupuesto máximo US$10–15/mes. Primero desarrollar apps; proveedor/región/dominio y precio/stock/latencia desde Argentina se revalidan al contratar. DEPLOYMENT registra camino y candidatos, sin infraestructura configurada, pagos, deploy, datos reales ni Google real. La base sigue en ajuste para el uso del dueño.

## Checkpoint de revisión independiente · 2026-10-20
Sesión nueva, rol reviewer de frontera; Codex desktop/API, familia GPT-6 expuesta, identificador runtime exacto y esfuerzo efectivo no expuestos. Terminal PowerShell/Python/Node/Git Bash, Git/GitHub CLI, conector GitHub y web oficial. Sin selección simulada, delegación ni otras sesiones. Impacto de esta sesión: revisión y transición documental; sin cambios de código, API, permisos, datos ni UI.

Revisión del HEAD publicado a3787267412777f81ab899ee364979bdf86754c2 contra main cbaf5b0aaca3212f9c08d870a085a6ba85c8d0b3. GitHub confirma PR #6 OPEN/ready, rama exacta, único PR abierto y CI propia 39492153912/verify-required success; sin reviews ni conversaciones bloqueantes previas. El parche remoto completo reconstruye los 52 blobs publicados desde la base. Workspace inicialmente limpio. Perfil calculado FULL/STARTER.

Evidencia técnica corroborada, sin repetir suites largas: 279 huellas antes/después iguales en cada gate; las 237 fuentes técnicas finales coinciden con tooling. Única diferencia técnica entre gates: timeout del job E2E de full.yml de 55 a los 45 minutos previos de la base (huella anterior reproducida). Resto del avance posterior solo Markdown. Logs de aplicación: exit 0, 711.331 s, 91 unitarios/slices +75 IT, JaCoCo verde, frontend 133 y JUnit Playwright 15/0 fallos/0 errores/0 omitidos; reducción 71.7% frente a 2513.545 s. Tooling exit 0, 1837.722 s: copia compilable, 185 fuentes inmutables, guardias, nginx/Vite, nueve fallos, preservación, señales y cleanup por labels 0/0/0 conservados. Regresiones documentales finales previas 20/20 corroboradas. CI liviana no acredita FULL remoto. Tarifas y límites de DEPLOYMENT contrastados con las fuentes oficiales enlazadas, sin compra ni despliegue.

Dirigidos propios: node --test "scripts/ci/*.test.mjs" 111/111 exit 0; node --test scripts/test-init-project.mjs 31/31 exit 0; desde client, npm test -- --run src/features/auth/AuthSession.test.tsx 19/19 exit 0. node scripts/docs-check.mjs y git diff --check exit 0. Logs ignorados review-ci-host.log, review-init-host.log y review-session.log en .orchestrator/t-005. Primer ensayo sandbox falló por carga de Git Bash y EPERM de enlaces; repetido en host autorizado sin cambiar fuentes. test-init-adopted.mjs se invocó inicialmente fuera de una copia inicializada: resultado inválido para este contexto, no hallazgo del PR; la matriz correcta lo ejercita donde corresponde.

**Resultado: CAMBIOS REQUERIDOS, dos hallazgos P2.** No hay aprobación ni merge. AC-03/04 corroborados y evidencia técnica de AC-05 válida; AC-01/02 impiden el cierre:

- R1 · docs/DEPLOYMENT.md:3 y manifiesto del inicializador: una copia nueva conserva byte por byte la decisión del dueño del mantenimiento fechada 2026-10-20, su portfolio y presupuesto como decisión ya aceptada. DEPLOYMENT no se reinicia ni se retira. Reproducción desde exportación exacta del HEAD sin Git/kit: aplicar identidad Revision Demo termina exit 0 y conserva esa atribución; docs-check de la copia pasa. La aplicación debe recibir una propuesta genérica o decisión propia pendiente, conservando en el starter la dirección VPS aceptada. Añadir negativo que impida trasladar decisiones/contexto de mantenimiento.
- R2 · docs/specs/S-003-reference-security.md:12, docs/SETUP.md:6 y docs/ARCHITECTURE.md:49: persisten «parte C»/«regresiones de B», «Entorno de A» y el sufijo «(B)». S-003 remite además a «Objetivo aceptado»/«Alcance y secuencia», secciones ya retiradas de PROJECT_CONTEXT, y a una parte C inexistente del ROADMAP. La misma copia los conserva. Sustituir referencias de fases por contratos/secciones vigentes y cubrir esta regresión; no cambiar IDs técnicos ni assertions útiles por una limpieza textual indiscriminada.

Evidencia propia de reproducción: .orchestrator/t-005/review-adoption-result.json y review-adoption-negative.log (dos negativos rojos, exit 1 esperado); copia descartable review-adoption exportada únicamente de archivos versionados, sin crear otro repo. Las suites verdes existentes no detectan estos contenidos. La sesión revisora solo publica tarea/STATUS y sincroniza el estado repetido de BACKLOG para cumplir docs-check. Diff documental revisado; docs-check/diff-check exit 0 y node --test scripts/ci/docs-check.test.mjs 20/20 exit 0 tras la transición (review-docs-transition.log). El veredicto del PR debe identificar el nuevo HEAD documental y su CI propia antes de cerrar esta sesión.

Retoma: sesión implementer nueva, misma tarea/rama/PR; corregir R1/R2, demostrar rojo/verde y revalidar lo afectado según TESTING, con huellas/base/cleanup. Conservar suites y evidencia aún válida; no repetir FULL por rutina ni atribuir evidencia vieja a fuentes modificadas. Volver a in_review para una sesión revisora nueva. No iniciar otra tarea, declarar adopción/aceptación, contratar/desplegar, operar Google real ni el kit.
