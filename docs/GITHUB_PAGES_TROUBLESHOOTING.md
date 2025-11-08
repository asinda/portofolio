# Dépannage GitHub Pages

Guide de résolution des problèmes GitHub Pages pour votre portfolio.

## 🔍 Vérifications Rapides

### Étape 1 : Vérifier que GitHub Pages est activé

1. Allez sur **https://github.com/asinda/portofolio/settings/pages**
2. Vérifiez que la section "Source" est configurée :
   - ✅ **Source** doit être : **GitHub Actions** (PAS "Deploy from a branch")
   - ❌ Si c'est "None" ou "Deploy from a branch", changez pour "GitHub Actions"

### Étape 2 : Vérifier les Workflows

1. Allez sur **https://github.com/asinda/portofolio/actions**
2. Cherchez le workflow "Déploiement Frontend (GitHub Pages)"
3. Vérifiez :
   - ✅ Statut : Devrait être vert (✓)
   - ❌ Si rouge (✗), cliquez dessus pour voir l'erreur

### Étape 3 : Vérifier les Permissions

1. Allez sur **https://github.com/asinda/portofolio/settings/actions**
2. **Workflow permissions** :
   - ✅ "Read and write permissions" doit être sélectionné
   - ✅ "Allow GitHub Actions to create and approve pull requests" doit être coché

---

## 🚀 Solutions aux Problèmes Courants

### ❌ Problème 1 : Page 404 sur GitHub Pages

**URL testée** : https://asinda.github.io/portofolio
**Erreur** : 404 - Page not found

**Causes possibles** :
1. GitHub Pages n'est pas activé
2. Le workflow n'a pas été exécuté
3. Erreur dans le workflow

**Solutions** :

#### Solution A : Activer GitHub Pages manuellement

1. **Settings** → **Pages**
2. **Source** : Sélectionnez **GitHub Actions**
3. **Save**
4. Attendez 1-2 minutes

#### Solution B : Déclencher le workflow manuellement

1. Allez sur **https://github.com/asinda/portofolio/actions**
2. Cliquez sur "Déploiement Frontend (GitHub Pages)"
3. **Run workflow** → Branche: `main` → **Run workflow**
4. Attendez la fin du déploiement (~2-3 minutes)
5. Testez : https://asinda.github.io/portofolio

#### Solution C : Corriger les permissions

1. **Settings** → **Actions** → **General**
2. **Workflow permissions** :
   - Sélectionnez "Read and write permissions"
   - Cochez "Allow GitHub Actions to create and approve pull requests"
3. **Save**
4. Re-déclenchez le workflow (Solution B)

---

### ❌ Problème 2 : Workflow échoue avec erreur de permissions

**Erreur dans le log** : `Permission denied` ou `403 Forbidden`

**Solution** :

1. **Settings** → **Actions** → **General**
2. **Workflow permissions** : "Read and write permissions"
3. **Settings** → **Pages** → **Build and deployment**
4. Source : **GitHub Actions** (pas "Deploy from a branch")
5. Re-déclenchez le workflow

---

### ❌ Problème 3 : Site déployé mais CSS/JS ne charge pas

**Problème** : Le site s'affiche mais sans styles ni JavaScript

**Cause** : Chemins absolus au lieu de relatifs

**Solution** :

Vérifiez dans `frontend/public/index.html` que les chemins sont relatifs :

```html
<!-- ✅ Bon (relatif) -->
<link rel="stylesheet" href="css/styles.css">
<script src="js/script.js"></script>

<!-- ❌ Mauvais (absolu) -->
<link rel="stylesheet" href="/css/styles.css">
<script src="/js/script.js"></script>
```

Si nécessaire, supprimez les `/` au début des chemins.

---

### ❌ Problème 4 : API Backend inaccessible depuis GitHub Pages

**Erreur console** : `CORS error` ou `Failed to fetch`

**Cause** : CORS non configuré pour GitHub Pages

**Solution** :

#### Étape 1 : Vérifier apiConfig.js

Le fichier `frontend/public/js/apiConfig.js` doit contenir :

```javascript
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://portfolio-backend-uj9f.onrender.com/api';
```

#### Étape 2 : Ajouter GitHub Pages dans CORS (Backend)

1. Allez sur **https://dashboard.render.com**
2. Ouvrez votre service backend
3. **Environment** → Modifiez `ALLOWED_ORIGINS`
4. Ajoutez : `https://asinda.github.io`

Valeur complète :
```
https://asinda.github.io,http://localhost:8000,http://localhost:3000
```

5. **Save Changes**
6. Attendez le redémarrage du backend (~1 minute)

---

### ❌ Problème 5 : Le workflow ne se déclenche pas

**Problème** : Aucun workflow ne s'exécute après un push

**Solution** :

#### Vérifier que les workflows sont activés

1. **Settings** → **Actions** → **General**
2. **Actions permissions** : "Allow all actions and reusable workflows"
3. **Save**

#### Déclencher manuellement

```bash
# Option 1 : Faire un petit changement
echo "# Test deploy" >> README.md
git add README.md
git commit -m "test: Déclencher workflow GitHub Pages"
git push origin main

# Option 2 : Via l'interface GitHub (cf. Solution B ci-dessus)
```

---

## 🧪 Tests de Vérification

### Test 1 : GitHub Pages activé

```bash
# Dans votre navigateur, ouvrez :
https://github.com/asinda/portofolio/settings/pages

# Vous devez voir :
# ✅ "Your site is live at https://asinda.github.io/portofolio/"
```

### Test 2 : Workflow déployé

```bash
# Dans votre navigateur :
https://github.com/asinda/portofolio/actions

# Vous devez voir :
# ✅ Au moins un workflow vert "Déploiement Frontend"
```

### Test 3 : Site accessible

```bash
# Dans votre navigateur :
https://asinda.github.io/portofolio

# Vous devriez voir votre portfolio
```

### Test 4 : API fonctionne depuis GitHub Pages

1. Ouvrez https://asinda.github.io/portofolio
2. Ouvrez la console (F12)
3. Tapez :
```javascript
fetch('https://portfolio-backend-uj9f.onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
```
4. Vous devriez voir : `{success: true, message: "API Portfolio - Serveur en ligne"...}`

---

## 🔧 Configuration Complète Pas à Pas

Si rien ne fonctionne, suivez cette configuration complète :

### Étape 1 : Settings → Pages

1. Allez sur https://github.com/asinda/portofolio/settings/pages
2. **Build and deployment**
   - Source : **GitHub Actions**
3. Laissez les autres paramètres par défaut
4. **Save**

### Étape 2 : Settings → Actions

1. Allez sur https://github.com/asinda/portofolio/settings/actions
2. **General** → **Actions permissions**
   - Sélectionnez "Allow all actions and reusable workflows"
3. **Workflow permissions**
   - Sélectionnez "Read and write permissions"
   - Cochez "Allow GitHub Actions to create and approve pull requests"
4. **Save**

### Étape 3 : Déclencher le déploiement

```bash
# Depuis votre terminal local
git checkout main
git pull origin main

# Créer un commit pour déclencher le workflow
echo "# Deploy to GitHub Pages" >> .deploy-trigger
git add .deploy-trigger
git commit -m "deploy: Déclencher déploiement GitHub Pages"
git push origin main
```

### Étape 4 : Vérifier le déploiement

1. Allez sur https://github.com/asinda/portofolio/actions
2. Cliquez sur le workflow en cours
3. Attendez que tous les jobs soient verts (✓)
4. Une fois terminé, allez sur https://asinda.github.io/portofolio

---

## 📊 Checklist de Débogage

Cochez chaque élément :

- [ ] GitHub Pages activé (Source: GitHub Actions)
- [ ] Workflow permissions configurées (Read and write)
- [ ] Au moins un workflow "Déploiement Frontend" exécuté
- [ ] Workflow terminé avec succès (vert ✓)
- [ ] URL GitHub Pages accessible : https://asinda.github.io/portofolio
- [ ] CORS configuré sur Render avec https://asinda.github.io
- [ ] apiConfig.js contient l'URL backend Render
- [ ] Console navigateur sans erreurs CORS

---

## 🆘 Aide Supplémentaire

### Voir les logs du workflow

1. https://github.com/asinda/portofolio/actions
2. Cliquez sur le dernier workflow "Déploiement Frontend"
3. Cliquez sur "deploy" dans la liste des jobs
4. Consultez les logs pour identifier l'erreur

### Erreurs Courantes dans les Logs

#### ❌ "Error: Process completed with exit code 1"
**Solution** : Vérifiez les permissions (Settings → Actions → Workflow permissions)

#### ❌ "Permission to asinda/portofolio.git denied"
**Solution** :
1. Settings → Actions → Workflow permissions
2. Sélectionnez "Read and write permissions"

#### ❌ "Unable to deploy to GitHub Pages"
**Solution** :
1. Settings → Pages → Source → GitHub Actions
2. Re-déclenchez le workflow

---

## 🔗 URLs Utiles

- **Settings Pages** : https://github.com/asinda/portofolio/settings/pages
- **Actions Workflows** : https://github.com/asinda/portofolio/actions
- **Settings Actions** : https://github.com/asinda/portofolio/settings/actions
- **Votre Site** : https://asinda.github.io/portofolio
- **Backend API** : https://portfolio-backend-uj9f.onrender.com/api/health

---

## 📞 Support

Si le problème persiste après avoir suivi ce guide :

1. Allez sur https://github.com/asinda/portofolio/actions
2. Cliquez sur le workflow échoué
3. Copiez le message d'erreur
4. Consultez la [documentation GitHub Pages](https://docs.github.com/en/pages)

---

**Créé avec 💙 pour résoudre vos problèmes de déploiement**
