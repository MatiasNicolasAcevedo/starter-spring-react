# Tablero vivo

Próxima acción: T-002 (C), reviewer R2 nuevo e independiente sobre fuentes publicadas y FULL local final verde; dirigidos/negativos, sin duplicar FULL por rutina. Mapa de cierre en ROADMAP; único prompt ejecutable en STATUS.

## En vuelo
| Tarea | Estado | Salida |
|---|---|---|
| [T-002](tasks/T-002-reference-security.md) | in_review | Correcciones y simplificación publicadas; client133/133, herramientas64/64 y único FULL final verdes; R2/merge pendientes, CI exacta en PR |

## Listas
Ninguna.

## Bloqueadas
D/E permanecen draft, dependientes del merge de su predecesora; ver ROADMAP. C en revisión R2; D espera su merge.

## Por refinar
- ReferenceSession queda resuelto dentro de T-002 con diagnóstico/experimento causal y selector mínimo; evidencia y límites en la tarea. R2 comprueba dirigidos/negativos junto a R1-01, sin nueva tarea ni otro PR.
- Automatizaciones semanales, dispatcher, atestaciones de pruebas y optimizaciones de caché no medidas: fuera del cierre mínimo para MVP. Reconsiderar solo ante necesidad concreta; política de validación local ya decidida en TESTING.
- En D, integrar/pulir el formulario de contexto y consolidar adopción desde GitHub template/guía de crecimiento; en E, probar todo el recorrido sin kit. Objetivo aceptado en PROJECT_CONTEXT y salidas registradas en T-003/T-004; permanecen draft, sin ampliar B.
- En una tarea futura, evaluar endurecimiento del callback fallido con sesión previa: cerrar replay invalida la sesión y permite logout forzado cross-site. No reabrir auth dentro de A o B.

## Hechas recientes
| Tarea | Estado | Salida |
|---|---|---|
| [T-001](tasks/T-001-local-stack.md) | done | B: PR #2 MERGED, squash/CI FULL final PR y main comprobados; evidencia canónica en tarea |
| [T-000](tasks/T-000-starter-extraction.md) | done | A: PR #1 MERGED, squash 47184f725f8a89528acac0aa3e7383f2334258de; FULL PR 39044690435 y main 39045270616 verificadas success, seis jobs verdes |

Objetivo y estado de A…E: ROADMAP. Única tarea activa T-002 in_review; R1 y entrega para R2 con evidencia propia en T-002. Cobertura y logout en vuelo contratados en S-003 C-AC-07/09. HANDOFF 0/22 NO_LISTO; evidencia de A/B en T-000/T-001.
