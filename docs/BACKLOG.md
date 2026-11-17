# Cola del starter

Acción y prompt en [STATUS](STATUS.md). Objetivo vigente del dueño (2026-11-16): que toda aplicación nueva nazca con el [flujo de trabajo](WORKFLOW.md) y con lo aprendido en las aplicaciones derivadas.

## En vuelo

*(ninguna)*

## Listas

| Tarea | Estado | Resultado |
|---|---|---|
| [T-012](tasks/T-012-workflow-tooling.md) | ready | El inicializador y docs-check entregan el flujo nuevo |

## Bloqueadas

| Tarea | Estado | Dependencia |
|---|---|---|
| [T-013](tasks/T-013-targeted-e2e.md) | draft | T-012 MERGED. E2E dirigido con `--grep` y `--project` |
| [T-014](tasks/T-014-single-container-deploy.md) | draft | T-013 MERGED. Imagen de un contenedor para PaaS |

## Hechas recientes

- [T-011](tasks/T-011-docs-check-counts.md): MERGED confirmado (PR #12, ea3d7958); todos los conteos explícitos validados contra criterios reales.
- [T-010](tasks/T-010-docs-check-board.md): MERGED confirmado (PR #11, 2e2a740d); estados explícitos validados, REMOVE_FILES completo, testTimeout 10s.
- [T-009](tasks/T-009-starter-readiness.md): diagnóstico MERGED confirmado y conciliado; R-08 causa desconocida y riesgo residual.
- [T-008](tasks/T-008-junie-merge-continuation.md), [T-007](tasks/T-007-agent-operating-rules.md), [T-006](tasks/T-006-adoption-handoff.md) y [T-005](tasks/T-005-generic-baseline.md): MERGED confirmados y conciliados.

## Por refinar

Aprendizajes de las aplicaciones derivadas que todavía no tienen contrato. El dueño elige cuáles se contratan después de T-014.

- R-09 · Cliente HTTP y sesión: en una aplicación derivada el cliente central ganó manejo de sesión vencida, eventos de sesión e indicador de conexión, con sus tests. Evaluar qué parte es genérica y portarla.
- R-10 · Aplicación instalable: `manifest.json`, iconos y ajustes de `index.html` para instalar la SPA como app. Genérico salvo los iconos.
- R-11 · Atajos por herramienta: comandos o skills delgados para Claude Code y Codex que carguen el protocolo del rol y el prompt de STATUS. Solo si ahorran pasos reales; AGENTS y WORKFLOW siguen siendo la única fuente.
- R-12 · Limpieza de revisión: script que liste worktrees, ramas mergeadas y stashes propios para la revisión de lote, sin borrar nada por su cuenta.
- R-02 · Despliegue compartido en VPS: pendiente externo P3; proveedor, región y contrato de [DEPLOYMENT](DEPLOYMENT.md).
- R-03 · Rendimiento del integrado: mejora opcional P2; tooling domina la corrida medida. Menos urgente ahora que el integrado está diferido.
- R-05a · TEMP: hipótesis P3 no reproducida. R-05b · imágenes efímeras: mejora P3, sin prune.
- R-06 · Callback OIDC: cambio de política UX que requiere contrato y decisión del dueño.
- R-07 · Google real y aceptación final: pendientes externos del dueño, con evidencia propia de cada adopción.

R-04 se ejecutó en [S-004](specs/S-004-document-verification.md). R-08 cerrada técnicamente, con riesgo residual de recurrencia. Ninguna fila acredita adopción ni producción.
