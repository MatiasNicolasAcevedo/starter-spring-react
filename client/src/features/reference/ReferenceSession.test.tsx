import { act, screen, waitFor } from '@testing-library/react'
import { HttpResponse, http as mock } from 'msw'
import { describe, expect, it, vi } from 'vitest'
import { AppRoutes } from '../../app/AppRoutes'
import { buildAuthUser, problemResponse } from '../../test/factories'
import { installAuthBackend } from '../../test/msw/authBackend'
import { installReferenceBackend, referenceItem } from '../../test/msw/referenceBackend'
import { server } from '../../test/msw/server'
import { renderWithProviders } from '../../test/render'
import { authQueryKeys } from '../auth/api'
import * as api from './api'
import { referenceKeys } from './useReferenceItems'

const a = buildAuthUser({ id: '01900000-0000-7000-8000-00000000000a', displayName: 'Persona A' })
const b = buildAuthUser({ id: '01900000-0000-7000-8000-00000000000b', displayName: 'Persona B' })
function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

describe.each(['logout', 'expiry', 'switch'] as const)(
  'reference mutation in flight: %s',
  (transition) => {
    it.each(['success', '401', '403'] as const)(
      'late %s cannot repopulate A or expire/refetch/message B',
      async (outcome) => {
        const auth = installAuthBackend({ user: a })
        const backend = installReferenceBackend(auth, [
          { owner: a.id, item: referenceItem({ title: 'Privado de A' }) },
          {
            owner: b.id,
            item: referenceItem({
              id: '01900000-0000-7000-8000-000000000102',
              title: 'Privado de B',
            }),
          },
        ])
        const held = deferred(),
          entered = deferred(),
          settled = deferred()
        server.use(
          mock.post(api.REFERENCE_PATH, async () => {
            entered.resolve()
            await held.promise
            return outcome === 'success'
              ? HttpResponse.json(referenceItem({ title: 'Respuesta tardía de A' }), {
                  status: 201,
                })
              : problemResponse(Number(outcome))
          }),
        )
        const original = api.saveReferenceItem
        vi.spyOn(api, 'saveReferenceItem').mockImplementation(async (...args) => {
          try {
            return await original(...args)
          } finally {
            settled.resolve()
          }
        })
        const { user, queryClient } = renderWithProviders(<AppRoutes />, { route: '/reference' })
        await screen.findByRole('heading', { name: 'Privado de A' })
        await user.click(screen.getByRole('button', { name: 'Crear elemento' }))
        await user.type(screen.getByRole('textbox', { name: /Título/ }), 'Mutación A')
        await user.click(screen.getByRole('button', { name: 'Guardar' }))
        await entered.promise
        expect(screen.getByRole('button', { name: 'Guardando…' })).toBeDisabled()
        if (transition === 'logout') {
          await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
          await screen.findByRole('heading', { name: 'Ingresar a Starter' })
        } else if (transition === 'expiry') {
          auth.expireSession()
          await act(async () => {
            await queryClient.refetchQueries({ queryKey: authQueryKeys.session })
          })
          expect(await screen.findByText('La sesión terminó. Volvé a ingresar.')).toBeVisible()
        }
        auth.login(b)
        await act(async () => {
          await queryClient.refetchQueries({ queryKey: authQueryKeys.session })
        })
        if (transition === 'logout')
          await user.click(screen.getByRole('link', { name: 'Referencia' }))
        await screen.findByRole('heading', { name: 'Privado de B' })
        const bCalls = backend.calls.list.get(b.id)
        const csrfCalls = auth.calls.csrf
        expect(queryClient.getQueriesData({ queryKey: referenceKeys.owner(a.id) })).toEqual([])
        await act(async () => {
          held.resolve()
          await settled.promise
        })
        await waitFor(() =>
          expect(queryClient.getQueryData(authQueryKeys.session)).toMatchObject({ id: b.id }),
        )
        expect(queryClient.getQueriesData({ queryKey: referenceKeys.owner(a.id) })).toEqual([])
        expect(backend.calls.list.get(b.id)).toBe(bCalls)
        expect(auth.calls.csrf).toBe(csrfCalls)
        expect(screen.getByRole('heading', { name: 'Privado de B' })).toBeVisible()
        expect(screen.queryByText('Respuesta tardía de A')).not.toBeInTheDocument()
        expect(screen.queryByText('Elemento guardado.')).not.toBeInTheDocument()
        expect(
          screen.queryByText('La operación fue rechazada y no se aplicó. Volvé a intentarla.'),
        ).not.toBeInTheDocument()
        expect(screen.queryByText('La sesión terminó. Volvé a ingresar.')).not.toBeInTheDocument()
      },
    )
  },
)
