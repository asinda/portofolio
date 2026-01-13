/**
 * ===================================
 * LANG SWITCHER COMPONENT
 * Composant de changement de langue FR/EN
 * Portfolio Alice Sindayigaya - 2025
 * ===================================
 */

/**
 * Classe LangSwitcher - Gère le bouton de changement de langue
 * @class LangSwitcher
 */
class LangSwitcher {
    /**
     * Constructeur - Initialise le composant
     * @param {I18n} i18nInstance - Instance du système i18n
     */
    constructor(i18nInstance) {
        if (!i18nInstance) {
            throw new Error('LangSwitcher nécessite une instance I18n');
        }

        this.i18n = i18nInstance;
        this.container = null;
        this.buttons = {};

        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /**
     * Initialisation du composant
     */
    init() {
        // Créer l'interface du switcher
        this.createSwitcher();

        // Écouter les changements de langue depuis l'extérieur
        window.addEventListener('languagechange', (e) => {
            this.updateUI(e.detail.language);
        });

        // Mettre à jour l'UI avec la langue courante
        this.updateUI(this.i18n.getCurrentLanguage());

        console.log('✅ LangSwitcher initialisé');
    }

    /**
     * Créer l'interface du switcher (bouton toggle)
     */
    createSwitcher() {
        // Trouver la navigation
        const nav = document.querySelector('.nav');
        if (!nav) {
            console.error('❌ Navigation non trouvée, impossible d\'ajouter le LangSwitcher');
            return;
        }

        // Créer le conteneur du switcher
        this.container = document.createElement('div');
        this.container.className = 'lang-switcher';
        this.container.setAttribute('role', 'group');
        this.container.setAttribute('aria-label', 'Language selector');

        // Créer les boutons FR et EN
        this.buttons.fr = this.createButton('fr', 'FR', 'Français');
        this.buttons.en = this.createButton('en', 'EN', 'English');

        // Ajouter les boutons au conteneur
        this.container.appendChild(this.buttons.fr);
        this.container.appendChild(this.buttons.en);

        // Insérer le switcher après la nav (dans le nav-wrapper)
        const navWrapper = document.querySelector('.nav-wrapper');
        if (navWrapper) {
            // Insérer avant le bouton toggle du menu mobile
            const navToggle = document.querySelector('.nav-toggle');
            if (navToggle) {
                navWrapper.insertBefore(this.container, navToggle);
            } else {
                navWrapper.appendChild(this.container);
            }
        }

        console.log('✅ Interface LangSwitcher créée');
    }

    /**
     * Créer un bouton de langue
     * @param {string} lang - Code langue ('fr' ou 'en')
     * @param {string} text - Texte du bouton ('FR' ou 'EN')
     * @param {string} ariaLabel - Label d'accessibilité
     * @returns {HTMLButtonElement} Bouton créé
     */
    createButton(lang, text, ariaLabel) {
        const button = document.createElement('button');
        button.className = 'lang-btn';
        button.setAttribute('data-lang', lang);
        button.setAttribute('aria-label', ariaLabel);
        button.textContent = text;

        // Écouter le clic
        button.addEventListener('click', () => this.switchLanguage(lang));

        return button;
    }

    /**
     * Changer de langue
     * @param {string} lang - Code langue cible
     */
    async switchLanguage(lang) {
        // Vérifier que c'est une langue différente
        if (lang === this.i18n.getCurrentLanguage()) {
            console.log(`ℹ️ Langue déjà active: ${lang}`);
            return;
        }

        // Ajouter une classe de chargement
        document.body.classList.add('lang-switching');

        try {
            // Effectuer le changement via i18n
            await this.i18n.switchLanguage(lang);

            // Mettre à jour l'UI
            this.updateUI(lang);

            console.log(`✅ Langue changée: ${lang}`);
        } catch (error) {
            console.error('❌ Erreur lors du changement de langue:', error);
        } finally {
            // Retirer la classe de chargement
            setTimeout(() => {
                document.body.classList.remove('lang-switching');
            }, 300);
        }
    }

    /**
     * Mettre à jour l'UI du switcher (bouton actif)
     * @param {string} activeLang - Langue active
     */
    updateUI(activeLang) {
        // Retirer la classe active de tous les boutons
        Object.values(this.buttons).forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });

        // Activer le bouton de la langue courante
        if (this.buttons[activeLang]) {
            this.buttons[activeLang].classList.add('active');
            this.buttons[activeLang].setAttribute('aria-pressed', 'true');
        }
    }

    /**
     * Obtenir la langue courante
     * @returns {string} Code langue courante
     */
    getCurrentLanguage() {
        return this.i18n.getCurrentLanguage();
    }

    /**
     * Détruire le composant (cleanup)
     */
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        console.log('✅ LangSwitcher détruit');
    }
}

// Export par défaut (ES6 module)
export default LangSwitcher;
