/* Engtrain: кеш приложения и библиотеки распознавания, чтобы всё работало без интернета.
   Файлы модели Whisper кеширует сама Transformers.js (Cache API), здесь их не трогаем. */
var C='engtrain-v1';
self.addEventListener('install',function(){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;
  var u=new URL(r.url),own=u.origin===location.origin,lib=u.hostname==='cdn.jsdelivr.net';
  if(!own&&!lib)return;
  if(own){ // своё приложение: сначала сеть (чтобы приходили обновления), без сети - из кеша
    e.respondWith(fetch(r).then(function(res){
      if(res.ok){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp)})}return res
    }).catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(m){return m||caches.match('./')||caches.match('index.html')})}));
    return}
  e.respondWith(caches.match(r).then(function(m){ // библиотека и wasm: из кеша, иначе скачать и сохранить
    return m||fetch(r).then(function(res){
      if(res.ok){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp)})}return res})}))
});
