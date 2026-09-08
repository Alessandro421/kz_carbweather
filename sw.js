const CACHE='kz-carbweather-v2.1-appshell';
const ASSETS=[
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    if(self.registration.navigationPreload){
      await self.registration.navigationPreload.enable();
    }
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;

  const url=new URL(e.request.url);
  if(url.origin!==self.location.origin)return;

  const networkResponse=e.request.mode==='navigate'
    ? e.preloadResponse.then(r=>r||fetch(e.request))
    : fetch(e.request);

  e.respondWith(
    networkResponse
      .then(r=>{
        if(r.ok){
          const copy=r.clone();
          e.waitUntil(caches.open(CACHE).then(c=>c.put(e.request,copy)));
        }
        return r;
      })
      .catch(async()=>{
        const cached=await caches.match(e.request);
        if(cached)return cached;
        if(e.request.mode==='navigate')return caches.match('./index.html');
        return Response.error();
      })
  );
});