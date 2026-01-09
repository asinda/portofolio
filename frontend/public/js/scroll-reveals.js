// ===================================
// SCROLL REVEALS - ANIMATIONS COMPLEXES
// Design Tech Futuriste Professionnel 2025
// ===================================
// Alice Sindayigaya - Portfolio DevOps & Cloud
// Clip-path, Text morphing, Stagger, Progress circle, Section indicators
// ===================================

/**
 * Classe ScrollReveals
 * Gère toutes les animations de révélation au scroll
 */
class ScrollReveals {
    constructor() {
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.init();
    }

    /**
     * Initialisation
     */
    init() {
        if (this.reducedMotion) {
            console.log('⚠️ Scroll reveals désactivés (prefers-reduced-motion)');
            return;
        }

        // Vérifier GSAP et ScrollTrigger
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.error('❌ GSAP ou ScrollTrigger non chargé');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // Initialiser les différentes animations
        this.initClipPathReveals();
        this.initTextMorphing();
        this.initStaggerGridReveals();
        this.initScrollProgressCircle();
        this.initSectionIndicators();
        this.initFadeInAnimations();

        console.log('✅ ScrollReveals initialisé');
    }

    /**
     * Clip-path reveal animations
     */
    initClipPathReveals() {
        const elements = document.querySelectorAll('.reveal-clip, .cv-item, .timeline-item');

        elements.forEach((el, index) => {
            gsap.from(el, {
                clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    end: 'top 60%',
                    scrub: 1,
                    once: true
                }
            });
        });

        console.log(`🎬 Clip-path reveals: ${elements.length} éléments`);
    }

    /**
     * Text morphing avec SplitType
     */
    initTextMorphing() {
        // Vérifier que SplitType est chargé
        if (typeof SplitType === 'undefined') {
            console.warn('⚠️ SplitType non chargé, text morphing désactivé');
            return;
        }

        const titles = document.querySelectorAll('.section-title, h2.animate-text');

        titles.forEach(title => {
            // Découper le texte en caractères
            const split = new SplitType(title, { types: 'chars' });

            // Animer chaque caractère
            gsap.from(split.chars, {
                opacity: 0,
                scale: 0,
                y: 50,
                rotationX: -90,
                stagger: 0.03,
                duration: 0.6,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    once: true
                }
            });
        });

        console.log(`✍️ Text morphing: ${titles.length} titres`);
    }

    /**
     * Stagger grid reveal pour projets/skills
     */
    initStaggerGridReveals() {
        // Projets grid
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            const projectCards = projectsGrid.querySelectorAll('.project-card');

            gsap.from(projectCards, {
                opacity: 0,
                y: 100,
                scale: 0.8,
                rotation: 5,
                stagger: {
                    amount: 0.8,
                    grid: 'auto',
                    from: 'start'
                },
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: projectsGrid,
                    start: 'top 80%',
                    once: true
                }
            });
        }

        // Skills grid
        const skillsCategories = document.querySelectorAll('.skills-category');
        skillsCategories.forEach(category => {
            const skills = category.querySelectorAll('.skill-item, .skill-tag');

            gsap.from(skills, {
                opacity: 0,
                scale: 0,
                rotation: 180,
                stagger: 0.05,
                duration: 0.5,
                ease: 'back.out(2)',
                scrollTrigger: {
                    trigger: category,
                    start: 'top 85%',
                    once: true
                }
            });
        });

        console.log('📊 Stagger grids initialisés');
    }

    /**
     * Scroll progress circle
     */
    initScrollProgressCircle() {
        // Créer le conteneur du progress circle
        const progressContainer = document.createElement('div');
        progressContainer.className = 'scroll-progress-circle';
        progressContainer.innerHTML = `
            <svg width="60" height="60" viewBox="0 0 60 60">
                <circle class="progress-ring-bg" r="26" cx="30" cy="30"
                        stroke="var(--bg-card)" stroke-width="4" fill="transparent"></circle>
                <circle class="progress-ring" r="26" cx="30" cy="30"
                        stroke="var(--primary)" stroke-width="4" fill="transparent"
                        transform="rotate(-90 30 30)"></circle>
            </svg>
            <span class="progress-text">0%</span>
        `;

        document.body.appendChild(progressContainer);

        // Calculer circonférence
        const circle = progressContainer.querySelector('.progress-ring');
        const circumference = 2 * Math.PI * 26;
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;

        // Texte
        const text = progressContainer.querySelector('.progress-text');

        // Update au scroll
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            const offset = circumference - (scrollPercent / 100) * circumference;

            circle.style.strokeDashoffset = offset;
            text.textContent = Math.round(scrollPercent) + '%';

            // Visibilité (masquer en haut de page)
            if (scrollPercent > 5) {
                progressContainer.classList.add('visible');
            } else {
                progressContainer.classList.remove('visible');
            }
        });

        // Click pour retour en haut
        progressContainer.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        console.log('⭕ Scroll progress circle créé');
    }

    /**
     * Section indicators (dots navigation)
     */
    initSectionIndicators() {
        const sections = document.querySelectorAll('section[id]');
        if (sections.length === 0) return;

        // Créer le conteneur
        const indicatorsContainer = document.createElement('nav');
        indicatorsContainer.className = 'section-indicators';
        indicatorsContainer.setAttribute('aria-label', 'Navigation rapide sections');

        // Créer un dot par section
        sections.forEach(section => {
            const id = section.getAttribute('id');
            const title = section.querySelector('h1, h2')?.textContent || id;

            const indicator = document.createElement('a');
            indicator.href = `#${id}`;
            indicator.className = 'indicator';
            indicator.setAttribute('aria-label', title);
            indicator.setAttribute('data-tooltip', title);
            indicator.setAttribute('data-section', id);

            indicatorsContainer.appendChild(indicator);
        });

        document.body.appendChild(indicatorsContainer);

        // Activer l'indicator correspondant au scroll
        this.updateActiveIndicator(sections);

        window.addEventListener('scroll', () => {
            this.updateActiveIndicator(sections);
        });

        console.log(`📍 Section indicators: ${sections.length} sections`);
    }

    /**
     * Met à jour l'indicator actif selon la section visible
     * @param {NodeList} sections - Liste des sections
     */
    updateActiveIndicator(sections) {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
                currentSection = section.getAttribute('id');
            }
        });

        // Mettre à jour les classes
        document.querySelectorAll('.indicator').forEach(indicator => {
            indicator.classList.remove('active');
            if (indicator.getAttribute('data-section') === currentSection) {
                indicator.classList.add('active');
            }
        });
    }

    /**
     * Fade in animations génériques
     */
    initFadeInAnimations() {
        const fadeElements = document.querySelectorAll(
            '.service-card, .blog-card, .stat-item, .about-content'
        );

        fadeElements.forEach((el, index) => {
            gsap.from(el, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    once: true
                },
                delay: index * 0.1
            });
        });

        console.log(`💫 Fade in animations: ${fadeElements.length} éléments`);
    }

    /**
     * Rafraîchit tous les ScrollTriggers
     */
    refresh() {
        ScrollTrigger.refresh();
        console.log('🔄 ScrollReveals rafraîchi');
    }

    /**
     * Détruit toutes les animations
     */
    destroy() {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());

        // Supprimer les éléments créés
        document.querySelector('.scroll-progress-circle')?.remove();
        document.querySelector('.section-indicators')?.remove();

        console.log('✅ ScrollReveals détruit');
    }
}

// ===================================
// INITIALISATION AUTOMATIQUE
// ===================================

let scrollReveals;

document.addEventListener('DOMContentLoaded', () => {
    // Vérifier que GSAP est chargé
    if (typeof gsap === 'undefined') {
        console.error('❌ GSAP non chargé, scroll reveals désactivés');
        return;
    }

    // Petite pause pour laisser tout s'initialiser
    setTimeout(() => {
        scrollReveals = new ScrollReveals();

        // Exposer globalement
        window.scrollReveals = scrollReveals;
    }, 200);
});

// Rafraîchir après resize (debounced)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (scrollReveals) {
            scrollReveals.refresh();
        }
    }, 300);
});

// ===================================
// EXPORTS (si utilisé comme module)
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollReveals;
}
