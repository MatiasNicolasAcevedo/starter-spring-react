# starter-spring-react

Base pública MIT de Java 21 / Spring Boot 4.1.1, React/TypeScript/Vite/MUI y PostgreSQL 18.6. Incluye sesión backend OIDC/CSRF, permisos por propietario, CRUD removible de referencia, migraciones, Swagger opt-in, pruebas y desarrollo local persistente sin Google.

Template beta habilitado tras A/B/C/D MERGED; preparación para frontera → Junie en T-004, ensayo E pendiente. HANDOFF sigue 0/22 NO_LISTO; Google real pendiente del dueño. [Estado y única próxima acción](docs/STATUS.md), [alcance y pendientes](docs/ROADMAP.md), [procedencia](docs/PROVENANCE.md). No equivale a adopción validada.

<!-- adoption-guide:start -->
## Crear una aplicación y su primer flujo

1. Entregar la idea pulida al agente de frontera junto al [formulario breve](docs/templates/project-context.md). Reutilizar respuestas; preguntar solo decisiones faltantes de MVP/datos/reglas/permisos/aceptación. Frontera escribe PROJECT_CONTEXT propio y resuelve arquitectura mínima sobre esta base. No necesita el kit personal.
2. Si aún no hay copia propia, el dueño usa «Use this template → Create a new repository» y clona su repo. Requisitos: Docker Desktop con contenedores Linux, Compose V2 y Git Bash para desarrollo; Node >=24 host para inicializador y FULL/E2E. JDK21 es opcional para IDE/Maven host. [Versiones y trampas](docs/SETUP.md#requisitos-del-host).
3. Personalizar mecánicamente la copia nueva antes de editar contexto/código (ejemplo ficticio):

   ```bash
   node scripts/init-project.mjs --name "Agenda Demo" --slug agenda-demo --package org.demo.agenda --holder "Equipo Demo"
   # Revisar el plan; repetir las mismas entradas con --apply.
   node scripts/init-project.mjs --name "Agenda Demo" --slug agenda-demo --package org.demo.agenda --holder "Equipo Demo" --apply
   ```

   No aplicar sobre el starter de mantenimiento ni reinicializar después de editar. La CLI no genera negocio, no opera GitHub y conserva locks/auth/migraciones/referencia. [Entradas, guardias y escrituras](docs/SETUP.md#personalización-en-una-copia-propia).
4. Guardar el contexto propio preparado por frontera en PROJECT_CONTEXT.md; resolver [AUTONOMY](docs/AUTONOMY.md) para este repo y validar T-000 de adopción con evidencia propia. [STATUS](docs/STATUS.md) da la siguiente acción. Historia archivada y permisos/pruebas del starter no acreditan el producto. Levantar, comprobar y retomar con los comandos de abajo; aceptación y FULL según [TESTING](docs/TESTING.md).
5. Frontera deja una [tarea pequeña ready](docs/templates/task.md) del primer flujo: decisiones, archivos, pasos, aceptación y comandos resueltos. Java por feature y React por feature, usando la [arquitectura existente](docs/ARCHITECTURE.md); retirar/sustituir el ejemplo según [REFERENCE](docs/REFERENCE.md), sin modificar migraciones aplicadas.

## Trabajo diario con Junie

El dueño abre la raíz y configura [instrucciones Junie/AIR](docs/SETUP.md#instrucciones-de-junie-en-intellij-idea-y-air). Junie lee AGENTS raíz → STATUS → tarea y referencias mínimas, incluido AGENTS de la capa afectada. Ejecuta pasos y pruebas indicados; correcciones ordinarias continúan, decisiones nuevas de arquitectura/alcance vuelven a frontera/dueño con evidencia.

El progreso y evidencia van en la tarea. STATUS cambia al cambiar acción/rol/bloqueo; BACKLOG solo si cambia la cola; HANDOFF solo en aceptación/traspaso o criterio afectado. Con código publicado y gate pertinente verde, revisión independiente y merge confirmado antes de la próxima tarea. [Protocolos por rol](docs/agents/implementer.md); no releer A…E ni todo docs/ en cada tarea.

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

Durante una tarea ejecutar los tests dirigidos elegidos por frontera. Cierre técnico con namespaces nuevos propios, tras comprobar labels ausentes según SETUP:

```bash
COMPOSE_ENV_FILES=.env.example COMPOSE_PROJECT_NAME=starter-verify-mi-app STARTER_E2E_PROJECT=starter-e2e-mi-app STARTER_SERVER_TESTS=container bash scripts/verify.sh
# Solo recursos ficticios creados por esta ejecución:
docker compose --env-file .env.example -p starter-verify-mi-app --profile verify down --volumes --remove-orphans
```

FULL conserva backend/IT PostgreSQL, client e integración/Playwright reales. CI automática `verify-required` comprueba herramientas/documentación y clasifica el diff; no ejecuta ni acredita FULL. No repetir FULL por cierre solo documental con base/fuentes idénticas. Política y elección de pruebas: [TESTING](docs/TESTING.md#elegir-pruebas-para-una-tarea-pequeña). Versiones: [DEPENDENCIES](docs/DEPENDENCIES.md).
<!-- adoption-guide:end -->
