const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/offline',
  '/icons/icon-192x192.png',
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match('/offline');
      }
      return caches.match(event.request);
    })
  );
});
