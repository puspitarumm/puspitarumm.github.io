var CACHE_NAME = 'latihan-pwa-cache-v1';

var urlToCache = [
    '/',
    '/css/main.css',
    '/img/orca.png',
    '/js/jquery.min.js',
    '/js/main.js'

];

// install cache on browser
self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                // console.log('service worker install.. Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                // delete cache jika versi cache nya berbeda
                cacheNames.filter(function (cacheName) {
                    return cacheName !== CACHE_NAME;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    var request = event.request;
    var url = new URL(request.url);

    // pisah API dengan cache
    // jika menggunakan data lokal cache
    if (url.origin === location.origin){
        event.respondWith(
            caches.match(request).then(function (response) {
                // jika ada maka tampilkan data dari cache, jika tidak ada maka fetch dari request
                return response || fetch(request);
            })
        );
    } else{
        // jika menggunakan internet API
        event.respondWith(
            // buat cache baru
            caches.open('mahasiswa-cache-v1').then(function (cache) {
                return fetch(request).then(function (liveRequest) {
                    cache.put(request,liveRequest.clone());
                    // nyimpen hasil fetch ke cache name diatas
                    return liveRequest;
                }).catch(function () {
                    return caches.match(request).then(function (response) {
                        // jika cache kita cek ad isinya maka return response
                        if (response) return response;  // jika tidak ketemu juga ya ke fallback.json
                        return caches.match('/fallback.json');
                    })
                })
            })
        )
    }

    // event.respondWith(
    //     caches.match(event.request)
    //         .then(function(response) {
    //                 // Cache hit - return response
    //                 console.log(response);
    //                 if (response) {
    //                     return response;
    //                 }
    //                 return fetch(event.request);
    //             }
    //         )
    // );
});


self.addEventListener('notificationclose', function(e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;

    console.log('Closed notification: ' + primaryKey);
});

self.addEventListener('notificationclick', function(e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;
    var action = e.action;

    if (action === 'close') {
        notification.close();
    } else {
        clients.openWindow('http://www.example.com');
        notification.close();
    }
});