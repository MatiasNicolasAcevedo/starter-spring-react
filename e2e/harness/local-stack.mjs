// Browser in a container, with a byte-for-byte TCP tunnel to the proxy. No intercepted API or synthetic responses.
import assert from 'node:assert/strict';
import net from 'node:net';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { chromium, expect } from '@playwright/test';

const origin = process.env.APP_PUBLIC_URL;
const proxy = process.env.STARTER_LOCAL_PROXY;
const action = process.argv[2] ?? 'login';
const state = '/artifacts/local-session.json'; // Raw local only: never export cookies or traces.
const identity = '/artifacts/identity.json'; // Narrow, fictitious database identifier only.
async function swagger(page) {
  const foreign = [];
  page.on('request', request => { if (new URL(request.url()).origin !== origin) foreign.push(1); });
  const configuration = page.waitForResponse(response => new URL(response.url()).pathname === '/api/docs/openapi/swagger-config');
  const document = page.waitForResponse(response => new URL(response.url()).pathname === '/api/docs/openapi');
  const asset = page.waitForResponse(response => new URL(response.url()).pathname === '/api/docs/swagger-ui/swagger-ui-bundle.js');
  const index = await page.goto('/api/docs/swagger-ui.html');
  assert.equal(index.status(), 200);
  assert.ok(index.headers()['content-type'].includes('text/html'));
  await expect(page).toHaveURL(`${origin}/api/docs/swagger-ui/index.html`);
  const config = await configuration;
  assert.equal(config.status(), 200);
  assert.ok(config.headers()['content-type'].includes('application/json'));
  const options = await config.json();
  assert.equal(options.url, '/api/docs/openapi');
  assert.deepEqual(options.supportedSubmitMethods, ['get']);
  assert.equal(options.persistAuthorization, false);
  const served = await document;
  assert.equal(served.status(), 200);
  assert.ok(served.headers()['content-type'].includes('application/json'));
  assert.deepEqual((await served.json()).servers, [{ url: origin }]);
  const resource = await asset;
  assert.equal(resource.status(), 200);
  assert.ok(resource.headers()['content-type'].includes('javascript'));
  assert.ok((await resource.text()).includes('SwaggerUIBundle'));
  const real = await (await page.request.get('/api/v1/system/info')).json();
  for (const [path, status] of [['/api/v1/system/info', 200], ['/api/v1/auth/me', 401]]) {
    const operation = page.locator('.opblock-get').filter({ has: page.locator(`.opblock-summary-path[data-path="${path}"]`) });
    await operation.locator('.opblock-summary-control').click();
    await operation.getByRole('button', { name: 'Try it out' }).click();
    const call = page.waitForResponse(response => new URL(response.url()).pathname === path && response.request().method() === 'GET');
    await operation.getByRole('button', { name: 'Execute' }).click();
    const result = await call;
    assert.equal(result.status(), status);
    await expect(operation.locator('.live-responses-table tbody .response-col_status')).toHaveText(String(status));
    if (status === 200) assert.deepEqual(await result.json(), real);
    else {
      assert.ok(result.headers()['content-type'].includes('application/problem+json'));
      assert.equal((await result.json()).status, 401);
    }
  }
  const logout = page.locator('.opblock-post').filter({ has: page.locator('.opblock-summary-path[data-path="/logout"]') });
  await logout.locator('.opblock-summary-control').click();
  await expect(logout.locator('.opblock-body')).toBeVisible();
  await expect(logout.getByRole('button', { name: 'Try it out' })).toHaveCount(0);
  await expect(logout.getByRole('button', { name: 'Execute' })).toHaveCount(0);
  assert.deepEqual(foreign, []);
}
const tunnels = new Set();
const tunnel = net.createServer(socket => {
  const upstream = net.connect({ host: proxy === 'vite' ? 'client-dev' : 'client', port: proxy === 'vite' ? 5173 : 80 });
  tunnels.add(socket); tunnels.add(upstream);
  socket.on('error', () => upstream.destroy()); upstream.on('error', () => socket.destroy());
  socket.on('close', () => { tunnels.delete(socket); upstream.destroy(); });
  upstream.on('close', () => { tunnels.delete(upstream); socket.destroy(); });
  socket.pipe(upstream); upstream.pipe(socket);
});
let browser;
let phase = 'start';
try {
  assert.ok(['nginx', 'vite'].includes(proxy));
  assert.equal(new URL(origin).hostname, '127.0.0.1');
  await new Promise((resolve, reject) => { tunnel.once('error', reject); tunnel.listen(Number(new URL(origin).port), '127.0.0.1', resolve); });
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL: origin, viewport: { width: 1280, height: 800 },
    ...(action !== 'swagger' && existsSync(state) ? { storageState: state } : {}) });
  const page = await context.newPage();
  if (action === 'swagger') {
    phase = 'swagger';
    await swagger(page);
    console.log(`Local browser ${proxy}: Swagger index/config/JSON/asset/Try it out/denials passed.`);
  } else {
  if (action === 'expired-login') {
    phase = 'expired-session';
    assert.equal((await context.request.get('/api/v1/auth/me')).status(), 401);
  }
  phase = 'login';
  await page.goto('/login');
  if (!(await context.request.get('/api/v1/auth/me')).ok()) {
    const target = page.getByRole('link', { name: 'Continuar con Google', exact: true });
    await expect(target).toBeVisible();
    await target.press('Enter');
  } else await page.goto('/');
  await expect(page.getByRole('button', { name: 'Cerrar sesión', exact: true })).toBeEnabled();
  const me = await context.request.get('/api/v1/auth/me');
  assert.equal(me.status(), 200);
  const user = await me.json();
  assert.match(user.id, /^[0-9a-f-]{36}$/);
  if (existsSync(identity)) assert.equal(user.id, JSON.parse(readFileSync(identity, 'utf8')).id);
  else writeFileSync(identity, JSON.stringify({ id: user.id }));
  phase = 'reload';
  await page.reload();
  await expect(page.getByRole('button', { name: 'Cerrar sesión', exact: true })).toBeEnabled();
  for (const width of [1280, 375]) {
    await page.setViewportSize({ width, height: 812 });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await expect(page.getByText('API y base de datos disponibles', { exact: true })).toBeVisible();
    await page.screenshot({ path: `/artifacts/safe-home-${width}.png` });
  }
  if (action === 'outage-1280' || action === 'outage-375') {
    phase = 'database-outage';
    await page.setViewportSize({ width: Number(action.split('-')[1]), height: 812 });
    const started = Date.now();
    writeFileSync('/artifacts/outage-ready', 'ready');
    const error = page.getByRole('alert').filter({ hasText: 'No se pudo obtener el estado del servidor' });
    await expect(error).toBeVisible({ timeout: 30_000 });
    assert.ok(Date.now() - started < 30_000);
    await expect(page.getByText('Servidor conectado', { exact: true })).toHaveCount(0);
    const health = await context.request.get('/actuator/health/readiness', { timeout: 5000 });
    assert.equal(health.status(), 503);
    assert.deepEqual(await health.json(), { status: 'DOWN' });
    assert.equal((await context.request.get('/api/v1/system/info')).status(), 200);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: `/artifacts/safe-home-down-${action.split('-')[1]}.png` });
    writeFileSync('/artifacts/outage-down', 'down');
    phase = 'database-restart-coordination';
    await expect.poll(() => existsSync('/artifacts/outage-restart'), { timeout: 30_000 }).toBe(true);
    const recovery = Date.now();
    phase = 'database-recovery';
    writeFileSync('/artifacts/outage-restart-ready', 'ready');
    await expect(page.getByText('API y base de datos disponibles', { exact: true })).toBeVisible({ timeout: 30_000 });
    assert.ok(Date.now() - recovery < 30_000);
    await expect(error).toHaveCount(0);
    console.log(`Local browser ${proxy}: DB ${action.split('-')[1]} recovered in ${Date.now() - recovery} ms from restart coordination.`);
    writeFileSync('/artifacts/outage-up', 'up');
  }
  if (action === 'hmr') {
    phase = 'hmr';
    const navigations = [];
    page.on('framenavigated', frame => { if (frame === page.mainFrame()) navigations.push(1); });
    writeFileSync('/artifacts/hmr-ready', 'ready');
    await expect(page.getByText('Servidor HMR ficticio', { exact: true })).toBeVisible();
    writeFileSync('/artifacts/hmr-observed', 'observed');
    await expect(page.getByText('Servidor conectado', { exact: true })).toBeVisible();
    assert.equal(navigations.length, 0);
  }
  await context.storageState({ path: state });
  console.log(`Local browser ${proxy}: ${action}/reload/layout passed; identity withheld.`);
  }
} catch {
  console.error(`Local browser failed at ${phase} (values withheld).`);
  process.exitCode = 1;
} finally {
  await browser?.close();
  for (const socket of tunnels) socket.destroy();
  await new Promise(resolve => tunnel.close(resolve));
}
