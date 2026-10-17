---
id: T-000
status: in_review
executor: frontier
role: reviewer
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
Implementación A publicada para revisión en [PR #1](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/1); evidencia local y contrato conservados. Verificar HEAD/base/CI y el comentario final antes de revisar. No revisada ni mergeada. B…E siguen draft sin ejecución; no beta/template ni adopción validada. Cleanup pendiente: ninguno de los stacks de A; logs y reportes saneados solo locales e ignorados.
