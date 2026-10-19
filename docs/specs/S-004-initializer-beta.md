---
id: S-004
status: approved
version: 1
milestone: M0
tasks: [T-003]
---
# S-004 · Personalización mínima y template beta

## Problema y usuario
El dueño necesita empezar MVP pequeños desde esta base, con nombre/paquete/contexto propios y sin kit personal. Contrato: [PROJECT_CONTEXT · Adopción futura](../../PROJECT_CONTEXT.md#adopción-futura) y decisión del 2026-10-18; parte D de [ROADMAP](../ROADMAP.md). El contexto genérico no contiene IDs F-/RN-/CA-; D-AC traza estas salidas sin inventar negocio. C está MERGED; su evidencia se conserva en T-002 y no valida D.

## Reglas y contrato del inicializador
1. `scripts/init-project.mjs` se ejecuta con Node >=24 sobre una copia limpia propia. Entradas explícitas: nombre visible, slug, paquete Java y titular MIT. Sin red, Git, Docker ni gestor de dependencias invocados por el inicializador; sin prompts interactivos obligatorios. `--help` documenta argumentos y ejemplos ficticios. No acepta credenciales ni contexto privado en argumentos.
2. Dry-run por defecto: muestra cambios previstos sin escribir ni crear archivos. Solo `--apply` escribe. Argumentos inválidos/desconocidos/incompletos o una copia incompatible terminan no cero antes de escribir. Validar slug seguro para nombres del proyecto, paquete Java con segmentos válidos sin palabras reservadas, nombre/titular no vacíos y sin controles; rechazar rutas o separadores donde se espera un identificador. Diagnósticos breves, sin contenido de archivos privados.
3. Lista explícita de destinos y operaciones, documentada y revisable en D1 antes de programar sustituciones. Incluye solo identidad de proyecto en fuentes/configuración propias, renombre del árbol Java main/test, licencia y reinicio documental contratado. No reemplazo global recursivo ni descubrimiento de archivos por contenido. Resolver destinos dentro de la raíz de la copia, rechazar enlaces simbólicos/junctions, escapes, colisiones y estado parcial incompatible antes de la primera escritura. Ninguna escritura fuera de lista o sobre `.git`, `plantilla/`, ignorados, `.env` real, dependencias, reportes o datos.
4. Aplicar dos veces las mismas entradas debe dejar exactamente los mismos bytes y rutas después de la primera aplicación; repetir dry-run tampoco cambia nada. Permitir el estado inicial conocido y el ya personalizado compatible. Prevalidar todos los archivos/renombres antes de aplicar; fallo de E/S devuelve error y no promete una transacción de filesystem. Ensayar solo en copias descartables, nunca en este checkout ni sobre datos persistentes.
5. Personalizar nombre/slug/paquete/titular conectados sin cambiar versiones, coordenadas de dependencias, wrappers, configuración auth, rutas API, schema ni migraciones. Lockfiles solo por su gestor si una identidad de paquete lo exige; verificar que ninguna resolución/version cambia. No retirar automáticamente la feature de referencia; enlazar [REFERENCE](../REFERENCE.md) y sus restricciones sobre migraciones aplicadas.
6. La copia recibe PROJECT_CONTEXT propio separado del formulario vacío, PROJECT/ROADMAP/STATUS/BACKLOG reiniciados y una primera T-000 de adopción. No reutiliza estados done/mergeable, PRs activos, evidencias verificadas ni permisos GitHub del starter como vigentes. HANDOFF vuelve a 0/22 NO_LISTO y AUTONOMY requiere decisiones/configuración del dueño del producto. Resolver los registros de tareas/specs del starter en la lista explícita, sin IDs activos duplicados ni enlaces rotos. PROVENANCE conserva exclusivamente su función canónica; no activa su continuidad de cierre desde la copia.
7. Formulario en `docs/templates/project-context.md`: problema, usuarios, flujo central, MVP/exclusiones, datos/reglas/permisos, aceptación y decisiones pendientes. Profundidad proporcional a la idea, sin casilleros que agreguen alcance. Se puede consultar antes de crear el repo; completar el contexto en la raíz de la app no importa estados del starter. Tomar solo lo útil del kit transitorio si se consulta; nunca copiarlo ni borrarlo desde el inicializador.
8. Guía breve en README/SETUP: crear desde GitHub template, personalizar, completar contexto, levantar/probar y derivar T-000/primer flujo. Enlazar ARCHITECTURE/ADR/REFERENCE/protocolos para añadir módulos, permisos, migraciones y tests; defaults y criterios para crecer, sin otro manual ni infraestructura hipotética. Durante D el camino GitHub se documenta, el ensayo real se hace en copia temporal propia; E valida el recorrido completo con otra identidad/contexto.
9. Beta tiene límites visibles: validación local/OIDC ficticio, Google real pendiente externo del dueño, adopción E todavía pendiente. Marcar **este mismo repo** template solo después de implementación, FULL local válido, revisión independiente, CI liviana y merge de D comprobados. Autorización específica de ROADMAP, sin modificar otros ajustes/protecciones, crear repos ni publicar release. Hasta entonces no afirmar beta/template habilitados.

## Aceptación y pruebas previstas
Los archivos de pruebas siguientes son destinos por crear en la sesión implementadora. Casos negativos deben detectar la ausencia de cada guardia crítica; pruebas sin API propia simulada para los ensayos reales.

| ID | Resultado observable | Prueba de salida prevista |
|---|---|---|
| D-AC-01 | Ayuda/entradas válidas y dry-run por defecto, cero cambios | `scripts/test-init-project.mjs`: snapshot de bytes/rutas antes/después, plan solo con destinos permitidos |
| D-AC-02 | Apply conectado e idempotente, paquete main/test trasladado sin restos operativos | Misma matriz: primera aplicación, segunda idéntica y dry-run posterior; nombre/slug/paquete/titular distintos ficticios; build/docs-check de copia |
| D-AC-03 | Entradas inseguras, enlaces, escape, colisión o estado incompatible fallan antes de escribir | Matriz con negativos y controles positivos; centinelas fuera de lista y fuera de copia intactos; ni lectura de secretos ni acceso al kit/Git |
| D-AC-04 | Contexto/formulario y T-000 propios, tablero y HANDOFF sin crédito heredado | docs-check en copia, inspección del contexto ficticio y enlaces; rechazo de estados/permisos/evidencia del starter como propios |
| D-AC-05 | Formulario y guía breve permiten ubicar primer flujo y sus permisos/migración/tests sin kit | Recorrido de documentación en copia sin kit; ejemplo ficticio suficiente sin ampliar producto; inspección de enlaces canónicos |
| D-AC-06 | Personalización compila y no altera inventario/auth/schema/regresiones | Copia temporal sin Git/kit/ignorados: backend `clean verify`, client verify, docs-check y comparación de versiones/locks/migraciones; integrar comprobación reproducible en gate pertinente sin ejecutar un FULL anidado |
| D-AC-07 | D tiene evidencia propia y publicación beta condicionada al merge | FULL local final sin opciones en rama D, CI liviana sobre HEAD/base publicados, revisión independiente con dirigidos/negativos y merge confirmado; después comprobar `isTemplate=true` de este repo y límites visibles |

## Impacto y límites
No hay API HTTP ni UI nueva de negocio. Solo identidad visible/configuración y documentación en la copia; contrato de sesión Google OIDC/CSRF, permisos por dueño y datos permanecen iguales. El actor autorizado es el dueño sobre su copia limpia; se deniega cualquier destino ajeno o fuera de lista. Sin migraciones ni operaciones sobre DB/volúmenes. Mantener pruebas/umbrales/retries/deadlines y dependencias inventariadas. No dispatcher, atestaciones, calendario, actualización a latest, Google real, recursos ajenos, origen ni implementación de E.

## Ejecución y validación de planificación · 2026-10-18
D1 inventario/contrato de escrituras y matriz → D2 inicializador/copias → D3 formulario/guía/reinicio → D4 integración/FULL/revisión/merge y habilitación condicionada. Una tarea/PR M0 con checkpoints, sin trabajo paralelo. Detalle y evidencia real en [T-003](../tasks/T-003-initializer-beta.md).

Planner nuevo: Codex desktop/API y PowerShell, familia GPT-6 expuesta; runtime exacto/esfuerzo efectivo no expuestos. Sol/high solicitado, sin simular selección/delegación/otras sesiones/modelos. `approved` significa alineación con el contrato/decisión del dueño; no aprobación humana ni revisión de implementación. Esta sesión publica solo planificación; todas las pruebas D están pendientes. T-004 continúa draft y HANDOFF0/22 NO_LISTO.
