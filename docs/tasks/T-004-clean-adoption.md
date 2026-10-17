---
id: T-004
status: draft
executor: frontier
role: planner
milestone: M0
counts_for_cycle: false
product_cycle: null
spec: null
branch: chore/t-004-clean-adoption
pr: null
depends_on: [T-003]
---
# T-004 · E · Ensayo de adopción

## Objetivo
Cumplir E de [ROADMAP](../ROADMAP.md): demostrar que una idea se adopta desde otra copia limpia con la base y documentación propias, sin copiar el kit, conforme [PROJECT_CONTEXT](../../PROJECT_CONTEXT.md#adopción-futura).

## Alcance
Contrato futuro, sin ejecución en A. Solo activar tras MERGED + CI de la predecesora, revisión del tamaño y lectura de los archivos vigentes. Dividir si es mediana; una tarea y un PR activos.
Sin otros repos, Google real, datos/volúmenes ajenos, hosts globales ni ajustes fuera de la autorización.

## Aceptación y pruebas
Todas las salidas/pruebas de su fila de ROADMAP; conservar suites heredadas, negativos de seguridad y cleanup por labels. Gate según diff, FULL obligatorio en beta y adopción; CI y revisión en sesión distinta sobre SHA publicado.

- Ensayo sin `plantilla/`: obtener el formulario del propio repo, completar contexto ficticio distinto, personalizar y seguir README literal hasta stack/health/Swagger/login, retoma persistente y FULL/CI. No crear otro repo sin decisión del dueño; ensayar en la copia temporal autorizada y verificar las instrucciones del camino GitHub template con sus límites explícitos.
- Guía de arquitectura/crecimiento suficiente para identificar dónde va el primer flujo, sus permisos/migración/pruebas y qué cambios requieren decisión, sin reconstruir infraestructura común ni pedir instrucciones del kit.
- Cero dependencias operativas o enlaces necesarios al kit; distinguir sus menciones de exclusión/procedencia de dependencias reales. Tras E MERGED y validada, el dueño puede eliminar su copia local; este ensayo y el inicializador no la borran. Conservar el cierre y único límite posterior en PROVENANCE.

## Resultado
No ejecutada; sin pruebas, evidencias ni estado heredados. No abrir PR desde A.
