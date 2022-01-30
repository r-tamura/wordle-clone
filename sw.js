// <reference lib="WebWorker" />
let CACHE_NAME = "WORDLE_CACHE_V1";
let urlsToCache = [".", "index.html", "main.js"];

self.addEventListener("install", function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log(`Opened cache: ${CACHE_NAME}`);
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", async (e) => {
  e.respondWith(
    caches.match(e.request).then(async (response) => {
      if (response) {
        return response;
      }
      response = await fetch(e.request);
      if (!response || response.status !== 200 || response.type !== "basic") {
        return response;
      }

      if ("URLPattern" in globalThis) {
        if (
          !new URLPattern("/*.json", globalThis.location).test(e.request.url)
        ) {
          return response;
        }
      } else {
        if (!/.*\.json/.test(e.request.url)) {
          return response;
        }
      }

      const responseToCache = response.clone();
      const cache = await caches.open(CACHE_NAME);
      cache.put(e.request, responseToCache);
      return response;
    })
  );
});
