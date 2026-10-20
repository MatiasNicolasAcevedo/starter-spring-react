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
- R1: DEPLOYMENT no estaba en el inventario de reinicio y trasladaba una decisión fechada del mantenimiento. Se conserva la guía técnica común, se retira en adopción un bloque obligatorio del starter y se protege DEPLOYMENT en las huellas/idempotencia. Rojo 2/2 antes del arreglo; negativos de frontera y edición propia verdes, matriz 114/114 y copia compilable actual; código db379b993e7578bfa98706435a76e71a0e44dfb7.
- R2: referencias de S-003/SETUP/ARCHITECTURE apuntaban a fases/secciones retiradas. Sustituidas por contexto/recorrido propios y contratos S-001/S-002 vigentes, sin alterar C-AC, IDs ni assertions técnicas. Negativo rojo y fuente/copia verdes en la misma matriz y reproducción r1r2-adoption-result.json; código db379b993e7578bfa98706435a76e71a0e44dfb7.
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

## Checkpoint de corrección R1/R2 · 2026-10-20
Sesión nueva implementer de frontera; Codex desktop, GPT-6 según el entorno, esfuerzo efectivo no expuesto. Terminal PowerShell/Python/Node/Git Bash, Git/gh y conector GitHub. Sin delegación ni operación Junie. Impacto limitado a documentación y adopción; sin cambios de comportamiento/API/auth/permisos/datos/UI de aplicación. Workspace inicial limpio; HEAD 38ac3292339f8d231a103f50728c96d21d9961bd/base cbaf5b0aaca3212f9c08d870a085a6ba85c8d0b3 coinciden con PR OPEN/ready y el último veredicto. CI propia de ese veredicto 39512134983 success.

Rojo propio antes del arreglo: node --test --test-name-pattern="R1:|R2:" scripts/test-init-project.mjs, 2/2 fallan por el contenido reportado; log r1r2-red.log. Reproducción original review-adoption-result.json/review-adoption-negative.log conservada sin sobrescribir. Verde: R1/R2 y frontera 3/3; matriz CI completa 114/114 (incluye inicializador 34/34) exit 0 en 49.713 s. Negativos de frontera ausente/repetida/invertida y archivo ausente preservan todos los bytes; idempotencia y edición posterior de DEPLOYMENT cubiertas. Los tres scripts modificados se acreditan con pruebas actuales, no con profiles-tooling anterior.

Preoperación larga: HEAD/base anteriores, fuentes sin commit listadas por r1r2-validation-before.json. Comandos exactos: node --test "scripts/ci/*.test.mjs" y bash scripts/test-init-copy.sh (Git Bash explícito). Logs r1r2-ci.log y r1r2-copy.log; resumen r1r2-validation-result.json y huellas antes/después. El ensayo de copia genera su namespace starter-verify-init-<epoch>-<pid>, rechaza recursos preexistentes y su trap elimina únicamente labels exactos propios y directorio temporal validado; no repo/Git/kit ni datos reales. Verificar cleanup 0/0/0. Selección por riesgo: revalidar documentos/inicializador/copia compilable; conservar aplicación y lifecycle/proxies/señales solo tras comprobar sus fuentes/infraestructura intactas frente a profiles-*. No se presenta el tooling anterior como ensayo de los tres scripts modificados. Siguiente paso: comprobar resultados/huellas, publicar con docs-check y CI propia, volver a in_review.

Resultado de revalidación afectada: bash scripts/test-init-copy.sh exit 0 en 353.261 s; copia personalizada sin Git/kit, 184 fuentes inmutables y dependencias/POM conservados, backend clean verify con IT PostgreSQL/JaCoCo, client verify completo y docs-check. Cleanup container/network/volume 0/0/0. r1r2-validation-before.json y after.json idénticos (base/fuentes inmóviles). r1r2-adoption-result.json demuestra propuesta propia pendiente, ninguna decisión/portfolio/presupuesto del mantenimiento ni fases retiradas; dirección VPS del starter conservada.

Conservación acotada: r1r2-evidence-scope.json compara las 237 huellas técnicas de profiles-* con estas fuentes. Solo cambian scripts/lib/init-project-documents.mjs, scripts/lib/init-project-manifest.mjs y scripts/test-init-project.mjs frente a tooling; aplicación/infraestructura/lifecycle/proxies/señales idénticos, con base intacta y cleanup previo válido. Frente a aplicación se reproduce además la única diferencia ya revisada de full.yml (timeout 55→45). Se conserva evidencia previa únicamente para esos ámbitos intactos; no se repiten por rutina ni se declara un nuevo FULL o tooling exhaustivo. No cambia ninguna suite/assertion/cobertura/retry/deadline/señal/cleanup existente.

Publicación de las correcciones: db379b993e7578bfa98706435a76e71a0e44dfb7, mismo PR OPEN/ready. Copia actual: 91 unitarios/slices +75 IT PostgreSQL, JaCoCo, frontend 133 con cobertura/typecheck/lint/formato/build y 23 regresiones de adopción/documentos; cero fallos/errores/omitidos. Namespace propio starter-verify-init-1792538076-94811: comprobación adicional r1r2-cleanup.json container/network/volume 0/0/0. Cierre posterior exclusivamente Markdown a in_review/reviewer; conserva las huellas técnicas probadas, exige docs-check y CI propia del HEAD final. HEAD/CI finales en el comentario de publicación más reciente del PR. Pendiente únicamente revisión de sesión distinta; esta sesión no aprueba/mergea ni acredita adopción/aceptación.
