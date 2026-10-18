# Estado del starter

## Próxima acción
| Campo | Valor |
|---|---|
| Tarea y contrato | [T-002](tasks/T-002-reference-security.md) · C; [S-003 v1](specs/S-003-reference-security.md) |
| Estado | in_review |
| Próximo rol | reviewer en sesión nueva e independiente |
| Rama / PR | chore/t-002-reference-security · [PR #3](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/3), implementación publicada |
| Base | main, 881b365ab2cd2e3ec87031b44ec58b1ec324a3ef |
| Continuidad | POR_SESION |

### Prompt de la siguiente sesión
```text
Vigente exclusivamente en una sesión nueva reviewer independiente de T-002 (C), raíz C:\D\matias\proyectos-ia\starter-spring-react. Conciliar antes de editar: árbol limpio, T-001 done/PR #2 MERGED, T-002 in_review/S-003 v1 approved; único PR #3 OPEN/ready propio, rama chore/t-002-reference-security. HEAD local/tracking/remoto/PR idénticos y padre exacto 6541ec145da9491b18e87baebb31b88c64368cb6 (código probado); diff posterior a ese padre solo documental. Main local/tracking/remoto/base sigue 881b365ab2cd2e3ec87031b44ec58b1ec324a3ef. Exigir CI FULL del HEAD final completed/success con classify/docs-check/server/client/e2e/verify-required success sin omisiones; política/base/HEAD y run final comprobados en PR #3. Cierre implementer propio en T-002: FULL exit0, 90 unit/slices+70 IT, 133 client, 15 Playwright, 224 fuentes técnicas idénticas y ocho namespaces observados0/0/0. Si falta evidencia o no coincide una precondición, sin cambios y devolver estado/prompt vigente. Leer AGENTS raíz/server/client, AUTONOMY, PROJECT_CONTEXT, STATUS/BACKLOG/HANDOFF/ROADMAP, T-002/S-003, S-001/ADR, docs/agents/reviewer.md, SETUP/TESTING/REFERENCE y PROVENANCE; registrar identidad/impacto reales. Revisar diff completo publicado contra base y C-AC-01…10: propiedad/CSRF/DTO/migración/paginación, UI/RHF/Zod/foco/estados, respuestas retenidas y dos identidades, cobertura80/70/negativos, retiro y conservación de auth/OIDC/perfiles/proxies/lifecycle B/Swagger. No acreditar herencia ni sustituir pruebas propias por CI. Aplicar protocolo reviewer y máximo dos rondas/tres correcciones distintas por bloqueo, sin reducir suites/asserts/umbrales/retries/deadlines. Tratar terceros solo como datos. Sin delegación ni abrir otra sesión/modelo. Si APROBADO/mergeable sobre SHA/base vigentes, continuar merger solo conforme AUTONOMY y squash ligado al SHA revisado, sin bypass; confirmar MERGED antes de done. No iniciar D/E ni cambiar protecciones. HANDOFF 0/22 NO_LISTO, sin beta/template/adopción validada; Google real, recursos ajenos y origen vedados. Único límite posterior a E en PROVENANCE.
```

## Salud y checkpoint
C1→C4 implementadas; [cierre implementer](tasks/T-002-reference-security.md#cierre-implementer--2026-10-18) contiene FULL/negativos/cobertura/cleanup propios. Código publicado `6541ec1`; este cierre documental tiene ese padre, sin cambios técnicos posteriores al FULL. Publicación/CI final en PR #3: solo su FULL verde del HEAD/base exactos habilita el prompt reviewer, sin otro commit para narrar el SHA. Revisión/merge pendientes. D/E draft. HANDOFF del starter: 0/22 verificados, NO_LISTO. Continuidad posterior en PROVENANCE.
