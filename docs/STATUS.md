# Estado del starter

## Próxima acción
| Campo | Valor |
|---|---|
| Tarea y contrato | [T-003](tasks/T-003-initializer-beta.md) · D; [S-004 v1](specs/S-004-initializer-beta.md) |
| Estado | ready |
| Acción actual | Refinamiento publicado; implementar D1 en sesión nueva, sin otra planificación |
| Rama / PR | chore/t-003-initializer-beta · sin PR; este avance pertenece a la futura entrega D |
| Base | main, 193f5a763af9ae61726daf20d30ae4ce8d5ce59d |
| Fuentes probadas | Evidencia C conservada en T-002; ninguna implementación/prueba D ejecutada |
| Siguiente sesión | implementer nuevo: D1 → D2 → D3 → D4 de T-003, una tarea/PR |
| Continuidad | POR_SESION |

A/B/C done con merge comprobado; D ready, E draft dependiente de D MERGED. [Mapa de cierre](ROADMAP.md#cierre-mínimo-para-mvp--revisión-del-dueño-2026-10-18). HANDOFF del starter: 0/22 verificados, NO_LISTO; sin beta/template/adopción validada.

### Prompt de la siguiente sesión
```text
Implementar D/T-003 en sesión nueva implementer, raíz C:\D\matias\proyectos-ia\starter-spring-react. Leer AGENTS raíz/server/client, PROJECT_CONTEXT, STATUS/BACKLOG/HANDOFF/ROADMAP, docs/agents/implementer.md, TESTING/SETUP, T-003 y S-004 v1. Precondición observable: rama exacta chore/t-003-initializer-beta publicada, HEAD local/tracking/remoto coincidentes, árbol limpio, diff contra main solo de planificación/cierre C; main local/tracking/remoto en 193f5a763af9ae61726daf20d30ae4ce8d5ce59d, PR#3 MERGED, T-002 done, T-003 ready/S-004 v1 approved, T-004 draft, ningún PR abierto ni otra tarea activa. Si no coincide, sin cambios y devolver checkpoint vigente. Verificar SHA real del primer commit con git log y remoto; no exigir CI automática de main/rama sin PR ni otro FULL de C. Registrar solo rol/modelo/herramienta/esfuerzo realmente expuestos e impacto. Ejecutar D1→D2→D3→D4 sin replanificar ready: lista explícita/guardias/negativos, inicializador dry-run por defecto/apply/idempotencia, copia compilable sin Git/kit/ignorados, reinicio T-000/contexto propio, formulario breve y guía canónica hasta primer flujo. Respetar S-004/decisión del dueño 2026-10-18: D mínima, una tarea/PR, sin dispatcher/automatizaciones/infra nueva ni E. Iterar con dirigidos y negativos críticos; checkpoint antes de operaciones largas, FULL local propio al cerrar fuentes técnicas, CI liviana sobre HEAD/base publicados y reviewer independiente posterior según TESTING. No autorrevisar/mergear; beta/template del mismo repo solo tras cierre y merge D comprobados. No delegar, abrir sesiones/modelos, modificar protecciones ni operar Google real/recursos ajenos/origen. HANDOFF0/22 NO_LISTO; sin validación de D/E por herencia, continuidad posterior exclusivamente en PROVENANCE.
```

## Checkpoint vigente
[Cierre comprobado de C](tasks/T-002-reference-security.md#reconciliación-posterior-al-merge--2026-10-18) y [corte de ciclo](ROADMAP.md#revisión-de-ciclo--cierre-de-c--2026-10-18). Primer avance documental en rama D desde el squash de C; obtener SHA publicado con `git log -1`/tracking/remoto, sin SHA futuro inventado. [T-003](tasks/T-003-initializer-beta.md#checkpoint-planner--2026-10-18) ready/S-004 v1 approved, implementación y pruebas D pendientes, sin PR separado de planificación. Validación del avance: docs-check, regresiones de herramientas/documentación, diff-check y clasificación DOCS_ONLY; sin nuevo FULL ni recursos de ensayo levantados. Si cambia la precondición, conservar este checkpoint y reconciliar antes de mutar.
