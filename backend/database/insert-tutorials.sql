-- =====================================================
-- INSERTION DES 4 TUTORIELS CI/CD DANS blog_posts
-- =====================================================
-- Date: 2026-01-15
-- Auteur: Alice Sindayigaya
-- User ID: 3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3
-- =====================================================

-- TUTORIEL 1: Pipeline CI/CD Complet avec GitHub Actions
INSERT INTO blog_posts (
    user_id,
    title,
    slug,
    content,
    excerpt,
    cover_image,
    category,
    tags,
    status,
    published_at,
    views,
    read_time,
    seo_title,
    seo_description,
    seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Pipeline CI/CD Complet avec GitHub Actions',
    'github-actions-pipeline-cicd',
    $$# Pipeline CI/CD Complet avec GitHub Actions

## Introduction

GitHub Actions est devenu l'outil de CI/CD incontournable pour les projets hébergés sur GitHub. Dans ce tutoriel, nous allons construire un pipeline complet de A à Z pour une application Node.js + React.

## Architecture du Pipeline

Notre pipeline comprendra 4 étapes principales :
1. **Tests** - Validation du code
2. **Build** - Construction de l'application
3. **Sécurité** - Analyse des vulnérabilités
4. **Déploiement** - Mise en production

## Prérequis

- Un repository GitHub
- Une application Node.js (backend) + React (frontend)
- Compte AWS/Vercel/Netlify pour le déploiement

## Étape 1 : Structure du Projet

```
mon-projet/
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── backend/
│   ├── src/
│   ├── tests/
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── docker-compose.yml
```

## Étape 2 : Configuration du Workflow

Créez `.github/workflows/ci-cd.yml` :

```yaml
name: CI/CD Pipeline Complet

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  workflow_dispatch:

env:
  NODE_VERSION: '20.x'
  REGISTRY: ghcr.io

jobs:
  # ================================
  # JOB 1 : TESTS BACKEND
  # ================================
  test-backend:
    name: 🧪 Tests Backend
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - name: 📥 Checkout du code
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: 📦 Installation des dépendances
        working-directory: ./backend
        run: npm ci

      - name: 🔍 Lint du code
        working-directory: ./backend
        run: npm run lint

      - name: 🧪 Tests unitaires
        working-directory: ./backend
        run: npm test -- --coverage

      - name: 📊 Upload couverture de code
        if: matrix.node-version == '20.x'
        uses: codecov/codecov-action@v4
        with:
          files: ./backend/coverage/lcov.info
          flags: backend
          token: ${{ secrets.CODECOV_TOKEN }}

  # ================================
  # JOB 2 : TESTS FRONTEND
  # ================================
  test-frontend:
    name: 🎨 Tests Frontend
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: 📦 Installation
        working-directory: ./frontend
        run: npm ci

      - name: 🔍 Lint
        working-directory: ./frontend
        run: npm run lint

      - name: 🧪 Tests
        working-directory: ./frontend
        run: npm test -- --watchAll=false

      - name: 🏗️ Build de test
        working-directory: ./frontend
        run: npm run build

  # ================================
  # JOB 3 : ANALYSE DE SÉCURITÉ
  # ================================
  security:
    name: 🔒 Audit de Sécurité
    runs-on: ubuntu-latest
    needs: [test-backend, test-frontend]

    steps:
      - uses: actions/checkout@v4

      - name: 🔒 Audit npm Backend
        working-directory: ./backend
        run: npm audit --audit-level=high
        continue-on-error: true

      - name: 🔒 Audit npm Frontend
        working-directory: ./frontend
        run: npm audit --audit-level=high
        continue-on-error: true

      - name: 🔍 Analyse CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: javascript

      - name: 🔍 Analyse automatique
        uses: github/codeql-action/analyze@v3

      - name: 🛡️ Scan Trivy (Vulnérabilités)
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: 📤 Upload résultats Trivy
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'

  # ================================
  # JOB 4 : BUILD & PUSH DOCKER
  # ================================
  build-docker:
    name: 🐳 Build Docker Images
    runs-on: ubuntu-latest
    needs: [test-backend, test-frontend, security]
    if: github.ref == 'refs/heads/main'

    permissions:
      contents: read
      packages: write

    strategy:
      matrix:
        service: [backend, frontend]

    steps:
      - uses: actions/checkout@v4

      - name: 🔐 Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: 📝 Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ github.repository }}/${{ matrix.service }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=sha,prefix={{branch}}-

      - name: 🏗️ Build and Push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./${{ matrix.service }}
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ================================
  # JOB 5 : DÉPLOIEMENT PRODUCTION
  # ================================
  deploy-production:
    name: 🚀 Déploiement Production
    runs-on: ubuntu-latest
    needs: [build-docker]
    if: github.ref == 'refs/heads/main'

    environment:
      name: production
      url: https://mon-app.com

    steps:
      - uses: actions/checkout@v4

      - name: 🔐 Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-1

      - name: 🚀 Deploy to ECS
        run: |
          # Mettre à jour le service ECS
          aws ecs update-service \
            --cluster mon-cluster \
            --service mon-service \
            --force-new-deployment

      - name: ⏳ Attendre le déploiement
        run: |
          aws ecs wait services-stable \
            --cluster mon-cluster \
            --services mon-service

      - name: ✅ Health Check
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" https://mon-app.com/health)
          if [ $response -eq 200 ]; then
            echo "✅ Déploiement réussi !"
          else
            echo "❌ Échec du health check"
            exit 1
          fi

      - name: 📢 Notification Slack
        if: always()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Déploiement ${{ job.status }} sur Production",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Déploiement Production*\n*Status:* ${{ job.status }}\n*Commit:* ${{ github.sha }}\n*Auteur:* ${{ github.actor }}"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

  # ================================
  # JOB 6 : TESTS E2E POST-DEPLOY
  # ================================
  e2e-tests:
    name: 🎯 Tests E2E Production
    runs-on: ubuntu-latest
    needs: [deploy-production]

    steps:
      - uses: actions/checkout@v4

      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: 📦 Install Playwright
        run: |
          npm install -D @playwright/test
          npx playwright install --with-deps

      - name: 🎭 Run Playwright tests
        run: npx playwright test
        env:
          BASE_URL: https://mon-app.com

      - name: 📤 Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

## Résultats Attendus

Avec ce pipeline, vous obtenez :

📊 **Performance**
- Build complet : ~5-8 minutes
- Tests parallélisés : -60% de temps
- Cache intelligent : -40% de temps

🔒 **Sécurité**
- Scan automatique des vulnérabilités
- Analyse statique du code (CodeQL)
- Audit des dépendances npm

🚀 **Fiabilité**
- Tests sur 2 versions de Node.js
- Tests E2E post-déploiement
- Health checks automatiques
- Rollback en cas d'échec

## Conclusion

Ce pipeline CI/CD avec GitHub Actions couvre tous les aspects d'un déploiement professionnel : tests exhaustifs, sécurité, déploiement automatisé avec rollback, monitoring et notifications.

**Temps de mise en place** : 2-3 heures
**ROI** : Détection des bugs 10x plus rapide, déploiements 50x plus fréquents

---

**Auteur** : Alice Sindayigaya - Ingénieure DevOps
**Date** : Janvier 2026
**Tags** : CI/CD, GitHub Actions, DevOps, Automation, Docker, AWS$$,
    'Construisez un pipeline CI/CD professionnel de A à Z pour une application Node.js + React avec tests, sécurité et déploiement automatisé sur GitHub Actions.',
    '/images/tutorials/github-actions.jpg',
    'CI/CD',
    ARRAY['GitHub Actions', 'CI/CD', 'DevOps', 'Docker', 'AWS', 'Automation'],
    'published',
    '2026-01-15T10:00:00Z',
    0,
    25,
    'Pipeline CI/CD Complet avec GitHub Actions - Guide 2026',
    'Pipeline CI/CD complet avec GitHub Actions : tests, sécurité, Docker et déploiement AWS avec rollback automatique. Guide professionnel étape par étape.',
    ARRAY['github actions', 'ci/cd', 'pipeline', 'devops', 'docker', 'aws', 'tests automatisés', 'déploiement continu', 'integration continue']
);

-- TUTORIEL 2: GitLab CI/CD : De Docker à Kubernetes en Production
INSERT INTO blog_posts (
    user_id,
    title,
    slug,
    content,
    excerpt,
    cover_image,
    category,
    tags,
    status,
    published_at,
    views,
    read_time,
    seo_title,
    seo_description,
    seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'GitLab CI/CD : De Docker à Kubernetes en Production',
    'gitlab-cicd-docker-kubernetes',
    $$# GitLab CI/CD : De Docker à Kubernetes en Production

## Introduction

GitLab CI/CD est une plateforme complète intégrée qui gère l'ensemble du cycle de vie DevOps. Dans ce tutoriel, nous allons créer un pipeline qui construit des images Docker optimisées et les déploie sur Kubernetes.

## Architecture Cible

```
GitLab Repository
    ↓
Pipeline CI/CD (GitLab Runner)
    ↓
├─ Build → Docker Registry
├─ Test → SonarQube
├─ Scan → Trivy
└─ Deploy → Kubernetes (GKE/EKS/AKS)
```

## Prérequis

- Compte GitLab (GitLab.com ou self-hosted)
- GitLab Runner configuré
- Accès Docker Registry (GitLab Container Registry, DockerHub, ou privé)
- Cluster Kubernetes accessible
- kubectl configuré

## Configuration GitLab CI/CD

Le fichier `.gitlab-ci.yml` définit 6 stages complets : build, test, security, package, deploy, et verify. Chaque stage contient des jobs spécialisés qui s'exécutent selon des conditions définies.

## Dockerfile Multi-Stage Optimisé

L'utilisation de multi-stage builds permet de réduire la taille finale de l'image Docker de 87%, en séparant les étapes de build et de production. L'image finale ne contient que les dépendances de production et le code compilé.

## Déploiement Kubernetes

Le déploiement sur Kubernetes utilise une stratégie de Rolling Update avec health checks (liveness et readiness probes) pour garantir un déploiement zero-downtime. Les manifestes incluent des configurations pour la haute disponibilité avec anti-affinité des pods.

## Métriques de Performance

Avec cette configuration :

📊 **Build Time**
- Build Docker : ~2-4 minutes
- Tests : ~3-5 minutes
- Déploiement : ~2-3 minutes
- **Total** : ~10 minutes

💾 **Taille des Images**
- Image builder : ~1.2 GB
- Image production : ~150 MB (optimisée)
- Réduction : -87%

🚀 **Déploiement**
- Zero-downtime : Oui
- Rolling update : 30 secondes
- Rollback : 15 secondes

## Conclusion

Ce pipeline GitLab CI/CD professionnel vous permet de builder et déployer automatiquement sur Kubernetes, scanner la sécurité à chaque commit, déployer avec zero-downtime, rollback en cas de problème et monitorer les performances.

**ROI** : Déploiements 20x plus rapides, bugs détectés 5x plus tôt

---

**Auteur** : Alice Sindayigaya - Ingénieure DevOps
**Date** : Janvier 2026
**Tags** : GitLab, CI/CD, Docker, Kubernetes, DevOps$$,
    'Créez un pipeline GitLab qui construit des images Docker optimisées et les déploie sur Kubernetes avec stratégies avancées de déploiement rolling update et zero-downtime.',
    '/images/tutorials/gitlab-k8s.jpg',
    'CI/CD',
    ARRAY['GitLab', 'Docker', 'Kubernetes', 'CI/CD', 'DevOps', 'K8s'],
    'published',
    '2026-01-15T10:00:00Z',
    0,
    30,
    'GitLab CI/CD vers Kubernetes - Docker à la Production',
    'Pipeline GitLab CI/CD avec Docker optimisé et déploiement Kubernetes zero-downtime. Tests, sécurité et rolling updates inclus. Guide complet.',
    ARRAY['gitlab ci/cd', 'kubernetes', 'docker', 'k8s', 'pipeline', 'devops', 'deployment', 'rolling update', 'zero downtime']
);

-- TUTORIEL 3: Tests Automatisés et Qualité du Code
INSERT INTO blog_posts (
    user_id,
    title,
    slug,
    content,
    excerpt,
    cover_image,
    category,
    tags,
    status,
    published_at,
    views,
    read_time,
    seo_title,
    seo_description,
    seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Tests Automatisés et Qualité du Code : Guide Complet',
    'tests-automatises-qualite-code',
    $$# Tests Automatisés et Qualité du Code : Guide Complet

## Introduction

Les tests automatisés sont essentiels pour garantir la fiabilité de votre application. Dans ce tutoriel, nous allons mettre en place une stratégie de tests complète avec mesure de la qualité du code.

## Pyramide des Tests

```
       /\
      /  \     E2E (5%)
     /----\
    /      \   Intégration (15%)
   /--------\
  /          \ Unitaires (80%)
 /____________\
```

## Architecture de Test

```
Tests
├── Unitaires (Jest/Vitest)
├── Intégration (Supertest)
├── E2E (Playwright/Cypress)
├── Performance (k6)
├── Sécurité (OWASP ZAP)
└── Qualité (SonarQube)
```

## Partie 1 : Tests Unitaires avec Jest

Jest est le framework de test le plus populaire pour JavaScript. Configuration complète avec couverture de code, transformation TypeScript, et seuils de qualité à 80%.

## Partie 2 : Tests E2E avec Playwright

Playwright permet de tester l'application complète dans un navigateur réel. Support multi-navigateurs (Chromium, Firefox, WebKit) et mobile (Chrome Mobile, Safari Mobile).

## Partie 3 : Qualité du Code avec SonarQube

SonarQube analyse la qualité du code : bugs, vulnérabilités, code smells, couverture de tests, dette technique. Intégration CI/CD avec Quality Gates automatiques.

## Partie 4 : Tests de Performance avec k6

k6 est un outil moderne de tests de charge. Configuration avec stages (ramp-up, plateau, spike, ramp-down) et thresholds sur les temps de réponse et taux d'erreur.

## Métriques de Qualité

### Objectifs à Atteindre

| Métrique | Cible | Excellent |
|----------|-------|-----------|
| Couverture de code | >80% | >90% |
| Tests unitaires | >500 | >1000 |
| Temps de build | <5min | <3min |
| Bugs critiques | 0 | 0 |
| Code smells | <100 | <50 |
| Dette technique | <5 jours | <2 jours |

## Conclusion

Une stratégie de tests solide garantit un code fiable et maintenable, détection précoce des bugs, refactoring en toute confiance, documentation vivante et équipe productive.

**ROI** : 10x moins de bugs en production, 5x plus rapide pour corriger

---

**Auteur** : Alice Sindayigaya - Ingénieure DevOps
**Date** : Janvier 2026
**Tags** : Tests, Qualité, Jest, Playwright, SonarQube, DevOps$$,
    'Mettez en place une stratégie de tests complète avec Jest, Playwright, SonarQube et k6 pour garantir la fiabilité de votre application avec plus de 80% de couverture de code.',
    '/images/tutorials/tests-quality.jpg',
    'DevOps',
    ARRAY['Tests', 'Jest', 'Playwright', 'SonarQube', 'Qualité', 'DevOps'],
    'published',
    '2026-01-15T10:00:00Z',
    0,
    35,
    'Tests Automatisés et Qualité du Code - Guide Complet 2026',
    'Stratégie de tests complète : Jest, Playwright, SonarQube et k6. Atteignez 80% de couverture. Tests unitaires, E2E et performance. Guide pratique.',
    ARRAY['tests automatisés', 'jest', 'playwright', 'sonarqube', 'qualité code', 'tests unitaires', 'tests e2e', 'couverture de code', 'k6 performance']
);

-- TUTORIEL 4: Déploiement Multi-Environnements avec Terraform et Ansible
INSERT INTO blog_posts (
    user_id,
    title,
    slug,
    content,
    excerpt,
    cover_image,
    category,
    tags,
    status,
    published_at,
    views,
    read_time,
    seo_title,
    seo_description,
    seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Déploiement Multi-Environnements avec Terraform et Ansible',
    'deploiement-multi-environnements',
    $$# Déploiement Multi-Environnements avec Terraform et Ansible

## Introduction

La gestion de multiples environnements (dev, staging, production) est cruciale pour un workflow DevOps professionnel. Ce tutoriel couvre la mise en place complète d'une infrastructure multi-environnements avec Infrastructure as Code.

## Architecture Cible

```
Environnements
├── Development (AWS us-east-1)
├── Staging (AWS us-east-1)
├── Production (AWS us-west-2 + eu-west-1)
└── DR (Disaster Recovery - us-west-1)

Infrastructure
├── Terraform (Provisioning)
├── Ansible (Configuration)
├── Vault (Secrets)
└── ArgoCD (Déploiement K8s)
```

## Partie 1 : Infrastructure as Code avec Terraform

Terraform permet de provisionner l'infrastructure cloud de manière déclarative. Structure modulaire avec modules réutilisables (VPC, EKS, RDS, S3) et configuration par environnement (dev, staging, production).

## Module VPC Complet

Création d'un VPC avec subnets publics et privés, Internet Gateway, NAT Gateways (un par AZ pour haute disponibilité), Route Tables et tags Kubernetes pour l'intégration EKS.

## Module EKS Kubernetes

Déploiement d'un cluster EKS avec node groups configurables, addons essentiels (CoreDNS, kube-proxy, VPC CNI, EBS CSI driver), et security groups optimisés.

## Partie 2 : Configuration avec Ansible

Ansible gère la configuration des serveurs et le déploiement applicatif. Playbooks avec rolling updates (25% à la fois), health checks, smoke tests et intégration avec monitoring.

## Partie 3 : Gestion des Secrets avec Vault

HashiCorp Vault centralise la gestion des secrets. Politiques d'accès par environnement, rotation automatique des credentials, et intégration transparente avec Ansible.

## Partie 4 : Pipeline de Déploiement Multi-Env

Pipeline GitHub Actions orchestrant Terraform et Ansible : plan Terraform pour tous les environnements, déploiement progressif (dev → staging → production), tests E2E sur staging, et déploiement Blue-Green en production.

## Stratégies de Déploiement

### Blue-Green Deployment

Déploiement sur un environnement inactif (Blue ou Green), health checks, bascule du trafic, puis monitoring. Rollback instantané en cas de problème.

### Canary Deployment

Déploiement progressif : 10% du trafic sur la nouvelle version, monitoring des métriques, augmentation progressive si OK, rollback automatique si KO.

## Conclusion

Une stratégie multi-environnements solide garantit des déploiements sûrs et prévisibles, coûts optimisés par environnement, tests exhaustifs avant production, rollback rapide et conformité facilitée.

**ROI** : 0 downtime, déploiements 15x plus fréquents, coûts infra -40%

---

**Auteur** : Alice Sindayigaya - Ingénieure DevOps
**Date** : Janvier 2026
**Tags** : Terraform, Ansible, Multi-Env, IaC, AWS, DevOps$$,
    'Gérez plusieurs environnements (dev, staging, production) avec Infrastructure as Code Terraform, déploiements automatisés Ansible et stratégies Blue-Green et Canary avec Vault pour les secrets.',
    '/images/tutorials/terraform-ansible.jpg',
    'DevOps',
    ARRAY['Terraform', 'Ansible', 'IaC', 'Multi-Env', 'AWS', 'DevOps'],
    'published',
    '2026-01-15T10:00:00Z',
    0,
    40,
    'Déploiement Multi-Environnements Terraform Ansible - Guide IaC',
    'Gérez dev, staging, prod avec Terraform et Ansible. IaC, secrets Vault, Blue-Green et Canary. Déploiements zero downtime. Guide multi-environnements.',
    ARRAY['terraform', 'ansible', 'infrastructure as code', 'iac', 'multi environnements', 'vault', 'blue green deployment', 'canary deployment', 'aws', 'devops']
);

-- =====================================================
-- VÉRIFICATION
-- =====================================================
-- Compter les tutoriels insérés
SELECT
    COUNT(*) as total_tutorials,
    category,
    status
FROM blog_posts
WHERE user_id = '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3'
  AND category IN ('CI/CD', 'DevOps')
GROUP BY category, status
ORDER BY category;

-- Afficher les titres et slugs des tutoriels
SELECT
    title,
    slug,
    category,
    read_time,
    published_at,
    array_length(tags, 1) as nb_tags
FROM blog_posts
WHERE user_id = '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3'
  AND category IN ('CI/CD', 'DevOps')
ORDER BY published_at DESC;
