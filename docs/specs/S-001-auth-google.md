---
id: S-001
status: approved
version: 1
milestone: M0
tasks: []
---
# S-001 · Identidad Google, sesión backend y CSRF

## Problema y usuario
Visitante y usuario autenticado necesitan entrar, reconocer su sesión y salir sin exponer credenciales a la SPA. Contrato vigente, comprobado por las suites de auth. Decisión duradera: [ADR 0002](../adr/0002-google-oidc-session-csrf-and-proxy.md).

## Historias y reglas
1. Visitante inicia una navegación completa a `/oauth2/authorization/google`; Spring Security ejecuta Authorization Code con `openid profile email`. Intercambio del code, ID token, validación y UserInfo ocurren en backend. No password, Basic, JWT propio, implicit flow ni tokens del proveedor en JavaScript, almacenamiento o respuestas API.
2. Spring valida firma/JWKS, issuer configurado, audiencia/client ID, expiración y nonce; correlaciona state con la solicitud guardada en sesión. Callback sin solicitud, state distinto, nonce ausente/distinto, token vencido/alterado, issuer/aud incorrectos o error del proveedor no crea identidad ni sesión autenticada. No implementar un validador OIDC artesanal.
3. Solo tras OIDC válido, servicio transaccional crea/recupera `app_user` por `(issuer, subject)` exactos y no vacíos. UUID v7 ya existente. Email/nombre son atributos mutables, nunca claves de enlace ni permisos; `emailVerified` ausente se interpreta false. Email/nombre pueden ser null. Cambio de correo conserva ID; mismo email con subject o issuer distintos crea usuarios distintos. No se fusionan cuentas. Concurrencia: la constraint única evita duplicados y un conflicto se recupera releyendo en una transacción válida (no continuar una transacción abortada).
4. La sesión contiene la identidad local autenticada; no hay roles de aplicación derivados de claims, dominio o email. No se crean recursos de dominio aquí. Google no se restringe por dominio. Un email no verificado no bloquea login; cualquier permiso futuro exigirá una regla específica.
5. Login renueva el identificador de sesión (protección de fijación de Spring). Sesión de servidor en memoria, timeout de inactividad explícito 30 min, sin remember-me. Reiniciar backend pierde sesión pero conserva `app_user`. Cookie `JSESSIONID`, host-only, Path `/`, HttpOnly, SameSite=Lax, sin Max-Age persistente; Secure si el origen público es HTTPS y false solo para HTTP loopback de desarrollo/prueba. Sesión se transporta exclusivamente por cookie, sin `;jsessionid` en URLs.
6. CSRF activo en todos los métodos no seguros, incluido logout. `csrf.spa()` con repositorio cookie: `XSRF-TOKEN`, legible por JS, host-only, Path `/`, SameSite=Lax, Secure según origen; cliente envía `X-XSRF-TOKEN` leído de cookie en cada mutación same-origin. Esta cookie es protección CSRF, nunca credencial OIDC. Sin disable, ignores globales, CORS ni token en query string. Limpiar token anterior al login/logout y materializar uno nuevo mediante GET `/api/v1/auth/csrf` antes de otra mutación.
7. API privada anónima → 401 ProblemDetail sin redirect a Google; token CSRF ausente/inválido → 403 ProblemDetail, incluso sin sesión (el filtro CSRF puede rechazar primero). Sesión válida sola no autoriza endpoints privados futuros futuros. Excepciones anónimas exactas: health existente, GET system/info, GET auth/csrf, inicio OIDC y callback de la registration `google`. No abrir `/api/**` ni todas las registrations.
8. Éxito OIDC → 302 a `/`; error/cancelación → 302 a `/login?error=authentication`. Destinos fijos internos, sin `returnTo`, SavedRequest arbitraria, `next` ni parámetros del proveedor reflejados. No crear sesión autenticada ante fallo de DB. Logs/respuestas sin code, state, nonce, ID/access token, secreto, email real ni stacktrace. No hace falta cerrar la sesión de Google ni revocar su cuenta para salir de Starter.

## Contrato backend
Todas las respuestas auth llevan `Cache-Control: no-store`; DTOs `record`, validación client por Zod. Instantes y perfiles solo del usuario actual.

| Método/ruta | Actor | Respuesta y efectos |
|---|---|---|
| GET `/oauth2/authorization/google` | Visitante | 302 a Google (o proveedor local exclusivo de test/e2e); guarda correlación en sesión, ningún `app_user` todavía |
| GET `/login/oauth2/code/google` | Callback correlacionado | OIDC válido: alta/actualización local y sesión, 302 `/`; inválido/cancelado: 302 `/login?error=authentication`, sin alta ni nueva autenticación |
| GET `/api/v1/auth/me` | Autenticado | 200 `{"id":"01900000-0000-7000-8000-000000000001","displayName":"Persona Demo","email":"persona@example.com","emailVerified":true}`; `displayName` y `email` nullable. No issuer, subject, tokens, authorities ni roles de aplicación. Sin sesión: 401 ProblemDetail |
| GET `/api/v1/auth/csrf` | Visitante o autenticado | 204 sin body; materializa cookie CSRF nueva si falta. No cambia identidad ni confiere acceso; después de login/logout/recarga el client puede obtenerla |
| POST `/logout` | Sesión + CSRF válido | 204 sin body/redirect, invalida sesión, elimina cookies de sesión/CSRF y limpia contexto/autorizaciones OAuth del backend. Anónimo con CSRF válido: 204 idempotente. Sin CSRF o inválido: 403. GET no cierra sesión ni muestra formulario: 401 sin sesión, 405 autenticado |

ProblemDetail `application/problem+json` usa el manejador base, `status` 401 o 403 y mensaje seguro en español. No adicionar información del proveedor a `detail`. Métodos vecinos y rutas no permitidas conservan deny-by-default.

## Origen público y forwarded headers
- `APP_PUBLIC_URL` es origen absoluto sin path/query/fragment/userinfo, con puerto explícito si no es estándar. HTTPS válido; HTTP solo loopback para uso local. Valores ficticios de guía: `http://127.0.0.1:5173` (nginx) o `http://127.0.0.1:5174` (Vite), nunca `server:8080`. Una configuración elige un origen a la vez; usar otro requiere ajustar variable y redirect autorizado.
- Redirect URI de registration: `${APP_PUBLIC_URL}/login/oauth2/code/google`, fijo desde configuración validada; no se deriva de headers arbitrarios. El request público reconstruido debe coincidir con ese origen en rutas auth; discrepancia → 400 genérico sin redirect externo ni cookie con atributos incorrectos.
- Activar `server.forward-headers-strategy=framework` únicamente junto a la frontera confiable: nginx y Vite eliminan `Forwarded` y `X-Forwarded-*` entrantes (incluidos port/prefix/ssl) y reconstruyen host/proto/port desde el origen validado, y for desde el peer. No acumular valores enviados por navegador. Rechazar Host ajeno en el proxy. No doble procesamiento framework/native.
- Server queda interno en Compose ordinario; publicación loopback solo por override/perfil de diagnóstico con forwarding deshabilitado. `/actuator/health` sigue accesible dentro de Compose. No existe acceso público directo que pueda saltar el proxy. Test de HTTPS detrás de proxy simulado demuestra redirect y cookies Secure; no afirma despliegue TLS real.
- Probar petición con Host/Forwarded/X-Forwarded-Host/Proto/Port/Prefix falsificados contra ambos proxies: jamás Location a origen atacante, cambio de callback ni downgrade de Secure. La elección de framework confía en la frontera; por sí sola no filtra proxies maliciosos.

## Proveedor local y perfiles
Perfil ordinario `google` (default explícito) registra solo issuer Google `https://accounts.google.com`, con `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` únicamente backend. Credenciales ausentes → error de arranque claro sin imprimir valores; no fallback al mock. `test`/`e2e` registran el proveedor local bajo registration ID `google` para probar las mismas rutas. Combinación de perfiles reales y locales → fallo de arranque. Variables locales nunca pueden reemplazar issuer en perfil real; sin bandera que desactive validación.

Imagen de prueba fijada `ghcr.io/navikt/mock-oauth2-server:3.0.3`. PostgreSQL `postgres:18.6`, proyectos aislados y datos ficticios; mock fuera del Compose ordinario, configuración de claims solo en pruebas. Issuer único idéntico en discovery, `iss` y ClientRegistration, alcanzable por backend y navegador; authorization, token, JWKS y UserInfo reales. Topología prevista: `http://host.docker.internal:8090/default`, puerto parametrizable; alias de red al proveedor con ese mismo puerto interno para runners/browser containerizados, publicación loopback para navegador Windows. Verificar resolución/readiness en ambos lados antes del callback; en CI/browser containerizado usar alias de red. Windows usa resolución por proceso exclusivamente para host.docker.internal hacia loopback, manteniendo URL/Host/issuer; requisito y prueba en SETUP. Sin cambiar hosts global del dueño ni desactivar issuer/TLS. Si la topología no satisface esto, checkpoint de la misma parte y ajustar conectividad conservando el contrato de issuer.

Los negativos de protocolo usan respuestas controladas del proveedor con firmas/claims inválidos, no `oidcLogin()` ni mocks de autenticación. Si el mock no expone una variante, usar fixture HTTP/JWKS de test o dependencia de test exacta del mismo proyecto, con alcance y gate registrados; nunca una rama permisiva del código real. No conectar a Google desde CI.

## Frontend
`/login`: «Continuar con Google» como enlace/navegación completa same-origin, mensaje fijo accesible ante fallo/cancelación y opción de reintentar; sin mostrar `error_description`. Shell consulta `/auth/me`: cargando → anónimo (401 esperado) o usuario con nombre/email de fallback y «Cerrar sesión». El usuario ve estado de sesión, sin roles ni selectores inventados.

Al montar/recargar y tras autenticación, GET csrf antes de permitir mutaciones. Resolver lee cookie actual en cada request; no retiene un token anterior. Sesión se revalida al recuperar foco. 401 de API privada cancela consultas, borra datos privados/cache y estado local privado, informa «La sesión terminó. Volvé a ingresar.»; nunca reintenta 401 ni redirige automáticamente en bucle. 403 explica rechazo y no da por terminada una sesión válida. No reenvía una mutación automáticamente al renovar CSRF: obtiene token y pide reintentar explícitamente.

Logout: deshabilitar botón mientras pendiente, cancelar requests de usuario y evitar que resultados en vuelo repueblen cache; 204 limpia Query y estado privado, obtiene csrf anónimo y navega a `/login`. Red/5xx/403 mantiene mensaje y permite reintento sin afirmar cierre confirmado; 401 comprobado aplica expiración. Pruebas con dos identidades consecutivas demuestran que la segunda no ve cache de la primera. Loading/error/success visibles, teclado/roles accesibles, 375/1280 px sin overflow.

## Datos y compatibilidad
Usar `app_user` y constraint única de V1; ninguna nueva tabla de dominio o token persistido. Actualizar atributos y `updated_at` con Clock UTC, conservar `id/issuer/subject/created_at`. Probar alta repetida/concurrente sobre PostgreSQL real. No borrar usuarios al logout. Sin migración prevista; si cambia el esquema, justificar dentro de esta tarea con prueba desde DB vacía y existente, sin tocar V1 publicada. Reversión de código de auth conserva identidades; no elimina volumen ni datos. OpenAPI documenta me/csrf y seguridad cookie/CSRF sin ejemplo de credencial real.

## Criterios de aceptación
Contrato y matriz de autenticación. Las pruebas siguen presentes; ejecutar FULL/CI sobre el SHA publicado. OpenAPI apagado conserva denegaciones; ADR 0003 define opt-in local GET bajo /api/docs. Google real siempre pendiente externo del dueño hasta su evidencia.

| ID | Dado / cuando / entonces | Contrato | Nivel / archivo previsto | Estado |
|---|---|---|---|---|
| AC-01 | OIDC válido crea usuario; segundo login conserva ID y actualiza atributos; mismo email con identidad distinta no fusiona; concurrencia no duplica | Contrato genérico de auth | unit `IdentityServiceTest`; PostgreSQL `IdentityServiceIT` | Verificar en la adopción |
| AC-02 | Login por HTTP real recorre authorize/token/JWKS/UserInfo/callback, cambia session ID y me identifica al usuario; recarga conserva sesión | Contrato genérico de auth | protocolo `OidcLoginIT` + smoke navegador | Verificar en la adopción |
| AC-03 | Anónimo me/privada → 401 JSON; login no da roles de aplicación; rutas vecinas no se abren | Contrato genérico de auth | slice `AuthControllerTest`, `SecurityConfigTest` con oidcLogin | Verificar en la adopción |
| AC-04 | CSRF obtenido permite POST; ausente/incorrecto → 403; login/logout renuevan cookie y el token anterior no valida sin su cookie correspondiente | Contrato genérico de auth | slice + HTTP `OidcLoginIT`, client `csrf.test.ts` | Verificar en la adopción |
| AC-05 | Logout POST → 204, sesión vieja no accede a me, cookies borradas; GET no cierra; DB conserva usuario | Contrato genérico de auth | slice + protocolo `OidcLoginIT` | Verificar en la adopción |
| AC-06 | state/nonce erróneos o ausentes, issuer/aud erróneos, firma alterada, token vencido y cancelación fallan sin alta/auth; callback huérfano/repetido no reutiliza sesión | Contrato genérico de auth | HTTP `OidcLoginIT` con proveedor/fixtures reales | Verificar en la adopción |
| AC-07 | Proxy respeta APP_PUBLIC_URL, callback/origen público/puerto exactos; HTTPS Secure, HTTP local permitido; spoofing y acceso directo no amplían confianza | Contrato genérico de auth | HTTP `PublicOriginIT` + comprobación nginx/Vite aislados | Verificar en la adopción |
| AC-08 | Perfiles reales no seleccionan mock; perfil mixto/config inválida falla; sin credenciales no hay fallback; issuer/JWKS alcanzables desde ambos lados | Contrato genérico de auth | arranque `OidcProfileTest` + integración/red | Verificar en la adopción |
| AC-09 | UI entrada/sesión/logout/cancelación/error/reintento accesibles; 401 limpia cache; 403/red no fingen logout; no tokens del proveedor en browser | Contrato genérico de auth | componentes `AuthSession.test.tsx`, `AppRoutes.test.tsx`, `http.test.ts` + navegador 375/1280 | Verificar en la adopción |
| AC-10 | Docs y OpenAPI corresponden al código; guía Google exacta y estado real externo explícito; FULL verde local y CI del HEAD | Contrato genérico de auth | gate `bash scripts/verify.sh`; revisión SHA/CI; smoke Google externo separado | Verificar en la adopción |

Para CSRF cookie/header no prometer revocación server-side de toda pareja antigua: demostrar borrado/renovación y rechazo del header viejo con cookie vigente. Timeout con configuración acotada o invalidación controlada, sin esperar 30 minutos.

## Fuera de alcance
Dominio, roles propios del producto, invitaciones, JWT/passwords propios, SDK Google en browser, offline/refresh, Redis/Spring Session, revocación global, despliegue o TLS real. Smoke humano Google separado, sin agentes/credenciales reales.

## Compatibilidad y pruebas
Todas las reglas y los diez AC se conservan. Protocolo real: OidcLoginIT/OidcFailureIT; origen/perfiles: PublicOriginIT/OidcProfileTest; client AuthSession/AppRoutes/http/csrf; OpenAPI y Playwright. Specs de propiedad futuras se agregan sobre esta base, sin permisos derivados de claims.
Callback fallido con sesión previa la invalida: evita replay pero permite logout forzado cross-site; conducta que debe evaluarse explícitamente antes de cambiarla.
