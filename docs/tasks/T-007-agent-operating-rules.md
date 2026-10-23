---
id: T-007
status: in_progress
priority: P1
size: S
milestone: M0
spec: null
depends_on: [T-006]
branch: codex/t-007-agent-operating-rules
role: implementer
executor: frontier
counts_for_cycle: false
pr: null
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

## Sesión y checkpoint vigente

Frontera implementer, Codex; variante exacta y esfuerzo no expuestos. PowerShell, Git/gh, Node 24.21.0 y Git Bash/Docker; sin delegación ni ejecución Junie. Impacto en instrucciones/operación de agentes e inventario de exclusión; sin comportamiento/API/permisos/datos/UI de aplicación.

Árbol inicial limpio en rama anterior T-006. PR7 confirmado MERGED con fecha 2026-10-21T23:18:44Z y SHA 8d2fafecb0cfbd617998a41388c0855c676b3848; lista de PR abiertos vacía. Fetch y rama exacta nueva desde origin/main publicado. Pendiente: rojo de copia, exclusión explícita, dirigidos y gate STARTER; después publicación y prompt reviewer. No existe otra tarea predefinida para implementar tras esta; el cierre de merge devuelve al dueño con prompt concreto de frontera.


## Gate STARTER · checkpoint previo
HEAD 8d2fafecb0cfbd617998a41388c0855c676b3848, base origin/main 8d2fafecb0cfbd617998a41388c0855c676b3848. Cambios de fuentes sin commit; huellas de archivos en .orchestrator/t-007/gate-before.json (incluye este checkpoint). Comando desde PowerShell: & 'C:\Program Files\Git\bin\bash.exe' scripts/verify.sh --starter; entorno COMPOSE_ENV_FILES=.env.example, STARTER_SERVER_TESTS=container, COMPOSE_PROJECT_NAME=starter-verify-agent-rules-1792723644, STARTER_E2E_PROJECT=starter-e2e-agent-rules-1792723644. Preflight exacto de labels de container/network/volume de ambos proyectos vacío. Log saneado: .orchestrator/t-007/gate.log. Cleanup: docker compose --env-file .env.example -p starter-verify-agent-rules-1792723644 down --volumes --remove-orphans; E2E/tooling mantienen cleanup propio, luego comprobar labels vacíos y huellas/base/HEAD inmóviles. No editar fuentes durante la corrida. Próximo paso: registrar exit/resultados/cleanup y publicar únicamente si el gate completo pasa; revisión en otra sesión.


## Resultados propios y corrección significativa

Rojo: node --test --test-name-pattern="apply connects identity" scripts/test-init-project.mjs, exit 1 por 2 tareas copiadas en vez de 1 (copy-red.log); la tarea nueva se heredaba. Corrección: agregar solo T-007 al inventario REMOVE_FILES, sin ampliar escrituras ni cambiar el mecanismo. Verde: node --test scripts/test-init-project.mjs, 36/36 exit 0 (copy-green.log); copia ficticia mantiene autonomía pendiente, guías genéricas, exclusión de mantenimiento e idempotencia. Matriz de herramientas/docs/clasificación: 131/131 exit 0 (ci-directed.log). Sin tests duplicados ni rebajas.

Sonda del bloque exacto de SETUP ejecutada desde PowerShell: Git Bash /usr/bin/bash, Node host v24.21.0, Docker Compose v2.40.2-desktop.1, exit 0. --policy antes de commits informó STARTER conservador por diff vacío; se inspeccionó también el diff sin commit (inventario => STARTER). No se cambió configuración global ni se instaló otro Node. Estas son comprobaciones de frontera, no de Junie.

Gate STARTER completo: exit 0, 2476.974 s, cleanup exterior exit 0. Suites: docs 4s exit 0; server 244s exit 0; client 52s exit 0; tooling 1791s exit 0; e2e 384s exit 0. Logs y JSON before/after/result en .orchestrator/t-007/. Huellas de todos los archivos idénticas antes/después, HEAD/base 8d2fafecb0cfbd617998a41388c0855c676b3848 inmóviles. Recursos exteriores starter-verify-agent-rules-1792723644 y starter-e2e-agent-rules-1792723644: container/network/volume 0/0/0; los ensayos propios de tooling comprobaron su cleanup en el log. No hubo edición de fuentes durante la corrida.

Pendiente: publicación del primer avance y PR; después transición solo documental a in_review y revisión independiente en sesión nueva. El gate se conserva mientras inventario, demás fuentes y base coincidan; comprobar docs-check/diff-check y CI del HEAD publicado final. No APROBADO ni merge propios.
