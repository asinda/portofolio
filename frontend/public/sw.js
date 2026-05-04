/**
 * SERVICE WORKER — Portfolio Alice Sindayigaya
 * Stratégie : Network-First pour HTML/JS/CSS, Cache-First pour images/fonts
 * Version auto-incrémentée à chaque déploiement via timestamp
 */

const CACHE_VERSION = 'v2025-05-04';
const CACHE_NAME = `portfolio-alice-${CACHE_VERSION}`;

// ─── Installation : pré-cacher uniquement les fichiers qui existent ──────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll([
        '/portofolio/',
        '/portofolio/index.html',
        '/portofolio/manifest.json',
      ]))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()) // ne pas bloquer si un fichier manque
  );
});

// ─── Activation : purger tous les anciens caches ─────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith('portfolio-alice-') && k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ─── Fetch : stratégie par type de ressource ─────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // API : toujours réseau, jamais cache
  if (url.href.includes('/api/') || url.href.includes('supabase.co') || url.href.includes('onrender.com')) {
    return;
  }

  // Images et fonts : Cache-First (les assets ne changent pas de contenu)
  if (/\.(jpg|jpeg|png|webp|gif|svg|woff2?|ttf|eot)(\?|$)/.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // HTML, CSS, JS : Network-First → toujours la version la plus récente
  event.respondWith(networkFirst(request));
});

// ─── Network-First : réseau → cache → offline ────────────────────────────────
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || caches.match('/portofolio/index.html');
  }
}

// ─── Cache-First : cache → réseau ────────────────────────────────────────────
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 503 });
  }
}
