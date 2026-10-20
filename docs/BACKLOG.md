# Cola del starter

Próxima acción: cierre del mismo PR de T-005 con veredicto/CI propios y merge elegible. Tras MERGED vuelve a frontera/dueño; no hay otra tarea predefinida ready. Estado y prompt en [STATUS](STATUS.md).

## En vuelo
| Tarea | Estado | Resultado |
|---|---|---|
| [T-005](tasks/T-005-generic-baseline.md) | mergeable | R1/R2 revisados favorablemente; pendiente cierre con HEAD/base/CI exactos y MERGED confirmado |

## Por refinar
- Implementar despliegue compartido después de elegir proveedor/región y aprobar el contrato de [DEPLOYMENT](DEPLOYMENT.md).
- Optimizar las etapas dominantes del FULL con mediciones; conservar aislamiento, negativos y cleanup.
- Endurecer validación de estados en listas del tablero y conteos repetidos de HANDOFF.
- Normalizar aliases de ruta TEMP en el CLI y limpiar imágenes efímeras propias sin afectar recursos ajenos.
- Evaluar cierre forzado por callback OIDC fallido con sesión previa antes de producción.
