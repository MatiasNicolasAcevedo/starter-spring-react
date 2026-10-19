# Tablero vivo

Próxima acción: ejecutar T-004 (E) ready en sesión implementadora nueva; contrato propio en la tarea. D done/template beta comprobados en T-003 y PR#4; mapa de cierre en ROADMAP y único prompt ejecutable en STATUS.

## En vuelo
Ninguna implementación ni PR abiertos.

## Listas
| Tarea | Estado | Salida |
|---|---|---|
| [T-004](tasks/T-004-clean-adoption.md) | ready | E1→E4: ensayo limpio con contexto distinto, recorrido literal/aislamiento/retoma, FULL propio y evidencia final; ejecución pendiente |

## Bloqueadas
Ninguna. Google real permanece pendiente externo del dueño; no bloquea el ensayo local E.

## Por refinar
- Automatizaciones semanales, dispatcher, atestaciones de pruebas y optimizaciones de caché no medidas: fuera del cierre mínimo para MVP. Reconsiderar solo ante necesidad concreta; política de validación local ya decidida en TESTING.
- En una tarea futura, evaluar endurecimiento del callback fallido con sesión previa: cerrar replay invalida la sesión y permite logout forzado cross-site. No reabrir auth dentro de A o B.

## Hechas recientes
| Tarea | Estado | Salida |
|---|---|---|
| [T-003](tasks/T-003-initializer-beta.md) | done | D: PR#4 MERGED, APROBADO R1/CI liviana exactos, squash idéntico e isTemplate=true; template beta limitado, adopción E pendiente |
| [T-002](tasks/T-002-reference-security.md) | done | C: PR #3 MERGED, APROBADO R2/CI liviana final exactos y squash idéntico al árbol revisado; evidencia canónica en tarea |
| [T-001](tasks/T-001-local-stack.md) | done | B: PR #2 MERGED, squash/CI FULL final PR y main comprobados; evidencia canónica en tarea |
| [T-000](tasks/T-000-starter-extraction.md) | done | A: PR #1 MERGED, squash 47184f725f8a89528acac0aa3e7383f2334258de; FULL PR 39044690435 y main 39045270616 verificadas success, seis jobs verdes |

Objetivo y estado de A…E: ROADMAP. Única tarea lista T-004. Cobertura y logout en vuelo de S-003 C-AC-07/09 comprobados en C, sin acreditar aceptación global ni E. HANDOFF 0/22 NO_LISTO; evidencia propia de A/B/C/D en sus tareas.
