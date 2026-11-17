# Despliegue económico de varias aplicaciones

**Pendiente de decisión del dueño para cada aplicación.** Esta guía es una propuesta técnica: completar contexto, carga prevista, capacidad, presupuesto, proveedor, región y dominio propios antes de aprobar despliegue o gastos. Las decisiones del mantenimiento del starter no autorizan ni aceptan la operación de una copia.

## Camino corto: un contenedor en un PaaS
Para la primera publicación de una aplicación chica, antes de justificar un VPS. Es el empaquetado que ya funcionó en una aplicación derivada de esta base sobre Render Free; proveedor, plan y gasto siguen siendo decisión del dueño.

- **Un solo Web Service Docker** con React compilado, nginx y Spring Boot en la misma imagen, y un PostgreSQL 18 gestionado aparte en la misma región, alcanzado por red interna y sin acceso externo.
- **Dockerfile multietapa** con contexto en la raíz: `npm ci` y `npm run build` del cliente; Maven Wrapper con Java 21 y jar extraído por capas; runtime sobre la imagen nginx con un JRE de la misma versión. Versiones fijadas, usuario sin privilegios y credenciales solo en el entorno de ejecución.
- **Un entrypoint que coordina dos procesos**: valida `PORT`, genera la configuración de nginx desde el origen público, arranca Spring en `127.0.0.1:8080` y nginx en `PORT`, termina ambos si uno cae y reenvía TERM/INT. Sin eso, un proceso muerto deja el contenedor «vivo» y roto.
- **Un único origen público.** nginx sirve la SPA y reenvía `/api/`, `/oauth2/`, el callback y `/logout`. Se conserva la validación de Host, la reconstrucción de `Forwarded`/`X-Forwarded-*` desde configuración confiable, sesión y CSRF ([ADR 0002](adr/0002-google-oidc-session-csrf-and-proxy.md)). `APP_PUBLIC_URL` es la URL HTTPS pública y la URI de redirección de Google es esa URL más `/login/oauth2/code/google`.
- **Health check** en `GET /actuator/health/readiness`, que ya comprueba Spring y PostgreSQL.
- **Variables en el panel privado**, nunca en el repo: `SPRING_DATASOURCE_URL` en formato `jdbc:postgresql://<host-interno>:5432/<base>`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `APP_PUBLIC_URL`, perfil `google` y `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`. Las tres de datasource se cambian juntas.

Lo que costó tiempo y conviene saber de entrada:

| Tema | Lección |
|---|---|
| Arranque en plan chico | Con unos 512 MB y 0,1 CPU, Spring tarda alrededor de un minuto en estar listo. `-XX:TieredStopAtLevel=1` reduce el trabajo de compilación en frío. Medir memoria pico al arrancar y tras una operación real antes de publicar |
| Primer deploy | El servicio despliega al crearse y al tocar variables: sin las de datasource cargadas, falla o queda en 502. Cargar todas las variables antes del primer deploy útil |
| Auto-deploy | Elegir a conciencia entre desplegar en cada commit a `main` o por SHA manual. Con auto-deploy, un merge solo documental también despliega salvo que el mensaje lleve el marcador de omisión del proveedor |
| Suspensión por inactividad | El plan gratuito duerme el servicio a los 15 minutos sin tráfico entrante; el primer acceso paga el arranque completo. Decidir si se acepta, antes de construir sondas |
| Base gratuita | Vence a los 30 días y no tiene backups gestionados. Hace falta una exportación propia de datos probada con una restauración real antes de depender de ella |
| Prueba local de la imagen | Un Compose de humo con la imagen final, PostgreSQL aparte, OIDC ficticio y límites de memoria/CPU parecidos al plan, antes de tocar el proveedor |
| Nombres de variables | Un nombre mal escrito deja el valor por defecto sin error visible. Verificar cada variable nueva con una comprobación observable después del deploy |

Los archivos (`deploy/`, Compose de humo y prueba del entrypoint) no están todavía en esta base; se incorporan con una tarea propia. La creación de recursos, las credenciales, Google real y cualquier costo los decide y opera el dueño.

## Arquitectura recomendada con varias aplicaciones
Un VPS Linux con Docker Compose, un proxy HTTPS compartido (Caddy como opción inicial), un PostgreSQL 18 compartido y un stack separado por aplicación. Servir React compilado y `/api`, `/oauth2`, callback y logout desde el mismo origen de cada aplicación: `https://app-a.ejemplo.com`, `https://app-b.ejemplo.com`. Cloudflare DNS Free como opción inicial propuesta; proxy/CDN opcionales, con TLS completo hasta el origen. No cachear API privada ni respuestas con sesión. No cambiar el modelo OIDC/sesión/CSRF ni publicar puertos de PostgreSQL/backend.

Cada aplicación sigue necesitando un proceso Java/contenedor propio; el ahorro es compartir la máquina y pagar su capacidad, no una tarifa por instancia. PostgreSQL y proxy se administran una vez y el deploy de una aplicación no puede reiniciarlos ni destruirlos. Proyectos, redes, credenciales y límites de recursos explícitos por aplicación. DB en redes privadas; restringir comunicación entre stacks. Separar el host si aparecen usuarios no confiables o necesidades de aislamiento fuerte.

Se pueden detener backends/stacks de apps que no se están mostrando y levantar otros; conservar volúmenes/DB y no usar down -v en datos persistentes. Detener una app libera parte de RAM/CPU; no reduce la tarifa mensual del VPS ni libera el espacio de sus datos/imágenes. No se exige mantener todas las JVM encendidas. Páginas estáticas adicionales pueden compartir el proxy sin un backend Java cada una.

## DNS y herramientas sin suscripción
DNS vincula un nombre como app-a.mi-dominio.com con la IP del VPS. Un dominio propio permite muchos subdominios: no hace falta comprar un dominio ni una IP por proyecto. El registro/renovación del dominio tiene su costo aparte; DNS gratuito no regala el dominio. [Conceptos DNS](https://developers.cloudflare.com/dns/concepts/).

Propuesta inicial: dominio del dueño y Cloudflare DNS Free, registros A/AAAA al VPS, en modo DNS-only al arrancar. Caddy gestiona HTTPS en el VPS; DNS-only no pasa tráfico HTTP por Cloudflare. Evaluar proxy/CDN más adelante, Full (strict), sin cachear sesión/API. No es requisito Cloudflare: también sirve DNS del registrador sin tarifa adicional si su oferta lo incluye. [Plan personal](https://www.cloudflare.com/personal/), [DNS primario](https://developers.cloudflare.com/dns/zone-setups/full-setup/), [proxy status](https://developers.cloudflare.com/dns/proxy-status/).

Linux, Docker Engine/Compose, Caddy, PostgreSQL y herramientas de backup abiertas, sin panel/licencia comercial obligatoria. Compilar en equipo propio/CI antes del VPS. No añadir Kubernetes, base administrada ni cuota por deploy para aplicaciones pequeñas. No crear cuentas/infraestructura ahora.

## Una instancia PostgreSQL, varias bases
Es una configuración válida: un cluster PostgreSQL puede contener varias bases. Crear una DB y roles propios por aplicación, no un único usuario superuser compartido. Cada conexión elige una base y cada aplicación mantiene sus migraciones Flyway allí. Roles son globales al cluster: usar nombres únicos, sin SUPERUSER/CREATEDB/CREATEROLE, revocar CONNECT/TEMP de PUBLIC en cada DB y conceder solo al rol autorizado. Verificar privilegios de esquema; separar rol de migración y runtime al implementar la receta.

En la validación de despliegue, exigir que app A conecte a su base y que falle la conexión/lectura con sus credenciales en base B; no basta cambiar el nombre de la DB en una URL. Limitar pools por app y revisar suma de conexiones frente a max_connections. La separación lógica no limita CPU/disco ni elimina el punto único de fallo.

Backups por base fuera del VPS, cifrados y con retención; restauración probada en entorno aislado. pg_dump por base no reemplaza la estrategia de roles ni garantiza un punto consistente entre bases; para recuperación completa definir también roles/configuración y, si se necesita, WAL/PITR. Snapshot del mismo VPS no basta como única copia.

Fuentes: [gestión de bases PostgreSQL 18](https://www.postgresql.org/docs/18/managing-databases.html), [privilegios](https://www.postgresql.org/docs/18/ddl-priv.html), [backup SQL](https://www.postgresql.org/docs/18/backup-dump.html).

## Capacidad y costo
Dimensionar CPU/RAM, disco, conexiones y margen del sistema/DB con la carga de la aplicación. Medir RSS/heap/pools y latencia; comparar el costo recurrente total, impuestos, dominio, backups y renovación antes de contratar. No hay tamaño ni presupuesto aceptados por herencia.

## Cuando haya una aplicación para publicar
Esta guía propone un camino; no incluye Compose de producción ni promete que desplegar sea solo cambiar una variable. Al llegar el momento reconsultar precio/stock/región, medir latencia, y el dueño elige proveedor, dominio y gasto. Preparar una tarea acotada de despliegue: Compose de infraestructura compartida y configuración por aplicación; imágenes fijadas, redes privadas, TLS/orígenes, secretos externos al repo, roles/DB separados, memoria/pools/health/restart y logs acotados. Ensayar dos apps ficticias con el mismo PostgreSQL, negativos de acceso cruzado, deploy/rollback de A sin afectar B ni DB, backup/restore y cleanup limitado a recursos propios. No ejecutar contra producción para probar esta receta.

<!-- starter-only:start -->
## Dirección aceptada para el mantenimiento del starter
Decisión del dueño 2026-10-20: portfolio personal no comercial, 4–5 proyectos de poco tráfico que pueden alternarse. Un VPS de 4 vCPU compartidas y 8 GB RAM, frontend/backend juntos y un PostgreSQL para varias bases. Techo total US$10–15/mes. Primero desarrollar aplicaciones; contratar/desplegar cuando haya una que publicar. Proveedor y región pendientes; tarifas consultadas el mismo día. No hay proveedor contratado, infraestructura configurada, TLS público ni capacidad de producción medida. Desarrollo y ensayos siguen usando su DB aislada; no deben conectarse al PostgreSQL de producción.

### Capacidad y candidatos del starter
Punto de partida aceptado: 4 vCPU compartidas/8 GB RAM, midiendo RSS/heap/pools y dejando margen al sistema/DB. No garantizar cinco JVM simultáneas en 8 GB: alternar apps según necesidad y medir el margen. Construir imágenes fuera del VPS y desplegar artefactos inmutables para evitar picos Maven/npm en la máquina pequeña. Escalar por memoria, CPU, disco, conexiones y latencia observadas, no solo por cantidad de visitas.

| Opción | Precio publicado consultado | Evaluación para este presupuesto |
|---|---|---|
| OVHcloud VPS-2, 4 vCore/8 GB | Desde USD8.50/mes; 75 GB NVMe, IPv4 y backup diario incluidos en la oferta consultada | Primera comparación para este presupuesto: confirmar país/contrato, renovación, impuestos y región en checkout. Reservar aparte backup lógico externo y dominio. [Tarifa oficial](https://www.ovhcloud.com/en/vps/) |
| Hetzner CX33, 4 vCPU/8 GB | EUR8.49 o USD9.99/mes en Europa, sin IVA ni IPv4 | Plan europeo; no trasladar esta tarifa a Ashburn. Alternativa si hay stock; IPv4 USD0.60/mes, backup externo, dominio/impuestos adicionales. La página muestra disponibilidad limitada/no disponible: no garantizar compra ni región. [Tarifa oficial](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/), [IPv4](https://docs.hetzner.com/general/infrastructure-and-availability/ipv4-pricing/), [capacidad](https://www.hetzner.com/cloud/cost-optimized/) |

Precios son del plan, no una cotización final ni garantía de disponibilidad. Comparar primero OVHcloud con el total de checkout y Hetzner si hay stock; elegir solo si servidor, impuestos, backup y dominio caben en el techo acordado. En Hetzner, cómputo/IP publicados suman USD10.59 antes de extras; sus backups cuestan 20% del servidor. Ningún backup de máquina sustituye el backup lógico externo de DB. Para Argentina, comparar primero OVH en costa este de EE. UU. o Canadá como candidatos de prueba; no hay stock de compra ni latencia desde el dueño verificados. Su [catálogo de Canadá](https://www.ovhcloud.com/en-ca/vps/vps-canada/) y [servicio de EE. UU.](https://us.ovhcloud.com/vps/) confirman oferta regional, pero moneda, entidad de contratación, impuestos, stock y plan se revalidan al contratar. No afirmar que existe VPS de este plan en Argentina/Brasil. Hetzner ofrece Ashburn, pero CX económico INTEL/AMD es europeo; las [ubicaciones y familias oficiales](https://docs.hetzner.com/cloud/general/locations/) distinguen disponibilidad y tarifas por zona. Medir HTTPS desde la conexión del dueño y comparar regiones antes de fijar la elegida; geografía por sí sola no garantiza mejor ruta. CDN acelera estáticos, no elimina latencia API/DB. No adjudicar reputación/SLA sin evidencia independiente.

Para backups pequeños, [Cloudflare R2 Standard](https://developers.cloudflare.com/r2/pricing/) publica una capa gratuita de 10 GB-mes, 1 millón de operaciones A y 10 millones B mensuales, sin cargo por egress. Validar volumen/retención y cifrado; fuera de cuota se cobra. No hay cuenta ni bucket configurados.
<!-- starter-only:end -->
