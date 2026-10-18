import { test, expect, control, layout } from './fixtures';

test.describe.configure({ timeout: 90_000 });

test('real database outage removes cached success and recovers on the open page within 30 seconds', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('API y base de datos disponibles', { exact: true })).toBeVisible();
  await layout(page);
  try {
    const stoppedAt = Date.now();
    await control('stop-db');
    const error = page.getByRole('alert').filter({ hasText: 'No se pudo obtener el estado del servidor' });
    await expect(error).toBeVisible({ timeout: 30_000 });
    expect(Date.now() - stoppedAt).toBeLessThan(30_000);
    await expect(page.getByText('Servidor conectado', { exact: true })).toHaveCount(0);
    const health = await page.request.get('/actuator/health/readiness', { timeout: 5000 });
    expect(health.status()).toBe(503);
    expect(await health.json()).toEqual({ status: 'DOWN' });
    expect((await page.request.get('/api/v1/system/info')).status()).toBe(200);
    await layout(page);
    const restartedAt = Date.now();
    await control('start-db');
    await expect(page.getByText('API y base de datos disponibles', { exact: true })).toBeVisible({ timeout: 30_000 });
    expect(Date.now() - restartedAt).toBeLessThan(30_000);
    await expect(error).toHaveCount(0);
    const recovered = await page.request.get('/actuator/health/readiness', { timeout: 5000 });
    expect(recovered.status()).toBe(200);
    expect(await recovered.json()).toEqual({ status: 'UP' });
    await layout(page);
  } finally {
    await control('start-db');
  }
});
