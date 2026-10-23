---
id: T-007
status: mergeable
priority: P1
size: S
milestone: M0
spec: null
depends_on: [T-006]
branch: codex/t-007-agent-operating-rules
role: merger
executor: frontier
counts_for_cycle: false
pr: 8
---
# T-007 · Continuidad y verificación explícitas para futuras copias

## Objetivo y contrato

Encargo explícito del dueño el 2026-10-22: incorporar al Starter las tres reglas surgidas de su uso de agentes, para futuras aplicaciones: prompt de continuación completo, entrada Windows comprobable al gate y hechos remotos de publicación/MERGED. Aplicar reglas genéricas sin trasladar contexto, tareas, permisos o evidencia de otra aplicación. No modificar esa aplicación desde esta tarea.

## Alcance y decisiones

AGENTS y ORCHESTRATION contienen contrato canónico y enlaces desde protocolos/template; SETUP documenta PowerShell como entrada al mismo Bash con Node existente, PATH local, namespace estable, preflight/exit y cleanup. No reimplementar el runner, cambiar scripts de verificación, dependencias/locks, API/auth/datos/UI ni permisos/protecciones. El inventario del inicializador excluye también esta tarea de mantenimiento; sus guías operativas permanecen canónicas en las copias. T-006 se concilia done con consulta remota al primer avance de esta rama.

## Referencias

1. [ORCHESTRATION](../ORCHESTRATION.md), hechos GitHub y prompt obligatorio.
2. [SETUP](../SETUP.md), verificación desde PowerShell.
3. [TESTING](../TESTING.md), gate STARTER por inventario de inicializador.
4. [AUTONOMY](../AUTONOMY.md), autorización y revisión independiente.
5. [Inventario](../../scripts/lib/init-project-manifest.mjs) y [regresiones existentes](../../scripts/test-init-project.mjs).

## Aceptación y pruebas

- Cada rol recibe prompt copiable y hechos remotos explícitos; errores/OPEN/CLOSED/inexistente no satisfacen MERGED. Cierre postmerge no exige commits en rama mergeada.
- Entrada PowerShell conserva el script canónico y Node del host; sonda y policy comprobados desde esta superficie; un resultado parcial nunca se anuncia como FULL.
- Inicialización de copia ficticia conserva guías genéricas, AUTONOMY propia pendiente y ausencia de tareas/historia de mantenimiento. Primero rojo con la tarea nueva sin exclusión, luego verde al incluirla en REMOVE_FILES; usar el test existente de copia, sin duplicarlo.
- Gate STARTER completo por cambio del inventario, fixtures ficticias, aislamiento y cleanup propios, con fuentes/base inmóviles y logs saneados. Publicación en un PR y revisión en sesión distinta; sin merge propio.

Comandos dirigidos: node --test --test-name-pattern="apply connects identity" scripts/test-init-project.mjs; node --test scripts/test-init-project.mjs; node --test "scripts/ci/*.test.mjs"; node scripts/docs-check.mjs; git diff --check. Sonda Windows y --policy en SETUP. Gate: desde PowerShell invocar Git Bash explícito con scripts/verify.sh --starter, .env.example, STARTER_SERVER_TESTS=container y namespaces propios comprobados ausentes. Checkpoint de gate abajo antes de iniciar.

## Sesión y conciliación inicial

Frontera implementer, Codex; variante exacta y esfuerzo no expuestos. PowerShell, Git/gh, Node 24.21.0 y Git Bash/Docker; sin delegación ni ejecución Junie. Impacto en instrucciones/operación de agentes e inventario de exclusión; sin comportamiento/API/permisos/datos/UI de aplicación.

Árbol inicial limpio en rama anterior T-006. PR7 confirmado MERGED con fecha 2026-10-21T23:18:44Z y SHA 8d2fafecb0cfbd617998a41388c0855c676b3848; lista de PR abiertos vacía. Fetch y rama exacta nueva desde origin/main publicado. Pendiente: rojo de copia, exclusión explícita, dirigidos y gate STARTER; después publicación y prompt reviewer. No existe otra tarea predefinida para implementar tras esta; el cierre de merge devuelve al dueño con prompt concreto de frontera.


## Gate STARTER · checkpoint previo
HEAD 8d2fafecb0cfbd617998a41388c0855c676b3848, base origin/main 8d2fafecb0cfbd617998a41388c0855c676b3848. Cambios de fuentes sin commit; huellas de archivos en .orchestrator/t-007/gate-before.json (incluye este checkpoint). Comando desde PowerShell: & 'C:\Program Files\Git\bin\bash.exe' scripts/verify.sh --starter; entorno COMPOSE_ENV_FILES=.env.example, STARTER_SERVER_TESTS=container, COMPOSE_PROJECT_NAME=starter-verify-agent-rules-1792723644, STARTER_E2E_PROJECT=starter-e2e-agent-rules-1792723644. Preflight exacto de labels de container/network/volume de ambos proyectos vacío. Log saneado: .orchestrator/t-007/gate.log. Cleanup: docker compose --env-file .env.example -p starter-verify-agent-rules-1792723644 down --volumes --remove-orphans; E2E/tooling mantienen cleanup propio, luego comprobar labels vacíos y huellas/base/HEAD inmóviles. No editar fuentes durante la corrida. Próximo paso: registrar exit/resultados/cleanup y publicar únicamente si el gate completo pasa; revisión en otra sesión.


## Resultados propios y corrección significativa

Rojo: node --test --test-name-pattern="apply connects identity" scripts/test-init-project.mjs, exit 1 por 2 tareas copiadas en vez de 1 (copy-red.log); la tarea nueva se heredaba. Corrección: agregar solo T-007 al inventario REMOVE_FILES, sin ampliar escrituras ni cambiar el mecanismo. Verde: node --test scripts/test-init-project.mjs, 36/36 exit 0 (copy-green.log); copia ficticia mantiene autonomía pendiente, guías genéricas, exclusión de mantenimiento e idempotencia. Matriz de herramientas/docs/clasificación: 131/131 exit 0 (ci-directed.log). Sin tests duplicados ni rebajas.

Sonda del bloque exacto de SETUP ejecutada desde PowerShell: Git Bash /usr/bin/bash, Node host v24.21.0, Docker Compose v2.40.2-desktop.1, exit 0. --policy antes de commits informó STARTER conservador por diff vacío; se inspeccionó también el diff sin commit (inventario => STARTER). No se cambió configuración global ni se instaló otro Node. Estas son comprobaciones de frontera, no de Junie.

Gate STARTER completo: exit 0, 2476.974 s, cleanup exterior exit 0. Suites: docs 4s exit 0; server 244s exit 0; client 52s exit 0; tooling 1791s exit 0; e2e 384s exit 0. Logs y JSON before/after/result en .orchestrator/t-007/. Huellas de todos los archivos idénticas antes/después, HEAD/base 8d2fafecb0cfbd617998a41388c0855c676b3848 inmóviles. Recursos exteriores starter-verify-agent-rules-1792723644 y starter-e2e-agent-rules-1792723644: container/network/volume 0/0/0; los ensayos propios de tooling comprobaron su cleanup en el log. No hubo edición de fuentes durante la corrida.

Pendiente: publicación del primer avance y PR; después transición solo documental a in_review y revisión independiente en sesión nueva. El gate se conserva mientras inventario, demás fuentes y base coincidan; comprobar docs-check/diff-check y CI del HEAD publicado final. No APROBADO ni merge propios.


## Entrega a revisión independiente

Fuentes publicadas en f372e4f9c23ced0d3e0d0b2c4d2c84bd6936a0eb. [PR8](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/8) creado y existencia comprobada con gh pr view 8 --repo MatiasNicolasAcevedo/starter-spring-react --json number,url,state,isDraft,mergedAt,mergeCommit,headRefOid,baseRefOid,baseRefName: exit 0, number 8, state OPEN, base main/8d2fafecb0cfbd617998a41388c0855c676b3848, head f372e4f9c23ced0d3e0d0b2c4d2c84bd6936a0eb, mergedAt/mergeCommit null. No MERGED ni APROBADO. El borrador pasa a ready después de publicar esta transición.

Transición posterior limitada a esta tarea/STATUS/BACKLOG. Gate STARTER conservado por inventario y demás fuentes/base idénticos; huellas/log/cleanup propios disponibles arriba. Ejecutar docs-check, regresiones documentales y diff-check; publicar y exigir verify-required SUCCESS del HEAD final. HEAD/CI finales consultables en el PR; esta documentación no inventa un SHA de su propio commit.

Pendiente: revisión independiente R1, responsable nueva sesión reviewer, con diff completo y fuentes/base publicados, gate/huellas y evidencia saneada. Salida: APROBADO exacto o CAMBIOS REQUERIDOS; máximo dos rondas. La sesión revisora puede continuar el merger del mismo PR únicamente por AUTONOMY, con SHA revisado/checks y confirmación GitHub posterior. Esta sesión autora no revisa ni mergea. No hay otra tarea ready: después de MERGED volver al dueño con prompt concreto para preparar el siguiente objetivo o nueva copia, sin operar otras aplicaciones. Conciliar done únicamente en el primer avance de una futura rama autorizada.

Transición local comprobada: docs-check exit 0, regresiones documentales 35/35 exit 0 (docs-transition.log), diff-check exit 0. Auditoría contra gate-after.json: únicamente tarea/STATUS/BACKLOG difieren; las demás fuentes y origin/main coinciden. No se repite STARTER por este cierre documental.

## Revisión independiente R1 · 2026-10-23

Sesión nueva de frontera reviewer, distinta de implementación; Codex desktop/API, GPT-6 expuesto, variante runtime y esfuerzo efectivos no expuestos. PowerShell, Git/gh, Node 24.21.0, Git Bash y Docker; sin delegación ni ejecución Junie. Solo revisión y transición documental, sin impacto adicional en comportamiento/API/permisos/datos/UI.

Consulta inicial `gh pr view 8 --repo MatiasNicolasAcevedo/starter-spring-react --json number,url,state,mergedAt,mergeCommit,headRefOid,baseRefOid,baseRefName,statusCheckRollup`: primer intento sandbox exit 1 por conexión; repetición con acceso de red exit 0, PR8 OPEN, base main/8d2fafecb0cfbd617998a41388c0855c676b3848, HEAD dd5fa546f3b55a149465e2cd575034b7e26f0969, mergedAt/mergeCommit null. HEAD coincide con el árbol limpio y la rama remota. Único PR abierto, propio y ready; CI vigente SUCCESS run 39895617993, posterior a run 39895615673 cancelado por concurrencia. No se acredita la ejecución cancelada.

Diff completo de 14 rutas revisado. Inventario solo añade T-007 a REMOVE_FILES; no cambia runner, controles, versiones ni permisos. Rojo real existente: tarea de mantenimiento heredada, 2 tareas frente a 1; verde 36/36. Ensayo adicional de revisión en copia ficticia: tres reglas genéricas presentes en AGENTS/ORCHESTRATION/SETUP; instrucciones, tareas y evidencia de mantenimiento ausentes; AUTONOMY propia pendiente. Fixture propio eliminado en finally. Protocolos y template enlazan el contrato canónico y distinguen consulta fallida/OPEN/CLOSED/MERGED sin crédito heredado.

Gate STARTER auditado: 281/281 huellas antes/después iguales, base inmóvil y todas las fuentes técnicas publicadas idénticas. Solo tarea/STATUS/BACKLOG difieren desde el gate; cinco suites exit 0 y logs concordantes con gate-result.json (2476.974 s). Backend 91 unitarios/slices y 75 IT PostgreSQL; copia compilable y Playwright real, saneador negativo, rollback y señal SIGTERM exit 143 con cleanup acreditados. Sonda exacta de SETUP y `--policy origin/main` ejecutados en esta superficie, exit 0 y perfil STARTER; consulta propia de los dos namespaces exteriores: container/network/volume 0/0/0. Ningún recurso creado o borrado por esta revisión. No se repite FULL por la transición Markdown.

Protecciones efectivas consultadas: ruleset 25305930, PR con 0 aprobaciones formales, squash, verify-required estricto, resolución de conversaciones, sin force push. PR8 sin reviews ni hilos; configuración conserva solo squash y borrado automático. Sin hallazgos bloqueantes hasta aquí, una ronda de dos. Dirigidos propios en curso: `node --test scripts/test-init-project.mjs` y `node --test "scripts/ci/*.test.mjs"`, logs saneados .orchestrator/t-007/review-r1/init.log y review-r1-ci.log; solo fixtures efímeros propios con cleanup del test. Próximo paso: recoger exits, comprobar transición documental y publicar veredicto exacto únicamente tras CI verde del HEAD final. Responsable esta sesión reviewer/merger; salida MERGED confirmado o checkpoint de la causa concreta, sin iniciar otra tarea.

Incidencia del entorno y siguiente intento distinto: dirigidos sandbox exit 1, inicializador 35/36 por symlink EPERM y matriz CI 80/93 por escritura .git/config de fixture denegada, symlink EPERM y arranque Bash restringido (exit 3221225794). No se acredita éxito global. Ejecutar la misma matriz CI fuera del sandbox, que ya incluye los 36 casos del inicializador, sin cambios de fuentes/tests/base; log .orchestrator/t-007/review-r1-ci-host.log. Fixtures efímeros propios y cleanup del test; no stacks. Este intento no constituye una segunda ronda de revisión ni una corrección de implementación.

Resultado host: exit 0, 131/131 en 85.175 s, cero fallos/cancelados/omitidos, incluidos inicializador 36/36 y checker 35/35. No se cambiaron tests ni implementación para superar el sandbox. Auditoría propia conservada en .orchestrator/t-007/review-r1-audit.json; sonda/cleanup remotos y ruleset activo sin bypass reconsultados. R1 favorable sin hallazgos bloqueantes, una ronda de dos; gate STARTER válido conservado.

## Checkpoint vigente · transición favorable y cierre de PR8

Solo tarea/STATUS/BACKLOG pasan a mergeable, rol merger. Antes de publicar: `node --test scripts/ci/docs-check.test.mjs`, `node scripts/docs-check.mjs` y `git diff --check`; revisar diff e índice de rutas explícitas sin plantilla. Después de commit/push: reconsultar PR8 con repositorio explícito, HEAD/base y CI del HEAD final; ejecutar docs-check sobre el commit. Publicar APROBADO con SHA completo de HEAD/base únicamente si verify-required está verde. El SHA final y el enlace de CI quedan en el comentario vinculante del PR, sin commits después de APROBADO.

Pendiente/responsable/salida: esta sesión reviewer continúa merger del mismo PR solo si AUTONOMY sigue satisfecha, árbol limpio y SHA/base/checks/protecciones/conversaciones vigentes. Squash ligado al HEAD aprobado, sin bypass; nueva consulta `gh pr view 8 --repo MatiasNicolasAcevedo/starter-spring-react --json number,url,state,mergedAt,mergeCommit,headRefOid,baseRefOid,baseRefName,statusCheckRollup` con exit 0 y MERGED/fecha/SHA válidos antes de anunciarlo, seguida del comentario de cierre. No hay tarea predefinida ready; tras MERGED vuelve al dueño en sesión de frontera para decidir siguiente objetivo, sin operar otras aplicaciones ni iniciar otra implementación. Conciliar T-007 done, STATUS y cola en el primer avance de una futura rama autorizada, nunca main ni rama mergeada.

Transición documental comprobada: checker 35/35, exit 0, 14.280 s (.orchestrator/t-007/review-r1-transition.log); docs-check y diff-check exit 0. Diff completo de las tres rutas revisado, sin cambios de implementación ni de aceptación en HANDOFF. No hay kit plantilla local; git ls-files e índice deben seguir sin plantilla antes del commit. Pendiente exclusivamente publicación, CI propia y veredicto/merge remoto del HEAD documental final.
