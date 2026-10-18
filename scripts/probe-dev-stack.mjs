// Read-only probe from the private Docker network; URL/Host/issuer remain the public contract.
import http from 'node:http';
import { pathToFileURL } from 'node:url';

export async function probe({ origin, proxy, oidcPort, request = get }) {
  const issuer = `http://host.docker.internal:${oidcPort}/default`;
  const metadata = await request(`${issuer}/.well-known/openid-configuration`);
  if (metadata.issuer !== issuer) throw new Error('issuer');
  for (const key of ['authorization_endpoint', 'token_endpoint', 'jwks_uri', 'userinfo_endpoint']) {
    if (typeof metadata[key] !== 'string' || !metadata[key].startsWith(`${issuer}/`)) throw new Error('metadata');
  }
  const jwks = await request(metadata.jwks_uri);
  if (!Array.isArray(jwks.keys) || jwks.keys.length === 0 || !jwks.keys.every(key => key && key.kty === 'RSA'
    && ['kid', 'n', 'e'].every(field => typeof key[field] === 'string' && key[field].length > 0))) throw new Error('jwks');
  const target = { hostname: proxy === 'vite' ? 'client-dev' : 'client', port: proxy === 'vite' ? 5173 : 80 };
  const info = await request(`${origin}/api/v1/system/info`, target);
  if (Object.keys(info).sort().join(',') !== 'name,version'
    || typeof info.name !== 'string' || !info.name.trim()
    || typeof info.version !== 'string' || !info.version.trim()) throw new Error('info');
  const health = await request(`${origin}/actuator/health/readiness`, target);
  if (Object.keys(health).join(',') !== 'status' || health.status !== 'UP') throw new Error('health');
}

export function get(url, target = {}) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, { ...target, headers: { Host: new URL(url).host, Accept: 'application/json' } }, response => {
      const chunks = [];
      let size = 0;
      response.on('data', chunk => {
        size += chunk.length;
        if (size > 65_536) request.destroy(new Error('size'));
        else chunks.push(chunk);
      });
      response.on('error', reject);
      response.on('end', () => {
        try {
          if (response.statusCode !== 200 || !response.headers['content-type']?.includes('application/json')) throw new Error('response');
          resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
        } catch { reject(new Error('Invalid local response')); }
      });
    });
    const timer = setTimeout(() => request.destroy(new Error('deadline')), 5000);
    request.on('close', () => clearTimeout(timer));
    request.on('error', reject);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await probe({ origin: process.env.APP_PUBLIC_URL, proxy: process.env.STARTER_LOCAL_PROXY, oidcPort: process.env.LOCAL_OIDC_PORT });
    console.log('Local API/DB/OIDC check passed.');
  } catch {
    console.error('Local stack check failed (response, provider or connection unavailable; details withheld).');
    process.exitCode = 1;
  }
}
