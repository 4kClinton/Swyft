const CACHE_NAME = "pwa-cache-v1";
// Pre-cache only the essential navigation assets.
const urlsToCache = [
  "/",
  "/index.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  // Use network-first strategy for navigation requests (pages)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Optionally, update the cache with the fresh page
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If network fails, fall back to the cached page or index.html
          return caches.match(event.request).then(cachedResponse => {
            return cachedResponse || caches.match("/index.html");
          });
        })
    );
  } else {
    // For non-navigation requests, use network-first with cache fallback.
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
