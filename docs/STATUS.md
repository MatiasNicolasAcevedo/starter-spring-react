# Estado del starter

## Próxima acción
| Campo | Valor |
|---|---|
| Tarea y contrato | [T-000](tasks/T-000-starter-extraction.md) · solo parte A |
| Estado | mergeable |
| Rol siguiente | merger del mismo PR; luego reconciliación/planner en sesión nueva |
| Rama | chore/starter-a-extraction |
| PR | [#1](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/1), OPEN/ready |
| Base | main, bb1179bc58283c87803db2ea6c9979f0a464ed88 |
| Código candidato | 12eba4b; implementación publicada b41df4d; HEAD documental de revisión y CI en veredicto del PR |
| Continuidad | POR_SESION |

### Prompt de la siguiente sesión
```text
Vigente solo para retomar T-000/A desde C:\D\matias\proyectos-ia\starter-spring-react, sin otra tarea/PR activa. Reconciliá primero PR #1 de MatiasNicolasAcevedo/starter-spring-react, su HEAD/base, veredicto y CI con GitHub. Si está OPEN/ready y T-000 mergeable, solo continuar merger cuando exista APROBADO de sesión independiente sobre HEAD/base vigentes y CI FULL verde incluido verify-required; leé AUTONOMY y docs/agents/merger.md, squash ligado al SHA revisado sin bypass, confirmá MERGED y CI main. Si ya está MERGED y su commit coincide con main local/remoto con CI FULL verde, en una sesión de frontera nueva reconciliá T-000 done y STATUS/BACKLOG/HANDOFF en el primer commit de la rama exacta chore/t-001-local-stack; revisá el ciclo de cierre de A según ROADMAP y refiná exclusivamente B/T-001 como planner, dividiendo el trabajo mediano antes de implementación. Leé AGENTS, AUTONOMY, ROADMAP, T-000, T-001, SETUP/TESTING y el protocolo del rol. Registrá modelo/herramienta/esfuerzo realmente expuestos, sin simular selección, delegar ni abrir otra sesión/modelo. No implementar B en la sesión revisora/merger de A ni adelantar C…E; no cambiar protecciones, operar Google real ni el origen. Su único límite posterior a E está en PROVENANCE. Si no se cumple la precondición de la acción correspondiente, no cambies nada y devolvé estado/prompt vigente.
```

## Salud
HANDOFF del starter: 0/22 verificados; 22 criterios heredados pendientes de revalidación. NO_LISTO.
A pasó FULL local candidato y FULL propio de revisión R1: 81 unitarios/slices + 60 IT backend, 100 tests client y 11/11 E2E; matrices CI/docs 56/56. Evidencia exacta, límites y logs en T-000. CI 39043204021 confirma b41df4d; el HEAD documental de revisión exige CI FULL nueva antes del veredicto. El run draft 39042564145 no acredita ready.
Sin beta/template ni adopción validada. B…E contratadas en ROADMAP y tareas draft, sin ejecución. Google real pendiente externo del dueño, nunca operado por agentes.

## Checkpoint breve
Configuración inicial única completa: público MIT, squash/borrado de ramas, secret scanning/push protection, ruleset 25305930 activo sin bypass y verify-required estricto de Actions 15368 tras primer reporte del PR. Defaults de GitHub registrados en AUTONOMY; no modificarlos después para destrabar.
Barrido sin identificadores del origen fuera de PROVENANCE; inventario sin cambios de versiones/scopes/resolución; kit fuera de Git. Ancla propia publicada, rama y PR únicos. El ancla perdió modos ejecutables por importación Windows: A restaura ambos y CI del candidato los probó; main conserva el bootstrap hasta el merge revisado, sin reescribirlo.
Cleanup de starter-a-gate y starter-e2e-a-gate-20261017: contenedores/redes/volúmenes 0/0/0. Logs/reportes locales ignorados; ningún stack ajeno ni Google real operado.
Revisión R1 sin bloqueantes; transición mergeable, no done. FULL propio exit 0 y cleanup de starter-a-review-20261017 / starter-e2e-a-review-20261017: 0/0/0 por labels. Inventario contrastado con POM efectivo regenerado. Sin cambios de código del reviewer. Veredicto pendiente de publicación tras CI FULL del HEAD documental; merge solo bajo AUTONOMY, sin commits posteriores a APROBADO.
Sesión implementer: Codex desktop/API, familia declarada GPT-6; identificador runtime exacto y esfuerzo efectivo no expuestos. Sin atribuir Sol/high, delegar ni abrir otra sesión/modelo.
Sesión reviewer/merger independiente: Codex desktop/API, familia declarada GPT-6; identificador runtime exacto y esfuerzo efectivo no expuestos. Sin atribuir Sol/high, delegar ni abrir otra sesión/modelo. La próxima sesión reconcilia el resultado remoto y revisa ciclo antes de refinar B; no se inicia aquí.
Después de E MERGED y validada, el único prompt final será el de constancia documental definido en PROVENANCE. No se adelanta al cierre de A ni se emite recepción de un ejecutor de producto.
