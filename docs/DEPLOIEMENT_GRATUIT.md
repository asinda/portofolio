# Guide de Déploiement Frontend GRATUIT

Ce guide présente **4 solutions 100% gratuites** pour déployer votre portfolio, même avec un repository privé.

---

## 📊 Tableau Comparatif

| Solution | Repo Privé OK ? | Bande Passante | SSL | Domaine Personnalisé | Difficulté |
|----------|-----------------|----------------|-----|----------------------|------------|
| **GitHub Pages** | ❌ Non (payant) | 100 GB/mois | ✅ | ✅ | ⭐ Facile |
| **Netlify** | ✅ Oui | 100 GB/mois | ✅ | ✅ | ⭐ Facile |
| **Vercel** | ✅ Oui | 100 GB/mois | ✅ | ✅ | ⭐ Facile |
| **Cloudflare Pages** | ✅ Oui | Illimité | ✅ | ✅ | ⭐⭐ Moyen |

---

## 🥇 Option 1 : GitHub Pages (Repository Public)

### Prérequis
- ✅ Repository **PUBLIC** (obligatoire pour gratuit)

### Avantages
- ✅ Intégration native GitHub
- ✅ Workflows CI/CD déjà configurés (vous les avez !)
- ✅ URL : `https://asinda.github.io/portofolio`

### Rendre le Repository Public

1. **https://github.com/asinda/portofolio/settings**
2. Tout en bas → **Danger Zone** → **Change repository visibility**
3. **Make public**
4. Tapez le nom du repository pour confirmer
5. **I understand, change repository visibility**

### Activation

1. **https://github.com/asinda/portofolio/settings/pages**
2. Source : **GitHub Actions**
3. **Save**

Le workflow se déclenchera automatiquement. Site disponible en ~3 minutes sur :
```
https://asinda.github.io/portofolio
```

---

## 🥈 Option 2 : Netlify (RECOMMANDÉ si repo privé)

### Avantages
- ✅ **Gratuit même pour repo privé**
- ✅ Déploiement automatique à chaque push
- ✅ Preview deployments pour les PR
- ✅ Formulaires gratuits (pour votre formulaire de contact)
- ✅ Fonctions serverless (si besoin futur)

### Configuration en 5 Minutes

#### Étape 1 : Créer un compte

1. Allez sur **https://app.netlify.com/signup**
2. **Sign up with GitHub**
3. Autorisez Netlify

#### Étape 2 : Importer le projet

1. **Add new site** → **Import an existing project**
2. **Deploy with GitHub**
3. Sélectionnez `asinda/portofolio`
4. **Configuration** :
   - **Branch to deploy** : `main`
   - **Base directory** : `frontend/public`
   - **Publish directory** : `.` (ou laissez vide)
   - **Build command** : (laissez vide - site statique)
5. **Deploy**

#### Étape 3 : Récupérer l'URL

Votre site sera disponible sur :
```
https://random-name-12345.netlify.app
```

**Personnaliser l'URL** (optionnel) :
1. **Site settings** → **Change site name**
2. Tapez : `portfolio-alice-sindayigaya`
3. URL devient : `https://portfolio-alice-sindayigaya.netlify.app`

#### Étape 4 : Configurer CORS Backend

1. Dashboard Render → Votre service backend
2. **Environment** → `ALLOWED_ORIGINS`
3. Ajoutez : `https://portfolio-alice-sindayigaya.netlify.app`

```
https://portfolio-alice-sindayigaya.netlify.app,https://asinda.github.io,http://localhost:8000
```

### Déploiement Automatique

Netlify redéploie automatiquement à chaque push sur `main` ! Rien à faire de plus.

---

## 🥉 Option 3 : Vercel

### Avantages
- ✅ Ultra rapide (Edge Network mondial)
- ✅ Preview URLs pour chaque commit
- ✅ Analytics gratuit

### Configuration

#### Étape 1 : Créer un compte

1. **https://vercel.com/signup**
2. **Continue with GitHub**

#### Étape 2 : Importer

1. **Add New** → **Project**
2. **Import Git Repository** → `asinda/portofolio`
3. **Configuration** :
   - **Framework Preset** : Other
   - **Root Directory** : `frontend/public`
   - **Build Command** : (laissez vide)
   - **Output Directory** : `.`
4. **Deploy**

URL : `https://portofolio-xxx.vercel.app`

#### Étape 3 : CORS Backend

Ajoutez l'URL Vercel dans `ALLOWED_ORIGINS` sur Render.

---

## 🥉 Option 4 : Cloudflare Pages

### Avantages
- ✅ **Bande passante ILLIMITÉE**
- ✅ CDN ultra-rapide mondial
- ✅ Builds illimités

### Configuration

#### Étape 1 : Compte Cloudflare

1. **https://dash.cloudflare.com/sign-up**
2. Créez un compte gratuit

#### Étape 2 : Créer un projet Pages

1. **Workers & Pages** → **Create application**
2. **Pages** → **Connect to Git**
3. Connectez GitHub
4. Sélectionnez `asinda/portofolio`
5. **Configuration** :
   - **Production branch** : `main`
   - **Build command** : (vide)
   - **Build output directory** : `frontend/public`
6. **Save and Deploy**

URL : `https://portofolio.pages.dev`

---

## 🔧 Configuration API pour Toutes les Solutions

### Mettre à jour apiConfig.js

Pour supporter plusieurs domaines, modifiez `frontend/public/js/apiConfig.js` :

```javascript
/**
 * Configuration de l'API pour le portfolio
 */

// Détection automatique de l'environnement
const API_BASE_URL = (() => {
    const hostname = window.location.hostname;

    // Développement local
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    }

    // Production - URL du backend Render
    return 'https://portfolio-backend-uj9f.onrender.com/api';
})();

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_BASE_URL };
}

console.log('🔗 API URL:', API_BASE_URL);
```

### Configurer CORS Backend (Render)

1. **https://dashboard.render.com**
2. Ouvrez votre service backend
3. **Environment** → `ALLOWED_ORIGINS`
4. **Ajoutez toutes vos URLs** :

```
https://asinda.github.io,https://portfolio-alice-sindayigaya.netlify.app,https://portofolio-xxx.vercel.app,http://localhost:8000
```

**Astuce** : Utilisez `*` temporairement pour tester (⚠️ pas recommandé en production) :
```
ALLOWED_ORIGINS=*
```

---

## 🎯 Ma Recommandation

### Si Repository Public
👉 **GitHub Pages** (déjà configuré avec workflows CI/CD)

### Si Repository Privé
👉 **Netlify** (le plus simple et complet)

---

## 🚀 Déploiement Automatique avec Workflows

### Netlify avec GitHub Actions

Créez `.github/workflows/deploy-netlify.yml` :

```yaml
name: Deploy to Netlify

on:
  push:
    branches: [main]
    paths:
      - 'frontend/public/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './frontend/public'
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

**Configuration des secrets** :
1. Netlify → **User settings** → **Applications** → **Personal access tokens** → **New access token**
2. Copiez le token
3. GitHub → **Settings** → **Secrets** → **New repository secret**
   - `NETLIFY_AUTH_TOKEN` : votre token
   - `NETLIFY_SITE_ID` : dans Netlify → **Site settings** → **Site information** → **API ID**

---

## 📊 Checklist de Déploiement

### Avant de déployer
- [ ] `apiConfig.js` configuré avec l'URL backend correcte
- [ ] Fichier `netlify.toml` ou `vercel.json` créé (si applicable)
- [ ] Testé en local : `http://localhost:8000`

### Après déploiement
- [ ] Site accessible sur l'URL de production
- [ ] CSS et JS chargent correctement
- [ ] API backend accessible (pas d'erreur CORS)
- [ ] Images affichées correctement
- [ ] Formulaire de contact fonctionne (si applicable)

---

## 🆘 Dépannage

### Problème : CSS ne charge pas

**Solution** : Vérifiez les chemins dans `index.html`

```html
<!-- ✅ Correct (relatif) -->
<link rel="stylesheet" href="css/styles.css">

<!-- ❌ Incorrect (absolu) -->
<link rel="stylesheet" href="/css/styles.css">
```

### Problème : Erreur CORS

**Solution** : Ajoutez l'URL de déploiement dans `ALLOWED_ORIGINS` sur Render

### Problème : Images 404

**Solution** : Vérifiez que le dossier `images/` est bien dans `frontend/public/`

---

## 🔗 Liens Utiles

- **Netlify** : https://app.netlify.com
- **Vercel** : https://vercel.com
- **Cloudflare Pages** : https://pages.cloudflare.com
- **GitHub Pages** : https://pages.github.com

---

## 💡 Conseils

### Pour un Portfolio Professionnel

1. **Domaine personnalisé** : Achetez un domaine (10-15€/an)
   - Namecheap, Google Domains, OVH
   - Connectez-le à Netlify/Vercel (gratuit)

2. **Analytics** : Ajoutez Google Analytics ou Plausible

3. **SEO** : Ajoutez les meta tags dans `index.html`

4. **Performance** : Utilisez Lighthouse pour optimiser

---

**Créé avec 💙 pour déployer votre portfolio gratuitement**
