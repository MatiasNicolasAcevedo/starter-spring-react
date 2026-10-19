# Estado del starter

## Próxima acción
| Campo | Valor |
|---|---|
| Tarea y contrato | [T-003](tasks/T-003-initializer-beta.md) · D; [S-004 v1](specs/S-004-initializer-beta.md) |
| Estado | mergeable |
| Acción actual | R1 favorable sin bloqueantes; CI liviana/veredicto final y merge elegible en esta sesión |
| Rama / PR | chore/t-003-initializer-beta · PR #4; consultar HEAD/veredicto/CI/merge exactos allí |
| Base | main, 193f5a763af9ae61726daf20d30ae4ce8d5ce59d |
| Fuentes probadas | Commit técnico 361a91651c3a749d41f48617c51b2ca00f81b422; FULL, huellas y cleanup en T-003 |
| Siguiente sesión | Conciliación/corte de D solo tras PR #4 MERGED y comprobación beta/template |
| Continuidad | POR_SESION |

A/B/C done con merge comprobado; D mergeable, E draft dependiente de D MERGED. [Mapa de cierre](ROADMAP.md#cierre-mínimo-para-mvp--revisión-del-dueño-2026-10-18). HANDOFF del starter: 0/22 verificados, NO_LISTO; beta/template condicionados al merge y comprobación en PR#4; adopción pendiente.

### Prompt de la siguiente sesión
```text
Conciliar cierre/corte de D/T-003 en sesión nueva, raíz C:/D/matias/proyectos-ia/starter-spring-react. Leer AGENTS raíz/server/client, PROJECT_CONTEXT, STATUS/BACKLOG/HANDOFF/ROADMAP, AUTONOMY, TESTING/SETUP, T-003/S-004 v1 y PROVENANCE. Precondición observable: PR#4 propio MERGED, APROBADO R1 con HEAD/base exactos y verify-required liviano success vigente, squash/árbol idéntico al revisado, main local/tracking/remoto coincidentes y árbol limpio; ningún PR abierto, isTemplate=true comprobado en este mismo repo y límites beta visibles en S-004/README/PR; T-003 documentalmente mergeable y T-004 draft. Si no coincide, sin cambios y devolver checkpoint vigente; si falta merge, retomar solo merger con su veredicto exacto y AUTONOMY, sin repetir revisión/FULL por rutina. Registrar rol/modelo/herramienta/esfuerzo reales e impacto. Conciliar D done/tarea/STATUS/BACKLOG/HANDOFF/ROADMAP con evidencia canónica del PR en el primer avance autorizado de la rama siguiente; no commits en main ni rama mergeada ni PR documental separado. Mantener HANDOFF0/22 NO_LISTO y no atribuir adopción E por herencia. Este prompt no autoriza implementar E; su ensayo requiere contrato/acción propios. No delegar, abrir sesiones/modelos, cambiar protecciones, operar Google real/recursos ajenos/origen ni retirar kit. Única continuidad posterior a E MERGED y validada: PROVENANCE.
```

## Checkpoint vigente
[R1 de T-003](tasks/T-003-initializer-beta.md#revisión-independiente-r1--2026-10-19): favorable sin bloqueantes, FULL propio del implementer corroborado con235 fuentes técnicas idénticas; dirigidos94/94 y cinco mutantes críticos detectados, cleanup0/0/0. Solo transición documental de tarea/STATUS/BACKLOG. SHA final, CI liviana exacta, APROBADO y eventual MERGED/squash/template se registran en PR#4 sin commits después del veredicto. Si no se completa merge, retomar exclusivamente merger sobre ese checkpoint. No R2 automático ni FULL por cierre Markdown. Conciliación documental/corte de D posterior al MERGED conforme merger; no iniciar E en revisión. HANDOFF0/22 NO_LISTO, adopción pendiente y continuidad final exclusivamente PROVENANCE.
