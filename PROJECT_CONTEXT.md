# Contexto del starter genérico

## Objetivo aceptado
Base reusable pública MIT, mantenida por Matias Nicolas Acevedo: Spring Boot/Java 21, React/TypeScript y PostgreSQL 18, con sesión OIDC/CSRF, pruebas, proxies, CI y documentación autosuficiente.
Nombre starter-spring-react y publicación en MatiasNicolasAcevedo/starter-spring-react decididos por el dueño el 2026-10-17.

## Alcance y secuencia
Partes A…E y su estado real en docs/ROADMAP.md; acción y rol vigentes en docs/STATUS.md.
Sin dominio comercial, negocio ni promesa de aptitud por evidencia heredada. B conecta arranque/DB/health/Swagger, C referencia removible y seguridad, D inicializador/FULL/CI/beta-template, E adopción desde otra copia limpia.
Sin Google real por agentes, despliegue, costos ni otros repos. El origen y su límite final están exclusivamente en docs/PROVENANCE.md.

## Adopción futura
El destino aceptado es crear cada aplicación con [Create a repository from a template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template), personalizarla, comprobarla y empezar su primer flujo. El starter será la única base mantenida para ese recorrido, con código conectado, arquitectura, reglas y documentación propia; no requerirá copiar el kit personal `plantilla/`.

En D, pulir e integrar el formulario genérico de preguntas como `docs/templates/project-context.md`, tomando del kit solo lo útil: problema, usuarios, flujo central, MVP/exclusiones, datos/reglas/permisos, aceptación y decisiones pendientes. Adaptar profundidad al tamaño de la idea; ningún casillero agrega alcance por obligación. El formulario podrá consultarse o adjuntarse antes de crear el repo. El contexto completado de cada aplicación irá en su `PROJECT_CONTEXT.md` raíz, separado del formulario vacío y sin estados del starter.

La guía breve de adopción y crecimiento enlazará README/SETUP, ARCHITECTURE, ADR y protocolos existentes: cómo levantar/personalizar, sustituir la referencia, añadir un flujo y decidir cuándo ampliar la arquitectura. Mantener defaults y criterios de decisión claros, sin diseñar infraestructura hipotética ni repetir manuales. Revalidar HANDOFF y la configuración GitHub propia en la T-000 de adopción; reutilizar código no acredita pruebas ejecutadas ni permisos heredados.

En E se comprobará el recorrido literal desde una copia limpia sin kit. Tras E MERGED y validada, el dueño podrá eliminar su carpeta local `plantilla/`: ningún comando, enlace necesario, formulario ni protocolo dependerá de ella. Conservar hasta entonces su contenido útil; el inicializador nunca la copia ni la borra. No agrega una etapa después de E ni modifica el único límite posterior de PROVENANCE.

## Decisiones trazadas
2026-10-17: mantener versiones y dependencias del snapshot; no actualizar latest. Modo local explícito sin credenciales y Google real sin fallback. Una tarea/PR activos, revisión distinta y squash protegido.
2026-10-17: el dueño acepta el starter autosuficiente como única base de nuevas aplicaciones; integrar y pulir el formulario de contexto en D, probar adopción sin kit en E y retirar después el kit local. Priorizar adopción ágil y documentación canónica; el detalle se trabaja dentro de D/E, sin frenar ni ampliar la implementación B.
