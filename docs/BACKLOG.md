# Cola del starter

Próxima acción: cerrar [T-006](tasks/T-006-adoption-handoff.md) con veredicto/CI exactos y merge elegible del mismo PR. Tras MERGED vuelve al dueño para adopción propia en otra sesión; no hay otra tarea predefinida ready aquí. Estado y prompt en [STATUS](STATUS.md).

## En vuelo
| Tarea | Estado | Resultado |
|---|---|---|
| [T-006](tasks/T-006-adoption-handoff.md) | mergeable | R1 favorable, gate conservado; pendiente veredicto/CI del HEAD final y MERGED confirmado |

## Hechas recientes
- [T-005](tasks/T-005-generic-baseline.md): MERGED confirmado y conciliado en T-006.

## Por refinar
- Implementar despliegue compartido después de elegir proveedor/región y aprobar el contrato de [DEPLOYMENT](DEPLOYMENT.md).
- Optimizar las etapas dominantes del FULL con mediciones; conservar aislamiento, negativos y cleanup.
- Endurecer validación de estados en listas del tablero y conteos repetidos de HANDOFF.
- Normalizar aliases de ruta TEMP en el CLI y limpiar imágenes efímeras propias sin afectar recursos ajenos.
- Evaluar cierre forzado por callback OIDC fallido con sesión previa antes de producción.
