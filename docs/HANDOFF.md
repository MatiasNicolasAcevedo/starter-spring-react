# HANDOFF · Criterios de la base reusable

Checklist propia de 22 criterios. Las reglas y suites del snapshot son heredadas; su evidencia no verifica el starter ni una aplicación futura. Cada producto vuelve a evaluar todos los criterios desde su contexto.

- **Veredicto:** `NO_LISTO` — 0/22 verificados.
- **Continuidad:** `POR_SESION`.
- **Merge:** `AUTOMATICO_ELEGIBLE` solo con AUTONOMY/checks/veredicto independiente vigentes; no autoriza merge propio.

## Checklist del starter
| ID | Criterio | Estado | Evidencia heredada / propia requerida | Responsable / condición de revalidación |
|---|---|---|---|---|
| C-01 | Contexto propio aceptado: objetivo, usuarios, flujos, exclusiones y decisiones | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| C-02 | Spec del primer flujo o contrato de infraestructura vigente, aceptación y pruebas trazadas | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| C-03 | Arquitectura, contratos API/datos y versiones efectivos; auth y persistencia decididas | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| E-01 | Raíz, herramientas, modelo/herramienta/esfuerzo reales y ejecutor siguiente comprobados | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| E-02 | Wrappers/locks/imágenes inventariados; instalar, levantar, probar, detener y retomar desde copia limpia | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| E-03 | Ejemplos ficticios, variables/URLs/puertos claros; configuración real fuera de Git/builds | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| B-01 | db/server/client conectados; UI/API/DB reales, restart/rebuild/retoma conservan datos propios | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| B-02 | PostgreSQL 18, Flyway sobre DB vacía y validación JPA/Testcontainers, aislamiento de datos | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| B-03 | Patrones reales API/DTO/validación/errores, router/tema/HTTP/Query/formularios y estados | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| S-01 | OIDC local real, callback/sesión/identidad y recarga; Google real con estado explícito | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| S-02 | 401/403, propiedad/permisos, CSRF y logout/cache con dos identidades; perfiles separados | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| S-03 | Google real: smoke del dueño o pendiente externo explícito, responsable y acción sin secretos | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| V-01 | Unitarios/slices, PostgreSQL IT, componentes, typecheck/lint/formato/build reales | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| V-02 | Playwright desktop/móvil con API/DB/OIDC reales, errores, saneamiento y cleanup labels cero | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| V-03 | FULL local y CI requerida del HEAD publicado verdes, sin omitidos interpretados como éxito | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| G-01 | Git propio, licencia, kit excluido, repo y ruleset efectivos propios; copia sin kit funciona | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| G-02 | Autonomía propia, capacidades Git/PR/CI y continuidad/merge comprobadas | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| G-03 | PRs revisados en sesión distinta, checks y merges confirmados sobre SHA/base | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| H-01 | AGENTS/CLAUDE/docs/protocolos coherentes y autosuficientes, sin historia ni kit obligatorio | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| H-02 | Adopción limpia con contexto distinto y primera tarea derivada, sin evidencia por herencia | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| H-03 | Checkpoint, pendientes externos y único prompt vigente con precondición, continuidad explícita | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |
| O-01 | Swagger opt-in apagado por defecto, HTTP loopback/GET/api/docs; UI/JSON/Try it out y negativos nginx/Vite | heredado | Contrato/suite base conservados; sin acreditar ejecución propia. Ver tareas A…E | Frontera/revisor; revalidar en starter y cada adopción |

## Pendientes externos
Reconciliación A (2026-10-17, sesión planner nueva): PR #1 MERGED, squash `47184f725f8a89528acac0aa3e7383f2334258de` igual a main local/tracking/remoto; FULL PR [39044690435](https://github.com/MatiasNicolasAcevedo/starter-spring-react/actions/runs/39044690435) y main [39045270616](https://github.com/MatiasNicolasAcevedo/starter-spring-react/actions/runs/39045270616) consultadas completed/success con classify/docs-check/server/client/e2e/verify-required success en ambas. T-000 done; evidencia local histórica y cleanup 0/0/0 en T-000. Sin nuevos ensayos locales ni crédito por herencia: conserva 0/22, NO_LISTO y todos los estados de la checklist. B se refina tras revisión del ciclo; no implementada ni acredita beta/template/adopción.
Google real nunca probado por esta extracción; solo el dueño configura credenciales y registra resultado saneado siguiendo SETUP. No bloquea modo local ni permite fallback del perfil real.
No hay recepción de un ejecutor de producto desde este starter. Tras E, única continuidad final según PROVENANCE.
