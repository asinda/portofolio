/**
 * SERVICE WORKER
 * Sprint 4 - Portfolio Alice Sindayigaya
 * Cache-first strategy pour assets statiques
 * Network-first pour données API
 */

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `portfolio-alice-${CACHE_VERSION}`;

// Assets à pré-cacher (disponibles offline)
const PRECACHE_URLS = [
    '/portofolio/',
    '/portofolio/index.html',
    '/portofolio/offline.html',
    '/portofolio/css/style-cityscape.min.css',
    '/portofolio/css/style-cityscape.css',
    '/portofolio/js/main.min.js',
    '/portofolio/js/main.js',
    '/portofolio/js/animations.js',
    '/portofolio/manifest.json',
    '/portofolio/icons/icon-192x192.png',
    '/portofolio/icons/icon-512x512.png'
];

// Assets à cacher lors de la première requête (lazy cache)
const LAZY_CACHE_PATTERNS = [
    /\/portofolio\/images\//,
    /\/portofolio\/icons\//,
    /\.jpg$/,
    /\.jpeg$/,
    /\.png$/,
    /\.webp$/,
    /\.svg$/,
    /\.woff2$/
];

// URLs à toujours récupérer du réseau (jamais cacher)
const NETWORK_ONLY_PATTERNS = [
    /\/api\//,
    /supabase\.co/,
    /analytics/
];

/**
 * Installation du Service Worker
 * Pré-cache les assets essentiels
 */
self.addEventListener('install', (event) => {
    console.log('[SW] Installation...', CACHE_VERSION);

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Pré-cache des assets essentiels');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => {
                console.log('[SW] Installation terminée ✅');
                // Force le nouveau SW à devenir actif immédiatement
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Erreur lors du pré-cache:', error);
            })
    );
});

/**
 * Activation du Service Worker
 * Nettoie les anciens caches
 */
self.addEventListener('activate', (event) => {
    console.log('[SW] Activation...', CACHE_VERSION);

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                // Supprimer les anciens caches
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            return cacheName.startsWith('portfolio-alice-') &&
                                   cacheName !== CACHE_NAME;
                        })
                        .map((cacheName) => {
                            console.log('[SW] Suppression ancien cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Activation terminée ✅');
                // Prendre le contrôle immédiatement
                return self.clients.claim();
            })
    );
});

/**
 * Interception des requêtes
 * Stratégies de cache adaptées par type de ressource
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorer les requêtes non-GET
    if (request.method !== 'GET') {
        return;
    }

    // Network-only pour API et analytics
    if (NETWORK_ONLY_PATTERNS.some(pattern => pattern.test(url.href))) {
        event.respondWith(fetch(request));
        return;
    }

    // Stratégie Cache-First pour assets statiques
    if (shouldCacheAsset(url)) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Stratégie Network-First pour pages HTML
    if (request.mode === 'navigate' || url.pathname.endsWith('.html')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Par défaut: Cache-First
    event.respondWith(cacheFirst(request));
});

/**
 * Vérifier si un asset doit être caché
 */
function shouldCacheAsset(url) {
    return LAZY_CACHE_PATTERNS.some(pattern => pattern.test(url.href)) ||
           url.origin === self.location.origin;
}

/**
 * Stratégie Cache-First
 * Cache d'abord, réseau en fallback
 * Utilisée pour: CSS, JS, images, fonts
 */
async function cacheFirst(request) {
    try {
        // Chercher dans le cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Pas en cache, récupérer du réseau
        const networkResponse = await fetch(request);

        // Mettre en cache si succès
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('[SW] Cache-First error:', error);

        // Retourner page offline pour les pages HTML
        if (request.mode === 'navigate') {
            const offlineResponse = await caches.match('/portofolio/offline.html');
            if (offlineResponse) {
                return offlineResponse;
            }
        }

        throw error;
    }
}

/**
 * Stratégie Network-First
 * Réseau d'abord, cache en fallback
 * Utilisée pour: Pages HTML
 */
async function networkFirst(request) {
    try {
        // Essayer le réseau d'abord
        const networkResponse = await fetch(request);

        // Mettre en cache si succès
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('[SW] Network-First error:', error);

        // Fallback: chercher dans le cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Dernière chance: page offline
        const offlineResponse = await caches.match('/portofolio/offline.html');
        if (offlineResponse) {
            return offlineResponse;
        }

        throw error;
    }
}

/**
 * Messages du client (page web)
 * Permet de forcer le skip waiting
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('[SW] Skip waiting demandé');
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLIENTS_CLAIM') {
        console.log('[SW] Clients claim demandé');
        self.clients.claim();
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_VERSION });
    }
});

/**
 * Notification de mise à jour
 * Informe les clients qu'une nouvelle version est disponible
 */
self.addEventListener('controllerchange', () => {
    console.log('[SW] Nouvelle version du Service Worker activée');
});

console.log('[SW] Service Worker chargé:', CACHE_VERSION);
