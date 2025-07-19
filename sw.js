// sw.js — Service Worker for Offline Caching

const CACHE_NAME = 'satnav-cache-v1';
const URLS_TO_CACHE = [
  '/',               // root (serves locate.html or index.html)
  '/locate.html',
  '/sw.js',
  // CDN-hosted assets to cache
  'https://unpkg.com/leaflet/dist/leaflet.css',
  'https://unpkg.com/leaflet/dist/leaflet.js',
  'https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.css',
  'https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js',
  'https://unpkg.com/papaparse@5.3.2/papaparse.min.js'
];

self.addEventListener('install', event => {
  // Pre-cache the app shell
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  // Clean up old caches if you ever change CACHE_NAME
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  // Respond from cache first, then network, and cache new requests
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then(response => {
        // Only cache successful (status 200) GET requests
        if (
          response.status === 200 &&
          event.request.method === 'GET'
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });
        }
        return response;
      });
    }).catch(() => {
      // Optional fallback: could return a generic offline page or image
    })
  );
});