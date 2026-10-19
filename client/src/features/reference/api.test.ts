import { HttpResponse, http as mock } from 'msw'
import { describe, expect, it } from 'vitest'
import { UnexpectedResponseError } from '../../services/http'
import { referenceItem } from '../../test/msw/referenceBackend'
import { server } from '../../test/msw/server'
import {
  REFERENCE_PATH,
  deleteReferenceItem,
  fetchReferenceItem,
  fetchReferenceItems,
  referenceInputSchema,
  saveReferenceItem,
} from './api'

describe('reference API', () => {
  it('validates shared trim and exact limits, permits duplicates and requires description string', () => {
    expect(
      referenceInputSchema.parse({ title: ' \u00a0x\ufeff ', description: ' texto ' }),
    ).toEqual({ title: 'x', description: 'texto' })
    expect(
      referenceInputSchema.safeParse({ title: 'x'.repeat(120), description: 'x'.repeat(2000) })
        .success,
    ).toBe(true)
    for (const input of [
      { title: ' ', description: '' },
      { title: 'x'.repeat(121), description: '' },
      { title: 'x', description: 'x'.repeat(2001) },
      { title: 'x' },
      { title: 'x', description: null },
      { title: 'x', description: '', owner: 'injected' },
    ])
      expect(referenceInputSchema.safeParse(input).success).toBe(false)
  })
  it('uses five exact operations and schemas without retaining unknown owner attributes', async () => {
    const seen: Array<{ method: string; body: unknown }> = []
    const item = referenceItem()
    server.use(
      mock.get(REFERENCE_PATH, () =>
        HttpResponse.json({ content: [item], page: 1, size: 20, totalElements: 21, totalPages: 2 }),
      ),
      mock.get(`${REFERENCE_PATH}/${item.id}`, () =>
        HttpResponse.json({ ...item, owner: 'discarded' }),
      ),
      mock.post(REFERENCE_PATH, async ({ request }) => {
        seen.push({ method: request.method, body: await request.json() })
        return HttpResponse.json(item, { status: 201 })
      }),
      mock.put(`${REFERENCE_PATH}/${item.id}`, async ({ request }) => {
        seen.push({ method: request.method, body: await request.json() })
        return HttpResponse.json(item)
      }),
      mock.delete(`${REFERENCE_PATH}/${item.id}`, ({ request }) => {
        seen.push({ method: request.method, body: null })
        return new HttpResponse(null, { status: 204 })
      }),
    )
    expect((await fetchReferenceItems(1)).totalElements).toBe(21)
    expect(await fetchReferenceItem(item.id)).toEqual(item)
    await saveReferenceItem({ title: ' título ', description: ' ' })
    await saveReferenceItem({ title: ' título ', description: '' }, item.id)
    await deleteReferenceItem(item.id)
    expect(seen).toEqual([
      { method: 'POST', body: { title: 'título', description: '' } },
      { method: 'PUT', body: { title: 'título', description: '' } },
      { method: 'DELETE', body: null },
    ])
  })
  it('rejects invalid response identifiers, dates, pagination and bounds', async () => {
    const item = referenceItem()
    for (const invalid of [
      { ...item, id: 'bad' },
      { ...item, title: ' invalid ' },
      { ...item, description: 'x'.repeat(2001) },
      { ...item, createdAt: 'today' },
    ]) {
      server.use(mock.get(`${REFERENCE_PATH}/${item.id}`, () => HttpResponse.json(invalid)))
      await expect(fetchReferenceItem(item.id)).rejects.toBeInstanceOf(UnexpectedResponseError)
    }
    for (const invalid of [
      { content: [], page: -1, size: 20, totalElements: 0, totalPages: 0 },
      { content: [], page: 0, size: 101, totalElements: 0, totalPages: 0 },
      { content: [], page: 0, size: 20, totalElements: 5, totalPages: 0 },
      { content: [item, item], page: 0, size: 1, totalElements: 2, totalPages: 2 },
    ]) {
      server.use(mock.get(REFERENCE_PATH, () => HttpResponse.json(invalid)))
      await expect(fetchReferenceItems(0)).rejects.toBeInstanceOf(UnexpectedResponseError)
    }
  })
})
