self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  // Você pode adicionar lógica de cache aqui se quiser.
});
