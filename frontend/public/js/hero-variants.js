// ===================================
// HERO VARIANTS MANAGER
// Design Tech Futuriste Professionnel 2025
// ===================================
// Alice Sindayigaya - Portfolio DevOps & Cloud
// Gestion des 4 variantes de hero section
// ===================================

/**
 * Classe HeroVariantManager
 * Gère le chargement et le basculement entre variantes hero
 */
class HeroVariantManager {
    constructor() {
        this.currentVariant = null;
        this.currentEffect = null;
        this.container = null;
        this.variantName = null;

        // Variantes disponibles
        this.variants = {
            'particles': ParticlesEffect,
            'matrix': VideoMatrixEffect,
            'grid-3d': Grid3DEffect,
            'gradient-mesh': GradientMeshEffect
        };

        this.init();
    }

    /**
     * Initialisation du gestionnaire
     */
    init() {
        // Récupérer le conteneur hero
        this.container = document.querySelector('.hero');
        if (!this.container) {
            console.error('❌ Section .hero introuvable');
            return;
        }

        // Créer ou récupérer le conteneur d'effets
        this.createEffectContainer();

        // Charger la variante sauvegardée ou par défaut
        this.variantName = this.getSavedVariant();
        this.loadVariant(this.variantName, false);

        console.log(`✅ HeroVariantManager initialisé (variante: ${this.variantName})`);
    }

    /**
     * Crée le conteneur pour les effets
     */
    createEffectContainer() {
        let effectContainer = this.container.querySelector('.hero-variant-container');

        if (!effectContainer) {
            effectContainer = document.createElement('div');
            effectContainer.className = 'hero-variant-container';
            effectContainer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                z-index: 0;
                pointer-events: none;
            `;

            // Insérer au début de .hero (avant le contenu)
            this.container.insertBefore(effectContainer, this.container.firstChild);
        }

        this.effectContainer = effectContainer;
    }

    /**
     * Récupère la variante sauvegardée
     * @returns {string} Nom de la variante
     */
    getSavedVariant() {
        try {
            const saved = localStorage.getItem('heroVariant');
            if (saved && this.variants[saved]) {
                return saved;
            }
        } catch (e) {
            console.warn('⚠️ Impossible de lire heroVariant depuis localStorage', e);
        }

        // Défaut: particles
        return 'particles';
    }

    /**
     * Sauvegarde la variante choisie
     * @param {string} variantName - Nom de la variante
     */
    saveVariant(variantName) {
        try {
            localStorage.setItem('heroVariant', variantName);
        } catch (e) {
            console.warn('⚠️ Impossible de sauvegarder heroVariant', e);
        }
    }

    /**
     * Charge une variante
     * @param {string} variantName - Nom de la variante ('particles', 'matrix', 'grid-3d', 'gradient-mesh')
     * @param {boolean} animated - Animation de transition (défaut: true)
     */
    loadVariant(variantName, animated = true) {
        if (!this.variants[variantName]) {
            console.error(`❌ Variante "${variantName}" invalide`);
            return false;
        }

        // Ne rien faire si déjà chargée
        if (this.variantName === variantName && this.currentEffect) {
            console.log(`ℹ️ Variante "${variantName}" déjà active`);
            return false;
        }

        // Animation de transition
        if (animated) {
            this.animateTransition(() => {
                this.switchVariant(variantName);
            });
        } else {
            this.switchVariant(variantName);
        }

        return true;
    }

    /**
     * Change la variante (logique interne)
     * @param {string} variantName - Nom de la variante
     */
    switchVariant(variantName) {
        // Nettoyer l'ancienne variante
        this.cleanup();

        // Créer la nouvelle variante
        const EffectClass = this.variants[variantName];
        this.currentEffect = new EffectClass(this.effectContainer);
        this.variantName = variantName;

        // Sauvegarder
        this.saveVariant(variantName);

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('herovariantchange', {
            detail: { variant: variantName }
        }));

        console.log(`✅ Variante hero changée: ${variantName}`);
    }

    /**
     * Animation de transition entre variantes
     * @param {Function} callback - Fonction à appeler après transition
     */
    animateTransition(callback) {
        const container = this.effectContainer;

        // Fade out
        container.style.transition = 'opacity 0.5s ease';
        container.style.opacity = '0';

        setTimeout(() => {
            // Callback (switch variante)
            callback();

            // Fade in
            setTimeout(() => {
                container.style.opacity = '1';

                // Nettoyer transition après
                setTimeout(() => {
                    container.style.transition = '';
                }, 500);
            }, 50);
        }, 500);
    }

    /**
     * Nettoie la variante courante
     */
    cleanup() {
        if (this.currentEffect && typeof this.currentEffect.destroy === 'function') {
            this.currentEffect.destroy();
            this.currentEffect = null;
        }

        // Nettoyer le conteneur
        if (this.effectContainer) {
            this.effectContainer.innerHTML = '';
        }
    }

    /**
     * Obtient la variante courante
     * @returns {string} Nom de la variante
     */
    getCurrentVariant() {
        return this.variantName;
    }

    /**
     * Obtient la liste des variantes disponibles
     * @returns {Array} Noms des variantes
     */
    getAvailableVariants() {
        return Object.keys(this.variants);
    }

    /**
     * Obtient les infos d'une variante
     * @param {string} variantName - Nom de la variante
     * @returns {Object} Informations de la variante
     */
    getVariantInfo(variantName) {
        const infos = {
            'particles': {
                name: 'Particules',
                description: 'Particules cyan animées (défaut)',
                icon: '✨',
                performance: 'Excellent'
            },
            'matrix': {
                name: 'Matrix Rain',
                description: 'Pluie de caractères façon Matrix',
                icon: '💻',
                performance: 'Bon'
            },
            'grid-3d': {
                name: 'Grille 3D',
                description: 'Grille isométrique avec points lumineux',
                icon: '🔷',
                performance: 'Excellent'
            },
            'gradient-mesh': {
                name: 'Gradient Mesh',
                description: 'Blobs organiques animés',
                icon: '🌊',
                performance: 'Moyen'
            }
        };

        return infos[variantName] || null;
    }

    /**
     * Crée un sélecteur UI pour admin/settings
     * @param {string} containerId - ID du conteneur
     */
    createVariantSelector(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ Conteneur #${containerId} introuvable`);
            return;
        }

        const selector = document.createElement('div');
        selector.className = 'hero-variant-selector';
        selector.innerHTML = `
            <label for="heroVariantSelect">Effet Hero Section:</label>
            <select id="heroVariantSelect" class="variant-select">
                ${this.getAvailableVariants().map(variant => {
                    const info = this.getVariantInfo(variant);
                    const selected = variant === this.variantName ? 'selected' : '';
                    return `<option value="${variant}" ${selected}>
                        ${info.icon} ${info.name} - ${info.description}
                    </option>`;
                }).join('')}
            </select>
        `;

        container.appendChild(selector);

        // Event listener
        const select = selector.querySelector('#heroVariantSelect');
        select.addEventListener('change', (e) => {
            this.loadVariant(e.target.value, true);
        });
    }

    /**
     * Détruit complètement le gestionnaire
     */
    destroy() {
        this.cleanup();
        console.log('✅ HeroVariantManager détruit');
    }
}

// ===================================
// INITIALISATION AUTOMATIQUE
// ===================================

let heroVariantManager;

// Attendre que les classes d'effets soient chargées
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier que les classes d'effets sont disponibles
    if (
        typeof ParticlesEffect === 'undefined' ||
        typeof VideoMatrixEffect === 'undefined' ||
        typeof Grid3DEffect === 'undefined' ||
        typeof GradientMeshEffect === 'undefined'
    ) {
        console.error('❌ Classes d\'effets non chargées. Assurez-vous que canvas-effects.js est importé avant hero-variants.js');
        return;
    }

    heroVariantManager = new HeroVariantManager();

    // Exposer globalement
    window.heroVariantManager = heroVariantManager;
});

// ===================================
// API GLOBALE
// ===================================

/**
 * Fonctions utilitaires globales
 */
window.getHeroVariant = function() {
    return window.heroVariantManager
        ? window.heroVariantManager.getCurrentVariant()
        : 'particles';
};

window.setHeroVariant = function(variantName) {
    if (window.heroVariantManager) {
        return window.heroVariantManager.loadVariant(variantName, true);
    }
    return false;
};

window.getAvailableHeroVariants = function() {
    return window.heroVariantManager
        ? window.heroVariantManager.getAvailableVariants()
        : [];
};

// ===================================
// EXPORTS (si utilisé comme module)
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeroVariantManager;
}
