// ===================================
// THEME SWITCHER - LIGHT/DARK MODE
// Design Tech Futuriste Professionnel 2025
// ===================================
// Alice Sindayigaya - Portfolio DevOps & Cloud
// Gestion toggle thème avec persistance et transitions fluides
// ===================================

/**
 * Classe ThemeSwitcher
 * Gère le basculement entre mode clair et sombre
 */
class ThemeSwitcher {
    constructor() {
        this.theme = null;
        this.toggleButton = null;
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

        this.init();
    }

    /**
     * Initialisation du système de thème
     */
    init() {
        // 1. Déterminer le thème initial
        this.theme = this.getInitialTheme();

        // 2. Appliquer le thème immédiatement (avant DOMContentLoaded pour éviter le flash)
        this.applyTheme(this.theme, false);

        // 3. Créer le toggle button
        this.createToggleButton();

        // 4. Attacher les event listeners
        this.attachEventListeners();

        // 5. Logger le thème actif
        console.log(`✅ Theme Switcher initialisé: ${this.theme} mode`);
    }

    /**
     * Détermine le thème initial selon cet ordre de priorité:
     * 1. localStorage (choix utilisateur précédent)
     * 2. prefers-color-scheme (préférence système)
     * 3. dark (défaut)
     */
    getInitialTheme() {
        // Vérifier localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme;
        }

        // Vérifier prefers-color-scheme
        if (this.mediaQuery.matches) {
            return 'light';
        }

        // Défaut: dark mode
        return 'dark';
    }

    /**
     * Applique le thème à la page
     * @param {string} theme - 'light' ou 'dark'
     * @param {boolean} animate - Activer les transitions (défaut: true)
     */
    applyTheme(theme, animate = true) {
        const root = document.documentElement;

        // Désactiver temporairement les transitions si nécessaire
        if (!animate) {
            root.classList.add('loading');
        }

        // Appliquer l'attribut data-theme
        root.setAttribute('data-theme', theme);

        // Mettre à jour la meta theme-color pour mobile
        this.updateMetaThemeColor(theme);

        // Réactiver les transitions après un court délai
        if (!animate) {
            setTimeout(() => {
                root.classList.remove('loading');
            }, 50);
        }

        // Mettre à jour l'état du bouton
        this.updateButtonState(theme);
    }

    /**
     * Met à jour la couleur de la barre d'adresse mobile
     * @param {string} theme - 'light' ou 'dark'
     */
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');

        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.setAttribute('name', 'theme-color');
            document.head.appendChild(metaThemeColor);
        }

        // Couleur selon le thème
        const color = theme === 'dark' ? '#0A0E27' : '#F8FAFC';
        metaThemeColor.setAttribute('content', color);
    }

    /**
     * Crée le bouton toggle dans le header
     */
    createToggleButton() {
        // Chercher le conteneur nav-wrapper
        const navWrapper = document.querySelector('.nav-wrapper');
        if (!navWrapper) {
            console.error('❌ Élément .nav-wrapper introuvable');
            return;
        }

        // Créer le bouton
        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.id = 'themeToggle';
        button.setAttribute('aria-label', 'Changer le thème');
        button.setAttribute('title', 'Basculer entre mode clair et sombre');
        button.type = 'button';

        // SVG Icône Lune (Dark mode)
        const moonIcon = `
            <svg class="theme-icon theme-icon-dark" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"/>
            </svg>
        `;

        // SVG Icône Soleil (Light mode)
        const sunIcon = `
            <svg class="theme-icon theme-icon-light" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5" fill="currentColor"/>
                <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;

        button.innerHTML = moonIcon + sunIcon;

        // Insérer avant le bouton hamburger (nav-toggle)
        const navToggle = navWrapper.querySelector('.nav-toggle');
        if (navToggle) {
            navWrapper.insertBefore(button, navToggle);
        } else {
            navWrapper.appendChild(button);
        }

        this.toggleButton = button;

        // Mettre à jour l'état initial
        this.updateButtonState(this.theme);
    }

    /**
     * Met à jour l'apparence du bouton selon le thème actif
     * @param {string} theme - 'light' ou 'dark'
     */
    updateButtonState(theme) {
        if (!this.toggleButton) return;

        const darkIcon = this.toggleButton.querySelector('.theme-icon-dark');
        const lightIcon = this.toggleButton.querySelector('.theme-icon-light');

        if (theme === 'dark') {
            // Mode dark: afficher icône lune
            darkIcon.style.opacity = '1';
            darkIcon.style.transform = 'rotate(0deg) scale(1)';
            lightIcon.style.opacity = '0';
            lightIcon.style.transform = 'rotate(180deg) scale(0)';
            this.toggleButton.setAttribute('aria-label', 'Passer en mode clair');
        } else {
            // Mode light: afficher icône soleil
            darkIcon.style.opacity = '0';
            darkIcon.style.transform = 'rotate(-180deg) scale(0)';
            lightIcon.style.opacity = '1';
            lightIcon.style.transform = 'rotate(0deg) scale(1)';
            this.toggleButton.setAttribute('aria-label', 'Passer en mode sombre');
        }
    }

    /**
     * Bascule entre light et dark
     */
    toggle() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.theme, true);
        this.saveTheme(this.theme);

        // Dispatch custom event pour informer d'autres scripts
        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: this.theme }
        }));

        console.log(`🎨 Thème changé: ${this.theme} mode`);
    }

    /**
     * Sauvegarde le thème dans localStorage
     * @param {string} theme - 'light' ou 'dark'
     */
    saveTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.warn('⚠️ Impossible de sauvegarder le thème dans localStorage', e);
        }
    }

    /**
     * Attache les event listeners
     */
    attachEventListeners() {
        // Click sur le bouton toggle
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', () => {
                this.toggle();
            });
        }

        // Écouter les changements de prefers-color-scheme
        this.mediaQuery.addEventListener('change', (e) => {
            // Ne changer automatiquement que si l'utilisateur n'a pas de préférence sauvegardée
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'light' : 'dark';
                this.theme = newTheme;
                this.applyTheme(newTheme, true);
                console.log(`🎨 Thème automatique changé (system): ${newTheme} mode`);
            }
        });

        // Support clavier (Ctrl/Cmd + Shift + L pour toggle)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    /**
     * Obtient le thème actuel
     * @returns {string} 'light' ou 'dark'
     */
    getCurrentTheme() {
        return this.theme;
    }

    /**
     * Force un thème spécifique
     * @param {string} theme - 'light' ou 'dark'
     */
    setTheme(theme) {
        if (theme !== 'light' && theme !== 'dark') {
            console.error('❌ Thème invalide. Utiliser "light" ou "dark"');
            return;
        }

        this.theme = theme;
        this.applyTheme(theme, true);
        this.saveTheme(theme);
    }
}

// ===================================
// INITIALISATION AUTOMATIQUE
// ===================================

// Initialiser immédiatement (avant DOMContentLoaded)
// pour éviter le flash de contenu
let themeSwitcher;

// Si le DOM est déjà chargé, initialiser immédiatement
if (document.readyState === 'loading') {
    // DOM pas encore chargé, attendre
    document.addEventListener('DOMContentLoaded', () => {
        themeSwitcher = new ThemeSwitcher();

        // Exposer globalement pour accès depuis d'autres scripts
        window.themeSwitcher = themeSwitcher;
    });
} else {
    // DOM déjà chargé, initialiser immédiatement
    themeSwitcher = new ThemeSwitcher();
    window.themeSwitcher = themeSwitcher;
}

// ===================================
// API GLOBALE
// ===================================

/**
 * Exposer des fonctions utilitaires globales
 */
window.getTheme = function() {
    return window.themeSwitcher ? window.themeSwitcher.getCurrentTheme() : 'dark';
};

window.setTheme = function(theme) {
    if (window.themeSwitcher) {
        window.themeSwitcher.setTheme(theme);
    }
};

window.toggleTheme = function() {
    if (window.themeSwitcher) {
        window.themeSwitcher.toggle();
    }
};

// ===================================
// EXPORTS (si utilisé comme module)
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeSwitcher;
}
