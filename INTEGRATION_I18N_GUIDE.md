# Guide d'intégration i18n dans index.html

Ce document décrit comment annoter le HTML avec les attributs `data-i18n` pour activer le système d'internationalisation.

## Principe général

Pour chaque élément textuel du HTML, ajouter l'attribut `data-i18n` avec la clé correspondante dans les fichiers de traduction.

### Exemple
```html
<!-- Avant -->
<h1>Bonjour, je suis Alice</h1>

<!-- Après -->
<h1>
    <span data-i18n="hero.greeting">Bonjour, je suis</span>
    <span data-i18n="hero.name">Alice Sindayigaya</span>
</h1>
```

## Sections à annoter

### 1. NAVIGATION (lines 75-102)

```html
<a href="#" class="logo">
    <span class="logo-text" data-i18n="nav.logo">Alice S.</span>
</a>

<nav class="nav" id="nav">
    <ul class="nav-list">
        <li><a href="#home" class="nav-link" data-i18n="nav.home">Accueil</a></li>
        <li><a href="#cv" class="nav-link" data-i18n="nav.cv">CV</a></li>
        <li><a href="#projects" class="nav-link" data-i18n="nav.projects">Projets</a></li>
        <li><a href="#blog" class="nav-link" data-i18n="nav.blog">Blog & Tutos</a></li>
    </ul>
</nav>

<button class="nav-toggle"
        id="navToggle"
        data-i18n-aria="nav.toggleAriaLabel"
        aria-label="Toggle navigation"
        aria-expanded="false"
        aria-controls="nav">
```

### 2. HERO SECTION (lines 105-171)

```html
<span class="hero-label">
    <i class="fas fa-code pulse-icon"></i> <span data-i18n="hero.label">Ingénieure DevOps</span>
</span>

<h1 class="hero-title">
    <span class="hero-greeting" data-i18n="hero.greeting">Bonjour, je suis</span>
    <span class="hero-name gradient-text" data-typewriter data-i18n="hero.name">Alice Sindayigaya</span>
</h1>

<p class="hero-description rotating-text" data-phrases='[
    "Architecte Cloud passionnée | Kubernetes & Terraform",
    "Experte DevOps | CI/CD & Automatisation",
    "Spécialiste PaaS | OpenSearch & MongoDB",
    "Ingénieure Infrastructure | AWS & GCP"
]'>...</p>
<!-- Note: La rotation des phrases sera gérée par JS avec i18n.t('hero.descriptions') -->

<div class="hero-cta">
    <a href="#cv" class="btn btn-primary btn-magnetic">
        <span data-i18n="hero.cta.cv">Découvrir mon CV</span>
        <i class="fas fa-arrow-right"></i>
    </a>
    <a href="#projects" class="btn btn-secondary btn-magnetic">
        <span data-i18n="hero.cta.projects">Mes Projets</span>
    </a>
    <a href="#blog" class="btn btn-outline btn-magnetic">
        <i class="fas fa-book"></i>
        <span data-i18n="hero.cta.blog">Blog & Tutos</span>
    </a>
</div>

<div class="scroll-indicator">
    <span data-i18n="hero.scrollIndicator">Scroll Down</span>
    <i class="fas fa-chevron-down"></i>
</div>

<!-- Hero cards -->
<div class="hero-card">
    <div class="card-icon">
        <i class="fas fa-cloud"></i>
    </div>
    <h3 data-i18n="hero.cards.cloud.title">Cloud</h3>
    <p data-i18n="hero.cards.cloud.description">AWS, GCP, Kubernetes</p>
</div>
<!-- ... Répéter pour automation et monitoring -->
```

### 3. ABOUT SECTION (lines 174-223)

```html
<span class="section-label" data-i18n="about.label">À propos de moi</span>
<h2 class="section-title" data-i18n="about.title">
    Ingénieure DevOps passionnée par l'automatisation et le cloud
</h2>

<p class="section-description" data-i18n="about.paragraphs.0">...</p>
<p class="section-description" data-i18n="about.paragraphs.1">...</p>

<!-- Stats -->
<div class="stat-item">
    <span class="stat-number" data-i18n="about.stats.devops.number">7+</span>
    <span class="stat-label" data-i18n="about.stats.devops.label">Années DevOps</span>
</div>
<!-- ... Répéter pour autres stats -->

<img src="images/api-coding.gif"
     data-i18n-title="about.imageAlt"
     alt="Ingénieure DevOps spécialisée en développement d'API et programmation cloud"
     loading="lazy"
     width="600"
     height="400">
```

### 4. CV SECTION (lines 226-413)

```html
<span class="section-label" data-i18n="cv.label">Parcours Professionnel</span>
<h2 class="section-title" data-i18n="cv.title">Mon CV</h2>
<p class="section-description" data-i18n="cv.description">
    Plus de 7 ans d'expérience en DevOps et Cloud Engineering
</p>

<!-- Expériences -->
<h3 class="cv-column-title">
    <i class="fas fa-briefcase"></i>
    <span data-i18n="cv.experience.title">Expériences Professionnelles</span>
</h3>

<!-- Timeline items - à remplir dynamiquement via JS avec i18n.t() -->
<!-- OU annoter statiquement chaque expérience -->
<div class="timeline-date" data-i18n="cv.experience.items.0.date">01/2024 - Actuel</div>
<h4 data-i18n="cv.experience.items.0.position">Ingénieure DevOps – Responsable PaaS</h4>
<p class="company" data-i18n="cv.experience.items.0.company">CEGEDIM CLOUD - Labège</p>
<ul>
    <li data-i18n="cv.experience.items.0.tasks.0">Développement et optimisation des plateformes PaaS...</li>
    <li data-i18n="cv.experience.items.0.tasks.1">Architecture cloud hautement disponible...</li>
</ul>

<!-- Formation -->
<h3 class="cv-column-title">
    <i class="fas fa-graduation-cap"></i>
    <span data-i18n="cv.education.title">Formation</span>
</h3>

<!-- Langues & Loisirs -->
<h3 class="cv-column-title">
    <i class="fas fa-globe"></i>
    <span data-i18n="cv.languages.title">Langues & Loisirs</span>
</h3>

<!-- Compétences -->
<h3 class="cv-section-subtitle">
    <i class="fas fa-tools"></i>
    <span data-i18n="cv.skills.title">Compétences & Expertises</span>
</h3>

<a href="https://www.linkedin.com/in/alicesindayigaya" target="_blank" class="btn btn-primary">
    <i class="fab fa-linkedin"></i>
    <span data-i18n="cv.actions.linkedinButton">Voir sur LinkedIn</span>
</a>
```

### 5. SERVICES SECTION (lines 417-478)

```html
<span class="section-label" data-i18n="services.label">Expertises</span>
<h2 class="section-title" data-i18n="services.title">Domaines de compétences</h2>
<p class="section-description" data-i18n="services.description">
    Solutions complètes en DevOps, Cloud et Automatisation
</p>

<!-- Service cards -->
<div class="service-card">
    <div class="service-icon">
        <i class="fas fa-cloud"></i>
    </div>
    <h3 data-i18n="services.items.0.title">Architecture Cloud</h3>
    <p data-i18n="services.items.0.description">
        Conception et déploiement d'environnements cloud modernes...
    </p>
    <ul class="service-features">
        <li><i class="fas fa-check"></i> <span data-i18n="services.items.0.features.0">Kubernetes & OpenShift</span></li>
        <li><i class="fas fa-check"></i> <span data-i18n="services.items.0.features.1">Plateformes PaaS</span></li>
        <li><i class="fas fa-check"></i> <span data-i18n="services.items.0.features.2">Infrastructure as Code</span></li>
    </ul>
</div>

<!-- Featured card -->
<div class="service-card featured">
    <div class="featured-badge" data-i18n="services.items.1.badge">Spécialité</div>
    <!-- ... -->
</div>
```

### 6. PROJECTS SECTION (lines 481-514)

```html
<span class="section-label" data-i18n="projects.label">Réalisations</span>
<h2 class="section-title" data-i18n="projects.title">Projets & Cas d'Usage</h2>
<p class="section-description" data-i18n="projects.description">
    Architectures Cloud, Automatisations et Plateformes que j'ai conçues et déployées
</p>

<!-- Filtres -->
<button class="filter-btn active" data-filter="all">
    <i class="fas fa-th"></i> <span data-i18n="projects.filters.all">Tous</span>
</button>
<button class="filter-btn" data-filter="cloud">
    <i class="fas fa-cloud"></i> <span data-i18n="projects.filters.cloud">Cloud & PaaS</span>
</button>
<button class="filter-btn" data-filter="automation">
    <i class="fas fa-robot"></i> <span data-i18n="projects.filters.automation">Automatisation</span>
</button>
<button class="filter-btn" data-filter="monitoring">
    <i class="fas fa-chart-line"></i> <span data-i18n="projects.filters.monitoring">Supervision</span>
</button>
<button class="filter-btn" data-filter="opensource">
    <i class="fab fa-github"></i> <span data-i18n="projects.filters.opensource">Open Source</span>
</button>
```

### 7. SKILLS SECTION (lines 517-591)

```html
<span class="section-label" data-i18n="skills.label">Compétences</span>
<h2 class="section-title" data-i18n="skills.title">Technologies & Outils</h2>

<div class="skill-category">
    <h3>
        <i class="fas fa-cloud"></i>
        <span data-i18n="skills.categories.0.title">Plateformes Cloud</span>
    </h3>
    <!-- Les skills tags sont identiques en FR/EN, pas besoin de traduction -->
    <div class="skill-tags">
        <span class="skill-tag">Kubernetes</span>
        <span class="skill-tag">AWS</span>
        <!-- ... -->
    </div>
</div>
```

### 8. BLOG SECTION (lines 594-705)

```html
<span class="section-label" data-i18n="blog.label">Partage de Connaissances</span>
<h2 class="section-title" data-i18n="blog.title">Blog & Tutoriels</h2>
<p class="section-description" data-i18n="blog.description">
    Articles techniques, guides pratiques et retours d'expérience sur DevOps et Cloud
</p>

<!-- Catégories -->
<button class="category-btn active" data-category="all">
    <i class="fas fa-grip-horizontal"></i> <span data-i18n="blog.categories.all">Tous les articles</span>
</button>
<button class="category-btn" data-category="tutorial">
    <i class="fas fa-book-open"></i> <span data-i18n="blog.categories.tutorial">Tutoriels</span>
</button>
<!-- ... -->

<!-- Articles (exemples statiques) -->
<div class="blog-meta">
    <span><i class="fas fa-calendar"></i> <span data-i18n="blog.articles.0.date">À venir</span></span>
    <span><i class="fas fa-clock"></i> <span data-i18n="blog.articles.0.readTime">10 min</span></span>
</div>
<h3 data-i18n="blog.articles.0.title">Déployer une application sur Kubernetes avec Helm</h3>
<p data-i18n="blog.articles.0.excerpt">Guide complet pour déployer vos applications...</p>

<!-- CTA -->
<p class="blog-cta-text" data-i18n="blog.cta.text">Section en construction - Articles techniques à venir prochainement !</p>
<a href="https://www.linkedin.com/in/alicesindayigaya" target="_blank" class="btn btn-primary">
    <i class="fab fa-linkedin"></i>
    <span data-i18n="blog.cta.button">Suivez-moi sur LinkedIn</span>
</a>
```

### 9. FOOTER (lines 708-753)

```html
<div class="footer-brand">
    <h3 data-i18n="footer.brand.name">Alice Sindayigaya</h3>
    <p data-i18n="footer.brand.description">Ingénieure DevOps spécialisée en Cloud...</p>
    <div class="social-links">
        <a href="https://www.linkedin.com/in/alicesindayigaya" target="_blank" data-i18n-aria="footer.social.linkedinAria" aria-label="LinkedIn">
            <i class="fab fa-linkedin-in"></i>
        </a>
        <a href="https://github.com/asinda" target="_blank" data-i18n-aria="footer.social.githubAria" aria-label="GitHub">
            <i class="fab fa-github"></i>
        </a>
        <a href="mailto:alicesindayigaya@gmail.com" data-i18n-aria="footer.social.emailAria" aria-label="Email">
            <i class="fas fa-envelope"></i>
        </a>
    </div>
</div>

<div class="footer-links">
    <h4 data-i18n="footer.navigation.title">Navigation</h4>
    <ul>
        <li><a href="#home" data-i18n="footer.navigation.links.0.text">Accueil</a></li>
        <li><a href="#cv" data-i18n="footer.navigation.links.1.text">Mon CV</a></li>
        <li><a href="#projects" data-i18n="footer.navigation.links.2.text">Projets</a></li>
        <li><a href="#blog" data-i18n="footer.navigation.links.3.text">Blog & Tutos</a></li>
    </ul>
</div>

<div class="footer-links">
    <h4 data-i18n="footer.expertise.title">Expertises</h4>
    <ul>
        <li><a href="#services" data-i18n="footer.expertise.links.0.text">Cloud & PaaS</a></li>
        <li><a href="#services" data-i18n="footer.expertise.links.1.text">Automatisation</a></li>
        <li><a href="#services" data-i18n="footer.expertise.links.2.text">Supervision</a></li>
        <li><a href="#skills" data-i18n="footer.expertise.links.3.text">Compétences</a></li>
    </ul>
</div>

<div class="footer-bottom">
    <p>
        <span data-i18n="footer.bottom.copyright">© 2025 Alice Sindayigaya. Tous droits réservés.</span>
        | <a href="admin.html" style="color: inherit; opacity: 0.5; text-decoration: none;" title="Administration" data-i18n="footer.bottom.admin">Admin</a>
    </p>
</div>
```

### 10. BACK TO TOP BUTTON (line 758)

```html
<button class="back-to-top" id="backToTop" data-i18n-aria="common.buttons.backToTop" aria-label="Retour en haut de la page">
    <i class="fas fa-chevron-up"></i>
</button>
```

## Notes importantes

1. **Attributs spéciaux** :
   - `data-i18n` : Pour le contenu textuel
   - `data-i18n-aria` : Pour `aria-label`
   - `data-i18n-placeholder` : Pour `placeholder` (inputs)
   - `data-i18n-title` : Pour `title` (attribut)

2. **Notation dot** :
   - Utiliser la notation dot pour accéder aux traductions imbriquées
   - Exemple : `data-i18n="cv.experience.items.0.position"`

3. **Tableaux (arrays)** :
   - Accéder via index : `data-i18n="about.paragraphs.0"`

4. **Meta tags** :
   - Les meta tags SEO sont mis à jour automatiquement par `i18n.updateMetaTags()`
   - Pas besoin d'annoter manuellement

5. **Contenu dynamique** :
   - Pour le contenu chargé dynamiquement (projets, blog via API), utiliser `i18n.t()` en JavaScript
   - Exemple : `element.textContent = i18n.t('projects.filters.all');`

## Test

Une fois tous les attributs ajoutés :

1. Ouvrir le portfolio dans le navigateur
2. Vérifier la console pour les logs d'initialisation
3. Cliquer sur le bouton FR/EN pour tester le changement de langue
4. Vérifier que tous les textes changent correctement
5. Vérifier les meta tags dans l'inspecteur (onglet Head)

## Prochaine étape

Appliquer systématiquement tous ces changements dans `index.html`.
