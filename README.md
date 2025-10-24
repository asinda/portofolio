# Portfolio Professionnel - Alice Sindayigaya

Portfolio personnel moderne et responsive développé avec HTML, CSS et JavaScript vanilla.

## Caractéristiques

### Frontend
- Design moderne et professionnel
- Entièrement responsive (mobile, tablette, desktop)
- Mode sombre/clair
- Animations fluides au scroll
- Sections complètes : À propos, Expérience, Formation, Projets, Compétences, Contact
- Chargement dynamique des données depuis JSON ou Supabase
- Formulaire de contact fonctionnel
- SEO optimisé

### Administration (Nouveau !)
- 🎯 **Panneau d'administration complet** dans `/admin/`
- 🔐 **Authentification sécurisée** avec Supabase
- 📊 **Tableau de bord** avec statistiques
- ✏️ **Gestion CRUD complète** pour toutes les sections
- 📁 **Gestion des médias** (upload d'images)
- 🗄️ **Base de données PostgreSQL** via Supabase (gratuite et open source)
- 🌐 **Temps réel** - les modifications sont instantanées

## Structure du Projet

```
portofolio/
├── index.html          # Page principale
├── admin/              # 🆕 Panel d'administration
│   ├── index.html      #    Interface admin
│   ├── css/
│   │   └── admin.css   #    Styles admin
│   └── js/
│       ├── config.js   #    Configuration Supabase
│       └── admin.js    #    Logique admin
├── css/
│   └── styles.css      # Styles personnalisés
├── js/
│   └── script.js       # Fonctionnalités JavaScript
├── images/             # Images du portfolio
├── assets/             # Fichiers supplémentaires (CV, etc.)
├── data.json           # Données du portfolio (mode local)
└── README.md           # Documentation
```

## Installation et Utilisation

### 1. Cloner ou télécharger le projet

```bash
git clone <url-du-repo>
cd portofolio
```

### 2. Personnaliser vos données

Éditez le fichier `data.json` avec vos informations personnelles :

- Profil (nom, titre, contact, à propos)
- Expérience professionnelle
- Formation
- Compétences techniques et interpersonnelles
- Projets réalisés
- Certifications

### 3. Ajouter vos images

Placez vos images dans le dossier `images/` :

- `profile.jpg` : Votre photo de profil
- `project1.jpg`, `project2.jpg`, etc. : Images de vos projets
- `favicon.png` : Icône du site

### 4. Ajouter votre CV

Placez votre CV PDF dans le dossier `assets/` avec le nom `cv.pdf`

### 5. Lancer le site

Ouvrez simplement `index.html` dans votre navigateur, ou utilisez un serveur local :

```bash
# Avec Python
python -m http.server 8000

# Avec Node.js (http-server)
npx http-server

# Avec PHP
php -S localhost:8000
```

Puis accédez à `http://localhost:8000`

### 6. Utiliser l'administration (Optionnel mais recommandé)

L'administration vous permet de gérer votre portfolio via une interface graphique au lieu de modifier manuellement les fichiers.

#### Configuration en 3 étapes :

1. **Configurer Supabase** (5 minutes) :
   - Suivez le guide complet : [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
   - Créez un compte gratuit sur [Supabase](https://supabase.com)
   - Créez les tables nécessaires
   - Obtenez vos clés API

2. **Configurer l'application** :
   - Ouvrez `admin/js/config.js`
   - Remplacez `SUPABASE_URL` et `SUPABASE_ANON_KEY` par vos valeurs

3. **Se connecter** :
   - Accédez à `http://localhost:8000/admin/`
   - Créez votre compte utilisateur (voir guide Supabase)
   - Connectez-vous et gérez votre portfolio !

#### Avantages de l'administration :

- ✅ Interface intuitive pour gérer tout votre contenu
- ✅ Pas besoin de modifier le code
- ✅ Upload d'images simplifié
- ✅ Modifications en temps réel
- ✅ Base de données sécurisée et gratuite

#### Continuer sans l'administration :

Si vous préférez ne pas utiliser l'administration pour le moment :
- Continuez à modifier le fichier `data.json` manuellement
- Vous pourrez configurer Supabase plus tard

## Personnalisation Avancée

### Modifier les couleurs

Éditez les variables CSS dans `css/styles.css` :

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #8b5cf6;
    --accent-color: #f59e0b;
    /* ... */
}
```

### Modifier les titres animés

Éditez le tableau `titles` dans `js/script.js` (fonction `initTypingEffect`) :

```javascript
const titles = [
    'Votre Titre 1',
    'Votre Titre 2',
    'Votre Titre 3'
];
```

### Configurer le formulaire de contact

Le formulaire utilise actuellement une simulation. Pour l'activer réellement, vous pouvez :

1. Utiliser **FormSubmit** (gratuit, sans backend)
2. Utiliser **EmailJS** (gratuit, jusqu'à 200 emails/mois)
3. Créer votre propre backend

Exemple avec FormSubmit :
```html
<form action="https://formsubmit.co/votre-email@example.com" method="POST">
```

## Déploiement

### GitHub Pages

1. Poussez votre code sur GitHub
2. Allez dans Settings > Pages
3. Sélectionnez la branche `main` et le dossier `/root`
4. Votre site sera disponible à `https://votre-username.github.io/portofolio`

### Netlify

1. Connectez votre dépôt GitHub à Netlify
2. Le déploiement est automatique à chaque push

### Vercel

```bash
npm i -g vercel
vercel
```

## Support des Navigateurs

- Chrome (dernières versions)
- Firefox (dernières versions)
- Safari (dernières versions)
- Edge (dernières versions)

## Licence

Ce projet est libre d'utilisation pour votre portfolio personnel.

## Auteur

Alice Sindayigaya
- LinkedIn: [alicesindayigaya](https://www.linkedin.com/in/alicesindayigaya)

---

Créé avec passion 💙
