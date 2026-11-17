# Ruta de la base inicial

| Política | Valor |
|---|---|
| Cadencia efectiva | 10 tareas mergeadas por lote, con revisión de lote por frontera; también al cumplir objetivo o cambiar alcance |
| Proceso | [WORKFLOW](WORKFLOW.md): tres roles, modo del proyecto, gate diario y gates diferidos |
| WIP | Una tarea y un PR activos; revisión independiente |

1. Base genérica breve, sin historia operativa ni contexto de otra aplicación.
2. Medición del gate completo y elección de mejoras por el costo observado, conservando las pruebas.
3. Despliegue económico para varias aplicaciones, después de decidir proveedor/región y contrato operativo con el dueño.

La tarea actual y su aceptación viven en [STATUS](STATUS.md) y el orden en [BACKLOG](BACKLOG.md). Estas etapas no acreditan ejecución. El mantenimiento del starter no crea tareas comerciales en las aplicaciones.

## Uso de una copia

Personalizar identidad antes de completar PROJECT_CONTEXT; aceptar contexto y AUTONOMY propios, validar adopción y preparar el primer flujo con frontera. Elegir el modo en AUTONOMY. Las specs agrupan capacidades; en `LOTES_JUNIE` Junie encadena unas diez tareas predefinidas y frontera audita el lote. Volver a frontera antes ante alcance/arquitectura/permisos no resueltos. No trasladar tareas ni evidencias del mantenimiento.

## Iteración vigente · el flujo nuevo llega a las herramientas

Objetivo del dueño del 2026-11-16: que la base entregue a cada aplicación nueva el flujo de trabajo y lo aprendido en las aplicaciones derivadas, para desarrollar rápido sin perder calidad. La iteración anterior (T-009 y S-004) está cerrada y el dueño aceptó la base como usable el 2026-10-27.

Ruta: adopción documental del flujo → [T-012](tasks/T-012-workflow-tooling.md) inicializador y docs-check → [T-013](tasks/T-013-targeted-e2e.md) E2E dirigido → [T-014](tasks/T-014-single-container-deploy.md) imagen de un contenedor → retorno a frontera para elegir con el dueño entre los candidatos de «Por refinar». Conservar versiones; sin deploy, gastos ni Google real por esta iteración.
