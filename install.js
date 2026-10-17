(function(){
const status=document.getElementById('offline-status'),button=document.getElementById('retry-offline');
const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
async function setup(){button.disabled=true;try{
if(!isSecureContext||!('serviceWorker' in navigator))throw Error('Abrí el enlace HTTPS en Safari. No uses el archivo HTML adjunto.');
await navigator.serviceWorker.register('./sw.js',{scope:'./'});
await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('La descarga no terminó. Verificá la conexión y volvé a comprobar.')),25000))]);
const cache=await caches.open('azules-iphone-pilot-v2');
for(const name of ['index.html','app.js','app.css','install.js','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'])if(!await cache.match(new URL(name,location.href)))throw Error('Faltan archivos para usar sin conexión. Conectate y volvé a comprobar.');
status.textContent=standalone?'Descarga completa en esta app. Probá cerrar y abrir en modo avión antes de usarla para una inspección real.':'Descarga completa en Safari. Agregá a inicio y abrí el nuevo ícono con conexión para completar la instalación allí.';
}catch(e){status.textContent='Sin conexión aún no disponible: '+e.message;}finally{button.disabled=false;}}
button.addEventListener('click',setup);setup();
})();