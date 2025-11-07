# Backend API - Portfolio

API REST pour gérer le portfolio d'Alice Sindayigaya.

## Stack Technique

- **Runtime** : Node.js (v18+)
- **Framework** : Express.js
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth
- **Sécurité** : Helmet, CORS, Rate Limiting

## Installation

1. **Installer les dépendances** :
```bash
npm install
```

2. **Configurer les variables d'environnement** :
```bash
cp .env.example .env
```

Puis éditer le fichier `.env` avec vos vraies valeurs :
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_cle_publique
SUPABASE_SERVICE_KEY=votre_cle_service
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

3. **Démarrer le serveur** :

**Mode développement** (avec auto-reload) :
```bash
npm run dev
```

**Mode production** :
```bash
npm start
```

Le serveur démarre sur `http://localhost:5000`

## Routes API

### Authentification

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/api/auth/login` | Connexion | Non |
| POST | `/api/auth/register` | Inscription | Non |
| POST | `/api/auth/logout` | Déconnexion | Non |
| GET | `/api/auth/user` | Utilisateur actuel | Oui |

### Portfolio

#### Profil
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/portfolio/profile` | Récupérer le profil | Non |
| PUT | `/api/portfolio/profile` | Modifier le profil | Oui |

#### Expérience
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/portfolio/experience` | Liste des expériences | Non |
| GET | `/api/portfolio/experience/:id` | Une expérience | Non |
| POST | `/api/portfolio/experience` | Créer une expérience | Oui |
| PUT | `/api/portfolio/experience/:id` | Modifier une expérience | Oui |
| DELETE | `/api/portfolio/experience/:id` | Supprimer une expérience | Oui |

#### Formation
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/portfolio/education` | Liste des formations | Non |
| GET | `/api/portfolio/education/:id` | Une formation | Non |
| POST | `/api/portfolio/education` | Créer une formation | Oui |
| PUT | `/api/portfolio/education/:id` | Modifier une formation | Oui |
| DELETE | `/api/portfolio/education/:id` | Supprimer une formation | Oui |

#### Projets
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/portfolio/projects` | Liste des projets | Non |
| GET | `/api/portfolio/projects/:id` | Un projet | Non |
| POST | `/api/portfolio/projects` | Créer un projet | Oui |
| PUT | `/api/portfolio/projects/:id` | Modifier un projet | Oui |
| DELETE | `/api/portfolio/projects/:id` | Supprimer un projet | Oui |

#### Compétences
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/portfolio/skills/technical` | Compétences techniques | Non |
| POST | `/api/portfolio/skills/technical` | Créer une compétence | Oui |
| PUT | `/api/portfolio/skills/technical/:id` | Modifier | Oui |
| DELETE | `/api/portfolio/skills/technical/:id` | Supprimer | Oui |
| GET | `/api/portfolio/skills/languages` | Langues | Non |
| GET | `/api/portfolio/skills/soft` | Soft skills | Non |

#### Certifications
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/portfolio/certifications` | Liste des certifications | Non |
| POST | `/api/portfolio/certifications` | Créer une certification | Oui |
| PUT | `/api/portfolio/certifications/:id` | Modifier | Oui |
| DELETE | `/api/portfolio/certifications/:id` | Supprimer | Oui |

### Utilitaires
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/health` | Health check |

## Authentification

Pour les routes protégées, inclure le token JWT dans les headers :

```javascript
headers: {
    'Authorization': 'Bearer VOTRE_TOKEN_JWT'
}
```

## Format des Réponses

### Succès
```json
{
    "success": true,
    "data": {...},
    "message": "Message optionnel"
}
```

### Erreur
```json
{
    "success": false,
    "error": "Message d'erreur"
}
```

## Sécurité

- **CORS** : Configuré pour autoriser uniquement les origines définies
- **Rate Limiting** : 100 requêtes par IP toutes les 15 minutes
- **Helmet** : Protection des headers HTTP
- **Authentification** : JWT via Supabase Auth

## Scripts

```bash
npm start       # Démarrer en production
npm run dev     # Démarrer en développement avec nodemon
```

## Variables d'Environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| PORT | Port du serveur | 5000 |
| NODE_ENV | Environnement | development |
| SUPABASE_URL | URL Supabase | https://xxx.supabase.co |
| SUPABASE_ANON_KEY | Clé publique | eyJh... |
| SUPABASE_SERVICE_KEY | Clé service | eyJh... |
| ALLOWED_ORIGINS | Origines CORS | http://localhost:3000 |

## Dépannage

**Erreur : "Variables d'environnement Supabase manquantes"**
→ Vérifier que le fichier `.env` existe et contient les bonnes valeurs

**Erreur CORS**
→ Ajouter l'origine du frontend dans `ALLOWED_ORIGINS`

**Erreur de connexion à Supabase**
→ Vérifier que les clés Supabase sont correctes
