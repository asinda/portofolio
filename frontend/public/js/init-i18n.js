/**
 * ===================================
 * I18N INITIALIZATION
 * Initialisation du système d'internationalisation
 * Portfolio Alice Sindayigaya - 2025
 * ===================================
 */

// Import des modules i18n
import I18n from './i18n/i18n.js';
import LangSwitcher from './lang-switcher.js';

/**
 * Fonction d'initialisation principale
 */
async function initI18n() {
    try {
        console.log('🌐 Initialisation du système i18n...');

        // Créer l'instance I18n
        const i18n = new I18n();

        // Attendre que i18n soit initialisé
        // (l'initialisation se fait dans le constructeur via init())
        // On attend un peu pour s'assurer que tout est chargé
        await new Promise(resolve => setTimeout(resolve, 100));

        // Créer le composant LangSwitcher
        const langSwitcher = new LangSwitcher(i18n);

        // Exposer globalement pour debugging (optionnel)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            window.i18n = i18n;
            window.langSwitcher = langSwitcher;
            console.log('🔧 Mode debug: i18n et langSwitcher exposés globalement');
        }

        console.log('✅ Système i18n initialisé avec succès');
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation i18n:', error);
    }
}

// Lancer l'initialisation au chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
} else {
    initI18n();
}
