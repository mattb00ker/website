const CACHE_NAME = 'satnav-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/locate.html',
  // include any other local assets:
  '/sw.js',
  'https://unpkg.com/leaflet/dist/leaflet.css',
  'https://unpkg.com/leaflet/dist/leaflet.js',
  'https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.css',
  'https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js',
  'https://unpkg.com/papaparse@5.3.2/papaparse.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(resp => resp || fetch(event.request).then(response => {
        // Cache fetched assets
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      }))
      .catch(() => {
        // Optionally return a fallback page or asset here
      })
  );
});