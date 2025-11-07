# Frontend - Portfolio

Interface utilisateur du portfolio d'Alice Sindayigaya.

## Structure

```
frontend/
├── public/              # Fichiers publics
│   ├── index.html      # Page principale du portfolio
│   ├── css/            # Styles
│   │   └── styles.css
│   ├── js/             # Scripts JavaScript
│   │   ├── apiConfig.js  # Configuration API
│   │   └── script.js     # Logique principale
│   ├── images/         # Images du portfolio
│   ├── assets/         # Fichiers téléchargeables (CV, etc.)
│   └── admin/          # Panel d'administration
└── README.md
```

## Technologies

- **HTML5** : Structure sémantique
- **CSS3** : Styles personnalisés avec variables CSS
- **JavaScript Vanilla** : Pas de framework, ES6+
- **Font Awesome** : Icônes
- **Google Fonts** : Poppins, Playfair Display

## Fonctionnalités

### Portfolio Public
- ✅ Design responsive (mobile, tablette, desktop)
- ✅ Mode sombre/clair avec persistance
- ✅ Animations au scroll (Intersection Observer)
- ✅ Effet de frappe (typewriter) dans le hero
- ✅ Filtrage des projets
- ✅ Formulaire de contact
- ✅ Navigation smooth scroll

### Panel d'Administration
- ✅ Authentification sécurisée
- ✅ Tableau de bord avec statistiques
- ✅ Gestion CRUD de toutes les sections
- ✅ Upload d'images
- ✅ Interface intuitive

## Installation

1. **Pas de build nécessaire** - Le frontend est en HTML/CSS/JS vanilla

2. **Lancer un serveur local** :

Avec Python:
```bash
cd frontend/public
python -m http.server 8000
```

Avec Node.js:
```bash
cd frontend/public
npx http-server -p 8000
```

Avec PHP:
```bash
cd frontend/public
php -S localhost:8000
```

3. **Accéder au site** :
- Portfolio : http://localhost:8000
- Admin : http://localhost:8000/admin

## Configuration

### Connexion à l'API Backend

Le frontend est configuré pour utiliser l'API backend. Éditez `public/js/apiConfig.js` :

```javascript
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'  // Backend en dev
    : 'https://votre-api.com/api';  // Backend en production
```

### Mode Fallback (sans backend)

Si l'API backend n'est pas disponible, le frontend bascule automatiquement en mode fallback et charge les données depuis `data.json` local.

## Personnalisation

### Couleurs

Modifier les variables CSS dans `public/css/styles.css` :

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #8b5cf6;
    --accent-color: #f59e0b;
    /* ... */
}
```

### Titres animés

Modifier le tableau dans `public/js/script.js` (fonction `initTypingEffect`) :

```javascript
const titles = [
    'Développeuse Full Stack',
    'Votre Titre 2',
    'Votre Titre 3'
];
```

### Images

Placer vos images dans `public/images/` :
- `profile.jpg` : Photo de profil
- `project1.jpg`, `project2.jpg`, etc. : Projets
- `favicon.png` : Icône du site

### CV

Placer votre CV PDF dans `public/assets/cv.pdf`

## Sections du Portfolio

1. **Hero** : Présentation avec effet de frappe
2. **À propos** : Informations personnelles
3. **Expérience** : Timeline des expériences professionnelles
4. **Formation** : Parcours académique
5. **Compétences** : Compétences techniques et soft skills
6. **Projets** : Portfolio de projets avec filtres
7. **Certifications** : Certifications et réalisations
8. **Contact** : Formulaire de contact

## Responsive Design

### Breakpoints

- **Mobile** : < 640px
- **Tablette** : < 968px
- **Desktop** : ≥ 968px

Le design s'adapte automatiquement à toutes les tailles d'écran.

## SEO et Performance

### Meta Tags

Personnaliser dans `index.html` :

```html
<meta name="description" content="Votre description">
<meta name="keywords" content="vos, mots-clés">
<meta name="author" content="Votre nom">
```

### Optimisations

- Images optimisées (WebP recommandé)
- Lazy loading des images
- Minification CSS/JS pour la production
- Chargement asynchrone des polices

## Administration

### Accès

URL : `http://localhost:8000/admin`

### Connexion

1. Créer un compte dans Supabase (voir documentation backend)
2. Se connecter avec email/mot de passe
3. Gérer le contenu du portfolio

### Fonctionnalités Admin

- **Dashboard** : Vue d'ensemble et statistiques
- **Profil** : Modifier les informations personnelles
- **Expérience** : Ajouter/modifier/supprimer des expériences
- **Formation** : Gérer le parcours académique
- **Projets** : Gérer le portfolio de projets
- **Compétences** : Gérer les compétences techniques et soft skills
- **Certifications** : Gérer les certifications
- **Médias** : Upload et gestion des images

## Déploiement

### GitHub Pages

1. Placer les fichiers de `frontend/public/` à la racine
2. Push vers GitHub
3. Activer GitHub Pages dans les settings

### Netlify

1. Drag & drop du dossier `frontend/public/`
2. OU connexion au repo Git
3. Build settings : None (site statique)
4. Publish directory : `frontend/public`

### Vercel

```bash
cd frontend/public
vercel
```

## Variables d'environnement

Pour le déploiement, configurer :

- `API_BASE_URL` : URL de l'API backend en production

## Support Navigateurs

- ✅ Chrome (dernières versions)
- ✅ Firefox (dernières versions)
- ✅ Safari (dernières versions)
- ✅ Edge (dernières versions)

## Dépannage

**Images ne s'affichent pas**
→ Vérifier les chemins dans les données (API ou data.json)

**Erreur CORS avec l'API**
→ Vérifier que le backend autorise l'origine du frontend

**Mode fallback activé**
→ Le backend n'est pas accessible, vérifier qu'il est démarré

**Formulaire ne fonctionne pas**
→ Voir `public/js/script.js` fonction `initContactForm()` pour configurer un service
