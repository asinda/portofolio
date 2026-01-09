// ===================================
// ANIMATIONS GSAP - PORTFOLIO SPRINT 2
// ===================================
// Alice Sindayigaya - Portfolio DevOps & Cloud
// Animations avancées: Particules, Parallax, 3D, Micro-interactions
// ===================================

// Variables globales
let reducedMotion = false;

// ===================================
// INITIALISATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Vérifier prefers-reduced-motion
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
        console.log('Mode animations réduites activé (prefers-reduced-motion)');
        return; // Désactiver toutes les animations si préférence utilisateur
    }

    // Enregistrer plugins GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Initialiser toutes les animations
    initHeroAnimations();
    initScrollProgress();
    initAboutAnimations();
    initProjectsAnimations();
    initSkillsAnimations();
    initCustomCursor();
    initMagneticButtons();

    console.log('✅ Animations GSAP initialisées');
});

// ===================================
// HERO SECTION - ANIMATIONS AVANCÉES
// ===================================

function initHeroAnimations() {
    // 1. Système de particules animées
    createParticlesBackground();

    // 2. Typewriter effect sur le nom
    initTypewriterEffect();

    // 3. Rotation des phrases de description
    initRotatingText();

    // 4. Titre avec reveal séquentiel (SplitType)
    animateHeroTitle();

    // 5. Sous-titre fade in
    animateHeroSubtitle();

    // 6. CTA buttons avec stagger
    animateHeroButtons();

    // 7. Hero cards 3D hover (Vanilla-tilt)
    init3DHeroCards();
}

// 1. Système de Particules Animées
function createParticlesBackground() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    // Créer conteneur de particules
    let particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) {
        particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: 1;
        `;
        heroSection.insertBefore(particlesContainer, heroSection.firstChild);
    }

    // Générer 80 particules pour plus d'impact visuel
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 4 + 2; // Tailles entre 2px et 6px
        const opacity = Math.random() * 0.5 + 0.2;
        const left = Math.random() * 100;
        const top = Math.random() * 100;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(0, 229, 255, ${opacity});
            border-radius: 50%;
            left: ${left}%;
            top: ${top}%;
        `;

        particlesContainer.appendChild(particle);

        // Animation GSAP de chaque particule
        gsap.to(particle, {
            y: `random(-200, 200)`,
            x: `random(-100, 100)`,
            duration: `random(3, 6)`,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 2
        });
    }
}

// 2. Typewriter Effect sur le nom
function initTypewriterEffect() {
    const element = document.querySelector('[data-typewriter]');
    if (!element) return;

    const text = element.textContent;
    element.textContent = '';
    let index = 0;

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100); // 80ms → 100ms pour un effet plus naturel
        } else {
            // Ajouter le curseur clignotant à la fin
            const cursor = document.createElement('span');
            cursor.className = 'cursor';
            cursor.textContent = '|';
            element.appendChild(cursor);
        }
    }

    // Démarrer l'animation après un court délai
    setTimeout(type, 800);
}

// 3. Rotation des phrases de description
function initRotatingText() {
    const element = document.querySelector('[data-phrases]');
    if (!element) return;

    try {
        const phrases = JSON.parse(element.dataset.phrases);
        let currentIndex = 0;

        function rotate() {
            // Animer la sortie du texte actuel
            gsap.to(element, {
                opacity: 0,
                y: -20,
                scale: 0.95,
                duration: 0.5,
                onComplete: () => {
                    // Changer le texte
                    currentIndex = (currentIndex + 1) % phrases.length;
                    element.textContent = phrases[currentIndex];

                    // Animer l'entrée du nouveau texte avec effet scale
                    gsap.to(element, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8
                    });
                }
            });
        }

        // Rotation automatique toutes les 5 secondes pour meilleure lecture
        setInterval(rotate, 5000);
    } catch (error) {
        console.error('Erreur lors de la rotation des phrases:', error);
    }
}

// 4. Titre Hero avec Reveal Séquentiel
function animateHeroTitle() {
    const heroTitle = document.querySelector('.hero-title, .hero h1');
    if (!heroTitle || typeof SplitType === 'undefined') return;

    // Découper le titre en caractères
    const split = new SplitType(heroTitle, { types: 'chars' });

    // Animation séquentielle des caractères
    gsap.from(split.chars, {
        opacity: 0,
        y: 50,
        rotateX: -90,
        stagger: 0.02,
        duration: 0.8,
        ease: 'back.out(1.7)',
        delay: 0.3
    });
}

// 3. Sous-titre Fade In
function animateHeroSubtitle() {
    const heroSubtitle = document.querySelector('.hero-subtitle, .hero p, .hero .subtitle');
    if (!heroSubtitle) return;

    gsap.from(heroSubtitle, {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 1,
        ease: 'power2.out'
    });
}

// 4. Buttons Hero avec Stagger
function animateHeroButtons() {
    const heroButtons = document.querySelectorAll('.hero .btn, .hero .cta-btn');
    if (heroButtons.length === 0) return;

    gsap.from(heroButtons, {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8,
        delay: 1.5,
        ease: 'power2.out'
    });
}

// 5. Cards 3D Hover (Vanilla-tilt)
function init3DHeroCards() {
    const heroCards = document.querySelectorAll('.hero-card, .stat-card, .service-card');
    if (heroCards.length === 0 || typeof VanillaTilt === 'undefined') return;

    heroCards.forEach(card => {
        VanillaTilt.init(card, {
            max: 15,              // Angle max d'inclinaison
            speed: 400,           // Vitesse de transition
            glare: true,          // Effet de brillance
            'max-glare': 0.3,     // Intensité brillance
            perspective: 1000,    // Perspective 3D
            scale: 1.05           // Zoom léger au hover
        });
    });
}

// ===================================
// SCROLL PROGRESS INDICATOR
// ===================================

function initScrollProgress() {
    // Créer la barre de progression
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary), var(--accent));
            transform: scaleX(0);
            transform-origin: left;
            z-index: 9999;
        `;
        document.body.appendChild(progressBar);
    }

    // Animation GSAP liée au scroll
    gsap.to('.scroll-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3
        }
    });
}

// ===================================
// ABOUT SECTION - IMAGE PARALLAX & STATS COUNTERS
// ===================================

function initAboutAnimations() {
    // 1. Image parallax
    const aboutImage = document.querySelector('.about-image img, .about img');
    if (aboutImage) {
        gsap.to(aboutImage, {
            y: -50,
            scale: 1.1,
            scrollTrigger: {
                trigger: '.about, .about-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    }

    // 2. Stats counters animés
    animateStatsCounters();
}

function animateStatsCounters() {
    const counters = document.querySelectorAll('.stat-number, .counter, [data-count]');
    if (counters.length === 0) return;

    counters.forEach(counter => {
        const targetValue = counter.textContent.replace(/\D/g, ''); // Extraire le nombre
        if (!targetValue) return;

        gsap.from(counter, {
            textContent: 0,
            duration: 2,
            ease: 'power1.out',
            snap: { textContent: 1 },
            scrollTrigger: {
                trigger: counter,
                start: 'top 80%',
                once: true
            },
            onUpdate: function() {
                // Ajouter le symbole + si présent initialement
                if (counter.dataset.suffix) {
                    counter.textContent = Math.ceil(counter.textContent) + counter.dataset.suffix;
                }
            }
        });
    });
}

// ===================================
// PROJECTS SECTION - 3D CARDS HOVER
// ===================================

function initProjectsAnimations() {
    const projectCards = document.querySelectorAll('.project-card, .portfolio-item');
    if (projectCards.length === 0) return;

    projectCards.forEach(card => {
        // Animation au scroll (fade in + slide up)
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                once: true
            }
        });

        // Hover animation 3D
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                boxShadow: '0 20px 60px rgba(0, 229, 255, 0.4)',
                y: -10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// ===================================
// SKILLS SECTION - PROGRESS BARS ANIMÉES
// ===================================

function initSkillsAnimations() {
    const skillBars = document.querySelectorAll('.skill-bar, .progress-bar');
    if (skillBars.length === 0) return;

    skillBars.forEach(bar => {
        // Récupérer la valeur de progression (data-progress ou width CSS)
        const progressValue = bar.dataset.progress || bar.style.width || '90%';

        // Partir de 0
        gsap.set(bar, { scaleX: 0, transformOrigin: 'left' });

        // Animer au scroll
        gsap.to(bar, {
            scaleX: 1,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: bar,
                start: 'top 80%',
                once: true
            }
        });
    });
}

// ===================================
// CURSEUR PERSONNALISÉ
// ===================================

function initCustomCursor() {
    // Vérifier si mobile (pas de curseur custom sur mobile)
    if (window.innerWidth < 768) return;

    // Créer le curseur
    let cursor = document.querySelector('.cursor-follower');
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.className = 'cursor-follower';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--accent, #ff6b35);
            pointer-events: none;
            z-index: 10000;
            opacity: 0;
            mix-blend-mode: difference;
            transition: width 0.2s, height 0.2s, opacity 0.2s;
        `;
        document.body.appendChild(cursor);
    }

    // Animation de suivi de la souris
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '0.5';
    });

    // Animation fluide avec GSAP ticker
    gsap.ticker.add(() => {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;

        gsap.set(cursor, {
            x: cursorX - 10,
            y: cursorY - 10
        });
    });

    // Agrandir le curseur sur hover éléments interactifs
    const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, {
                width: 40,
                height: 40,
                duration: 0.2
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, {
                width: 20,
                height: 20,
                duration: 0.2
            });
        });
    });
}

// ===================================
// MAGNETIC BUTTONS
// ===================================

function initMagneticButtons() {
    // Désactiver l'effet magnétique sur mobile pour de meilleures performances
    if (window.innerWidth < 768) return;

    const buttons = document.querySelectorAll('.btn-primary, .cta-btn, .btn-magnetic');
    if (buttons.length === 0) return;

    buttons.forEach(btn => {
        // Ajouter classe pour identifier
        btn.classList.add('magnetic-active');

        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Effet magnétique (attraction vers la souris)
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            // Retour à la position initiale avec élasticité
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

// ===================================
// ANIMATIONS GÉNÉRALES AU SCROLL
// ===================================

// Animer tous les éléments avec classe .animate-on-scroll
function initGeneralScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll, [data-animate]');
    if (animatedElements.length === 0) return;

    animatedElements.forEach(el => {
        gsap.from(el, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true
            }
        });
    });
}

// Appeler au chargement
document.addEventListener('DOMContentLoaded', () => {
    if (!reducedMotion) {
        initGeneralScrollAnimations();
    }
});

// ===================================
// SUPPORT PREFERS-REDUCED-MOTION
// ===================================

// Écouter les changements de préférence
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    reducedMotion = e.matches;

    if (reducedMotion) {
        // Désactiver toutes les animations GSAP
        gsap.globalTimeline.clear();
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());

        console.log('Animations désactivées (prefers-reduced-motion)');
    } else {
        // Réactiver en rechargeant la page
        location.reload();
    }
});

// ===================================
// UTILITAIRES
// ===================================

// Rafraîchir ScrollTrigger après chargement des images
window.addEventListener('load', () => {
    if (!reducedMotion) {
        ScrollTrigger.refresh();
    }
});

// Rafraîchir ScrollTrigger après redimensionnement (debounced)
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (!reducedMotion) {
            ScrollTrigger.refresh();
        }
    }, 250);
});

console.log('📜 animations.js chargé - Sprint 2 GSAP');
