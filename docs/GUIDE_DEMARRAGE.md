# Guide de Démarrage Rapide

Bienvenue ! Voici les étapes pour personnaliser votre portfolio en 10 minutes.

## Étape 1 : Personnaliser vos informations (5 min)

Ouvrez le fichier `data.json` et modifiez :

### 1.1 Profil de base
```json
"profile": {
    "name": "Votre Nom Complet",
    "title": "Votre Titre Professionnel Principal",
    "location": "Votre Ville, Pays",
    "email": "votre.email@example.com",
    "phone": "+XXX XXX XXX XXX",
    "linkedin": "https://www.linkedin.com/in/alicesindayigaya",
    "github": "https://github.com/votre-username",
    "about": "Écrivez 2-3 phrases sur vous, votre expertise et ce qui vous passionne..."
}
```

### 1.2 Titres animés
Dans `js/script.js`, ligne ~150, modifiez :
```javascript
const titles = [
    'Votre Titre 1',
    'Votre Titre 2',
    'Votre Titre 3'
];
```

## Étape 2 : Ajouter vos expériences (3 min)

Dans `data.json`, section `experience` :

```json
{
    "position": "Votre Poste",
    "company": "Nom de l'Entreprise",
    "location": "Ville, Pays",
    "startDate": "Janv. 2022",
    "endDate": "Présent",
    "current": true,
    "description": "Brève description de votre rôle",
    "achievements": [
        "Réalisation importante 1",
        "Réalisation importante 2"
    ]
}
```

## Étape 3 : Ajouter vos projets (2 min)

Dans `data.json`, section `projects` :

```json
{
    "title": "Nom du Projet",
    "description": "Description courte du projet",
    "image": "images/project1.jpg",
    "technologies": ["React", "Node.js", "MongoDB"],
    "link": "https://lien-demo.com",
    "github": "https://github.com/vous/projet"
}
```

## Étape 4 : Ajouter vos images

1. Ajoutez votre photo de profil dans `images/profile.jpg`
2. Ajoutez les captures d'écran de vos projets dans `images/`
3. Ajoutez votre CV dans `assets/cv.pdf`

**Astuce** : Si vous n'avez pas les images maintenant, le site fonctionnera quand même avec des placeholders.

## Étape 5 : Tester votre portfolio

### Option A : Ouvrir directement (rapide mais limité)
Double-cliquez sur `index.html`

⚠️ **Attention** : Les données JSON peuvent ne pas se charger avec cette méthode.

### Option B : Serveur local (recommandé)

**Avec Python** (déjà installé sur Mac/Linux, facile sur Windows) :
```bash
python -m http.server 8000
```

Puis ouvrez : http://localhost:8000

**Avec Node.js** :
```bash
npx http-server -p 8000
```

**Avec PHP** :
```bash
php -S localhost:8000
```

## Étape 6 : Personnaliser les couleurs (optionnel)

Dans `css/styles.css`, lignes 6-15 :

```css
:root {
    --primary-color: #2563eb;      /* Couleur principale */
    --secondary-color: #8b5cf6;    /* Couleur secondaire */
    --accent-color: #f59e0b;       /* Couleur d'accent */
}
```

Utilisez un color picker : https://htmlcolorcodes.com/

## Prochaines étapes

### Pour mettre en ligne gratuitement

**GitHub Pages** (recommandé) :
1. Créez un compte sur https://github.com
2. Créez un nouveau repository `portfolio`
3. Uploadez tous vos fichiers
4. Allez dans Settings > Pages
5. Activez GitHub Pages
6. Votre site sera à : `https://votre-username.github.io/portfolio`

**Netlify** :
1. Créez un compte sur https://netlify.com
2. Glissez-déposez votre dossier
3. Votre site est en ligne !

### Configurer le formulaire de contact

Le formulaire est actuellement en mode "simulation". Pour le rendre fonctionnel :

**Méthode simple (FormSubmit - gratuit)** :

Dans `index.html`, ligne 427, changez :
```html
<form class="contact-form" id="contactForm" action="https://formsubmit.co/votre-email@example.com" method="POST">
```

Et dans `js/script.js`, commentez la fonction `initContactForm()` (elle n'est plus nécessaire).

## Besoin d'aide ?

- **Documentation complète** : Lisez [README.md](README.md)
- **Architecture technique** : Consultez [CLAUDE.md](CLAUDE.md)
- **Images** : Voir [images/README.md](images/README.md)
- **Assets** : Voir [assets/README.md](assets/README.md)

## Checklist finale

- [ ] Informations personnelles mises à jour
- [ ] Au moins 2 expériences ajoutées
- [ ] Au moins 3 projets ajoutés
- [ ] Compétences listées
- [ ] Photo de profil ajoutée
- [ ] CV ajouté
- [ ] Testé localement
- [ ] Couleurs personnalisées (optionnel)
- [ ] Mis en ligne

Bon courage ! 🚀
