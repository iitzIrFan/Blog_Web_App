const staticCacheName = "blog-static-v1";

const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "logo.png",
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticCacheName).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  if (fetchEvent.request.url.includes("logo.png")) {
    fetchEvent.respondWith(
      caches.match("logo.png").then(cachedResponse => {
        return cachedResponse || fetch(fetchEvent.request);
      })
    );
  } else {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(cachedResponse => {
        return cachedResponse || fetch(fetchEvent.request);
      })
    );
  }
});
