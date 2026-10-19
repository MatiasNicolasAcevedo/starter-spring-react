import { act, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../services/http'
import { renderWithProviders } from '../../test/render'
import { ReferenceItemForm } from './ReferenceItemForm'

describe('ReferenceItemForm', () => {
  it('validates exact client limits at fields with focus before requesting', async () => {
    const submit = vi.fn()
    const { user } = renderWithProviders(
      <ReferenceItemForm submit={submit} cancel={() => {}} disabled={false} />,
    )
    const title = screen.getByRole('textbox', { name: /Título/ })
    await user.click(title)
    await user.paste('x'.repeat(121))
    await user.click(screen.getByRole('textbox', { name: 'Descripción' }))
    await user.paste('x'.repeat(2001))
    await user.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(title).toHaveAccessibleDescription('Usá hasta 120 caracteres.')
    expect(title).toHaveFocus()
    expect(screen.getByRole('textbox', { name: 'Descripción' })).toHaveAccessibleDescription(
      'Usá hasta 2000 caracteres.',
    )
    expect(submit).not.toHaveBeenCalled()
  })
  it('blocks double submission and exposes server and general errors without claiming success', async () => {
    let reject!: (reason: unknown) => void
    const request = new Promise<void>((_, fail) => {
      reject = fail
    })
    const submit = vi.fn(() => request)
    const { user } = renderWithProviders(
      <ReferenceItemForm submit={submit} cancel={() => {}} disabled={false} />,
    )
    await user.type(screen.getByRole('textbox', { name: /Título/ }), 'Título')
    await user.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(screen.getByRole('button', { name: 'Guardando…' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Volver al listado' })).toBeDisabled()
    await act(async () => {
      reject(new ApiError(500, { detail: 'Internal private detail' }))
    })
    expect(await screen.findByRole('alert')).toHaveTextContent('El servidor no está disponible')
    expect(screen.getByRole('alert')).not.toHaveTextContent('Internal private detail')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Guardar' })).toBeEnabled())
    expect(submit).toHaveBeenCalledTimes(1)
  })
})
