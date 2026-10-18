# starter-spring-react

Base genérica Java 21 / Spring Boot 4.1.1, React/TypeScript/Vite y PostgreSQL 18.6. MIT · Matias Nicolas Acevedo.

**Estado: A y B terminadas y mergeadas; C implementada, en revisión independiente.** No es beta ni template validado. Estado y contratos B…E en [ROADMAP](docs/ROADMAP.md); pruebas propias de C en [T-002](docs/tasks/T-002-reference-security.md). Origen y límites de continuidad: [PROVENANCE](docs/PROVENANCE.md).

**Destino:** crear aplicaciones con «Use this template → Create a new repository», personalizar y verificar la base, y empezar el primer flujo. D integrará el formulario de contexto y la guía breve de adopción/crecimiento; E comprobará el recorrido sin kit personal. Objetivo aceptado y condiciones de retiro de `plantilla/`: [PROJECT_CONTEXT](PROJECT_CONTEXT.md#adopción-futura).

## Modo local explícito sin credenciales
Requiere Docker Desktop (Linux/WSL2), Compose V2 y Git Bash; primer build necesita red. Node/Maven/PostgreSQL en host no son necesarios para este CLI. Elegir un nombre propio nuevo; el script rechaza huellas incompatibles y no carga .env. Desde raíz en Git Bash:

```bash
bash scripts/dev.sh up --mode local --proxy nginx --project starter-dev-mi-prueba
bash scripts/dev.sh check --mode local --proxy nginx --project starter-dev-mi-prueba
bash scripts/dev.sh down --mode local --proxy nginx --project starter-dev-mi-prueba
# Retomar: repetir up con exactamente modo, proxy, proyecto y parámetros anteriores.
```

UI http://127.0.0.1:5175; Vite usa --proxy vite y puerto 5176. down conserva la DB; repetir up sobre un stack activo lo comprueba sin recrearlo. Tras cambios de backend/build, down y up reconstruyen conservando el volumen. DB/server son internos. Los probes se ejecutan en contenedor, sin crear sesión para declarar disponibilidad. La pantalla exige system/info válido y readiness UP para mostrar API/DB disponibles; detecta caída y recuperación sin recargar. Implementación, pruebas propias y cierre revisado/mergeado de B en T-001.

Puertos, Swagger opt-in, navegador Windows y coexistencia: [SETUP](docs/SETUP.md#primer-uso-local-sin-google). El proveedor ficticio usa el perfil e2e explícito y la misma sesión backend/CSRF que el flujo heredado. El harness efímero anterior conserva su contrato: bash scripts/dev-auth.sh nginx starter-dev-auth-local-nginx session; Ctrl-C/stop elimina sus datos ficticios.

## Google real
Camino separado exclusivo del dueño: [SETUP](docs/SETUP.md#google-oidc-real). Requiere credenciales privadas backend y origen coherente; sin ellas el perfil google falla sin fallback. Ningún agente lee ni opera esos valores.

## Verificación y adopción
```bash
COMPOSE_ENV_FILES=.env.example COMPOSE_PROJECT_NAME=starter-verify-mi-prueba STARTER_E2E_PROJECT=starter-e2e-mi-prueba STARTER_SERVER_TESTS=container bash scripts/verify.sh
```

FULL ejecuta docs, backend con PostgreSQL Testcontainers, cliente (typecheck/lint/formato/tests/build) y E2E real con cleanup. Usar proyectos propios y retirar únicamente red/caché del gate según SETUP. Suites sueltas son iteración y no habilitan merge.
Inventario completo: [DEPENDENCIES](docs/DEPENDENCIES.md). Reglas: [AGENTS](AGENTS.md), [AUTONOMY](docs/AUTONOMY.md). Futura adopción: contexto propio y T-000 nueva, revalidando los 22 criterios de HANDOFF; no heredar estados/evidencia ni ajustes GitHub.
Validación propia de B: FULL local R2 exit0 y CI FULL final PR/main success; evidencia por SHA en T-001 y PR #2. Referencia privada `/reference`, conexiones y retiro seguro: [REFERENCE](docs/REFERENCE.md). C tiene FULL local propio verde; CI final y revisión independiente son precondiciones de entrega registradas en T-002/PR #3. Sin garantía de adopción hasta E MERGED y validada.
