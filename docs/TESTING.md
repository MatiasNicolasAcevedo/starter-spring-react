# Pruebas y verificación

**Fase actual: `FULL`** de aplicación. Mantener suites, negativos, assertions, cobertura, aislamiento, retries y deadlines. Un check de herramientas verde no acredita tests de aplicación ni despliegue.

## Comandos
Desde la raíz con Git Bash, Docker Desktop Linux y Node >=24. Usar `.env.example` y proyectos Compose nuevos propios; comprobar labels ausentes antes de empezar y limpiar solo esos recursos.

| Comando | Alcance |
|---|---|
| `bash scripts/verify.sh` | Gate FULL de aplicación: docs → backend → frontend → Playwright real; se detiene al primer fallo |
| `bash scripts/verify.sh --docs` | docs-check en contenedor; gate solo si el diff completo es DOCS_ONLY |
| `bash scripts/verify.sh --server` | Maven `clean verify`: Spotless, unitarios/slices Surefire, integración PostgreSQL Failsafe, JaCoCo |
| `bash scripts/verify.sh --client` | Typecheck, lint, formato, Vitest/cobertura y build; reconstruye la imagen verify |
| `bash scripts/verify.sh --e2e` | Solo Playwright contra API/DB/OIDC reales, saneador y cleanup |
| `bash scripts/verify.sh --tooling` | Inicializador, copia compilable, CLI persistente, proxies/fallos/señales; no duplica Playwright final |
| `bash scripts/verify.sh --starter` | FULL de aplicación + tooling, para mantenimiento de starter/entorno |
| `bash scripts/verify.sh --fast` | Iteración parcial sin E2E; no acredita FULL |
| `bash scripts/verify.sh --policy main` | Clasifica base...HEAD: policy y profile DOCUMENTATION/APPLICATION/STARTER; no incluye cambios sin commit ni ejecuta tests |
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

## Frecuencia y alcance del gate
Dirigidos durante cada ajuste; un gate al cerrar las fuentes técnicas de la tarea, no en cada commit. Frontera deja el comando concreto; Junie no vuelve a correr la matriz del starter por una función de negocio. Ejecutar `bash scripts/verify.sh --policy origin/main` sobre commits finales y revisar también el diff sin commit antes de publicar.

| Perfil del diff | Gate de cierre |
|---|---|
| DOCUMENTATION / DOCS_ONLY | docs-check; conservar evidencia técnica válida según reglas siguientes |
| APPLICATION | FULL sin opciones: backend con IT PostgreSQL, frontend y Playwright real |
| STARTER | FULL + `--tooling` sobre las mismas fuentes/base, o una ejecución `--starter` |

APPLICATION solo permite archivos regulares de código/tests bajo server/src, client/src o e2e/tests y e2e/fixtures, además de documentación permitida. Migraciones bajo server/src siguen exigiendo IT y Playwright reales. Scripts, Docker/Compose, dependencias/locks, workflows, otras configuraciones, rutas desconocidas, modos especiales y errores de clasificación exigen STARTER. No basta que una tarea se llame de producto; manda el diff completo. Copias de aplicación conservan la misma regla si modifican el tooling; no existe crédito heredado de la plantilla.

| Ensayo de mantenimiento | Qué demuestra y por qué tarda | Cuándo / alternativa liviana |
|---|---|---|
| Inicializador | Identidad, guardias, dry-run/idempotencia; fixtures de archivos/Git | STARTER; tests Node durante cambios. No necesita stacks reales |
| Copia compilable | Una aplicación personalizada compila y pasa backend/frontend; recompila ambas capas | Cambios de inicializador/dependencias/entorno; mocks no prueban compilación |
| Guardias | Rechazo de parámetros/ownership antes de operar Docker | STARTER; entradas negativas y runners ficticios durante iteración |
| CLI nginx/Vite | Up/check/down y retoma conservan DB con ambos proxies | Cambios de CLI/Compose/proxy; stubs sirven para routing, no prueban persistencia |
| Fallos/rollback/datos | Fallos inyectados en arranque comprueban recuperación/ownership sin borrar datos | Mantenimiento del entorno; esperas/healthchecks/stacks nuevos explican el costo. Mantener ensayo real fuera del gate diario |
| Copia sin Git | CLI funciona en copia limpia sin kit/ignorados | Cambios de empaquetado/CLI; fixtures prueban exclusión pero no lifecycle |
| Señales/proxies | Reenvío de señales, cleanup y matriz OIDC local de proxies | Cambios de runner/proxy/auth local; mocks para control, ensayo real para recursos/cookies |

Los ensayos de herramientas se conservan fuera del gate cotidiano. Tiempos medidos y evidencia de cada cambio viven en su tarea. No ejecutar por calendario ni por cada PR de aplicación. Los tests de selección usan runners ficticios; no sustituir la API propia ni PostgreSQL en E2E, ni convertir esos resultados en aceptación de permisos/datos.

## Cuándo ejecutar FULL
Dirigidos mientras se implementa. Un FULL de aplicación válido al cerrar fuentes técnicas y tooling si STARTER, con SHA/base, huella antes/después, comandos, logs saneados y cleanup en la tarea. No editar fuentes durante la corrida. Una transición solo Markdown conserva esa evidencia si base/fuentes técnicas coinciden; ejecutar docs-check y los checks afectados. Cambios de fuentes/base, falta de evidencia o riesgo concreto requieren revalidar lo afectado. La revisión es independiente y no repite FULL por rutina.

DOCS_ONLY acepta solo archivos regulares A/M de Markdown raíz/docs, AGENTS/CLAUDE conocidos y LICENSE. Código/scripts/workflows/locks, Markdown técnico, renombres/borrados, modos especiales, diff vacío o error exigen FULL. El clasificador conservador no sustituye comprobar las fuentes probadas.

## CI y merge
CI automática [ci.yml](../.github/workflows/ci.yml): solo PR, un job `verify-required`, matrices Node de herramientas/docs/clasificación, sin Docker ni dependencias de aplicación. HEAD real, concurrencia con cancelación y timeout 5 minutos. Puede ser verde en draft; no acredita FULL. Antes de merge: CI propia del HEAD/base exactos, gate local por alcance válido para fuentes/base, veredicto independiente y AUTONOMY. No cambiar protecciones para destrabar.

FULL remoto [full.yml](../.github/workflows/full.yml): exclusivamente manual `workflow_dispatch`, no push/PR/calendario. El perfil calculado agrega tooling dentro del job E2E solo si STARTER; en APPLICATION corre solo Playwright real. Conserva backend/client/E2E y agregado estricto `full-result`: FULL exige todas sus suites success; DOCS_ONLY requiere las técnicas skipped. Fallo, ausencia, cancelación o pendiente de una suite exigida nunca cuenta como éxito.

## Qué mide el tiempo
`verify.sh` emite `TIMING suite=... seconds=... exit=...`. La entrada integrada añade `TIMING integration=...` por ensayo. Son tiempos de pared: incluyen construcción, inicio, tests y cleanup de cada etapa, sin restar trabajo concurrente. El resumen Maven incluye compilación/arranque además de JUnit; Vitest separa tests y entorno. Los builds Docker informan duración por paso, algunas superpuestas: no sumarlas como tiempo de pared.

El perfil STARTER incluye probar que otra copia personalizada compila: vuelve a ejecutar backend/frontend y varios stacks nuevos de persistencia/proxy/rollback. FULL cotidiano no incluye esa matriz. El tiempo de Playwright no equivale a toda la fase E2E. Cuantificar antes de optimizar; no llamar unitarios al tiempo de construir contenedores. Mediciones concretas en la tarea vigente, sin prometer una duración fija.

## Cobertura y seguridad
Referencia backend: mínimos 80% líneas y 70% ramas en dominio/servicios; client API/hooks 80/70, sin rebajar. Los contratos fuente y umbrales efectivos están en POM/Vitest. Cobertura no acredita permisos: negativos de propiedad/401/403/CSRF/logout y dos identidades siguen obligatorios.

## Operación y señales
INT/TERM/HUP se reenvían al hijo real; esperar cleanup y conservar salida 130/143/129. Windows requiere propietario Bash para la matriz de proxies; no matar Node a mitad de up. Backend en contenedor por defecto; alternativa host solo con JDK 21, causa documentada y mismas suites. Trampas y recetas de entorno en [SETUP](SETUP.md).
