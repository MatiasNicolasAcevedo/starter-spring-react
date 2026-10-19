---
id: S-003
status: approved
version: 1
milestone: M0
tasks: [T-002]
---
# S-003 · C: referencia removible con propiedad y seguridad

## Problema y usuario
El mantenedor necesita un ejemplo completo que pueda reemplazar al crear otra aplicación: persistencia, API, formulario y permisos comprobados con dos identidades. La base actual demuestra auth y disponibilidad; todavía no tiene CRUD de usuario. La referencia será una lista privada de elementos con título y descripción, sin significado comercial ni permisos derivados del proveedor.
Referencias: [PROJECT_CONTEXT](../../PROJECT_CONTEXT.md), «Objetivo aceptado» y «Alcance y secuencia»; parte C de [ROADMAP](../ROADMAP.md). El contexto genérico no tiene IDs F-/RN-/CA-; los C-AC siguientes trazan este contrato sin inventar reglas de negocio. Auth continúa según [S-001](S-001-auth-google.md), ADR 0002/0003 y las regresiones de B según S-002.

## Historias y reglas
1. Una persona autenticada puede crear, listar, consultar, editar y borrar sus elementos. Un visitante no accede a la API privada; la UI ofrece entrar por el login existente. Ninguna identidad puede listar, leer, editar, borrar ni transferirse elementos ajenos.
2. La propiedad proviene exclusivamente del UUID local de la sesión validada (`LocalOidcUser.identity().id()`), nunca de email, claims, parámetros, body o selección de la UI. Consultas de listado y de un recurso se filtran por dueño en persistencia; el servicio es el límite transaccional y de autorización. No acceder al repositorio de identity desde la feature.
3. Recurso ajeno y UUID inexistente producen el mismo 404 con mensaje fijo y sin datos del dueño; no comprobar primero la existencia global. Sin sesión, GET devuelve 401 y una mutación con CSRF válido también 401; sin CSRF válido, el filtro puede responder primero 403. Todas las respuestas privadas llevan `Cache-Control: no-store`.
4. CSRF, renovación, sesión y tratamiento de 401/403 son los existentes. Solo habilitar los métodos/rutas exactos de esta feature para autenticados; el resto conserva deny-by-default, incluido el centinela `/api/v1/reference/private` de las pruebas heredadas. No abrir `/api/**` ni permitir cualquier método por estar autenticado.
5. `title`: obligatorio, trim, 1…120 caracteres después de trim. `description`: string obligatorio (puede ser vacío), trim, máximo 2000 caracteres. Backend y Zod aplican los mismos límites. No se exige unicidad de título; duplicados permitidos. Texto plano, sin HTML interpretado. El body admite solo estos dos campos; campos desconocidos o inmutables se rechazan con 400 dentro de esta feature, sin cambiar globalmente la deserialización.
6. Cada alta genera UUID v7 y createdAt/updatedAt con Clock UTC. Actualizar cambia título/descripción/updatedAt y conserva id/owner/createdAt. Dos ediciones válidas concurrentes siguen última escritura confirmada; no se contrata versionado ni bloqueo optimista. Borrar elimina solo el elemento, nunca identidad u otros recursos. Repetir DELETE después del éxito devuelve 404.
7. Paginación desde cero, `page` entero >=0 y `size` entero 1…100; defaults 0/20. Orden fijo createdAt DESC, id DESC, para desempatar sin saltos en un conjunto estable. Página fuera de rango devuelve contenido vacío y conteo real. Paginación inválida, UUID inválido y JSON malformado dan 400 seguro; no exponer SQL, valores rechazados ni causas internas. Las inserciones concurrentes pueden mover páginas: no se promete un snapshot entre peticiones.
8. Datos privados usan query keys fuera del prefijo `auth`, ligadas al UUID activo y la página; se habilitan solo con sesión confirmada. Mutaciones invalidan queries de la identidad que las inició, sin `setQueryData` con el resultado ni reintento automático. Si esa identidad dejó de estar activa, su finalización no invalida/refetchea datos de la nueva ni muestra éxito o errores en su pantalla. La limpieza de sesión y el remonte existentes siguen siendo obligatorios.

## Contrato backend
Prefijo de colección `/api/v1/reference-items`; recurso `/{id}` con UUID. DTOs separados de entidades. Representación: `{"id":"01900000-0000-7000-8000-000000000101","title":"Elemento ficticio","description":"Texto de prueba","createdAt":"2026-10-18T12:00:00Z","updatedAt":"2026-10-18T12:00:00Z"}`. Nunca incluye owner, issuer, email, subject ni atributos de autenticación.

| Método/ruta | Entrada | Respuesta / efecto autorizado |
|---|---|---|
| GET colección | page/size según regla 7 | 200 `{"content":[],"page":0,"size":20,"totalElements":0,"totalPages":0}`; solo elementos del usuario actual, DTO de paginación propio estable |
| GET recurso | id | 200 representación propia; ajeno/inexistente 404 indistinguibles |
| POST colección | `{"title":"Elemento ficticio","description":"Texto de prueba"}` | 201 representación y Location relativa al recurso; dueño derivado de sesión y CSRF válido |
| PUT recurso | mismo body completo | 200 representación actualizada; dueño/fecha de creación inmutables, CSRF válido; sin upsert |
| DELETE recurso | sin body | 204 sin body; dueño actual y CSRF válido |

Validación 400 con ProblemDetail (`application/problem+json`); errores de campos `errors[{field,message}]` ordenados por el manejador compartido, sin eco de valores. 404 usa el mismo detalle seguro para ajeno/ausente. 401/403 conservan S-001 y no redirigen al proveedor. Métodos/rutas vecinos permanecen denegados; probar PATCH, rutas adicionales y HEAD/OPTIONS no autorizados sin ampliar permisos por conveniencia. OpenAPI documenta DTOs, page/size, 400/401/403/404 y esquemas sessionCookie/csrfHeader existentes; Swagger conserva opt-in/GET y no agrega ejecución de mutaciones.

## Datos y compatibilidad
Nueva Flyway `V2__create_reference_item.sql`, sin modificar V1 publicada: `reference_item(id UUID PK, owner_id UUID NOT NULL FK app_user(id), title VARCHAR(120) NOT NULL, description VARCHAR(2000) NOT NULL, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL)`. Constraint de título no vacío/trim y longitudes respaldan las reglas; índice `(owner_id, created_at DESC, id DESC)` para filtrar/paginar. FK sin cascada que borre identidad; no seeds ni datos de demo en producción. Hibernate validate.
Probar tanto DB vacía (V1+V2) como DB con V1 e identidad ficticia existente que conserva id/created_at al migrar a V2. Repositorios/servicio prueban aislamiento y timestamps con PostgreSQL 18.6 real. Las IT RANDOM_PORT limpian explícitamente sus escrituras; no confiar en rollback del test para peticiones HTTP.

## Frontend
Ruta `/reference` bajo el shell y enlace «Referencia»; mantener `/` y `/login`. Visitante ve invitación explícita al login sin disparar consultas privadas; cargando/error de sesión no se interpretan como autorización. Persona autenticada ve lista paginada, formulario crear/editar y confirmación de borrado. Usar RHF/Zod, FormTextField/applyServerFieldErrors, HTTP y Query existentes; sin nueva librería/store ni almacenamiento persistente del cliente.
Estados observables: cargando, vacío, listado, guardando/borrando (evitar doble envío), validación de cliente/servidor, error red/5xx con reintento explícito, 404 de recurso retirado con regreso/listado actualizado y 403 con mensaje de rechazo sin fingir fin de sesión. 401 aplica el canal existente y elimina datos privados; CSRF rechazado renueva token pero exige una nueva acción, sin repetir la mutación. Éxito solo tras confirmación real; después de borrar el último elemento de una página, ajustar a una página válida. Labels/roles, foco tras errores y al cerrar edición/confirmación, teclado y 1280/375 sin overflow. Mostrar texto como contenido React, nunca HTML crudo.

## Criterios de aceptación
Destinos de test previstos, todavía no implementados ni ejecutados. Todos pertenecen solo a [T-002](../tasks/T-002-reference-security.md).

| ID | Dado / cuando / entonces | Regla / nivel y destino previsto |
|---|---|---|
| C-AC-01 | DB vacía y DB V1 con identidad previa migran a V2; constraints/JPA validate, identidad y V1 intactas | Datos; PostgreSQL `reference/ReferenceItemRepositoryIT`, prueba de migración `ReferenceItemMigrationIT` |
| C-AC-02 | A crea/lee/edita/borra; UUID/timestamps/Location/status/validación y conteos cumplen contrato | Reglas 5–7; unit `ReferenceItemServiceTest`, slice `ReferenceItemControllerTest`, PostgreSQL/HTTP `ReferenceItemIT` |
| C-AC-03 | A y B tienen datos propios: listas/conteos aislados; B no lee/edita/borra el id de A; 404 igual a ausente y datos de A intactos | Reglas 1–3; servicio/repositorio + HTTP real `ReferenceItemIT`; E2E dos contextos autenticados |
| C-AC-04 | Visitante 401; CSRF ausente/incorrecto 403, válido permite; payload owner/id/fechas no cambia propiedad; vecinos/métodos no amplían acceso | Reglas 2–5; ampliar `SecurityConfigTest`, slice/IT; quitar filtro por dueño y protección CSRF como negativos detectables |
| C-AC-05 | Límites/trim/duplicados, orden estable, página vacía/fuera de rango y parámetros inválidos no pierden aislamiento ni filtran datos | Reglas 5–7; unit/slice + repositorio PostgreSQL; client `reference/api.test.ts` con esquemas Zod |
| C-AC-06 | UI lista/crea/edita/borra/pagina; loading/vacío/validación/error/404/403/success, foco y teclado son observables | Frontend; `ReferencePage.test.tsx`, `ReferenceItemForm.test.tsx`, `useReferenceItems.test.tsx`, E2E 1280/375 |
| C-AC-07 | Mutación A retenida; logout/expiración/cambio a B antes de resolver; al liberar éxito o error no reaparecen cache/datos/mensajes de A ni se afectan consultas B | Regla 8; componente con providers reales `ReferenceSession.test.tsx`, regresión auth existente; negativo que escribe respuesta tardía en cache debe fallar |
| C-AC-08 | Navegador con API/DB/OIDC reales ejecuta CRUD persistido, recarga, dos identidades, denegación y logout; nginx/Vite conservan auth y disponibilidad | Reglas 1–8; `e2e/tests/reference.spec.ts` integrado en gate, sin route/MSW para API propia; conservar ambas matrices de proxies de FULL |
| C-AC-09 | Dominio/servicios backend y API/hooks de referencia client >=80% líneas y >=70% ramas, con archivos sin tests incluidos; gate falla debajo | TESTING; regla JaCoCo acotada a referencia y thresholds v8 por sus rutas, sin bajar reglas base; negativo temporal de umbral/ausencia de cobertura |
| C-AC-10 | Guía enumera cómo quitar/reemplazar referencia sin romper identidad/auth/system ni editar migraciones aplicadas; OpenAPI y FULL/CI coinciden con HEAD publicado | Removibilidad; docs/ARCHITECTURE y guía dedicada, contrato OpenAPI, FULL propio/CI final/revisión independiente y cleanup0/0/0 |

## Removibilidad
Encapsular backend en `reference/`, client en `features/reference/`, tests junto a esas rutas y E2E en su spec; enumerar conexiones mínimas (security matchers, ruta/enlace, configuración de cobertura, migración y pruebas/docs). La guía distinguirá copia nueva/DB vacía de DB existente: en una copia nueva se puede retirar la migración aún no aplicada; en una DB existente V2 es inmutable y no se promete borrar datos al quitar UI/código. Una futura migración de retiro requiere tarea/decisión sobre datos; ningún inicializador de C la ejecuta. Conservar V1, identity/security, infra de formularios y disponibilidad. La guía pertenece al repo; no al kit personal.

## División y fuera de alcance
C1 datos/servicio → C2 HTTP/permisos → C3 UI/cache → C4 integración/cobertura/guía/FULL, detallados en T-002. Una tarea/PR de M0 con unidades secuenciales, sin delegación. No implementar D/E, init-project, beta/template, adopción de otro producto, smoke Google real ni el endurecimiento futuro del callback. Sin roles, búsqueda, adjuntos, versiones de edición, soft delete, CORS, auth propia, cambios de dependencias/locks, origen, recursos ajenos, hosts globales o protecciones. No optimizar el gate como parte de este CRUD.

## Validación de planificación · 2026-10-18
Planner nuevo: Codex desktop/API y terminal PowerShell/Git Bash; familia declarada GPT-6, identificador runtime exacto y esfuerzo efectivo no expuestos. Sol/high es preferencia del dueño, sin simular selección, delegación ni otra sesión/modelo. `approved` significa alineación con el brief/autonomía vigentes, no aprobación humana ni revisión de implementación. B MERGED y CI FULL PR/main comprobadas en el cierre de T-001. Esta sesión solo publica planificación y conciliación; ninguna prueba de C ejecutada ni criterio HANDOFF acreditado.
