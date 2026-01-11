const CACHE_NAME = 'conde-pwa-cache-v1';
const urlsToCache = [
  '/siteweb/',
  '/siteweb/index.html',
  '/siteweb/css/style.css',
  '/siteweb/js/main.js',
  '/siteweb/manifest.json',
  '/siteweb/icons/icon-192.png',
  '/siteweb/icons/icon-512.png',
  // Ajoutez d'autres fichiers à mettre en cache ici
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
