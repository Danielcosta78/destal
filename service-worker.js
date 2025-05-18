self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('pagina-cache').then(cache => {
      return cache.addAll([
        '/Chat/index.html',
        '/icon-192.png',
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
