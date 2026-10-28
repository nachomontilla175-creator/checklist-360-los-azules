(function(){
const status=document.getElementById('offline-status'),button=document.getElementById('retry-offline');
const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
async function setup(){button.disabled=true;try{
if(!isSecureContext||!('serviceWorker' in navigator))throw Error('Abrí el enlace HTTPS en Safari. No uses el archivo HTML adjunto.');
const registration=await navigator.serviceWorker.register('./sw.js',{scope:'./'});
try{await registration.update();}catch(updateError){
 const existingCache=await caches.open('azules-iphone-pilot-v7-ssgg');
 let complete=!!registration.active;
 for(const name of ['index.html','app.js','app.css','install.js','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'])if(!await existingCache.match(new URL(name,location.href)))complete=false;
 if(!complete)throw updateError;
 status.textContent='Lista para usar sin conexión. La actualización se comprobará cuando vuelva internet.';
 return;
}
const pendingWorker=registration.installing||registration.waiting;
if(pendingWorker&&pendingWorker.state!=='activated')await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('La actualización está pendiente. Cerrá y volvé a abrir con conexión.')),25000);function check(){if(pendingWorker.state==='activated'){clearTimeout(timer);resolve();}else if(pendingWorker.state==='redundant'){clearTimeout(timer);reject(Error('No se pudo completar la actualización. Reintentá con conexión.'));}}pendingWorker.addEventListener('statechange',check);check();});
await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('La descarga no terminó. Verificá la conexión y volvé a comprobar.')),25000))]);
const cache=await caches.open('azules-iphone-pilot-v7-ssgg');
for(const name of ['index.html','app.js','app.css','install.js','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'])if(!await cache.match(new URL(name,location.href)))throw Error('Faltan archivos para usar sin conexión. Conectate y volvé a comprobar.');
status.textContent=standalone?'Descarga completa en esta app. Probá cerrar y abrir en modo avión antes de usarla para una inspección real.':'Descarga completa en Safari. Agregá a inicio y abrí el nuevo ícono con conexión para completar la instalación allí.';
}catch(e){
 let offlineReady=false;
 try{
  const registration=await navigator.serviceWorker.getRegistration('./');
  const cache=await caches.open('azules-iphone-pilot-v7-ssgg');
  offlineReady=!!registration?.active;
  for(const name of ['index.html','app.js','app.css','install.js','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'])if(!await cache.match(new URL(name,location.href)))offlineReady=false;
 }catch{}
 status.textContent=offlineReady?'Lista para usar sin conexión. La actualización se comprobará cuando vuelva internet.':'Sin conexión aún no disponible: '+e.message;
}finally{button.disabled=false;}}
button.addEventListener('click',setup);setup();
})();
