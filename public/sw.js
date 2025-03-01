const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate & Clean Old Caches
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

// Fetch and Cache Strategy with MIME Type Safeguard
self.addEventListener("fetch", (event) => {
  const acceptHeader = event.request.headers.get("accept") || "";
  
  // For HTML navigation requests, use cache first then network fallback.
  if (acceptHeader.includes("text/html")) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  } else {
    // For non-HTML requests (like JS modules), perform a network fetch.
    // Optionally, fallback to cache if the network fails.
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
