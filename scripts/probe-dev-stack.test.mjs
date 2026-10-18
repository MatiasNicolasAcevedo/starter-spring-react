import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { probe, get } from './probe-dev-stack.mjs';

const issuer = 'http://host.docker.internal:8090/default';
const options = { origin: 'http://127.0.0.1:5175', proxy: 'nginx', oidcPort: '8090' };
const discovery = { issuer, authorization_endpoint: `${issuer}/authorize`, token_endpoint: `${issuer}/token`,
  jwks_uri: `${issuer}/jwks`, userinfo_endpoint: `${issuer}/userinfo` };
const defaults = { '/default/.well-known/openid-configuration': discovery, '/default/jwks': { keys: [{ kty: 'RSA', kid: 'fictitious', n: 'fictitious', e: 'AQAB' }] },
  '/api/v1/system/info': { name: 'Starter', version: '0.0.1' }, '/actuator/health/readiness': { status: 'UP' } };

async function fixture(overrides, use) {
  const paths = [];
  const server = http.createServer((request, response) => {
    paths.push(request.url);
    const value = overrides[request.url] ?? defaults[request.url];
    if (value?.raw !== undefined) { response.writeHead(value.status ?? 200, { 'Content-Type': value.type ?? 'application/json' }); response.end(value.raw); }
    else { response.writeHead(200, { 'Content-Type': 'application/json' }); response.end(JSON.stringify(value)); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const request = url => get(url, { hostname: '127.0.0.1', port: server.address().port });
    await use(request, paths);
  } finally { await new Promise(resolve => server.close(resolve)); }
}
test('check reads real JSON, discovery and JWKS without login or mutation', () => fixture({}, async (request, paths) => {
  await probe({ ...options, request });
  assert.deepEqual(paths, Object.keys(defaults));
}));
for (const [name, overrides] of Object.entries({
  'different issuer': { '/default/.well-known/openid-configuration': { ...discovery, issuer: 'http://attacker.invalid/default' } },
  'different JWKS origin': { '/default/.well-known/openid-configuration': { ...discovery, jwks_uri: 'http://attacker.invalid/jwks' } },
  'empty keys': { '/default/jwks': { keys: [] } },
  'malformed key': { '/default/jwks': { keys: [{}] } },
  'HTML 200': { '/api/v1/system/info': { raw: '<html>SPA</html>', type: 'text/html' } },
  'malformed JSON': { '/api/v1/system/info': { raw: '{' } },
  'invalid schema': { '/api/v1/system/info': { name: 'Starter' } },
  'extra data': { '/api/v1/system/info': { name: 'Starter', version: '1', extra: true } },
  'proxy outage': { '/api/v1/system/info': { raw: 'unavailable', status: 502 } },
  'database outage': { '/actuator/health/readiness': { raw: '{"status":"DOWN"}', status: 503 } },
  'health HTML 200': { '/actuator/health/readiness': { raw: '<html>SPA</html>', type: 'text/html' } },
  'health DOWN 200': { '/actuator/health/readiness': { status: 'DOWN' } },
  'health component leak': { '/actuator/health/readiness': { status: 'UP', components: { db: {} } } },
})) test(`check rejects ${name}`, () => fixture(overrides, async request => {
  await assert.rejects(probe({ ...options, request }));
}));
