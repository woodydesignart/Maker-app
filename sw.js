const CACHE_NAME = 'pocketool-v11'; // Incrementi questo a ogni modifica
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Installazione: forza l'attivazione immediata
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Attivazione: prende subito il controllo dei client aperti
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Cancella le vecchie cache obsolete
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: serve i file dalla cache o dalla rete
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
