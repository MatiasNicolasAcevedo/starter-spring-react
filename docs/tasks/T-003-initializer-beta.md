---
id: T-003
status: draft
executor: frontier
role: planner
milestone: M0
counts_for_cycle: false
product_cycle: null
spec: null
branch: chore/t-003-initializer-beta
pr: null
depends_on: [T-002]
---
# T-003 · D · Personalización y beta

## Objetivo
Cumplir D de [ROADMAP](../ROADMAP.md) y el [destino de adopción autosuficiente](../../PROJECT_CONTEXT.md#adopción-futura): personalizar la base y habilitar el template beta con formulario y documentación propios, sin kit obligatorio.

## Alcance
Contrato futuro, sin ejecución en A. Solo activar tras MERGED + CI de la predecesora, revisión del tamaño y lectura de los archivos vigentes. Dividir si es mediana; una tarea y un PR activos.
Sin otros repos, Google real, datos/volúmenes ajenos, hosts globales ni ajustes fuera de la autorización.
Salida aceptada por el dueño el 2026-10-17 para refinar al habilitar D: integrar y pulir el formulario del kit en `docs/templates/project-context.md`; contexto completado en la raíz de cada aplicación. Consolidar en documentos existentes una guía breve desde «Create a repository from a template» hasta el primer flujo, con estructura/arquitectura, cómo retirar la referencia y criterios para crecer (módulos, permisos, migraciones y pruebas), sin infraestructura especulativa. No copiar el manual entero ni mantener dos versiones; inicializador sin acceso de escritura al kit.

## Aceptación y pruebas
Todas las salidas/pruebas de su fila de ROADMAP; conservar suites heredadas, negativos de seguridad y cleanup por labels. FULL local al cerrar fuentes técnicas y CI liviana según TESTING; revisión independiente con evidencia y dirigidos sobre SHA/base publicados, sin repetir FULL por rutina. Decisión del dueño 2026-10-18: alcance mínimo para MVP, sin automatizaciones semanales/dispatcher como condición de cierre.

- Formulario genérico versionado, sin identidad/estado del starter ni enlaces obligatorios al kit; contexto de ejemplo ficticio con aceptación suficiente para derivar el primer flujo sin convertir todas las preguntas en requisitos.
- Guía de adopción y crecimiento coherente con comandos, estructura y decisiones reales; enlaces a fuentes canónicas, sin duplicar protocolos. Desde copia temporal sin kit se encuentran el formulario, personalización y próximos pasos.
- El reinicio de documentos distingue formulario vacío y contexto completado y elimina estado del starter de la nueva app. Conservar todas las garantías del inicializador ya contratadas y validarlas en su copia temporal.

## Resultado
No ejecutada; sin pruebas, evidencias ni estado heredados. No abrir PR desde A.
