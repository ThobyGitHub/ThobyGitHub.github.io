importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);

//precaching sebelumnya
workbox.precaching.precacheAndRoute([
    { url: '/index.html', revision: '3' },
    { url: '/nav.html', revision: '3' },
    { url: '/match.html', revision: '3' },
    { url: '/offline.html', revision: '3' },
    { url: '/css/materialize.min.css', revision: '3' },
    { url: '/css/page.css', revision: '3' },
    { url: '/js/materialize.min.js', revision: '3' },
    { url: '/js/nav.js', revision: '3' },
    { url: '/js/push.js', revision: '3' },
    { url: '/js/api.js', revision: '3' },
    { url: '/js/db.js', revision: '3' },
    { url: '/js/idb.js', revision: '3' },
    { url: '/js/sw-register.js', revision: '3' },
    { url: '/pages/home.html', revision: '3' },
    { url: '/pages/about.html', revision: '3' },
    { url: '/pages/contact.html', revision: '3' },
    { url: '/pages/saved.html', revision: '3' },
    { url: '/pages/team.html', revision: '3' },
    { url: '/img/logo.png', revision: '3' },
    { url: '/img/photo.png', revision: '3' },
    { url: '/img/pwa.png', revision: '3' },
    { url: '/img/favicon-32x32.png', revision: '3' },
    { url: '/img/no-match.jpg', revision: '3' },
    { url: '/maskable_icon.png', revision: '3' },
    { url: '/icon.png', revision: '3' },
    { url: '/manifest.json', revision: '3' },
], {ignoreUrlParametersMatching: [/.*/]});

//menangani caching gambar pada workbox
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      }),
    ],
  }),
);

//menangani caching /pages pada workbox
workbox.routing.registerRoute(
  new RegExp('/pages/'),
  workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
  /^https:\/\/api\.football\-data\.org\/v2\//,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'football-data-api',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      }),
    ],
  })
);

self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: 'img/notification.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});

//handle offline
self.addEventListener("install", function (event) {
  const urls = ['/offline.html'];
  const cacheName = workbox.core.cacheNames.runtime;
  event.waitUntil(
      caches.open(cacheName).then(function (cache) {
          return cache.addAll(urls);
      })
  );
});

const urls = ['/offline.html'];

// pages to cache

workbox.routing.registerRoute(new RegExp('/'),
  async ({
      event
  }) => {
      try {
          return await workbox.strategies.networkFirst({
              cacheName: 'soccerball',
              plugins: [
                  new workbox.expiration.Plugin({
                      maxEntries: 60,
                      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
                  }),
              ],
          }).handle({
              event
          });
      } catch (error) {
          return caches.match(urls);
      }
  }
);