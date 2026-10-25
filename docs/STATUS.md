# Estado del starter

| Campo | Valor |
|---|---|
| Tarea y contrato | [T-008](tasks/T-008-junie-merge-continuation.md) |
| Estado | in_progress |
| Acción actual | Cerrar aclaraciones de merge Junie/continuidad, verificar copia y gate STARTER, publicar para revisión independiente |
| Rama / PR | codex/t-008-junie-merge-continuation · sin PR todavía |

Evidencia y checkpoint en T-008. T-007 conciliada done mediante consulta explícita de PR8. No hay otra tarea predefinida ready; cada copia decide su autonomía propia.

### Prompt de la siguiente sesión

```text
Retomar únicamente T-008 del Starter como implementer de frontera. Leer AGENTS.md, PROJECT_CONTEXT.md, docs/STATUS.md, docs/tasks/T-008-junie-merge-continuation.md y sus referencias concretas, docs/agents/implementer.md y docs/TESTING.md. Precondición: comprobar árbol/HEAD/base y PR activos con repositorio explícito; conservar cambios existentes en codex/t-008-junie-merge-continuation. Completar exclusión de mantenimiento y dirigidos, ejecutar gate STARTER con checkpoint de fuentes/base, logs saneados y cleanup propio según SETUP; no acreditar resultados parciales. Publicar solo al pasar el gate y dejar revisión independiente de HEAD/base publicados en una sesión nueva; esta sesión autora no aprueba ni mergea. Si hay bloqueo, documentar causa, evidencia, intentos distintos, responsable y dato/capacidad/decisión necesaria; entregar prompt concreto para resolverlo aun si hay que volver a frontera/dueño. Salida: PR ready y prompt reviewer, o bloqueo con condición de salida comprobable. No iniciar otra tarea. Tras MERGED confirmado no hay tarea predefinida siguiente: volver a frontera/dueño para decidir objetivo y conciliar done en el primer avance de esa futura rama autorizada. Entregar siempre el prompt vigente completo y copiable en la respuesta final.
```
