# ROADMAP · Partes de la base reusable

| Política | Valor |
|---|---|
| Cadencia efectiva | 5 |
| Revisión de ciclo | Cada cinco tareas de producto mergeadas, cierre de parte/hito o cambio relevante |
| WIP | Una tarea y un PR activos; revisión en sesión distinta |

## Secuencia contratada

El objetivo vigente es completar este mismo starter de A a E. A/B/C/D están terminadas con revisión/merge/CI comprobados y evidencia propia en sus tareas. D/T-003 cierra S-004 v1 con PR#4 MERGED y template beta comprobado; [T-004](tasks/T-004-clean-adoption.md) contiene la preparación previa in_progress autorizada el 2026-10-19 y el contrato propio E, todavía sin ejecución. Cada parte requiere revisión, squash merge confirmado y CI vigente antes de activar la siguiente.

| Parte | Estado real | Resultado en palabras simples |
|---|---|---|
| A | done; PR #1 MERGED y CI verificada | Extraer y neutralizar la base, conservar versiones y contratos |
| B | done; PR #2 MERGED y CI FULL PR/main verificadas | Levantar, comprobar, detener y retomar la aplicación conectada a su DB |
| C | done; PR #3 MERGED, R2/CI liviana exactos, squash comprobado | Incorporar un ejemplo removible completo con permisos y pruebas |
| D | done; PR#4 MERGED, APROBADO R1/CI liviana exactos, squash idéntico e isTemplate=true | Personalizar la base con un inicializador y habilitarla como template beta |
| E | Preparación previa en T-004; ensayo E-AC/E1→E4 pendiente en otra sesión | Comprobar desde otra copia limpia que sirve para empezar otra aplicación |

La aceptación detallada está abajo y en la tarea/spec de cada parte. Refinar solo la próxima parte al habilitarse; una tarea ready pasa a implementación, sin otra ronda de planificación salvo cambio material. Aplicar documentación mínima útil de AGENTS durante el trabajo: comandos de uso en README/SETUP, decisiones en ADR, evidencia en tarea/PR y estado breve con enlaces en el tablero. Materializar aprendizajes en esa base, sin mantener otro manual vivo en el kit transitorio.

| Parte / tarea | Depende | Salida y prueba exigidas |
|---|---|---|
| A · T-000 | Ancla | Extracción neutralizada, inventario completo sin cambios de versión, docs propias; build/typecheck/docs-check y pruebas heredadas; FULL según gate vigente |
| B · T-001 | A MERGED | Adaptar dev-auth existente a dev.sh up/check/down; modo local explícito sin Google; PostgreSQL 18/server/client conectados; pantalla API/DB real; readiness Actuator incluye DB, ruta exacta por nginx/Vite; Swagger opt-in GET bajo /api/docs, recursos/config/JSON y Try it out. DB vacía, caída DB → health/UI fallan → recuperación; ambos proxies, 1280/375; down conserva desarrollo y cleanup por labels solo de pruebas |
| C · T-002 | B MERGED | Feature de referencia removible propia del usuario: CRUD/paginación/migración/autorización por dueño, formulario RHF/Zod y E2E. Login/logout, CSRF, propiedad/denegación y negativos del perfil real; no perder pruebas OIDC heredadas. Documentar cómo quitar/reemplazar ejemplo; fijar mínimos 80% líneas/70% ramas para dominio/servicios/hooks sin reducir vigentes |
| D · T-003 | C MERGED | init-project.mjs con lista explícita, dry-run por defecto, idempotencia y sin tocar .git/kit/fuera de lista; nombre/slug/paquete/titular, documentos reiniciados (T-000 de adopción). Copia temporal compilable y docs-check; FULL local y CI liviana verdes. Solo entonces beta con límites visibles y repo marcado template, mismo repo base |
| E · T-004 | D MERGED | Segunda copia limpia, app ficticia con identidad/contexto distintos; instalar, levantar, probar, detener y retomar siguiendo README literal: stack conectado, DB vacía, persistencia, login local, E2E, Swagger nginx/Vite, FULL local y CI liviana. Coexistencia sin cruzar puertos/DB/volúmenes; cleanup labels sin huérfanos. No crear otro repo sin decisión del dueño |

## Cierre mínimo para MVP · revisión del dueño 2026-10-18
La aplicación es un monolito Spring + SPA React + PostgreSQL. Lo que creció desproporcionadamente es la operación de validación/traspaso:43 Markdown y45 scripts versionados para34 Java de producción y31 archivos client de producto (conteo orientativo, no medida de calidad). Hay repetición de FULL local/revisor/CI y el gate continuaba a E2E tras un fallo de client. README tampoco reflejaba la corrección local pendiente. La simplificación actúa primero ahí, sin reconstruir el stack ni retirar pruebas de seguridad.

| Orden | Trabajo pendiente | Salida concreta para pasar al siguiente |
|---|---|---|
| 1 · C cerrada (T-002 done) | R2 independiente APROBADO, CI liviana final exacta y PR#3 MERGED comprobados; evidencia canónica en T-002 | CRUD privado y regresiones comprobados; cierre conciliado con el primer avance D |
| 2 · Preparar uso (D/T-003 done, S-004 v1) | Inicializador, formulario y guía comprobados; evidencia propia y cierre en T-003/PR#4 | FULL local, APROBADO R1/CI y MERGED comprobados; template beta habilitado con límites visibles |
| 3 · Preparar, revisar y ensayar (E/T-004) | Seguir la guía desde copia limpia con contexto ficticio distinto; levantar/login/CRUD/persistencia/retoma y FULL local, corregir solo defectos comprobados | Recorrido reproducible sin kit, checklist final con evidencia, revisión y merge; starter listo para adopción |

Falta E; A/B/C/D están cerradas. No son nuevas aplicaciones ni funcionalidades de negocio. Presupuesto orientativo: una sesión de trabajo y una revisión para el ensayo restante, ajustado por hallazgos concretos. Las ejecuciones FULL históricas de C duraron aproximadamente34 minutos; su FULL final35m38s no es una validación instantánea ni acredita ahorro medido del gate optimizado.

**Proceso desde ahora:** pruebas locales dirigidas durante desarrollo, un FULL local al cerrar las fuentes técnicas; no repetir por documentación idéntica técnicamente ni por rutina de revisión. CI automática de un solo job liviano, FULL remoto solo manual; condiciones y límites en TESTING. Fallo temprano detiene el gate y deja las siguientes suites sin ejecutar. Publicar por avances útiles y conservar revisión independiente; sin cambios de rulesets, servicios nuevos ni runners permanentes.

**Fuera del cierre mínimo:** dispatcher/orquestador, formato de atestación, automatizaciones semanales, nuevas capas de arquitectura, autenticación propia, más features de ejemplo, optimizaciones de caché sin medición y ampliación de D/E. Las reglas de seguridad/datos/cleanup y las versiones del stack se conservan. No borrar el kit ni rehacer el producto para reducir el número de archivos. Para MVP futuros, comenzar por un flujo útil dentro de esta misma arquitectura.

HANDOFF0/22 es una checklist de aceptación final todavía no reconciliada; no expresa0% de implementación. A/B/C/D tienen evidencia y cierres propios en sus tareas. Al cerrar E se reconcilian los criterios con sus fuentes, sin repetir todas las fases solo para actualizar ese contador.

## Límites de cierre
En B, Docker Desktop + Git Bash deben bastar para up/check/down sin Maven, PostgreSQL ni Node instalados en el host; usar runners containerizados para los probes reproducibles y declarar cualquier navegador host opcional. Debe haber cero fallback del perfil real y ningún cambio global de hosts. El check valida estado y contenido, no un 200 que sea index.html. El arranque fallido limpia lo recién creado sin borrar volúmenes preexistentes.
Decisión del dueño 2026-10-18: D se limita a inicializador, formulario y guía breve. Las pruebas locales comprueban lista de escrituras, build/docs-check e inventario, sin crear otro repo. Dependabot/calendario de adopción se posponen; no son condición para terminar el starter. Actualizaciones futuras prueban lo afectado y majors/fundacionales exigen FULL local. La autorización para marcar este mismo repo como template en D es específica; no permite modificar las protecciones iniciales.
Decisión del dueño 2026-10-17: [destino autosuficiente](../PROJECT_CONTEXT.md#adopción-futura). D integra/pule el formulario de contexto dentro del repo y consolida la guía de crear desde template, adoptar y hacer crecer la arquitectura; E prueba el recorrido sin `plantilla/`, incluido el contexto nuevo. El kit queda transitorio hasta esa validación; su eliminación local posterior corresponde al dueño y no al inicializador. D cerrada en S-004/T-003; contrato E en T-004, sin agregar otra etapa al cierre.
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
| [Observación de eficiencia](https://github.com/MatiasNicolasAcevedo/starter-spring-react/pull/2#issuecomment-6244875257): FULL+cleanup ≈33m26s; dirigidos integrados rojo/verde ≈21m29s/23m12s repiten prefijo local; CI e2e 16m58s en aquel run | Costo de repetición observado, sin perfil por fase ni ahorro demostrado. Mantener pendiente en BACKLOG: primero medir duración/exit saneados y builds/cache; luego evaluar entrada compartida con equivalencia de señal/espera/cleanup demostrada. Restricción histórica sustituida por la decisión del dueño del 2026-10-18 registrada arriba |
| Preparación documental y sondeos repetidos agregan trabajo sin evidencia nueva | Aplicar regla AGENTS ya vigente: agrupar cierre con el avance, evidencia por SHA, checklist/checkpoint útil y pruebas por incertidumbre nueva. Esta conciliación/planificación se publica en un commit sin PR propio ni FULL adicional; cierre técnico de C sí exige FULL/CI/revisión independiente |
| Guía de retiro de referencia puede destruir datos o confundirse con inicializador/adopción | C documenta conexiones y diferencia DB vacía/existente sin tocar migraciones aplicadas; D integra formulario/guía y E prueba adopción sin kit, ambos draft |

Cola revisada sin ampliar objetivo, arquitectura/auth/ADR, dependencias, aceptación de B, suites/umbrales/retries/deadlines ni protecciones. Endurecimiento de callback sigue pendiente fuera de T-002. No hay decisión nueva del dueño necesaria para implementar C contratada. Próximo corte al cierre de C, cambio relevante o cadencia de cinco tareas de producto. HANDOFF permanece 0/22 NO_LISTO; beta/template solo tras D y adopción validada solo tras E, con el único límite posterior de PROVENANCE.

## Revisión de ciclo · cierre de C · 2026-10-18
Disparador: cierre de parte C y decisión relevante del dueño sobre validación/MVP, sin esperar cinco tareas de producto. T-002 y T-003 son M0, `counts_for_cycle: false`, `product_cycle: null`; no incrementan ciclo de producto. Planner nuevo: Codex desktop/API y PowerShell, familia expuesta GPT-6; runtime exacto/esfuerzo efectivo no expuestos. Sol/high solicitado, sin simular selección ni delegar/abrir sesiones/modelos.

Precondición comprobada antes de editar y fuente canónica: [reconciliación de T-002](tasks/T-002-reference-security.md#reconciliación-posterior-al-merge--2026-10-18), con APROBADO R2, HEAD/base/CI final exactos, PR#3 MERGED y squash idéntico al árbol revisado. Main local/tracking/remoto coincidentes, árbol limpio inicial, PR abiertos `[]`, T-002 documentalmente mergeable y D/E draft. Primer avance de `chore/t-003-initializer-beta` desde main concilia C done/tarea/STATUS/BACKLOG/HANDOFF y refina solo D. Evidencia pesada de C conservada, sin otro FULL ni CI automática de main exigidos por rutina.

| Hallazgo del corte | Decisión dentro del contrato |
|---|---|
| C cerró el borde de offsets grandes y demostró propiedad/conteos/cache con negativos | C done; conservar regresiones y guía REFERENCE, sin reabrir R2/R3 ni atribuir esas pruebas a D/HANDOFF |
| La repetición de FULL y documentación agregaba costo sin incertidumbre nueva | Decisión del dueño ya materializada en TESTING/gate/CI: dirigidos locales, un FULL al cierre técnico, liviano en PR, remoto solo manual y fallo temprano. Sin atestaciones/dispatcher/calendario ni ahorro porcentual prometido |
| Falta personalización segura y contexto/guía propios para empezar un MVP | [S-004 v1](specs/S-004-initializer-beta.md) y T-003 ready: D1 escrituras/guardias → D2 inicializador → D3 formulario/guía/reinicio → D4 integración/cierre. Una tarea/PR; implementación en sesión nueva, sin otra planificación salvo cambio material |
| Personalizar puede escribir fuera de destino o heredar estados/permisos del starter | Lista explícita, dry-run/apply/idempotencia, negativos y copia compilable; T-000/contexto/HANDOFF/AUTONOMY propios, sin kit/Git/secretos/datos. D no elimina referencia ni altera migraciones |
| Beta y ensayo de adopción son resultados distintos aún pendientes | Template del mismo repo solo tras D validada/revisada/MERGED; E draft y secuencial, sin otro repo ni kit. HANDOFF0/22 NO_LISTO, continuidad posterior solo PROVENANCE |

Cola revisada sin ampliar objetivo, arquitectura/auth/ADR, versiones, suites/umbrales/retries/deadlines ni protecciones. Endurecimiento del callback y optimizaciones no medidas siguen en BACKLOG, fuera de D mínima. No se necesita nueva decisión del dueño para implementar el contrato refinado. Próximo corte al cierre de D, cambio relevante o cadencia de cinco tareas de producto.

## Revisión de ciclo · cierre de D · 2026-10-19
Disparador: cierre de parte D, sin esperar cinco tareas de producto. T-003/T-004 son M0, counts_for_cycle=false y product_cycle=null. Rol planner; Codex desktop/API y PowerShell/git/gh, familia expuesta GPT-6; runtime exacto/esfuerzo efectivo no expuestos. Sol/high solicitado, sin simular selección ni delegar/abrir sesiones/modelos. Impacto solo documental, sin cambios de comportamiento, API, permisos/propiedad, datos o UI.

Precondición y evidencia canónica en [cierre conciliado de T-003](tasks/T-003-initializer-beta.md#reconciliación-posterior-al-merge--2026-10-19): PR#4 MERGED, APROBADO R1/HEAD/base/CI exactos, squash idéntico e isTemplate=true de este mismo repo; main local/tracking/remoto coincidentes, árbol limpio y ningún PR abierto. T-003 mergeable y T-004 draft al inicio. Primer avance de chore/t-004-clean-adoption concilia D done/tarea/STATUS/BACKLOG/HANDOFF/README junto al contrato E, sin PR documental separado, commits en main/rama mergeada ni otro FULL por Markdown.

| Hallazgo del corte | Decisión dentro del contrato |
|---|---|
| D completa personalización/copia compilable y template beta, pero no ensayo de otra adopción | D done; límites beta local/OIDC ficticio y Google real pendiente visibles; E exige evidencia propia |
| T-004 draft carecía de pasos y matriz para ejecutar sin otra planificación | Contrato canónico en T-004, ready: E1 copia/contexto → E2 recorrido literal/aislamiento/retoma → E3 FULL propio → E4 evidencia/revisión/cierre; ejecución en sesión nueva |
| Una spec adicional repetiría un contrato de ensayo sin API nueva | Reglas, permisos, contexto ficticio y E-AC quedan en la misma tarea; no nuevo manual ni infraestructura |
| Preparación de D no acredita los22 criterios globales ni creación de otro repo | HANDOFF0/22 NO_LISTO; reconciliar por criterio en E con evidencia fechada, sin herencia ni crear repos; conservar kit |
| Solo resta el ensayo E dentro del objetivo aceptado | No ampliar negocio/arquitectura/auth/versiones ni protecciones; tras E MERGED y validada, única continuidad PROVENANCE |

Cola revisada: callback y automatizaciones/optimizaciones siguen fuera del cierre mínimo en BACKLOG. No bloqueos para ejecutar el contrato E en sesión nueva; no repetir planificación salvo cambio material. Próximo corte al cierre de E o cambio relevante. Ninguna prueba E ejecutada por documentar este contrato.

## Adopción de otro producto
Reiniciar PROJECT/ROADMAP/STATUS/BACKLOG desde el contexto nuevo, sin estados del starter. La primera tarea es T-000 de adopción; vuelve a validar HANDOFF, configuración GitHub propia y ensayo limpio. Las reglas/protocolos/ADR/spec de auth permanecen heredadas, sin convertirlas en pruebas ejecutadas.

## Revisión de ciclo · preparación previa a E · 2026-10-19
Cambio material explícito del dueño: priorizar MVP pequeños, frontera como planner y Junie Lite como ejecutor de contratos pequeños. Alcance y evidencia canónicos en T-004; no un informe adicional ni tarea/PR paralelo. Se simplifican lecturas, contrato de tareas, progreso y reset de la copia; se conserva FULL técnico/E, CI requerida y seguridad. Preparación se revisa independientemente antes de ejecutar E en otra sesión dentro del único PR T-004; no merge parcial ni adopción acreditada. Microensayo Junie preparado, ejecución pendiente. Roles, estado y pruebas propios no se heredan a nuevas aplicaciones.
