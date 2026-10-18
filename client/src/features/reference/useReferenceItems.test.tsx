import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { buildAuthUser } from '../../test/factories'
import { installAuthBackend } from '../../test/msw/authBackend'
import { installReferenceBackend } from '../../test/msw/referenceBackend'
import { renderWithProviders } from '../../test/render'
import { AuthSessionProvider } from '../auth/AuthSessionProvider'
import { authQueryKeys } from '../auth/api'
import { useSession } from '../auth/sessionContext'
import { referenceKeys, useReferenceItem, useReferenceItems } from './useReferenceItems'

function Probe({ owner }: { owner: string }) {
  const session = useSession()
  const list = useReferenceItems(owner, 0)
  useReferenceItem(owner, '01900000-0000-7000-8000-000000000101')
  return (
    <p>
      {session.status}:{list.fetchStatus}
    </p>
  )
}
describe('reference queries', () => {
  it.each([null, buildAuthUser()])(
    'never queries before confirmation or for another owner (%s)',
    async (user) => {
      const auth = installAuthBackend({ user })
      const backend = installReferenceBackend(auth)
      const { queryClient } = renderWithProviders(
        <AuthSessionProvider>
          <Probe owner="01900000-0000-7000-8000-000000000099" />
        </AuthSessionProvider>,
      )
      await waitFor(() => expect(queryClient.getQueryData(authQueryKeys.session)).toEqual(user))
      expect(await screen.findByText(`${user ? 'authenticated' : 'visitor'}:idle`)).toBeVisible()
      expect(backend.calls.get).toBe(0)
      expect(backend.calls.list.size).toBe(0)
      expect(referenceKeys.list('a', 0)).not.toEqual(referenceKeys.list('b', 0))
      expect(referenceKeys.list('a', 0)).not.toEqual(referenceKeys.list('a', 1))
    },
  )
})
