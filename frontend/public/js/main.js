// ===================================
// SERVICE WORKER (PWA)
// ===================================

// Enregistrer le Service Worker si supporté
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/portofolio/sw.js')
            .then((registration) => {
                console.log('✅ Service Worker enregistré:', registration.scope);

                // Vérifier les mises à jour toutes les heures
                setInterval(() => {
                    registration.update();
                }, 60 * 60 * 1000);

                // Écouter les mises à jour
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('🔄 Nouvelle version du Service Worker détectée');

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('✅ Nouvelle version installée');
                            // Optionnel: Notifier l'utilisateur qu'une mise à jour est disponible
                            if (confirm('Une nouvelle version est disponible. Recharger la page?')) {
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('❌ Erreur enregistrement Service Worker:', error);
            });
    });
}

// ===================================
// INITIALISATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    // initCV(); // CV statique directement dans le HTML
    initProjects();
    initBlog();
    initPortfolio();
    // initContactForm(); // Section contact supprimée
    initScrollAnimations();
    initSmoothScroll();
});

// ===================================
// NAVIGATION
// ===================================

function initNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect sur le header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Menu mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isExpanded = nav.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Fermer le menu au clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Activer le lien selon la section visible
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    });
}

// ===================================
// PORTFOLIO
// ===================================

function initPortfolio() {
    const portfolioGrid = document.getElementById('portfolioGrid');

    if (!portfolioGrid || !portfolioData || !portfolioData.projects) {
        console.warn('Portfolio grid or data not found');
        return;
    }

    // Générer les cartes de projet
    portfolioData.projects.forEach(project => {
        const projectCard = createProjectCard(project);
        portfolioGrid.appendChild(projectCard);
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'portfolio-item';

    card.innerHTML = `
        <div class="portfolio-image">
            <img src="${project.image}" alt="${project.title}" loading="lazy">
            <div class="portfolio-overlay">
                <span class="portfolio-category">${project.category}</span>
            </div>
        </div>
        <div class="portfolio-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
        </div>
    `;

    // Ajouter l'effet de hover
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });

    return card;
}

// ===================================
// FORMULAIRE DE CONTACT
// ===================================
// Section contact supprimée - fonction commentée
/*
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        try {
            // Simulation d'envoi (à remplacer par votre logique d'envoi réel)
            console.log('Données du formulaire:', formData);

            // Afficher un message de succès
            showNotification('Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.', 'success');

            // Réinitialiser le formulaire
            contactForm.reset();

            // TODO: Remplacer par votre vrai endpoint
            // await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });

        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
        }
    });
}
*/
/*
function showNotification(message, type = 'success') {
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;

    // Ajouter la notification au body
    document.body.appendChild(notification);

    // Ajouter les keyframes pour l'animation
    if (!document.getElementById('notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Supprimer la notification après 5 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}
*/

// ===================================
// ANIMATIONS AU SCROLL
// ===================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Sélectionner les éléments à animer
    const animatedElements = document.querySelectorAll(`
        .service-card,
        .portfolio-item,
        .skill-category,
        .contact-item,
        .stat-item
    `);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===================================
// SMOOTH SCROLL
// ===================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// UTILITAIRES
// ===================================

// Debounce function pour optimiser les events scroll/resize
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading des images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialiser le lazy loading
initLazyLoading();

// ===================================
// SECTION CV - CHARGEMENT DYNAMIQUE
// ===================================

function initCV() {
    loadExperiences();
    loadEducation();
    loadCertifications();
}

async function loadExperiences() {
    const timeline = document.getElementById('experienceTimeline');
    if (!timeline) return;

    try {
        const response = await fetch('/api/portfolio/experience');
        const data = await response.json();

        if (data.success && data.data) {
            timeline.innerHTML = '';
            data.data.forEach(exp => {
                timeline.appendChild(createCVItem(exp, 'experience'));
            });
        }
    } catch (error) {
        console.error('Erreur chargement expériences:', error);
        timeline.innerHTML = '<p style="color: var(--gray-500); padding: 1rem;">Données en cours de chargement...</p>';
    }
}

async function loadEducation() {
    const timeline = document.getElementById('educationTimeline');
    if (!timeline) return;

    try {
        const response = await fetch('/api/portfolio/education');
        const data = await response.json();

        if (data.success && data.data) {
            timeline.innerHTML = '';
            data.data.forEach(edu => {
                timeline.appendChild(createCVItem(edu, 'education'));
            });
        }
    } catch (error) {
        console.error('Erreur chargement formations:', error);
    }
}

async function loadCertifications() {
    const timeline = document.getElementById('certificationsTimeline');
    if (!timeline) return;

    try {
        const response = await fetch('/api/portfolio/certifications');
        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
            data.data.forEach(cert => {
                timeline.appendChild(createCVItem(cert, 'certification'));
            });
        }
    } catch (error) {
        console.error('Erreur chargement certifications:', error);
    }
}

function createCVItem(item, type) {
    const div = document.createElement('div');
    div.className = 'cv-item';

    if (type === 'experience') {
        const dateClass = item.current ? 'cv-item-date cv-item-current' : 'cv-item-date';
        const endDate = item.current ? 'Présent' : item.endDate;

        div.innerHTML = `
            <div class="cv-item-header">
                <div>
                    <h4 class="cv-item-title">${item.position}</h4>
                    <p class="cv-item-subtitle">${item.company} • ${item.location || ''}</p>
                </div>
                <span class="${dateClass}">${item.startDate} - ${endDate}</span>
            </div>
            <p class="cv-item-description">${item.description || ''}</p>
            ${item.achievements && item.achievements.length > 0 ? `
                <ul class="cv-item-achievements">
                    ${item.achievements.map(ach => `<li>${ach}</li>`).join('')}
                </ul>
            ` : ''}
        `;
    } else if (type === 'education') {
        div.innerHTML = `
            <div class="cv-item-header">
                <div>
                    <h4 class="cv-item-title">${item.degree}</h4>
                    <p class="cv-item-subtitle">${item.institution} • ${item.location || ''}</p>
                </div>
                <span class="cv-item-date">${item.startDate} - ${item.endDate}</span>
            </div>
            ${item.description ? `<p class="cv-item-description">${item.description}</p>` : ''}
        `;
    } else if (type === 'certification') {
        div.innerHTML = `
            <div class="cv-item-header">
                <div>
                    <h4 class="cv-item-title">${item.name}</h4>
                    <p class="cv-item-subtitle">${item.issuer}</p>
                </div>
                <span class="cv-item-date">${item.date}</span>
            </div>
        `;
    }

    return div;
}

// ===================================
// SECTION PROJETS AVEC FILTRES
// ===================================

function initProjects() {
    loadProjects();
    initProjectFilters();
}

async function loadProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    try {
        const response = await fetch('/api/portfolio/projects');
        const data = await response.json();

        if (data.success && data.data) {
            grid.innerHTML = '';
            data.data.forEach(project => {
                grid.appendChild(createProjectCard(project));
            });
        }
    } catch (error) {
        console.error('Erreur chargement projets:', error);
        grid.innerHTML = '<p style="color: var(--gray-500); padding: 2rem; text-align: center; grid-column: 1/-1;">Projets en cours de chargement...</p>';
    }
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.category = project.category || 'cloud';

    const techTags = project.technologies ?
        project.technologies.split(',').map(tech => `<span class="tech-tag">${tech.trim()}</span>`).join('') : '';

    card.innerHTML = `
        <div class="project-image">
            <img src="${project.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80'}"
                 alt="${project.title}" loading="lazy">
            <span class="project-category">${project.category || 'Cloud'}</span>
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description || ''}</p>
            ${techTags ? `<div class="project-tech">${techTags}</div>` : ''}
            <div class="project-links">
                ${project.link ? `<a href="${project.link}" target="_blank" class="project-link">
                    <i class="fas fa-external-link-alt"></i> Voir le projet
                </a>` : ''}
                ${project.github ? `<a href="${project.github}" target="_blank" class="project-link">
                    <i class="fab fa-github"></i> Code source
                </a>` : ''}
            </div>
        </div>
    `;

    return card;
}

function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter projects
            projects.forEach(project => {
                if (filter === 'all' || project.dataset.category === filter) {
                    project.style.display = 'block';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });
}

// ===================================
// SECTION BLOG AVEC CATÉGORIES
// ===================================

function initBlog() {
    initBlogFilters();
}

function initBlogFilters() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const articles = document.querySelectorAll('.blog-card');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;

            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter articles
            articles.forEach(article => {
                const categories = article.dataset.category;
                if (category === 'all' || categories.includes(category)) {
                    article.style.display = 'flex';
                } else {
                    article.style.display = 'none';
                }
            });
        });
    });
}
