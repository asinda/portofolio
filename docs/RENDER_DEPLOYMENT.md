# Guide de Déploiement Backend sur Render

Ce guide vous explique comment déployer votre backend sur Render depuis la branche `main`.

## 📋 Prérequis

- ✅ Compte GitHub avec le repository `portofolio`
- ✅ Compte Render (gratuit) : https://render.com
- ✅ Clés Supabase (URL, ANON_KEY, SERVICE_KEY)

## 🚀 Méthode 1 : Déploiement Automatique avec render.yaml

### Étape 1 : Pousser le fichier render.yaml

Le fichier `render.yaml` a été créé à la racine du projet. Commitez-le et poussez-le vers GitHub :

```bash
git add render.yaml
git commit -m "[config]: Ajouter configuration Render pour déploiement automatique"
git push origin main
```

### Étape 2 : Connecter Render à GitHub

1. Allez sur https://dashboard.render.com
2. Cliquez sur **"New +"** → **"Blueprint"**
3. Connectez votre compte GitHub si ce n'est pas déjà fait
4. Sélectionnez le repository `asinda/portofolio`
5. Render détectera automatiquement le fichier `render.yaml`

### Étape 3 : Configurer les Variables d'Environnement

Render vous demandera de configurer les variables sensibles :

| Variable | Valeur | Où trouver |
|----------|--------|------------|
| `SUPABASE_URL` | `https://xxx.supabase.co` | Supabase Dashboard → Settings → API |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_KEY` | `eyJhbGci...` | Supabase Dashboard → Settings → API (Service Role) |

**Note** : `JWT_SECRET` et `ALLOWED_ORIGINS` sont déjà configurés dans render.yaml

### Étape 4 : Déployer

1. Cliquez sur **"Apply"**
2. Render va :
   - Installer les dépendances (`npm install`)
   - Démarrer le serveur (`npm start`)
   - Effectuer un health check sur `/api/health`
3. Attendez ~3-5 minutes pour le premier déploiement

### Étape 5 : Récupérer l'URL de Production

Une fois déployé, vous verrez votre URL :
```
https://portfolio-backend-xxxx.onrender.com
```

Mettez à jour `frontend/public/js/apiConfig.js` avec cette URL.

---

## 🔧 Méthode 2 : Déploiement Manuel (Si render.yaml ne fonctionne pas)

### Étape 1 : Créer un Web Service

1. Allez sur https://dashboard.render.com
2. Cliquez sur **"New +"** → **"Web Service"**
3. Connectez GitHub et sélectionnez `asinda/portofolio`

### Étape 2 : Configuration du Service

Remplissez les champs suivants :

| Champ | Valeur |
|-------|--------|
| **Name** | `portfolio-backend` |
| **Region** | `Frankfurt` (ou proche de vous) |
| **Branch** | `main` ⚠️ IMPORTANT |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

### Étape 3 : Variables d'Environnement

Cliquez sur **"Advanced"** et ajoutez :

```env
NODE_ENV=production
PORT=5000
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_KEY=votre_cle_service
JWT_SECRET=votre_secret_ultra_securise_32_caracteres_minimum
ALLOWED_ORIGINS=https://asinda.github.io,https://votre-frontend.netlify.app
```

### Étape 4 : Health Check (Optionnel mais recommandé)

Dans **"Advanced"**, activez le Health Check :
- **Health Check Path** : `/api/health`

### Étape 5 : Déployer

1. Cliquez sur **"Create Web Service"**
2. Attendez 3-5 minutes pour le déploiement

---

## 📊 Vérification du Déploiement

### Test de l'API

Une fois déployé, testez votre API :

```bash
# Health check
curl https://votre-backend.onrender.com/api/health

# Profile
curl https://votre-backend.onrender.com/api/portfolio/profile

# Expériences
curl https://votre-backend.onrender.com/api/portfolio/experience
```

Réponse attendue pour le health check :
```json
{
  "success": true,
  "message": "API Portfolio - Serveur en ligne",
  "version": "1.0.0",
  "timestamp": "2025-11-08T..."
}
```

---

## ⚙️ Configuration Post-Déploiement

### 1. Mettre à jour apiConfig.js

Éditez `frontend/public/js/apiConfig.js` :

```javascript
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://VOTRE-BACKEND.onrender.com/api';  // ⬅️ Remplacez ici
```

### 2. Autoriser le Frontend dans CORS

Si votre frontend change d'URL, mettez à jour `ALLOWED_ORIGINS` sur Render :

1. Dashboard Render → Votre service
2. **Environment** → Modifier `ALLOWED_ORIGINS`
3. Ajoutez les nouvelles origines séparées par des virgules

### 3. Configurer le Déploiement Automatique

Par défaut, Render redéploie automatiquement à chaque push sur `main`.

Pour désactiver :
1. Settings → Auto-Deploy
2. Désactivez "Auto-Deploy"

---

## 🔄 Mettre à Jour le Service Render Existant

Si vous avez déjà un service Render sur une autre branche (comme `dev`), changez la branche :

1. Allez dans votre service Render
2. **Settings** → **Branch**
3. Changez de `dev` à `main`
4. Cliquez sur **Save**
5. Render redéploiera automatiquement depuis `main`

---

## 🐛 Dépannage

### Erreur : "Build failed"

**Cause** : Dépendances manquantes ou erreur dans `package.json`

**Solution** :
1. Vérifiez les logs de build sur Render
2. Assurez-vous que `backend/package.json` contient toutes les dépendances
3. Testez localement : `cd backend && npm install && npm start`

### Erreur : "Application failed to respond"

**Cause** : Le serveur ne démarre pas ou n'écoute pas sur le bon port

**Solution** :
1. Vérifiez que `PORT` est bien configuré dans les variables d'environnement
2. Le serveur doit écouter sur `process.env.PORT` (Render injecte automatiquement)
3. Vérifiez les logs : Dashboard → Logs

### Service en veille (Spin down)

**Problème** : Le service gratuit se met en veille après 15 min d'inactivité

**Solutions** :
- ✅ Accepter le délai de réveil (~30 secondes)
- 🔄 Utiliser un service de ping externe (comme UptimeRobot)
- 💰 Passer au plan payant ($7/mois) pour un service toujours actif

### CORS Errors

**Cause** : Frontend non autorisé dans `ALLOWED_ORIGINS`

**Solution** :
1. Vérifiez les origines autorisées dans les variables d'environnement
2. Ajoutez l'URL exacte du frontend (sans slash final)

---

## 📈 Monitoring et Logs

### Voir les Logs

Dashboard Render → Votre service → **Logs**

### Métriques

Dashboard Render → Votre service → **Metrics**
- Requêtes par minute
- Temps de réponse
- Utilisation CPU/RAM

---

## 🎯 Checklist de Déploiement

- [ ] Fichier `render.yaml` créé et poussé sur `main`
- [ ] Service Render créé et connecté à GitHub
- [ ] Variables d'environnement configurées (Supabase, JWT_SECRET)
- [ ] Branche configurée sur `main`
- [ ] Health check activé (`/api/health`)
- [ ] Déploiement réussi (statut "Live")
- [ ] API testée avec curl/Postman
- [ ] URL de production ajoutée dans `apiConfig.js`
- [ ] CORS configuré avec les origines du frontend
- [ ] Frontend testé en production

---

## 🔗 Liens Utiles

- **Dashboard Render** : https://dashboard.render.com
- **Documentation Render** : https://render.com/docs
- **Status Render** : https://status.render.com
- **Support Render** : https://community.render.com

---

## 📝 Prochaines Étapes

Après avoir déployé le backend :

1. ✅ Déployer le frontend sur GitHub Pages ou Netlify
2. ✅ Tester le portfolio complet en production
3. ✅ Configurer un domaine personnalisé (optionnel)
4. ✅ Mettre en place un monitoring (UptimeRobot)

---

**Créé avec 💙 pour le portfolio d'Alice Sindayigaya**
