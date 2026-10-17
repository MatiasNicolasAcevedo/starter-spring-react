# starter-spring-react

Base genérica Java 21 / Spring Boot 4.1.1, React/TypeScript/Vite y PostgreSQL 18.6. MIT · Matias Nicolas Acevedo.

**Estado: parte A, extracción e inventario en revisión pendiente.** No es beta ni template validado. Contratos B…E en [ROADMAP](docs/ROADMAP.md); pruebas propias y fecha de la última validación en [T-000](docs/tasks/T-000-starter-extraction.md). Origen y límites de continuidad: [PROVENANCE](docs/PROVENANCE.md).

## Modo local explícito sin credenciales
Requiere Docker Desktop abierto, Git Bash y Node >=24 en el host para el control E2E/sondas; primer build necesita red. Desde raíz en Git Bash:

```bash
bash scripts/dev-auth.sh nginx starter-dev-auth-local-nginx session
```

Harness **efímero** heredado: levanta DB/server/client y proveedor OIDC ficticio. UI http://127.0.0.1:5175, Swagger http://127.0.0.1:5175/api/docs/swagger-ui.html. Ctrl-C detiene y elimina solo sus recursos y datos ficticios. Para Vite usar `vite starter-dev-auth-local-vite session` (puerto 5176). Un proyecto nuevo por sesión; no reutilizar nombres con recursos existentes. Windows usa resolución por proceso del issuer; la sonda automatizada declara Edge/Playwright en SETUP. No modificar hosts globales.
El futuro `dev.sh up/check/down`, con volumen persistente y diagnóstico API/DB, se implementa en B. A conserva el harness y sus pruebas sin anunciar ese contrato como realizado.

## Google real
Camino separado exclusivo del dueño: [SETUP](docs/SETUP.md#google-oidc-real). Requiere credenciales privadas backend y origen coherente; sin ellas el perfil google falla sin fallback. Ningún agente lee ni opera esos valores.

## Verificación y adopción
```bash
COMPOSE_ENV_FILES=.env.example COMPOSE_PROJECT_NAME=starter-a-gate bash scripts/verify.sh
```

FULL ejecuta docs, backend con PostgreSQL Testcontainers, cliente (typecheck/lint/formato/tests/build) y E2E real con cleanup. Usar proyectos propios y retirar únicamente red/caché del gate según SETUP. Suites sueltas son iteración y no habilitan merge.
Inventario completo: [DEPENDENCIES](docs/DEPENDENCIES.md). Reglas: [AGENTS](AGENTS.md), [AUTONOMY](docs/AUTONOMY.md). Futura adopción: contexto propio y T-000 nueva, revalidando los 22 criterios de HANDOFF; no heredar estados/evidencia ni ajustes GitHub.
Última validación: 2026-10-17, A; alcance y resultados exactos en T-000 y PR. FULL/CI solo se consideran acreditados cuando sus resultados estén registrados allí. Sin garantía de adopción hasta E MERGED y validada.
