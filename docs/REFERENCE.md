# Referencia privada removible

La ruta `/reference` demuestra un flujo completo con datos ficticios propios de la sesión: crear, listar con páginas de 20, consultar, editar y confirmar borrado. No incorpora reglas comerciales. Contrato único de campos, propiedad, errores y paginación: [S-003](specs/S-003-reference-security.md). Evidencia propia y estado de entrega: [T-002](tasks/T-002-reference-security.md); código presente no equivale a revisión/merge ni a validación global del starter.

## Conexiones

Backend en `server/src/main/java/com/example/starter/reference/`: `application/` contiene servicio transaccional, entrada normalizada y DTOs; `persistence/` entidad y consultas por UUID de dueño; `web/` controller, advice de errores y metadata OpenAPI. El controller extrae exclusivamente `LocalOidcUser.identity().id()`; servicio y repositorio aplican propiedad a cada recurso. Ninguna consulta de recurso prueba existencia global antes de filtrar. V2 agrega tabla, FK sin cascada e índice de listado. El Clock produce micros UTC antes de persistir para que POST/PUT y GET conserven la misma representación PostgreSQL.

Las únicas aperturas son los métodos/rutas explícitos de referencia en `security/SecurityConfig.java`. El centinela `/api/v1/reference/private` sigue denegado. `AuthOpenApi` expone constantes de los esquemas existentes; `ReferenceOpenApi` exige sesión y CSRF juntos para mutaciones. Swagger conserva el opt-in y «Try it out» solo GET de ADR 0003.

Client en `client/src/features/reference/`: API valida con Zod, hooks usan keys por UUID/página y mutaciones sin reintentos que invalidan solo la identidad iniciadora vigente. `AppRoutes.tsx` conecta `/reference` y `AppShell.tsx` su enlace. Formulario inline RHF/Zod reutiliza FormTextField/applyServerFieldErrors y conserva acceso al cierre de sesión durante un envío; campos readonly/botones bloqueados evitan doble envío. La confirmación de borrado restaura foco a una acción existente; al borrar el último elemento de una página retrocede a una válida. Render React de texto plano, sin HTML interpretado.

`services/http.ts` acepta una guardia opcional `sessionIsCurrent` para requests privados: un 401 tardío de A se rechaza ante su caller pero no publica expiración de B. Sin guardia mantiene la conducta de auth existente. El proveedor de sesión conserva cancelación/limpieza y el shell remonta por identidad; limpiar MutationCache por sí solo no cancela una mutación. La feature nunca escribe su respuesta en cache; tampoco renueva CSRF de otra identidad ni muestra mensajes tardíos en ella.

## Sustituir o retirar

1. Crear la spec/tarea del flujo nuevo y decidir su propiedad/datos. Reemplazar la referencia conservando identidad, sesión, CSRF, system/readiness, proxies y formularios compartidos. No derivar permisos de atributos del proveedor.
2. Retirar o sustituir `reference/`, `features/reference/`, los matchers exactos, ruta/enlace y `ReferenceOpenApi`. Las constantes públicas de `AuthOpenApi` pueden permanecer; no retirar su customizer ni alterar ADR 0003. La guardia HTTP puede servir al flujo nuevo; no quitarla si conserva requests privados en vuelo.
3. Actualizar pruebas propias en `server/src/test/.../reference/`, `client/src/features/reference/*.test.*`, fixture de componentes `client/src/test/msw/referenceBackend.ts` y `e2e/tests/reference.spec.ts`. Retirar de las pruebas compartidas solo las conexiones de referencia: mock/negativos en SecurityConfigTest y test adicional de OpenApiContractIT; conservar todas las assertions de auth/B/Swagger. Helpers HTTP OIDC ampliados siguen siendo útiles para las suites existentes. La operación `reference-login` de `scripts/run-e2e.mjs` prepara solo el login nativo ficticio del proveedor para dos sesiones simultáneas; las operaciones heredadas no dependen de ella.
4. Ajustar las reglas de cobertura específicas en `server/pom.xml` y `client/vite.config.ts` al flujo sustituto; conservar mínimos y política base. Actualizar esta guía y enlaces/arquitectura con el nuevo contrato, ejecutar docs-check y FULL/CI según [TESTING](TESTING.md).

En una copia nueva con DB vacía y V2 todavía no aplicada puede retirarse la migración junto al ejemplo, antes del primer arranque. En una DB existente **V2 aplicada es inmutable**: retirar UI/código no borra sus datos. Conservar V1, app_user y el historial Flyway; cualquier futura migración de retiro requiere tarea y decisión explícita sobre datos. Ningún comando de C borra datos persistentes, migra hacia atrás ni personaliza otra aplicación. El inicializador/template y la adopción pertenecen a D/E.

## Pruebas propias

Mapa canónico C-AC-01…10 en S-003. Unit/slices, PostgreSQL vacío/V1, HTTP con OIDC real, componentes y respuestas retenidas cubren los límites; Playwright recorre API/DB/proveedor reales en 1280/375 sin mocks de API propia. Mínimos de dominio/servicios backend y API/hooks client, negativos y gate: TESTING. Los ensayos usan namespaces nuevos, fixtures ficticias y cleanup por labels; resultados por SHA en T-002/PR, sin heredar evidencia de B ni marcar HANDOFF.
