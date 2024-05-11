const cachevar = "MY Assets"
const assets = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/logo.png",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(cachevar).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })
  