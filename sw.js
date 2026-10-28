const CACHE='azules-iphone-pilot-v7-ssgg';
const FILES=['./','./index.html','./app.js','./app.css','./install.js','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(file=>new Request(new URL(file,self.location).href,{cache:"reload"})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin)return;e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(e.request,{ignoreSearch:true});if(hit)return hit;if(e.request.mode==='navigate')return (await c.match(new URL('./index.html',self.location).href))||fetch(e.request);return fetch(e.request);}));});
