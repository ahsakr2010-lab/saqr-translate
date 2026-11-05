const CACHE_NAME = 'saqr-translate-v4';
const ASSETS = [
  './',
  './saqr_translate.html',
  './translator-engine.js',
  './bridge.js',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isNavigationRequest = event.request.mode === 'navigate';
  const isTesseractAsset = url.origin === 'https://cdn.jsdelivr.net' && url.pathname.includes('tesseract');
  const isGoogleFont = url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com';
  const isFontAwesome = url.origin === 'https://cdnjs.cloudflare.com' && url.pathname.includes('font-awesome');

  if (isNavigationRequest) {
    event.respondWith(
      fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put('./saqr_translate.html', clone));
        return response;
      }).catch(() => caches.match('./saqr_translate.html'))
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match(event.request) || caches.match('./saqr_translate.html'))
    );
    return;
  }

  if (isTesseractAsset || isGoogleFont || isFontAwesome) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        }).catch(() => cached || Response.error());
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        return response;
      }).catch(() => cached || Response.error());
    })
  );
});
