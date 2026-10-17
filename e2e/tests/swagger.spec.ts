import type { Locator, Page } from '@playwright/test';
import { test, expect } from './fixtures';

// ADR 0003 smoke: Swagger UI enabled only by docker-compose.e2e.yml, through the public origin of the isolated stack.
// Desktop 1280 only (selected in playwright.config.ts). Real backend: no route interception or fabricated responses.
test('Swagger UI loads the served document and runs only real same-origin GET calls', async ({ page }) => {
  const foreign: string[] = [];
  page.on('request', request => {
    const origin = new URL(request.url()).origin;
    if (origin !== 'http://localhost') foreign.push(origin);
  });
  const config = page.waitForResponse(response => new URL(response.url()).pathname === '/api/docs/openapi/swagger-config');
  const served = page.waitForResponse(response => new URL(response.url()).pathname === '/api/docs/openapi');
  const asset = page.waitForResponse(response => new URL(response.url()).pathname === '/api/docs/swagger-ui/swagger-ui-bundle.js');
  const index = await page.goto('/api/docs/swagger-ui.html');
  expect(index?.status()).toBe(200);
  expect(index?.headers()['content-type']).toContain('text/html');
  await expect(page).toHaveURL('http://localhost/api/docs/swagger-ui/index.html');
  const configuration = await config;
  expect(configuration.status()).toBe(200);
  expect(configuration.headers()['content-type']).toContain('application/json');
  const options = await configuration.json();
  expect(options.url).toBe('/api/docs/openapi');
  expect(options.supportedSubmitMethods).toEqual(['get']);
  expect(options.persistAuthorization).toBe(false);
  const resource = await asset;
  expect(resource.status()).toBe(200);
  expect(resource.headers()['content-type']).toMatch(/javascript/);
  expect(await resource.text()).toContain('SwaggerUIBundle');
  const document = await served;
  expect(document.status()).toBe(200);
  expect(document.headers()['content-type']).toContain('application/json');
  expect((await document.json()).servers).toEqual([{ url: 'http://localhost' }]);
  await expect(page.locator('.servers select option')).toHaveText(['http://localhost']);

  const real = await (await page.request.get('/api/v1/system/info')).json();
  expect(real.name).toBe('Starter');
  const system = operation(page, 'get', '/api/v1/system/info');
  const info = await execute(page, system, '/api/v1/system/info');
  expect(info.status()).toBe(200);
  expect(await info.json()).toEqual(real);
  await expect(system.locator('.live-responses-table tbody .response-col_status')).toHaveText('200');
  // Directed red assay changes only this expected UI result, never the server response.
  await expect(system.locator('.live-responses-table tbody .highlight-code')).toContainText(
    process.env.E2E_ASSERT_FAILURE === 'swagger' ? 'INDUCED_WRONG_SWAGGER_DATA' : `"version": "${real.version}"`);

  const me = operation(page, 'get', '/api/v1/auth/me');
  const anonymous = await execute(page, me, '/api/v1/auth/me');
  expect(anonymous.status()).toBe(401);
  expect(anonymous.headers()['content-type']).toContain('application/problem+json');
  expect((await anonymous.json()).status).toBe(401);
  await expect(me.locator('.live-responses-table tbody .response-col_status')).toHaveText('401');

  // supported-submit-methods [get]: the documented POST /logout cannot be sent from the UI.
  const logout = operation(page, 'post', '/logout');
  await logout.locator('.opblock-summary-control').click();
  await expect(logout.locator('.opblock-body')).toBeVisible();
  await expect(logout.getByRole('button', { name: 'Try it out' })).toHaveCount(0);
  await expect(logout.getByRole('button', { name: 'Execute' })).toHaveCount(0);

  expect(foreign, 'Swagger UI and its calls stay on the public origin').toEqual([]);
});

function operation(page: Page, method: 'get' | 'post', path: string) {
  return page.locator(`.opblock-${method}`).filter({ has: page.locator(`.opblock-summary-path[data-path="${path}"]`) });
}

async function execute(page: Page, target: Locator, path: string) {
  await target.locator('.opblock-summary-control').click();
  await target.getByRole('button', { name: 'Try it out' }).click();
  const call = page.waitForResponse(response =>
    new URL(response.url()).pathname === path && response.request().method() === 'GET');
  await target.getByRole('button', { name: 'Execute' }).click();
  return call;
}
