-- ========================================
-- TUTORIELS CI/CD ALTERNATIFS (avec slugs différents)
-- À utiliser si les autres slugs existent déjà
-- ========================================
-- IMPORTANT: Remplacez '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3' par votre user_id

-- CI/CD 1: ArgoCD GitOps
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'ArgoCD : GitOps pour Kubernetes avec Déploiement Continu',
    'argocd-gitops-kubernetes-cicd',
    $BODY$# ArgoCD : GitOps pour Kubernetes

## 🎯 Use Case : Déploiement Continu avec GitOps

Équipe DevOps qui gère 50 microservices sur Kubernetes. Avant ArgoCD : déploiements manuels via kubectl. Après ArgoCD : Git est la source de vérité, déploiements automatiques et auditables.

## Architecture GitOps

```
Git Repository (Source of Truth) → ArgoCD (Sync Engine) → Kubernetes Cluster (Target State)
```

## Étape 1 : Installation ArgoCD

```bash
# Créer namespace ArgoCD
kubectl create namespace argocd

# Installer ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Exposer l'interface web
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Récupérer le mot de passe initial
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

## Étape 2 : Structure Repository GitOps

```
gitops-repo/
├── apps/
│   ├── production/
│   │   ├── api/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── ingress.yaml
│   │   ├── frontend/
│   │   └── database/
│   ├── staging/
│   └── dev/
├── infrastructure/
│   ├── namespaces/
│   ├── ingress-controller/
│   └── monitoring/
└── argocd-apps/
    ├── app-api.yaml
    └── app-frontend.yaml
```

## Étape 3 : Créer Application ArgoCD

```yaml
# argocd-apps/app-api.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: api-production
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/gitops-repo.git
    targetRevision: main
    path: apps/production/api
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true        # Supprimer ressources non présentes dans Git
      selfHeal: true     # Auto-corriger si drift détecté
      allowEmpty: false
    syncOptions:
      - CreateNamespace=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

## Étape 4 : Déploiement via Git

```bash
# Mettre à jour l'image dans Git
cd gitops-repo/apps/production/api
sed -i 's/image: api:v1.0.0/image: api:v1.1.0/' deployment.yaml

# Commit et push
git add .
git commit -m "Update API to v1.1.0"
git push origin main

# ArgoCD détecte le changement et déploie automatiquement !
# Vérifier le status
argocd app get api-production
argocd app sync api-production --prune
```

## Étape 5 : Multi-Cluster avec ApplicationSet

```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: api-all-clusters
  namespace: argocd
spec:
  generators:
    - list:
        elements:
          - cluster: production
            url: https://prod-cluster.example.com
          - cluster: staging
            url: https://staging-cluster.example.com
  template:
    metadata:
      name: 'api-{{cluster}}'
    spec:
      project: default
      source:
        repoURL: https://github.com/myorg/gitops-repo.git
        targetRevision: main
        path: 'apps/{{cluster}}/api'
      destination:
        server: '{{url}}'
        namespace: '{{cluster}}'
      syncPolicy:
        automated:
          prune: true
          selfHeal: true
```

## Étape 6 : Rollback Automatique

```bash
# Rollback en 1 commande
argocd app rollback api-production

# Ou via Git
git revert HEAD
git push origin main
# ArgoCD sync automatiquement vers l'état précédent
```

## Étape 7 : Notifications Slack

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-notifications-cm
  namespace: argocd
data:
  service.slack: |
    token: $slack-token
  trigger.on-deployed: |
    - when: app.status.operationState.phase in ['Succeeded']
      send: [app-deployed]
  template.app-deployed: |
    message: |
      Application {{.app.metadata.name}} deployed successfully!
      Version: {{.app.status.sync.revision}}
    slack:
      attachments: |
        [{
          "title": "{{.app.metadata.name}}",
          "color": "good",
          "fields": [{
            "title": "Sync Status",
            "value": "{{.app.status.sync.status}}",
            "short": true
          }]
        }]
```

## Étape 8 : CI/CD Pipeline Complet

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t myapp:${{ github.sha }} .

      - name: Push to registry
        run: docker push myapp:${{ github.sha }}

  update-gitops:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout GitOps repo
        uses: actions/checkout@v3
        with:
          repository: myorg/gitops-repo
          token: ${{ secrets.GITOPS_TOKEN }}

      - name: Update image tag
        run: |
          cd apps/production/api
          sed -i "s|image: myapp:.*|image: myapp:${{ github.sha }}|" deployment.yaml

      - name: Commit and push
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add .
          git commit -m "Update API to ${{ github.sha }}"
          git push

      # ArgoCD détecte automatiquement et déploie !
```

## Monitoring avec Prometheus

```yaml
# ServiceMonitor pour ArgoCD
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: argocd-metrics
  namespace: argocd
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: argocd-metrics
  endpoints:
    - port: metrics
```

## ROI

**Avant ArgoCD :**
- Déploiement manuel : 30 min
- Erreurs humaines : 2/semaine
- Rollback : 20 min
- Audit trail : Inexistant

**Après ArgoCD :**
- Déploiement automatique : 2 min (-93%)
- Erreurs humaines : 0 (Git review obligatoire)
- Rollback : 30 sec (-97%)
- Audit trail : Complet (tout dans Git)

## Use Case Réel : Netflix

Netflix utilise Spinnaker (similaire à ArgoCD) pour gérer 1000+ microservices. Résultat :
- 4000 déploiements/jour
- 0.001% taux d'erreur
- Rollback en <1 min$BODY$,
    'GitOps avec ArgoCD pour Kubernetes. Déploiement continu automatique, Git comme source de vérité, self-healing, multi-cluster. Pipeline CI/CD complet.',
    '/images/tutorials/devops-argocd.svg',
    'CI/CD',
    ARRAY['CI/CD', 'ArgoCD', 'GitOps', 'Kubernetes', 'Continuous Deployment', 'Automation'],
    'published',
    NOW() - INTERVAL '42 days',
    0,
    28,
    'ArgoCD GitOps : Déploiement Continu Kubernetes Automatisé',
    'GitOps avec ArgoCD pour Kubernetes. Sync automatique depuis Git, self-healing, rollback instantané. Multi-cluster support.',
    ARRAY['cicd', 'argocd', 'gitops', 'kubernetes', 'continuous deployment', 'automation']
);

-- CI/CD 2: Jenkins Pipeline Multi-Branch
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Jenkins : Pipeline Multi-Branch et Déploiement Blue/Green',
    'jenkins-pipeline-multibranch-bluegreen',
    $BODY$# Jenkins : Pipeline Multi-Branch Avancé

## 🎯 Use Case : CI/CD Entreprise avec Jenkins

Grande entreprise avec 100 repos Git, 500 développeurs. Chaque PR doit être testée, validée et déployée automatiquement en environnement de test.

## Architecture Pipeline

```
GitHub → Jenkins Multi-Branch → Build → Tests → SonarQube → Deploy Staging → Deploy Blue/Green Production
```

## Étape 1 : Jenkinsfile Multi-Stage

```groovy
// Jenkinsfile
pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'registry.example.com'
        APP_NAME = 'myapp'
        SONAR_TOKEN = credentials('sonar-token')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                script {
                    docker.build("${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER}")
                }
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'npm run test:unit'
                junit 'test-results/junit.xml'
            }
        }

        stage('Integration Tests') {
            steps {
                sh 'npm run test:integration'
            }
        }

        stage('Code Quality') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=myapp \
                            -Dsonar.sources=src \
                            -Dsonar.tests=test \
                            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                        """
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Security Scan') {
            steps {
                sh 'npm audit --audit-level=high'
                snykSecurity(
                    snykInstallation: 'Snyk',
                    snykTokenId: 'snyk-api-token'
                )
            }
        }

        stage('Push Docker Image') {
            when {
                branch 'main'
            }
            steps {
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-credentials') {
                        docker.image("${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER}").push()
                        docker.image("${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER}").push('latest')
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh """
                        kubectl set image deployment/myapp-staging \
                        myapp=${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER} \
                        -n staging
                    """
                }
            }
        }

        stage('E2E Tests Staging') {
            when {
                branch 'main'
            }
            steps {
                sh 'npm run test:e2e -- --env=staging'
            }
        }

        stage('Deploy to Production (Blue/Green)') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'

                script {
                    // Deploy to Green environment
                    sh """
                        kubectl set image deployment/myapp-green \
                        myapp=${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER} \
                        -n production
                    """

                    // Wait for rollout
                    sh 'kubectl rollout status deployment/myapp-green -n production'

                    // Switch traffic to Green
                    sh """
                        kubectl patch service myapp -n production \
                        -p '{"spec":{"selector":{"version":"green"}}}'
                    """

                    // Old Blue becomes new Green for next deploy
                    sh """
                        kubectl set image deployment/myapp-blue \
                        myapp=${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER} \
                        -n production
                    """
                }
            }
        }
    }

    post {
        success {
            slackSend(
                color: 'good',
                message: "✅ Pipeline SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)"
            )
        }
        failure {
            slackSend(
                color: 'danger',
                message: "❌ Pipeline FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)"
            )
        }
        always {
            cleanWs()
        }
    }
}
```

## Étape 2 : Configuration Multi-Branch

```groovy
// Configuration via JCasC (Jenkins Configuration as Code)
jenkins:
  systemMessage: "Jenkins CI/CD Server"
  numExecutors: 5

jobs:
  - script: >
      multibranchPipelineJob('myapp-pipeline') {
        branchSources {
          github {
            id('myapp-repo')
            repoOwner('myorg')
            repository('myapp')
            credentialsId('github-token')
            buildOriginBranch(true)
            buildOriginBranchWithPR(true)
            buildOriginPRMerge(false)
            buildOriginPRHead(true)
          }
        }
        orphanedItemStrategy {
          discardOldItems {
            numToKeep(10)
          }
        }
        triggers {
          periodic(1)  // Scan every 1 minute
        }
      }
```

## Étape 3 : Blue/Green Kubernetes

```yaml
# blue-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-blue
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: blue
  template:
    metadata:
      labels:
        app: myapp
        version: blue
    spec:
      containers:
      - name: myapp
        image: registry.example.com/myapp:latest
        ports:
        - containerPort: 8080

---
# green-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-green
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: green
  template:
    metadata:
      labels:
        app: myapp
        version: green
    spec:
      containers:
      - name: myapp
        image: registry.example.com/myapp:previous
        ports:
        - containerPort: 8080

---
# service.yaml (switch entre blue/green)
apiVersion: v1
kind: Service
metadata:
  name: myapp
  namespace: production
spec:
  selector:
    app: myapp
    version: blue  # Change to "green" pour switch
  ports:
  - port: 80
    targetPort: 8080
```

## Étape 4 : Shared Libraries Jenkins

```groovy
// vars/deployToK8s.groovy
def call(String environment, String image) {
    sh """
        kubectl set image deployment/myapp \
        myapp=${image} \
        -n ${environment}

        kubectl rollout status deployment/myapp -n ${environment}
    """
}

// Utilisation dans Jenkinsfile
deployToK8s('staging', "${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER}")
```

## Étape 5 : Monitoring Pipeline

```groovy
stage('Metrics') {
    steps {
        script {
            // Publish metrics to Prometheus
            def metrics = [
                build_duration: currentBuild.duration,
                build_result: currentBuild.result,
                tests_passed: env.TESTS_PASSED,
                code_coverage: env.CODE_COVERAGE
            ]

            pushGateway(
                jobName: "${env.JOB_NAME}",
                metrics: metrics
            )
        }
    }
}
```

## ROI

**Métriques Jenkins réelles (entreprise 500 devs) :**
- Pipelines/jour : 2000+
- Temps moyen build : 8 min
- Success rate : 92%
- MTTR (Mean Time To Repair) : 12 min
- Déploiements prod/jour : 50+

**Économies :**
- Temps QA : -60% (tests automatisés)
- Hotfix urgents : -80%
- Rollback : 30 sec vs 30 min$BODY$,
    'Pipeline Jenkins multi-branch avancé avec déploiement Blue/Green. Tests automatisés, quality gates, sécurité, Kubernetes. CI/CD entreprise complet.',
    '/images/tutorials/devops-jenkins.svg',
    'CI/CD',
    ARRAY['CI/CD', 'Jenkins', 'Pipeline', 'Blue-Green', 'Kubernetes', 'Automation'],
    'published',
    NOW() - INTERVAL '45 days',
    0,
    27,
    'Jenkins Pipeline Multi-Branch : Blue/Green Deployment K8s',
    'Pipeline Jenkins avancé avec multi-branch, quality gates, déploiement Blue/Green sur Kubernetes. CI/CD entreprise complet.',
    ARRAY['cicd', 'jenkins', 'pipeline', 'blue-green', 'kubernetes', 'automation']
);
