# Tablero vivo

Próxima acción: T-001, revisión de ciclo por cierre de A y refinamiento exclusivo de B como planner; sin implementación en esta sesión.

## En vuelo
Ninguna implementación ni PR activo.

## Listas
Ninguna hasta completar el refinamiento de B.

## Bloqueadas
B pendiente de refinamiento; C…E permanecen draft con dependencia secuencial; ver ROADMAP y sus contratos en tasks/.

## Por refinar
- T-001/B: dividir lifecycle persistente, readiness DB/proxies, UI conectada y ensayos; mantener un solo contrato/PR activo.
- En C, fijar al menos 80% de líneas y 70% de ramas para dominio/servicios/hooks de referencia, sin reducir suites ni umbrales heredados.
- En C, cubrir logout con mutación de referencia en vuelo; invalidación evita repoblar cache de otra identidad.
- En una tarea futura, evaluar endurecimiento del callback fallido con sesión previa: cerrar replay invalida la sesión y permite logout forzado cross-site. No reabrir auth dentro de A o B.

## Hechas recientes
| Tarea | Estado | Salida |
|---|---|---|
| [T-000](tasks/T-000-starter-extraction.md) | done | A: PR #1 MERGED, squash 47184f725f8a89528acac0aa3e7383f2334258de; FULL PR 39044690435 y main 39045270616 verificadas success, seis jobs verdes |
