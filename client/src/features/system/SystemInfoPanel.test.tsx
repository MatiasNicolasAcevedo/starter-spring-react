import projectIdentity from '../../project-identity.json'
import { act, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { buildSystemInfo } from '../../test/factories'
import { server } from '../../test/msw/server'
import { renderWithProviders } from '../../test/render'
import { SystemInfoPanel } from './SystemInfoPanel'

const INFO = '/api/v1/system/info'
const READY = '/actuator/health/readiness'
const READY_KEY = ['system', 'readiness'] as const

describe('SystemInfoPanel (T1-02)', () => {
  it('muestra nombre y versión obtenidos del backend', async () => {
    server.use(http.get(INFO, () => HttpResponse.json(buildSystemInfo({ version: '9.8.7' }))))

    renderWithProviders(<SystemInfoPanel />)

    expect(screen.getByRole('status')).toHaveTextContent('Consultando el servidor…')
    expect(await screen.findByText(`${projectIdentity.name} · versión 9.8.7`)).toBeInTheDocument()
    expect(screen.getByText('Servidor conectado')).toBeInTheDocument()
  })

  it.each([502, 504])('con el proxy en %i muestra error y permite reintentar', async (status) => {
    server.use(
      http.get(INFO, () => new HttpResponse('Upstream unavailable', { status }), { once: true }),
    )

    const { user } = renderWithProviders(<SystemInfoPanel />)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('No se pudo obtener el estado del servidor')
    expect(alert).toHaveTextContent('El servidor no está disponible en este momento')
    expect(screen.queryByText(/versión/)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(
      await screen.findByText(`${projectIdentity.name} · versión 0.0.1-TEST`),
    ).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('sin red muestra el error de conexión y «Reintentar» recupera el dato', async () => {
    server.use(http.get(INFO, () => HttpResponse.error(), { once: true }))

    const { user } = renderWithProviders(<SystemInfoPanel />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudo conectar con el servidor',
    )
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(
      await screen.findByText(`${projectIdentity.name} · versión 0.0.1-TEST`),
    ).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('SystemInfoPanel readiness', () => {
  it('espera readiness antes de declarar API/DB disponibles', async () => {
    let release = () => {}
    const held = new Promise<void>((resolve) => {
      release = resolve
    })
    let requested = false
    server.use(
      http.get(READY, async () => {
        requested = true
        await held
        return HttpResponse.json({ status: 'UP' })
      }),
    )
    renderWithProviders(<SystemInfoPanel />)
    try {
      await waitFor(() => expect(requested).toBe(true))
      expect(screen.getByRole('status')).toHaveTextContent('Consultando el servidor…')
      expect(screen.queryByText('Servidor conectado')).not.toBeInTheDocument()
    } finally {
      release()
    }
    expect(await screen.findByText('Servidor conectado')).toBeVisible()
    expect(screen.getByText('API y base de datos disponibles')).toBeVisible()
  })

  it.each(['503', 'HTML', 'JSON inválido', 'DOWN', 'componentes'])(
    'rechaza readiness %s sin éxito engañoso',
    async (kind) => {
      let calls = 0
      server.use(
        http.get(READY, () => {
          calls++
          if (kind === '503') return HttpResponse.json({ status: 'DOWN' }, { status: 503 })
          if (kind === 'HTML') return HttpResponse.html('<html>SPA</html>')
          if (kind === 'JSON inválido')
            return new HttpResponse('{', { headers: { 'Content-Type': 'application/json' } })
          return HttpResponse.json(
            kind === 'DOWN' ? { status: 'DOWN' } : { status: 'UP', components: { db: {} } },
          )
        }),
      )
      renderWithProviders(<SystemInfoPanel />)
      expect(await screen.findByRole('alert')).toHaveTextContent(
        'No se pudo obtener el estado del servidor',
      )
      expect(screen.queryByText('Servidor conectado')).not.toBeInTheDocument()
      expect(screen.queryByText(/versión/)).not.toBeInTheDocument()
      expect(calls).toBe(1)
    },
  )

  it('retira el UP anterior tras 503 y recupera sin retener éxito de cache', async () => {
    let available = true
    server.use(
      http.get(READY, () =>
        HttpResponse.json({ status: available ? 'UP' : 'DOWN' }, { status: available ? 200 : 503 }),
      ),
    )
    const { queryClient } = renderWithProviders(<SystemInfoPanel />)
    expect(await screen.findByText('Servidor conectado')).toBeVisible()
    available = false
    await act(() => queryClient.invalidateQueries({ queryKey: READY_KEY }))
    expect(await screen.findByRole('alert')).toBeVisible()
    expect(screen.queryByText('Servidor conectado')).not.toBeInTheDocument()
    available = true
    await act(() => queryClient.invalidateQueries({ queryKey: READY_KEY }))
    expect(await screen.findByText('Servidor conectado')).toBeVisible()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('permite reintento por teclado y recupera API/DB', async () => {
    server.use(
      http.get(READY, () => HttpResponse.json({ status: 'DOWN' }, { status: 503 }), { once: true }),
    )
    const { user } = renderWithProviders(<SystemInfoPanel />)
    await screen.findByRole('alert')
    const retry = screen.getByRole('button', { name: 'Reintentar' })
    await user.tab()
    expect(retry).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(await screen.findByText('API y base de datos disponibles')).toBeVisible()
  })

  it('revalida cada 5 s y detecta caída con la página abierta', async () => {
    let available = true
    server.use(
      http.get(READY, () =>
        HttpResponse.json({ status: available ? 'UP' : 'DOWN' }, { status: available ? 200 : 503 }),
      ),
    )
    renderWithProviders(<SystemInfoPanel />)
    expect(await screen.findByText('Servidor conectado')).toBeVisible()
    available = false
    await waitFor(() => expect(screen.getByRole('alert')).toBeVisible(), { timeout: 6500 })
    expect(screen.queryByText('Servidor conectado')).not.toBeInTheDocument()
  }, 10_000)
})
