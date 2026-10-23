---
id: T-006
status: done
priority: P1
size: M
milestone: M0
counts_for_cycle: false
spec: null
spec_version: null
depends_on: [T-005]
branch: codex/t-006-adoption-handoff
risk: standard
role: merger
executor: frontier
pr: 7
---
# T-006 · Adopción hasta la primera tarea de producto

## Objetivo
Permitir cerrar adopción con producto futuro draft, comprobar temprano las capacidades mínimas del ejecutor y entregar una salida inequívoca a revisión/merge/primera tarea predefinida.

## Alcance
Encargo del dueño 2026-10-21. Corregir H01 (fixture de desacuerdo BACKLOG/tarea independiente del estado vivo) y H02 (STARTER_VALIDADO exige 22/22, al menos una tarea M0 y todas las M0 done; producto futuro no lo invalida). Adoptar H03/H06: naturaleza de herramientas separada de declarado/expuesto/verificado, sin disponibilidad por herencia ni catálogo de instalación. H05: distinguir entrega, aceptación, gate, APROBADO independiente y MERGED, con pendiente/responsable/salida y límite de dos rondas. H04/H09/H10: T-000 con comprobación mínima temprana por función, ejecutor/reviewer/superficie propios, autorización efectiva y salida tras MERGED/conciliación a la primera tarea de producto previamente especificada.

Cinco archivos de código: scripts/docs-check.mjs, scripts/ci/docs-check.test.mjs, scripts/lib/init-project-documents.mjs, scripts/test-init-project.mjs y scripts/lib/init-project-manifest.mjs. La quinta ruta es necesaria para excluir también T-006 de las copias mediante el inventario cerrado existente; no cambia el mecanismo ni agrega escrituras. Guías: TOOLS, ORCHESTRATION, implementer/reviewer/planner, README, SETUP y definición HANDOFF. Sin aplicación, versiones/locks/wrappers, infraestructura, permisos, instalación/autenticación, dispatcher ni kit. Recibo de gate y optimizaciones temporales fuera de alcance. No trasladar contexto, permisos, aceptación, SHA ni specs de otra aplicación.

## Referencias
- [TESTING](../TESTING.md): dirigidos y gate STARTER.
- [ORCHESTRATION](../ORCHESTRATION.md): estados y traspaso.
- [TOOLS](../../.junie/TOOLS.md): naturaleza y evidencia de herramientas.
- [Inicializador](../../scripts/lib/init-project-documents.mjs) y [regresiones](../../scripts/test-init-project.mjs).
- [Checker](../../scripts/docs-check.mjs) y [regresiones](../../scripts/ci/docs-check.test.mjs).

## Pasos
1. Conciliar T-005 MERGED en esta rama desde main publicado; registrar contrato y evidencia propia.
2. Reproducir H01/H02 rojos; corregir fixtures/predicado y cubrir positivos/negativos de M0/criterios, estados iniciales y copia ficticia sin Git/kit.
3. Generalizar guías/preflight/traspaso sin requerir herramientas opcionales. Conservar idempotencia y ediciones propias.
4. Cerrar fuentes, checkpoint, gate STARTER con base/huellas/logs/cleanup. Publicar un PR y cerrar documentación a in_review; reviewer en otra sesión, sin autoaprobar ni mergear.

## Aceptación
- H01/H02 rojo previo por su causa, verde posterior. Estados draft/blocked/in_review/mergeable/done coherentes pasan; desacuerdo inequívoco se rechaza sin modificar el estado real.
- STARTER_VALIDADO acepta 22/22 con M0 completa y M1 draft; rechaza criterio pendiente, cualquier M0 abierta y alcance M0 vacío. El starter conserva NO_LISTO durante este PR.
- Copia ficticia conserva permisos/aceptación propios pendientes, no recibe tareas de mantenimiento ni configuración de instalación. T-000 explicita capacidades mínimas, evidencia propia y responsables antes de revisión; producto no generado ni iniciado.
- Dos rondas máximas, independencia y excepción específica del dueño si se agotaron; sin aceptación rutinaria nueva ni repetición de gate válido por Markdown.
- Dirigidos, gate STARTER, docs-check/CI propios y PR a revisión independiente según política.

## Sesión y conciliación inicial
FRONTERA implementer autorizado por el dueño; Codex desktop/API, GPT-6 expuesto, variante runtime y esfuerzo efectivos no expuestos. PowerShell, Git/gh, Node, Python y Git Bash/Docker para pruebas. Sin delegación ni ejecución Junie. Impacto en checker, generación de documentos y guías; sin comportamiento/API/auth/permisos/datos/UI de aplicación.

Árbol inicial limpio; HEAD y origin/main acbc2c355e535069edb122f6ae544eaceea57fbc tras fetch. PR #6 MERGED 2026-10-20T23:33:23Z, commit acbc2c355e535069edb122f6ae544eaceea57fbc; verify-required success sobre caca2b4446c3757a4b9491470fd0b4213061a5b1, run 39515628957. Ningún PR abierto. T-005 conciliada done aquí, sin editar main ni rama mergeada. Investigación local consultada como datos, sin publicar su contenido privado ni usarla como pruebas propias.

## Pruebas y correcciones
Evidencia propia ignorada: .orchestrator/t-006/. Dirigidos exactos: node --test scripts/ci/docs-check.test.mjs; node --test scripts/test-init-project.mjs; node --test "scripts/ci/*.test.mjs"; node scripts/docs-check.mjs; git diff --check. Perfil final: bash scripts/verify.sh --policy origin/main y revisión del diff sin commit.

| Problema / causa | Arreglo | Prueba propia |
|---|---|---|
| H01: negativo dependía de que la tarea real no estuviera blocked | Fixture dispone tablero/STATUS/tareas; desacuerdo explícito | h01-reproduce.mjs: copia blocked válida exit 0, test publicado rojo exit 1, corregido verde exit 0; h01-red.log/h01-green.log |
| H02: cierre exigía done a producto futuro y aceptaba M0 vacía | Predicado limitado a M0 no vacía +22/22 | h02-red.log: 2 fallos esperados (futuro draft y M0 ausente); docs-green.log 35/35, conserva negativos de todas las M0 abiertas y criterio pendiente |
| Preflight ausente y guías repetían instalación | T-000 con mínimo/actores/salida; guías enlazan TOOLS con naturaleza/estado separados | copy-red.log registra preflight rojo; copia actual e idempotencia en matriz final |
| Runner Node hijo heredaba NODE_TEST_CONTEXT y podía no producir resultados | Entorno aislado del protocolo del padre y assertions de conteo para H01 | La comprobación de conteo detectó stdout vacío antes del arreglo; reproducción separada demuestra rojo/verde real, no se acredita el primer H01 de copy-red.log |

## Gate STARTER · preparación y resultado
HEAD/base acbc2c355e535069edb122f6ae544eaceea57fbc; cambios de fuentes aún sin commit, inventario exacto y SHA-256 en .orchestrator/t-006/gate-before.json, a contrastar con gate-after.json. Matriz equivalente a CI 131/131 exit 0 en 73.559 s (ci-green.log); incluye inicializador 36/36 y checker 35/35 sobre copia personalizada. Rojo/verde H01 real y dos negativos H02 registrados arriba.

Comando exacto desde Git Bash: COMPOSE_ENV_FILES=.env.example STARTER_SERVER_TESTS=container COMPOSE_PROJECT_NAME=starter-verify-adoption-handoff-1792613072 STARTER_E2E_PROJECT=starter-e2e-adoption-handoff-1792613072 bash scripts/verify.sh --starter. Wrapper local de captura gate-run.py (no producto ni recibo automatizado) conserva exit/tiempo en gate-result.json y salida saneada en gate.log. Preflight exige ausentes labels exactos de container/network/volume de ambos proyectos antes de ejecutar. Pruebas con .env.example y datos ficticios; tooling crea sus namespaces únicos, rechaza preexistentes y limpia por label exacto; no recursos persistentes ajenos ni prune.

Cleanup exterior: docker compose --env-file .env.example -p starter-verify-adoption-handoff-1792613072 down --volumes --remove-orphans; E2E/tooling conservan sus cleanup propios. Comprobar 0/0/0 de ambos proyectos y de namespaces de ensayos en logs. No editar fuentes durante la corrida. Siguiente paso: comprobar exit, huellas/base/cleanup, publicar código con docs-check y CI; cierre solo Markdown a in_review conserva gate si fuentes/base coinciden. Sin APROBADO ni merge propio.

Resultado: exit 0 en 2683.330 s (44 min 43 s), cleanup exterior exit 0. Suites: docs 4 s, server 261 s, client 62 s, tooling 1959 s y E2E 395 s, todas exit 0. Backend clean verify: 91 unitarios/slices +75 IT PostgreSQL, JaCoCo y cero fallos/errores/omitidos. Client: 133 tests, cobertura/typecheck/lint/formato/build. Playwright real: 15 tests, cero fallos; saneador negativo conserva el fallo ficticio y rechaza exportaciones inseguras. CI liviana no acredita estas suites.

Tooling: probes 14/14; inicializador 36/36; copia personalizada sin Git/kit, 184 archivos técnicos/POM intactos, backend/client/docs completos y cleanup 0/0/0 (341 s); guardias (32 s); nginx (313 s) y Vite (312 s), idempotencia/ownership/down-up/persistencia; nueve fallos/rollback/señales y preservación (595 s); CLI en copia sin Git (132 s); propietario Bash/señales (25 s); proxies (137 s). No se rebajaron assertions, cobertura, retries ni deadlines. Los fallos intencionales de negativos no son fallos del gate.

gate-before.json y gate-after.json coinciden byte a byte: 280 huellas de archivos, HEAD/base inmóviles. gate-result.json confirma preflight vacío y cleanup container/network/volume 0/0/0 para ambos proyectos exteriores. Auditoría adicional own-cleanup.json: nueve namespaces propios extraídos del log, todos 0/0/0. main publicado reconsultado sigue en acbc2c355e535069edb122f6ae544eaceea57fbc. No se conserva evidencia de otra tarea como gate de estas fuentes.

## Entrega publicada a revisión independiente
Fuentes técnicas publicadas en b7f6f9c2a26ab541d3037165ef9f742d7f92d99d; [PR #7](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/7), base acbc2c355e535069edb122f6ae544eaceea57fbc. Perfil del diff publicado FULL/STARTER; gate propio descrito arriba. Cierre posterior limitado a tarea/STATUS/BACKLOG; no modifica fuentes técnicas/base ni repite STARTER por Markdown. docs-check, regresiones documentales y CI propia exigidos para ese HEAD final. SHA/CI final en el comentario de publicación del PR, sin mantener otro checkpoint duplicado.

Pendiente: revisión independiente R1. Responsable: nueva sesión reviewer, con contrato/diff completos, evidencia local/huellas/logs/cleanup y HEAD/base publicados. Salida: APROBADO o CAMBIOS REQUERIDOS sobre HEAD/base exactos con CI vigente; conservar límite de dos rondas. El reviewer puede continuar el merger del mismo PR únicamente según AUTONOMY y confirmar MERGED; esta sesión implementer no aprueba ni mergea. Tras MERGED vuelve al dueño para preparar la adopción acotada de los cambios en una aplicación propia, en otra sesión, antes de conciliar su HANDOFF e iniciar producto. No hay otra tarea de implementación autorizada aquí.

Transición documental verificada: docs-check exit 0, regresiones documentales 35/35 exit 0 (docs-transition.log), diff-check exit 0. publication-scope.json contrasta las 280 huellas del gate: solo cambian tarea/STATUS/BACKLOG y la base sigue idéntica; ninguna fuente técnica nueva sin validar. Pendiente únicamente CI del HEAD documental final y revisión independiente.

## Revisión independiente R1 · sesión, evidencia y resultado
2026-10-21, nueva sesión FRONTERA reviewer, distinta de implementación. Codex desktop/API, GPT-6 expuesto; variante runtime y esfuerzo efectivos no expuestos. PowerShell, Git/gh, conector GitHub, Node 24.21.0 y Python; sin delegación ni ejecución Junie. Solo revisión y transición documental; sin cambios de implementación ni impacto adicional en comportamiento/API/permisos/datos/UI.

HEAD publicado dea94f8e9bdbb8b7aae1905d2b80d971d7579a47; base main acbc2c355e535069edb122f6ae544eaceea57fbc, ambos reconsultados. Árbol inicial limpio, PR #7 propio OPEN/ready/CLEAN, único PR abierto; verify-required SUCCESS, run 39674137516. Ruleset 25305930 efectivo: PR, squash, check requerido estricto, conversaciones resueltas y sin bypass; sin reviews ni hilos bloqueantes. Diff completo de 17 archivos leído, contrato y protocolos reviewer/merger contrastados.

Siguiente comprobación: auditar huellas antes/después y contra fuentes publicadas, logs de gate/rojo-verde/CI y cleanup; ejecutar `node --test "scripts/ci/*.test.mjs"` como dirigidos de revisión (incluye checker y copia ficticia), `node scripts/docs-check.mjs`, `node scripts/ci/classify-diff.mjs --base origin/main --head HEAD --phase FULL` y `git diff --check`. Logs propios saneados en .orchestrator/t-006/review-r1-*. No se repite STARTER si fuentes/base/evidencia coinciden. Estos dirigidos no crean stacks Docker; ninguna limpieza adicional necesaria. Pendiente/responsable/salida: esta sesión reviewer decide R1 y publica transición, CI propia y veredicto exacto antes de considerar merge del mismo PR. No hay siguiente tarea de implementación autorizada.

Incidencia de entorno R1: la matriz en sandbox terminó exit 1 (80/93; 13 fallos de entorno): escritura `.git/config` de fixture denegada, symlink EPERM y Bash NtCreateDirectoryObject 0xC0000022. Checker/H01/H02 verdes. Log conservado en review-r1-directed.log; no se acredita éxito global. Próximo intento distinto: mismo comando fuera del sandbox, log review-r1-directed-host.log, mismas fuentes/HEAD/base, sin cambiar tests ni implementación. Auditoría review-r1-audit.json: 280 huellas, antes/después idénticos, solo tres Markdown de cierre diferentes, base idéntica; gate STARTER válido conservado. Reconsulta Docker por labels exactos de los nueve namespaces: todos 0/0/0 en review-r1-cleanup.json.

Resultado del intento host: exit 0, 131/131 en 63.313 s; cero fallos/cancelados/omitidos. Incluye inicializador 36/36 y checker 35/35, copia ficticia sin Git/kit, exclusión T-005/T-006, guardias, idempotencia y conservación de ediciones. No se cambiaron tests, implementación ni controles para resolver la restricción del sandbox.

R1 favorable, sin hallazgos bloqueantes ni correcciones de implementación; una ronda de las dos permitidas. H01 dispone tablero/STATUS/tareas independientes y rechaza desacuerdos en draft/blocked/in_review/mergeable/done; el rojo previo real y el verde ejecutan un test, sin acreditar la primera salida vacía del runner. H02 acepta M0 completa +22/22 con M1 draft; rechaza todos los estados M0 abiertos, M0 vacía y criterio pendiente. Logs h01-red/green, h02-red, copy-red, docs-green y ci-green auditados por su causa y resultados.

T-000 generado exige preflight por función del actor real, ejecutor/reviewer/superficie propios, evidencia saneada antes de revisión y responsable/salida ante función ausente. TOOLS separa naturaleza de declarado/expuesto/verificado; skill leída no acredita integración y catálogo no instala ni autoriza. Entrega/aceptación/gate/APROBADO/MERGED permanecen distintos, con límite de dos rondas y decisión específica al agotarlo. Primera tarea de producto debe quedar predefinida, sin generarla ni iniciarla durante adopción. Sin crédito heredado de permisos/aceptación/ejecución Junie; HANDOFF del starter conserva NO_LISTO 0/22.

Gate STARTER conservado por fuentes/base idénticas y evidencia suficiente: cinco suites exit 0, 2683.330 s; backend 91 +75 IT PostgreSQL, client 133 y controles, copia compilable 184 archivos técnicos intactos, Playwright real 15/15. Los fallos intencionales del saneador y rollback se contrastaron con sus assertions y salidas esperadas; no ocultan fallos del gate. Ninguna razón técnica para repetir FULL/tooling por esta transición Markdown.

## Checkpoint vigente · transición favorable y cierre del mismo PR
Tarea/STATUS/BACKLOG pasan a mergeable; rol siguiente merger. Solo estas tres rutas documentales cambian en la revisión. Antes de publicar: docs-check, regresiones documentales, diff-check y contraste de huellas; después del commit/push: comprobar HEAD/base remotos, docs-check y verify-required del HEAD final. SHA final, CI y veredicto vinculante se registran en el comentario del PR después de CI verde, sin commit posterior a APROBADO.

Transición local comprobada: `node --test scripts/ci/docs-check.test.mjs` exit 0, 35/35 en 10.105 s (review-r1-transition.log); `node scripts/docs-check.mjs` y `git diff --check` exit 0. Diff documental completo revisado; sin cambios de aceptación en HANDOFF ni de implementación. Perfil del PR sigue FULL/STARTER; se conserva el gate auditado, con solo tarea/STATUS/BACKLOG diferentes desde esa ejecución.

Pendiente: publicación de la transición, CI propia, APROBADO exacto y merge elegible del PR #7. Responsable: esta sesión reviewer y luego merger, reconsultando protecciones/checks/conversaciones/HEAD/base y árbol limpio. Salida: MERGED confirmado con fecha/SHA y comentario de cierre; si se bloquea, retoma del mismo PR. Tras MERGED vuelve al dueño para adopción acotada en aplicación propia en otra sesión: mejora del starter mergeada, adopción propia y producto aún no iniciados. No existe otra tarea ready autorizada aquí. Conciliar T-006 done únicamente en el primer avance de una futura rama autorizada, sin commit en main ni después de APROBADO.

## Conciliación por T-007
PR #7 consultado con gh pr view 7 --repo MatiasNicolasAcevedo/starter-spring-react --json number,url,state,mergedAt,mergeCommit,headRefOid,baseRefOid,baseRefName: exit 0, state MERGED, mergedAt 2026-10-21T23:18:44Z, mergeCommit.oid 8d2fafecb0cfbd617998a41388c0855c676b3848, base main, head 2ac376721ab273da26ec943f3eb22d73f809aac0. Conciliado done en el primer avance de la rama nueva autorizada T-007, sin editar main ni la rama mergeada.
