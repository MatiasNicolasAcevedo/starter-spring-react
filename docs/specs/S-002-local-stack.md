---
id: S-002
status: approved
version: 1
milestone: M0
tasks: []
---
# S-002 · Desarrollo local persistente y estado conectado

## Problema y usuario
El mantenedor necesita levantar, comprobar, detener y retomar el starter sin credenciales Google ni herramientas de build instaladas en host. La pantalla actual obtiene nombre/versión reales de la API, pero eso no demuestra disponibilidad de PostgreSQL. El harness dev-auth es efímero y su cierre elimina datos ficticios; no satisface el desarrollo persistente.
Contrato técnico vigente de la base; contexto de uso en [PROJECT_CONTEXT](../../PROJECT_CONTEXT.md).

## Historias y reglas
1. Modo local explícito: `bash scripts/dev.sh up|check|down --mode local --proxy nginx|vite --project starter-dev-<sufijo>`. Cada invocación requiere modo, proxy y proyecto; el texto entre ángulos es un sufijo único elegido por el operador. Sin defaults de proyecto global, elevación de permisos ni lectura implícita de `.env`. Usar una fixture ficticia versionada explícita; admitir `--env-file` solo para parámetros locales documentados, sin cargar credenciales Google. Mantener el default real `google` sin fallback ni mezclas con `test/e2e`.
2. Docker Desktop, Compose V2 y Git Bash bastan para esas tres acciones: probes Node/HTTP y navegador de ensayo en runners con imágenes ya inventariadas. Node >=24 en host sigue siendo requisito del controlador FULL/E2E actual; no confundir esa limitación con los requisitos del nuevo CLI. Navegador host opcional. No cambiar hosts globales, ignorar TLS ni desactivar validación OIDC: URL, Host, issuer y callbacks deben coincidir desde navegador/runner/backend (TR-11).
3. `up` retorna después de readiness acotada y deja db/oidc/server y el proxy elegido activos. Repetirlo sobre el mismo proyecto propio es idempotente; después de `down` reutiliza su volumen. Huella de propiedad verificable en labels propias más `com.docker.compose.project`, modo y origen, conservada también en volumen. Rechazar recursos preexistentes sin esa huella, otro modo/origen, namespace ajeno o puertos ocupados antes de modificar recursos. No adoptar stacks por compartir prefijo. Nunca operar el proyecto reservado de dev-auth como desarrollo persistente.
4. Defaults locales nginx 5175, Vite 5176 y OIDC 8090 en loopback, con override explícito de puertos para coexistencia. No publicar DB ni server para el camino normal. La fixture/overlay local debe construir `APP_PUBLIC_URL`, issuer y callback coherentes; rechazar overrides incompatibles con mensaje fijo. No imprimir el entorno completo ni usar `docker compose config` sin selección/saneamiento. La selección local activa exclusivamente el proveedor ficticio existente 3.0.3 y las imágenes/pins del inventario.
5. `check` no muta la aplicación ni reinicia servicios: comprueba propiedad, contenedores, discovery/JWKS del issuer exacto, contenido de system/info y readiness DB por el origen público. Solo devuelve 0 con JSON/status/esquemas esperados; HTML 200, error de DB, proxy 502/504, timeout, issuer diferente o respuesta malformada dan exit distinto de 0 y diagnóstico fijo saneado. No crear sesión o identidad para declarar readiness.
6. `down` detiene y retira exclusivamente contenedores/redes del proyecto validado y conserva volúmenes/datos propios; repetirlo tras ese down es seguro y exitoso si la huella persistente coincide. Proyecto desconocido o identidad incompatible se rechaza. No ofrece borrado de datos persistentes ni usa `--volumes`. `up` posterior conserva `app_user.id/created_at`; la sesión en memoria del server se pierde al reiniciar, conforme S-001.
7. Antes de build/up, validar recursos/puertos e instalar rollback que distinga recursos recién creados de preexistentes propios. En fallo o INT/TERM/HUP retirar solo lo creado en ese intento; preservar volúmenes preexistentes y salida original 130/143/129. Error de cleanup rechaza éxito. Los ensayos usan namespaces únicos, fixtures y volúmenes ficticios nuevos: tras probar persistencia eliminan solo esos recursos por labels y exigen container -a/network/volume=0/0/0. Nunca prune.
8. El harness `scripts/dev-auth.sh ... session|status|restart|rebuild|stop` conserva sintaxis, semántica efímera, probes, negativos y cleanup. Se puede reutilizar lógica comprobada sin convertir stop/Ctrl-C en persistentes. `dev.sh` ofrece el contrato persistente por una entrada distinta.

## Contrato backend y proxies
- Mantener `GET /api/v1/system/info` y su DTO de nombre/versión intactos; no agregar datos ficticios al response ni crear una tabla de negocio.
- `GET /actuator/health/readiness` público por ruta exacta en nginx y Vite, mismo origen y saneamiento de Host/Forwarded/X-Forwarded-* ya vigentes. Actuator incluye `readinessState` y `db` explícitamente en el grupo; `show-details`/componentes no se publican. PostgreSQL disponible → HTTP 200 JSON `{"status":"UP"}`; caída de DB → HTTP 503 JSON `{"status":"DOWN"}` (o estado no disponible del grupo), nunca 200 UP. Recuperación real → vuelve 200 UP sin inventar respuesta ni reiniciar para ocultar el fallo. Liveness conserva independencia de DB y no se abre una nueva ruta pública de proxy para ella.
- No publicar `/actuator/**` ni subrutas de readiness por prefijo. Vecinas, trailing slash, suffix, env/metrics/configprops, liveness por proxy y métodos no GET no llegan a Actuator público; rechazo explícito en proxy, sin fallback HTML interpretado como health. Mantener el permiso health interno necesario para Compose; probar denegaciones del resto en backend y frontera exacta en ambos proxies. Reusar saneamiento existente también en la nueva ruta, con negativos de spoofing.
- Sin SQL, credenciales, host de DB, componentes ni causas internas en health público/logs. Sin CORS, cookies/tokens nuevos, API privada nueva o ampliación de permisos sobre recursos del usuario.
- Swagger conserva [ADR 0003](../adr/0003-openapi-swagger-opt-in.md): apagado por defecto, opt-in explícito local HTTP loopback, GET bajo `/api/docs/`, `servers` fijo, JSON/config/index/recursos reales y Try it out de system/info 200 y me anónimo 401. POST logout sin Try it out. No abrir rutas por defecto, YAML, webjars, HTTPS ni host externo para destrabar probes.

## Frontend
Mantener `/` y nombre/versión desde system/info; añadir el estado de disponibilidad conjunta API/DB obtenido de readiness con Zod y el cliente HTTP compartido. Éxito solo con system/info válido y readiness UP; cargar muestra estado accesible, 503/red/HTML/esquema inválido muestra error visible sin éxito anterior engañoso y permite reintento. La DB puede caer mientras la página está abierta: revalidación periódica de readiness cada 5 s, sin reintentos multiplicados; detectar caída/recuperación en una ventana total de 30 s, incluidos timeouts. Configurar y probar límites de conexión del probe DB compatibles con esa ventana, sin incrementar deadlines/retries heredados.
Pruebas de componente con MSW incluyen respuesta retenida, 503 tras UP, JSON inválido/HTML 200, reintento y recuperación; el E2E observa API/DB reales. Teclado, roles, foco del reintento y 1280/375 sin overflow. No tocar login/logout/cache/CSRF fuera de integrar su regresión; no guardar tokens ni estado de health como sustituto de disponibilidad real.

## Datos y compatibilidad
PostgreSQL 18.6 y Flyway V1 publicada intactos, JPA validate. Arranque desde volumen vacío aplica migración y login local genera una identidad ficticia. Capturar solo huella saneada id/created_at/conteo (sin datos personales, cookies ni claims) para comparar restart/rebuild/down/up del stack propio. Sin nuevas migraciones previstas. Revertir cambios de B mediante código/config, conservando el volumen de desarrollo; borrar datos de ensayo únicamente después de demostrar retoma.

## Criterios de aceptación
Los criterios describen el comportamiento a conservar; ejecución y evidencia en la tarea vigente.

| ID | Dado / cuando / entonces | Contrato | Nivel / archivo de prueba previsto |
|---|---|---|---|
| B-AC-01 | Host con Docker/Git Bash y sin Node/Maven/PostgreSQL: up/check/down local funcionan en nginx y Vite mediante runners | Reglas 1–5 | lifecycle `scripts/test-dev-stack.sh`; probes containerizados `scripts/probe-dev-stack.mjs` |
| B-AC-02 | DB vacía: Flyway/JPA, system/info y readiness UP reales; check valida JSON y falla con HTML 200/issuer ajeno | Reglas 4–5 y backend | PostgreSQL `ReadinessIT`; negativos de probe y lifecycle |
| B-AC-03 | DB propia se detiene/restaura con página abierta: readiness 503/UI error/check no cero y recuperación UP/UI disponible dentro de 30 s | Backend/frontend | `ReadinessIT`; `SystemInfoPanel.test.tsx`; `e2e/tests/local-stack.spec.ts` |
| B-AC-04 | Ambos proxies exponen solo GET exacto readiness, reconstruyen metadata; vecinas/Actuator ajeno/métodos/spoofing no amplían acceso | Backend/proxies | ampliar `scripts/test-auth-proxies.mjs`; IT health/seguridad y E2E nginx/Vite |
| B-AC-05 | Login, recarga, restart, rebuild, down/up conservan identidad DB propia; sesión del backend reiniciado exige nuevo login | Reglas 3, 6 y datos | lifecycle + navegador real y SQL saneado; conservar `test-dev-auth.mjs` |
| B-AC-06 | Namespace/huella/modo/puertos ajenos se rechazan antes de mutar; up repetido y down repetido propios son seguros | Reglas 3–4, 6 | negativos lifecycle con recursos ficticios centinela de un segundo proyecto propio |
| B-AC-07 | Fallos build/up/readiness, señales y error cleanup no dan verde; rollback no borra volumen previo; segunda ejecución funciona | Regla 7 | inyección dirigida en lifecycle, controles positivos/negativos y labels; sin bajar límites |
| B-AC-08 | Swagger por nginx/Vite carga config/JSON/index/recurso con Content-Type/contenido correctos y Try it out real conserva denegaciones | ADR 0003 | `e2e/tests/swagger.spec.ts` en ambos proxies; IT opt-in/off vigentes |
| B-AC-09 | UI loading/error/éxito/recuperación y teclado a 1280/375; API en E2E sin mocks; HMR Vite restaura fuente | Frontend | `SystemInfoPanel.test.tsx`, E2E sistema/local-stack y ensayo HMR vigente |
| B-AC-10 | Perfil real sin credenciales y perfiles mezclados fallan sin fallback; suites OIDC/CSRF/logout/propiedad y Swagger negativos siguen verdes | Reglas 1, 8; S-001 | suites auth/negativos vigentes + FULL completo, sin Google real |
| B-AC-11 | Copia de trabajo sin kit: README literal, checks/lifecycle/FULL/CI sobre SHA publicado; recursos de ensayo 0/0/0; desarrollo persiste antes del cleanup | Datos y reglas 6–7 | documentación y gate FULL; evidencia propia por SHA/labels en la tarea/PR vigente |

## Fuera de alcance
Cambiar autenticación, dominio de aplicación, versiones o controles; producción y recursos ajenos. Las tareas nuevas se derivan del contexto de cada aplicación.
