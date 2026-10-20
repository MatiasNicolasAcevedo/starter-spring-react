# Cola del starter

Acción actual y único prompt en [STATUS](STATUS.md); estados y evidencia canónicos en cada tarea. Cambiar este índice solo al cambiar orden/dependencias.

## En curso
- [T-004](tasks/T-004-clean-adoption.md): revisión completa favorable; mergeable en PR#5, pendiente de CI/veredicto del HEAD documental final y MERGED para habilitar la única continuidad PROVENANCE. D MERGED. Sin otra tarea/PR activa.

## Siguientes
Tras revisión favorable y MERGED de T-004: única continuidad PROVENANCE y retiro del kit por el dueño. No hay otra tarea ready de producto en este starter. El microensayo Junie tiene contrato preparado, sin ejecución ni PR paralelos.

## Por refinar
- Callback fallido con sesión previa: evaluar logout forzado cross-site en una tarea futura; no reabrir auth durante esta preparación.
- Automatizaciones, dispatcher, atestaciones y caché sin medición: fuera del cierre mínimo; reconsiderar solo ante necesidad concreta.
- docs-check del tablero de listas: validar sección/estado (En curso/Hechas) también en ítems de lista, con negativo; hoy una tarea en vuelo listada en Hechas pasa. Observación O1 de la revisión de preparación de T-004; no amplía E.
- Huella de ruta de dev.sh: una copia bajo `%TEMP%` tiene dos grafías en Git Bash (`/tmp` y `/c/Users/.../Temp`) y el check con la otra falla cerrado sin mutar. Evaluar normalización compatible con volúmenes existentes. Observación E-O1 de T-004.
- Imágenes de proyectos efímeros: los ensayos retiran contenedores/redes/volúmenes por label pero dejan imágenes `<proyecto>-*` de nombre único que se acumulan. Evaluar limpieza acotada a imágenes propias. Observación E-O2 de T-004.
- Conteo de HANDOFF en STATUS: docs-check valida solo la primera ocurrencia y su negativo asume STATUS sin conteo; con un conteo correcto presente, un segundo falso pasa y la regresión falla. Validar todas las ocurrencias con negativo. Observación E-O3 de T-004; STATUS evita hoy ese patrón opcional.

## Hechas recientes
- [T-003](tasks/T-003-initializer-beta.md): D y template beta, PR#4 MERGED.
- [T-002](tasks/T-002-reference-security.md): C, PR#3 MERGED.
- [T-001](tasks/T-001-local-stack.md): B, PR#2 MERGED.
- [T-000](tasks/T-000-starter-extraction.md): A, PR#1 MERGED.
