# Estado del starter

| Campo | Valor |
|---|---|
| Tarea y contrato | [T-009](tasks/T-009-starter-readiness.md) |
| Estado | in_review |
| Acción actual | Revisar independientemente el diagnóstico, el cambio de inventario y la evidencia de T-009 |
| Rama / PR | codex/t-009-starter-readiness · [PR10](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/10) |

R-08 cerrado técnicamente bajo la decisión de cierre práctico del dueño; STARTER propio completo verde con 133 tests/client intactos, causa histórica desconocida y riesgo residual explícitos. La sesión autora no revisa ni mergea; T-009 no está done antes de MERGED confirmado. Aceptación final del Starter pendiente del dueño; HANDOFF conserva su función reusable.

### Prompt de la siguiente sesión

```text
Revisar independientemente únicamente T-009/PR10 como revisor M0 en una sesión nueva, distinta de la implementación. Leer AGENTS.md, PROJECT_CONTEXT.md, docs/STATUS.md, docs/tasks/T-009-starter-readiness.md, sus cinco referencias, docs/agents/reviewer.md, docs/agents/merger.md, AUTONOMY y TESTING/SETUP pertinentes. No iniciar otra tarea ni aceptar el Starter por el dueño.

Precondición: comprobar árbol, índice y remotos; consultar `gh pr view 10 --repo MatiasNicolasAcevedo/starter-spring-react --json number,url,state,isDraft,headRefName,headRefOid,baseRefName,baseRefOid,statusCheckRollup` y comparar HEAD/base publicados con el checkout y origin/main. La PR debe estar OPEN y ready sobre main; consultar la CI del HEAD real. Si cambia HEAD/base o falta evidencia, revalidar lo afectado y registrar causa y próximo responsable; una consulta fallida no verifica publicación o merge. T-008 fue reconsultada MERGED en PR9 y conciliada; no reeditarla si coincide.

Revisar el diff completo, criterios AC-01 a AC-05, clasificación de candidatos, rojo/verde del inicializador y ausencia de kit/secretos. El único cambio técnico previsto es excluir T-009 en REMOVE_FILES. Comprobar `bash scripts/verify.sh --policy origin/main` sobre el HEAD final y `node scripts/docs-check.mjs`. Contrastar `.orchestrator/t-009/r08/r08-close-bcb4f7914665` (gate-before/after/result.json, gate.log, cleanup-final.json y final-source-audit.json) con las fuentes técnicas y base publicadas. STARTER canónico propio exit 0 en 3099.929 s, original/copia 91 unitarios/slices +75 IT y 133/133 client cada uno, E2E saneado 15/15, labels exteriores 0/0/0 y 30 IDs propios ausentes. Con fuentes técnicas/base iguales conservar el gate sin repetir FULL/STARTER por Markdown.

R-08 está cerrado técnicamente por decisión de cierre práctico del dueño: no se exige reconstrucción causal histórica ni captura, y no se retiró ningún test. Causa histórica desconocida y riesgo residual explícitos; no afirmar reparación de timeout ni repetir H4/perfiles/contrastes. Conservar assertions, negativos, providers, cobertura, maxWorkers=4, retries y deadlines de 5000 ms. No ampliar a correcciones generales, aplicación, configuración, versiones o permisos.

Acción y salida: registrar revisión independiente con hallazgos y veredicto ligado a HEAD/base reales en PR10; si APROBADO y todas las condiciones de AUTONOMY y verify-required del HEAD final están satisfechas, continuar como merger de esa misma PR en esta sesión, squash ligado al SHA revisado sin bypass. Confirmar MERGED con `gh pr view 10 --repo MatiasNicolasAcevedo/starter-spring-react --json number,url,state,mergedAt,mergeCommit,headRefOid,baseRefOid,baseRefName,statusCheckRollup`; solo state MERGED, mergedAt y mergeCommit.oid válidos lo acreditan. No commitear en rama mergeada. Tras merge, entregar prompt para frontera en otra sesión que concilie T-009 en su siguiente rama autorizada y prepare contratos de corrección desde los hallazgos; aceptación final sigue siendo del dueño. Si revisión, CI o consulta bloquean, registrar causa/evidencia, responsable y dato necesario, y entregar siempre el único prompt completo y copiable actualizado al estado real.
```
