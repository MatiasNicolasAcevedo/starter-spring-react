---
id: T-000
status: done
executor: frontier
role: merger
milestone: M0
counts_for_cycle: false
product_cycle: null
spec: null
branch: chore/starter-a-extraction
pr: 1
depends_on: []
---
# T-000 · A: extracción e inventario neutralizados

## Objetivo y evidencia
Materializar exclusivamente A del [ROADMAP](../ROADMAP.md), según contrato de adopción y procedencia de [PROVENANCE](../PROVENANCE.md). Sin continuar el origen.

## Alcance
Árbol exportado con git archive, ancla raíz propia, identidad neutral, documentación reiniciada, reglas/protocolos/ADR/trampas/auth conservadas, inventario completo efectivo conciliado. Publicar rama/PR y pruebas/checkpoint; revisión en sesión distinta.
Conservar dependencias/scopes/versiones, wrappers/locks/plugins/CI y todas las suites heredadas. No implementar B…E, inicializador, CRUD, nuevo dev.sh, beta o ensayo de adopción.

## Impacto antes de editar
Comportamiento: identidad/nombres genéricos; contratos API y autenticación se conservan. Permisos/propiedad: sin ampliaciones. Datos: renombrar configuración ficticia/namespace sin operar volúmenes existentes; SQL de V1 intacto, solo comentarios neutralizados para DB nueva de cada adopción. No aplicar este árbol contra DBs existentes del origen. UI: marca/textos de dominio neutralizados, mismos recorridos. Docs-check se adapta al HANDOFF genérico de 22 criterios sin historia operativa; debe rechazar evidencia heredada como verificada.

## Aceptación y pruebas
- Build backend, typecheck/lint/formato/tests/build client; unitarios/IT PostgreSQL y E2E heredados ejecutables sin bajar suites. Gate FULL vigente y CI del HEAD publicado antes de revisión.
- docs-check válido con tarea/STATUS/BACKLOG/HANDOFF consistentes; negativos de criterio ausente, evidencia heredada marcada verificada y conteo incoherente.
- Inventario generado antes de neutralizar desde POM efectivo y lockfiles: 20 directas Maven, 32 client, 1 E2E, parent/plugins/processor/wrapper/imágenes/acciones. Comparación automática sin diferencias de versiones/scopes/resolución.
- Búsqueda sin identificadores/dominio/historia activa del origen fuera de PROVENANCE; sin evidencia/capturas/tareas antiguas; kit ignorado y fuera de índice/imágenes.
- GitHub propio: solo squash, borrado de ramas, secret scanning/push protection, ruleset PR/0 aprobaciones/sin bypass/force push/borrado; verify-required estricto tras primer reporte.
- Única tarea/PR activos, B…E draft; revisión/merge propios prohibidos.

## Checkpoint de implementación
2026-10-17. Herramienta Codex desktop/API; familia declarada GPT-6; runtime exacto y esfuerzo efectivo no expuestos. Preferencia Sol/high no simulada, sin delegación ni otra sesión/modelo.
Precondiciones y clon temporal de lectura verificados. Ancla bb1179b publicada antes de rama; exclusión /plantilla/ previa al staging.
Inventario previo: help:effective-pom BUILD SUCCESS; dependency-inventory.py reconciliado. No actualizaciones.
Antes de pruebas largas: logs propios en TEMP/starter-A-*.log, .env.example y proyectos starter-a-gate / starter-e2e-a-*. Cleanup solo por labels de esos proyectos y Testcontainers propios, nunca prune ni volúmenes ajenos.
Salida local 2026-10-17: FULL candidato exit 0; docs/server/client/e2e OK. Backend 81 unitarios/slices + 60 IT con PostgreSQL 18.6, sin fallos ni omitidos; Spotless y JaCoCo OK. Cliente: 100 tests en 11 archivos, tsc -b, lint, formato y build OK. Playwright 11/11 (desktop 1280, móvil 375 y Swagger), retries 0; canarios del saneador pasan conservando su rojo inducido, export final auditado tests=11/failures=0/skipped=0. Ningún rojo de canario cuenta como fallo del producto ni como éxito sin auditoría.
Matriz CI/documentación: 56/56; nueve negativos propios prueban la nueva checklist. Primera ejecución de la matriz heredada bloqueada por permisos Git del sandbox; repetida fuera de sandbox sin cambios de tests, exit 0. Inventario conciliado también contra POM efectivo neutralizado; wrappers/locks/versiones/scopes/plugins/imágenes/acciones sin cambios de versión. Solo nombres de raíz en locks, mediante npm.
Logs locales: TEMP/starter-A-full.log, starter-A-ci-matrices.log, starter-A-effective-final.log y starter-A-gate-cleanup.log. Reporte saneado local e2e/artifacts/starter-e2e-a-gate-20261017/sanitized/junit.xml; no se publica en Git. Cleanup exit 0 y conteos por labels de starter-a-gate y starter-e2e-a-gate-20261017: container/network/volume=0/0/0. Sin Google real ni volúmenes ajenos.
Barrido del árbol versionado: cero marcadores de identidad del origen fuera de PROVENANCE; cero archivos del kit/env privado/builds/reportes en índice. Enlaces y anclas sin hallazgos. SQL de migración intacto salvo comentarios genéricos, sin base existente operada.
Publicación inicial: commit técnico 12eba4b, PR #1 OPEN/draft sobre ancla bb1179b. La CI inicial del ancla falló por pérdida de bits ejecutables en la importación Windows; A restaura los modos originales 100755 de mvnw y verify.sh. Se conserva ese run como evidencia y no se reescribe main/historia.
Primer reporte de PR #1, run 39042564145: classify/docs/server/client/e2e SUCCESS; verify-required FAILURE intencional y comprobada por DRAFT=true. Solo entonces se completó el ruleset 25305930 agregando verify-required (Actions 15368) estricto, sin alterar ninguna regla/default existente; bootstrap consumido. PR #1 pasó a ready, confirmado por API. No se cambia otra configuración desde aquí.
Estado final de implementación: in_review, próximo rol reviewer en sesión distinta. Últimos cambios solo documentales: estado/contratos/checkpoint/registro de protecciones; docs y matrices se revalidan antes del push. HEAD documental final, base y CI FULL exacta se publican en el comentario de cierre del PR una vez comprobados, sin atribuir el run draft como aprobación ni otro commit autorreferencial. Si esa publicación no existe o no coincide con HEAD, la precondición de revisión no se cumple.

## Resultado
Implementación A revisada en sesión independiente R1 y cerrada: [PR #1](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/1) MERGED el 2026-10-17 a las 15:29:28 UTC; squash `47184f725f8a89528acac0aa3e7383f2334258de`. Reconciliación remota propia en sesión planner nueva, detallada al final. A done; B queda para planificación e implementación secuenciales. Sin beta/template ni adopción validada.

## Revisión independiente R1 · 2026-10-17
Rol reviewer, con continuidad merger solo para este PR. Sesión distinta de la implementación; Codex desktop/API, familia declarada GPT-6. Identificador runtime exacto y esfuerzo efectivo no expuestos; no se atribuye Sol/high ni se simula selección. Sin delegación ni otra sesión/modelo.
Precondiciones conciliadas antes de editar: HEAD local/tracking/remoto/PR/comentario de publicación b41df4d147682f85abd49e4e9dd2a526021d6b93; base main local/tracking/remoto/PR bb1179bc58283c87803db2ea6c9979f0a464ed88; PR único OPEN/ready, T-000 in_review, árbol limpio y CI FULL 39043204021 success con verify-required. Ruleset 25305930 activo/estricto, sin bypass; sin reviews de cambios pedidos ni conversaciones pendientes.
Impacto de esta transición: solo tarea/STATUS/BACKLOG/HANDOFF; sin cambios de comportamiento, API, permisos/propiedad, datos ni UI. La revisión examinó el diff completo A contra el ancla propia: neutralización, paquete com.example.starter, SQL de V1 sin cambios de sentencias, conjuntos de fuentes/tests conservados, auth/ADR/protocolos y TR-01…TR-12, inventario y wrappers/locks/plugins/imágenes/acciones. Sin cambios de versiones/scopes/resolución, sin pérdida de suites ni reducción de controles. Kit fuera de índice e imágenes; sin identidad del origen fuera de PROVENANCE. El origen no fue operado.
Validación propia: COMPOSE_ENV_FILES=.env.example COMPOSE_PROJECT_NAME=starter-a-review-20261017 STARTER_E2E_PROJECT=starter-e2e-a-review-20261017 STARTER_SERVER_TESTS=container, Git Bash scripts/verify.sh sin opciones, exit 0: docs/server/client/e2e OK. Backend 81 unitarios/slices + 60 IT PostgreSQL 18.6, sin fallos/omitidos, Spotless/JaCoCo; client 100 tests/11 archivos, typecheck/lint/formato/build; Playwright 11/11 a 1280/375 y Swagger desktop, canarios del saneador y export auditado tests=11/failures=0. Matrices CI/docs 56/56, exit 0. POM efectivo regenerado por runner y dependency-inventory.py exit 0: Maven 20/client 32/E2E 1, parent/plugins/wrappers/locks conservados. Primer intento de help:effective-pom rechazado por entrecomillado PowerShell del argumento -Doutput; corregido sin tocar archivos del PR ni suites.
Logs locales ignorados: TEMP/starter-A-review-full.log, starter-A-review-matrices.log, starter-A-review-effective.log y starter-A-review-cleanup.log; POM server/target/starter-review-effective.xml; reporte e2e/artifacts/starter-e2e-a-review-20261017/sanitized/junit.xml. Cleanup exit 0; labels de ambos proyectos inspeccionados con container -a/network/volume=0/0/0. Sin Google real, hosts globales ni recursos ajenos.
Checkpoint antes del push/CI: revisar únicamente el diff documental, docs-check y matrices; publicar, comprobar HEAD nuevo local/remoto/PR y esperar FULL de ese HEAD contra la misma base. Recién entonces comentar veredicto con ambos SHA. Si falla CI o cambia base/HEAD, no aprobar ni mergear. Tras APROBADO, ningún commit adicional; merger reconsulta controles y usa squash ligado al SHA. Tras MERGED y CI main verde, la próxima sesión reconcilia T-000 y revisa ciclo antes de refinar B en su rama exacta; esta sesión no inicia B.

## Reconciliación posterior al merge · 2026-10-17
Sesión nueva, rol planner; herramienta Codex desktop/API con terminal PowerShell/Git Bash, familia declarada GPT-6. Identificador runtime exacto y esfuerzo efectivo no expuestos: no se atribuye Sol/high ni se simula selección. Sin delegación ni apertura de otra sesión/modelo.

Antes de editar: árbol limpio en main; HEAD/main/origin/main y `git ls-remote origin refs/heads/main` coinciden con el squash completo anterior. `gh pr view 1` confirma MERGED y HEAD final `1ba7ad80d045b458f535efda5aa6b184211b6f9f`; `gh pr list --state open` devuelve `[]`. STATUS/BACKLOG solo tenían T-000 mergeable pendiente de esta reconciliación. Consultas iniciales bloqueadas por conectividad del sandbox; repetidas con acceso de red, sin cambios en archivos ni controles.

Ambas CI consultadas con `gh run view`, completed/success: [FULL PR 39044690435](https://github.com/MatiasNicolasAcevedo/starter-spring-react/actions/runs/39044690435) sobre `1ba7ad80d045b458f535efda5aa6b184211b6f9f`; [FULL main 39045270616](https://github.com/MatiasNicolasAcevedo/starter-spring-react/actions/runs/39045270616) sobre `47184f725f8a89528acac0aa3e7383f2334258de`. En cada una classify/docs-check/server/client/e2e/verify-required completed/success; no se acredita el draft como FULL. No se vuelve a revisar ni mergear A en esta sesión.

Primer commit de `chore/t-001-local-stack`, creada desde ese main: tarea A done y STATUS/BACKLOG/HANDOFF conciliados juntos. Impacto exclusivamente documental: sin cambios de comportamiento, API, permisos/propiedad, datos ni UI. HANDOFF conserva 0/22 y NO_LISTO; evidencia de A acotada a A, sin crédito por herencia. Siguiente paso de esta sesión: revisión del ciclo por cierre de A y refinamiento exclusivo de B antes de implementar; C…E siguen draft.
Validación de reconciliación: `node scripts/docs-check.mjs` exit 0 (40 Markdown, 5 tareas, 0/22); `git diff --check` exit 0. Ningún stack ni dato creado; cleanup no aplica. Kit ignorado y fuera del árbol versionado, staging limitado a estas cuatro rutas.
