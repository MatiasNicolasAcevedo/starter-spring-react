import { z } from 'zod'
import { http, type RequestOptions } from '../../services/http'

export const REFERENCE_PATH = '/api/v1/reference-items'
export const referenceInputSchema = z.strictObject({
  title: z.string().trim().min(1, 'Ingresá un título.').max(120, 'Usá hasta 120 caracteres.'),
  description: z.string().trim().max(2000, 'Usá hasta 2000 caracteres.'),
})
export type ReferenceInput = z.infer<typeof referenceInputSchema>
export const referenceItemSchema = z.object({
  id: z.uuid(),
  title: z
    .string()
    .min(1)
    .max(120)
    .refine((value) => value === value.trim()),
  description: z
    .string()
    .max(2000)
    .refine((value) => value === value.trim()),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})
export type ReferenceItem = z.infer<typeof referenceItemSchema>
export const referencePageSchema = z
  .object({
    content: z.array(referenceItemSchema),
    page: z.number().int().nonnegative(),
    size: z.number().int().min(1).max(100),
    totalElements: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  })
  .refine(
    (page) =>
      page.content.length <= page.size &&
      page.totalPages === Math.ceil(page.totalElements / page.size),
  )
type Scope = Pick<RequestOptions, 'signal' | 'sessionIsCurrent'>

export function fetchReferenceItems(page: number, size = 20, scope: Scope = {}) {
  return http.request(`${REFERENCE_PATH}?page=${page}&size=${size}`, referencePageSchema, scope)
}
export function fetchReferenceItem(id: string, scope: Scope = {}) {
  return http.request(`${REFERENCE_PATH}/${encodeURIComponent(id)}`, referenceItemSchema, scope)
}
export function saveReferenceItem(input: ReferenceInput, id?: string, scope: Scope = {}) {
  return http.request(
    id === undefined ? REFERENCE_PATH : `${REFERENCE_PATH}/${encodeURIComponent(id)}`,
    referenceItemSchema,
    {
      ...scope,
      method: id === undefined ? 'POST' : 'PUT',
      body: referenceInputSchema.parse(input),
    },
  )
}
export function deleteReferenceItem(id: string, scope: Scope = {}) {
  return http.requestVoid(`${REFERENCE_PATH}/${encodeURIComponent(id)}`, {
    ...scope,
    method: 'DELETE',
  })
}
