// ===================================
// Configuration et Variables Globales
// ===================================
let portfolioData = null;

// ===================================
// Gestion du chargement de la page
// ===================================
window.addEventListener('DOMContentLoaded', async () => {
    // Charger les données
    await loadPortfolioData();

    // Initialiser tous les modules
    initNavigation();
    initThemeToggle();
    initTypingEffect();
    initScrollAnimations();
    initCounters();
    initProjectFilters();
    initContactForm();
    initBackToTop();

    // Masquer l'écran de chargement
    hideLoadingScreen();
});

// ===================================
// Chargement des données du portfolio
// ===================================
async function loadPortfolioData() {
    try {
        const response = await fetch('data.json');
        portfolioData = await response.json();
        populatePortfolio();
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // Utiliser des données par défaut en cas d'erreur
        portfolioData = getDefaultData();
        populatePortfolio();
    }
}

function getDefaultData() {
    return {
        profile: {
            name: "Alice Sindayigaya",
            title: "Votre Titre Professionnel",
            location: "Ville, Pays",
            email: "contact@example.com",
            phone: "+XXX XXX XXX XXX",
            about: "Présentez-vous ici..."
        },
        experience: [],
        education: [],
        skills: { technical: [], languages: [], soft: [] },
        projects: [],
        certifications: [],
        achievements: []
    };
}

// ===================================
// Remplissage du contenu
// ===================================
function populatePortfolio() {
    if (!portfolioData) return;

    // Profil
    const profile = portfolioData.profile;
    document.getElementById('aboutDescription').textContent = profile.about;
    document.getElementById('profileLocation').textContent = profile.location;
    document.getElementById('profileEmail').textContent = profile.email;
    document.getElementById('profileEmail').href = `mailto:${profile.email}`;
    document.getElementById('profilePhone').textContent = profile.phone;
    document.getElementById('contactLocation').textContent = profile.location;
    document.getElementById('contactPhone').textContent = profile.phone;
    document.getElementById('contactEmail').textContent = profile.email;
    document.getElementById('contactEmail').href = `mailto:${profile.email}`;

    // Année actuelle dans le footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Expérience
    populateExperience();

    // Formation
    populateEducation();

    // Compétences
    populateSkills();

    // Projets
    populateProjects();

    // Certifications
    populateCertifications();
}

function populateExperience() {
    const container = document.getElementById('experienceTimeline');
    container.innerHTML = '';

    portfolioData.experience.forEach(exp => {
        const item = document.createElement('div');
        item.className = 'timeline-item';

        const achievements = exp.achievements.map(achievement =>
            `<li>${achievement}</li>`
        ).join('');

        item.innerHTML = `
            <div class="timeline-content">
                <div class="timeline-header">
                    <div>
                        <h3 class="timeline-position">${exp.position}</h3>
                        <p class="timeline-company">${exp.company} • ${exp.location}</p>
                    </div>
                    <span class="timeline-date">${exp.startDate} - ${exp.endDate}</span>
                </div>
                <p class="timeline-description">${exp.description}</p>
                <ul class="timeline-achievements">
                    ${achievements}
                </ul>
            </div>
        `;
        container.appendChild(item);
    });
}

function populateEducation() {
    const container = document.getElementById('educationGrid');
    container.innerHTML = '';

    portfolioData.education.forEach(edu => {
        const card = document.createElement('div');
        card.className = 'education-card';
        card.innerHTML = `
            <h3 class="education-degree">${edu.degree}</h3>
            <p class="education-institution">${edu.institution}</p>
            <p class="education-date">${edu.startDate} - ${edu.endDate} • ${edu.location}</p>
            <p class="education-description">${edu.description}</p>
        `;
        container.appendChild(card);
    });
}

function populateSkills() {
    // Compétences techniques
    const technicalContainer = document.getElementById('technicalSkills');
    technicalContainer.innerHTML = '';
    portfolioData.skills.technical.forEach(skill => {
        const item = document.createElement('div');
        item.className = 'skill-item';
        item.textContent = skill;
        technicalContainer.appendChild(item);
    });

    // Langues
    const languagesContainer = document.getElementById('languagesList');
    languagesContainer.innerHTML = '';
    portfolioData.skills.languages.forEach(lang => {
        const item = document.createElement('div');
        item.className = 'language-item';
        item.innerHTML = `
            <span class="language-name">${lang.name}</span>
            <span class="language-level">${lang.level}</span>
        `;
        languagesContainer.appendChild(item);
    });

    // Compétences interpersonnelles
    const softContainer = document.getElementById('softSkills');
    softContainer.innerHTML = '';
    portfolioData.skills.soft.forEach(skill => {
        const item = document.createElement('div');
        item.className = 'soft-skill-item';
        item.textContent = skill;
        softContainer.appendChild(item);
    });
}

function populateProjects() {
    const container = document.getElementById('projectsGrid');
    container.innerHTML = '';

    portfolioData.projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-category', 'web'); // Par défaut, peut être modifié

        const technologies = project.technologies.map(tech =>
            `<span class="tech-tag">${tech}</span>`
        ).join('');

        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(project.title)}'">
                <div class="project-overlay">
                    <div class="project-links">
                        ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>` : ''}
                    </div>
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${technologies}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function populateCertifications() {
    const container = document.getElementById('certificationsGrid');
    container.innerHTML = '';

    portfolioData.certifications.forEach(cert => {
        const card = document.createElement('div');
        card.className = 'certification-card';
        card.innerHTML = `
            <h3 class="certification-name">${cert.name}</h3>
            <p class="certification-issuer">${cert.issuer}</p>
            <p class="certification-date">${cert.date}</p>
            ${cert.link ? `<a href="${cert.link}" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color); margin-top: 0.5rem; display: inline-block;">Voir la certification <i class="fas fa-external-link-alt"></i></a>` : ''}
        `;
        container.appendChild(card);
    });
}

// ===================================
// Navigation
// ===================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect sur la navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Toggle menu mobile
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fermer le menu et mettre à jour l'état actif
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');

            // Mettre à jour le lien actif
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Intersection Observer pour les sections
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// ===================================
// Thème sombre/clair
// ===================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    // Vérifier le thème sauvegardé
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(themeIcon, savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(themeIcon, newTheme);
    });
}

function updateThemeIcon(icon, theme) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===================================
// Effet de frappe pour le titre
// ===================================
function initTypingEffect() {
    const heroTitle = document.getElementById('heroTitle');
    const titles = [
        'Développeuse Full Stack',
        'Designer UI/UX',
        'Chef de Projet',
        'Consultante IT'
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentTitle = titles[titleIndex];

        if (isDeleting) {
            heroTitle.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            heroTitle.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    // Démarrer l'effet après un court délai
    setTimeout(type, 1000);
}

// ===================================
// Animations au scroll
// ===================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll(
        '.timeline-item, .education-card, .project-card, .stat-card, .certification-card'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===================================
// Compteurs animés
// ===================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const countUp = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => countUp(counter), 10);
        } else {
            counter.innerText = target;
        }
    };

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

// ===================================
// Filtres de projets
// ===================================
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Mettre à jour le bouton actif
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            // Filtrer les projets
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===================================
// Formulaire de contact
// ===================================
function initContactForm() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Simulation d'envoi (à remplacer par votre logique d'envoi réel)
        try {
            // Exemple avec FormSubmit, EmailJS, ou votre propre backend
            console.log('Données du formulaire:', formData);

            // Afficher un message de succès
            alert('Merci pour votre message ! Je vous répondrai dans les plus brefs délais.');
            form.reset();

            // Pour une vraie implémentation, utilisez:
            // await fetch('votre-endpoint', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    });
}

// ===================================
// Bouton retour en haut
// ===================================
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// Masquer l'écran de chargement
// ===================================
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 500);
}

// ===================================
// Smooth scroll pour tous les liens d'ancrage
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===================================
// Gestion des erreurs d'images
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            if (!this.src.includes('placeholder')) {
                this.src = 'https://via.placeholder.com/400x300?text=Image';
            }
        });
    });
});
