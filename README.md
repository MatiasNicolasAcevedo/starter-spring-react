# starter-spring-react

Base genérica Java 21 / Spring Boot 4.1.1, React/TypeScript/Vite y PostgreSQL 18.6. MIT · Matias Nicolas Acevedo.

**Estado: A/B/C terminadas y mergeadas; D implementada, en revisión independiente; E draft.** Beta/template y adopción siguen pendientes. Qué falta y orden de cierre: [ROADMAP](docs/ROADMAP.md#cierre-mínimo-para-mvp--revisión-del-dueño-2026-10-18); acción concreta en [STATUS](docs/STATUS.md); evidencia propia de D en [T-003](docs/tasks/T-003-initializer-beta.md). Origen y límites de continuidad: [PROVENANCE](docs/PROVENANCE.md).

**Destino:** crear aplicaciones con «Use this template → Create a new repository», personalizar y verificar la base, y empezar el primer flujo. Formulario y recorrido abajo; E comprobará la adopción sin kit personal. Objetivo aceptado y condiciones de retiro de `plantilla/`: [PROJECT_CONTEXT](PROJECT_CONTEXT.md#adopción-futura).

<!-- adoption-guide:start -->
## Crear una aplicación y su primer flujo

1. Consultar el [formulario breve](docs/templates/project-context.md), incluso antes de crear el repo. Cuando este repo esté habilitado como template, usar «Use this template → Create a new repository» en GitHub y clonar **el repositorio propio**. Esta operación corresponde al dueño; el inicializador trabaja offline en la copia. Beta/template solo tras D MERGED; ensayo de adopción E pendiente. Google real queda pendiente del dueño, con OIDC ficticio local como camino probado por cada adopción.
2. Con Node >=24, ejecutar desde la raíz de la copia nueva (ejemplo ficticio):

   ```bash
   node scripts/init-project.mjs --name "Agenda Demo" --slug agenda-demo --package org.demo.agenda --holder "Equipo Demo"
   # Revisar el plan; repetir exactamente con --apply para escribir.
   node scripts/init-project.mjs --name "Agenda Demo" --slug agenda-demo --package org.demo.agenda --holder "Equipo Demo" --apply
   ```

   Dry-run no escribe. Entradas, lista de archivos, guardias e idempotencia: [SETUP](docs/SETUP.md#personalización-en-una-copia-propia). No ejecutar apply sobre el starter de mantenimiento. Los identificadores internos npm y STARTER_* permanecen estables para conservar locks y harness. Revisar el diff propio antes de continuar.
3. Completar `PROJECT_CONTEXT.md` con el problema/flujo/MVP/permisos y aceptación propios. El inicializador deja una T-000 de adopción draft y archiva la historia del starter; contexto aceptado, autorización/configuración GitHub y pruebas deben ser propios. Consultar [STATUS](docs/STATUS.md), [HANDOFF](docs/HANDOFF.md) y [AUTONOMY](docs/AUTONOMY.md). Los registros archivados y PROVENANCE son procedencia, sin activar su continuidad final.
4. Levantar y comprobar con [SETUP](docs/SETUP.md#primer-uso-local-sin-google), usando un proyecto nuevo, fixture ficticia y puertos libres. Probar login local, datos propios y retoma antes del cleanup. Para FULL se requiere además Node >=24 en host. [TESTING](docs/TESTING.md) explica dirigidos, FULL local de cierre y CI liviana: ningún resultado del starter vale como ejecución de esta copia.
5. Validar T-000 con evidencia propia y derivar una spec/tarea del primer flujo desde el contexto. Usar la arquitectura existente: feature Java con controller/DTO/servicio/persistencia y feature React con API/hook/página/formulario. Decidir propiedad en el servicio, respaldar invariantes con constraints y añadir migraciones Flyway nuevas. Probar caso útil, validación, usuario ajeno, CSRF y UI con API/DB reales según los [AGENTS](AGENTS.md), [ARCHITECTURE](docs/ARCHITECTURE.md) y [ADR](docs/adr/0001-base-tecnica-y-alineacion-del-scaffold.md).

Para sustituir el ejemplo seguir [REFERENCE](docs/REFERENCE.md): el inicializador no lo retira ni altera migraciones. Separar web/application/persistence/domain cuando la complejidad lo justifique; no agregar servicios, colas o infraestructura antes de una necesidad observada. Conservar sesión OIDC backend/CSRF, cliente HTTP y cache por identidad. Revisar el crecimiento cada cinco tareas o cambio relevante con los [protocolos](docs/agents/planner.md).

## Modo local explícito sin credenciales

Comandos persistentes desde Git Bash (Docker Desktop/Compose V2; datos ficticios, sin Google):

```bash
bash scripts/dev.sh up --mode local --proxy nginx --project starter-dev-mi-app
bash scripts/dev.sh check --mode local --proxy nginx --project starter-dev-mi-app
bash scripts/dev.sh down --mode local --proxy nginx --project starter-dev-mi-app
# Retomar con el mismo proyecto, ruta, modo, proxy y parámetros: repetir up.
COMPOSE_ENV_FILES=.env.example COMPOSE_PROJECT_NAME=starter-verify-mi-app STARTER_E2E_PROJECT=starter-e2e-mi-app STARTER_SERVER_TESTS=container bash scripts/verify.sh
```

UI nginx http://127.0.0.1:5175; Vite usa --proxy vite y 5176. down conserva DB; usar --env-file con puertos distintos para coexistencia y los mismos parámetros en cada acción. Antes de FULL comprobar ausencia de recursos del namespace elegido; cleanup únicamente por labels propios según SETUP. Google real: [guía exclusiva del dueño](docs/SETUP.md#google-oidc-real). Versiones: [DEPENDENCIES](docs/DEPENDENCIES.md).
<!-- adoption-guide:end -->
