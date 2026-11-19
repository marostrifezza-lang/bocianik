/*
 * sw.js — Service worker: makes the app work without internet.
 *
 * What it does:  - on install, saves a copy of every app file in the browser cache
 *                - then answers requests from that copy (works offline)
 * How to use:    registered by js/app.js. WHEN YOU CHANGE ANY APP FILE, increase
 *                CACHE_VERSION below; otherwise phones keep the old copy.
 *                Phones pick up the new version the next time the app is opened
 *                with internet (and show it from the following opening).
 * Depends on:    the file list below must match the real files.
 */

// ===================================================================
// Section: configuration
// ===================================================================

const CACHE_VERSION = "bocianik-v1";

// Every file the app needs to start offline.
const APP_FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "config.js",
  "css/estilos.css",
  "js/textos-es.js",
  "js/textos-en.js",
  "js/textos-sk.js",
  "js/idiomas.js",
  "js/datos-semanas.js",
  "js/utilidades.js",
  "js/almacenamiento.js",
  "js/pantalla-bienvenida.js",
  "js/pantalla-inicio.js",
  "js/pantalla-diario.js",
  "js/pantalla-contador.js",
  "js/pantalla-listas.js",
  "js/pantalla-nombres.js",
  "js/pantalla-ajustes.js",
  "js/pantalla-mas.js",
  "js/app.js",
  "iconos/icono-192.png",
  "iconos/icono-512.png",
  "iconos/icono-maskable-512.png",
  "iconos/icono-180.png",
];

// ===================================================================
// Section: install and clean-up
// ===================================================================

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_FILES))
      // Activate the new version without waiting for all tabs to close.
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  // Delete caches of older versions so they do not take space.
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_VERSION).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

// ===================================================================
// Section: answering requests
// ===================================================================

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return; // never touch other sites

  event.respondWith(cacheFirst(request));
});

/** Saved copy first; if missing, download it (and keep a copy). */
async function cacheFirst(request) {
  // ignoreSearch: "index.html?x=1" uses the same saved copy as "index.html".
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) (await caches.open(CACHE_VERSION)).put(request, response.clone());
  return response;
}
