const CACHE_NAME = 'refund-calc-v1';
const ASSETS = [
  '/Something/',
  '/Something/index.html',
  '/Something/app.webmanifest',
  '/Something/icon-192.png',
  '/Something/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then(response => response || fetch(e.request))
});
