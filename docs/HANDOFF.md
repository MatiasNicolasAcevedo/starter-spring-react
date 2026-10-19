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
A done: PR #1 MERGED; squash, ambas CI FULL comprobadas y cleanup histórico en [T-000](tasks/T-000-starter-extraction.md#reconciliación-posterior-al-merge--2026-10-17). Su evidencia queda acotada a A; la checklist conserva 0/22, NO_LISTO y todos sus estados.
B done: [T-001](tasks/T-001-local-stack.md#reconciliación-posterior-al-merge--2026-10-18) concilia PR #2 MERGED, squash y CI FULL final del PR/main comprobadas; evidencia por SHA y FULL/cleanup propios R2 en esa tarea. Corte de B en ROADMAP. C está mergeable en [T-002](tasks/T-002-reference-security.md)/[S-003](specs/S-003-reference-security.md): [R2 favorable](tasks/T-002-reference-security.md#revisión-independiente-r2--2026-10-18), sin bloqueantes; FULL local corroborado, dirigidos y negativos propios verdes/efectivos. CI liviana exacta, veredicto y confirmación de merge finales en PR #3; mergeable no equivale a MERGED ni done. Conciliación/corte de C solo después de MERGED en sesión nueva; D/E draft. Sin criterios globales acreditados: checklist 0/22, NO_LISTO; sin beta/template/adopción validada.
Destino aceptado de formulario integrado, adopción autosuficiente y retiro del kit: [PROJECT_CONTEXT](../PROJECT_CONTEXT.md#adopción-futura), a implementar en D y probar en E. Es una salida pendiente, sin acreditar H-01/H-02/H-03 ni los restantes criterios por documentarla.
Google real nunca probado por esta extracción; solo el dueño configura credenciales y registra resultado saneado siguiendo SETUP. No bloquea modo local ni permite fallback del perfil real.
No hay recepción de un ejecutor de producto desde este starter. Tras E, única continuidad final según PROVENANCE.
