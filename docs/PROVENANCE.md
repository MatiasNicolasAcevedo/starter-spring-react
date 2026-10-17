# Procedencia de la extracción

Este es el único registro publicado que conserva identificadores del producto de origen.

| Dato | Evidencia verificada el 2026-10-17 |
|---|---|
| Repositorio de origen | [MatiasNicolasAcevedo/stockpilot](https://github.com/MatiasNicolasAcevedo/stockpilot) |
| Commit exacto de main | `da004d498cbec198d093ace0f50d152118b8cc9d` |
| Cierre | PR #5 MERGED en ese SHA; HANDOFF v2 22/22 `CIERRE_TECNICO_VERIFICADO` |
| CI de main | [39004346801](https://github.com/MatiasNicolasAcevedo/stockpilot/actions/runs/39004346801), completed/success |
| Contrato leído | AGENTS.md y contrato de adopción genérica de docs/tasks/T-003-e2e-gate-and-handoff.md en ese SHA |
| Método | Clon temporal propio desde GitHub, sin checkout; `git archive` del SHA. Ningún acceso al clon local del origen |
| Exclusiones | Historia y metadatos Git, remotos, .env, node_modules, target, reportes, evidencias/capturas y kit local |
| Ancla nueva | `bb1179b`; commit raíz propio, sin padres del origen, con repo/SHA en el mensaje. Su árbol es el snapshot exportado; la neutralización se revisa en el primer PR |

El origen permanece en lectura durante toda A…E. No se continúan tareas ni se editan archivos, Git, PRs o ajustes allí.
Después de E MERGED y validada, el último prompt del starter habilitará exclusivamente un PR documental en StockPilot: reconciliar T-004 como done y dejar constancia de su detención antes de Junie. Sin prompt de recepción de Junie, sin negocio M1…M3/S-002 y sin archivar, renombrar ni cambiar ajustes. Ese PR no se ejecuta desde esta sesión ni antes de E.

El ancla conserva un snapshot trazable, no historia upstream. La búsqueda de identidad operativa se hace sobre el árbol candidato, excluyendo este registro y metadatos Git; no se oculta el contenido histórico del ancla.

Herramienta expuesta: Codex desktop/API, terminal PowerShell y Git Bash. Familia declarada GPT-6; identificador runtime exacto y esfuerzo efectivo no expuestos/verificables. El pedido Sol/high queda registrado como preferencia, sin simular selección. Sin delegación ni otra sesión/modelo.
