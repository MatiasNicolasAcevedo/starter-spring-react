---
id: T-005
status: in_progress
priority: P1
size: M
milestone: M0
product_cycle: null
counts_for_cycle: false
spec: null
spec_version: null
depends_on: []
branch: codex/t-005-generic-baseline
risk: standard
role: implementer
executor: frontier
pr: null
---
# T-005 · Base inicial genérica y operación económica

## Objetivo
Presentar una base inicial autosuficiente, sin referencias al producto de origen ni bitácoras de construcción. Medir el costo temporal de FULL y proponer alojamiento para varias aplicaciones dentro de US$10–15/mes.

## Alcance
Autorización del dueño 2026-10-20: limpiar documentación/historia operativa; conservar código, versiones, controles y pruebas útiles. La aplicación nueva recibe únicamente contexto, tareas, permisos y evidencia propios. Medir suites y ensayos sin suprimirlos. Proponer VPS compartido y un PostgreSQL con bases/roles separados; sin contratar, desplegar, operar Google real ni copiar/borrar el kit. Historia recuperable en Git, sin reescribir commits.

## Aceptación
- AC-01: árbol actual sin identificadores del origen, fases antiguas ni tareas/specs de construcción obsoletas; documentación breve y enlaces válidos.
- AC-02: el inicializador no copia historias del mantenimiento ni permisos/evidencia; mantiene dry-run, guardias, idempotencia y compilación de copia. Regresión roja antes del arreglo.
- AC-03: FULL informa duración de suites y etapas de infraestructura; diagnóstico distingue mediciones de estimaciones y no reduce controles.
- AC-04: propuesta operativa con varias apps, un PostgreSQL, aislamiento, TLS, backups y límites; precios oficiales fechados, costos recurrentes/renovación y decisión de proveedor pendiente del dueño.
- AC-05: docs-check, regresiones afectadas y FULL local válidos; PR propio a revisión independiente. Esta sesión no revisa ni mergea su implementación.

## Pruebas y checkpoint
Rol planner/implementer de frontera autorizado por el nuevo pedido; Codex desktop/API, familia GPT-6 expuesta; runtime exacto y esfuerzo efectivo no verificables. Sin delegación ni selección simulada. Herramientas: terminal PowerShell/Git Bash, Git/gh, Python/Node/Docker, web y documentación oficial. Impacto: documentos, personalización documental y observabilidad del gate; comportamiento de aplicación/API/permisos/datos/UI sin cambios.

Base `cbaf5b0aaca3212f9c08d870a085a6ba85c8d0b3`, main remoto comprobado y cero PR abiertos. Rama exacta del frontmatter. Evidencia local ignorada en `.orchestrator/t-005/`. Preservar cambios externos y kit. Antes de FULL guardar aquí comando/recursos/cleanup; no editar fuentes durante la corrida.

Dirigidos: `node scripts/docs-check.mjs`; `node --test scripts/test-init-project.mjs scripts/ci/docs-check.test.mjs`; matrices de herramientas según TESTING; FULL `bash scripts/verify.sh` sin opciones, entorno ficticio y proyectos únicos. Primera regresión del inicializador: la copia no debe recibir `docs/archive`; log initializer-red.log, resultado pendiente. Próxima acción: completar limpieza, comprobar rojos/verdes y medir FULL antes de publicar.

## Pendientes
Proveedor, región, dominio y compra quedan para el dueño. La arquitectura de producción se documenta como propuesta; no acredita despliegue ni capacidad medida. Revisión y merge de esta tarea en sesión distinta.

## Validación de fuentes finales
Regresión roja confirmada: la copia heredaba docs/archive. Tras retirar el archivado y mantener lista explícita de bajas, 48/48 dirigidos verdes (31 inicializador + 17 contrato documental), sin omitidos/cancelados; docs-check 42 Markdown/1 tarea/0 de 22. Diagnósticos resueltos antes del gate: bajas documentales aún sin indexar en el export de fixtures; una llamada residual a rewriteLinks tras retirar el archivo. No se rebajaron controles ni assertions útiles.

Antes de FULL: base/HEAD de partida cbaf5b0aaca3212f9c08d870a085a6ba85c8d0b3; comando exacto COMPOSE_ENV_FILES=.env.example COMPOSE_PROJECT_NAME=starter-verify-t005-baseline-20261020 STARTER_E2E_PROJECT=starter-e2e-t005-baseline-20261020 STARTER_SERVER_TESTS=container bash scripts/verify.sh, sin opciones. Preflight vacío por labels exactos; stacks hijos ficticios con namespaces propios y cleanup interno. Logs full.log/full-line-times.jsonl/full-result.json y huellas full-before/full-after.json en .orchestrator/t-005. Cleanup solo del proyecto de verificación propio y comprobación 0/0/0 del E2E; nunca prune ni recursos persistentes ajenos. Fuentes congeladas durante la corrida. Siguiente paso: interpretar tiempos y resultados, publicar al pasar gate; cerrar Markdown sin repetir FULL si base/fuentes coinciden.

FULL intento 1: exit 1 a los 311.9 s, docs 6 s/backend 257 s verdes; client 47 s (132/133, un fallo), E2E no ejecutada. Cleanup 0/0/0 y huellas idénticas. Evidencia conservada en attempt1-*. Causa de la prueba de logout fallida: su assertion de conservar datos privados no esperaba que esos datos existieran antes de cerrar sesión; la habilitación del botón depende de auth/CSRF, no de completar la consulta privada. Arreglo mínimo: esperar explícitamente Datos de Persona A antes de la acción, conservando todas las assertions posteriores, casos, cobertura y deadlines. client/AGENTS leído; solo cambia una precondición del test, sin código de aplicación. Validar dirigido antes de repetir FULL; no reintentar para buscar verde.

Dirigido del arreglo de precondición: npm test -- --run src/features/auth/AuthSession.test.tsx desde client, exit 0, 19/19 en 9.51 s. Reiniciar FULL con los mismos controles, nueva huella de fuentes y namespaces propios ya comprobados vacíos; conservar attempt1 como fallo real, sin atribuirlo a FULL verde. Sin cambios de comportamiento de sesión.
