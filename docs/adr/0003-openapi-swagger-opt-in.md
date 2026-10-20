# ADR 0003 · Publicación opt-in de OpenAPI y Swagger UI

- **Estado:** decisión vigente; implementación y suites conservadas, evidencia propia pendiente de revalidación.
- **Ámbito:** starter genérico y futura adopción, sin dominio de negocio.

## Contexto
springdoc genera el contrato desde código. La publicación por defecto queda denegada; el opt-in debe permanecer bajo el prefijo API ya proxificado. Su existencia en el POM no prueba accesibilidad desde el navegador.

## Decisión
1. **Interruptor único, apagado por defecto.** `starter.api-docs.enabled`, mapeado explícitamente desde `STARTER_API_DOCS_ENABLED` con valor por defecto `false` en `application.yaml`, Compose ordinario y `.env.example`. Gobierna a la vez `springdoc.api-docs.enabled`, `springdoc.swagger-ui.enabled` y el permiso de seguridad. Apagado: springdoc no registra rutas y toda ruta de documentación (nueva o por defecto) sigue denegada por la regla final (401 anónimo, 403 con sesión). Perfiles `google` (por defecto) y `test` quedan apagados.
2. **Solo desarrollo local.** Encenderlo exige `APP_PUBLIC_URL` HTTP loopback (`localhost`, `127.0.0.1`, `[::1]`); con HTTPS u otro host el arranque falla con mensaje fijo, sin repetir la configuración. Lo encienden explícitamente el overlay E2E y la entrada `dev-auth`; el stack ordinario puede activarlo solo por variable propia del dueño.
3. **Rutas bajo `/api/docs/`**, para atravesar los proxies existentes sin ampliar su allowlist ni su saneamiento: documento `GET /api/docs/openapi`, configuración `GET /api/docs/openapi/swagger-config`, UI `GET /api/docs/swagger-ui.html` (redirección) y `GET /api/docs/swagger-ui/**` (index y recursos). Encendido, la seguridad permite exactamente esos patrones y solo GET; siguen denegados `/api/docs/openapi.yaml`, `/v3/api-docs/**`, `/swagger-ui/**`, `/webjars/**` y cualquier otro método. Si springdoc exigiera una ruta fuera del prefijo, la implementación se detiene con checkpoint y propuesta: no se amplía nginx/Vite sin enmendar este ADR.
4. **Acceso anónimo a la documentación encendida; la UI no concede permisos.** El documento describe un contrato ya público (repositorio MIT) y no contiene credenciales (prueba vigente). Cada llamada de la UI atraviesa la cadena normal same-origin: `GET /api/v1/system/info` 200, `GET /api/v1/auth/me` sin sesión 401 ProblemDetail, todo lo no declarado denegado. Sin CORS, OAuth2 de Swagger, bearer ni nuevos esquemas.
5. **UI de solo lectura.** `supported-submit-methods: [get]`: «Try it out» no ofrece POST `/logout` ni mutaciones (CSRF y logout siguen probados por S-001); `persist-authorization: false`; el soporte CSRF de la UI permanece apagado.
6. **`servers` fijo:** el documento declara como único servidor el `APP_PUBLIC_URL` validado, nunca un valor reconstruido del request.
7. **Límites:** nginx, Vite, `PublicOriginFilter`, cookies, CSRF, sesión, OIDC, CI y ruleset intactos.

## Alternativas consideradas
- **Seguir sin publicar** y validar solo por el bean: no demuestra uso real ni sirve al desarrollo; incumple el pedido del dueño.
- **Rutas por defecto `/v3/api-docs` y `/swagger-ui/**` ampliando nginx/Vite:** agranda la frontera saneada de dos proxies y sus pruebas de spoofing sin necesidad.
- **Contenedor swagger-ui aparte con un documento exportado:** imagen/pin nuevos y no prueba el documento servido por la aplicación real.
- **Exigir sesión para ver la documentación:** acopla el desarrollo ordinario a Google/OIDC sin aportar confidencialidad (contrato público).
- **Encender por perfil Spring (`e2e`):** ese perfil ya selecciona el proveedor local; mezclaría responsabilidades e impediría el opt-in en otros modos locales.
- **Encendido por defecto en desarrollo:** contradice «sin abrir documentación por defecto».

## Consecuencias
Swagger UI queda utilizable en E2E y desarrollo aislado sin tocar la frontera de proxies; un despliegue HTTPS no puede encenderla por error. Costo: una propiedad validada y un permiso condicional en `SecurityConfig`, más su matriz. Revertir: apagar la variable (comportamiento idéntico al actual) o quitar la propiedad y el permiso; no hay datos ni migraciones.

**Pruebas obligatorias ( riesgo elevado, sin debilitar las vigentes):**
- Unitarias de la validación: apagado por defecto; loopback HTTP admitido; HTTPS/otro host rechazado sin eco de la configuración.
- IT apagado (perfil `test`): documento, UI, `/v3/api-docs` y `/swagger-ui/index.html` en 401; `OpenApiContractIT` conserva sus cuatro casos.
- IT encendido (contexto completo, PostgreSQL de Testcontainers, origen loopback ficticio): documento 200 JSON con `servers` igual al origen y operaciones system/info y me; swagger-config apunta al documento; index y un recurso de la UI 200; YAML, rutas por defecto, webjars y métodos no GET denegados; system/info 200 y me 401 sin cambios; sin credenciales.
- Rojo previo: el IT encendido falla antes del cambio; mutaciones dirigidas (permiso sin interruptor, sin restricción de método, sin validación de loopback) dejan rojo el caso pertinente y se restauran.
- Navegador real (Playwright, proyecto desktop 1280 seleccionado por configuración, sin skip): por el origen público `http://localhost` del stack E2E carga Swagger UI y el documento (respuesta 200 observada), ejecuta desde la UI system/info → 200 con el dato real y me sin sesión → 401; POST `/logout` no ofrece «Try it out». Sin `route.fulfill`/MSW. Rojo dirigido del assert y restauración, reporte saneado (las capturas de Swagger no se exportan salvo ampliación con canarios).
- Proxies y FULL: pruebas de frontera nginx/Vite vigentes sin cambios; FULL local y CI del HEAD publicado.
- Documentación: SETUP (activar, URL, dev-auth), TESTING, ARCHITECTURE y estado de este ADR/S-001.
