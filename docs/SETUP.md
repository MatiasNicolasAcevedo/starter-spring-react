# SETUP · Entorno y operación

Versiones congeladas y efectivas en [DEPENDENCIES](DEPENDENCIES.md). Comandos heredados conservados; evidencia propia por SHA en la tarea activa. No actualizaciones a latest durante extracción.

## Requisitos del host
Docker Desktop abierto (Linux/WSL2), Compose V2 y Git Bash. Node >=24 en host para control cerrado E2E; npm para scripts de navegador. JDK 21 solo para IDE/alternativa backend host; builds ordinarios en contenedor. Entorno de A: Docker 28.5.1, Compose v2.40.2-desktop.1, Git 2.51.1, gh 2.96.0, Node 24.21.0/npm 11.19.0, Corretto 21.0.9. Contenedores Temurin 21.0.12+8, Node 24.21.0, PostgreSQL 18.6.
En PowerShell usar `& "C:\Program Files\Git\bin\bash.exe" scripts/verify.sh`. No ejecutar scripts con otro shell ni modificar configuración global.

## Primer uso local sin Google
Comandos persistentes mínimos en [README](../README.md#modo-local-explícito-sin-credenciales). Cada acción exige --mode local, --proxy nginx|vite y --project starter-dev- seguido de un sufijo propio. El namespace starter-dev-auth- está reservado al harness efímero. Docker Desktop/Compose V2/Git Bash bastan para up/check/down; Node >=24 host sigue siendo requisito separado del controlador FULL/E2E.

La fixture scripts/fixtures/local.env.example contiene solo CLIENT_PORT=5175, CLIENT_DEV_PORT=5176, LOCAL_OIDC_PORT=8090 y STARTER_API_DOCS_ENABLED=false. Para coexistencia, copiar sus cuatro parámetros a un archivo local y pasarlo por --env-file en **cada acción**; elegir puertos distintos libres (1024…65535). El script acepta solo esas claves literales, nunca ejecuta su contenido, rechaza .env y claves Google/APP_PUBLIC_URL/perfiles. Construye el origen HTTP loopback y callback según el proxy. Swagger se activa únicamente cambiando el interruptor a true; URL /api/docs/swagger-ui.html. La fixture de ensayo usa 15175/15176/18090 y Swagger true, exclusivamente datos ficticios.

up construye y espera el stack, o comprueba uno propio ya activo sin recrearlo; check usa el runner Node fijado para comprobar JSON de system/info, readiness DB y discovery/JWKS del issuer exacto sin login. HTML 200, health DOWN, issuer ajeno y respuestas fuera de esquema fallan con diagnóstico fijo. down retira contenedores/red propios y conserva su volumen con huella de source/mode/proxy/origin/puerto OIDC. Usar los mismos parámetros y ruta de checkout para retomar; ante otra huella se rechaza antes de mutar. No ofrece borrado de datos. Un fallo de arranque retira solo recursos creados en ese intento y conserva volúmenes propios previos. Si informa rollback incompleto, inspeccionar solo labels del proyecto registrado; nunca prune.

OIDC local conserva http://host.docker.internal:PUERTO/default desde navegador y backend. Los runners usan DNS Docker y el origen público exacto, sin hosts globales ni desactivar validaciones. Un navegador host es opcional. En Windows, para login manual usar un perfil de navegador efímero propio y resolución por proceso --host-resolver-rules="MAP host.docker.internal 127.0.0.1" (TR-11); no afecta otros perfiles ni el sistema. Las sondas/navegador containerizados son el ensayo portable. No usar un navegador preexistente con cookies personales para automatización.

El harness heredado sigue separado: bash scripts/dev-auth.sh nginx starter-dev-auth-local-nginx session (o vite con su namespace). Perfil e2e y fixtures ficticias explícitas; Ctrl-C/stop elimina su DB. Acciones status/restart/rebuild/stop conservan la sesión efímera y sus negativos. No editar scripts Bash mientras estén corriendo.

## Comandos de verificación aislada
```bash
COMPOSE_ENV_FILES=.env.example COMPOSE_PROJECT_NAME=starter-verify-mi-prueba STARTER_E2E_PROJECT=starter-e2e-mi-prueba STARTER_SERVER_TESTS=container bash scripts/verify.sh
# Al terminar, solo del proyecto propio recién creado:
docker compose --env-file .env.example -p starter-verify-mi-prueba --profile verify down --volumes --remove-orphans
```
Antes de usar ese nombre, comprobar que no tiene recursos: listar container (incluidos detenidos), network y volume con label=com.docker.compose.project=starter-verify-mi-prueba. Si existe, elegir nombre nuevo; nunca adoptar o borrar un stack previo.
El gate no opera DB ordinaria: server-tests usa Testcontainers y caché propia; E2E genera namespace reservado starter-e2e-<sufijo>, comprueba ausencia antes del trap y verifica cero recursos al salir. No usar prune ni down -v ordinario.
Suites: verify.sh --docs/--server/--client/--e2e; --fast es parcial. Diagnóstico directo `node scripts/docs-check.mjs`; matrices `node --test "scripts/ci/*.test.mjs"`.
Proveedor aislado `node scripts/test-oidc-provider-stack.mjs`; frontera proxies `node scripts/test-auth-proxies.mjs`; UI real Windows `node scripts/test-auth-ui-smoke.mjs [--vite]`; desarrollo `node scripts/test-dev-auth.mjs nginx|vite`. Los scripts de navegador host requieren `npm ci --prefix e2e --no-audit --no-fund` y Edge Windows preexistente; el runner E2E Chromium containerizado es el camino portable, sin navegador instalado en host.
Regresión de proxy `node scripts/test-proxy-outage.mjs` requiere un proyecto de ensayo propio healthy y COMPOSE_PROJECT_NAME propio: detiene/restaura su server/client, jamás dirigirla a datos del dueño.

## Puertos, variables y origen
Base ordinaria: client http://127.0.0.1:5173, client-dev 5174, DB 127.0.0.1:55432. Server interno server:8080; diagnóstico directo únicamente compose.diagnostic.yml con forwarding none y loopback. HTTP del navegador nunca usa nombres de servicios Docker.
.env.example declara defaults ficticios starter, STARTER_* y APP_PUBLIC_URL. Google ID/secret vacíos sin fallback. POSTGRES_DB/USER/PASSWORD, DB_PORT, CLIENT_PORT, CLIENT_DEV_PORT; STARTER_SERVER_TESTS=container|host; STARTER_API_DOCS_ENABLED=false; STARTER_API_TARGET y STARTER_WATCH_POLLING para Vite. VITE_* son públicas; jamás secretos/tokens en bundle.
Un origen absoluto sin path/query/fragment/userinfo: HTTPS o HTTP loopback. Proxies eliminan todo Forwarded/X-Forwarded-* entrante, reconstruyen host/proto/port desde config y for desde peer; rechazan Host ajeno. Callback fijo `${APP_PUBLIC_URL}/login/oauth2/code/google`. HTTPS simulado prueba cookies/origen, no TLS desplegado.

## Google OIDC real
Solo el dueño configura y opera este camino. Perfil default google exige APP_PUBLIC_URL, GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET backend. Issuer fijo https://accounts.google.com, scopes openid profile email; no fallback ni mezcla con test/e2e.
Guía heredada, a revalidar por el dueño al usarla: en Google Auth Platform crear app/audiencia y cliente Web; incluir cuenta de prueba si está Testing. Redirect URI exacta http://127.0.0.1:5173/login/oauth2/code/google (o 5174 si se elige Vite), sin comodines; despliegue real HTTPS. No requiere JavaScript origins ni SDK browser. Guardar secreto en gestor y .env privado ignorado, nunca chats/PR/logs.
Con su configuración privada: `docker compose up -d --build --wait`; abrir UI, ingresar, recargar, logout y me 401. Cancelación muestra mensaje fijo; logout local no cierra Google. Reiniciar/rebuild conserva identidad DB pero pierde sesión en memoria. `docker compose down` conserva volumen; no usar down -v con datos persistentes sin autorización específica.
Registrar fecha/resultado saneados en HANDOFF S-03, sin emails/nombres/cookies. Estado actual: pendiente externo del dueño; agentes no lo operan.
Fuentes de la guía: [Google servidor web](https://developers.google.com/identity/protocols/oauth2/web-server), [clientes](https://support.google.com/cloud/answer/15549257), [audiencia](https://support.google.com/cloud/answer/15549945).

## OpenAPI y Swagger UI opt-in (ADR 0003)
STARTER_API_DOCS_ENABLED=false por defecto. Activación solo HTTP loopback; un origen HTTPS/externo o valor distinto de true/false falla con mensaje fijo. Overlays E2E/dev-auth activan explícitamente.
Mismo origen del client: GET /api/docs/swagger-ui.html → index/recursos, /api/docs/openapi JSON y /api/docs/openapi/swagger-config. GET exclusivamente, servers fijo, UI sin persistAuthorization ni CSRF de UI. Try it out system/info devuelve API real, me anónimo 401. Defaults /v3/api-docs y /swagger-ui no se abren: pueden caer en SPA por proxy, HTTP 200 sin contenido OpenAPI no es éxito.
Perfil real apagado/restringido según ADR, CSRF intacto en mutaciones. Probar nginx y Vite; B agrega conexión health DB y rutas exactas, sin exposición amplia de Actuator.

## Trampas conocidas
| ID | Síntoma / causa | Regla comprobada de la base, a revalidar |
|---|---|---|
| TR-01 | JVM Windows envía America/Buenos_Aires y PostgreSQL Debian sin tzdata-legacy la rechaza | -Duser.timezone=UTC en runtime, Surefire/Failsafe |
| TR-02 | CRLF/LF por autocrlf de sistema | .gitattributes fuerza LF salvo cmd/bat/ps1; no cambiar config global |
| TR-03 | localhost de server-tests es el runner | Socket Docker + TESTCONTAINERS_HOST_OVERRIDE=host.docker.internal, host-gateway Linux. Tras dos configuraciones documentadas fallidas, alternativa preaprobada STARTER_SERVER_TESTS=host con JDK21, mismas suites; documentar motivo/ADR, no reducir IT |
| TR-04 | GitHub agrega require_extra_approval_for_unattributed_changes=true al ruleset | Registrar respuesta efectiva; no modificar para destrabar merge ni tratar comentario como aprobación formal |
| TR-05 | target de server contiene archivos Linux | Bind mount del runner, reportes ignorados; clean regenera. No compilar simultáneamente host/runner sobre el mismo target |
| TR-06 | setup-java no resuelve 21.0.12+8 | CI usa 21.0.12+8.0.LTS, misma build que imagen 21.0.12_8 |
| TR-07 | synchronize draft viejo puede sobrevivir ready_for_review | Esperar push CI antes de ready; clasificador consulta draft vigente por API. DRAFT no cuenta como verde |
| TR-08 | Caída backend con IP cacheada tarda pese a resolver_timeout | resolver_timeout 1s y proxy_connect_timeout 1s; test outage exige 502/504 antes de 3s y recuperación. Son límites DNS/conexión separados, no garantía de latencia de lectura |
| TR-09 | HMR con bind Windows no emite eventos | STARTER_WATCH_POLLING=true; probar cambio DOM sin navegar y restaurar fuente |
| TR-10 | headless window-size a 375 recorta por mínimo 504 | CDP Emulation.setDeviceMetricsOverride para smokes; Playwright viewport 375/1280 |
| TR-11 | host.docker.internal Windows no apunta a loopback publicado | Resolución por proceso del hostname exacto en probe/Edge; preservar URL/Host/issuer/claims. Docker usa alias de red; sin hosts globales ni desactivar validaciones |
| TR-12 | TEMP Git Bash aparece /tmp y control E2E no ve request.json | Con MSYS_NO_PATHCONV, convertir solo STARTER_E2E_ARTIFACTS con cygpath -m; Node Windows y bind Docker usan misma ruta nativa. Linux conserva ruta. Verificar bind/sonda bidireccional; no aumentar timeouts |
| TR-13 | Docker reasigna el puerto host dinámico al stop/start; el datasource de Testcontainers conserva el anterior | ReadinessIT interrumpe PostgreSQL con pause/unpause en la misma dirección; el ensayo Compose prueba stop/start por servicio interno. No ampliar timeouts ni cambiar el datasource para ocultar el fallo. Reproducción propia en T-001 |
| TR-14 | El ensayo contaba como recuperación el check negativo con la DB aún detenida | Sincronizar navegador/controlador antes de start: la ventana de 30 s incluye arranque y recuperación, después del check negativo. Mantener caída y recuperación separadas y los límites intactos; evidencia en T-001 |
| TR-15 | En Linux Docker crea un bind source ausente como root y el host no puede escribir IPC/HMR | El ensayo crea su directorio nuevo de artefactos desde el host antes del primer bind, después de validar ausencia e instalar cleanup. No cambiar permisos globales; reproducción root/UID 1000 en T-001 |

Cleanup se instala antes de build/up, después de rechazar namespace ajeno y recursos preexistentes. Preservar fallo/señal original; error de limpieza también rechaza verde. Revisar labels en container -a, network y volume; cero residuales propios. No editar scripts Bash en ejecución.
