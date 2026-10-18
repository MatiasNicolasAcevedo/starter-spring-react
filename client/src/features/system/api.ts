import { z } from 'zod'
import { http } from '../../services/http'

/** Contrato de `GET /api/v1/system/info` (server: system/SystemInfoResponse). */
export const systemInfoSchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
})

export type SystemInfo = z.infer<typeof systemInfoSchema>
const readinessSchema = z.strictObject({ status: z.literal('UP') })

export const systemQueryKeys = {
  info: ['system', 'info'] as const,
  readiness: ['system', 'readiness'] as const,
}

export function fetchReadiness(signal?: AbortSignal) {
  const deadline = AbortSignal.timeout(5000)
  return http.request('/actuator/health/readiness', readinessSchema, {
    signal: signal ? AbortSignal.any([signal, deadline]) : deadline,
  })
}

export function fetchSystemInfo(signal?: AbortSignal): Promise<SystemInfo> {
  return http.request('/api/v1/system/info', systemInfoSchema, { signal })
}
