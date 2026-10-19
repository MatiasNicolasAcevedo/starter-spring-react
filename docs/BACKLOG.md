# Tablero vivo

Próxima acción: T-003 (D) ready/S-004 v1 approved; implementar D1 en sesión nueva sobre la rama publicada, sin replanificar. C done, cierre comprobado en T-002; mapa de cierre en ROADMAP y único prompt ejecutable en STATUS.

## En vuelo
Ninguna implementación ni PR abiertos; la rama D contiene su primer avance de planificación.

## Listas
| Tarea | Estado | Salida |
|---|---|---|
| [T-003](tasks/T-003-initializer-beta.md) | ready | S-004 v1: inicializador seguro, formulario y guía breve, copia compilable; D1→D4 secuenciales. Implementación/pruebas/beta pendientes |

## Bloqueadas
E/T-004 permanece draft hasta D MERGED y conciliada; ver ROADMAP. Ningún bloqueo para empezar D contratada.

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

Objetivo y estado de A…E: ROADMAP. Única siguiente tarea T-003 ready; no hay implementación activa. Cobertura y logout en vuelo de S-003 C-AC-07/09 comprobados en C, sin acreditar aceptación global ni D/E. HANDOFF 0/22 NO_LISTO; evidencia propia de A/B/C en sus tareas.
