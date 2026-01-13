/**
 * ===================================
 * I18N BUNDLE - Version sans modules ES6
 * Tout le code i18n dans un seul fichier
 * Portfolio Alice Sindayigaya - 2025
 * ===================================
 */

(function() {
    'use strict';

    // ============================================
    // TRADUCTIONS FR
    // ============================================
    const translationsFR = {
        meta: {
            title: "Alice Sindayigaya | Ingénieure DevOps & Cloud | AWS, Kubernetes, Terraform",
            description: "Ingénieure DevOps avec 7+ ans d'expérience en automatisation, infrastructure cloud (AWS, Azure, GCP) et CI/CD. Experte en Kubernetes, Docker, Terraform et Jenkins.",
            keywords: "DevOps, Cloud Engineer, AWS, Kubernetes, Docker, Terraform, CI/CD, Jenkins, Infrastructure as Code, Automation"
        },
        nav: {
            home: "Accueil",
            cv: "CV",
            projects: "Projets",
            blog: "Blog & Tutos"
        },
        hero: {
            label: "Ingénieure DevOps",
            greeting: "Bonjour, je suis",
            name: "Alice Sindayigaya",
            title: "Architecte Cloud & DevOps",
            description: "7+ ans d'expérience en automatisation, CI/CD et infrastructure cloud",
            cta: "Découvrir mon CV",
            cards: {
                experience: "Années d'expérience",
                projects: "Projets réalisés",
                certifications: "Certifications"
            }
        },
        about: {
            label: "À propos de moi",
            title: "Ingénieure DevOps passionnée par l'innovation cloud",
            paragraph1: "Avec plus de 7 ans d'expérience, je me spécialise dans la création et l'optimisation d'infrastructures cloud scalables et sécurisées.",
            paragraph2: "Mon expertise couvre l'automatisation complète des pipelines CI/CD, la conteneurisation avec Docker et Kubernetes, et l'Infrastructure as Code avec Terraform.",
            stats: {
                experience: "Années d'expérience",
                projects: "Projets cloud",
                certifications: "Certifications",
                availability: "Disponible pour projets"
            }
        }
    };

    // ============================================
    // TRADUCTIONS EN
    // ============================================
    const translationsEN = {
        meta: {
            title: "Alice Sindayigaya | DevOps & Cloud Engineer | AWS, Kubernetes, Terraform",
            description: "DevOps Engineer with 7+ years of experience in automation, cloud infrastructure (AWS, Azure, GCP) and CI/CD. Expert in Kubernetes, Docker, Terraform and Jenkins.",
            keywords: "DevOps, Cloud Engineer, AWS, Kubernetes, Docker, Terraform, CI/CD, Jenkins, Infrastructure as Code, Automation"
        },
        nav: {
            home: "Home",
            cv: "Resume",
            projects: "Projects",
            blog: "Blog & Tutorials"
        },
        hero: {
            label: "DevOps Engineer",
            greeting: "Hi, I'm",
            name: "Alice Sindayigaya",
            title: "Cloud & DevOps Architect",
            description: "7+ years of experience in automation, CI/CD and cloud infrastructure",
            cta: "View my Resume",
            cards: {
                experience: "Years of experience",
                projects: "Completed projects",
                certifications: "Certifications"
            }
        },
        about: {
            label: "About Me",
            title: "DevOps Engineer passionate about cloud innovation",
            paragraph1: "With over 7 years of experience, I specialize in creating and optimizing scalable and secure cloud infrastructures.",
            paragraph2: "My expertise covers complete CI/CD pipeline automation, containerization with Docker and Kubernetes, and Infrastructure as Code with Terraform.",
            stats: {
                experience: "Years of experience",
                projects: "Cloud projects",
                certifications: "Certifications",
                availability: "Available for projects"
            }
        }
    };

    // ============================================
    // CLASSE I18N
    // ============================================
    class I18n {
        constructor() {
            this.translations = { fr: translationsFR, en: translationsEN };
            this.currentLang = null;
            this.defaultLang = 'fr';
            this.init();
        }

        init() {
            console.log('🌐 Initialisation du système i18n...');
            const savedLang = localStorage.getItem('portfolio_language');
            const browserLang = navigator.language.split('-')[0];
            const lang = savedLang || (browserLang === 'en' ? 'en' : 'fr');

            this.currentLang = lang;
            this.applyLanguage(lang);
            console.log('✅ i18n initialisé:', lang);
        }

        t(key, vars = {}) {
            const keys = key.split('.');
            let value = this.translations[this.currentLang];

            for (const k of keys) {
                if (value && typeof value === 'object') {
                    value = value[k];
                } else {
                    return key;
                }
            }

            if (typeof value === 'string') {
                return value.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
                    return vars[varName] || match;
                });
            }

            return key;
        }

        switchLanguage(lang) {
            if (lang !== 'fr' && lang !== 'en') return;
            this.currentLang = lang;
            localStorage.setItem('portfolio_language', lang);
            this.applyLanguage(lang);
            window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: lang } }));
        }

        applyLanguage(lang) {
            document.documentElement.lang = lang;
            this.translateElements();
            this.updateMetaTags();
        }

        translateElements() {
            const elements = document.querySelectorAll('[data-i18n]');
            elements.forEach(el => {
                const key = el.getAttribute('data-i18n');
                el.textContent = this.t(key);
            });
        }

        updateMetaTags() {
            const title = this.t('meta.title');
            const description = this.t('meta.description');

            document.title = title;

            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', description);

            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.setAttribute('content', title);

            const ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) ogDesc.setAttribute('content', description);
        }

        getCurrentLanguage() {
            return this.currentLang;
        }
    }

    // ============================================
    // COMPOSANT LANG SWITCHER
    // ============================================
    class LangSwitcher {
        constructor(i18nInstance) {
            this.i18n = i18nInstance;
            this.init();
        }

        init() {
            this.createSwitcher();
            console.log('✅ LangSwitcher initialisé');
        }

        createSwitcher() {
            const header = document.querySelector('.header .container');
            if (!header) return;

            const switcherHTML = `
                <div class="lang-switcher">
                    <button class="lang-btn" data-lang="fr" aria-label="Français">FR</button>
                    <button class="lang-btn" data-lang="en" aria-label="English">EN</button>
                </div>
            `;

            const navToggle = header.querySelector('.nav-toggle');
            if (navToggle) {
                navToggle.insertAdjacentHTML('beforebegin', switcherHTML);
            } else {
                header.insertAdjacentHTML('beforeend', switcherHTML);
            }

            this.attachEvents();
            this.updateUI(this.i18n.getCurrentLanguage());
        }

        attachEvents() {
            const buttons = document.querySelectorAll('.lang-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const lang = btn.getAttribute('data-lang');
                    this.switchLanguage(lang);
                });
            });
        }

        switchLanguage(lang) {
            this.i18n.switchLanguage(lang);
            this.updateUI(lang);
        }

        updateUI(activeLang) {
            const buttons = document.querySelectorAll('.lang-btn');
            buttons.forEach(btn => {
                const btnLang = btn.getAttribute('data-lang');
                if (btnLang === activeLang) {
                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');
                } else {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                }
            });
        }
    }

    // ============================================
    // INITIALISATION
    // ============================================
    function initI18n() {
        try {
            console.log('🌐 Initialisation du système i18n (bundle)...');
            const i18n = new I18n();
            const langSwitcher = new LangSwitcher(i18n);

            // Exposer globalement pour debugging
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                window.i18n = i18n;
                window.langSwitcher = langSwitcher;
            }

            console.log('✅ Système i18n initialisé avec succès');
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation i18n:', error);
        }
    }

    // Lancer l'initialisation
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initI18n);
    } else {
        initI18n();
    }
})();
