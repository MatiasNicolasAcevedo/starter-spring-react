# ROADMAP · Partes de la base reusable

| Política | Valor |
|---|---|
| Cadencia efectiva | 5 |
| Revisión de ciclo | Cada cinco tareas de producto mergeadas, cierre de parte/hito o cambio relevante |
| WIP | Una tarea y un PR activos; revisión en sesión distinta |

## Secuencia contratada

El objetivo vigente es completar este mismo starter de A a E. A y B están terminadas con merge/CI comprobados. C está implementada y en revisión independiente, con evidencia propia en T-002. Cada parte requiere revisión, squash merge confirmado y CI vigente antes de activar la siguiente.

| Parte | Estado real | Resultado en palabras simples |
|---|---|---|
| A | done; PR #1 MERGED y CI verificada | Extraer y neutralizar la base, conservar versiones y contratos |
| B | done; PR #2 MERGED y CI FULL PR/main verificadas | Levantar, comprobar, detener y retomar la aplicación conectada a su DB |
| C | in_review; T-002 / S-003 v1, FULL local verde, CI/revisión final requeridas | Incorporar un ejemplo removible completo con permisos y pruebas |
| D | draft; espera C MERGED | Personalizar la base con un inicializador y habilitarla como template beta |
| E | draft; espera D MERGED | Comprobar desde otra copia limpia que sirve para empezar otra aplicación |

La aceptación detallada está abajo y en la tarea/spec de cada parte. Refinar solo la próxima parte al habilitarse; una tarea ready pasa a implementación, sin otra ronda de planificación salvo cambio material. Aplicar documentación mínima útil de AGENTS durante el trabajo: comandos de uso en README/SETUP, decisiones en ADR, evidencia en tarea/PR y estado breve con enlaces en el tablero. Materializar aprendizajes en esa base, sin mantener otro manual vivo en el kit transitorio.

| Parte / tarea | Depende | Salida y prueba exigidas |
|---|---|---|
| A · T-000 | Ancla | Extracción neutralizada, inventario completo sin cambios de versión, docs propias; build/typecheck/docs-check y pruebas heredadas; FULL según gate vigente |
| B · T-001 | A MERGED | Adaptar dev-auth existente a dev.sh up/check/down; modo local explícito sin Google; PostgreSQL 18/server/client conectados; pantalla API/DB real; readiness Actuator incluye DB, ruta exacta por nginx/Vite; Swagger opt-in GET bajo /api/docs, recursos/config/JSON y Try it out. DB vacía, caída DB → health/UI fallan → recuperación; ambos proxies, 1280/375; down conserva desarrollo y cleanup por labels solo de pruebas |
| C · T-002 | B MERGED | Feature de referencia removible propia del usuario: CRUD/paginación/migración/autorización por dueño, formulario RHF/Zod y E2E. Login/logout, CSRF, propiedad/denegación y negativos del perfil real; no perder pruebas OIDC heredadas. Documentar cómo quitar/reemplazar ejemplo; fijar mínimos 80% líneas/70% ramas para dominio/servicios/hooks sin reducir vigentes |
| D · T-003 | C MERGED | init-project.mjs con lista explícita, dry-run por defecto, idempotencia y sin tocar .git/kit/fuera de lista; nombre/slug/paquete/titular, documentos reiniciados (T-000 de adopción). Copia temporal compilable y docs-check; FULL local y CI verdes. Solo entonces beta con límites visibles y repo marcado template, mismo repo base |
| E · T-004 | D MERGED | Segunda copia limpia, app ficticia con identidad/contexto distintos; instalar, levantar, probar, detener y retomar siguiendo README literal: stack conectado, DB vacía, persistencia, login local, E2E, Swagger nginx/Vite, FULL local y CI. Coexistencia sin cruzar puertos/DB/volúmenes; cleanup labels sin huérfanos. No crear otro repo sin decisión del dueño |

## Límites de cierre
En B, Docker Desktop + Git Bash deben bastar para up/check/down sin Maven, PostgreSQL ni Node instalados en el host; usar runners containerizados para los probes reproducibles y declarar cualquier navegador host opcional. Debe haber cero fallback del perfil real y ningún cambio global de hosts. El check valida estado y contenido, no un 200 que sea index.html. El arranque fallido limpia lo recién creado sin borrar volúmenes preexistentes.
En D se contratan además Dependabot semanal, política de actualización con FULL para majors y workflow manual/semanal de personalización/adopción temporal. La CI debe comprobar inicializador, lista de escrituras, build/docs-check e inventario, sin crear otro repo. La autorización para marcar este mismo repo como template en D es específica; no permite modificar las protecciones iniciales.
Decisión del dueño 2026-10-17: [destino autosuficiente](../PROJECT_CONTEXT.md#adopción-futura). D integra/pule el formulario de contexto dentro del repo y consolida la guía de crear desde template, adoptar y hacer crecer la arquitectura; E prueba el recorrido sin `plantilla/`, incluido el contexto nuevo. El kit queda transitorio hasta esa validación; su eliminación local posterior corresponde al dueño y no al inicializador. D/E siguen draft y secuenciales: aquí solo se registra su salida aceptada, sin implementarlas ni agregar una etapa al cierre.
En E se usan defaults ficticios primero y contexto de otra app después; registrar comandos, SHA, fecha, exit codes, evidencias saneadas y labels sin huérfanos. El proyecto limpio debe poder detenerse y retomarse con datos persistentes propios antes de limpiar sus recursos de prueba.

Beta solo tras D; adopción validada solo tras E. Las comprobaciones de A no acreditan B…E.
Después de E MERGED y validada, STATUS entrega exclusivamente el prompt de constancia documental definido en [PROVENANCE](PROVENANCE.md). No ejecutarlo aquí ni adelantarlo al cierre de A.

## Revisión de ciclo · cierre de A · 2026-10-17
Disparador: cierre de parte A/M0, sin esperar cinco tareas de producto. T-000 no cuenta para el ciclo de producto (`counts_for_cycle: false`, `product_cycle: null`); T-001 conserva esos valores de M0. Sesión nueva planner: Codex desktop/API, familia declarada GPT-6; runtime exacto/esfuerzo efectivo no expuestos, sin atribuir Sol/high, delegar ni abrir otra sesión/modelo.

Resultado remoto comprobado antes de editar: PR #1 MERGED, HEAD revisado `1ba7ad80d045b458f535efda5aa6b184211b6f9f`, squash `47184f725f8a89528acac0aa3e7383f2334258de` coincidente con main local/tracking/remoto. CI FULL PR 39044690435 y main 39045270616 completed/success con classify/docs-check/server/client/e2e/verify-required success. Árbol limpio al inicio y ningún PR abierto. Primer commit `0310e73` de la rama exacta de B reconcilió T-000 done y tarea/STATUS/BACKLOG/HANDOFF. Evidencias/links exactos en T-000; no se vuelven a acreditar pruebas por herencia ni se modifica la checklist 0/22 NO_LISTO.

| Hallazgo del corte | Decisión dentro del contrato |
|---|---|
| A tiene revisión/merge/CI propios; no valida el arranque persistente de B ni la adopción | A done; activar únicamente refinamiento B. C…E siguen draft y dependen del merge anterior |
| dev-auth usa Node host, puertos fijos y cleanup efímero; readiness actual no incluye DB y proxies no publican su ruta | B agrega entrada persistente con runners/puertos explícitos, propiedad/rollback, readiness DB exacta y UI real; conservar harness y sus pruebas |
| T-001 inicial era contrato resumido y de tamaño mediano | [S-002](specs/S-002-local-stack.md) v1 y T-001 ready, dividida en B1 lifecycle → B2 readiness/proxies → B3 UI → B4 integración/FULL. Una tarea/PR de M0, sin trabajo paralelo |
| Persistencia, IP/DNS de proxies, resolución OIDC Windows y cleanup fallido requieren ensayos reales | Checkpoints por unidad, rojos antes del arreglo/negativos críticos, DB caída/recuperación y restart/rebuild/down/up; TR-01…TR-12 vigentes |
| Riesgo de confundir documentación/FULL de A con validación propia de B | Publicar solo planificación en rama; implementación en sesión nueva, FULL propio/CI y revisión independiente antes de merge. HANDOFF sin crédito adicional |

Cola revisada sin ampliar objetivo ni cambiar arquitectura/auth/ADR/versiones/umbrales/protecciones. Mantener pendientes de C (cobertura y logout con mutación en vuelo) y endurecimiento futuro de callback en BACKLOG, sin implementarlos aquí. No hay bloqueo que requiera decisión nueva del dueño para planificar B. Próximo corte por cierre de B, cambio relevante o cadencia de cinco tareas de producto; no anticipa D/E ni su constancia final.

## Revisión de ciclo · cierre de B · 2026-10-18
Disparador: cierre de parte B, sin esperar cinco tareas de producto. T-001 y T-002 son M0, `counts_for_cycle: false`, `product_cycle: null`; no incrementan un ciclo de producto. Planner nuevo: Codex desktop/API y PowerShell/Git Bash, familia declarada GPT-6; runtime exacto/esfuerzo efectivo no expuestos, sin atribuir Sol/high, delegar ni abrir otra sesión/modelo.

Precondiciones y evidencia por SHA en [cierre de T-001](tasks/T-001-local-stack.md#reconciliación-posterior-al-merge--2026-10-18): APROBADO R2 final, PR #2 MERGED con squash idéntico al árbol revisado; CI FULL final PR/main completed/success, seis jobs success y agregados FULL. Main local/tracking/remoto coincidentes, árbol limpio inicial y ningún PR abierto. Primer commit de `chore/t-002-reference-security` reconcilia T-001 done/tarea/STATUS/BACKLOG/HANDOFF y refina solo C. Ningún FULL repetido por reformular documentos ni crédito de pruebas heredado para C/HANDOFF.

| Hallazgo del corte | Decisión dentro del contrato |
|---|---|
| B tiene arranque persistente, DB/readiness/UI y proxies probados; R1-01 cerró teardown prematuro en Windows con negativo real | B done, conservar implementación/suites y SETUP TR-13…TR-16; C no reemplaza esas regresiones ni reabre R2/R3 |
| Falta un CRUD real para enseñar propiedad, formulario y retiro | [S-003 v1](specs/S-003-reference-security.md) y T-002 ready: C1 datos/servicio → C2 API/permisos → C3 UI/cache → C4 integración/cobertura/guía. Una tarea/PR M0, implementación en sesión nueva |
| Cobertura y logout con mutación en vuelo estaban pendientes de concretar en C | Contratados C-AC-07/09, incluyendo dos identidades/respuesta tardía y mínimos 80% líneas/70% ramas sin reducir base; salen de «Por refinar», todavía sin implementación acreditada |
| [Observación de eficiencia](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/2#issuecomment-6244875257): FULL+cleanup ≈33m26s; dirigidos integrados rojo/verde ≈21m29s/23m12s repiten prefijo local; CI e2e 16m58s en aquel run | Costo de repetición observado, sin perfil por fase ni ahorro demostrado. Mantener pendiente en BACKLOG: primero medir duración/exit saneados y builds/cache; luego evaluar entrada compartida con equivalencia de señal/espera/cleanup demostrada. No implementar optimización ni cambiar política en C |
| Preparación documental y sondeos repetidos agregan trabajo sin evidencia nueva | Aplicar regla AGENTS ya vigente: agrupar cierre con el avance, evidencia por SHA, checklist/checkpoint útil y pruebas por incertidumbre nueva. Esta conciliación/planificación se publica en un commit sin PR propio ni FULL adicional; cierre técnico de C sí exige FULL/CI/revisión independiente |
| Guía de retiro de referencia puede destruir datos o confundirse con inicializador/adopción | C documenta conexiones y diferencia DB vacía/existente sin tocar migraciones aplicadas; D integra formulario/guía y E prueba adopción sin kit, ambos draft |

Cola revisada sin ampliar objetivo, arquitectura/auth/ADR, dependencias, aceptación de B, suites/umbrales/retries/deadlines ni protecciones. Endurecimiento de callback sigue pendiente fuera de T-002. No hay decisión nueva del dueño necesaria para implementar C contratada. Próximo corte al cierre de C, cambio relevante o cadencia de cinco tareas de producto. HANDOFF permanece 0/22 NO_LISTO; beta/template solo tras D y adopción validada solo tras E, con el único límite posterior de PROVENANCE.

## Adopción de otro producto
Reiniciar PROJECT/ROADMAP/STATUS/BACKLOG desde el contexto nuevo, sin estados del starter. La primera tarea es T-000 de adopción; vuelve a validar HANDOFF, configuración GitHub propia y ensayo limpio. Las reglas/protocolos/ADR/spec de auth permanecen heredadas, sin convertirlas en pruebas ejecutadas.
