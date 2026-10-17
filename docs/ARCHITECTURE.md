# Arquitectura de Starter

Base heredada y neutralizada; evidencia del starter registrada en sus propias tareas. Versiones: DEPENDENCIES, decisiones duraderas: adr/.

## Vista general
Monolito modular Spring Boot `/api/v1` + SPA React/nginx o Vite + PostgreSQL 18.6. El navegador usa un único origen client; API/OIDC/logout atraviesan el proxy sin CORS. El server queda interno salvo diagnóstico loopback explícito con forwarding none.

```text
navegador → client (SPA/proxy) → server (MVC/Security/JPA) → db
                                  ↳ Google real / OIDC local explícito
```

## Backend y datos
Paquete neutral `com.example.starter`, groupId com.example, artifactId starter-server. Feature contiene controller/DTO/servicio/persistencia; separar web/application/persistence/domain al crecer. Sin ciclos ni acceso al repositorio de otra feature.
identity crea/recupera app_user por issuer/subject, UUID v7 y constraint única; email/nombre mutables sin otorgar permisos. security mantiene OIDC/sesión/CSRF/origen. shared/error ofrece ProblemDetail con errors de campo ordenados. system expone GET /api/v1/system/info con nombre/versión reales.
Flyway V1 se conserva, JPA validate y open-in-view=false. Instant/TIMESTAMPTZ y JVM UTC; Clock inyectado. DB de pruebas efímera separada del volumen de desarrollo. Sin tablas/reglas del dominio anterior.
La feature CRUD removible, autorización por dueño y migración propia pertenecen a C; todavía no existen. Health con contribución DB y pantalla conectada pertenecen a B; no se atribuyen al health actual.

## Seguridad
Contrato heredado: [auth](specs/S-001-auth-google.md), ADR 0002 y ADR 0003. Revalidar las suites en esta base.
- **Rutas:** health y GET system/info/csrf públicos; inicio `/oauth2/authorization/google` y callback `/login/oauth2/code/google` GET exactos. GET me y GET `/logout` (405) requieren sesión; POST `/logout` exige CSRF. Todo lo demás denegado (incluidas las rutas de documentación salvo el opt-in de [ADR 0003](adr/0003-openapi-swagger-opt-in.md)): una sesión no concede permisos de recursos privados. Formulario/Basic/Bearer deshabilitados; 401/403 como ProblemDetail sin redirects para API.
- **Identidad y sesión:** OAuth2 Login de Spring (`openid profile email`); tras la validación de Spring, `IdentityService` crea/recupera `app_user` por issuer/subject exactos (concurrencia recuperada por la constraint) y el principal lleva solo el UUID local. Sesión en memoria 30 min, `JSESSIONID` HttpOnly/SameSite=Lax/Secure según origen, cambio de ID al login, fallo del callback invalida la sesión previa; destinos fijos `/` y `/login?error=authentication`. me devuelve id/displayName/email/emailVerified, sin tokens/issuer/subject/roles.
- **CSRF:** `csrf.spa()` con cookie `XSRF-TOKEN` legible y header `X-XSRF-TOKEN` exclusivamente (sin query); GET `/api/v1/auth/csrf` 204 la materializa. Login y logout la renuevan.
- **Origen y proxies:** `APP_PUBLIC_URL` validado fija callback/cookies. nginx y Vite descartan todo `Forwarded`/`X-Forwarded-*` entrante, reconstruyen host/proto/port desde ese origen y for desde el peer, y rechazan Host ajeno; el server usa forwarding `framework`, queda interno y un guard compara el request reconstruido antes de efectos auth (400 seguro). El diagnóstico directo usa forwarding `none`.
- **Perfiles:** `google` (default) exige credenciales sin fallback; `test`/`e2e` registran el proveedor local bajo la registration `google`; perfiles mezclados fallan al arrancar.
- **OpenAPI:** springdoc genera desde el código me/csrf/GET y POST logout con esquemas `sessionCookie` (`JSESSIONID`) y `csrfHeader` (`X-XSRF-TOKEN`) (`security/AuthOpenApi`, anotaciones de `AuthController`). Publicación según [ADR 0003](adr/0003-openapi-swagger-opt-in.md) (ADR 0003): `STARTER_API_DOCS_ENABLED` (→ `starter.api-docs.enabled`, false por defecto) gobierna springdoc y el permiso; apagado no hay rutas y toda documentación cae en la regla final (401/403). Encendido exige `APP_PUBLIC_URL` HTTP loopback (`ApiDocsAccess`, falla fija al arrancar) y abre solo GET anónimo de `/api/docs/openapi`, `/api/docs/openapi/swagger-config`, `/api/docs/swagger-ui.html` y `/api/docs/swagger-ui/**`, que atraviesan el proxy `/api/` existente sin ampliar nginx/Vite; `servers` es el origen validado y la UI solo envía GET (`persist-authorization` false, sin CSRF de UI ni URL externa). Lo encienden el overlay E2E y `compose.dev-auth.yml`. Pruebas: `ApiDocsAccessTest`, `ApiDocsDisabledIT`, `OpenApiContractIT` (contrato con el interruptor apagado), `ApiDocsEnabledIT` y `e2e/tests/swagger.spec.ts`.

## Frontend
Estructura `src/app`, `src/features/<feature>`, `src/shared/ui`, `src/shared/forms`, `src/services/http.ts`, `src/test`. Material UI con tema único, TanStack Query para datos remotos, React Hook Form + Zod para formularios de negocio, React Router en modo declarativo. Reglas en [client/AGENTS.md](../client/AGENTS.md).

Implementación heredada:
- `app/`: `App` (BrowserRouter), `AppProviders` (Query + tema + CssBaseline, compartido con las pruebas), `AppRoutes` (shell con rutas hijas y 404), `theme.ts` (tema único, locale `esES`), `queryClient.ts` (reintenta solo red/5xx, hasta 2 veces; nunca 4xx ni respuestas fuera de contrato).
- `services/http.ts`: único cliente `fetch`. `credentials: 'same-origin'`; header CSRF en métodos no seguros mediante un `CsrfTokenResolver` (token leído desde cookie vigente); 4xx/5xx → `ApiError` con `ProblemDetail` (o `null` si el cuerpo no lo es, p. ej. 502 del proxy); red caída → `NetworkError`; cuerpo vacío/no JSON/fuera de esquema → `UnexpectedResponseError`; el aborto se propaga sin envolver. Toda respuesta con cuerpo se valida con un esquema Zod: no hay `any` ni casts en la frontera.
- `shared/ui`: `ErrorAlert` + `errorMessage` (mensajes en español sin detalles técnicos). `shared/forms`: `FormTextField` (TextField controlado por RHF, error accesible por `aria-describedby`) y `applyServerFieldErrors` (vuelca `errors[]` del server junto a cada campo, foco al primero, el resto en `root.server`).
- `features/system`: primera feature de referencia (api + hook de Query + componente con estados cargando/error/éxito).

Implementación heredada:
- `services/csrf.ts` lee la cookie `XSRF-TOKEN` vigente en cada mutación; `services/http.ts` envía su valor en `X-XSRF-TOKEN` solo en mutaciones same-origin y publica cada 401 en `services/sessionEvents.ts` antes de rechazar, sin reintento.
- `features/auth/`: `api.ts` (Zod de me, me 401 = visitante, `renewCsrf`, `withCsrfRenewal` que pide reintento explícito, `logout`), hooks de sesión/CSRF/logout y `AuthSessionProvider`, único intérprete del canal de 401: con usuario es expiración (cancela consultas, elimina la cache Query que no es `['auth', …]` y las mutaciones, mensaje fijo, sin redirección). Logout cancela, limpia, renueva CSRF y navega a `/login`. Si la revalidación trae otra identidad, la cache privada se descarta antes de publicarla. `AppShell` remonta las rutas con key por identidad. `LoginPage` usa un enlace de navegación completa al inicio OIDC.
- Regla para features futuras: datos privados en queries fuera del prefijo `auth`; mutaciones que invaliden en lugar de escribir la cache (ver BACKLOG).

Operación: el contenedor `client` (target `runtime`) sirve el build con nginx y reenvía `/api/`, `/oauth2/`, `/login/oauth2/code/` y `/logout` a `server:8080` con Host/forwarding reconstruidos desde `APP_PUBLIC_URL` (ver Seguridad); resuelve `server` por el DNS de Docker en cada petición (sobrevive a la recreación del server). `/login` y el resto caen en el fallback de la SPA. `client-dev` (perfil `dev`) ofrece Vite con HMR y la misma frontera. Detalle en [SETUP.md](SETUP.md).


## Pruebas y operación
[TESTING](TESTING.md) conserva FULL, negativos y políticas CI; [SETUP](SETUP.md) conserva comandos y trampas. README diferencia el harness local efímero existente del futuro dev.sh persistente.
ADR 0001: versiones/Java/PostgreSQL/build; ADR 0002: OIDC/sesión/CSRF/proxies; ADR 0003: Swagger opt-in loopback/GET/api/docs. Todas heredadas; cambios futuros requieren tarea/ADR/pruebas, sin reinterpretar evidencia previa como ejecución actual.
