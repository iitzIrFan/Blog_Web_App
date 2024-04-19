const staticDevCoffee = "dev-coffee-site-v1";
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "logo.png",
];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      // If cache is available, return the cached response
      if (res) {
        return res;
      }

      // If the cache is not available, fetch the resource from the network
      return fetch(fetchEvent.request).catch(() => {
        // If fetching fails, serve a fallback image
        return caches.match("logo.png");
      });
    })
  );
});
