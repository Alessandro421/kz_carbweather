import { readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile('manifest.webmanifest', 'utf8'));
const serviceWorker = await readFile('sw.js', 'utf8');
const indexHtml = await readFile('index.html', 'utf8');

if (manifest.display !== 'standalone') {
  throw new Error(`PWA launch regression: display=${manifest.display}, expected standalone`);
}
if (!manifest.launch_handler || manifest.launch_handler.client_mode !== 'navigate-existing') {
  throw new Error('PWA launch regression: launch_handler.client_mode must be navigate-existing');
}
if (manifest.start_url !== './' || manifest.scope !== './') {
  throw new Error('PWA launch regression: start_url/scope changed unexpectedly');
}
if (!indexHtml.includes('<meta name="mobile-web-app-capable" content="yes">')) {
  throw new Error('PWA launch regression: Android mobile-web-app-capable metadata missing');
}
const htmlTheme = indexHtml.match(/<meta name="theme-color" content="([^"]+)">/)?.[1];
if (!htmlTheme || manifest.theme_color !== htmlTheme) {
  throw new Error(`PWA theme regression: manifest theme_color=${manifest.theme_color}, HTML theme-color=${htmlTheme || 'missing'}`);
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

if (!serviceWorker.includes("const CACHE_PREFIX='kz-carbweather-';")) {
  throw new Error('PWA cache cleanup regression: app-owned cache prefix is missing');
}
if (!serviceWorker.includes('keys.filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE)')) {
  throw new Error('PWA cache cleanup regression: activation must delete only stale KZ CarbWeather caches');
}

console.log('KZ PWA launch regression: standalone launch, Android app metadata, aligned theme color, navigation preload, activation resilience and scoped cache cleanup checks passed.');
