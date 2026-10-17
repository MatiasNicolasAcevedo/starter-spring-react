# Contexto del starter genérico

## Objetivo aceptado
Base reusable pública MIT, mantenida por Matias Nicolas Acevedo: Spring Boot/Java 21, React/TypeScript y PostgreSQL 18, con sesión OIDC/CSRF, pruebas, proxies, CI y documentación autosuficiente.
Nombre starter-spring-react y publicación en MatiasNicolasAcevedo/starter-spring-react decididos por el dueño el 2026-10-17.

## Alcance y secuencia
Partes A…E en docs/ROADMAP.md; esta sesión implementa solo extracción/inventario A.
Sin dominio comercial, negocio ni promesa de aptitud por evidencia heredada. B conecta arranque/DB/health/Swagger, C referencia removible y seguridad, D inicializador/FULL/CI/beta-template, E adopción desde otra copia limpia.
Sin Google real por agentes, despliegue, costos ni otros repos. El origen y su límite final están exclusivamente en docs/PROVENANCE.md.

## Adopción futura
Reemplazar este documento por el contexto de la nueva aplicación antes de su propia T-000 de adopción: problema/usuario, flujos, reglas, permisos, datos, aceptación, exclusiones y decisiones del dueño.
Revalidar los 22 criterios de HANDOFF; nada queda verificado por heredar el starter. D proveerá el formulario y reinicio idempotente de documentos mediante init-project.mjs.

## Decisiones trazadas
2026-10-17: mantener versiones y dependencias del snapshot; no actualizar latest. Modo local explícito sin credenciales y Google real sin fallback. Una tarea/PR activos, revisión distinta y squash protegido.
