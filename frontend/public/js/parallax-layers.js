// ===================================
// PARALLAX LAYERS - 3 PROFONDEURS
// Design Tech Futuriste Professionnel 2025
// ===================================
// Alice Sindayigaya - Portfolio DevOps & Cloud
// Parallax multi-couches avec GSAP ScrollTrigger
// ===================================

/**
 * Classe ParallaxLayers
 * Gère les effets de parallax sur 3 niveaux de profondeur
 */
class ParallaxLayers {
    constructor() {
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isMobile = window.innerWidth < 768;

        // Vitesses de parallax selon la couche
        this.speeds = {
            background: 0.2,   // Très lent
            midground: 0.5,    // Moyen
            foreground: 1      // Normal (référence)
        };

        this.init();
    }

    /**
     * Initialisation
     */
    init() {
        if (this.reducedMotion) {
            console.log('⚠️ Parallax désactivé (prefers-reduced-motion)');
            return;
        }

        // Vérifier que GSAP et ScrollTrigger sont chargés
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.error('❌ GSAP ou ScrollTrigger non chargé');
            return;
        }

        // Enregistrer ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Initialiser les différents layers
        this.initBackgroundLayer();
        this.initMidgroundLayer();
        this.initForegroundLayer();

        // Parallax sur images
        this.initImageParallax();

        console.log('✅ ParallaxLayers initialisé');
    }

    /**
     * Layer Background - Très lent (0.2x)
     * Appliqué aux éléments d'arrière-plan
     */
    initBackgroundLayer() {
        const bgElements = document.querySelectorAll('.layer-background, .hero-bg');

        bgElements.forEach(element => {
            gsap.to(element, {
                y: () => window.innerHeight * this.speeds.background,
                ease: 'none',
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1, // Smooth scrubbing
                    invalidateOnRefresh: true
                }
            });
        });

        console.log(`📐 Background layer: ${bgElements.length} éléments`);
    }

    /**
     * Layer Midground - Moyen (0.5x)
     * Appliqué aux sections principales
     */
    initMidgroundLayer() {
        const mgElements = document.querySelectorAll('.layer-midground');

        mgElements.forEach(element => {
            gsap.to(element, {
                y: () => window.innerHeight * this.speeds.midground * -0.3,
                ease: 'none',
                scrollTrigger: {
                    trigger: element,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });
        });

        console.log(`📐 Midground layer: ${mgElements.length} éléments`);
    }

    /**
     * Layer Foreground - Normal (1x) + effet subtle
     * Appliqué aux cards et éléments interactifs
     */
    initForegroundLayer() {
        const fgElements = document.querySelectorAll('.layer-foreground');

        fgElements.forEach(element => {
            // Parallax subtil + scale
            gsap.to(element, {
                y: -30,
                scale: 1.02,
                ease: 'none',
                scrollTrigger: {
                    trigger: element,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });
        });

        console.log(`📐 Foreground layer: ${fgElements.length} éléments`);
    }

    /**
     * Parallax sur images spécifiques
     */
    initImageParallax() {
        const images = document.querySelectorAll('.parallax-image, .about img');

        images.forEach(img => {
            const container = img.parentElement;
            if (!container) return;

            // Assurer overflow hidden sur le parent
            container.style.overflow = 'hidden';

            gsap.to(img, {
                y: -50,
                scale: 1.1,
                ease: 'none',
                scrollTrigger: {
                    trigger: container,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });
        });

        console.log(`📐 Image parallax: ${images.length} images`);
    }

    /**
     * Détruit toutes les animations parallax
     */
    destroy() {
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.vars.trigger) {
                trigger.kill();
            }
        });

        console.log('✅ ParallaxLayers détruit');
    }

    /**
     * Rafraîchit tous les ScrollTriggers
     */
    refresh() {
        ScrollTrigger.refresh();
        console.log('🔄 ParallaxLayers rafraîchi');
    }
}

// ===================================
// INITIALISATION AUTOMATIQUE
// ===================================

let parallaxLayers;

// Attendre DOMContentLoaded et GSAP
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier que GSAP est chargé
    if (typeof gsap === 'undefined') {
        console.error('❌ GSAP non chargé, parallax désactivé');
        return;
    }

    // Petite pause pour laisser GSAP s'initialiser
    setTimeout(() => {
        parallaxLayers = new ParallaxLayers();

        // Exposer globalement
        window.parallaxLayers = parallaxLayers;
    }, 100);
});

// Rafraîchir après resize (debounced)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (parallaxLayers) {
            parallaxLayers.refresh();
        }
    }, 300);
});

// ===================================
// EXPORTS (si utilisé comme module)
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParallaxLayers;
}
