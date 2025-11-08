# Pipeline CI/CD avec GitHub Actions

Ce document explique comment configurer et utiliser le pipeline CI/CD pour déployer automatiquement votre portfolio.

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Workflows disponibles](#workflows-disponibles)
- [Configuration initiale](#configuration-initiale)
- [Utilisation](#utilisation)
- [Secrets GitHub](#secrets-github)
- [Dépannage](#dépannage)

---

## 🎯 Vue d'ensemble

Le pipeline CI/CD déploie automatiquement votre portfolio à chaque push sur la branche `main` :

```
┌─────────────┐
│  Git Push   │
│   (main)    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  ÉTAPE 1: Tests Backend         │
│  - Tests unitaires              │
│  - Vérification syntaxe         │
│  - Audit sécurité               │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  ÉTAPE 2: Qualité du Code       │
│  - Lint                         │
│  - Code coverage                │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  ÉTAPE 3: Déploiement Backend   │
│  - Build sur Render             │
│  - Health checks                │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  ÉTAPE 4: Déploiement Frontend  │
│  - Build site statique          │
│  - Deploy GitHub Pages          │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  ÉTAPE 5: Vérifications Finales │
│  - Test endpoints               │
│  - Rapport de déploiement       │
└─────────────────────────────────┘
```

---

## 📁 Workflows Disponibles

### 1. **ci-cd.yml** - Pipeline Complet
**Déclenchement** : Push sur `main` ou Pull Request

**Fonctionnalités** :
- ✅ Tests automatiques du backend
- ✅ Vérification de la qualité du code
- ✅ Déploiement backend sur Render
- ✅ Déploiement frontend sur GitHub Pages
- ✅ Vérifications post-déploiement

**Utilisation** : Automatique à chaque push sur `main`

---

### 2. **tests.yml** - Tests Backend
**Déclenchement** : Push/PR sur `main` ou `dev` (uniquement si fichiers backend modifiés)

**Fonctionnalités** :
- ✅ Tests unitaires sur Node.js 18.x et 20.x
- ✅ Génération du rapport de couverture
- ✅ Vérification de la syntaxe
- ✅ Audit de sécurité npm

**Utilisation** : Automatique lors des modifications backend

---

### 3. **deploy-backend.yml** - Déploiement Backend
**Déclenchement** : Push sur `main` (fichiers backend) ou manuel

**Fonctionnalités** :
- ✅ Tests avant déploiement
- ✅ Déploiement sur Render
- ✅ Health checks automatiques
- ✅ Test des endpoints critiques

**Déclenchement manuel** :
1. Allez dans **Actions** sur GitHub
2. Sélectionnez "Déploiement Backend (Render)"
3. Cliquez sur "Run workflow"

---

### 4. **deploy-frontend.yml** - Déploiement Frontend
**Déclenchement** : Push sur `main` (fichiers frontend) ou manuel

**Fonctionnalités** :
- ✅ Validation HTML
- ✅ Vérification configuration API
- ✅ Déploiement GitHub Pages
- ✅ Vérification post-déploiement

**Déclenchement manuel** :
1. Allez dans **Actions** sur GitHub
2. Sélectionnez "Déploiement Frontend (GitHub Pages)"
3. Cliquez sur "Run workflow"

---

## ⚙️ Configuration Initiale

### Étape 1 : Activer GitHub Pages

1. Allez dans **Settings** → **Pages**
2. Source : **GitHub Actions**
3. Cliquez sur **Save**

### Étape 2 : Configurer les Secrets GitHub

#### Secrets nécessaires pour Render

1. Allez dans **Settings** → **Secrets and variables** → **Actions**
2. Cliquez sur **New repository secret**

Ajoutez les secrets suivants :

| Secret | Description | Où le trouver |
|--------|-------------|---------------|
| `RENDER_SERVICE_ID` | ID du service Render | Dashboard Render → Votre service → Settings → Service ID |
| `RENDER_API_KEY` | Clé API Render | Dashboard Render → Account Settings → API Keys → Create API Key |

#### Secrets optionnels

| Secret | Description | Utilisation |
|--------|-------------|-------------|
| `CODECOV_TOKEN` | Token Codecov | Rapport de couverture de code (optionnel) |

### Étape 3 : Obtenir le Service ID et API Key de Render

#### Service ID

1. Allez sur https://dashboard.render.com
2. Cliquez sur votre service backend
3. Dans l'URL, copiez l'ID : `https://dashboard.render.com/web/srv-XXXXX`
4. Le Service ID est `srv-XXXXX`

#### API Key

1. Dashboard Render → Cliquez sur votre avatar (en haut à droite)
2. **Account Settings**
3. **API Keys** (menu de gauche)
4. **Create API Key**
5. Donnez un nom : `GitHub Actions`
6. Copiez la clé générée

### Étape 4 : Vérifier les Permissions

1. **Settings** → **Actions** → **General**
2. **Workflow permissions** : Sélectionnez "Read and write permissions"
3. Cochez "Allow GitHub Actions to create and approve pull requests"
4. **Save**

---

## 🚀 Utilisation

### Déploiement Automatique

Le déploiement se fait automatiquement à chaque push sur `main` :

```bash
git add .
git commit -m "feat: Nouvelle fonctionnalité"
git push origin main
```

Le pipeline se déclenchera automatiquement et :
1. Exécutera les tests
2. Déploiera le backend sur Render
3. Déploiera le frontend sur GitHub Pages

### Déploiement Manuel

#### Via l'interface GitHub

1. Allez dans l'onglet **Actions**
2. Sélectionnez le workflow souhaité
3. Cliquez sur **Run workflow**
4. Sélectionnez la branche `main`
5. Cliquez sur **Run workflow**

#### Via GitHub CLI

```bash
# Déployer le backend
gh workflow run deploy-backend.yml

# Déployer le frontend
gh workflow run deploy-frontend.yml

# Pipeline complet
gh workflow run ci-cd.yml
```

### Suivre le Déploiement

1. Allez dans **Actions** sur GitHub
2. Cliquez sur le workflow en cours
3. Suivez les logs en temps réel

---

## 🔐 Secrets GitHub

### Configuration des Secrets

```bash
# Via GitHub CLI (optionnel)
gh secret set RENDER_SERVICE_ID
gh secret set RENDER_API_KEY
```

### Liste Complète des Secrets

| Secret | Requis | Description |
|--------|--------|-------------|
| `RENDER_SERVICE_ID` | ✅ Oui | ID du service Render |
| `RENDER_API_KEY` | ✅ Oui | Clé API Render |
| `CODECOV_TOKEN` | ❌ Non | Token Codecov (couverture de code) |

---

## 📊 Statuts et Badges

### Ajouter des Badges au README

Ajoutez ces badges dans votre [README.md](../README.md) :

```markdown
![CI/CD](https://github.com/asinda/portofolio/actions/workflows/ci-cd.yml/badge.svg)
![Tests](https://github.com/asinda/portofolio/actions/workflows/tests.yml/badge.svg)
![Backend](https://github.com/asinda/portofolio/actions/workflows/deploy-backend.yml/badge.svg)
![Frontend](https://github.com/asinda/portofolio/actions/workflows/deploy-frontend.yml/badge.svg)
```

---

## 🐛 Dépannage

### ❌ Erreur : "RENDER_SERVICE_ID secret not found"

**Solution** :
1. Vérifiez que vous avez bien ajouté le secret dans **Settings → Secrets**
2. Le nom doit être exactement `RENDER_SERVICE_ID` (sensible à la casse)

### ❌ Échec du déploiement Render

**Solution** :
1. Vérifiez les logs sur Render Dashboard
2. Vérifiez que votre API Key est valide
3. Vérifiez que le Service ID est correct

### ❌ Échec du déploiement GitHub Pages

**Solution** :
1. Vérifiez que GitHub Pages est activé
2. Source doit être "GitHub Actions"
3. Vérifiez les permissions dans **Settings → Actions → General**

### ❌ Tests échouent

**Solution** :
1. Vérifiez les logs du workflow
2. Exécutez les tests localement : `cd backend && npm test`
3. Corrigez les erreurs et poussez à nouveau

### ⚠️ Health check échoue après déploiement

**Cause** : Render peut prendre jusqu'à 1-2 minutes pour démarrer le service

**Solution** :
1. Attendez quelques minutes
2. Vérifiez manuellement : `curl https://portfolio-backend-uj9f.onrender.com/api/health`
3. Si le problème persiste, vérifiez les logs Render

---

## 🔄 Workflow de Développement Recommandé

### 1. Développement Local

```bash
# Créer une branche
git checkout -b feature/nouvelle-fonctionnalite

# Développer et tester localement
cd backend
npm test

# Commiter
git add .
git commit -m "feat: Nouvelle fonctionnalité"
git push origin feature/nouvelle-fonctionnalite
```

### 2. Pull Request

1. Créez une PR de votre branche vers `main`
2. Les tests s'exécutent automatiquement
3. Attendez que les tests passent (✅ vert)
4. Demandez une review (optionnel)

### 3. Merge et Déploiement

```bash
# Merger dans main (via GitHub ou CLI)
git checkout main
git merge feature/nouvelle-fonctionnalite
git push origin main

# Le pipeline CI/CD se déclenche automatiquement
# ➜ Tests
# ➜ Déploiement Backend (Render)
# ➜ Déploiement Frontend (GitHub Pages)
# ➜ Vérifications finales
```

---

## 📈 Monitoring et Logs

### Logs GitHub Actions

1. **Actions** → Cliquez sur un workflow
2. Cliquez sur un job (Tests, Deploy, etc.)
3. Consultez les logs détaillés

### Logs Render

1. Dashboard Render → Votre service
2. **Logs** (menu de gauche)
3. Consultez les logs en temps réel

### Notifications

GitHub envoie automatiquement des emails en cas d'échec de workflow.

**Configurer les notifications** :
1. **Settings** → **Notifications**
2. **Actions** → Cochez "Send notifications for failed workflows"

---

## 🎯 Bonnes Pratiques

### ✅ À Faire

- ✅ Toujours tester localement avant de pousser
- ✅ Utiliser des messages de commit clairs
- ✅ Créer des PRs pour les fonctionnalités importantes
- ✅ Vérifier les logs en cas d'échec
- ✅ Garder les secrets à jour

### ❌ À Éviter

- ❌ Pousser directement sur `main` sans tests
- ❌ Commiter des secrets ou clés API
- ❌ Ignorer les échecs de tests
- ❌ Modifier les workflows sans tester
- ❌ Forcer le push (`git push -f`)

---

## 🔗 Ressources

- [Documentation GitHub Actions](https://docs.github.com/en/actions)
- [Documentation Render](https://render.com/docs)
- [GitHub Pages](https://pages.github.com/)
- [Render Deploy Action](https://github.com/johnbeynon/render-deploy-action)

---

## 📝 Support

En cas de problème :
1. Consultez les logs du workflow
2. Vérifiez la section [Dépannage](#dépannage)
3. Consultez la documentation Render/GitHub

---

**Créé avec 💙 pour le portfolio d'Alice Sindayigaya**
