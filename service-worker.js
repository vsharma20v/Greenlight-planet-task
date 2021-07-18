console.log("SW Registered");

let cacheData = "version 1";
const self = this;

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheData).then((c) => {
      c.addAll([
        "/index.html",
        "/style.css",
        "/index.js",
        "/form.js",
        "/search.js",
        "/assets/bg.jpg",
        "/assets/logo.svg",
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  if (!navigator.onLine) {
    e.respondWith(
      caches.match(e.request).then((result) => {
        if (result) {
          return result;
        }
        let requestUrl = e.request.clone();
        return fetch(requestUrl);
      })
    );
  }
});
