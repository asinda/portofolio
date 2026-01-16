/**
 * SVG Loader Workaround
 *
 * Ce script convertit automatiquement les images SVG externes en Data URI
 * pour contourner les blocages d'extensions navigateur (AdBlock, uBlock, etc.)
 *
 * Usage : Inclure ce script AVANT blog.js dans blog/index.html
 */

(function() {
    'use strict';

    console.log('🔧 SVG Loader Workaround activé');

    // Cache pour éviter de refetch les mêmes SVG
    const svgCache = new Map();

    /**
     * Convertit un SVG en Data URI
     */
    async function convertSvgToDataUri(svgUrl) {
        // Vérifier le cache
        if (svgCache.has(svgUrl)) {
            return svgCache.get(svgUrl);
        }

        try {
            const response = await fetch(svgUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const svgText = await response.text();

            // Encoder en base64
            const base64 = btoa(unescape(encodeURIComponent(svgText)));
            const dataUri = `data:image/svg+xml;base64,${base64}`;

            // Mettre en cache
            svgCache.set(svgUrl, dataUri);

            console.log(`✅ SVG converti: ${svgUrl}`);
            return dataUri;

        } catch (error) {
            console.error(`❌ Erreur conversion SVG ${svgUrl}:`, error);
            return null;
        }
    }

    /**
     * Remplace toutes les images SVG externes par des Data URI
     */
    async function replaceAllSvgImages() {
        // Sélectionner toutes les images SVG
        const images = document.querySelectorAll('img[src$=".svg"]');

        if (images.length === 0) {
            console.log('ℹ️ Aucune image SVG à convertir');
            return;
        }

        console.log(`🔄 Conversion de ${images.length} images SVG...`);

        for (const img of images) {
            const originalSrc = img.src;

            // Si c'est déjà une Data URI, ignorer
            if (originalSrc.startsWith('data:')) {
                continue;
            }

            // Convertir en Data URI
            const dataUri = await convertSvgToDataUri(originalSrc);

            if (dataUri) {
                img.src = dataUri;
                img.dataset.originalSrc = originalSrc; // Garder trace de l'URL originale
            }
        }

        console.log('✅ Conversion des images SVG terminée');
    }

    /**
     * Observer les changements du DOM pour les images ajoutées dynamiquement
     */
    function observeNewImages() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            // Vérifier si c'est une image SVG
                            if (node.tagName === 'IMG' && node.src.endsWith('.svg') && !node.src.startsWith('data:')) {
                                convertSvgToDataUri(node.src).then(dataUri => {
                                    if (dataUri) {
                                        node.src = dataUri;
                                        node.dataset.originalSrc = node.src;
                                    }
                                });
                            }

                            // Vérifier les enfants
                            const childImages = node.querySelectorAll('img[src$=".svg"]');
                            childImages.forEach(img => {
                                if (!img.src.startsWith('data:')) {
                                    convertSvgToDataUri(img.src).then(dataUri => {
                                        if (dataUri) {
                                            img.src = dataUri;
                                            img.dataset.originalSrc = img.src;
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('👁️ Observer DOM activé pour nouvelles images');
    }

    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            replaceAllSvgImages();
            observeNewImages();
        });
    } else {
        replaceAllSvgImages();
        observeNewImages();
    }

    // API publique
    window.SvgWorkaround = {
        convert: convertSvgToDataUri,
        replaceAll: replaceAllSvgImages,
        cache: svgCache
    };

})();
