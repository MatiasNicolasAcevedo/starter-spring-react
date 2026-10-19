# Estado del starter

## Próxima acción
| Campo | Valor |
|---|---|
| Tarea y contrato | [T-003](tasks/T-003-initializer-beta.md) · D; [S-004 v1](specs/S-004-initializer-beta.md) |
| Estado | in_progress |
| Acción actual | Implementer activo: D1→D4 secuenciales según T-003 |
| Rama / PR | chore/t-003-initializer-beta · sin PR; este avance pertenece a la futura entrega D |
| Base | main, 193f5a763af9ae61726daf20d30ae4ce8d5ce59d |
| Fuentes probadas | Evidencia C conservada en T-002; ninguna implementación/prueba D ejecutada |
| Siguiente sesión | Retomar checkpoint de T-003; revisión independiente solo tras cierre técnico |
| Continuidad | POR_SESION |

A/B/C done con merge comprobado; D in_progress, E draft dependiente de D MERGED. [Mapa de cierre](ROADMAP.md#cierre-mínimo-para-mvp--revisión-del-dueño-2026-10-18). HANDOFF del starter: 0/22 verificados, NO_LISTO; sin beta/template/adopción validada.

### Prompt de la siguiente sesión
```text
Retomar D/T-003 como implementer en esta raíz y rama chore/t-003-initializer-beta. Leer AGENTS, STATUS y checkpoint T-003; comprobar HEAD/tracking/remoto, main 193f5a763af9ae61726daf20d30ae4ce8d5ce59d y único PR propio D. Preservar cambios de esta tarea. Si divergen estado/base/PR, no mutar y devolver checkpoint. Continuar D1→D4 según S-004 v1 sin replanificar, delegar, autorrevisar ni mergear. FULL propio al cerrar fuentes técnicas, CI liviana y revisión posterior independiente; beta/template solo después de D MERGED. HANDOFF0/22 NO_LISTO; E draft y continuidad final solo PROVENANCE.
```

## Checkpoint vigente
[Cierre comprobado de C](tasks/T-002-reference-security.md#reconciliación-posterior-al-merge--2026-10-18) y [corte de ciclo](ROADMAP.md#revisión-de-ciclo--cierre-de-c--2026-10-18). Primer avance documental en rama D desde el squash de C; obtener SHA publicado con `git log -1`/tracking/remoto, sin SHA futuro inventado. [T-003](tasks/T-003-initializer-beta.md#checkpoint-planner--2026-10-18) ready/S-004 v1 approved, implementación y pruebas D pendientes, sin PR separado de planificación. Validación del avance: docs-check, regresiones de herramientas/documentación, diff-check y clasificación DOCS_ONLY; sin nuevo FULL ni recursos de ensayo levantados. Si cambia la precondición, conservar este checkpoint y reconciliar antes de mutar.
