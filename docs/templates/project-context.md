# Contexto de una aplicación

Usar antes de crear el repo o completar `PROJECT_CONTEXT.md` raíz después. Si la idea ya está pulida, frontera reutiliza sus respuestas: no repetir el cuestionario. Responder en pocas líneas y preguntar solo por decisiones faltantes que afecten MVP, datos, reglas, permisos o aceptación. Ningún casillero obliga a agregar funcionalidad. No incluir secretos ni datos personales.

Cabecera del contexto final: nombre, objetivo en dos frases, dueño por rol/alias y estado (borrador o aceptado con evidencia del acuerdo). Separar confirmado, propuesto y pendiente. La identidad pública/licencia y autorización GitHub se resuelven para el repo propio en AUTONOMY; no asumirlos del starter.

1. **Problema y usuarios:** ¿qué tarea cuesta hoy, a quién y cómo la resuelve?
2. **Flujo central:** un usuario hace qué, con qué entrada y qué resultado observable obtiene. Dar un ejemplo ficticio.
3. **MVP y exclusiones:** qué debe funcionar en la primera entrega y qué queda expresamente afuera.
4. **Datos, reglas y permisos:** qué se guarda, qué valida y quién puede ver/cambiar/borrar cada recurso. Aclarar propiedad, unicidad, cantidades o tiempos solo si aplican.
5. **Aceptación:** tres o cuatro ejemplos comprobables, incluido un error y una acción denegada. Indicar qué prueba demuestra que el resultado se guardó.
6. **Decisiones pendientes:** duda concreta, responsable y condición para decidir. No convertir posibilidades futuras en infraestructura actual.

Ejemplo breve: «Agenda del taller» ayuda a su responsable a registrar turnos ficticios. Primer flujo: crear un turno con fecha y descripción y verlo al volver a entrar. MVP: alta/listado/cancelación propia; fuera: pagos, notificaciones y calendario externo. Cada usuario ve solo sus turnos; la descripción es obligatoria. Aceptación: se conserva tras retomar, un campo vacío falla junto al campo y otro usuario no accede al turno. Pendiente: el dueño debe decidir si admite turnos simultáneos antes de especificar esa regla.

Frontera transforma las respuestas en PROJECT_CONTEXT: un flujo F-01, reglas RN-01 y criterios CA-01 solo cuando ayuden a referenciar. Resolver bloqueantes, mantener monolito Spring/React/PostgreSQL y arquitectura existente, ubicar módulos y datos/permisos del primer flujo y preparar la [primera tarea ejecutable](task.md) con decisiones y comandos. No copiar el formulario vacío encima de respuestas existentes ni generar negocio desde la CLI. Una tarea pequeña autosuficiente no necesita spec aparte.

El contexto aceptado alimenta T-000 de adopción y luego la tarea del primer flujo; no acredita implementación, permisos GitHub ni pruebas. Guía única de recorrido: [README](../../README.md#crear-una-aplicación-y-su-primer-flujo).
