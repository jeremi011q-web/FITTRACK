
const CACHE = 'fittrack-pro-3-1-v2';

const FILES = [
  './FITTRACK-PRO-3.1-PERFORMANCE.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key.startsWith('fittrack-') && key !== CACHE)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // No interceptar peticiones a Supabase ni a otros dominios.
  if (url.origin !== self.location.origin) return;

  // Para páginas HTML, intentar siempre obtener la versión actual.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => response)
        .catch(async () => {
          const cache = await caches.open(CACHE);
          return await cache.match('./FITTRACK-PRO-3.1-PERFORMANCE.html');
        })
    );
    return;
  }

  // Para archivos locales, usar la red y guardar respuestas válidas.
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        return await caches.match(request);
      })
  );
});
