# Tablero vivo

Próxima acción: revisión independiente de T-003 (D) in_review/S-004 v1 approved, único PR#4. C done, cierre comprobado en T-002; mapa de cierre en ROADMAP y único prompt ejecutable en STATUS.

## En vuelo
| Tarea | Estado | Salida |
|---|---|---|
| [T-003](tasks/T-003-initializer-beta.md) | in_review | Inicializador/formulario/guía, copia compilable y FULL propios verdes, código publicado; CI liviana final/revisión independiente antes del merge y beta |

## Listas
Ninguna otra tarea ready.

## Bloqueadas
E/T-004 permanece draft hasta D MERGED y conciliada; ver ROADMAP. D espera revisión independiente y merge; beta/template solo después.

## Por refinar
- Automatizaciones semanales, dispatcher, atestaciones de pruebas y optimizaciones de caché no medidas: fuera del cierre mínimo para MVP. Reconsiderar solo ante necesidad concreta; política de validación local ya decidida en TESTING.
- E: ensayo literal de adopción sin kit, con otro contexto ficticio y retoma persistente, pendiente de D MERGED. Salida aceptada en T-004/PROJECT_CONTEXT; no refinar ni implementar aquí.
- En una tarea futura, evaluar endurecimiento del callback fallido con sesión previa: cerrar replay invalida la sesión y permite logout forzado cross-site. No reabrir auth dentro de A o B.

## Hechas recientes
| Tarea | Estado | Salida |
|---|---|---|
| [T-002](tasks/T-002-reference-security.md) | done | C: PR #3 MERGED, APROBADO R2/CI liviana final exactos y squash idéntico al árbol revisado; evidencia canónica en tarea |
| [T-001](tasks/T-001-local-stack.md) | done | B: PR #2 MERGED, squash/CI FULL final PR y main comprobados; evidencia canónica en tarea |
| [T-000](tasks/T-000-starter-extraction.md) | done | A: PR #1 MERGED, squash 47184f725f8a89528acac0aa3e7383f2334258de; FULL PR 39044690435 y main 39045270616 verificadas success, seis jobs verdes |

Objetivo y estado de A…E: ROADMAP. Única tarea activa T-003. Cobertura y logout en vuelo de S-003 C-AC-07/09 comprobados en C, sin acreditar aceptación global ni D/E. HANDOFF 0/22 NO_LISTO; evidencia propia de A/B/C en sus tareas.
