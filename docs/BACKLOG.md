# Tablero vivo

Próxima acción: implementar T-002 (C) en sesión nueva sobre su planificación publicada, conforme S-003 v1. B conciliada done con PR/main FULL verdes. Precondición y único prompt en STATUS.

## En vuelo
Ninguna.

## Listas
| Tarea | Estado | Salida |
|---|---|---|
| [T-002](tasks/T-002-reference-security.md) | ready | C: S-003 v1 approved, C1→C4 secuenciales; planificación publicada sin PR ni implementación |

## Bloqueadas
D/E permanecen draft, dependientes del merge de su predecesora; ver ROADMAP. C lista para implementar; no se habilita D por publicar su plan.

## Por refinar
- Eficiencia evaluada en el [corte de B](ROADMAP.md#revisión-de-ciclo--cierre-de-b--2026-10-18): mantener pendiente medición saneada duración/exit por fase y costo de builds/cachés; después evaluar entrada compartida para señal dirigida, solo con equivalencia demostrada y negativo real/FULL/CI intactos. [Observación y tiempos](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/2#issuecomment-6244875257); sin ahorro ni optimización acreditados. Fuera de T-002; no modificar suites, aceptación, umbrales, retries o deadlines por esta anotación.
- En D, integrar/pulir el formulario de contexto y consolidar adopción desde GitHub template/guía de crecimiento; en E, probar todo el recorrido sin kit. Objetivo aceptado en PROJECT_CONTEXT y salidas registradas en T-003/T-004; permanecen draft, sin ampliar B.
- En una tarea futura, evaluar endurecimiento del callback fallido con sesión previa: cerrar replay invalida la sesión y permite logout forzado cross-site. No reabrir auth dentro de A o B.

## Hechas recientes
| Tarea | Estado | Salida |
|---|---|---|
| [T-001](tasks/T-001-local-stack.md) | done | B: PR #2 MERGED, squash/CI FULL final PR y main comprobados; evidencia canónica en tarea |
| [T-000](tasks/T-000-starter-extraction.md) | done | A: PR #1 MERGED, squash 47184f725f8a89528acac0aa3e7383f2334258de; FULL PR 39044690435 y main 39045270616 verificadas success, seis jobs verdes |

Objetivo y estado de A…E: ROADMAP. Única tarea ready T-002, sin PR; cobertura y logout en vuelo ya contratados en S-003 C-AC-07/09. HANDOFF 0/22 NO_LISTO; evidencia de A/B en T-000/T-001.
