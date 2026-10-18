import { useQuery } from '@tanstack/react-query'
import { fetchReadiness, systemQueryKeys } from './api'

export function useReadiness() {
  return useQuery({
    queryKey: systemQueryKeys.readiness,
    queryFn: ({ signal }) => fetchReadiness(signal),
    staleTime: 0,
    retry: false,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  })
}
