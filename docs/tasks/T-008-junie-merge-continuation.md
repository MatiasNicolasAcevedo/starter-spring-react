---
id: T-008
status: mergeable
priority: P1
size: S
milestone: M0
spec: null
depends_on: [T-007]
branch: codex/t-008-junie-merge-continuation
role: merger
executor: frontier
counts_for_cycle: false
pr: 9
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

Revisión independiente R1 favorable sobre HEAD publicado 8cb550c983b00fc619198393bbf09aaece93b1b0 y base main 9547a33bccfed49da6691587426677eba879876d; alcance, gate STARTER conservado, copia y protecciones comprobados abajo. Transición exclusivamente documental a mergeable/merger. Pendiente/responsable/salida: esta sesión revisora publica la transición, comprueba HEAD final y CI propia, publica APROBADO con SHA/base exactos y continúa merger del mismo PR si AUTONOMY sigue satisfecha. No hacer commits después de APROBADO. La consulta de merge y su evidencia se publican en PR9; la siguiente rama autorizada las concilia aquí. No hay otra tarea predefinida ready: tras MERGED confirmado vuelve a frontera/dueño para decidir el siguiente objetivo en otra sesión, sin iniciar otra tarea aquí.

## Gate STARTER · checkpoint previo

HEAD/base origin/main 9547a33bccfed49da6691587426677eba879876d; fuentes técnicas aún sin commit. Comando PowerShell: `& 'C:\Program Files\Git\bin\bash.exe' scripts/verify.sh --starter`, COMPOSE_ENV_FILES=.env.example, STARTER_SERVER_TESTS=container, COMPOSE_PROJECT_NAME=starter-verify-t008-20261025a, STARTER_E2E_PROJECT=starter-e2e-t008-20261025a. Comprobar ausencia de container/network/volume para ambos labels exactos antes de operar; si no están vacíos, abortar sin cleanup ajeno. Huellas de archivos versionados y nuevo contrato en .orchestrator/t-008/gate-before.json; salida capturada en gate.log, sin secretos ni .env real. Cleanup exterior: docker compose --env-file .env.example -p starter-verify-t008-20261025a down --volumes --remove-orphans; E2E/tooling conservan cleanup propio. Guardar exit original y cleanup, comprobar labels cero, HEAD/base y huellas inmóviles en gate-after.json/gate-result.json. No editar fuentes durante la corrida. Próxima acción: recoger resultados completos; publicar solo con gate verde o documentar causa/retoma si falla.

## Resultados del gate y entrega

2026-10-25, comando canónico del checkpoint, exit 0 en 2812.067 s; cleanup exterior exit 0. Suites docs 6 s, server 305 s, client 57 s, tooling 1970 s, e2e 471 s, todas exit 0. Backend 91 unitarios/slices y 75 IT PostgreSQL sin fallos ni omitidos; frontend completo con cobertura/build; copia compilable personalizada con mismas suites técnicas verdes; nginx/Vite, fallos/rollback/persistencia, copia sin Git, señales y proxies verdes. Playwright real y saneador negativo pasan; reporte saneado de producto con cero fallos. No se sustituyó el gate por pasos manuales ni se rebajaron controles.

Preflight de labels exteriores vacío y cierre container/network/volume 0/0/0 en los dos proyectos exactos del checkpoint. Los ensayos de tooling acreditan su cleanup propio en gate.log. Auditoría before/after: 282/282 huellas iguales y HEAD/base inmóviles; gate-result.json confirma gateExit=0, cleanupExit=0, labelsClean=true y sourcesUnchanged=true. Wrapper propio ignorado run-gate.ps1 conserva entorno/exit/cleanup; no se leyó .env real ni se operaron recursos ajenos.

La publicación y transición posterior solo cambian tarea/STATUS/BACKLOG; conservar gate mientras inventario, demás fuentes y base coincidan. Antes de cada commit: docs-check, diff-check e índice explícito sin plantilla (kit ausente, git check-ignore plantilla/ devuelve ignorado). Revisión pendiente en sesión nueva; esta sesión autora no publica APROBADO ni mergea. El prompt de STATUS pasa a reviewer después de comprobar PR real y CI del HEAD publicado.

## Publicación comprobada · 2026-10-25

Commit/push de fuentes exit 0, 043553f9fcafab9dfe8ff2c92dd39a6298fb9a47. `gh pr create --repo MatiasNicolasAcevedo/starter-spring-react --base main --head codex/t-008-junie-merge-continuation --draft --title … --body-file .orchestrator/t-008/pr-body.md`: exit 0, PR9. Confirmación `gh pr view --repo MatiasNicolasAcevedo/starter-spring-react codex/t-008-junie-merge-continuation --json number,url,state,isDraft,mergedAt,mergeCommit,headRefOid,baseRefOid,baseRefName,statusCheckRollup`: exit 0, number 9, URL https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/9, OPEN/draft, base main/9547a33bccfed49da6691587426677eba879876d, HEAD 043553f9fcafab9dfe8ff2c92dd39a6298fb9a47, mergedAt/mergeCommit null; CI entonces QUEUED. Existencia comprobada; no MERGED ni APROBADO. Fetch previo exit 0 confirma base inmóvil.

Transición solo de tarea/STATUS/BACKLOG comprobada: docs-check exit 0, checker dirigido 35/35 exit 0 (13.513 s, docs-transition.log), diff-check exit 0. Auditoría contra gate-after.json: únicamente esas tres rutas difieren; inventario y demás fuentes idénticos. `bash scripts/verify.sh --policy origin/main`: exit 0, policy FULL/profile STARTER por la única ruta técnica (inventario), gate correspondiente satisfecho. No repetir STARTER por este cierre Markdown. Después de push comprobar HEAD remoto/CI propia y pasar ready; HEAD/CI finales y consulta remota se conservan en el comentario de entrega del autor en PR9, sin commit recursivo para escribir el SHA del propio commit. El revisor consulta el HEAD definitivo en GitHub y conserva gate si fuentes/base siguen iguales.

## Revisión independiente R1 · 2026-10-25

Sesión nueva, distinta de la implementación: frontera reviewer y continuación merger, Codex desktop/API, familia GPT-6 expuesta; variante exacta y esfuerzo efectivos no expuestos. Herramientas propias PowerShell, Git/gh, Node 24.21.0 y Git Bash; sin delegación ni ejecución Junie. Impacto exclusivamente documental/operativo y exclusión de la tarea en copias; sin cambios de comportamiento/API/auth/permisos técnicos/datos/UI de aplicación.

Precondición: árbol limpio, rama exacta, fetch exit 0; HEAD local/origin de tarea 8cb550c983b00fc619198393bbf09aaece93b1b0 y origin/main 9547a33bccfed49da6691587426677eba879876d. `gh pr view 9 --repo MatiasNicolasAcevedo/starter-spring-react --json number,url,state,isDraft,mergedAt,mergeCommit,headRefOid,baseRefOid,baseRefName,statusCheckRollup`: primer intento sandbox exit 1 por conexión; consulta con red exit 0, PR9 OPEN/no draft, URL correcta, HEAD/base anteriores, mergedAt/mergeCommit null. CI propia consultada por `gh api repos/MatiasNicolasAcevedo/starter-spring-react/commits/8cb550c983b00fc619198393bbf09aaece93b1b0/check-runs`: ambos verify-required completed/success con ese head_sha. Solo PR9 abierto; sin reviews ni conversaciones (GraphQL reviewThreads totalCount 0). Ruleset 25305930 active, sin bypass, strict y verify-required integración 15368, cero aprobaciones formales, resolución obligatoria, solo squash; PR MERGEABLE/CLEAN. Se reconsultan después de publicar el HEAD documental.

Diff completo de 11 archivos revisado. El permiso explícito de Junie conserva independencia, SHA/base, gate, CI y protecciones; distingue autorización de capacidad. AGENTS/ORCHESTRATION/protocolos/plantilla exigen prompt completo ante bloqueantes sin dar por otorgada una decisión pendiente. REMOVE_FILES agrega solo T-008; adoptionDocuments reemplaza AUTONOMY por decisión propia pendiente y conserva guías genéricas, sin trasladar permisos ni evidencia. Conciliación de T-007 corresponde a la nueva rama. Sin hallazgos bloqueantes ni correcciones de implementación; primera ronda de un máximo de dos.

Gate conservado: auditoría independiente de gate-before.json/gate-after.json, 282/282 huellas idénticas durante la corrida, HEAD/base inmóviles; contra el árbol publicado solo difieren tarea/STATUS/BACKLOG. gate-result.json: gateExit=0, cleanupExit=0, labelsClean=true, sourcesUnchanged=true, 2812.067 s. gate.log confirma docs/server/client/tooling/e2e exit 0, 91 unitarios/slices y 75 IT sin fallos/omitidos, copia compilable, negativos, Playwright real y saneador fail-closed. Cleanup exterior y propio de tooling acreditados; no se reejecuta FULL por Markdown. `bash scripts/verify.sh --policy origin/main`: sandbox bloqueó Git Bash con NtCreateDirectoryObject/0xC0000022 (exit -1073741502); mismo comando fuera del sandbox exit 0, policy FULL/profile STARTER, única ruta técnica inventario. Incidencias de entorno resueltas, sin permisos nuevos ni cambios de configuración.

Dirigido independiente: `node --test --test-name-pattern="apply connects identity" scripts/test-init-project.mjs`, exit 0, 1/1, sin fallos/cancelados/omitidos, 22.217 s (.orchestrator/t-008/review-r1-copy.log). Comprueba exclusión de mantenimiento, autonomía pendiente, idempotencia, negativos y checker de copia. Antes del commit de transición: `node scripts/docs-check.mjs`, `node --test scripts/ci/docs-check.test.mjs` y `git diff --check`; registrar resultado en el comentario del HEAD final y conservar log review-r1-transition.log. Recursos: solo fixtures ficticias propias con cleanup del test; sin nuevos stacks. Revisar el diff documental, índice explícito y exclusión de plantilla antes de publicar; esperar CI propia del nuevo HEAD antes del veredicto vinculante.

Transición revisada: solo tarea/STATUS/BACKLOG; docs-check exit 0, checker 35/35 exit 0, sin fallos/cancelados/omitidos, 13.299 s (review-r1-transition.log), diff-check exit 0. No cambian fuentes técnicas/base ni criterios de HANDOFF. Kit plantilla ausente e inventario versionado/índice sin plantilla; staging restringido a estas tres rutas. HEAD final, CI propia y veredicto se registran en el comentario de PR9 después del push, sin commit recursivo ni commits posteriores a APROBADO.
