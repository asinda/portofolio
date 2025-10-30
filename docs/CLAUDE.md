# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Instructions pour Claude Code

- **Langue de communication** : Réponds toujours en français
- Toutes les explications et interactions doivent être en français

## Aperçu du Projet

Portfolio professionnel moderne pour Alice Sindayigaya, développé avec HTML, CSS et JavaScript vanilla (sans framework).

LinkedIn Profile: www.linkedin.com/in/alicesindayigaya

## Stack Technique

- **Frontend** : HTML5, CSS3, JavaScript (ES6+)
- **Fonts** : Google Fonts (Poppins, Playfair Display)
- **Icons** : Font Awesome 6.4.0
- **Données** : Format JSON (data.json)
- **Pas de build system** : Fichiers statiques servis directement

## Structure du Projet

```
portofolio/
├── index.html          # Page principale unique (SPA-like)
├── css/
│   └── styles.css      # Tous les styles (variables CSS, responsive)
├── js/
│   └── script.js       # Toutes les fonctionnalités JS
├── images/             # Photos et images de projets
├── assets/             # Fichiers téléchargeables (CV, etc.)
├── data.json           # Données du portfolio (structure JSON)
├── README.md           # Documentation utilisateur
└── CLAUDE.md           # Guide pour Claude Code
```

## Architecture et Concepts Clés

### 1. Système de données centralisé (data.json)

Toutes les données du portfolio sont dans `data.json` avec cette structure :
- `profile` : Informations personnelles, contact, à propos
- `experience` : Historique professionnel avec achievements
- `education` : Parcours académique
- `skills` : Compétences techniques, langues, soft skills
- `projects` : Portfolio de projets avec technologies utilisées
- `certifications` : Certifications et réalisations

### 2. Système de thème clair/sombre

Utilise l'attribut `data-theme` sur l'élément HTML :
- Variables CSS différentes selon le thème dans `:root` et `[data-theme="dark"]`
- Sauvegarde dans localStorage pour persistance
- Toggle via bouton dans la navigation

### 3. Navigation et Sections

- Navigation fixe avec effet de scroll (classe `.scrolled` ajoutée dynamiquement)
- Menu mobile avec toggle hamburger
- Intersection Observer pour mettre à jour le lien actif selon la section visible
- Smooth scroll natif CSS + JavaScript pour les ancres

### 4. Animations

- **Au chargement** : Loading screen avec spinner
- **Hero** : Effet de frappe (typewriter) pour les titres alternés
- **Scroll** : Intersection Observer pour fade-in des cartes
- **Compteurs** : Animation incrémentale des statistiques
- **Hover** : Transitions CSS sur les cartes, boutons, liens

### 5. Responsive Design

Breakpoints principaux :
- Mobile : < 640px
- Tablette : < 968px
- Desktop : ≥ 968px

Grid/Flexbox utilisés pour tous les layouts, avec `grid-template-columns: repeat(auto-fit, minmax(...))` pour l'adaptabilité.

## Commandes de Développement

### Lancer un serveur local

```bash
# Python (recommandé pour développement)
python -m http.server 8000

# Node.js (nécessite installation globale)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Accès : http://localhost:8000

### Tester sur mobile (même réseau local)

```bash
# Trouver votre IP locale
ipconfig  # Windows
ifconfig  # Mac/Linux

# Lancer le serveur et accéder via http://[VOTRE-IP]:8000
```

### Valider le HTML

```bash
# Utiliser le validator W3C en ligne
# ou installer localement :
npm install -g html-validate
html-validate index.html
```

## Personnalisation du Portfolio

### Modifier les données

Éditer `data.json` - le JavaScript charge automatiquement les nouvelles données.

### Changer les couleurs

Modifier les variables CSS dans `css/styles.css` ligne 6-30 (section `:root`).

### Ajouter une section

1. Ajouter le HTML dans `index.html`
2. Créer les styles dans `css/styles.css`
3. Ajouter la logique JS si nécessaire dans `js/script.js`
4. Ajouter le lien dans la navigation

### Configurer le formulaire de contact

Options :
- **FormSubmit** : Changer l'action du form vers `https://formsubmit.co/email`
- **EmailJS** : Ajouter SDK et configurer dans `initContactForm()`
- **Backend custom** : Créer un endpoint et faire un fetch dans `initContactForm()`

## Fichiers Importants

### index.html
Page unique contenant toutes les sections. Structure sémantique avec sections identifiées par `id`.

### css/styles.css
Organisation :
1. Variables CSS
2. Reset & Base
3. Components (navbar, hero, sections...)
4. Responsive (@media queries à la fin)

### js/script.js
Modules fonctionnels :
- `loadPortfolioData()` : Charge et injecte data.json dans le DOM
- `initNavigation()` : Gère menu, scroll, active states
- `initThemeToggle()` : Mode sombre/clair
- `initTypingEffect()` : Animation typewriter
- `initScrollAnimations()` : Intersection Observer pour animations
- `initCounters()` : Compteurs animés
- `initProjectFilters()` : Filtrage de projets
- `initContactForm()` : Soumission formulaire
- `initBackToTop()` : Bouton retour haut de page

## Déploiement

### GitHub Pages
Le plus simple pour un site statique :
1. Push vers GitHub
2. Settings > Pages > Source: main branch

### Netlify/Vercel
Drag & drop du dossier ou connexion au repo Git.

## Optimisations Possibles

- Compresser les images (WebP, lazy loading)
- Minifier CSS/JS pour la production
- Ajouter un Service Worker pour PWA
- Utiliser un CDN pour les assets
- Implémenter le cache navigateur via headers

## Dépannage Courant

**Les images ne s'affichent pas** : Vérifier les chemins dans data.json et que les fichiers existent dans `images/`.

**Le formulaire ne fonctionne pas** : C'est normal, c'est une simulation. Voir README pour configuration réelle.

**Erreur CORS avec data.json** : Utiliser un serveur local, pas file:// directement.

**Les animations ne marchent pas** : Vérifier que JavaScript est activé et qu'il n'y a pas d'erreurs console.
