import { readFile } from 'node:fs/promises';

const source = await readFile('sw.js', 'utf8');

for (const needle of [
  'self.registration.navigationPreload',
  'await self.registration.navigationPreload.enable()',
  "e.request.mode==='navigate'",
  'e.preloadResponse.then(r=>r||fetch(e.request))',
  "if(e.request.mode==='navigate')return caches.match('./index.html')"
]) {
  if (!source.includes(needle)) {
    throw new Error(`Service-worker navigation preload regression: missing ${needle}`);
  }
}

if (!source.includes("const CACHE='kz-carbweather-v2.1-appshell'")) {
  throw new Error('Service-worker navigation preload regression: cache version was not bumped');
}

console.log('KZ service-worker regression: navigation preload enabled with offline app-shell fallback preserved.');
