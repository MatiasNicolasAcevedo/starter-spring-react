---
id: T-006
status: in_progress
priority: P1
size: M
milestone: M0
counts_for_cycle: false
spec: null
spec_version: null
depends_on: [T-005]
branch: codex/t-006-adoption-handoff
risk: standard
role: implementer
executor: frontier
pr: null
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

## Checkpoint vigente
Fuentes cerradas y gate STARTER verde. Pendiente publicar un único PR en la rama exacta, comprobar perfil STARTER del diff comprometido y cerrar solo documentación a in_review con prompt para reviewer independiente. Después docs-check/regresiones documentales y CI propia del HEAD final; conservar gate solo si base/fuentes técnicas coinciden. Sin APROBADO ni merge propio, sin adopción de aplicaciones acreditada.
