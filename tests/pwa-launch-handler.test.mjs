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

console.log('KZ PWA launch regression: standalone launch and navigation preload checks passed.');
