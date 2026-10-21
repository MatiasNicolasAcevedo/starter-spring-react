# Aceptación de una aplicación

- **Veredicto:** `NO_LISTO` — 0/22 verificados.
- **Continuidad:** `POR_SESION`.
- **Merge:** `AUTOMATICO_ELEGIBLE` solo para el mantenimiento autorizado; cada copia decide su modalidad.

Checklist reusable: describe lo que debe comprobar cada adopción; no es una bitácora del starter ni acredita pruebas por copiar código. Resultados de mantenimiento en su tarea/PR. STARTER_VALIDADO exige 22/22, al menos una tarea M0 y todas las tareas M0 done; M1 draft no invalida el cierre de adopción. Producto se acepta por sus propios contratos. [Definición y traspaso](ORCHESTRATION.md).

| ID | Criterio | Estado | Evidencia heredada / propia requerida | Responsable / condición de revalidación |
|---|---|---|---|---|
| C-01 | Contexto propio aceptado: objetivo, usuarios, flujos, exclusiones y decisiones | pendiente | Verificar en la adopción propia | Dueño y revisor |
| C-02 | Spec del primer flujo o contrato de infraestructura vigente, aceptación y pruebas trazadas | pendiente | Verificar en la adopción propia | Dueño y revisor |
| C-03 | Arquitectura, contratos API/datos y versiones efectivos; auth y persistencia decididas | pendiente | Verificar en la adopción propia | Dueño y revisor |
| E-01 | Raíz, modelo/herramienta/esfuerzo y ejecutor siguiente; inventario [TOOLS](../.junie/TOOLS.md) con naturaleza y declarado/expuesto-listado/verificado, fecha, superficie y límites; mínimo por función comprobado temprano con evidencia propia antes de revisión, sin exigir catálogo opcional | pendiente | Verificar en la adopción propia | Dueño y revisor |
| E-02 | Wrappers/locks/imágenes inventariados; instalar, levantar, probar, detener y retomar desde copia limpia | pendiente | Verificar en la adopción propia | Dueño y revisor |
| E-03 | Ejemplos ficticios, variables/URLs/puertos claros; configuración real fuera de Git/builds | pendiente | Verificar en la adopción propia | Dueño y revisor |
| B-01 | db/server/client conectados; UI/API/DB reales, restart/rebuild/retoma conservan datos propios | pendiente | Verificar en la adopción propia | Dueño y revisor |
| B-02 | PostgreSQL 18, Flyway sobre DB vacía y validación JPA/Testcontainers, aislamiento de datos | pendiente | Verificar en la adopción propia | Dueño y revisor |
| B-03 | Patrones reales API/DTO/validación/errores, router/tema/HTTP/Query/formularios y estados | pendiente | Verificar en la adopción propia | Dueño y revisor |
| S-01 | OIDC local real, callback/sesión/identidad y recarga; Google real con estado explícito | pendiente | Verificar en la adopción propia | Dueño y revisor |
| S-02 | 401/403, propiedad/permisos, CSRF y logout/cache con dos identidades; perfiles separados | pendiente | Verificar en la adopción propia | Dueño y revisor |
| S-03 | Google real: smoke del dueño o pendiente externo explícito, responsable y acción sin secretos | pendiente | Verificar en la adopción propia | Dueño y revisor |
| V-01 | Unitarios/slices, PostgreSQL IT, componentes, typecheck/lint/formato/build reales | pendiente | Verificar en la adopción propia | Dueño y revisor |
| V-02 | Playwright desktop/móvil con API/DB/OIDC reales, errores, saneamiento y cleanup labels cero | pendiente | Verificar en la adopción propia | Dueño y revisor |
| V-03 | FULL local y CI requerida del HEAD publicado verdes, sin omitidos interpretados como éxito | pendiente | Verificar en la adopción propia | Dueño y revisor |
| G-01 | Git propio, licencia, kit excluido, repo y ruleset efectivos propios; copia sin kit funciona | pendiente | Verificar en la adopción propia | Dueño y revisor |
| G-02 | Autonomía propia, capacidades Git/PR/CI y continuidad/merge comprobadas | pendiente | Verificar en la adopción propia | Dueño y revisor |
| G-03 | PRs revisados en sesión distinta, checks y merges confirmados sobre SHA/base | pendiente | Verificar en la adopción propia | Dueño y revisor |
| H-01 | AGENTS/CLAUDE/docs/protocolos coherentes y autosuficientes, sin historia ni kit obligatorio | pendiente | Verificar en la adopción propia | Dueño y revisor |
| H-02 | Adopción limpia con contexto distinto y primera tarea derivada, sin evidencia por herencia | pendiente | Verificar en la adopción propia | Dueño y revisor |
| H-03 | Checkpoint, pendientes externos y único prompt vigente con precondición, continuidad explícita | pendiente | Verificar en la adopción propia | Dueño y revisor |
| O-01 | Swagger opt-in apagado por defecto, HTTP loopback/GET/api/docs; UI/JSON/Try it out y negativos nginx/Vite | pendiente | Verificar en la adopción propia | Dueño y revisor |

## Pendientes externos
Google real y producción requieren al dueño. La checklist solo se actualiza con evidencia propia del criterio afectado. El progreso de una tarea vive en su checkpoint; STATUS conserva acción y prompt, BACKLOG conserva la cola.
