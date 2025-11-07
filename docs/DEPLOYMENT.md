# Guide de Déploiement - Portfolio Alice Sindayigaya

Ce guide vous accompagne dans le déploiement de votre portfolio en production.

## 📋 Vue d'ensemble

Votre portfolio utilise une architecture séparée :
- **Backend** : API Node.js + Express (déployé sur Render)
- **Frontend** : Site statique HTML/CSS/JS (déployé sur Netlify/Vercel/GitHub Pages)
- **Base de données** : Supabase (déjà en ligne)

---

## 🚀 Étape 1 : Déploiement du Backend (Render)

### Option A : Le backend existe déjà sur Render

Votre configuration montre déjà une URL Render : `https://portfolio-backend-uj9f.onrender.com`

**Mettre à jour le backend existant :**

1. **Allez sur Render.com** : https://dashboard.render.com
2. **Trouvez votre service** : `portfolio-backend-uj9f`
3. **Vérifiez les variables d'environnement** :
   ```
   NODE_ENV=production
   PORT=5000
   SUPABASE_URL=https://hfmxchnbivkdvxenbech.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ALLOWED_ORIGINS=https://votre-domaine-frontend.netlify.app
   JWT_SECRET=votre_secret_jwt_production_secure_123456789
   ```
4. **Déployez** : Cliquez sur "Manual Deploy" → "Deploy latest commit"

### Option B : Créer un nouveau service sur Render

1. **Allez sur** : https://dashboard.render.com
2. **New** → **Web Service**
3. **Connectez votre repo GitHub**
4. **Configuration** :
   - **Name** : `portfolio-backend`
   - **Environment** : `Node`
   - **Build Command** : `cd backend && npm install`
   - **Start Command** : `cd backend && npm start`
   - **Plan** : Free
5. **Variables d'environnement** : Ajoutez toutes les variables ci-dessus
6. **Create Web Service**

### Tester le backend

Une fois déployé, testez :
```bash
curl https://portfolio-backend-uj9f.onrender.com/api/health
```

Vous devriez voir :
```json
{"success":true,"message":"API Portfolio - Serveur en ligne","version":"1.0.0"}
```

---

## 🌐 Étape 2 : Déploiement du Frontend

### Option 1 : Netlify (Recommandé - Le plus simple)

#### Via l'interface web :

1. **Allez sur** : https://app.netlify.com
2. **Sites** → **Add new site** → **Deploy manually**
3. **Glissez-déposez** le dossier `frontend/public/` dans la zone
4. **Votre site est en ligne !** 🎉

**URL** : `https://random-name-123.netlify.app`

#### Personnaliser le domaine :

1. **Site settings** → **Domain management**
2. **Change site name** → Exemple : `alice-sindayigaya`
3. **Nouvelle URL** : `https://alice-sindayigaya.netlify.app`

#### Via Git (déploiement automatique) :

1. **Sites** → **Add new site** → **Import from Git**
2. **Connectez GitHub**
3. **Configuration** :
   - **Base directory** : `frontend/public`
   - **Build command** : (laisser vide)
   - **Publish directory** : `.`
4. **Deploy site**

### Option 2 : Vercel

1. **Allez sur** : https://vercel.com
2. **Add New** → **Project**
3. **Import Git Repository**
4. **Configuration** :
   - **Framework Preset** : Other
   - **Root Directory** : `frontend/public`
   - **Build Command** : (laisser vide)
   - **Output Directory** : `.`
5. **Deploy**

### Option 3 : GitHub Pages

1. **Créez une branche** `gh-pages`
2. **Copiez** le contenu de `frontend/public/` à la racine
3. **GitHub repo** → **Settings** → **Pages**
4. **Source** : `gh-pages` branch
5. **Save**

**URL** : `https://votre-username.github.io/portofolio/`

---

## 🔧 Étape 3 : Configuration post-déploiement

### 1. Mettre à jour CORS sur le backend

Une fois le frontend déployé, ajoutez son URL aux origines autorisées :

**Sur Render.com** :
1. Allez dans votre service backend
2. **Environment** → **ALLOWED_ORIGINS**
3. Ajoutez : `https://alice-sindayigaya.netlify.app` (ou votre URL)
4. **Save Changes**

### 2. Vérifier apiConfig.js (Frontend)

Le fichier est déjà configuré pour la production :

```javascript
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://portfolio-backend-uj9f.onrender.com/api';
```

✅ **Aucune modification nécessaire !**

### 3. Vérifier l'admin Supabase

Le fichier `frontend/public/admin/js/config.js` est déjà configuré avec vos clés Supabase.

✅ **Aucune modification nécessaire !**

---

## ✅ Étape 4 : Vérification finale

### 1. Tester le frontend

- **Portfolio public** : `https://votre-site.netlify.app`
- **Panel admin** : `https://votre-site.netlify.app/admin`

### 2. Tester la connexion API

Ouvrez F12 sur votre site → Onglet Network :
- Vous devriez voir des appels à `https://portfolio-backend-uj9f.onrender.com/api/`
- Status : 200 OK

### 3. Tester l'authentification admin

1. Allez sur `https://votre-site.netlify.app/admin`
2. Connectez-vous avec vos identifiants Supabase
3. Vérifiez que vous pouvez modifier les données

---

## 🎯 Récapitulatif des URLs

Après déploiement, vous aurez :

| Service | URL |
|---------|-----|
| **Frontend (Portfolio)** | `https://alice-sindayigaya.netlify.app` |
| **Frontend (Admin)** | `https://alice-sindayigaya.netlify.app/admin` |
| **Backend API** | `https://portfolio-backend-uj9f.onrender.com/api` |
| **Base de données** | `https://hfmxchnbivkdvxenbech.supabase.co` |

---

## 🔒 Sécurité - Checklist

Avant de déployer, vérifiez :

- ✅ Les clés Supabase sont dans les variables d'environnement (pas en dur dans le code)
- ✅ `NODE_ENV=production` sur Render
- ✅ `ALLOWED_ORIGINS` contient UNIQUEMENT les URLs autorisées
- ✅ Le fichier `.env` est dans `.gitignore` (ne pas committer les secrets)
- ✅ JWT_SECRET est différent en production qu'en développement

---

## 🔄 Mises à jour futures

### Mettre à jour le frontend :

**Netlify (glisser-déposer)** :
1. Modifiez vos fichiers localement
2. Allez sur Netlify → **Deploys**
3. **Drag and drop** le dossier `frontend/public/` mis à jour

**Netlify/Vercel (Git)** :
1. Commitez vos changements : `git add . && git commit -m "Update frontend"`
2. Poussez : `git push`
3. Le site se met à jour automatiquement ! ✨

### Mettre à jour le backend :

**Render** :
1. Commitez vos changements : `git add . && git commit -m "Update backend"`
2. Poussez : `git push`
3. Render redéploie automatiquement (ou cliquez sur "Manual Deploy")

---

## 🆘 Problèmes courants

### ❌ Erreur CORS

**Symptôme** : "Access-Control-Allow-Origin" error dans la console

**Solution** :
1. Vérifiez que `ALLOWED_ORIGINS` sur Render contient l'URL exacte du frontend
2. Pas de "/" à la fin de l'URL
3. Redéployez le backend après modification

### ❌ API ne répond pas

**Symptôme** : Erreur "Failed to fetch" ou timeout

**Solution** :
1. Vérifiez que le backend est bien démarré sur Render
2. Testez directement : `curl https://portfolio-backend-uj9f.onrender.com/api/health`
3. Les services gratuits Render s'endorment après 15 min d'inactivité (premier chargement lent)

### ❌ Admin ne se connecte pas

**Symptôme** : "Authentication failed"

**Solution** :
1. Vérifiez que les clés Supabase dans `config.js` sont correctes
2. Vérifiez que l'utilisateur existe dans Supabase → Authentication → Users
3. Videz le cache du navigateur (Ctrl+Shift+Delete)

### ❌ Images ne se chargent pas

**Symptôme** : Images cassées sur le site

**Solution** :
1. Vérifiez que les images sont dans `frontend/public/images/`
2. Vérifiez les chemins dans la base de données (doivent être relatifs : `images/photo.jpg`)
3. Redéployez le frontend avec toutes les images

---

## 📊 Monitoring

### Vérifier les logs du backend (Render)

1. Allez sur Render.com
2. Cliquez sur votre service
3. **Logs** → Voir les erreurs en temps réel

### Analyser le trafic (Netlify)

1. Allez sur Netlify
2. **Analytics** → Voir les visites, performances

---

## 🎉 Félicitations !

Votre portfolio est maintenant en ligne et prêt à être partagé ! 🚀

**Prochaines étapes** :
- Partagez le lien sur LinkedIn et votre CV
- Configurez un nom de domaine personnalisé (optionnel)
- Activez HTTPS (automatique sur Netlify/Vercel)
- Configurez Google Analytics (optionnel)

---

**Besoin d'aide ?** Consultez :
- [Documentation Render](https://render.com/docs)
- [Documentation Netlify](https://docs.netlify.com)
- [Documentation Supabase](https://supabase.com/docs)
