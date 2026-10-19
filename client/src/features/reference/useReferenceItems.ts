import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authQueryKeys, renewCsrf, withCsrfRenewal, type AuthUser } from '../auth/api'
import { useSession } from '../auth/sessionContext'
import {
  deleteReferenceItem,
  fetchReferenceItem,
  fetchReferenceItems,
  saveReferenceItem,
  type ReferenceInput,
} from './api'

export const referenceKeys = {
  owner: (owner: string) => ['reference', owner] as const,
  list: (owner: string, page: number) => ['reference', owner, 'list', page, 20] as const,
  item: (owner: string, id: string) => ['reference', owner, 'item', id] as const,
}

export function useReferenceItems(owner: string, page: number) {
  const { status, user } = useSession()
  const client = useQueryClient()
  return useQuery({
    queryKey: referenceKeys.list(owner, page),
    queryFn: ({ signal }) =>
      fetchReferenceItems(page, 20, {
        signal,
        sessionIsCurrent: () =>
          client.getQueryData<AuthUser | null>(authQueryKeys.session)?.id === owner,
      }),
    enabled: status === 'authenticated' && user?.id === owner,
    retry: false,
  })
}

export function useReferenceItem(owner: string, id: string) {
  const { status, user } = useSession()
  const client = useQueryClient()
  return useQuery({
    queryKey: referenceKeys.item(owner, id),
    queryFn: ({ signal }) =>
      fetchReferenceItem(id, {
        signal,
        sessionIsCurrent: () =>
          client.getQueryData<AuthUser | null>(authQueryKeys.session)?.id === owner,
      }),
    enabled: status === 'authenticated' && user?.id === owner,
    retry: false,
    staleTime: 0,
  })
}

/** Completion is scoped to the initiating identity. Clearing MutationCache does not cancel this request. */
export function useReferenceMutations(owner: string) {
  const client = useQueryClient()
  const isCurrent = () => client.getQueryData<AuthUser | null>(authQueryKeys.session)?.id === owner
  const renewIfCurrent = () => (isCurrent() ? renewCsrf() : Promise.resolve())
  const invalidate = () => {
    if (isCurrent()) return client.invalidateQueries({ queryKey: referenceKeys.owner(owner) })
  }
  const save = useMutation({
    mutationFn: ({ input, id }: { input: ReferenceInput; id?: string }) =>
      withCsrfRenewal(
        () => saveReferenceItem(input, id, { sessionIsCurrent: isCurrent }),
        renewIfCurrent,
      ),
    onSuccess: invalidate,
    retry: false,
  })
  const remove = useMutation({
    mutationFn: (id: string) =>
      withCsrfRenewal(
        () => deleteReferenceItem(id, { sessionIsCurrent: isCurrent }),
        renewIfCurrent,
      ),
    onSuccess: invalidate,
    retry: false,
  })
  return { save, remove, isCurrent }
}
