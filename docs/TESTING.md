# Pruebas y verificación

**Fase actual: `FULL`**. Mantener suites, negativos, assertions, cobertura, aislamiento, retries y deadlines. Un check de herramientas verde no acredita tests de aplicación ni despliegue.

## Comandos
Desde la raíz con Git Bash, Docker Desktop Linux y Node >=24. Usar `.env.example` y proyectos Compose nuevos propios; comprobar labels ausentes antes de empezar y limpiar solo esos recursos.

| Comando | Alcance |
|---|---|
| `bash scripts/verify.sh` | Gate FULL de cierre técnico: docs → backend → frontend → integración/Playwright; se detiene al primer fallo |
| `bash scripts/verify.sh --docs` | docs-check en contenedor; gate solo si el diff completo es DOCS_ONLY |
| `bash scripts/verify.sh --server` | Maven `clean verify`: Spotless, unitarios/slices Surefire, integración PostgreSQL Failsafe, JaCoCo |
| `bash scripts/verify.sh --client` | Typecheck, lint, formato, Vitest/cobertura y build; reconstruye la imagen verify |
| `bash scripts/verify.sh --e2e` | Ensayos del inicializador, copia compilable, CLI persistente, proxies/fallos/señales y Playwright reales |
| `bash scripts/verify.sh --fast` | Iteración parcial sin E2E; no acredita FULL |
| `bash scripts/verify.sh --policy main` | Clasifica el diff base...HEAD; no ejecuta tests |
| `node scripts/docs-check.mjs` | Documentos, enlaces, tareas/WIP, configuración y checklist |

Ejemplo FULL con namespaces propios nuevos:
```bash
COMPOSE_ENV_FILES=.env.example COMPOSE_PROJECT_NAME=starter-verify-mi-cambio STARTER_E2E_PROJECT=starter-e2e-mi-cambio STARTER_SERVER_TESTS=container bash scripts/verify.sh
```

## Elegir pruebas para una tarea pequeña
Frontera especifica la capa mínima que demuestra el riesgo y el comando exacto, sin dejar nombres ficticios por resolver a Junie. Bugfix: rojo antes del arreglo. Mantener regresiones útiles; no duplicar casos en todas las capas ni añadir E2E por costumbre.

| Riesgo | Capa pertinente |
|---|---|
| Regla o transformación | Unitaria de éxito y borde/negativo |
| Interacción de pantalla/cache | Componente con providers reales, Testing Library/MSW |
| Persistencia/constraint/consulta/propiedad | IT con PostgreSQL Testcontainers y actor permitido/denegado |
| Sesión/CSRF/OIDC/cookies | HTTP/Tomcat/DB/proveedor local; MockMvc oidcLogin solo acredita permisos |
| Flujo entre capas o proxy | Playwright contra API/DB/OIDC reales, sin mockear la API propia |
| CLI/identidad/ownership/cleanup | Matriz de herramientas y ensayo aislado de copia/recursos |

Backend: `*Test`/`*Tests` usa Surefire, `*IT` Failsafe. `mvnw test` no acredita IT. Client: `tsc -b` explícito; Vite build no basta. Vitest usa cuatro workers para limitar arranques jsdom/MUI; no aumentar timeouts/retries para ocultar fallos. Playwright conserva desktop 1280 y móvil 375, datos ficticios por caso, retries 0 y export saneado fail-closed. Los tests de protocolo no imprimen tokens/claims/cookies; el fixture HTTP negativo no sustituye el login real.

## Cuándo ejecutar FULL
Dirigidos mientras se implementa. Un FULL válido al cerrar fuentes técnicas, con SHA/base, huella antes/después, comandos, logs saneados y cleanup en la tarea. No editar fuentes durante la corrida. Una transición solo Markdown conserva esa evidencia si base/fuentes técnicas coinciden; ejecutar docs-check y los checks afectados. Cambios de fuentes/base, falta de evidencia o riesgo concreto requieren revalidar lo afectado. La revisión es independiente y no repite FULL por rutina.

DOCS_ONLY acepta solo archivos regulares A/M de Markdown raíz/docs, AGENTS/CLAUDE conocidos y LICENSE. Código/scripts/workflows/locks, Markdown técnico, renombres/borrados, modos especiales, diff vacío o error exigen FULL. El clasificador conservador no sustituye comprobar las fuentes probadas.

## CI y merge
CI automática [ci.yml](../.github/workflows/ci.yml): solo PR, un job `verify-required`, matrices Node de herramientas/docs/clasificación, sin Docker ni dependencias de aplicación. HEAD real, concurrencia con cancelación y timeout 5 minutos. Puede ser verde en draft; no acredita FULL. Antes de merge: CI propia del HEAD/base exactos, FULL local válido para fuentes/base, veredicto independiente y AUTONOMY. No cambiar protecciones para destrabar.

FULL remoto [full.yml](../.github/workflows/full.yml): exclusivamente manual `workflow_dispatch`, no push/PR/calendario. Conserva backend/client/E2E y agregado estricto `full-result`: FULL exige todas sus suites success; DOCS_ONLY requiere las técnicas skipped. Fallo, ausencia, cancelación o pendiente de una suite exigida nunca cuenta como éxito.

## Qué mide el tiempo
`verify.sh` emite `TIMING suite=... seconds=... exit=...`. La entrada integrada añade `TIMING integration=...` por ensayo. Son tiempos de pared: incluyen construcción, inicio, tests y cleanup de cada etapa, sin restar trabajo concurrente. El resumen Maven incluye compilación/arranque además de JUnit; Vitest separa tests y entorno. Los builds Docker informan duración por paso, algunas superpuestas: no sumarlas como tiempo de pared.

FULL incluye probar que otra copia personalizada compila: vuelve a ejecutar backend/frontend y varios stacks nuevos de persistencia/proxy/rollback. El tiempo de Playwright no equivale a toda la fase E2E. Cuantificar antes de optimizar; no llamar unitarios al tiempo de construir contenedores. Mediciones concretas en la tarea vigente, sin prometer una duración fija.

## Cobertura y seguridad
Referencia backend: mínimos 80% líneas y 70% ramas en dominio/servicios; client API/hooks 80/70, sin rebajar. Los contratos fuente y umbrales efectivos están en POM/Vitest. Cobertura no acredita permisos: negativos de propiedad/401/403/CSRF/logout y dos identidades siguen obligatorios.

## Operación y señales
INT/TERM/HUP se reenvían al hijo real; esperar cleanup y conservar salida 130/143/129. Windows requiere propietario Bash para la matriz de proxies; no matar Node a mitad de up. Backend en contenedor por defecto; alternativa host solo con JDK 21, causa documentada y mismas suites. Trampas y recetas de entorno en [SETUP](SETUP.md).
