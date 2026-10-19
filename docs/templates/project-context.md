# Contexto de una aplicación

Usar antes de crear el repo o completar `PROJECT_CONTEXT.md` raíz después. Responder en pocas líneas; profundizar solo donde haya incertidumbre real. Ningún casillero obliga a agregar funcionalidad. No incluir secretos ni datos personales.

1. **Problema y usuarios:** ¿qué tarea cuesta hoy, a quién y cómo la resuelve?
2. **Flujo central:** un usuario hace qué, con qué entrada y qué resultado observable obtiene. Dar un ejemplo ficticio.
3. **MVP y exclusiones:** qué debe funcionar en la primera entrega y qué queda expresamente afuera.
4. **Datos, reglas y permisos:** qué se guarda, qué valida y quién puede ver/cambiar/borrar cada recurso. Aclarar propiedad, unicidad, cantidades o tiempos solo si aplican.
5. **Aceptación:** tres o cuatro ejemplos comprobables, incluido un error y una acción denegada. Indicar qué prueba demuestra que el resultado se guardó.
6. **Decisiones pendientes:** duda concreta, responsable y condición para decidir. No convertir posibilidades futuras en infraestructura actual.

Ejemplo breve: «Agenda del taller» ayuda a su responsable a registrar turnos ficticios. Primer flujo: crear un turno con fecha y descripción y verlo al volver a entrar. MVP: alta/listado/cancelación propia; fuera: pagos, notificaciones y calendario externo. Cada usuario ve solo sus turnos; la descripción es obligatoria. Aceptación: se conserva tras retomar, un campo vacío falla junto al campo y otro usuario no accede al turno. Pendiente: el dueño debe decidir si admite turnos simultáneos antes de especificar esa regla.

El contexto aceptado alimenta T-000 de adopción y después la spec/tarea del primer flujo; no acredita implementación, permisos GitHub ni pruebas. Guía única de recorrido: [README](../../README.md#crear-una-aplicación-y-su-primer-flujo).
