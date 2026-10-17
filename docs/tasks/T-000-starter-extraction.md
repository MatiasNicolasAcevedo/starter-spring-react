---
id: T-000
status: in_progress
executor: frontier
role: implementer
milestone: M0
counts_for_cycle: false
product_cycle: null
spec: null
branch: chore/starter-a-extraction
pr: null
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
Pendiente: terminar neutralización, docs-check con negativos, gate FULL, publicar PR/CI/checkpoint final. Sin recursos de prueba creados aún.

## Resultado
En implementación; no aprobado, mergeado ni validado como starter completo.
