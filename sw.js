const CACHE='am4-tratte-v23';
const DATA='am4-data-v1'; // dati pesanti: restano in cache tra un aggiornamento e l'altro
const FILES=['./','index.html','manifest.json','icon-192.png','icon-512.png','data/airports.json','data/aircraft.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE&&x!==DATA).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  // domanda per hub: prima la cache (non cambia), poi la rete
  if(e.request.url.includes('/data/d/')){
    e.respondWith(caches.open(DATA).then(c=>c.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r;}))));
    return;
  }
  // rete prima, cache se offline: così gli aggiornamenti arrivano subito
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r;}).catch(()=>caches.match(e.request)));
});
