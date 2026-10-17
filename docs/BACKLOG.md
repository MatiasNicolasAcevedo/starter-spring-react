# Tablero vivo

Próxima acción: T-001 ready, implementar exclusivamente B1 → B2 → B3 → B4 en sesión nueva sobre la planificación publicada de chore/t-001-local-stack, después de verificar STATUS.

## En vuelo
Ninguna implementación ni PR activo.

## Listas
| Tarea | Estado | Salida |
|---|---|---|
| [T-001](tasks/T-001-local-stack.md) | ready | B refinada con S-002 v1; lifecycle persistente → readiness DB/proxies → UI → integración/FULL; implementación pendiente, sin PR todavía |

## Bloqueadas
C…E permanecen draft con dependencia secuencial; ver ROADMAP y sus contratos en tasks/. Ninguna se activa por publicar el plan de B.

## Por refinar
- En C, fijar al menos 80% de líneas y 70% de ramas para dominio/servicios/hooks de referencia, sin reducir suites ni umbrales heredados.
- En C, cubrir logout con mutación de referencia en vuelo; invalidación evita repoblar cache de otra identidad.
- En una tarea futura, evaluar endurecimiento del callback fallido con sesión previa: cerrar replay invalida la sesión y permite logout forzado cross-site. No reabrir auth dentro de A o B.

## Hechas recientes
| Tarea | Estado | Salida |
|---|---|---|
| [T-000](tasks/T-000-starter-extraction.md) | done | A: PR #1 MERGED, squash 47184f725f8a89528acac0aa3e7383f2334258de; FULL PR 39044690435 y main 39045270616 verificadas success, seis jobs verdes |

Objetivo y estado de A…E: ROADMAP. Única tarea ready T-001; siguiente sesión implementa B con documentación mínima útil según AGENTS, sin nuevo ciclo de planificación. HANDOFF 0/22 NO_LISTO; detalle/evidencia en T-000/T-001.
