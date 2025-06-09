const CACHE_NAME = 'flame-lines-v1';
const urlsToCache = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle background sync for offline submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'flame-submission') {
    event.waitUntil(
      // Handle offline flame submissions
      console.log('Background sync triggered for flame submission')
    );
  }
});

// Handle push notifications (if implemented later)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New flame is hot! 🔥',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'flame-notification',
    data: {
      url: '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification('🔥 Flame Lines', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
