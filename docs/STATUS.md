# Estado del starter

## Próxima acción
| Campo | Valor |
|---|---|
| Tarea y contrato | [T-003](tasks/T-003-initializer-beta.md) · D; [S-004 v1](specs/S-004-initializer-beta.md) |
| Estado | in_progress |
| Acción actual | D1/D2/D3 y copia compilable verdes; D4 FULL final pendiente/en ejecución |
| Rama / PR | chore/t-003-initializer-beta · PR #4 draft |
| Base | main, 193f5a763af9ae61726daf20d30ae4ce8d5ce59d |
| Fuentes probadas | Copia compilable y dirigidos D verdes; checkpoint FULL en T-003 |
| Siguiente sesión | Retomar checkpoint de T-003; revisión independiente solo tras cierre técnico |
| Continuidad | POR_SESION |

A/B/C done con merge comprobado; D in_progress, E draft dependiente de D MERGED. [Mapa de cierre](ROADMAP.md#cierre-mínimo-para-mvp--revisión-del-dueño-2026-10-18). HANDOFF del starter: 0/22 verificados, NO_LISTO; sin beta/template/adopción validada.

### Prompt de la siguiente sesión
```text
Retomar D/T-003 como implementer en esta raíz y rama chore/t-003-initializer-beta. Leer AGENTS, STATUS y checkpoint T-003; comprobar HEAD/tracking/remoto, main 193f5a763af9ae61726daf20d30ae4ce8d5ce59d y único PR propio D. Preservar cambios de esta tarea. Si divergen estado/base/PR, no mutar y devolver checkpoint. Continuar D1→D4 según S-004 v1 sin replanificar, delegar, autorrevisar ni mergear. FULL propio al cerrar fuentes técnicas, CI liviana y revisión posterior independiente; beta/template solo después de D MERGED. HANDOFF0/22 NO_LISTO; E draft y continuidad final solo PROVENANCE.
```

## Checkpoint vigente
[T-003 · checkpoint antes del FULL](tasks/T-003-initializer-beta.md#checkpoint-antes-del-full-local-final--2026-10-18). Código/documentos locales de D, PR#4 draft, último HEAD publicado92ea282d32a7cb55decb9393f3cb79e0966b2d38 y base193f5a763af9ae61726daf20d30ae4ce8d5ce59d. Dirigidos propios/copia compilable verdes; FULL final con fuentes congeladas, log/huellas y cleanup en ese checkpoint. No editar fuentes/Bash mientras esté ejecutándose. Publicar código únicamente al pasar el gate; luego cierre documental/CI y revisión independiente. C conserva su cierre/evidencia, sin repetir su FULL ni otorgar crédito global a HANDOFF.
