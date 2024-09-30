const CACHE_NAME = 'todo-list-cache-v2'; // Increment the version number

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',                         
        'index.html',                 
        'style.css',                  
        'script.js',                  
        '/images/icon-192x192.png',   
        '/images/icon-512x512.png'   
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// This event activates the new service worker and deletes old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // Only keep the updated cache
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Delete old cache
          }
        })
      );
    })
  );
});
