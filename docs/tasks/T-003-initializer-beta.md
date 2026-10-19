---
id: T-003
status: in_progress
priority: P1
size: M
executor: frontier
role: implementer
milestone: M0
counts_for_cycle: false
product_cycle: null
spec: S-004
spec_version: 1
branch: chore/t-003-initializer-beta
pr: null
depends_on: [T-002]
---
# T-003 · D · Personalización y beta

## Objetivo
Cumplir D mínima de [ROADMAP](../ROADMAP.md) y el [destino autosuficiente](../../PROJECT_CONTEXT.md#adopción-futura): personalización segura, formulario corto y guía hasta el primer flujo. Contrato [S-004 v1](../specs/S-004-initializer-beta.md), alineado con la decisión del dueño del 2026-10-18. C done/MERGED; E sigue draft.

## Alcance
Inicializador Node con lista explícita de escrituras, dry-run por defecto, apply/idempotencia y ensayo compilable en copia temporal; reinicio de contexto/documentos para T-000 propia, formulario y guía breve en fuentes canónicas. Una tarea/PR de M0, implementación únicamente en sesión nueva. Beta/template del mismo repo condicionados al cierre de D según S-004; no habilitarlos en esta planificación.
Sin otros repos, Google real, datos/volúmenes ajenos, hosts globales, origen, cambios de protecciones, releases ni E. Sin automatizaciones semanales/dispatcher, nuevas dependencias o infraestructura adicional. No copiar/borrar el kit ni convertir sus preguntas en alcance obligatorio.

## Impacto
Planner: solo documentos, conciliación T-002 done y corte de C. Implementación prevista: identidad de la copia, CLI y documentos propios; sin API/rutas/auth/permisos/propiedad nuevos, migraciones ni operaciones sobre DB. UI conserva comportamiento y personaliza solo identidad pertinente. Mantener dependencias/versiones/wrappers/locks y todas las suites/umbrales; no acreditar pruebas de D/HANDOFF con evidencia C.

## Leer antes
- S-004 v1 y PROJECT_CONTEXT · Adopción futura/decisión del 2026-10-18.
- ROADMAP · cierre mínimo, límites y corte de C; T-002 · reconciliación posterior al merge.
- TESTING · validación local y CI liviana; SETUP · copia/entorno/cleanup y TR-02/03/05/12/15/16.
- REFERENCE · retiro seguro, ARCHITECTURE y ADR existentes; DEPENDENCIES para comparar inventario.
- AGENTS raíz/server/client, protocolo implementer y AUTONOMY; HANDOFF/STATUS/BACKLOG vigentes.

## División secuencial antes de editar código
No son tareas ni PRs paralelos. D1 concreta la lista de archivos usando las fuentes vigentes, sin replanificar la tarea ready ni pedir aprobación ordinaria.

| Unidad | Depende | Destinos y resultado | Salida verificable |
|---|---|---|---|
| D1 · escrituras y guardias | C done | Inventariar destinos/renombres exactos del CLI y reset documental; comenzar `scripts/test-init-project.mjs` con fixtures/copia propia, sin tocar este checkout con apply | D-AC-01/03; contrato/lista revisables, rechazos previos a escritura y centinelas intactos |
| D2 · personalización | D1 | `scripts/init-project.mjs` y su matriz; identidad coherente Java main/test, config, nombres de proyecto y MIT; lockfiles solo con gestor si corresponde | D-AC-02/06; dos apply idénticos, copia compila, inventario y migraciones intactos |
| D3 · contexto y guía | D2 | `docs/templates/project-context.md`, plantillas propias de reinicio y README/SETUP con enlaces ARCHITECTURE/ADR/REFERENCE; sin manual duplicado | D-AC-04/05; copia sin kit, T-000/HANDOFF/AUTONOMY propios, docs-check y contexto ficticio suficiente |
| D4 · integración y cierre | D3 | Conectar matriz/ensayo al gate pertinente; documentación/evidencia mínima; FULL local propio y publicación del único PR D | D-AC-06/07; revisión distinta, CI liviana exacta y merge. Solo después habilitar/comprobar template beta del mismo repo |

Antes de operaciones largas: checkpoint con comandos, SHA/base, proyectos nuevos, logs saneados, pendientes y cleanup por labels. La copia temporal debe excluir `.git`, kit, ignorados, artefactos y configuración privada. No invocar otro FULL desde dentro de FULL. Fallo técnico requiere diagnóstico antes de repetir; bugfix demuestra rojo previo y guardias críticas negativos efectivos.

Inventario relevante comprobado por planner: `scripts/docs-check.mjs` fija hoy la ruta Java de Testcontainers y el rótulo de conteo de STATUS; `scripts/ci/docs-check.test.mjs` fija el nombre de T-000 del starter. D1/D2 deben adaptar esas conexiones para que la copia personalizada conserve los mismos controles/negativos después de renombrar/reiniciar, sin omitirlos ni aceptar una validación vacía. Es parte del ensayo compilable/docs-check, sin ampliar el producto.

## Aceptación y pruebas
Matriz D-AC-01…07 canónica en S-004, toda **pendiente de implementación**. Iterar con dirigidos de CLI/docs/copia; un FULL local sin opciones al cerrar fuentes técnicas, huella antes/después, base/HEAD, resultados/cleanup propios. Client verify incluye typecheck/lint/formato/tests/cobertura/build y backend clean verify incluye PostgreSQL IT/JaCoCo. Publicar código al pasar gate, cerrar documentación agrupada, CI automática liviana y revisión independiente sobre SHA/base exactos. Repetir FULL solo bajo las condiciones de TESTING; no exigir CI automática de main ni remoto FULL manual por rutina.

No done mientras PR abierto; no autorrevisión ni merge de implementación propia. Beta/template solo después del merge D comprobado; E/adopción validadas no se heredan de D. Marcar template es la autorización específica de ROADMAP, sin modificar protecciones.

## Checkpoint planner · 2026-10-18
Rol planner, Codex desktop/API y PowerShell; familia expuesta GPT-6, runtime exacto/esfuerzo efectivo no expuestos. Sol/high solicitado, sin simular selección, delegar ni abrir sesiones/modelos. Main de partida `193f5a763af9ae61726daf20d30ae4ce8d5ce59d`; PR#3/R2/CI final y árbol del squash comprobados en cierre de T-002. Primer avance de la rama exacta D concilia C y publica este refinamiento, sin PR documental separado. SHA final de planificación se obtiene de Git; ninguna prueba D ejecutada ni beta habilitada. Próximo rol implementer en sesión nueva, mismo árbol publicado y base; único prompt vigente en STATUS. T-004 draft, HANDOFF0/22 NO_LISTO; continuidad posterior solo en PROVENANCE.

Validación de esta planificación: `node scripts/docs-check.mjs` exit0 (44 Markdown/5 tareas/HANDOFF0/22), `node --test "scripts/ci/*.test.mjs"` **64/64 exit0**, sin fallos/cancelados/omitidos; incluye13 regresiones documentales. Primer intento de matrices restringido por permisos del sandbox al crear Git temporal/objetos MSYS; misma orden fuera del sandbox verde, sin modificar tests. `git diff --check` exit0; solo ocho Markdown documentales A/M, sin fuentes técnicas/locks/workflows modificados; clasificador DOCS_ONLY del commit publicado comprobable contra la base. Kit ignorado y ausente de Git/índice. Sin FULL nuevo, CI automática de main/rama sin PR ni recursos Docker levantados por planner. Commit/push en esta misma rama; confirmar HEAD local/tracking/remoto y árbol limpio al entregar, sin PR documental separado.

## Resultado
Planificación ready de D; implementación, pruebas propias, PR/revisión/merge y template beta pendientes. No volver a planificar sin cambio material. Reconciliación C y corte de ciclo incluidos en este avance, sin crédito adicional de HANDOFF.

## Inicio implementer · 2026-10-18
Codex desktop/API, terminal PowerShell/Git Bash; familia expuesta GPT-6, identificador runtime exacto y esfuerzo efectivo no expuestos. Sol/high solicitado; sin simular selección, delegación ni otras sesiones/modelos. Impacto: CLI/identidad y documentos propios de la copia, sin cambios de API/auth/permisos/propiedad/schema/UI de negocio.

Precondición comprobada: HEAD/tracking/remoto `fff878acb69699b9823f0ac9d9d36284ba5252ff`, primer y único commit documental D obtenido con git log; main local/tracking/remoto `193f5a763af9ae61726daf20d30ae4ce8d5ce59d`; árbol limpio, PR abiertos `[]`, PR#3 MERGED en ese squash. T-002 done, T-003 ready/S-004 v1 approved y T-004 draft. CI de C consultada, sin repetir FULL ni exigir CI de ramas sin PR.

D1→D4 secuenciales según tabla existente. Inicio de tablero; próximo avance concreta lista de escrituras y negativos antes de sustituciones. Ningún recurso Docker ni copia de ensayo creado todavía. HANDOFF 0/22 NO_LISTO; beta/template pendientes de revisión/merge D.
