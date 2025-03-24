const CACHE_NAME = "pwa-cache-v1";
// Pre-cache only the essential navigation assets.
const urlsToCache = ["/", "/index.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  // Bypass handling for development assets (Vite, react-refresh, etc.)
  const url = new URL(event.request.url);
  if (
    url.pathname.startsWith("/@vite/") ||
    url.pathname.startsWith("/@react-refresh") ||
    url.pathname.startsWith("/src/")
  ) {
    return event.respondWith(fetch(event.request));
  }

  // For navigation requests (pages)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Update the cache with the fresh page
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() =>
          // If network fails, try cache, then index.html, then fallback response.
          caches
            .match(event.request)
            .then(
              (cachedResponse) =>
                cachedResponse || caches.match("/index.html")
            )
            .then(
              (finalResponse) =>
                finalResponse ||
                new Response("Offline", {
                  status: 200,
                  headers: { "Content-Type": "text/html" },
                })
            )
        )
    );
  } else {
    // For non-navigation requests
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
        .then(
          (response) =>
            response ||
            new Response("Not found", { status: 404, statusText: "Not found" })
        )
    );
  }
});
