# starter-spring-react

Base pública MIT de Java 21 / Spring Boot 4.1.1, React/TypeScript/Vite/MUI y PostgreSQL 18.6. Incluye sesión backend OIDC/CSRF, permisos por propietario, CRUD removible de referencia, migraciones, Swagger opt-in, pruebas y desarrollo local persistente sin Google.

Template beta habilitado tras A/B/C/D MERGED; preparación para frontera → Junie en T-004, ensayo E pendiente. HANDOFF sigue 0/22 NO_LISTO; Google real pendiente del dueño. [Estado y única próxima acción](docs/STATUS.md), [alcance y pendientes](docs/ROADMAP.md), [procedencia](docs/PROVENANCE.md). No equivale a adopción validada.

<!-- adoption-guide:start -->
## Qué incluye esta base

| Área | Ya configurado en el repositorio |
|---|---|
| Backend | Java21, Spring Boot4.1.1 y Maven Wrapper; Spring MVC, JPA/Hibernate, Bean Validation, Security/OAuth2 Client, Actuator y springdoc. Organización modular por feature; DTOs separados de entidades y errores ProblemDetail |
| Datos | PostgreSQL18.6, Flyway desde DB vacía, JPA validate, timestamps UTC/Clock inyectado y UUIDv7. Volumen persistente de desarrollo separado de pruebas ficticias |
| Identidad y acceso | Google OIDC con sesión backend y CSRF; identidad local por issuer/subject, logout y permisos por propietario. Sin tokens en almacenamiento del navegador. Proveedor OIDC local explícito para desarrollar/probar sin Google real |
| Frontend | React19, TypeScript estricto, Vite, React Router, Material UI/Emotion, TanStack Query, React Hook Form y Zod. Cliente HTTP central, errores tipados, CSRF y limpieza de datos privados al cambiar/cerrar sesión |
| Ejemplo útil y removible | CRUD privado de referencia: alta/listado paginado/edición/borrado, validación, propiedad, migración, formulario y pruebas. Guía para quitarlo o sustituirlo sin romper auth ni migraciones aplicadas |
| Salud y API | Pantalla conectada a API/DB, readiness dependiente de PostgreSQL y errores/recuperación visibles. OpenAPI/Swagger opt-in para HTTP loopback, GET y mismo origen; apagado por defecto |
| Desarrollo | Docker Compose V2; SPA/nginx o Vite con HMR, proxy del mismo origen, comando persistente up/check/down, puertos y proyecto propios, rollback y retoma con datos conservados. Harness efímero separado para ensayos |
| Pruebas backend | Spotless, unitarios/slices, integración PostgreSQL Testcontainers/Failsafe, seguridad y OIDC por HTTP real, JaCoCo y umbrales de la referencia |
| Pruebas frontend/integración | Typecheck, ESLint, Prettier, Vitest/Testing Library/MSW, cobertura, build y Playwright desktop/móvil con API/DB/OIDC reales. Negativos de aislamiento, proxies, fallos y cleanup; export saneado |
| Git y CI | Workflow automático liviano verify-required en PR y FULL remoto manual; revisión independiente, squash y evidencia local según configuración propia de cada repo. Los permisos/protecciones del starter no se transfieren por copiar código |
| Personalización y agentes | CLI offline con dry-run/apply, guardias e idempotencia; formulario de idea, contexto, specs/tareas, tablero y prompts de continuación. AGENTS raíz/server/client; CLAUDE solo importa AGENTS |
| Herramientas externas Junie | Catálogo [.junie/TOOLS.md](.junie/TOOLS.md) de cinco MCP y siete skills declarados por el dueño, con estado y límites. Documentado no significa instalado ni activo; revalidar en cada entorno |

Versiones completas y dependencias de runtime/build/test: [DEPENDENCIES](docs/DEPENDENCIES.md). Arquitectura y decisiones: [ARCHITECTURE](docs/ARCHITECTURE.md) y [ADR](docs/adr/0001-base-tecnica-y-alineacion-del-scaffold.md). La base es genérica: el dominio y los permisos de tu aplicación salen de tu contexto; despliegue, servicios pagos y operación de datos reales requieren decisiones propias.

## Dónde encontrar cada cosa

| Ruta | Para qué sirve |
|---|---|
| PROJECT_CONTEXT.md | Tu idea aceptada, MVP, exclusiones, reglas/permisos y aceptación |
| docs/templates/project-context.md | Formulario genérico versionado; se conserva para próximas ideas |
| server/ y client/ | Aplicación y pruebas de cada capa; sus AGENTS describen convenciones |
| e2e/ y scripts/ | Playwright, arranque/verificación/personalización y regresiones operativas |
| docs/ROADMAP.md y docs/specs/ | Iteraciones/versiones y contratos agrupados por capacidad/épica |
| docs/STATUS.md, docs/BACKLOG.md y docs/tasks/ | Acción y prompt vigentes, cola de tareas, progreso/correcciones y evidencia |
| docs/SETUP.md, TESTING.md y HANDOFF.md | Operación/trampas, validación y aceptación/traspaso |
| .junie/TOOLS.md | Inventario de MCP/skills y disponibilidad comprobada por superficie |

## Crear una aplicación y su primer flujo

1. Entregar la idea pulida al agente de frontera junto al [formulario breve](docs/templates/project-context.md), que ya está commiteado y puede consultarse o adjuntarse desde el template. Reutilizar respuestas y preguntar solo decisiones faltantes de MVP/datos/reglas/permisos/aceptación. Frontera prepara el contexto y arquitectura mínima; conservar esas respuestas hasta completar el paso3, porque la personalización reinicia PROJECT_CONTEXT. No necesita el kit personal.
2. Si aún no hay copia propia, el dueño usa «Use this template → Create a new repository» y clona su repo. Requisitos: Docker Desktop con contenedores Linux, Compose V2 y Git Bash para desarrollo; Node >=24 host para inicializador y FULL/E2E. JDK21 es opcional para IDE/Maven host. [Versiones y trampas](docs/SETUP.md#requisitos-del-host).
3. Personalizar mecánicamente la copia nueva antes de editar contexto/código (ejemplo ficticio):

   ```bash
   node scripts/init-project.mjs --name "Agenda Demo" --slug agenda-demo --package org.demo.agenda --holder "Equipo Demo"
   # Revisar el plan; repetir las mismas entradas con --apply.
   node scripts/init-project.mjs --name "Agenda Demo" --slug agenda-demo --package org.demo.agenda --holder "Equipo Demo" --apply
   ```

   No aplicar sobre el starter de mantenimiento ni reinicializar después de editar. La CLI no genera negocio, no opera GitHub y conserva locks/auth/migraciones/referencia. [Entradas, guardias y escrituras](docs/SETUP.md#personalización-en-una-copia-propia).
4. Reemplazar el borrador de PROJECT_CONTEXT.md raíz por el contexto propio preparado y aceptado; conservar el formulario genérico en docs/templates, sin llenarlo con los datos de esa aplicación. Referenciar .junie/TOOLS.md y revalidar el inventario. Resolver [AUTONOMY](docs/AUTONOMY.md) para este repo y validar T-000 de adopción con evidencia propia. [STATUS](docs/STATUS.md) da la acción concreta. Historia archivada y permisos/pruebas del starter no acreditan el producto. Levantar, comprobar y retomar con los comandos de abajo; aceptación y FULL según [TESTING](docs/TESTING.md).
5. Frontera prepara la primera iteración y varias [tareas pequeñas](docs/templates/task.md), agrupadas en [specs por capacidad](docs/templates/spec.md), con decisiones, archivos, pasos, aceptación, pruebas y dependencias resueltos. Java y React por feature, usando la [arquitectura existente](docs/ARCHITECTURE.md); retirar/sustituir el ejemplo según [REFERENCE](docs/REFERENCE.md), sin modificar migraciones aplicadas.

## Iteraciones y varias tareas seguidas de Junie

ROADMAP identifica una versión/iteración, su objetivo observable y su condición de salida. Cada spec Markdown representa una capacidad/épica y agrupa sus tareas ordenadas; una tarea sigue siendo suficientemente pequeña para implementar y revisar un resultado útil. Los objetivos posteriores quedan visibles, sin inventar todos sus detalles antes de tener evidencia. Una corrección aislada puede usar un contrato de tarea autosuficiente, sin otra spec.

La ruta preparada es: frontera define iteración/specs/tareas → Junie T1 → revisión/merge → Junie T2 → revisión/merge → Junie T3… → objetivo de iteración comprobado → frontera decide/refina el siguiente objetivo. La revisión puede realizarla otra sesión de Junie cuando AUTONOMY y sus capacidades lo permitan; el implementador nunca revisa ni mergea su propio trabajo. No hace falta una sesión de frontera entre tareas ni al llegar a cinco: Junie comprueba el avance, y frontera vuelve al objetivo acordado, a un cambio de intención del dueño o a una decisión/bloqueo fuera del contrato.

Las tareas posteriores pueden estar definidas y draft solo por dependencias pendientes. Al comprobar MERGED de la anterior, Junie habilita la siguiente ya especificada si no falta ninguna decisión; máximo cinco ready y una tarea/PR activos. Si el contrato no está completo, no improvisa arquitectura para continuar. [Estados y continuidad](docs/ORCHESTRATION.md).

## Trabajo diario con Junie

El dueño abre la raíz y configura [instrucciones Junie/AIR](docs/SETUP.md#instrucciones-de-junie-en-intellij-idea-y-air). Junie lee AGENTS raíz → STATUS → tarea y referencias mínimas, incluido AGENTS de la capa afectada. Ejecuta pasos y pruebas indicados; correcciones ordinarias continúan, decisiones nuevas de arquitectura/alcance vuelven a frontera/dueño con evidencia.

El progreso y evidencia van en la tarea. STATUS cambia al cambiar acción/rol/bloqueo; BACKLOG solo si cambia la cola; HANDOFF solo en aceptación/traspaso o criterio afectado. Con código publicado y gate pertinente verde, revisión independiente y merge confirmado antes de la próxima tarea. [Protocolos por rol](docs/agents/implementer.md); no releer A…E ni todo docs/ en cada tarea.

Cada tarea conserva una bitácora corta de correcciones significativas: problema/causa, arreglo y prueba/SHA. El checkpoint dice dónde retomar ahora; tareas cerradas, commits y PRs explican lo desarrollado antes. El tablero enlaza En curso, Siguientes y Hechas, sin copiar toda esa evidencia. Ninguna tarea pasa a done solo porque compila o tiene tests verdes: exige MERGED comprobado y conciliación. La confirmación del merge queda en el PR y el siguiente implementer concilia done al primer avance de su rama; nunca se vuelve a commitear en la rama ya mergeada.

Tu intervención diaria es copiar el único prompt de STATUS y abrir una sesión nueva del rol indicado: implementar, revisar/corregir o continuar con la siguiente tarea. El prompt lleva tarea/rama/PR, precondición y primera acción. Antes de pasar a la siguiente comprueba el cierre de la anterior; no tenés que reconstruir el contexto ni editar el tablero a mano. Si corresponde volver a frontera, el prompt explica qué objetivo se cumplió o qué decisión falta.

Junie Lite con Qwen 3.6 27B es configuración declarada por el dueño, no ejecución comprobada. Hay un [microensayo unitario preparado](docs/templates/junie-trial.md); su resultado debe venir de Junie. No añade una feature de demostración.

## Modo local explícito sin credenciales

Desde Git Bash, con proyecto propio nuevo y datos ficticios:

```bash
bash scripts/dev.sh up --mode local --proxy nginx --project starter-dev-mi-app
bash scripts/dev.sh check --mode local --proxy nginx --project starter-dev-mi-app
bash scripts/dev.sh down --mode local --proxy nginx --project starter-dev-mi-app
# Retomar: repetir up con la misma ruta, proyecto, proxy y parámetros.
```

UI nginx http://127.0.0.1:5175; Vite usa `--proxy vite` y 5176. down conserva DB. Para coexistencia usar `--env-file` con puertos libres distintos en cada acción; aislamiento, login local y retoma en [SETUP](docs/SETUP.md#primer-uso-local-sin-google). Google real: [camino exclusivo del dueño](docs/SETUP.md#google-oidc-real).
El login local usa el proveedor ficticio y `host.docker.internal`; si se abre un navegador host Windows, seguir la resolución por proceso de SETUP/TR-11. No modificar hosts globales. Los ensayos containerizados son el camino portable. `dev-auth.sh` es efímero y destruye sus datos al terminar: usar dev.sh para desarrollo persistente.

## Validar, commitear y publicar

| Momento | Qué comprueba el agente |
|---|---|
| Mientras implementa y antes de un commit con código | Test dirigido al comportamiento/corrección, rojo previo si es bug, tipos/formato pertinentes y diff/index sin secretos/kit. La tarea especifica comandos exactos y motivo de cada capa de prueba |
| Al cerrar fuentes de un PR técnico | Un FULL local válido sobre fuentes finales/base, logs saneados, cleanup y correspondencia con lo publicado; no un FULL por cada commit |
| Si después cambia solo Markdown | docs-check y regresiones afectadas; conservar FULL si fuentes técnicas/base siguen idénticas. No llamar DOCS_ONLY a un diff que el clasificador trata como FULL |
| Revisión independiente | Aceptación, diff, arquitectura/contratos/propiedad/migraciones, evidencia y pruebas dirigidas a riesgos; FULL solo si cambian fuentes/base, falta evidencia o hay motivo concreto |
| Merge | CI requerida verde sobre HEAD/base vigentes, veredicto independiente y AUTONOMY propia; squash confirmado MERGED antes de la siguiente tarea |

La arquitectura se revisa contra AGENTS/ARCHITECTURE/spec, además de compilar y probar: límites de feature, DTO/API, validación, autorización por propietario, sesión/CSRF y migraciones. Es un control explícito del agente y revisor, no una garantía automática de que ningún bug pueda entrar. El flujo reduce riesgo con pruebas útiles y revisión sin instalar otra capa de herramientas. Hay un check requerido CI liviano, sin hooks o dispatcher nuevos.

Durante una tarea ejecutar los tests dirigidos elegidos por frontera. Cierre técnico con namespaces nuevos propios, tras comprobar labels ausentes según SETUP:

```bash
COMPOSE_ENV_FILES=.env.example COMPOSE_PROJECT_NAME=starter-verify-mi-app STARTER_E2E_PROJECT=starter-e2e-mi-app STARTER_SERVER_TESTS=container bash scripts/verify.sh
# Solo recursos ficticios creados por esta ejecución:
docker compose --env-file .env.example -p starter-verify-mi-app --profile verify down --volumes --remove-orphans
```

FULL conserva backend/IT PostgreSQL, client e integración/Playwright reales. CI automática `verify-required` comprueba herramientas/documentación y clasifica el diff; no ejecuta ni acredita FULL. No repetir FULL por cierre solo documental con base/fuentes idénticas. Política y elección de pruebas: [TESTING](docs/TESTING.md#elegir-pruebas-para-una-tarea-pequeña). Versiones: [DEPENDENCIES](docs/DEPENDENCIES.md).

## Formulario, kit y primera prueba sencilla

El formulario genérico está versionado en docs/templates/project-context.md. Podés dárselo a frontera con la idea ya elaborada; después del inicializador las respuestas reemplazan PROJECT_CONTEXT raíz. El formulario permanece reutilizable en el repo y no hace falta copiar `plantilla/` a una aplicación nueva. Si existe el kit local durante el cierre del starter, conservarlo hasta E MERGED y validada; recién entonces lo retira el dueño. Ningún script lo copia o borra.

Para una primera prueba acotada de Junie, está el [microensayo de mensaje vacío](docs/templates/junie-trial.md): una transformación frontend existente y su prueba unitaria, sin otra feature ni backend. Ejecutarlo en una copia descartable propia cuando la tarea vigente lo habilite y devolver diff, rutas de instrucciones, modelo realmente expuesto y logs rojo/verde. Ese resultado prueba el ensayo, no adopción E ni Google real. Para el estado y orden actuales, seguir únicamente STATUS.
<!-- adoption-guide:end -->
