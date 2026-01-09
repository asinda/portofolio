// ===================================
// MICRO-INTERACTIONS AVANCÉES
// Design Tech Futuriste Professionnel 2025
// ===================================
// Alice Sindayigaya - Portfolio DevOps & Cloud
// Ripple effect, Magnetic buttons, Glare tracking, etc.
// ===================================

/**
 * Classe MicroInteractions
 * Gère toutes les interactions micro de la page
 */
class MicroInteractions {
    constructor() {
        this.isMobile = window.innerWidth < 768;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.init();
    }

    /**
     * Initialisation de toutes les micro-interactions
     */
    init() {
        if (this.reducedMotion) {
            console.log('⚠️ Micro-interactions désactivées (prefers-reduced-motion)');
            return;
        }

        // Ripple effect sur tous les boutons
        this.initRippleEffect();

        // Magnetic effect étendu (desktop uniquement)
        if (!this.isMobile) {
            this.initMagneticEffect();
        }

        // Glare tracking sur cards
        if (!this.isMobile) {
            this.initGlareTracking();
        }

        // Smooth scroll amélioré
        this.initSmoothScroll();

        // Tooltips dynamiques
        this.initTooltips();

        console.log('✅ Micro-interactions initialisées');
    }

    /**
     * Ripple effect sur click
     */
    initRippleEffect() {
        // Sélectionner tous les éléments cliquables
        const elements = document.querySelectorAll('.btn, .project-card, .service-card, .hero-card, .blog-card');

        elements.forEach(element => {
            // Ajouter classe ripple-container
            element.classList.add('ripple-container');

            element.addEventListener('click', (e) => {
                this.createRipple(e, element);
            });
        });
    }

    /**
     * Crée l'effet ripple
     * @param {Event} e - Événement click
     * @param {HTMLElement} element - Élément parent
     */
    createRipple(e, element) {
        // Créer l'élément ripple
        const ripple = document.createElement('span');
        ripple.className = 'ripple';

        // Calculer la position et la taille
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
        `;

        // Ajouter au DOM
        element.appendChild(ripple);

        // Supprimer après animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Magnetic effect étendu
     */
    initMagneticEffect() {
        const elements = document.querySelectorAll(
            '.btn:not(.no-magnetic), .project-card, .service-card, .hero-card, .back-to-top'
        );

        elements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add('magnetic-active');
            });

            element.addEventListener('mousemove', (e) => {
                if (!element.classList.contains('magnetic-active')) return;

                this.applyMagneticEffect(e, element);
            });

            element.addEventListener('mouseleave', () => {
                element.classList.remove('magnetic-active');
                this.resetMagneticEffect(element);
            });
        });
    }

    /**
     * Applique l'effet magnetic
     * @param {Event} e - Événement mousemove
     * @param {HTMLElement} element - Élément
     */
    applyMagneticEffect(e, element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Distance de la souris au centre
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        // Intensité selon type d'élément
        let strength = 0.2;
        if (element.classList.contains('btn')) {
            strength = 0.3;
        } else if (element.classList.contains('back-to-top')) {
            strength = 0.4;
        }

        // Appliquer transformation
        const x = deltaX * strength;
        const y = deltaY * strength;

        element.style.transform = `translate(${x}px, ${y}px)`;
    }

    /**
     * Réinitialise l'effet magnetic
     * @param {HTMLElement} element - Élément
     */
    resetMagneticEffect(element) {
        element.style.transform = '';
        element.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';

        setTimeout(() => {
            element.style.transition = '';
        }, 600);
    }

    /**
     * Glare tracking - Effet de reflet qui suit la souris
     */
    initGlareTracking() {
        const cards = document.querySelectorAll('.project-card, .service-card, .blog-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                this.updateGlare(e, card);
            });

            card.addEventListener('mouseleave', () => {
                this.resetGlare(card);
            });
        });
    }

    /**
     * Met à jour la position du glare
     * @param {Event} e - Événement mousemove
     * @param {HTMLElement} card - Card element
     */
    updateGlare(e, card) {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Appliquer gradient radial
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
        card.style.background = `
            radial-gradient(
                circle at ${x}% ${y}%,
                rgba(0, 229, 255, 0.1) 0%,
                transparent 50%
            ),
            var(--bg-card)
        `;
    }

    /**
     * Réinitialise le glare
     * @param {HTMLElement} card - Card element
     */
    resetGlare(card) {
        card.style.background = '';
    }

    /**
     * Smooth scroll amélioré pour les ancres
     */
    initSmoothScroll() {
        // Déjà géré par CSS scroll-behavior: smooth
        // Mais ajouter offset pour header fixe
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');

                // Ignorer # seul
                if (href === '#') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                // Offset pour header
                const headerHeight = document.querySelector('.header')?.offsetHeight || 60;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    /**
     * Tooltips dynamiques
     */
    initTooltips() {
        // Les tooltips CSS sont déjà gérés par [data-tooltip]
        // Ajouter tooltips dynamiques aux éléments sans texte

        // Exemple: Social icons
        const socialIcons = document.querySelectorAll('.social-links a:not([data-tooltip])');
        socialIcons.forEach(icon => {
            const href = icon.getAttribute('href');
            let tooltip = '';

            if (href.includes('linkedin')) {
                tooltip = 'LinkedIn';
            } else if (href.includes('github')) {
                tooltip = 'GitHub';
            } else if (href.includes('mailto')) {
                tooltip = 'Email';
            }

            if (tooltip) {
                icon.setAttribute('data-tooltip', tooltip);
            }
        });
    }

    /**
     * Ajoute une classe d'animation à un élément
     * @param {HTMLElement} element - Élément
     * @param {string} animationClass - Classe d'animation
     */
    animateElement(element, animationClass) {
        element.classList.add(animationClass);

        // Supprimer après animation
        element.addEventListener('animationend', () => {
            element.classList.remove(animationClass);
        }, { once: true });
    }
}

// ===================================
// FONCTIONS UTILITAIRES GLOBALES
// ===================================

/**
 * Ajoute un shake effect à un élément (erreur)
 * @param {HTMLElement} element - Élément à secouer
 */
function shakeElement(element) {
    if (!element) return;

    element.style.animation = 'shake 0.5s';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// Animation shake
const shakeKeyframes = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
}
`;

// Injecter keyframes si pas déjà présent
if (!document.querySelector('#shake-keyframes')) {
    const style = document.createElement('style');
    style.id = 'shake-keyframes';
    style.textContent = shakeKeyframes;
    document.head.appendChild(style);
}

/**
 * Copie du texte dans le clipboard avec feedback
 * @param {string} text - Texte à copier
 * @param {HTMLElement} button - Bouton qui a déclenché la copie
 */
async function copyToClipboard(text, button) {
    try {
        await navigator.clipboard.writeText(text);

        // Feedback visuel
        const originalText = button.textContent;
        button.textContent = '✓ Copié!';
        button.style.background = 'var(--success)';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    } catch (err) {
        console.error('Erreur copie clipboard:', err);
        shakeElement(button);
    }
}

/**
 * Ajoute un effet de particules explosives
 * @param {Event} e - Événement click
 */
function createParticleExplosion(e) {
    const particleCount = 12;
    const colors = ['#00E5FF', '#60A5FA', '#B388FF', '#FF1744'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';

        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 100;
        const x = Math.cos(angle) * velocity;
        const y = Math.sin(angle) * velocity;
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: ${color};
            box-shadow: 0 0 10px ${color};
            pointer-events: none;
            z-index: 9999;
            animation: particle-explode 0.8s ease-out forwards;
            --tx: ${x}px;
            --ty: ${y}px;
        `;

        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 800);
    }
}

// Animation particules explosion
const particleKeyframes = `
@keyframes particle-explode {
    0% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
    }
    100% {
        transform: translate(var(--tx), var(--ty)) scale(0);
        opacity: 0;
    }
}
`;

if (!document.querySelector('#particle-keyframes')) {
    const style = document.createElement('style');
    style.id = 'particle-keyframes';
    style.textContent = particleKeyframes;
    document.head.appendChild(style);
}

// ===================================
// INITIALISATION AUTOMATIQUE
// ===================================

let microInteractions;

document.addEventListener('DOMContentLoaded', () => {
    microInteractions = new MicroInteractions();

    // Exposer globalement
    window.microInteractions = microInteractions;
    window.shakeElement = shakeElement;
    window.copyToClipboard = copyToClipboard;
    window.createParticleExplosion = createParticleExplosion;
});

// ===================================
// EXPORTS (si utilisé comme module)
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MicroInteractions,
        shakeElement,
        copyToClipboard,
        createParticleExplosion
    };
}
