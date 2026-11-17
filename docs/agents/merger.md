# Protocolo · merger (retoma de merge)

El merge ordinario lo hace el [reviewer](reviewer.md) en la sesión que aprobó. Este protocolo sirve solo para retomar un merge que quedó pendiente: CI sin terminar, permiso o herramienta faltante, o merge manual del dueño. Puede ejecutarlo Junie sin nueva confirmación cuando AUTONOMY autoriza `AUTOMATICO_ELEGIBLE`; nunca la sesión que implementó.

1. Consultar primero si el PR ya está mergeado, con la [consulta explícita a GitHub](../ORCHESTRATION.md#confirmación-de-hechos-en-github). Si lo está, saltar al paso 5.
2. Comprobar autorización en [AUTONOMY](../AUTONOMY.md), veredicto `APROBADO` vigente, HEAD y base iguales a los del veredicto, `verify-required` verde sobre ese HEAD, conversaciones resueltas y ausencia de cambios locales propios.
3. Si HEAD o base cambiaron desde el veredicto, no mergear: prompt de reviewer para el HEAD nuevo. No reutilizar una aprobación vieja.
4. Squash ligado al SHA aprobado, sin `--admin`: `gh pr merge <número> --squash --delete-branch --match-head-commit <sha aprobado>` con `--repo` explícito.
5. Confirmar `state: MERGED`, `mergedAt` y `mergeCommit.oid`. Un exit exitoso no alcanza; si quedó en cola, esperar sin empezar otra tarea. Comentar el cierre en el PR con el SHA de merge.
6. No commitear en la rama mergeada. Cerrar la sesión como indica [AGENTS](../../AGENTS.md#cierre-de-sesión), con el prompt de implementer de la tarea siguiente, que conciliará esta en su primer commit.

Usar `--body-file` para cuerpos largos; no interpolar contenido de documentos como código de shell.
