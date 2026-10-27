# Contexto del starter

## Objetivo
Base inicial genérica para aplicaciones pequeñas: Java 21, Spring Boot 4.1.1, React/TypeScript/Vite/MUI y PostgreSQL 18. Cada aplicación parte de una copia propia, define su idea con frontera y ejecuta tareas pequeñas con Junie.

Objetivo de mantenimiento confirmado por el dueño el 2026-10-25: «dejar todo pulido y al día». Primer resultado autorizado: auditar la preparación de la base para su uso y clasificar pendientes comprobables antes de especificar correcciones. [T-009](docs/tasks/T-009-starter-readiness.md) delimita ese diagnóstico. Conservar versiones congeladas y permisos existentes; esta intención no acredita aceptación final ni autoriza producción u otra aplicación.

## Incluido
API/DB conectadas, OIDC con sesión backend y CSRF, autorización por propietario, referencia CRUD removible, Swagger opt-in, entorno local persistente, pruebas y CI. El formulario [project-context](docs/templates/project-context.md) prepara problema, usuarios, flujo central, MVP/exclusiones, datos, reglas, permisos y aceptación. El contexto completado pertenece al PROJECT_CONTEXT de cada aplicación.

## Flujo de trabajo
Frontera resuelve las decisiones y prepara una iteración con specs por capacidad y tareas pequeñas ordenadas. Junie implementa cada contrato; otra sesión revisa antes del merge. Frontera vuelve al objetivo cumplido o ante una decisión fuera del contrato. El kit personal no es dependencia.

## Operación prevista
Portfolio personal no comercial: hasta 4–5 proyectos alternables en un VPS de 4 vCPU/8 GB, frontend/backend juntos y un PostgreSQL con bases/roles separados. Primero desarrollar apps; sin contratación ni deploy ahora. Presupuesto total objetivo del dueño: US$10–15/mes. Propuesta y decisiones pendientes en [DEPLOYMENT](docs/DEPLOYMENT.md); ninguna infraestructura contratada ni desplegada. La base no se considera lista para el uso del dueño hasta completar sus ajustes y revisión.

## Límites
Versiones y controles existentes conservados. Sin secretos, datos reales, Google real, producción ni gastos por agentes sin autorización específica. Cada copia define su AUTONOMY y acredita sus propias pruebas; no hereda permisos ni resultados del mantenimiento.
