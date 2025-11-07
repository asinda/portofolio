# 🚀 Guide Rapide de Déploiement

Déployer votre portfolio en **15 minutes** sur GitHub Pages (frontend) + Render (backend) - **100% GRATUIT**

---

## 📋 Checklist avant de commencer

- ✅ Compte GitHub : https://github.com/asinda
- ✅ Compte Render : https://render.com (créez-en un si nécessaire)
- ✅ Données dans Supabase
- ✅ Projet local fonctionnel

---

## 🎯 Étape 1 : Backend sur Render (5 min)

### 1.1 Créer le service

1. Allez sur **https://dashboard.render.com**
2. **New +** → **Web Service**
3. **Connect repository** → Sélectionnez `asinda/portofolio`
4. Remplissez :
   ```
   Name: portfolio-backend
   Region: Frankfurt (EU Central)
   Branch: dev
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

### 1.2 Variables d'environnement

Cliquez sur **Advanced** → Ajoutez :

```
NODE_ENV=production
PORT=5000
SUPABASE_URL=https://hfmxchnbivkdvxenbech.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbXhjaG5iaXZrZHZ4ZW5iZWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDIzMjEsImV4cCI6MjA3NzkxODMyMX0._tMACo7wZfyQ43SiJLsfH-W4wVhGVVtSUOJ_eZvdBDQ
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbXhjaG5iaXZrZHZ4ZW5iZWNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM0MjMyMSwiZXhwIjoyMDc3OTE4MzIxfQ.3zQJBLw1d2_W_XG-aWY2wQCBOdE4PXMAxwtmap3Jibc
ALLOWED_ORIGINS=https://asinda.github.io
JWT_SECRET=production_secret_key_change_me_1234567890
```

### 1.3 Déployer

1. **Create Web Service**
2. Attendez 2-3 min
3. Copiez l'URL : `https://portfolio-backend-xxxx.onrender.com`

### 1.4 Tester

```bash
curl https://portfolio-backend-xxxx.onrender.com/api/health
```

---

## 🌐 Étape 2 : Frontend sur GitHub Pages (5 min)

### 2.1 Mettre à jour l'URL backend

Ouvrez `frontend/public/js/apiConfig.js` et modifiez :

```javascript
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://portfolio-backend-xxxx.onrender.com/api';  // ← Votre URL Render
```

### 2.2 Commiter les changements

```bash
git add frontend/public/js/apiConfig.js
git commit -m "Update backend URL for production"
git push origin dev
```

### 2.3 Déployer sur GitHub Pages

**Utilisez le script automatique** :

```bash
chmod +x deploy-github-pages.sh
./deploy-github-pages.sh
```

**OU manuellement** :

```bash
mkdir temp-gh-pages && cd temp-gh-pages
git init && git checkout -b gh-pages
cp -r ../frontend/public/* .
touch .nojekyll
git add . && git commit -m "Deploy to GitHub Pages"
git remote add origin git@github.com:asinda/portofolio.git
git push -f origin gh-pages
cd .. && rm -rf temp-gh-pages
```

### 2.4 Activer GitHub Pages

1. **GitHub** → https://github.com/asinda/portofolio
2. **Settings** → **Pages**
3. **Source** : Branch `gh-pages`, folder `/ (root)`
4. **Save**

Attendez 2-3 minutes.

Votre site : **https://asinda.github.io/portofolio/**

---

## 🔧 Étape 3 : Configuration finale (5 min)

### 3.1 Mettre à jour CORS

1. **Render** → Votre service → **Environment**
2. Modifiez `ALLOWED_ORIGINS` :
   ```
   https://asinda.github.io
   ```
3. **Save** (Render redéploie automatiquement)

### 3.2 Tester

✅ **Portfolio** : https://asinda.github.io/portofolio/
✅ **Admin** : https://asinda.github.io/portofolio/admin
✅ **API** : https://portfolio-backend-xxxx.onrender.com/api/health

---

## 🎉 C'est fait !

Votre portfolio est en ligne **gratuitement** !

### URLs finales

| Service | URL |
|---------|-----|
| Portfolio | https://asinda.github.io/portofolio/ |
| Admin | https://asinda.github.io/portofolio/admin |
| Backend | https://portfolio-backend-xxxx.onrender.com/api |

---

## 🔄 Mises à jour futures

### Mettre à jour le frontend

```bash
# Modifier vos fichiers dans frontend/public/
./deploy-github-pages.sh
```

### Mettre à jour le backend

```bash
# Modifier vos fichiers dans backend/
git add .
git commit -m "Update backend"
git push origin dev
```

Render redéploie automatiquement !

---

## 🆘 Problèmes ?

### Erreur CORS
→ Vérifiez `ALLOWED_ORIGINS=https://asinda.github.io` sur Render

### Backend timeout
→ Normal au premier chargement (service gratuit s'endort)
→ Attendez 30-60 secondes

### Page 404
→ Vérifiez que la branche `gh-pages` existe : `git branch -a`
→ Relancez `./deploy-github-pages.sh`

---

## 📚 Documentation complète

Voir [docs/DEPLOY_GITHUB_RENDER.md](docs/DEPLOY_GITHUB_RENDER.md)

---

**Bon déploiement !** 🚀
