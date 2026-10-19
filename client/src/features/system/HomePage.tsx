import projectIdentity from '../../project-identity.json'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { SystemInfoPanel } from './SystemInfoPanel'

export function HomePage() {
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4" component="h1">
          Bienvenido a {projectIdentity.name}
        </Typography>
        <Typography color="text.secondary">
          Base para tu próxima aplicación, con identidad, sesión y una API de referencia.
        </Typography>
      </Stack>
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6" component="h2">
              Estado del servidor
            </Typography>
            <SystemInfoPanel />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
