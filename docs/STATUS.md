# Estado del starter

## Próxima acción
| Campo | Valor |
|---|---|
| Tarea y contrato | [T-001](tasks/T-001-local-stack.md) · solo parte B |
| Estado | ready |
| Rol siguiente | implementer en sesión nueva; B1 → B2 → B3 → B4 |
| Rama | chore/t-001-local-stack, creada desde main conciliada |
| PR | Sin PR abierto; planificación publicada por rama; implementer abre único draft |
| Base | main, 47184f725f8a89528acac0aa3e7383f2334258de |
| Contrato refinado | S-002 v1 approved, unidades y matriz B-AC-01…11 en T-001/S-002 |
| Ancla de reconciliación | 0310e73e77e7200c0445df285138acbc1792ddbc, primer commit de esta rama |
| Continuidad | POR_SESION |

### Prompt de la siguiente sesión
```text
Vigente solo en una sesión de frontera nueva con raíz C:\D\matias\proyectos-ia\starter-spring-react para implementar exclusivamente B/T-001. Antes de editar conciliá con gh y Git: PR #1 MERGED con squash 47184f725f8a89528acac0aa3e7383f2334258de igual a main local/tracking/remoto; CI FULL PR 39044690435 y main 39045270616 completed/success con classify/docs-check/server/client/e2e/verify-required SUCCESS en ambas; ningún PR abierto ni otra tarea activa. La rama actual debe ser chore/t-001-local-stack, árbol limpio, HEAD local/tracking/remoto idénticos, con 0310e73e77e7200c0445df285138acbc1792ddbc como primer commit desde main y solo el commit documental de planificación posterior; T-000 done, T-001 ready y S-002 v1 approved. Si no coincide cualquier precondición, no cambies nada y devolvé estado/prompt vigente. Si coincide, leé AGENTS raíz/server/client, AUTONOMY, STATUS/BACKLOG/HANDOFF/ROADMAP, T-001/S-002, docs/agents/implementer.md y trampas SETUP/TESTING. Reutilizá esta rama publicada sin recrearla: registrá identidad e impacto reales, transicioná T-001/STATUS/BACKLOG/HANDOFF a in_progress, commit/push de tablero y abrí el único PR draft de B. Antes de código ejecutá baseline FULL propia con fixtures/proyectos únicos según checkpoint T-001. Implementá B1 lifecycle persistente → B2 readiness DB/proxies → B3 UI conectada → B4 ensayos/FULL; cada unidad requiere salida y checkpoint de comandos/logs saneados/SHA/cleanup. Bugfix rojo antes del arreglo y negativos críticos; conservar dev-auth efímero, auth/ADR/protocolos/negativos, wrappers/locks/versiones y gate FULL. Publicá código tras gate, después cierre documental con HEAD local/remoto/PR y CI FULL comprobados; dejá una única retoma para revisor en sesión distinta. No autorrevisar ni mergear implementación propia, no iniciar C…E, delegar ni abrir otra sesión/modelo, ni operar Google real, datos/volúmenes ajenos, hosts globales, origen o protecciones. HANDOFF sin crédito por herencia; no beta/template/adopción validada. Único límite posterior a E en PROVENANCE.
```

## Salud
HANDOFF del starter: 0/22 verificados; 22 criterios heredados pendientes de revalidación. NO_LISTO.
A done: PR #1 MERGED; squash `47184f725f8a89528acac0aa3e7383f2334258de`, idéntico a main local/tracking/remoto. [FULL PR 39044690435](https://github.com/MatiasNicolasAcevedo/starter-spring-react/actions/runs/39044690435) y [FULL main 39045270616](https://github.com/MatiasNicolasAcevedo/starter-spring-react/actions/runs/39045270616) consultadas completed/success, seis jobs exigidos verdes en ambas. Evidencia local histórica de implementación/revisión en T-000; esta sesión verifica el resultado remoto, sin atribuir nuevas suites locales.
B ready y sin implementación: S-002 v1, división B1…B4, once criterios trazados, revisión del ciclo de A registrada en ROADMAP. C…E draft; sin beta/template ni adopción validada. Google real pendiente externo del dueño.

## Checkpoint breve
2026-10-17, sesión nueva planner: Codex desktop/API, terminal PowerShell/Git Bash, familia declarada GPT-6; runtime exacto y esfuerzo efectivo no expuestos. Sin atribuir Sol/high, simular selección, delegar ni abrir otra sesión/modelo.
Inicio: árbol limpio; único trabajo anterior T-000 mergeable pendiente de reconciliación. `gh pr list --state open` = `[]`. HEAD final de PR #1 `1ba7ad80d045b458f535efda5aa6b184211b6f9f`; squash y CI de main confirmados. Primera consulta sin red; repetición de solo lectura con acceso de red exit 0.
Primer commit `0310e73e77e7200c0445df285138acbc1792ddbc` de rama B reconcilia T-000/STATUS/BACKLOG/HANDOFF; segundo commit publica solo refinamiento B/corte del ciclo y esta retoma. Impacto solo documental, sin comportamiento/API/permisos/propiedad/datos/UI. Ningún stack creado; cleanup no aplica. Bootstrap de protecciones consumido, sin cambios. Comando local actual sigue siendo el harness efímero de SETUP; dev.sh persistente aún no existe. No hay PR de planificación separado; el protocolo planner §7 permite publicar en la rama de la tarea. Implementer abre el draft en la sesión siguiente tras transición de tablero.
Validación de planificación: `node scripts/docs-check.mjs` exit 0 (41 Markdown, 5 tareas, 0/22); `git diff --check` exit 0 y diff exclusivamente documental. Sin suites funcionales de B ni FULL nuevo, no CI de B sin PR. La sesión implementer debe registrar baseline y evidencia propias antes de sustituir este checkpoint por resultados de implementación. Confirmación final de publicación/HEAD y clasificación en respuesta de cierre; el prompt compara local/tracking/remoto y la secuencia de los dos commits documentales para evitar un SHA autorreferencial.
