# Tablero vivo

Próxima acción: T-002 (C), R2 favorable sin bloqueantes; completar CI liviana/veredicto final y merge elegible en esta sesión. Tras MERGED, conciliación/corte de C en sesión nueva. Mapa de cierre en ROADMAP; único prompt ejecutable en STATUS.

## En vuelo
| Tarea | Estado | Salida |
|---|---|---|
| [T-002](tasks/T-002-reference-security.md) | mergeable | R2 favorable, R1-01 resuelto; FULL local corroborado, dirigidos18+17/42 y negativos efectivos; CI/veredicto/merge finales en PR #3 |

## Listas
Ninguna.

## Bloqueadas
D/E permanecen draft, dependientes del merge y conciliación de su predecesora; ver ROADMAP. C mergeable tras R2; D espera su merge.

## Por refinar
- Automatizaciones semanales, dispatcher, atestaciones de pruebas y optimizaciones de caché no medidas: fuera del cierre mínimo para MVP. Reconsiderar solo ante necesidad concreta; política de validación local ya decidida en TESTING.
- En D, integrar/pulir el formulario de contexto y consolidar adopción desde GitHub template/guía de crecimiento; en E, probar todo el recorrido sin kit. Objetivo aceptado en PROJECT_CONTEXT y salidas registradas en T-003/T-004; permanecen draft, sin ampliar B.
- En una tarea futura, evaluar endurecimiento del callback fallido con sesión previa: cerrar replay invalida la sesión y permite logout forzado cross-site. No reabrir auth dentro de A o B.

## Hechas recientes
| Tarea | Estado | Salida |
|---|---|---|
| [T-001](tasks/T-001-local-stack.md) | done | B: PR #2 MERGED, squash/CI FULL final PR y main comprobados; evidencia canónica en tarea |
| [T-000](tasks/T-000-starter-extraction.md) | done | A: PR #1 MERGED, squash 47184f725f8a89528acac0aa3e7383f2334258de; FULL PR 39044690435 y main 39045270616 verificadas success, seis jobs verdes |

Objetivo y estado de A…E: ROADMAP. Única tarea activa T-002 mergeable; revisión R2 y evidencia propia en T-002, confirmación final en PR #3. Cobertura y logout en vuelo de S-003 C-AC-07/09 comprobados en C, sin acreditar aceptación global. HANDOFF 0/22 NO_LISTO; evidencia de A/B en T-000/T-001.
