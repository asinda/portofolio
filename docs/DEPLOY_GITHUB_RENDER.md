# Déploiement GitHub Pages + Render - Guide Complet

Ce guide vous accompagne pour déployer gratuitement votre portfolio :
- **Frontend** : GitHub Pages (gratuit, illimité)
- **Backend** : Render (gratuit, 750h/mois)

---

## 📋 Prérequis

- ✅ Compte GitHub : https://github.com/asinda
- ✅ Compte Render : https://render.com
- ✅ Repo GitHub : `asinda/portofolio`
- ✅ Base de données Supabase configurée

---

## 🚀 PARTIE 1 : Déploiement du Backend sur Render

### Étape 1.1 : Préparer le backend pour Render

Le backend est déjà prêt ! Vérifiez juste que vous avez bien commité tous les fichiers :

```bash
cd backend
git status
```

Si des fichiers sont modifiés :
```bash
git add .
git commit -m "Préparer le backend pour déploiement Render"
git push origin dev
```

### Étape 1.2 : Créer le service sur Render

1. **Allez sur** : https://dashboard.render.com
2. **Connectez-vous** avec GitHub
3. **Cliquez sur** : **"New +"** → **"Web Service"**

### Étape 1.3 : Connecter le repo GitHub

1. **Connect a repository** → Cherchez `asinda/portofolio`
2. Si le repo n'apparaît pas :
   - Cliquez sur **"Configure account"**
   - Donnez accès à Render pour le repo `portofolio`
   - Revenez et sélectionnez le repo

### Étape 1.4 : Configuration du service

Remplissez les champs :

| Champ | Valeur |
|-------|--------|
| **Name** | `portfolio-backend` (ou gardez `portfolio-backend-uj9f` si existant) |
| **Region** | `Frankfurt (EU Central)` |
| **Branch** | `dev` (ou `main` selon votre branche) |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### Étape 1.5 : Configurer les variables d'environnement

Cliquez sur **"Advanced"** → **"Add Environment Variable"**

Ajoutez ces variables :

| Nom | Valeur |
|-----|--------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `SUPABASE_URL` | `https://hfmxchnbivkdvxenbech.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbXhjaG5iaXZrZHZ4ZW5iZWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDIzMjEsImV4cCI6MjA3NzkxODMyMX0._tMACo7wZfyQ43SiJLsfH-W4wVhGVVtSUOJ_eZvdBDQ` |
| `SUPABASE_SERVICE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbXhjaG5iaXZrZHZ4ZW5iZWNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM0MjMyMSwiZXhwIjoyMDc3OTE4MzIxfQ.3zQJBLw1d2_W_XG-aWY2wQCBOdE4PXMAxwtmap3Jibc` |
| `ALLOWED_ORIGINS` | `https://asinda.github.io` |
| `JWT_SECRET` | `production_secret_key_change_me_1234567890` |

> ⚠️ **IMPORTANT** : Pour `ALLOWED_ORIGINS`, mettez l'URL de votre futur GitHub Pages (on la mettra à jour après)

### Étape 1.6 : Créer le service

1. Cliquez sur **"Create Web Service"**
2. Attendez 2-3 minutes que le déploiement se termine
3. Vous verrez : ✅ **"Live"** en vert

### Étape 1.7 : Récupérer l'URL du backend

Votre backend sera accessible sur une URL du type :
```
https://portfolio-backend-xxxx.onrender.com
```

**Copiez cette URL**, vous en aurez besoin pour le frontend !

### Étape 1.8 : Tester le backend

Testez que l'API fonctionne :
```bash
curl https://portfolio-backend-xxxx.onrender.com/api/health
```

Résultat attendu :
```json
{
  "success": true,
  "message": "API Portfolio - Serveur en ligne",
  "version": "1.0.0",
  "timestamp": "2025-11-07T..."
}
```

✅ **Le backend est en ligne !**

---

## 🌐 PARTIE 2 : Déploiement du Frontend sur GitHub Pages

### Étape 2.1 : Mettre à jour l'URL du backend dans le frontend

1. Ouvrez le fichier `frontend/public/js/apiConfig.js`
2. Mettez à jour avec l'URL Render que vous venez de récupérer :

```javascript
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://portfolio-backend-xxxx.onrender.com/api';  // ← Votre URL Render ici
```

3. Sauvegardez le fichier

### Étape 2.2 : Créer la branche gh-pages

**Option A : Via un script automatique**

Créez un fichier `deploy-github-pages.sh` à la racine :

```bash
#!/bin/bash

echo "🚀 Déploiement sur GitHub Pages..."

# Créer un dossier temporaire
mkdir -p temp-gh-pages
cd temp-gh-pages

# Initialiser un nouveau repo Git
git init
git checkout -b gh-pages

# Copier les fichiers du frontend
cp -r ../frontend/public/* .

# Créer le fichier .nojekyll (important pour GitHub Pages)
touch .nojekyll

# Ajouter tous les fichiers
git add .
git commit -m "Deploy to GitHub Pages"

# Pousser vers GitHub
git remote add origin git@github.com:asinda/portofolio.git
git push -f origin gh-pages

# Nettoyer
cd ..
rm -rf temp-gh-pages

echo "✅ Déploiement terminé !"
```

Ensuite :
```bash
chmod +x deploy-github-pages.sh
./deploy-github-pages.sh
```

**Option B : Manuellement**

```bash
# 1. Aller à la racine du projet
cd c:/Users/ASINDAYIGAYA/Documents/projet/portofolio

# 2. Créer et aller dans un dossier temporaire
mkdir temp-gh-pages
cd temp-gh-pages

# 3. Initialiser Git
git init
git checkout -b gh-pages

# 4. Copier les fichiers du frontend
cp -r ../frontend/public/* .

# 5. Créer .nojekyll (important !)
echo "" > .nojekyll

# 6. Commiter
git add .
git commit -m "Deploy to GitHub Pages"

# 7. Pousser vers GitHub
git remote add origin git@github.com:asinda/portofolio.git
git push -f origin gh-pages

# 8. Revenir et nettoyer
cd ..
rm -rf temp-gh-pages
```

### Étape 2.3 : Activer GitHub Pages

1. Allez sur **GitHub** : https://github.com/asinda/portofolio
2. Cliquez sur **Settings** (onglet)
3. Dans le menu de gauche : **Pages**
4. **Source** :
   - Branch : `gh-pages`
   - Folder : `/ (root)`
5. Cliquez sur **Save**

### Étape 2.4 : Attendre le déploiement

GitHub va déployer automatiquement. Attendez 2-3 minutes.

Vous verrez un message :
```
✅ Your site is live at https://asinda.github.io/portofolio/
```

### Étape 2.5 : Configurer un domaine personnalisé (optionnel)

Si vous avez un nom de domaine, vous pouvez le configurer :

1. Dans **Settings → Pages**
2. **Custom domain** : `alicesindayigaya.com`
3. Cliquez sur **Save**
4. Configurez vos DNS chez votre registrar

---

## 🔧 PARTIE 3 : Configuration finale

### Étape 3.1 : Mettre à jour CORS sur Render

Maintenant que vous connaissez l'URL GitHub Pages, mettez à jour le backend :

1. Allez sur **Render** : https://dashboard.render.com
2. Cliquez sur votre service `portfolio-backend`
3. **Environment** → Trouvez `ALLOWED_ORIGINS`
4. Modifiez la valeur :
   ```
   https://asinda.github.io
   ```
   > **Note** : Pas de `/portofolio/` à la fin, juste le domaine de base !

5. Cliquez sur **Save Changes**
6. Render va redéployer automatiquement

### Étape 3.2 : Vérifier que tout fonctionne

#### Test 1 : Portfolio public
1. Allez sur : https://asinda.github.io/portofolio/
2. Vérifiez que vos données s'affichent
3. Ouvrez F12 → Console : pas d'erreur CORS

#### Test 2 : Panel admin
1. Allez sur : https://asinda.github.io/portofolio/admin
2. Connectez-vous avec vos identifiants Supabase
3. Vérifiez que vous pouvez modifier les données

#### Test 3 : API
```bash
curl https://portfolio-backend-xxxx.onrender.com/api/portfolio/profile
```

Vous devriez voir vos données de profil !

---

## 🎯 Récapitulatif des URLs

Après déploiement :

| Service | URL |
|---------|-----|
| **Portfolio** | https://asinda.github.io/portofolio/ |
| **Admin** | https://asinda.github.io/portofolio/admin |
| **Backend API** | https://portfolio-backend-xxxx.onrender.com/api |
| **Supabase** | https://hfmxchnbivkdvxenbech.supabase.co |

---

## 🔄 Mises à jour futures

### Mettre à jour le frontend

Après avoir modifié des fichiers dans `frontend/public/` :

```bash
# 1. Commiter vos changements
git add .
git commit -m "Update frontend"
git push origin dev

# 2. Redéployer sur GitHub Pages
cd temp-gh-pages
cp -r ../frontend/public/* .
git add .
git commit -m "Update GitHub Pages"
git push -f origin gh-pages
cd ..
```

Ou utilisez le script `deploy-github-pages.sh` :
```bash
./deploy-github-pages.sh
```

### Mettre à jour le backend

Après avoir modifié des fichiers dans `backend/` :

```bash
# Commiter et pousser
git add .
git commit -m "Update backend"
git push origin dev
```

Render redéploiera automatiquement ! ✨

---

## ⚠️ Limitations du plan gratuit

### Render (Backend)
- ✅ 750 heures/mois (suffisant pour 1 site)
- ⚠️ Le service s'endort après 15 min d'inactivité
- ⏱️ Premier chargement après sommeil : 30-60 secondes
- 💡 **Solution** : Utiliser un service de ping (UptimeRobot)

### GitHub Pages (Frontend)
- ✅ 100 GB de bande passante/mois
- ✅ 1 GB d'espace de stockage
- ✅ Déploiements illimités
- ✅ HTTPS automatique

---

## 🆘 Dépannage

### Erreur "404 Not Found" sur GitHub Pages

**Cause** : La branche gh-pages n'existe pas ou est vide

**Solution** :
```bash
# Vérifier que la branche existe
git branch -a | grep gh-pages

# Si elle n'existe pas, relancer le déploiement
./deploy-github-pages.sh
```

### Erreur CORS

**Symptôme** : "Access-Control-Allow-Origin" error

**Solution** :
1. Vérifiez `ALLOWED_ORIGINS` sur Render
2. Doit être exactement : `https://asinda.github.io` (sans slash final)
3. Redéployez le backend

### Backend ne répond pas (504 Gateway Timeout)

**Cause** : Le service Render s'est endormi

**Solution** :
- Attendez 30-60 secondes pour qu'il se réveille
- Ou utilisez UptimeRobot pour le garder actif :
  1. Créez un compte sur https://uptimerobot.com
  2. Ajoutez un monitor HTTP(S)
  3. URL : `https://portfolio-backend-xxxx.onrender.com/api/health`
  4. Intervalle : 5 minutes

### Les modifications ne s'affichent pas

**Cause** : Cache du navigateur

**Solution** :
1. Videz le cache : Ctrl+Shift+Delete
2. Ou ouvrez en navigation privée
3. Ou ajoutez un paramètre de version dans index.html : `script.js?v=2`

---

## 📊 Monitoring

### Vérifier les logs Render
1. Dashboard Render → Votre service
2. **Logs** → Voir les erreurs en temps réel

### Vérifier le statut GitHub Pages
1. GitHub → Repo → **Actions**
2. Voir l'historique des déploiements

---

## 🎉 Félicitations !

Votre portfolio est maintenant en ligne **gratuitement** ! 🚀

### Prochaines étapes

1. **Partagez votre portfolio** :
   - Ajoutez le lien dans votre CV
   - Partagez sur LinkedIn
   - Ajoutez dans votre signature email

2. **Optimisations optionnelles** :
   - Configurez un nom de domaine personnalisé
   - Ajoutez Google Analytics
   - Configurez UptimeRobot pour le backend
   - Ajoutez un sitemap.xml pour le SEO

3. **Maintenance** :
   - Mettez à jour vos données via l'admin
   - Ajoutez de nouveaux projets régulièrement
   - Surveillez les logs Render

---

## 📚 Ressources

- [Documentation GitHub Pages](https://docs.github.com/en/pages)
- [Documentation Render](https://render.com/docs)
- [Documentation Supabase](https://supabase.com/docs)

---

**Besoin d'aide ?** Consultez les logs ou créez une issue sur GitHub !
