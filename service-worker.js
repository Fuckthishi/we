const CACHE='sharif-images-v3';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('sharif-images-')&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})()));
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET'||req.destination!=='image')return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const hit=await cache.match(req);
    if(hit){
      event.waitUntil(fetch(req).then(r=>{if(r.ok)cache.put(req,r.clone())}).catch(()=>{}));
      return hit;
    }
    try{const res=await fetch(req);if(res.ok)event.waitUntil(cache.put(req,res.clone()));return res}catch(e){return hit||Response.error()}
  })());
});