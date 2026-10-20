# Microensayo único preparado · mensaje de error vacío

Contrato listo para ejecutar por Junie Lite, subordinado a la tarea de preparación/adopción que lo habilite; no es otra tarea/PR activa. No ejecutar sobre el starter de mantenimiento ni acreditar adopción con este ensayo. Configuración del dueño: Qwen 3.6 27B declarada; ejecución y resultado todavía pendientes.

## Objetivo y decisiones
Cuando una API devuelve un error 4xx ordinario con detail vacío o solo espacios, `errorMessage` debe mostrar exactamente `No se pudo completar la solicitud.`. El código actual usa `??`, que deja pasar esos strings vacíos; inspección de fuente, todavía sin rojo ejecutado por Junie. Conservar literalmente un detail no vacío y las ramas de 401, 403, 5xx, red y CSRF. Sin cambiar HTTP, permisos, backend, dependencias, componentes ni textos de otras ramas. Es un borde de una transformación ya utilizada; no agrega una feature ficticia.

## Leer antes y archivos
AGENTS raíz, client/AGENTS.md; `client/src/shared/ui/errorMessage.ts` y su `errorMessage.test.ts`; TESTING · Elegir pruebas para una tarea pequeña. Solo esos dos archivos de código previstos. El dueño entrega una copia descartable propia sin Git, kit, secretos o artefactos, exportada de la preparación revisada; registra SHA/base de origen. No publicar ni crear PR desde esa copia. Si no están disponibles esas condiciones, informar el dato faltante.

## Pasos, aceptación y prueba
1. Con Node>=24, desde la raíz de la copia: `npm ci --prefix client`. Añadir casos parametrizados para detail `''`, `'   '` y `'\t\n'`, y un texto útil no vacío; comprobar valores completos, sin debilitar tests existentes.
2. Ejecutar `npm --prefix client test -- --run src/shared/ui/errorMessage.test.ts`: los vacíos deben fallar antes del arreglo. Conservar log saneado y exit real.
3. Arreglo mínimo en la transformación; usar trim solo para decidir si hay contenido, sin alterar el detalle no vacío devuelto. Repetir el comando y ejecutar `npm --prefix client run typecheck`, `npm --prefix client run lint` y `npm --prefix client run format:check`.
4. Devolver el diff de los dos archivos, SHA/base origen, rutas AGENTS leídas, modelo/herramienta/esfuerzo que la interfaz realmente exponga, comandos con exit y logs rojo/verde. No llamar FULL a esos dirigidos ni declarar Qwen/Junie probado por un resultado de frontera.

Esta transformación pura se comprueba con unitario: no necesita interacción, persistencia ni una nueva E2E. Si se integra el arreglo al producto, su tarea debe cumplir el FULL técnico y revisión independiente vigentes; este microensayo no los sustituye. Bloqueo: registrar causa, comando, intentos distintos y dato/decisión necesaria, sin tocar otras capas. La evidencia se registra en la tarea que habilita el ensayo, sin otro informe permanente.

Prompt para el dueño al ejecutar, una vez preparada la copia:

```text
En esta copia descartable propia, ejecutá el contrato docs/templates/junie-trial.md con Junie Lite. Leé AGENTS.md y client/AGENTS.md; implementá solo el borde indicado con su prueba unitaria rojo→verde. Devolvé el diff y la evidencia exacta pedida. No publiques, no abras otros agentes y no ejecutes E.
```
