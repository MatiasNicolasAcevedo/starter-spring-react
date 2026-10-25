---
id: T-008
status: in_progress
priority: P1
size: S
milestone: M0
spec: null
depends_on: [T-007]
branch: codex/t-008-junie-merge-continuation
role: implementer
executor: frontier
counts_for_cycle: false
pr: null
---
# T-008 · Merge autorizado de Junie y continuidad ante bloqueos

## Objetivo y contrato

Encargo explícito del dueño el 2026-10-25: aclarar en AUTONOMY que Junie puede hacer merge sin volver a pedir permiso al dueño y reforzar que siempre entregue el próximo prompt aun ante bloqueantes o problemas pendientes.

## Alcance y decisiones resueltas

Explicitar el permiso existente de squash merge elegible para Junie revisor/merger, sin autoaprobar ni mergear la propia implementación, y conservar SHA/base, gate, CI y protecciones. Reforzar el prompt obligatorio en AGENTS/ORCHESTRATION, protocolos afectados y plantilla de tarea. Las copias conservan reglas de continuidad y orientación para decidir su propia autonomía; no reciben permisos del mantenimiento. Excluir esta tarea del inventario de copia. Sin cambios de aplicación, versiones, auth, datos, UI ni permisos de GitHub. Aclaración operativa del permiso Git ya autorizado.

## Leer antes

1. [AUTONOMY](../AUTONOMY.md), permiso y condiciones de merge.
2. [ORCHESTRATION](../ORCHESTRATION.md#prompt-obligatorio-al-cierre), continuidad y hechos remotos.
3. [Reviewer](../agents/reviewer.md) y [merger](../agents/merger.md).
4. [TESTING](../TESTING.md), perfil conservador por inventario de inicializador.
5. [Inventario](../../scripts/lib/init-project-manifest.mjs), [documentos de copia](../../scripts/lib/init-project-documents.mjs) y regresión existente del inicializador.

## Archivos y pasos

1. Aclarar el permiso y la retoma ante problemas en las guías canónicas y plantilla; conservar permisos propios pendientes de cada copia.
2. Demostrar rojo con el test existente de copia por la tarea nueva; agregar solo su exclusión y comprobar verde sin duplicar tests.
3. Ejecutar dirigidos/docs y gate STARTER sobre fuentes/base estables; publicar un PR para revisión en otra sesión.

## Aceptación y pruebas

- Junie revisor independiente/merger autorizado realiza squash elegible sin confirmación rutinaria del dueño; conserva todas las condiciones existentes y distingue capacidad técnica de autorización.
- Todo cierre incluye prompt completo y copiable, también ante bloqueantes, errores, pruebas fallidas, límites de intentos o decisiones pendientes. Identifica rol/tarea, evidencia, precondición, responsable, acción y salida; pedir una decisión no sustituye el prompt ni permite proceder sin ella.
- Copia ficticia mantiene AUTONOMY propia pendiente, conserva las guías genéricas y excluye esta tarea/evidencia de mantenimiento.

Desde raíz PowerShell con Node 24/Git Bash/Docker: `node --test --test-name-pattern="apply connects identity" scripts/test-init-project.mjs` (rojo antes de exclusión); `node --test "scripts/ci/*.test.mjs"` (incluye inicializador); `node scripts/docs-check.mjs`; `git diff --check`. Gate conservador: `& 'C:\Program Files\Git\bin\bash.exe' scripts/verify.sh --starter`, con `.env.example`, backend container y namespaces nuevos propios según SETUP. Registrar checkpoint antes de la corrida, logs saneados, exit y cleanup. No introducir tests que dupliquen texto documental.

## Sesión y conciliación inicial

Frontera planner/implementer, Codex desktop/API, familia GPT-6 expuesta; variante exacta y esfuerzo efectivos no expuestos. PowerShell, Git/gh y Node 24.21.0; Git Bash/Docker pendientes de sonda fuera del sandbox. Sin delegación ni ejecución Junie. Impacto en instrucciones y operación de agentes/inventario de copia; sin comportamiento/API/auth/datos/UI de aplicación ni cambio técnico de permisos.

Árbol inicial limpio en la rama ya mergeada de T-007. `gh pr view 8 --repo MatiasNicolasAcevedo/starter-spring-react --json number,url,state,mergedAt,mergeCommit,headRefOid,baseRefOid,baseRefName,statusCheckRollup`: primer intento sandbox exit 1 por conexión; consulta con acceso de red exit 0, PR8 MERGED, base main, fecha 2026-10-23T19:01:16Z, mergeCommit.oid 9547a33bccfed49da6691587426677eba879876d. `gh pr list --repo MatiasNicolasAcevedo/starter-spring-react --state open --json number,title,headRefName`: exit 0, lista vacía. Consulta 2026-10-25. Fetch exit 0 y rama exacta nueva desde origin/main 9547a33bccfed49da6691587426677eba879876d; conciliar T-007 done aquí sin modificar su rama mergeada.

## Correcciones significativas

| Fecha | Problema / causa | Corrección | Prueba |
|---|---|---|---|
| 2026-10-25 | La tarea nueva se heredaba al crear una aplicación: 2 tareas en vez de 1 | Agregar únicamente T-008 a REMOVE_FILES | Test existente `apply connects identity`: rojo exit 1 antes de exclusión; verde 1/1 exit 0 después, con idempotencia y docs de copia. Logs copy-red.log y copy-green.log en .orchestrator/t-008 |

## Checkpoint vigente

HEAD/base 9547a33bccfed49da6691587426677eba879876d. Guías e inventario corregidos; copia dirigida verde 1/1, docs-check y diff-check exit 0. Docker sandbox denegó acceso al pipe; sonda fuera del sandbox exit 0: Linux, Git Bash /usr/bin/bash, Node host 24.21.0 y Compose 2.40.2-desktop.1, sin instalar ni cambiar configuración global. Matriz dirigida completa exit 0, 131/131, sin fallos/cancelados/omitidos, 81.726 s (.orchestrator/t-008/directed.log). Gate STARTER completo verde y cleanup acreditado abajo. Pendiente: publicar fuentes y PR, cerrar transición documental a in_review y entregar revisión independiente en sesión nueva. No hay otra tarea predefinida siguiente: tras MERGED vuelve a frontera/dueño para decidir el siguiente objetivo en otra sesión.

## Gate STARTER · checkpoint previo

HEAD/base origin/main 9547a33bccfed49da6691587426677eba879876d; fuentes técnicas aún sin commit. Comando PowerShell: `& 'C:\Program Files\Git\bin\bash.exe' scripts/verify.sh --starter`, COMPOSE_ENV_FILES=.env.example, STARTER_SERVER_TESTS=container, COMPOSE_PROJECT_NAME=starter-verify-t008-20261025a, STARTER_E2E_PROJECT=starter-e2e-t008-20261025a. Comprobar ausencia de container/network/volume para ambos labels exactos antes de operar; si no están vacíos, abortar sin cleanup ajeno. Huellas de archivos versionados y nuevo contrato en .orchestrator/t-008/gate-before.json; salida capturada en gate.log, sin secretos ni .env real. Cleanup exterior: docker compose --env-file .env.example -p starter-verify-t008-20261025a down --volumes --remove-orphans; E2E/tooling conservan cleanup propio. Guardar exit original y cleanup, comprobar labels cero, HEAD/base y huellas inmóviles en gate-after.json/gate-result.json. No editar fuentes durante la corrida. Próxima acción: recoger resultados completos; publicar solo con gate verde o documentar causa/retoma si falla.

## Resultados del gate y entrega

2026-10-25, comando canónico del checkpoint, exit 0 en 2812.067 s; cleanup exterior exit 0. Suites docs 6 s, server 305 s, client 57 s, tooling 1970 s, e2e 471 s, todas exit 0. Backend 91 unitarios/slices y 75 IT PostgreSQL sin fallos ni omitidos; frontend completo con cobertura/build; copia compilable personalizada con mismas suites técnicas verdes; nginx/Vite, fallos/rollback/persistencia, copia sin Git, señales y proxies verdes. Playwright real y saneador negativo pasan; reporte saneado de producto con cero fallos. No se sustituyó el gate por pasos manuales ni se rebajaron controles.

Preflight de labels exteriores vacío y cierre container/network/volume 0/0/0 en los dos proyectos exactos del checkpoint. Los ensayos de tooling acreditan su cleanup propio en gate.log. Auditoría before/after: 282/282 huellas iguales y HEAD/base inmóviles; gate-result.json confirma gateExit=0, cleanupExit=0, labelsClean=true y sourcesUnchanged=true. Wrapper propio ignorado run-gate.ps1 conserva entorno/exit/cleanup; no se leyó .env real ni se operaron recursos ajenos.

La publicación y transición posterior solo cambian tarea/STATUS/BACKLOG; conservar gate mientras inventario, demás fuentes y base coincidan. Antes de cada commit: docs-check, diff-check e índice explícito sin plantilla (kit ausente, git check-ignore plantilla/ devuelve ignorado). Revisión pendiente en sesión nueva; esta sesión autora no publica APROBADO ni mergea. El prompt de STATUS pasa a reviewer después de comprobar PR real y CI del HEAD publicado.
