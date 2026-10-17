import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { ErrorAlert } from '../../shared/ui/ErrorAlert'
import { useSystemInfo } from './useSystemInfo'
import { useReadiness } from './useReadiness'

/** Estado de la conexión con el server: el dato mostrado proviene siempre de la API, nunca del bundle. */
export function SystemInfoPanel() {
  const info = useSystemInfo()
  const readiness = useReadiness()

  if (info.isError || readiness.isError) {
    return (
      <ErrorAlert
        error={info.error ?? readiness.error}
        title="No se pudo obtener el estado del servidor"
        retryDisabled={info.isFetching || readiness.isFetching}
        onRetry={() => {
          void info.refetch()
          void readiness.refetch()
        }}
      />
    )
  }

  if (info.isPending || readiness.isPending) {
    return (
      <Stack direction="row" spacing={1.5} role="status" sx={{ alignItems: 'center' }}>
        <CircularProgress size={20} aria-hidden />
        <Typography>Consultando el servidor…</Typography>
      </Stack>
    )
  }

  return (
    <Stack
      direction="row"
      spacing={1.5}
      useFlexGap
      role="status"
      sx={{ alignItems: 'center', flexWrap: 'wrap' }}
    >
      <Chip label="Servidor conectado" color="success" size="small" />
      <Typography>API y base de datos disponibles</Typography>
      <Typography>
        {info.data.name} · versión {info.data.version}
      </Typography>
    </Stack>
  )
}
