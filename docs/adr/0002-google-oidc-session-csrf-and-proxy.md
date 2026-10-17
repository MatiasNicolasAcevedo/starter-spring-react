# ADR 0002 · Google OIDC, sesión, CSRF y frontera del proxy

- **Estado:** decisión heredada vigente; implementación y suites conservadas, evidencia propia pendiente de revalidación.
- **Ámbito:** starter genérico y futura adopción, sin dominio de negocio.

## Contexto
OIDC de Spring, identidad issuer/subject y sesión backend requieren un origen único y frontera de proxy confiable. Aplicar framework forwarding sin sanear todos los headers entrantes permitiría reconstruir un origen atacante. La spec de auth conserva reglas y matriz de pruebas.

## Decisión
1. Authorization Code/OIDC gestionado por Spring OAuth2 Client; scopes `openid profile email`, Google real issuer fijo, sin offline/refresh requerido ni consumo de APIs Google. Credenciales y tokens viven solo en backend. API no acepta bearer tokens ni identidades proporcionadas por la SPA.
2. Servicio transaccional de identidad después de validación: `(issuer, subject)` único, atributos opcionales mutables, UUID v7 existente; email verificado se conserva como dato sin otorgar permisos. Principal de sesión identifica ID local; no deriva roles de aplicación de claims. Fallo de persistencia no autentica.
3. Sesión en memoria del backend, 30 min de inactividad, renovación de session ID al autenticar, transporte cookie exclusivamente. `JSESSIONID` host-only/Path `/`, HttpOnly/SameSite=Lax; Secure en HTTPS, excepción HTTP loopback de desarrollo/pruebas. No remember-me ni cookie persistente. Reiniciar server exige nuevo login; identidad DB persiste. No se introduce almacenamiento distribuido.
4. CSRF SPA cookie→header con `csrf.spa()` de Security 7.1.1; fijar y probar nombres `XSRF-TOKEN`/`X-XSRF-TOKEN`, atributos host-only/Path `/`/SameSite=Lax/Secure según origen y cookie CSRF legible por JS. GET público `/api/v1/auth/csrf` 204 materializa token; renovación al arrancar SPA y después de login/logout. Cliente lee cookie vigente por petición, no reenvía mutaciones automáticamente. CSRF no es token OIDC. No desactivar protección ni presentar el mecanismo cookie como revocación de todos los pares antiguos del lado servidor.
5. GET me solo usuario actual, DTO mínimo sin issuer/subject/roles/tokens; 401 JSON sin redirects para APIs, 403 JSON para CSRF/denegación. Login retorna `/`, fallo `/login?error=authentication`; destinos internos fijos, sin retorno arbitrario. POST logout con CSRF devuelve 204 e invalida sesión/cookies/contexto/autorizaciones backend; no cierra Google. GET logout sin efectos ni formulario: 401 anónimo, 405 autenticado.
6. `APP_PUBLIC_URL` validado como único origen, callback absoluto configurado desde él. `server.forward-headers-strategy=framework` reconstruye request detrás de proxy; nginx/Vite descartan todos los forwarded headers entrantes y reconstruyen los aceptados desde origen configurado/peer, rechazan Host ajeno. No exponer server directamente en Compose ordinario; diagnóstico loopback separado con forwarding deshabilitado. Probar igualdad de origen y spoofing en ambos proxies, más HTTPS simulado para Secure. No asumir futura cadena de proxies/TLS: despliegue real necesita autorización y nueva evaluación.
7. Default real Google sin fallback. Perfiles test/e2e exclusivamente proveedor local de imagen exacta `ghcr.io/navikt/mock-oauth2-server:3.0.3`, datos ficticios y redes/volúmenes aislados. Configuración real/local mixta falla. Discovery/issuer/iss idénticos y conectividad navegador/backend sin desactivar validaciones; fixture de respuesta inválida solo test para negativos. Comprobar pull/topología y protocolo real antes de acreditar login. [El mantenedor documenta imagen, claims y networking](https://github.com/navikt/mock-oauth2-server/tree/3.0.3).

## Alternativas consideradas
- Tokens OIDC/JWT propios en browser, passwords o Google SDK client: contradicen sesión backend y añaden otra frontera de credenciales.
- CSRF desactivado porque hay SameSite: SameSite no sustituye el contrato CSRF; mantendremos filtros y negativos verificables.
- Token CSRF en JSON con sesión: viable, pero el scaffold prevé cookie/header y Security ofrece defaults SPA; añadiría otro contrato de transporte y manejo del token.
- `native` forwarding: válido en otros servidores; framework explicita host/proto/port en Spring MVC. Ninguna estrategia sustituye el saneamiento en proxy. No combinar ambas.
- Callback derivado de `{baseUrl}` sin control de origen: susceptible a configuración/headers ajenos; usar origen fijo validado y prueba del request reconstruido.
- Redis/Spring Session: innecesario para monolito demo local; persistencia de sesión entre reinicios y múltiples instancias queda fuera de alcance.

## Consecuencias
Logout/401 exige cancelar consultas y vaciar cache privada, incluyendo respuestas en vuelo; CSRF debe renovarse. No hay CORS ni tokens de autenticación accesibles por JS. El modo de diagnóstico directo cambia y SETUP debe documentarlo al implementarse. Pasar de HTTP local a HTTPS requiere APP_PUBLIC_URL/redirect Google/cookies coherentes, sin cambiar el modelo de identidad. La sesión no sobrevive reinicio y logout local no revoca Google.

Prueba obligatoria reforzada: slices, identidad/concurrencia PostgreSQL, protocolo local válido/negativo, separación de perfiles, cookies/CSRF y spoofing nginx/Vite; contrato completo/matriz en S-001. Playwright y FULL se conservan como suites obligatorias. Revertir auth conserva usuarios persistidos y deny-by-default; no modificar V1 ni borrar volumen. Cambiar esta decisión requiere actualizar spec/tarea/ADR y evaluar compatibilidad antes de código. Smoke Google real separado con dueño, sin credenciales en commits/logs.
