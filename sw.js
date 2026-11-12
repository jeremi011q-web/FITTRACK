const CACHE = 'fittrack-pro-2-redesign-v1';
const FILES = ['./FITTRACK-PRO-2.0.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('fittrack-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).then(response => { if (response.ok) { const copy=response.clone(); caches.open(CACHE).then(c=>c.put(event.request,copy)); } return response; }).catch(() => caches.match(event.request).then(cached => cached || caches.match('./FITTRACK-PRO-2.0.html'))));
});
