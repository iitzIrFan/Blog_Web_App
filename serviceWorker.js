// Define const variable cachevar and set its value to My Assets
const cachevar = "MY Assets"

// Arrays of assets to be cached
const assets = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/logo.png",
]

// install event
self.addEventListener("install", installEvent => {
  // When the "install" event occurs, wait until the following tasks are completed
  installEvent.waitUntil(
    // Open cache named My Assets
    caches.open(cachevar).then(cache => {
      // Add assets to cache
      cache.addAll(assets)
    })
  )
})

// fech event
self.addEventListener("fetch", fetchEvent => {
  // When a fetch event occurs, respond to it with the following logic
    fetchEvent.respondWith(
      // Find match in the cache
      caches.match(fetchEvent.request).then(res => {
        // If a match is found, return the cached response
        // If no match is found, fetch the resource from the network
        return res || fetch(fetchEvent.request) // or opearator
      })
    )
  })
  