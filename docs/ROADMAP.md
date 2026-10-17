# ROADMAP · Partes de la base reusable

| Política | Valor |
|---|---|
| Cadencia efectiva | 5 |
| Revisión de ciclo | Cada cinco tareas de producto mergeadas, cierre de parte/hito o cambio relevante |
| WIP | Una tarea y un PR activos; revisión en sesión distinta |

## Secuencia contratada

Cada parte requiere revisión, squash merge confirmado y CI vigente antes de activar la siguiente. Los contratos futuros están en draft, sin ejecución ni evidencia atribuida.

| Parte / tarea | Depende | Salida y prueba exigidas |
|---|---|---|
| A · T-000 | Ancla | Extracción neutralizada, inventario completo sin cambios de versión, docs propias; build/typecheck/docs-check y pruebas heredadas; FULL según gate vigente |
| B · T-001 | A MERGED | Adaptar dev-auth existente a dev.sh up/check/down; modo local explícito sin Google; PostgreSQL 18/server/client conectados; pantalla API/DB real; readiness Actuator incluye DB, ruta exacta por nginx/Vite; Swagger opt-in GET bajo /api/docs, recursos/config/JSON y Try it out. DB vacía, caída DB → health/UI fallan → recuperación; ambos proxies, 1280/375; down conserva desarrollo y cleanup por labels solo de pruebas |
| C · T-002 | B MERGED | Feature de referencia removible propia del usuario: CRUD/paginación/migración/autorización por dueño, formulario RHF/Zod y E2E. Login/logout, CSRF, propiedad/denegación y negativos del perfil real; no perder pruebas OIDC heredadas. Documentar cómo quitar/reemplazar ejemplo; fijar mínimos 80% líneas/70% ramas para dominio/servicios/hooks sin reducir vigentes |
| D · T-003 | C MERGED | init-project.mjs con lista explícita, dry-run por defecto, idempotencia y sin tocar .git/kit/fuera de lista; nombre/slug/paquete/titular, documentos reiniciados (T-000 de adopción). Copia temporal compilable y docs-check; FULL local y CI verdes. Solo entonces beta con límites visibles y repo marcado template, mismo repo base |
| E · T-004 | D MERGED | Segunda copia limpia, app ficticia con identidad/contexto distintos; instalar, levantar, probar, detener y retomar siguiendo README literal: stack conectado, DB vacía, persistencia, login local, E2E, Swagger nginx/Vite, FULL local y CI. Coexistencia sin cruzar puertos/DB/volúmenes; cleanup labels sin huérfanos. No crear otro repo sin decisión del dueño |

## Límites de cierre
En B, Docker Desktop + Git Bash deben bastar para up/check/down sin Maven, PostgreSQL ni Node instalados en el host; usar runners containerizados para los probes reproducibles y declarar cualquier navegador host opcional. Debe haber cero fallback del perfil real y ningún cambio global de hosts. El check valida estado y contenido, no un 200 que sea index.html. El arranque fallido limpia lo recién creado sin borrar volúmenes preexistentes.
En D se contratan además Dependabot semanal, política de actualización con FULL para majors y workflow manual/semanal de personalización/adopción temporal. La CI debe comprobar inicializador, lista de escrituras, build/docs-check e inventario, sin crear otro repo. La autorización para marcar este mismo repo como template en D es específica; no permite modificar las protecciones iniciales.
En E se usan defaults ficticios primero y contexto de otra app después; registrar comandos, SHA, fecha, exit codes, evidencias saneadas y labels sin huérfanos. El proyecto limpio debe poder detenerse y retomarse con datos persistentes propios antes de limpiar sus recursos de prueba.

Beta solo tras D; adopción validada solo tras E. Las comprobaciones de A no acreditan B…E.
Después de E MERGED y validada, STATUS entrega exclusivamente el prompt de constancia documental definido en [PROVENANCE](PROVENANCE.md). No ejecutarlo aquí ni adelantarlo al cierre de A.

## Adopción de otro producto
Reiniciar PROJECT/ROADMAP/STATUS/BACKLOG desde el contexto nuevo, sin estados del starter. La primera tarea es T-000 de adopción; vuelve a validar HANDOFF, configuración GitHub propia y ensayo limpio. Las reglas/protocolos/ADR/spec de auth permanecen heredadas, sin convertirlas en pruebas ejecutadas.
