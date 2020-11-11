importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);

//precaching sebelumnya
workbox.precaching.precacheAndRoute([
    { url: '/index.html', revision: '2' },
    { url: '/nav.html', revision: '2' },
    { url: '/match.html', revision: '2' },
    { url: '/css/materialize.min.css', revision: '2' },
    { url: '/css/page.css', revision: '2' },
    { url: '/js/materialize.min.js', revision: '2' },
    { url: '/js/nav.js', revision: '2' },
    { url: '/js/push.js', revision: '2' },
    { url: '/js/api.js', revision: '2' },
    { url: '/js/db.js', revision: '2' },
    { url: '/js/idb.js', revision: '2' },
    { url: '/js/sw-register.js', revision: '2' },
    { url: '/pages/home.html', revision: '2' },
    { url: '/pages/about.html', revision: '2' },
    { url: '/pages/contact.html', revision: '2' },
    { url: '/pages/saved.html', revision: '2' },
    { url: '/pages/team.html', revision: '2' },
    { url: '/img/logo.png', revision: '2' },
    { url: '/img/photo.png', revision: '2' },
    { url: '/img/pwa.png', revision: '2' },
    { url: '/img/favicon-32x32.png', revision: '2' },
    { url: '/maskable_icon.png', revision: '2' },
    { url: '/icon.png', revision: '2' },
    { url: '/manifest.json', revision: '2' },
]);

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