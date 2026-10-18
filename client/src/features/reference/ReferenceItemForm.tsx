import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ApiError } from '../../services/http'
import { FormTextField } from '../../shared/forms/FormTextField'
import { applyServerFieldErrors } from '../../shared/forms/applyServerFieldErrors'
import { ErrorAlert } from '../../shared/ui/ErrorAlert'
import { referenceInputSchema, type ReferenceInput, type ReferenceItem } from './api'

export function ReferenceItemForm({
  item,
  submit,
  cancel,
  disabled,
}: {
  item?: ReferenceItem
  submit: (input: ReferenceInput) => Promise<void>
  cancel: () => void
  disabled: boolean
}) {
  const [error, setErrorState] = useState<unknown>(null)
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ReferenceInput>({
    resolver: zodResolver(referenceInputSchema),
    defaultValues: { title: item?.title ?? '', description: item?.description ?? '' },
  })
  const save = handleSubmit(async (input) => {
    setErrorState(null)
    try {
      await submit(input)
    } catch (failure) {
      if (!applyServerFieldErrors(failure, setError, ['title', 'description']))
        setErrorState(failure)
    }
  })
  return (
    <Stack
      component="form"
      aria-label={item ? 'Editar elemento' : 'Crear elemento'}
      noValidate
      onSubmit={save}
      spacing={2}
    >
      {errors.root?.server ? <Alert severity="error">{errors.root.server.message}</Alert> : null}
      {error instanceof ApiError && error.status === 404 ? (
        <Alert severity="error">El elemento ya no está disponible. Volvé al listado.</Alert>
      ) : error ? (
        <ErrorAlert error={error} />
      ) : null}
      <FormTextField
        control={control}
        name="title"
        label="Título"
        required
        autoFocus
        disabled={disabled && !isSubmitting}
        slotProps={{ input: { readOnly: isSubmitting } }}
      />
      <FormTextField
        control={control}
        name="description"
        label="Descripción"
        multiline
        minRows={3}
        disabled={disabled && !isSubmitting}
        slotProps={{ input: { readOnly: isSubmitting } }}
      />
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
        <Button type="submit" variant="contained" disabled={disabled || isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Guardar'}
        </Button>
        <Button type="button" onClick={cancel} disabled={isSubmitting}>
          Volver al listado
        </Button>
      </Stack>
    </Stack>
  )
}
