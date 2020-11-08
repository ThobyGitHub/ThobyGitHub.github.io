importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);

//precaching sebelumnya
workbox.precaching.precacheAndRoute([
    { url: '/index.html', revision: '1' },
    { url: '/nav.html', revision: '1' },
    { url: '/match.html', revision: '1' },
    { url: '/css/materialize.min.css', revision: '1' },
    { url: '/css/page.css', revision: '1' },
    { url: '/js/materialize.min.js', revision: '1' },
    { url: '/js/nav.js', revision: '1' },
    { url: '/js/push.js', revision: '1' },
    { url: '/js/api.js', revision: '1' },
    { url: '/js/db.js', revision: '1' },
    { url: '/js/idb.js', revision: '1' },
    { url: '/js/sw-register.js', revision: '1' },
    // { url: '/pages/home.html', revision: '1' },
    // { url: '/pages/about.html', revision: '1' },
    // { url: '/pages/contact.html', revision: '1' },
    // { url: '/pages/saved.html', revision: '1' },
    // { url: '/pages/team.html', revision: '1' },
    { url: '/img/logo.png', revision: '1' },
    { url: '/img/photo.png', revision: '1' },
    { url: '/img/pwa.png', revision: '1' },
    { url: '/img/favicon-32x32.png', revision: '1' },
    { url: '/maskable_icon.png', revision: '1' },
    { url: '/icon.png', revision: '1' },
    { url: '/manifest.json', revision: '1' },
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


// const CACHE_NAME = "soccerball-v2";
// var urlsToCache = [
//   "/",
//   "/nav.html",
//   "/index.html",
//   "/match.html",
//   "/pages/home.html",
//   "/pages/about.html",
//   "/pages/contact.html",
//   "/pages/saved.html",
//   "/pages/team.html",
//   "/css/materialize.min.css",
//   "/css/page.css",
//   "/img/logo.png",
//   "/img/photo.png",
//   "/img/pwa.png",
//   "/img/favicon-32x32.png",
//   "/maskable_icon.png",
//   "/js/materialize.min.js",
//   "/js/nav.js",
//   "/js/push.js",
//   "/js/api.js",
//   "/js/db.js",
//   "/js/idb.js",
//   "/js/sw-register.js",
//   "/icon.png",
//   "/manifest.json",
// ];
 
// self.addEventListener("install", function(event) {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(function(cache) {
//       console.log("install cache");
//       return cache.addAll(urlsToCache);
//     })
//   );
// });

self.addEventListener("fetch", function(event) {
  var base_url = "https://api.football-data.org";
  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then(function(response) {
          return response || fetch (event.request);
      })
    )
  }
});

// self.addEventListener("activate", function(event) {
//     event.waitUntil(
//       caches.keys().then(function(cacheNames) {
//         return Promise.all(
//           cacheNames.map(function(cacheName) {
//             if (cacheName != CACHE_NAME) {
//               console.log("ServiceWorker: cache " + cacheName + " dihapus");
//               return caches.delete(cacheName);
//             }
//           })
//         );
//       })
//     );
//   });

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