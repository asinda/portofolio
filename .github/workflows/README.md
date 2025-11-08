# GitHub Actions Workflows

Ce dossier contient les workflows CI/CD pour le déploiement automatique du portfolio.

## 📁 Workflows Disponibles

### 🚀 [`ci-cd.yml`](ci-cd.yml) - Pipeline Complet
**Déclenchement** : Push sur `main` ou Pull Request

Pipeline complet incluant :
- Tests backend
- Qualité du code
- Déploiement backend (Render)
- Déploiement frontend (GitHub Pages)
- Vérifications post-déploiement

---

### 🧪 [`tests.yml`](tests.yml) - Tests Backend
**Déclenchement** : Push/PR sur `main` ou `dev` (modifications backend uniquement)

Exécute :
- Tests unitaires (Node.js 18.x et 20.x)
- Couverture de code
- Vérification syntaxe
- Audit de sécurité

---

### 🔧 [`deploy-backend.yml`](deploy-backend.yml) - Déploiement Backend
**Déclenchement** : Push sur `main` (modifications backend) ou manuel

Déploie le backend sur Render :
- Tests pré-déploiement
- Déploiement automatique
- Health checks
- Tests des endpoints

---

### 🌐 [`deploy-frontend.yml`](deploy-frontend.yml) - Déploiement Frontend
**Déclenchement** : Push sur `main` (modifications frontend) ou manuel

Déploie le frontend sur GitHub Pages :
- Validation HTML
- Vérification config API
- Déploiement automatique
- Vérification post-déploiement

---

## 🔧 Configuration Requise

### Secrets GitHub

Ajoutez ces secrets dans **Settings → Secrets and variables → Actions** :

| Secret | Description |
|--------|-------------|
| `RENDER_SERVICE_ID` | ID du service Render (srv-xxxxx) |
| `RENDER_API_KEY` | Clé API Render |

### Permissions

**Settings → Actions → General → Workflow permissions** :
- ✅ Read and write permissions
- ✅ Allow GitHub Actions to create and approve pull requests

### GitHub Pages

**Settings → Pages** :
- Source : **GitHub Actions**

---

## 📚 Documentation Complète

Consultez [docs/CI_CD_PIPELINE.md](../../docs/CI_CD_PIPELINE.md) pour :
- Guide de configuration détaillé
- Instructions d'utilisation
- Dépannage
- Bonnes pratiques

---

## 🚀 Utilisation Rapide

### Déploiement Automatique
```bash
git push origin main
# Le pipeline se déclenche automatiquement
```

### Déploiement Manuel
1. Allez dans **Actions**
2. Sélectionnez un workflow
3. **Run workflow** → Sélectionnez `main` → **Run workflow**

---

## 📊 Statut

![CI/CD](https://github.com/asinda/portofolio/actions/workflows/ci-cd.yml/badge.svg)
![Tests](https://github.com/asinda/portofolio/actions/workflows/tests.yml/badge.svg)

---

**Pour plus d'informations** : [Documentation CI/CD](../../docs/CI_CD_PIPELINE.md)
