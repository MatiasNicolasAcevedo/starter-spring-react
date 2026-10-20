# Despliegue económico de varias aplicaciones

Propuesta para decisión del dueño, consultada el 2026-10-20. Objetivo: US$10–15/mes como máximo para proyectos propios de poco tráfico. No hay proveedor contratado, infraestructura configurada, TLS público ni capacidad de producción medida. Desarrollo y ensayos siguen usando su DB aislada; no deben conectarse al PostgreSQL de producción.

## Arquitectura recomendada
Un VPS Linux con Docker Compose, un proxy HTTPS compartido (Caddy como opción inicial), un PostgreSQL 18 compartido y un stack separado por aplicación. Servir React compilado y `/api`, `/oauth2`, callback y logout desde el mismo origen de cada aplicación: `https://app-a.ejemplo.com`, `https://app-b.ejemplo.com`. Cloudflare DNS/CDN Free es opcional; TLS completo hasta el origen. No cachear API privada ni respuestas con sesión. No cambiar el modelo OIDC/sesión/CSRF ni publicar puertos de PostgreSQL/backend.

Cada aplicación sigue necesitando un proceso Java/contenedor propio; el ahorro es compartir la máquina y pagar su capacidad, no una tarifa por instancia. PostgreSQL y proxy se administran una vez y el deploy de una aplicación no puede reiniciarlos ni destruirlos. Proyectos, redes, credenciales y límites de recursos explícitos por aplicación. DB en redes privadas; restringir comunicación entre stacks. Separar el host si aparecen usuarios no confiables o necesidades de aislamiento fuerte.

## Una instancia PostgreSQL, varias bases
Es una configuración válida: un cluster PostgreSQL puede contener varias bases. Crear una DB y roles propios por aplicación, no un único usuario superuser compartido. Cada conexión elige una base y cada aplicación mantiene sus migraciones Flyway allí. Roles son globales al cluster: usar nombres únicos, sin SUPERUSER/CREATEDB/CREATEROLE, revocar CONNECT/TEMP de PUBLIC en cada DB y conceder solo al rol autorizado. Verificar privilegios de esquema; separar rol de migración y runtime al implementar la receta.

En la validación de despliegue, exigir que app A conecte a su base y que falle la conexión/lectura con sus credenciales en base B; no basta cambiar el nombre de la DB en una URL. Limitar pools por app y revisar suma de conexiones frente a max_connections. La separación lógica no limita CPU/disco ni elimina el punto único de fallo.

Backups por base fuera del VPS, cifrados y con retención; restauración probada en entorno aislado. pg_dump por base no reemplaza la estrategia de roles ni garantiza un punto consistente entre bases; para recuperación completa definir también roles/configuración y, si se necesita, WAL/PITR. Snapshot del mismo VPS no basta como única copia.

Fuentes: [gestión de bases PostgreSQL 18](https://www.postgresql.org/docs/18/managing-databases.html), [privilegios](https://www.postgresql.org/docs/18/ddl-priv.html), [backup SQL](https://www.postgresql.org/docs/18/backup-dump.html).

## Capacidad y costo
Punto de partida propuesto para varias apps Java pequeñas: 4 vCPU compartidas/8 GB RAM, midiendo RSS/heap/pools y dejando margen al sistema/DB. Para una o dos apps, 4 GB puede alcanzar; no prometer cinco backends en 4 GB. Construir imágenes fuera del VPS y desplegar artefactos inmutables para evitar picos Maven/npm en la máquina pequeña. Escalar por memoria, CPU, disco, conexiones y latencia observadas, no solo por cantidad de visitas.

| Opción | Precio publicado consultado | Evaluación para este presupuesto |
|---|---|---|
| OVHcloud VPS-2, 4 vCore/8 GB | Desde USD8.50/mes; 75 GB NVMe, IPv4 y backup diario incluidos en la oferta consultada | Primera comparación para este presupuesto: confirmar país/contrato, renovación, impuestos y región en checkout. Reservar aparte backup lógico externo y dominio. [Tarifa oficial](https://www.ovhcloud.com/en/vps/) |
| Hetzner CX33, 4 vCPU/8 GB | EUR8.49 o USD9.99/mes en Europa, sin IVA ni IPv4 | Alternativa si hay stock; IPv4 USD0.60/mes, backup externo, dominio/impuestos adicionales. La página muestra disponibilidad limitada/no disponible: no garantizar compra ni región. [Tarifa oficial](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/), [IPv4](https://docs.hetzner.com/general/infrastructure-and-availability/ipv4-pricing/), [capacidad](https://www.hetzner.com/cloud/cost-optimized/) |
| Hostinger KVM 2, 2 vCPU/8 GB | USD8.79/mes promocional; renovación USD14.99/mes por 2 años | Confirmar prepago/total en checkout; renovación consume todo el techo antes de extras. [Precio oficial](https://www.hostinger.com/vps-hosting) |
| netcup VPS 1000 G12.5, 4 vCore/8 GB | EUR16.68/mes con 19% IVA mostrado y contrato de 12 meses | Fuera del rango habitual en USD; depende de país/impuestos. [Tarifa oficial](https://www.netcup.com/en/server/vps) |
| Oracle Always Free A1 | Hasta 2 OCPU/12 GB ARM según oferta actual, sin cargo dentro de cuota | Alternativa gratuita experimental; capacidad regional y recuperación de instancias ociosas. No asumir la cuota antigua de 4/24 ni base siempre disponible. Verificar imágenes ARM y backup externo. [Condiciones oficiales](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm) |

Precios son del plan, no una cotización final ni garantía de disponibilidad. Comparar primero OVHcloud con el total de checkout y Hetzner si hay stock; elegir solo si servidor, impuestos, backup y dominio caben en el techo acordado. En Hetzner, cómputo/IP publicados suman USD10.59 antes de extras; sus backups cuestan 20% del servidor. Ningún backup de máquina sustituye el backup lógico externo de DB. Para Latinoamérica, medir latencia de la región elegida; CDN acelera estáticos, no elimina latencia API/DB. No adjudicar reputación/SLA sin evidencia independiente.

Para backups pequeños, [Cloudflare R2 Standard](https://developers.cloudflare.com/r2/pricing/) publica una capa gratuita de 10 GB-mes, 1 millón de operaciones A y 10 millones B mensuales, sin cargo por egress. Validar volumen/retención y cifrado; fuera de cuota se cobra. No hay cuenta ni bucket configurados.

## Frontend externo y paneles
Vercel soporta Vite/React; Hobby está limitado a uso personal no comercial. Cloudflare Pages permite estáticos sin cargo por peticiones estáticas, con límites de build/archivos/proyecto. Ninguno de esos planes de frontend constituye por sí solo un alojamiento del backend Spring Boot y PostgreSQL. Separar frontend/API en orígenes distintos requiere diseñar cookies/CSRF/CORS/callbacks; para empezar, mismo origen en el VPS mantiene el contrato actual.

Coolify autohospedado puede simplificar deploys, pero añade servicios y consumo; su mínimo recomendado es 2 cores/2 GB para el panel, más aplicaciones. No es requisito. Empezar con Compose/proxy y evaluar panel cuando ahorre trabajo medible. Fuentes: [Vite en Vercel](https://vercel.com/docs/frameworks/frontend/vite), [uso Hobby](https://vercel.com/docs/limits/fair-use-guidelines), [Pages](https://developers.cloudflare.com/pages/functions/pricing/), [Coolify](https://next.coolify.io/docs/start-with-self-hosted), [backups Hetzner](https://docs.hetzner.com/cloud/billing/faq/).

## Contrato de la próxima implementación
El dueño elige proveedor, región, dominio y gasto. Después preparar una tarea pequeña: Compose de infraestructura compartida y configuración por aplicación; imágenes fijadas, redes privadas, TLS/orígenes, secretos externos al repo, roles/DB separados, memoria/pools/health/restart y logs acotados. Ensayar dos apps ficticias con el mismo PostgreSQL, negativos de acceso cruzado, deploy/rollback de A sin afectar B ni DB, backup/restore y cleanup limitado a recursos propios. No ejecutar contra producción para probar esta receta.
