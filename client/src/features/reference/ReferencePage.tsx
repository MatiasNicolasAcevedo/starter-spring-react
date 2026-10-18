import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useEffect, useRef, useState } from 'react'
import { Link as RouterLink } from 'react-router'
import { ApiError } from '../../services/http'
import { ErrorAlert } from '../../shared/ui/ErrorAlert'
import { useSession } from '../auth/sessionContext'
import { ReferenceItemForm } from './ReferenceItemForm'
import { type ReferenceInput, type ReferenceItem } from './api'
import { useReferenceItem, useReferenceItems, useReferenceMutations } from './useReferenceItems'

export function ReferencePage() {
  const session = useSession()
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography component="h1" variant="h4">
          Referencia
        </Typography>
        <Typography color="text.secondary">
          Tu lista privada de elementos. Cada persona ve y modifica solo los suyos.
        </Typography>
      </Stack>
      {session.status === 'authenticated' && session.user ? (
        <PrivateReference owner={session.user.id} />
      ) : session.status === 'visitor' ? (
        <Alert severity="info">
          Ingresá para consultar tus elementos.{' '}
          <Link component={RouterLink} to="/login">
            Iniciar sesión
          </Link>
        </Alert>
      ) : session.status === 'loading' ? (
        <Typography role="status">Verificando sesión…</Typography>
      ) : (
        <ErrorAlert error={session.sessionError} onRetry={session.retrySession} />
      )}
    </Stack>
  )
}

function EditItem({
  owner,
  id,
  submit,
  cancel,
  disabled,
}: {
  owner: string
  id: string
  submit: (input: ReferenceInput) => Promise<void>
  cancel: () => void
  disabled: boolean
}) {
  const item = useReferenceItem(owner, id)
  if (item.isPending) return <Typography role="status">Cargando elemento…</Typography>
  if (item.error)
    return (
      <Stack spacing={2}>
        {item.error instanceof ApiError && item.error.status === 404 ? (
          <Alert severity="error">El elemento ya no está disponible.</Alert>
        ) : (
          <ErrorAlert error={item.error} onRetry={() => void item.refetch()} />
        )}
        <Button onClick={cancel}>Volver al listado</Button>
      </Stack>
    )
  return <ReferenceItemForm item={item.data} submit={submit} cancel={cancel} disabled={disabled} />
}

function PrivateReference({ owner }: { owner: string }) {
  const session = useSession()
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<ReferenceItem | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const createButton = useRef<HTMLButtonElement>(null)
  const lastAction = useRef<HTMLButtonElement | null>(null)
  const returnFocus = useRef(false)
  const deleteReturnFocus = useRef(false)
  const list = useReferenceItems(owner, page)
  const { save, remove, isCurrent } = useReferenceMutations(owner)
  const busy = save.isPending || remove.isPending
  const disabled = !session.csrfReady || session.logoutPending || busy
  useEffect(() => {
    if (!creating && editing === null && returnFocus.current) {
      const target = lastAction.current?.isConnected ? lastAction.current : createButton.current
      target?.focus()
      returnFocus.current = false
    }
  }, [creating, editing])
  const close = () => {
    returnFocus.current = true
    setCreating(false)
    setEditing(null)
    save.reset()
    void list.refetch()
  }
  const submit = async (input: ReferenceInput) => {
    try {
      await save.mutateAsync({ input, id: editing ?? undefined })
      if (!isCurrent()) return
      returnFocus.current = true
      setCreating(false)
      setEditing(null)
      setSuccess('Elemento guardado.')
      save.reset()
    } catch (failure) {
      if (isCurrent()) throw failure
    }
  }
  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await remove.mutateAsync(deleting.id)
      if (!isCurrent()) return
      if (list.data?.content.length === 1 && page > 0) setPage(page - 1)
      deleteReturnFocus.current = true
      lastAction.current = null
      setDeleting(null)
      setSuccess('Elemento eliminado.')
      remove.reset()
    } catch {
      /* Mutation error remains visible; success requires the server response. */
    }
  }
  const closeDelete = () => {
    deleteReturnFocus.current = true
    setDeleting(null)
    remove.reset()
    void list.refetch()
  }
  return (
    <Stack spacing={2}>
      {success ? (
        <Alert severity="success" role="status">
          {success}
        </Alert>
      ) : null}
      <Button
        ref={createButton}
        variant="contained"
        onClick={(event) => {
          lastAction.current = event.currentTarget
          setSuccess(null)
          setCreating(true)
        }}
        disabled={disabled || creating || editing !== null}
        sx={{ alignSelf: 'flex-start' }}
      >
        Crear elemento
      </Button>
      {creating || editing !== null ? (
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography component="h2" variant="h6">
                {editing ? 'Editar elemento' : 'Crear elemento'}
              </Typography>
              {editing ? (
                <EditItem
                  key={editing}
                  owner={owner}
                  id={editing}
                  submit={submit}
                  cancel={close}
                  disabled={disabled}
                />
              ) : (
                <ReferenceItemForm
                  key="create"
                  submit={submit}
                  cancel={close}
                  disabled={disabled}
                />
              )}
            </Stack>
          </CardContent>
        </Card>
      ) : null}
      {list.isPending ? (
        <Typography role="status">Cargando elementos…</Typography>
      ) : list.error ? (
        <ErrorAlert error={list.error} onRetry={() => void list.refetch()} />
      ) : (
        <>
          {list.data.content.length === 0 ? (
            <Typography>No tenés elementos en esta página.</Typography>
          ) : (
            <Stack component="ul" spacing={2} sx={{ p: 0, listStyle: 'none' }}>
              {list.data.content.map((item) => (
                <Card component="li" variant="outlined" key={item.id}>
                  <CardContent>
                    <Stack spacing={1} sx={{ overflowWrap: 'anywhere' }}>
                      <Typography component="h2" variant="h6">
                        {item.title}
                      </Typography>
                      <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                        {item.description || 'Sin descripción.'}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                        <Button
                          aria-label={`Editar ${item.title}`}
                          disabled={disabled || creating || editing !== null}
                          onClick={(event) => {
                            lastAction.current = event.currentTarget
                            setSuccess(null)
                            setEditing(item.id)
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          color="error"
                          aria-label={`Eliminar ${item.title}`}
                          disabled={disabled}
                          onClick={(event) => {
                            lastAction.current = event.currentTarget
                            setSuccess(null)
                            remove.reset()
                            setDeleting(item)
                          }}
                        >
                          Eliminar
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
          <Typography role="status">
            Página {page + 1} de {Math.max(1, list.data.totalPages)} · {list.data.totalElements}{' '}
            elementos
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              disabled={page === 0 || list.isFetching || busy}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
            <Button
              disabled={page + 1 >= list.data.totalPages || list.isFetching || busy}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </Button>
          </Stack>
        </>
      )}
      <Dialog
        open={deleting !== null}
        onClose={() => {
          if (!remove.isPending) closeDelete()
        }}
        disableRestoreFocus
        slotProps={{
          transition: {
            onExited: () => {
              if (deleteReturnFocus.current) {
                const target = lastAction.current?.isConnected
                  ? lastAction.current
                  : createButton.current
                target?.focus()
                deleteReturnFocus.current = false
              }
            },
          },
        }}
        aria-labelledby="reference-delete-title"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="reference-delete-title">Eliminar elemento</DialogTitle>
        <DialogContent>
          <Typography>¿Querés eliminar «{deleting?.title}»?</Typography>
          {remove.error instanceof ApiError && remove.error.status === 404 ? (
            <Alert severity="error">El elemento ya no está disponible. Volvé al listado.</Alert>
          ) : remove.error ? (
            <ErrorAlert error={remove.error} />
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button autoFocus disabled={remove.isPending} onClick={closeDelete}>
            Volver al listado
          </Button>
          <Button color="error" disabled={disabled} onClick={() => void confirmDelete()}>
            {remove.isPending ? 'Eliminando…' : 'Confirmar eliminación'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
