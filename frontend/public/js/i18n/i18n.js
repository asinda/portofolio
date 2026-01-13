/**
 * ===================================
 * I18N SYSTEM - CORE CLASS
 * Système d'internationalisation bilingue FR/EN
 * Portfolio Alice Sindayigaya - 2025
 * ===================================
 */

/**
 * Classe principale pour gérer l'internationalisation
 * @class I18n
 */
class I18n {
    /**
     * Constructeur - Initialise le système i18n
     */
    constructor() {
        this.translations = {}; // Objet contenant toutes les traductions {fr: {...}, en: {...}}
        this.currentLang = null; // Langue courante ('fr' ou 'en')
        this.defaultLang = 'fr'; // Langue par défaut (fallback)
        this.supportedLangs = ['fr', 'en']; // Langues supportées

        // Clé localStorage pour sauvegarder la préférence
        this.storageKey = 'portfolio_language';

        // Initialiser automatiquement
        this.init();
    }

    /**
     * Initialisation du système i18n
     * 1. Charger les traductions
     * 2. Détecter la langue
     * 3. Appliquer la langue détectée
     */
    async init() {
        try {
            // Charger toutes les traductions en parallèle
            await this.loadTranslations();

            // Détecter la langue à utiliser
            const lang = this.detectLanguage();

            // Appliquer la langue (sans animation au chargement initial)
            await this.applyLanguage(lang, false);

            // Logger pour debug
            console.log(`✅ i18n initialisé: langue='${this.currentLang}'`);
        } catch (error) {
            console.error('❌ Erreur initialisation i18n:', error);
            // Fallback sur langue par défaut
            this.currentLang = this.defaultLang;
        }
    }

    /**
     * Charger toutes les traductions (import dynamique ES6)
     * Charge fr.js et en.js en parallèle pour optimiser performance
     */
    async loadTranslations() {
        try {
            // Import dynamique des modules de traduction
            const [frModule, enModule] = await Promise.all([
                import('./locales/fr.js'),
                import('./locales/en.js')
            ]);

            // Stocker les traductions (accès via .default pour export default)
            this.translations.fr = frModule.default;
            this.translations.en = enModule.default;

            console.log('✅ Traductions chargées:', Object.keys(this.translations));
        } catch (error) {
            console.error('❌ Erreur chargement traductions:', error);
            throw error;
        }
    }

    /**
     * Détecter la langue à utiliser
     * Priorité: localStorage > navigateur > défaut
     * @returns {string} Code langue ('fr' ou 'en')
     */
    detectLanguage() {
        // 1. Vérifier localStorage (préférence utilisateur)
        const storedLang = localStorage.getItem(this.storageKey);
        if (storedLang && this.supportedLangs.includes(storedLang)) {
            console.log(`📦 Langue depuis localStorage: ${storedLang}`);
            return storedLang;
        }

        // 2. Détecter langue navigateur
        const browserLang = navigator.language || navigator.userLanguage;
        const browserLangCode = browserLang.split('-')[0]; // 'fr-FR' → 'fr'

        if (this.supportedLangs.includes(browserLangCode)) {
            console.log(`🌐 Langue depuis navigateur: ${browserLangCode}`);
            return browserLangCode;
        }

        // 3. Fallback sur langue par défaut
        console.log(`🔄 Langue par défaut: ${this.defaultLang}`);
        return this.defaultLang;
    }

    /**
     * Appliquer une langue (change tout le contenu)
     * @param {string} lang - Code langue ('fr' ou 'en')
     * @param {boolean} animate - Activer animations de transition
     */
    async applyLanguage(lang, animate = true) {
        // Vérifier que la langue est supportée
        if (!this.supportedLangs.includes(lang)) {
            console.warn(`⚠️ Langue non supportée: ${lang}, fallback sur ${this.defaultLang}`);
            lang = this.defaultLang;
        }

        // Vérifier que les traductions sont chargées
        if (!this.translations[lang]) {
            console.error(`❌ Traductions manquantes pour: ${lang}`);
            return;
        }

        // Sauvegarder langue courante
        this.currentLang = lang;

        // Ajouter classe temporaire pour désactiver transitions si pas d'animation
        if (!animate) {
            document.documentElement.classList.add('i18n-loading');
        }

        // 1. Mettre à jour attribut lang sur <html>
        document.documentElement.setAttribute('lang', lang);

        // 2. Traduire tous les éléments [data-i18n]
        this.translateElements();

        // 3. Mettre à jour les attributs (aria-label, placeholder, title)
        this.updateAttributes();

        // 4. Mettre à jour les meta tags SEO
        this.updateMetaTags(lang);

        // 5. Sauvegarder préférence dans localStorage
        this.saveLanguage(lang);

        // 6. Émettre event custom pour listeners externes
        window.dispatchEvent(new CustomEvent('languagechange', {
            detail: { language: lang }
        }));

        // Retirer classe temporaire après transition
        if (!animate) {
            setTimeout(() => {
                document.documentElement.classList.remove('i18n-loading');
            }, 50);
        }

        console.log(`✅ Langue appliquée: ${lang}`);
    }

    /**
     * Traduire tous les éléments avec attribut [data-i18n]
     */
    translateElements() {
        const elements = document.querySelectorAll('[data-i18n]');

        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            if (translation) {
                element.textContent = translation;
            } else {
                console.warn(`⚠️ Traduction manquante pour clé: ${key}`);
            }
        });

        console.log(`✅ ${elements.length} éléments traduits`);
    }

    /**
     * Mettre à jour les attributs spéciaux (aria-label, placeholder, title)
     */
    updateAttributes() {
        // 1. Aria-label
        document.querySelectorAll('[data-i18n-aria]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria');
            const translation = this.t(key);
            if (translation) {
                element.setAttribute('aria-label', translation);
            }
        });

        // 2. Placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            if (translation) {
                element.setAttribute('placeholder', translation);
            }
        });

        // 3. Title
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.t(key);
            if (translation) {
                element.setAttribute('title', translation);
            }
        });
    }

    /**
     * Mettre à jour les meta tags pour SEO multilingue
     * @param {string} lang - Code langue
     */
    updateMetaTags(lang) {
        const translations = this.translations[lang];
        if (!translations || !translations.meta) return;

        const meta = translations.meta;

        // 1. Title
        if (meta.title) {
            document.title = meta.title;
        }

        // 2. Meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && meta.description) {
            metaDesc.setAttribute('content', meta.description);
        }

        // 3. Meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords && meta.keywords) {
            metaKeywords.setAttribute('content', meta.keywords);
        }

        // 4. Open Graph title
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && meta.title) {
            ogTitle.setAttribute('content', meta.title);
        }

        // 5. Open Graph description
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc && meta.description) {
            ogDesc.setAttribute('content', meta.description);
        }

        // 6. Open Graph locale
        const ogLocale = document.querySelector('meta[property="og:locale"]');
        if (ogLocale) {
            const locale = lang === 'fr' ? 'fr_FR' : 'en_US';
            ogLocale.setAttribute('content', locale);
        }

        // 7. Twitter title
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle && meta.title) {
            twitterTitle.setAttribute('content', meta.title);
        }

        // 8. Twitter description
        const twitterDesc = document.querySelector('meta[name="twitter:description"]');
        if (twitterDesc && meta.description) {
            twitterDesc.setAttribute('content', meta.description);
        }

        console.log('✅ Meta tags mis à jour pour SEO');
    }

    /**
     * Fonction de traduction principale
     * Supporte la notation dot (ex: 'nav.home') et interpolation (ex: '{{count}}')
     * @param {string} key - Clé de traduction (notation dot: 'section.subsection.key')
     * @param {object} params - Paramètres pour interpolation (ex: {count: 5})
     * @returns {string} Texte traduit ou clé si non trouvée
     */
    t(key, params = {}) {
        // Vérifier que les traductions existent
        if (!this.translations[this.currentLang]) {
            console.warn(`⚠️ Traductions manquantes pour langue: ${this.currentLang}`);
            return key;
        }

        // Naviguer dans l'objet de traductions avec notation dot
        const keys = key.split('.');
        let value = this.translations[this.currentLang];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                console.warn(`⚠️ Clé de traduction non trouvée: ${key}`);
                return key; // Retourner la clé si non trouvée
            }
        }

        // Si la valeur est un objet ou array, ne pas traduire (erreur)
        if (typeof value === 'object') {
            console.warn(`⚠️ Clé invalide (objet/array): ${key}`);
            return key;
        }

        // Interpolation des paramètres (remplacer {{param}} par valeur)
        let result = value.toString();
        Object.keys(params).forEach(param => {
            const regex = new RegExp(`{{${param}}}`, 'g');
            result = result.replace(regex, params[param]);
        });

        return result;
    }

    /**
     * Changer de langue (toggle FR ↔ EN)
     * @param {string} lang - Code langue cible ('fr' ou 'en')
     */
    async switchLanguage(lang) {
        if (lang === this.currentLang) {
            console.log(`ℹ️ Langue déjà active: ${lang}`);
            return;
        }

        console.log(`🔄 Changement de langue: ${this.currentLang} → ${lang}`);
        await this.applyLanguage(lang, true);
    }

    /**
     * Obtenir la langue courante
     * @returns {string} Code langue courante
     */
    getCurrentLanguage() {
        return this.currentLang;
    }

    /**
     * Sauvegarder la langue dans localStorage
     * @param {string} lang - Code langue à sauvegarder
     */
    saveLanguage(lang) {
        try {
            localStorage.setItem(this.storageKey, lang);
            console.log(`💾 Langue sauvegardée: ${lang}`);
        } catch (error) {
            console.warn('⚠️ localStorage non disponible:', error);
        }
    }

    /**
     * Helper pour formater les dates selon la locale
     * @param {Date} date - Date à formater
     * @param {object} options - Options Intl.DateTimeFormat
     * @returns {string} Date formatée
     */
    formatDate(date, options = {}) {
        const locale = this.currentLang === 'fr' ? 'fr-FR' : 'en-US';
        return new Intl.DateTimeFormat(locale, options).format(date);
    }

    /**
     * Helper pour formater les nombres selon la locale
     * @param {number} number - Nombre à formater
     * @param {object} options - Options Intl.NumberFormat
     * @returns {string} Nombre formaté
     */
    formatNumber(number, options = {}) {
        const locale = this.currentLang === 'fr' ? 'fr-FR' : 'en-US';
        return new Intl.NumberFormat(locale, options).format(number);
    }
}

// Export par défaut (ES6 module)
export default I18n;
