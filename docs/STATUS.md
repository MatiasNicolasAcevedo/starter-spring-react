# Estado del starter

## Próxima acción
| Campo | Valor |
|---|---|
| Tarea y contrato | [T-000](tasks/T-000-starter-extraction.md) · solo parte A |
| Estado | in_review |
| Rol siguiente | reviewer de frontera, sesión distinta de la implementación |
| Rama | chore/starter-a-extraction |
| PR | [#1](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/1), OPEN/ready |
| Base | main, bb1179bc58283c87803db2ea6c9979f0a464ed88 |
| Código candidato | 12eba4b; HEAD documental final y CI en comentario de publicación del PR |
| Continuidad | POR_SESION |

### Prompt de la siguiente sesión
```text
Vigente solo en una sesión distinta de la implementación, con raíz C:\D\matias\proyectos-ia\starter-spring-react: PR #1 OPEN y ready, T-000 in_review, ninguna otra tarea/PR activa, HEAD/base coincidentes con el último comentario de publicación y CI FULL del HEAD final verde, incluido verify-required. Reconciliá esos hechos con GitHub antes de editar. Si coinciden, leé AGENTS.md, AUTONOMY, T-000 y el protocolo reviewer; revisá exclusivamente A, registrando modelo/herramienta/esfuerzo realmente expuestos, sin simular selección, delegar ni abrir otra sesión/modelo. Contrastá extracción, inventario completo y versiones, neutralización, reglas/ADR/auth/trampas conservadas, pruebas y checkpoint. Publicá el veredicto con SHA de HEAD/base; si queda APROBADO y cumple AUTONOMY, podés continuar como merger del mismo PR con squash ligado al SHA, confirmar MERGED y CI de main y dejar la retoma correspondiente. No implementes B…E, no cambies protecciones y no operes el origen; su límite posterior está en PROVENANCE. Si cualquier precondición no coincide, no cambies nada y devolvé el estado y el prompt vigente.
```

## Salud
HANDOFF del starter: 0/22 verificados; 22 criterios heredados pendientes de revalidación. NO_LISTO.
A pasó FULL local candidato: 81 unitarios/slices + 60 IT backend, 100 tests client y 11/11 E2E; matrices CI/docs 56/56. Evidencia exacta, límites y logs en T-000. El run draft 39042564145 tuvo todas las suites SUCCESS y agregado rechazado intencionalmente; no acredita ready. El comentario final debe confirmar CI FULL del nuevo HEAD publicado antes de revisar.
Sin beta/template ni adopción validada. B…E contratadas en ROADMAP y tareas draft, sin ejecución. Google real pendiente externo del dueño, nunca operado por agentes.

## Checkpoint breve
Configuración inicial única completa: público MIT, squash/borrado de ramas, secret scanning/push protection, ruleset 25305930 activo sin bypass y verify-required estricto de Actions 15368 tras primer reporte del PR. Defaults de GitHub registrados en AUTONOMY; no modificarlos después para destrabar.
Barrido sin identificadores del origen fuera de PROVENANCE; inventario sin cambios de versiones/scopes/resolución; kit fuera de Git. Ancla propia publicada, rama y PR únicos. El ancla perdió modos ejecutables por importación Windows: A restaura ambos y CI del candidato los probó; main conserva el bootstrap hasta el merge revisado, sin reescribirlo.
Cleanup de starter-a-gate y starter-e2e-a-gate-20261017: contenedores/redes/volúmenes 0/0/0. Logs/reportes locales ignorados; ningún stack ajeno ni Google real operado.
Sesión implementer: Codex desktop/API, familia declarada GPT-6; identificador runtime exacto y esfuerzo efectivo no expuestos. Sin atribuir Sol/high, delegar ni abrir otra sesión/modelo.
Después de E MERGED y validada, el único prompt final será el de constancia documental definido en PROVENANCE. No se adelanta al cierre de A ni se emite recepción de un ejecutor de producto.
