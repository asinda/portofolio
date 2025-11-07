# Portfolio Professionnel - Alice Sindayigaya

Portfolio moderne avec architecture frontend/backend séparée.

## Architecture

```
portofolio/
├── frontend/              # Application client
│   ├── public/           # Site statique
│   │   ├── index.html    # Portfolio public
│   │   ├── admin/        # Panel d'administration
│   │   ├── css/          # Styles
│   │   ├── js/           # Scripts
│   │   ├── images/       # Images
│   │   └── assets/       # Fichiers (CV, etc.)
│   └── README.md
├── backend/              # API REST
│   ├── src/
│   │   ├── routes/       # Routes API
│   │   ├── controllers/  # Logique métier
│   │   ├── config/       # Configuration
│   │   └── middleware/   # Auth, CORS, etc.
│   ├── server.js         # Serveur Express
│   ├── package.json
│   └── README.md
├── docs/                 # Documentation
│   ├── ADMIN_GUIDE.md
│   ├── SUPABASE_SETUP.md
│   └── ...
└── README.md             # Ce fichier
```

## Stack Technique

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Design responsive avec mode sombre/clair
- Animations fluides et interactions modernes
- Font Awesome 6.4.0
- Google Fonts (Poppins, Playfair Display)

### Backend
- Node.js + Express.js
- Supabase (PostgreSQL + Auth)
- API REST complète
- Sécurité : Helmet, CORS, Rate Limiting
- Authentification JWT via Supabase Auth

## Démarrage Rapide

### Option 1 : Avec Backend (Recommandé)

#### 1. Backend

```bash
cd backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés Supabase

# Démarrer le serveur
npm run dev
```

Le backend démarre sur `http://localhost:5000`

#### 2. Frontend

```bash
cd frontend/public

# Lancer un serveur local
python -m http.server 8000
# OU
npx http-server -p 8000
```

Le frontend est accessible sur `http://localhost:8000`

### Option 2 : Frontend seul (Mode Fallback)

Si vous ne voulez pas configurer le backend :

```bash
cd frontend/public
python -m http.server 8000
```

Le site utilisera `data.json` local au lieu de l'API.

## Configuration

### 1. Configurer Supabase

Suivre le guide complet : [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md)

Résumé :
1. Créer un compte sur [Supabase](https://supabase.com)
2. Créer un nouveau projet
3. Exécuter les scripts SQL pour créer les tables
4. Récupérer les clés API

### 2. Configurer le Backend

```bash
cd backend
cp .env.example .env
```

Éditer `.env` :
```env
PORT=5000
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_cle_publique
SUPABASE_SERVICE_KEY=votre_cle_service
ALLOWED_ORIGINS=http://localhost:8000
```

### 3. Configurer le Frontend

Éditer `frontend/public/js/apiConfig.js` :

```javascript
const API_BASE_URL = 'http://localhost:5000/api'; // Dev
// Pour la production :
// const API_BASE_URL = 'https://votre-api.com/api';
```

## Fonctionnalités

### Frontend

✅ **Portfolio Public**
- Design moderne et responsive
- Mode sombre/clair
- Animations au scroll
- Sections : À propos, Expérience, Formation, Projets, Compétences, Contact
- Filtrage des projets
- Formulaire de contact

✅ **Panel d'Administration**
- Authentification sécurisée
- Tableau de bord avec statistiques
- Gestion CRUD complète (Expérience, Formation, Projets, etc.)
- Upload d'images
- Interface intuitive

### Backend

✅ **API REST**
- Routes publiques (GET) pour le portfolio
- Routes protégées (POST/PUT/DELETE) pour l'admin
- Authentification JWT
- CORS configuré
- Rate limiting (100 req/15min)
- Health check endpoint

## Documentation

- [**Frontend README**](frontend/README.md) : Guide complet du frontend
- [**Backend README**](backend/README.md) : Documentation de l'API
- [**SUPABASE_SETUP**](docs/SUPABASE_SETUP.md) : Configuration de la base de données
- [**ADMIN_GUIDE**](docs/ADMIN_GUIDE.md) : Guide d'utilisation de l'admin


## API Endpoints

### Publics (GET)

- `GET /api/portfolio/profile` - Profil
- `GET /api/portfolio/experience` - Expériences
- `GET /api/portfolio/education` - Formations
- `GET /api/portfolio/projects` - Projets
- `GET /api/portfolio/skills/technical` - Compétences techniques
- `GET /api/portfolio/certifications` - Certifications

### Protégés (Auth requise)

- `POST /api/auth/login` - Connexion
- `POST /api/portfolio/experience` - Créer une expérience
- `PUT /api/portfolio/experience/:id` - Modifier une expérience
- `DELETE /api/portfolio/experience/:id` - Supprimer une expérience
- *(Même pattern pour education, projects, skills, certifications)*

Voir [backend/README.md](backend/README.md) pour la liste complète.

## Déploiement

### Frontend

**GitHub Pages / Netlify / Vercel**
- Déployer le contenu de `frontend/public/`
- Mettre à jour `API_BASE_URL` avec l'URL de production du backend

### Backend

**Heroku / Railway / Render**

Exemple avec Heroku :
```bash
cd backend
heroku create mon-portfolio-api
git push heroku main
heroku config:set SUPABASE_URL=xxx SUPABASE_SERVICE_KEY=xxx
```

**Variables d'environnement à configurer** :
- `PORT` (auto sur Heroku)
- `NODE_ENV=production`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `ALLOWED_ORIGINS` (URL du frontend)

## Scripts Disponibles

### Backend
```bash
npm start       # Production
npm run dev     # Développement avec nodemon
```

### Frontend
Pas de build requis - servir les fichiers statiques directement.

## Personnalisation

### Couleurs

Modifier `frontend/public/css/styles.css` :

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #8b5cf6;
    --accent-color: #f59e0b;
}
```

### Données

**Avec backend** : Utiliser le panel admin
**Sans backend** : Éditer `backend/src/data.json`

## Sécurité

- ✅ Authentification JWT via Supabase
- ✅ CORS configuré pour origines spécifiques
- ✅ Rate limiting (anti-abus)
- ✅ Helmet (sécurisation headers HTTP)
- ✅ Variables sensibles dans .env (non commitées)

## Support Navigateurs

- Chrome (dernières versions)
- Firefox (dernières versions)
- Safari (dernières versions)
- Edge (dernières versions)

## Dépannage

### Le frontend ne charge pas les données

1. Vérifier que le backend est démarré (`http://localhost:5000/api/health`)
2. Vérifier `API_BASE_URL` dans `frontend/public/js/apiConfig.js`
3. Vérifier la console du navigateur pour les erreurs CORS

### Erreur CORS

Ajouter l'origine du frontend dans `backend/.env` :
```env
ALLOWED_ORIGINS=http://localhost:8000,http://localhost:3000
```

### Le backend ne démarre pas

1. Vérifier que le fichier `.env` existe
2. Vérifier que les clés Supabase sont correctes
3. Installer les dépendances : `npm install`

### Données non sauvegardées dans l'admin

1. Vérifier que vous êtes connecté
2. Vérifier les tables Supabase (voir SUPABASE_SETUP.md)
3. Vérifier la console du navigateur pour les erreurs

## Contribution

Ce portfolio est personnel, mais vous pouvez l'utiliser comme template.

## Licence

MIT - Libre d'utilisation pour votre propre portfolio.

## Auteur

**Alice Sindayigaya**
- LinkedIn : [alicesindayigaya](https://www.linkedin.com/in/alicesindayigaya)
- GitHub : [asinda](https://github.com/asinda)

---

Créé avec passion 💙
