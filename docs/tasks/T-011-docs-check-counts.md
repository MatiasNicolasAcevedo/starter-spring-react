---
id: T-011
status: draft
priority: P2
size: S
milestone: M1
spec: S-004
depends_on: [T-010]
branch: codex/t-011-docs-check-counts
role: implementer
executor: junie
counts_for_cycle: false
pr: null
---
# T-011 · Validar todos los conteos explícitos de adopción

## Objetivo

Rechazar todos los conteos explícitos contradictorios en HANDOFF y STATUS. T-009 R-04 reprodujo que un segundo `— 22/22 verificados` pasaba con los criterios reales en 0/22.

## Alcance

Aplicar S-004 regla 2 en `scripts/docs-check.mjs` y `scripts/ci/docs-check.test.mjs`: validar cada coincidencia de los formatos actualmente reconocidos contra criterios efectivamente verificados; HANDOFF debe conservar al menos un conteo, STATUS puede no tenerlo. No ampliar la sintaxis ni exigir conteo único. Mantener 0/22 y 22/22 legítimos, evidencia propia, criterios y modalidad; no cambiar HANDOFF real ni la política de adopción. Dependencia: T-010 y su PR MERGED verificados y conciliados; draft solo por esa dependencia, pasar a ready al confirmarla sin nueva planificación.

Leer [S-004](../specs/S-004-document-verification.md), [diagnóstico T-009](T-009-starter-readiness.md#registro-de-candidatos-y-pendientes), [implementer](../agents/implementer.md), [TESTING](../TESTING.md) y [SETUP](../SETUP.md#verificación-desde-powershell). Crear rama exacta desde main vigente en sesión nueva, después de verificar PR de T-010 con `gh pr view` y --repo explícito; registrar fecha y mergeCommit. No iniciar mientras dependencia no esté confirmada.

## Aceptación

- Primero rojo con fixtures aislados: segundo conteo HANDOFF contradictorio y segundo conteo STATUS contradictorio con el primero correcto; probar también primer conteo incorrecto. Verde para conteos repetidos coherentes, 0/22, 22/22 válidos y STATUS sin conteo; los controles existentes de adopción siguen intactos.
- `node --test scripts/ci/docs-check.test.mjs`; `node --test "scripts/ci/*.test.mjs"`; `node scripts/docs-check.mjs`; `git diff --check`, todos exit 0; registrar rojo/arreglo/verde.
- Gate STARTER `& 'C:\Program Files\Git\bin\bash.exe' scripts/verify.sh --starter`, desde raíz y con bloque de SETUP, `.env.example`, `STARTER_SERVER_TESTS=container`, `COMPOSE_PROJECT_NAME=starter-verify-t011-20261027a`, `STARTER_E2E_PROJECT=starter-e2e-t011-20261027a`. Registrar antes SHA/base, comando, huellas, preflight labels propios ausentes, logs saneados, cleanup y siguiente paso. Si existen recursos abortar y usar sufijo propio nuevo; conservar exit original, readiness, señales y cleanup, sin recursos ajenos.
- Con gate verde, docs-check y clasificación `bash scripts/verify.sh --policy origin/main` sobre commit técnico, publicar bajo AUTONOMY y pasar a revisión independiente; no done antes de MERGED confirmado. No repetir STARTER por Markdown con fuentes/base iguales.

## Checkpoint

Contrato preparado por frontera; pendiente T-010 done con confirmación remota. No se ejecutaron tests ni se creó esta rama. Tras su merge, Junie concilia T-010, habilita T-011 y ejecuta su contrato; luego el retorno a frontera exige ambas tareas mergeadas, sin aceptación final inferida.
