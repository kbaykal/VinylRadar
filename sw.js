// Vinyl Radar — Service Worker v1
// Cache-first for app shell, network-first for API calls

const CACHE_NAME = 'vinyl-radar-v1';

// App shell: files to cache on install
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Syne:wght@400;500;600;700&display=swap'
];

// ── Install: pre-cache app shell ────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: clean up old caches ───────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch strategy ──────────────────────────────────────────────────────────
// API calls (Discogs, MusicBrainz): network only — never cache these
// Google Fonts files: cache first (they're versioned/immutable)
// Everything else (app shell): stale-while-revalidate
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // API calls — network only, don't cache
  if (url.hostname === 'api.discogs.com' || url.hostname === 'musicbrainz.org') {
    event.respondWith(fetch(event.request));
    return;
  }

  // Google Fonts static files — cache first (immutable content)
  if (url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Cover images from Discogs — cache with limit
  if (url.hostname.includes('discogs') && event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => new Response('', { status: 408 }));
      })
    );
    return;
  }

  // App shell & everything else — stale-while-revalidate
  // Serve cached version immediately, fetch fresh copy in background
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline and not in cache — return a basic fallback for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return new Response('', { status: 408 });
      });

      return cached || fetchPromise;
    })
  );
});
