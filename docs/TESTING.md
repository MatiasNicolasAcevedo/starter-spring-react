# Pruebas y verificación

**Fase actual: `FULL`** de aplicación. Mantener suites, negativos, assertions, cobertura, aislamiento, retries y deadlines. Un check de herramientas verde no acredita tests de aplicación ni despliegue.

El trabajo de todos los días cierra con el [gate diario](#gate-diario): pruebas unitarias y E2E dirigidas, en unos 20 minutos. FULL, la suite E2E completa, STARTER y tooling son [gates diferidos](#gates-diferidos): existen, se conservan intactos y **solo se ejecutan cuando el dueño lo ordena en la sesión**. Proceso completo en [WORKFLOW](WORKFLOW.md#gates).

## Gate diario
Lo corre el implementer al cerrar la tarea, sobre el HEAD que publica. Los comandos exactos están en la tarea.

| Paso | Cuándo aplica | Comando de referencia |
|---|---|---|
| Unitarias y de componente de lo tocado | Siempre que cambie código | Backend: `./mvnw -q test -Dtest=NombreTest` en server/. Client: `npx vitest run ruta/al/archivo.test.tsx` en client/ |
| IT dirigido con PostgreSQL | Cambia persistencia, consulta, constraint o permiso | `./mvnw -q verify -Dit.test=NombreIT -Djacoco.skip=true` en server/. `-Djacoco.skip` evita presentar cobertura parcial como gate global; no cambia umbrales |
| Typecheck del cliente | Cambia client/ | `npx tsc -b` en client/ |
| E2E dirigido | Cambia un flujo de usuario, el proxy o la sesión | `bash scripts/e2e.sh --grep "patrón" --project desktop` con `STARTER_E2E_PROJECT` propio. API, base y OIDC reales; un solo proyecto salvo que la tarea pida móvil |
| Documentos | Siempre | `node scripts/docs-check.mjs` y `git diff --check` |
| Perfil del diff | Siempre, solo informativo | `bash scripts/verify.sh --policy origin/main`; anotar el perfil y `FULL/STARTER: DIFERIDO POR EL DUEÑO` |
| CI | Siempre | `verify-required` verde sobre el HEAD publicado |

Si `scripts/e2e.sh` de este proyecto todavía no acepta `--grep`/`--project`, el E2E dirigido es `bash scripts/verify.sh --e2e` mientras la suite quepa en el presupuesto; si no cabe, se difiere y se anota. No invocar `node scripts/run-e2e.mjs` ni `docker compose … playwright test` a mano: sin el entorno que arma `e2e.sh` fallan o pierden el cleanup.

Presupuesto orientativo: 20 minutos de pared para todo el gate. Si una corrida lo supera, detenerla, registrar comando y duración, acotar el filtro y continuar. No subir timeouts ni retries para que entre.

## Gates diferidos
| Gate | Comando | Qué agrega |
|---|---|---|
| FULL de aplicación | `bash scripts/verify.sh` | Backend completo con IT y cobertura, cliente completo y toda la suite Playwright |
| Suite E2E completa | `bash scripts/verify.sh --e2e` | Todos los specs en escritorio y móvil; crece con el producto y puede pasar la hora |
| STARTER | `bash scripts/verify.sh --starter` | FULL más la matriz de herramientas |
| Tooling | `bash scripts/verify.sh --tooling` | Inicializador, copia compilable, CLI, proxies, fallos y señales |
| FULL remoto | workflow manual [full.yml](../.github/workflows/full.yml) | Lo mismo en GitHub Actions |

- Ningún agente los inicia por su cuenta: ni al cerrar una tarea, ni al revisar, ni al terminar un lote, ni porque `--policy` informe `FULL` o `STARTER`. Hace falta la orden expresa del dueño en esa sesión.
- La tarea registra `FULL/STARTER: DIFERIDO POR EL DUEÑO`. No se escribe aprobado, satisfecho ni no aplica.
- El agente puede **recomendar** el integrado, en una línea del cierre y en el registro «Gates diferidos» de STATUS, cuando: se cerró un lote o se mergearon unas diez tareas desde el último integrado; se acerca un deploy a producción; el diff tocó dependencias, lockfiles, Docker/Compose, workflows, autenticación o migraciones; o hay una regresión que los dirigidos no explican.
- Cuando el dueño lo ordena: fuentes congeladas, checkpoint previo con SHA/base, comando, namespaces y cleanup; una sola corrida sobre el diff acumulado desde el último integrado; evidencia en la tarea y registro de STATUS actualizado con el SHA nuevo. Un corte anterior acredita solo lo que contiene.
- Las pruebas dirigidas y la CI liviana no acreditan el integrado. La deuda queda visible en STATUS; no bloquea el merge diario.

## Comandos
Desde la raíz con Git Bash, Docker Desktop Linux y Node >=24. PowerShell puede invocar el mismo gate: [entrada y diagnóstico Windows](SETUP.md#verificación-desde-powershell). Comprobar Bash/Node/PATH en la superficie propia; conservar exit y cleanup. Una receta manual de E2E no sustituye FULL. Usar `.env.example` y proyectos Compose nuevos propios; comprobar labels ausentes antes de empezar y limpiar solo esos recursos.

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

## Perfil del diff y alcance del integrado
Dirigidos durante cada ajuste; el gate diario al cerrar las fuentes técnicas de la tarea, no en cada commit. Frontera deja el comando concreto. `bash scripts/verify.sh --policy origin/main` clasifica los commits finales; revisar también el diff sin commit antes de publicar. El perfil indica qué gate integrado correspondería a ese diff **cuando el dueño lo ordene**; no dispara nada.

| Perfil del diff | Gate diario | Integrado que correspondería (diferido) |
|---|---|---|
| DOCUMENTATION / DOCS_ONLY | docs-check y `git diff --check` | Ninguno |
| APPLICATION | Dirigidos de la tarea | FULL sin opciones |
| STARTER | Dirigidos de la tarea más los tests Node de la herramienta tocada (`node --test "scripts/ci/*.test.mjs"`, `node --test scripts/test-init-project.mjs`) | FULL + `--tooling`, o `--starter` |

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

## Cómo se ejecuta un integrado ordenado por el dueño
Con SHA/base, huella antes/después, comandos, logs saneados y cleanup en la tarea. No editar fuentes durante la corrida. Una transición solo Markdown conserva esa evidencia si base y fuentes técnicas coinciden. La revisión es independiente y no lo repite.

DOCS_ONLY acepta solo archivos regulares A/M de Markdown raíz/docs, AGENTS/CLAUDE conocidos y LICENSE. Código/scripts/workflows/locks, Markdown técnico, renombres/borrados, modos especiales, diff vacío o error exigen FULL. El clasificador conservador no sustituye comprobar las fuentes probadas.

## CI y merge
CI automática [ci.yml](../.github/workflows/ci.yml): solo PR, un job `verify-required`, matrices Node de herramientas/docs/clasificación, sin Docker ni dependencias de aplicación. HEAD real, concurrencia con cancelación y timeout 5 minutos. Puede ser verde en draft; no acredita FULL. Antes de merge: CI propia del HEAD/base exactos, gate diario válido para esas fuentes/base, veredicto independiente y AUTONOMY. No cambiar protecciones para destrabar.

FULL remoto [full.yml](../.github/workflows/full.yml): exclusivamente manual `workflow_dispatch`, no push/PR/calendario. El perfil calculado agrega tooling dentro del job E2E solo si STARTER; en APPLICATION corre solo Playwright real. Conserva backend/client/E2E y agregado estricto `full-result`: FULL exige todas sus suites success; DOCS_ONLY requiere las técnicas skipped. Fallo, ausencia, cancelación o pendiente de una suite exigida nunca cuenta como éxito.

## Qué mide el tiempo
`verify.sh` emite `TIMING suite=... seconds=... exit=...`. La entrada integrada añade `TIMING integration=...` por ensayo. Son tiempos de pared: incluyen construcción, inicio, tests y cleanup de cada etapa, sin restar trabajo concurrente. El resumen Maven incluye compilación/arranque además de JUnit; Vitest separa tests y entorno. Los builds Docker informan duración por paso, algunas superpuestas: no sumarlas como tiempo de pared.

El perfil STARTER incluye probar que otra copia personalizada compila: vuelve a ejecutar backend/frontend y varios stacks nuevos de persistencia/proxy/rollback. FULL cotidiano no incluye esa matriz. El tiempo de Playwright no equivale a toda la fase E2E. Cuantificar antes de optimizar; no llamar unitarios al tiempo de construir contenedores. Mediciones concretas en la tarea vigente, sin prometer una duración fija.

## Cobertura y seguridad
Referencia backend: mínimos 80% líneas y 70% ramas en dominio/servicios; client API/hooks 80/70, sin rebajar. Los contratos fuente y umbrales efectivos están en POM/Vitest. Cobertura no acredita permisos: negativos de propiedad/401/403/CSRF/logout y dos identidades siguen obligatorios.

## Operación y señales
INT/TERM/HUP se reenvían al hijo real; esperar cleanup y conservar salida 130/143/129. Windows requiere propietario Bash para la matriz de proxies; no matar Node a mitad de up. Backend en contenedor por defecto; alternativa host solo con JDK 21, causa documentada y mismas suites. Trampas y recetas de entorno en [SETUP](SETUP.md).
