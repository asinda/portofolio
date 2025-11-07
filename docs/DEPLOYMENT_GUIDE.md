# Guide de Déploiement - Portfolio Alice Sindayigaya

## 📋 Vue d'Ensemble

Votre portfolio est composé de **2 parties** qui doivent être déployées séparément :
1. **Frontend** (site web statique)
2. **Backend** (API Node.js)

---

## 🎯 Option Recommandée : Déploiement Simple et Gratuit

### Frontend : GitHub Pages (Gratuit ✅)
### Backend : Render.com (Gratuit avec limitations ✅)

---

## 📦 CE QU'IL VOUS FAUT

### Prérequis
- ✅ Compte GitHub (gratuit)
- ✅ Compte Render.com (gratuit)
- ✅ Compte Supabase (gratuit) - Pour la base de données
- ⏱️ 30-45 minutes

---

## 🚀 ÉTAPE 1 : Déployer le Backend sur Render

### 1.1 Créer un Compte Render
1. Allez sur [render.com](https://render.com)
2. Inscrivez-vous avec votre compte GitHub
3. Vérifiez votre email

### 1.2 Pousser Votre Code sur GitHub
```bash
# Dans le terminal, à la racine du projet
git add .
git commit -m "Préparation pour déploiement"
git push origin dev
```

### 1.3 Créer un Web Service sur Render
1. Sur Render Dashboard, cliquez **"New +"** → **"Web Service"**
2. Connectez votre repository GitHub `portofolio`
3. Configurez :
   - **Name** : `portfolio-backend`
   - **Region** : Frankfurt (Europe)
   - **Branch** : `dev`
   - **Root Directory** : `backend`
   - **Runtime** : Node
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Instance Type** : Free

### 1.4 Configurer les Variables d'Environnement
Dans Render, allez dans **Environment** et ajoutez :

```
PORT=5000
NODE_ENV=production
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_KEY=votre_service_key
ALLOWED_ORIGINS=https://votre-username.github.io
```

### 1.5 Déployer
1. Cliquez **"Create Web Service"**
2. Attendez 3-5 minutes
3. Notez l'URL : `https://portfolio-backend-xxxx.onrender.com`

---

## 🌐 ÉTAPE 2 : Déployer le Frontend sur GitHub Pages

### 2.1 Mettre à Jour l'URL de l'API

**Modifier `frontend/public/js/apiConfig.js` :**
```javascript
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://portfolio-backend-xxxx.onrender.com/api'; // Votre URL Render
```

### 2.2 Créer une Branche gh-pages
```bash
# À la racine du projet
git checkout -b gh-pages

# Copier seulement le frontend
git rm -rf backend docs .claude CLAUDE.md GUIDE_RAPIDE_LINKEDIN.md
git add .
git commit -m "Déploiement frontend sur GitHub Pages"

# Pousser vers GitHub
git push origin gh-pages
```

### 2.3 Activer GitHub Pages
1. Allez sur GitHub → Votre repository
2. **Settings** → **Pages** (menu gauche)
3. **Source** : Branch `gh-pages`, folder `/frontend/public`
4. Cliquez **Save**
5. Attendez 2-3 minutes

### 2.4 Votre Site Sera Accessible
```
https://votre-username.github.io/portofolio
```

---

## 🗄️ ÉTAPE 3 : Configurer Supabase (Base de Données)

### 3.1 Créer un Projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Créez un nouveau projet :
   - **Name** : `portfolio-alice`
   - **Database Password** : Notez-le !
   - **Region** : Frankfurt

### 3.2 Créer les Tables
1. Dans Supabase, allez dans **SQL Editor**
2. Copiez le contenu de `docs/SUPABASE_SETUP.md`
3. Exécutez les scripts SQL pour créer les tables

### 3.3 Récupérer les Clés
1. **Settings** → **API**
2. Copiez :
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_KEY`

### 3.4 Mettre à Jour Render
1. Retournez sur Render.com
2. Allez dans votre service → **Environment**
3. Mettez à jour les variables avec les vraies clés Supabase
4. Cliquez **Save Changes** (redémarrage automatique)

---

## ✅ VÉRIFICATION

### Backend
1. Testez : `https://portfolio-backend-xxxx.onrender.com/api/health`
2. Vous devriez voir : `{"success":true,"message":"API Portfolio - Serveur en ligne"}`

### Frontend
1. Allez sur : `https://votre-username.github.io/portofolio`
2. Vérifiez que le portfolio s'affiche correctement
3. Ouvrez la console (F12) pour vérifier qu'il n'y a pas d'erreurs

---

## 🔧 CONFIGURATION CORS

**Important !** Mettez à jour `ALLOWED_ORIGINS` sur Render avec l'URL de votre frontend :

```
ALLOWED_ORIGINS=https://votre-username.github.io
```

---

## 💰 COÛTS

| Service | Plan | Prix | Limitations |
|---------|------|------|-------------|
| **GitHub Pages** | Gratuit | 0€ | Seulement sites statiques |
| **Render.com** | Free | 0€ | Sommeil après 15 min d'inactivité |
| **Supabase** | Free | 0€ | 500 Mo BDD, 2 Go bande passante |

**Total : 0€ / mois** 🎉

---

## 📝 ALTERNATIVES PREMIUM (Optionnel)

### Si Vous Voulez un Domaine Personnalisé

1. **Acheter un domaine** : [Namecheap](https://namecheap.com) (~10€/an)
   - Exemple : `alice-sindayigaya.com`

2. **Configurer DNS** :
   - GitHub Pages : Ajouter un fichier `CNAME`
   - Render : Ajouter custom domain dans settings

### Alternatives Hébergement Backend

| Service | Prix | Avantages |
|---------|------|-----------|
| **Railway** | 5$/mois | Toujours actif, rapide |
| **Heroku** | 7$/mois | Stable, bien documenté |
| **DigitalOcean** | 6$/mois | Plus de contrôle |

---

## 🚨 IMPORTANT AVANT DÉPLOIEMENT

### 1. Tester Localement
```bash
# Backend
cd backend
npm start

# Frontend (autre terminal)
cd frontend/public
npx http-server -p 8000
```

### 2. Vérifier les Tests
```bash
cd backend
npm test
```

### 3. Commit Final
```bash
git add .
git commit -m "feat: Portfolio prêt pour déploiement en production

- Backend API configuré pour Render
- Frontend optimisé pour GitHub Pages
- Supabase intégré
- Tests passants
- Documentation complète

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin dev
```

---

## 🆘 DÉPANNAGE

### Le backend ne démarre pas sur Render
- Vérifiez les logs dans Render Dashboard
- Assurez-vous que `package.json` est dans le dossier `backend/`
- Vérifiez les variables d'environnement

### Le frontend ne se connecte pas au backend
- Vérifiez l'URL dans `apiConfig.js`
- Vérifiez CORS dans les variables Render
- Ouvrez la console du navigateur (F12)

### GitHub Pages affiche 404
- Attendez 5-10 minutes après activation
- Vérifiez que la branche `gh-pages` existe
- Assurez-vous que le dossier source est correct

---

## 📞 SUPPORT

- **GitHub Pages** : [docs.github.com/pages](https://docs.github.com/pages)
- **Render** : [render.com/docs](https://render.com/docs)
- **Supabase** : [supabase.com/docs](https://supabase.com/docs)

---

## 🎯 CHECKLIST DÉPLOIEMENT

- [ ] Backend poussé sur GitHub
- [ ] Web Service créé sur Render
- [ ] Variables d'environnement configurées sur Render
- [ ] Backend accessible et health check OK
- [ ] Projet Supabase créé
- [ ] Tables créées dans Supabase
- [ ] Clés Supabase ajoutées à Render
- [ ] `apiConfig.js` mis à jour avec URL Render
- [ ] Branche `gh-pages` créée
- [ ] GitHub Pages activé
- [ ] Frontend accessible
- [ ] Portfolio fonctionne end-to-end
- [ ] CORS configuré correctement
- [ ] Tests effectués

---

**Bonne chance avec le déploiement ! 🚀**
