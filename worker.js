// Establish a cache name
const hostname = self.location.hostname.replace('.', '_')
const cacheName = hostname + '_cache'

self.addEventListener('install', (event) => {
  // Activate new version of the Worker instantly
  self.skipWaiting()
  event.waitUntil(
    caches.open(cacheName).then(
      (cache) => cache.addAll(['']) // Homepage pre-cache
    )
  )
})

self.addEventListener('activate', () => {
  clients.claim()
})

async function saveResponseToCache(request, clonedResponse) {
  const cache = await caches.open(cacheName)
  cache.put(request, clonedResponse)
}

async function getFromCache(request) {
  const cache = await caches.open(cacheName)
  return await cache.match(request, { ignoreSearch: true })
}

function isSameOrigin(url, host) {
  return url.startsWith(origin)
}

async function getResponse(request) {
  try {
    const fresh = await fetch(request.url)
    if (fresh.status === 200) {
      if (request.method.toLowerCase() === 'get') {
        const clonedResponse = fresh.clone()
        await saveResponseToCache(request, clonedResponse)
      }
      return fresh
    }
  } catch (error) {
    console.info(error)
  }

  return await getFromCache(request)
}

// Fetch handler
self.addEventListener('fetch', (event) => {
  if (isSameOrigin(event.request.url, self.location.origin)) {
    event.respondWith(getResponse(event.request))
  }
})
