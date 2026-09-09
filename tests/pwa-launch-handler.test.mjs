import { readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile('manifest.webmanifest', 'utf8'));
const serviceWorker = await readFile('sw.js', 'utf8');

if (manifest.display !== 'standalone') {
  throw new Error(`PWA launch regression: display=${manifest.display}, expected standalone`);
}
if (!manifest.launch_handler || manifest.launch_handler.client_mode !== 'navigate-existing') {
  throw new Error('PWA launch regression: launch_handler.client_mode must be navigate-existing');
}
if (manifest.start_url !== './' || manifest.scope !== './') {
  throw new Error('PWA launch regression: start_url/scope changed unexpectedly');
}

for (const needle of [
  'self.registration.navigationPreload',
  'await self.registration.navigationPreload.enable()',
  "e.request.mode==='navigate'",
  'e.preloadResponse.then(r=>r||fetch(e.request))',
  "if(e.request.mode==='navigate')return caches.match('./index.html')"
]) {
  if (!serviceWorker.includes(needle)) {
    throw new Error(`PWA navigation preload regression: missing ${needle}`);
  }
}

const preloadEnable = serviceWorker.indexOf('await self.registration.navigationPreload.enable()');
const preloadTry = serviceWorker.lastIndexOf('try{', preloadEnable);
const preloadCatch = serviceWorker.indexOf('}catch(error){', preloadEnable);
const cacheCleanup = serviceWorker.indexOf('const keys=await caches.keys()', preloadEnable);
const clientsClaim = serviceWorker.indexOf('await self.clients.claim()', preloadEnable);
if (preloadTry < 0 || preloadCatch < preloadEnable || cacheCleanup < preloadCatch || clientsClaim < cacheCleanup) {
  throw new Error('PWA navigation preload resilience regression: preload errors must not block activation cleanup or clients.claim()');
}

console.log('KZ PWA launch regression: standalone launch, navigation preload and activation resilience checks passed.');
