-- ========================================
-- SCRIPT COMPLET : 28 TUTORIELS PROFESSIONNELS
-- DevOps, Cloud, Kubernetes, CI/CD, Terraform, Ansible, Monitoring, Automation
-- ========================================

-- IMPORTANT: Remplacez '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3' par votre user_id réel
-- Pour trouver votre user_id : SELECT id FROM auth.users LIMIT 1;

-- ========================================
-- ÉTAPE 1 : NETTOYAGE COMPLET
-- ========================================

DELETE FROM blog_posts;

-- ========================================
-- CATÉGORIE : CLOUD (4 tutoriels)
-- ========================================

-- CLOUD 1: AWS Architecture 3-Tiers
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'AWS : Déployer une Architecture 3-Tiers Scalable',
    'aws-architecture-3-tiers',
    $BODY$# AWS : Architecture 3-Tiers Production-Ready

## 🎯 Use Case : Application Web Scalable

Startup qui passe de 1000 à 1 million d'utilisateurs. Architecture : Load Balancer → Serveurs Web (Auto-Scaling) → Base de données (Multi-AZ).

## Architecture

```
Internet → CloudFront (CDN) → ALB → EC2 Auto-Scaling Group → RDS Multi-AZ
```

## Étape 1 : VPC et Subnets

```hcl
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "production-vpc"
  }
}

resource "aws_subnet" "public" {
  count = 3
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index + 1}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
}
```

## ROI

- **Haute Disponibilité** : 99.99% uptime
- **Scalabilité** : 2 → 100 instances automatiquement
- **Coûts** : Pay-as-you-go, -40% vs serveurs dédiés$BODY$,
    'Déployez une architecture AWS 3-tiers scalable avec Terraform. VPC, ALB, Auto-Scaling, RDS Multi-AZ. Production-ready avec haute disponibilité.',
    '/images/tutorials/cloud-aws.svg',
    'Cloud',
    ARRAY['AWS', 'Cloud', 'Terraform', '3-Tiers', 'Architecture', 'Scalability'],
    'published',
    NOW() - INTERVAL '90 days',
    145,
    23,
    'AWS Architecture 3-Tiers : Scalable et Haute Disponibilité',
    'Architecture AWS 3-tiers avec Terraform. VPC, ALB, Auto-Scaling, RDS Multi-AZ. Production-ready 99.99% uptime.',
    ARRAY['aws', 'cloud', 'terraform', '3-tiers', 'architecture', 'scalability']
);

-- CLOUD 2: Azure DevOps + AKS
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Azure : Pipeline DevOps Complet avec AKS et ACR',
    'azure-devops-aks-pipeline',
    $BODY$# Azure DevOps + AKS : CI/CD Cloud-Native

## 🎯 Use Case : Microservices sur Azure Kubernetes

Entreprise qui migre 20 microservices vers Azure. Pipeline complet : Build → Test → Push ACR → Deploy AKS.

## Pipeline YAML

```yaml
trigger:
  branches:
    include:
      - main

stages:
- stage: Build
  jobs:
  - job: Build
    steps:
    - task: Docker@2
      displayName: Build and push image
      inputs:
        command: buildAndPush
        repository: $(imageRepository)
```

## ROI

- **Déploiements** : 30 min → 5 min
- **Rollback** : 1 commande
- **Coûts** : Pay-per-use, réduction 35%$BODY$,
    'Pipeline Azure DevOps complet avec AKS et ACR. Build, test, push, deploy automatisés. Microservices cloud-native sur Kubernetes managé.',
    '/images/tutorials/cloud-azure.svg',
    'Cloud',
    ARRAY['Azure', 'Cloud', 'AKS', 'DevOps', 'Kubernetes', 'CI/CD'],
    'published',
    NOW() - INTERVAL '85 days',
    132,
    25,
    'Azure DevOps + AKS : Pipeline CI/CD Cloud-Native Complet',
    'Pipeline Azure DevOps avec AKS et ACR. Build, test, deploy microservices. Kubernetes managé cloud-native.',
    ARRAY['azure', 'cloud', 'aks', 'devops', 'kubernetes', 'cicd']
);

-- CLOUD 3: GCP Cloud Run
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'GCP Cloud Run : Serverless Containers Auto-Scalant',
    'gcp-cloud-run-serverless',
    $BODY$# GCP Cloud Run : Serverless Container Platform

## 🎯 Use Case : API Serverless qui Scale à 0

API REST avec trafic variable. 0 requêtes la nuit → 10K requêtes/sec en journée. Cloud Run scale automatiquement et coûte 0€ quand inutilisé.

## Déploiement Simple

```bash
gcloud run deploy myapi \
  --source . \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 100
```

## ROI

- **Coûts** : 0€ quand inutilisé
- **Scaling** : 0 à 1000 instances en secondes
- **Maintenance** : 0 (managé)$BODY$,
    'Déployez des containers serverless avec GCP Cloud Run. Auto-scaling de 0 à 1000 instances. Pay-per-use, coûts optimisés. Production-ready.',
    '/images/tutorials/cloud-gcp.svg',
    'Cloud',
    ARRAY['GCP', 'Cloud', 'Serverless', 'Cloud Run', 'Containers', 'Auto-Scaling'],
    'published',
    NOW() - INTERVAL '80 days',
    118,
    20,
    'GCP Cloud Run : Serverless Containers Auto-Scalant',
    'Cloud Run serverless pour containers. Scale de 0 à 1000 instances. Pay-per-use, coûts optimisés.',
    ARRAY['gcp', 'cloud', 'serverless', 'cloud run', 'containers', 'autoscaling']
);

-- CLOUD 4: Multi-Cloud Terraform
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Multi-Cloud : Déployer sur AWS, Azure et GCP avec Terraform',
    'multi-cloud-terraform-aws-azure-gcp',
    $BODY$# Multi-Cloud avec Terraform

## 🎯 Use Case : Éviter le Vendor Lock-In

Entreprise qui veut répartir workloads sur 3 clouds : AWS (compute), Azure (DB), GCP (ML). Terraform unifie tout.

## Configuration Multi-Provider

```hcl
terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
    azurerm = { source = "hashicorp/azurerm", version = "~> 3.0" }
    google = { source = "hashicorp/google", version = "~> 5.0" }
  }
}
```

## ROI

- **Flexibilité** : Meilleur service de chaque cloud
- **Résilience** : Pas de single point of failure
- **Coûts** : Optimisation par workload$BODY$,
    'Infrastructure multi-cloud avec Terraform. AWS, Azure, GCP en 1 codebase. Évitez le vendor lock-in. Résilience et optimisation des coûts.',
    '/images/tutorials/cloud-multicloud.svg',
    'Cloud',
    ARRAY['Multi-Cloud', 'Terraform', 'AWS', 'Azure', 'GCP', 'IaC'],
    'published',
    NOW() - INTERVAL '75 days',
    156,
    22,
    'Multi-Cloud Terraform : AWS + Azure + GCP Unifié',
    'Infrastructure multi-cloud avec Terraform. AWS, Azure, GCP. Vendor lock-in évité, résilience maximale.',
    ARRAY['multi-cloud', 'terraform', 'aws', 'azure', 'gcp', 'iac']
);

-- ========================================
-- CATÉGORIE : DEVOPS (4 tutoriels Docker)
-- ========================================

-- DOCKER 1: Multi-Stage Builds
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Docker Multi-Stage Builds : Réduire vos Images de 1GB à 50MB',
    'docker-multi-stage-builds-optimization',
    $BODY$# Docker Multi-Stage Builds

## 🎯 Use Case : Image Node.js de 1.2GB → 85MB

Application Node.js. Image initiale : 1.2GB. Après multi-stage : 85MB. Temps de déploiement : -90%.

## Après : Multi-Stage (85MB)

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER node
CMD ["node", "dist/index.js"]
```

## ROI

- Taille : 1.2GB → 85MB (-93%)
- Push DockerHub : 5 min → 15 sec
- Déploiement K8s : 2 min → 10 sec$BODY$,
    'Optimisez vos images Docker avec multi-stage builds. Réduisez de 1GB à 50MB. Déploiements 10x plus rapides. Production-ready.',
    '/images/tutorials/docker-multistage.svg',
    'DevOps',
    ARRAY['Docker', 'Multi-Stage', 'Optimization', 'DevOps', 'Performance'],
    'published',
    NOW() - INTERVAL '70 days',
    189,
    18,
    'Docker Multi-Stage : Réduire Images de 1GB à 50MB',
    'Multi-stage builds Docker. Images 93% plus petites. Déploiements ultra-rapides. Distroless images.',
    ARRAY['docker', 'multi-stage', 'optimization', 'performance']
);

-- DOCKER 2: Docker Compose
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Docker Compose : Stack Microservices Complète en Local',
    'docker-compose-microservices-local',
    $BODY$# Docker Compose : Orchestration Locale

## 🎯 Use Case : 10 Services en 1 Commande

Environnement local : API, DB, Redis, RabbitMQ, frontend. `docker compose up` = tout démarre en 30 secondes.

## Docker Compose complet

```yaml
version: '3.8'

services:
  api:
    build: ./api
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_PASSWORD: password
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

## ROI

- Onboarding : 5 min vs 2 jours
- Environnement identique pour toute l'équipe$BODY$,
    'Orchestrez vos microservices localement avec Docker Compose. Stack complète en 1 commande. Onboarding devs en 5 minutes.',
    '/images/tutorials/docker-compose.svg',
    'DevOps',
    ARRAY['Docker', 'Docker Compose', 'Microservices', 'Development'],
    'published',
    NOW() - INTERVAL '65 days',
    167,
    16,
    'Docker Compose : Stack Microservices Locale Complète',
    'Docker Compose pour développement local. Multi-conteneurs, healthchecks. Stack en 1 commande.',
    ARRAY['docker', 'docker compose', 'microservices', 'development']
);

-- DOCKER 3: Security
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Sécurité Docker : Hardening et Scan de Vulnérabilités',
    'docker-security-hardening-best-practices',
    $BODY$# Docker Security Best Practices

## 🎯 Use Case : Passer un Audit PCI-DSS

Application bancaire. Exigences : conteneurs non-root, images scannées, secrets chiffrés.

## Dockerfile Sécurisé

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM gcr.io/distroless/nodejs20-debian11
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
USER nonroot:nonroot
CMD ["dist/index.js"]
```

## Scan avec Trivy

```bash
trivy image myapp:latest
```

## ROI

- Vulnérabilités : Détectées avant production
- Audit : Conformité automatique$BODY$,
    'Sécurisez vos conteneurs Docker. Hardening, scan vulnérabilités, distroless images. Conformité audit PCI-DSS.',
    '/images/tutorials/docker-security.svg',
    'DevOps',
    ARRAY['Docker', 'Security', 'DevSecOps', 'Hardening'],
    'published',
    NOW() - INTERVAL '60 days',
    201,
    19,
    'Docker Security : Hardening et Scan Vulnérabilités',
    'Sécurisez Docker. Scan vulnérabilités, hardening, distroless. Conformité audit.',
    ARRAY['docker', 'security', 'devsecops', 'hardening']
);

-- DOCKER 4: Harbor Registry
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Harbor : Registry Docker Privé avec Scan Automatique',
    'docker-harbor-private-registry-security',
    $BODY$# Harbor : Private Docker Registry

## 🎯 Use Case : Registry Privé Entreprise

50 images Docker privées. Harbor = registry + scan vulnérabilités + replication.

## Installation Harbor

```bash
wget https://github.com/goharbor/harbor/releases/download/v2.9.0/harbor-online-installer-v2.9.0.tgz
tar xzvf harbor-online-installer-v2.9.0.tgz
cd harbor
./install.sh
```

## Scan Automatique

Harbor scan automatiquement avec Trivy :
- CVE détectées
- Secrets hardcodés
- Mauvaises configurations

## ROI

- Images scannées automatiquement
- Blocage images vulnérables
- Conformité sécurité$BODY$,
    'Registry Docker privé avec Harbor. Scan automatique vulnérabilités avec Trivy. Policies de sécurité. Entreprise-ready.',
    '/images/tutorials/docker-harbor.svg',
    'DevOps',
    ARRAY['Docker', 'Harbor', 'Registry', 'Security', 'Trivy'],
    'published',
    NOW() - INTERVAL '55 days',
    178,
    21,
    'Harbor Registry Docker : Scan Vulnérabilités Automatique',
    'Registry Docker privé Harbor. Scan Trivy, policies sécurité. Conformité entreprise.',
    ARRAY['docker', 'harbor', 'registry', 'security', 'trivy']
);

-- ========================================
-- CATÉGORIE : KUBERNETES (4 tutoriels)
-- ========================================

-- K8S 1: Production Cluster
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Kubernetes : Cluster Production-Ready avec Kubeadm',
    'kubernetes-production-cluster-setup',
    $BODY$# Kubernetes Production Cluster

## 🎯 Use Case : E-commerce 24/7 Haute Disponibilité

Site e-commerce avec 100K visiteurs/jour. Kubernetes assure : haute disponibilité, auto-scaling, rolling updates sans downtime.

## Architecture

```
3 Master Nodes (HA) + 5 Worker Nodes
├── LoadBalancer (MetalLB)
├── Ingress (Nginx)
├── Storage (Longhorn)
└── Monitoring (Prometheus)
```

## Installation Kubeadm

```bash
# Sur chaque nœud
sudo kubeadm init --control-plane-endpoint="lb.example.com:6443" \
  --upload-certs \
  --pod-network-cidr=10.244.0.0/16

# Réseau CNI (Calico)
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
```

## Déploiement Application

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ecommerce-api
spec:
  replicas: 5
  template:
    spec:
      containers:
      - name: api
        image: myapp:v1.0
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1Gi
```

## ROI

- **Uptime** : 99.99% (4 pannes/an max)
- **Scaling** : 5 → 50 pods automatiquement
- **Zero Downtime** : Rolling updates sans interruption$BODY$,
    'Cluster Kubernetes production-ready avec kubeadm. Haute disponibilité, auto-scaling, monitoring intégré. Déploiements sans downtime.',
    '/images/tutorials/k8s-cluster.svg',
    'Kubernetes',
    ARRAY['Kubernetes', 'K8s', 'Production', 'High Availability', 'Cluster'],
    'published',
    NOW() - INTERVAL '50 days',
    234,
    28,
    'Kubernetes Production Cluster : Setup Complet Haute Disponibilité',
    'Cluster Kubernetes HA avec kubeadm. 3 masters, auto-scaling, monitoring. Production-ready.',
    ARRAY['kubernetes', 'k8s', 'production', 'high availability', 'cluster']
);

-- K8S 2: Helm Charts
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Helm : Package Manager pour Kubernetes Applications',
    'helm-kubernetes-package-manager',
    $BODY$# Helm : Package Manager Kubernetes

## 🎯 Use Case : Déployer 20 Microservices en 5 Minutes

Startup avec 20 microservices. Sans Helm : 200 fichiers YAML à maintenir. Avec Helm : 1 chart, 20 déploiements.

## Structure Chart Helm

```
mychart/
├── Chart.yaml
├── values.yaml
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
```

## Déploiement Simple

```bash
# Installer un chart
helm install myapp ./mychart

# Upgrade
helm upgrade myapp ./mychart --set image.tag=v2.0

# Rollback instantané
helm rollback myapp 1
```

## Values.yaml

```yaml
replicaCount: 3
image:
  repository: myapp
  tag: "1.0"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

resources:
  limits:
    cpu: 500m
    memory: 512Mi
```

## ROI

- **Déploiements** : 2h → 5 min
- **Rollback** : 1 commande vs 30 min manuel
- **Réutilisabilité** : 1 chart = infinite déploiements$BODY$,
    'Helm package manager pour Kubernetes. Simplifiez déploiements avec charts réutilisables. Rollback en 1 commande. Production-ready.',
    '/images/tutorials/helm-k8s.svg',
    'Kubernetes',
    ARRAY['Helm', 'Kubernetes', 'Package Manager', 'Charts', 'DevOps'],
    'published',
    NOW() - INTERVAL '45 days',
    198,
    24,
    'Helm Kubernetes : Package Manager pour Apps Cloud-Native',
    'Helm charts pour Kubernetes. Déploiements simplifiés, rollback instantané. Templates réutilisables.',
    ARRAY['helm', 'kubernetes', 'package manager', 'charts', 'devops']
);

-- K8S 3: Monitoring Stack
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Monitoring Kubernetes : Stack Prometheus + Grafana Complète',
    'kubernetes-monitoring-prometheus-grafana',
    $BODY$# Monitoring Kubernetes avec Prometheus

## 🎯 Use Case : Observer 100 Pods en Temps Réel

Cluster avec 100 pods. Stack monitoring : Prometheus (métriques) + Grafana (dashboards) + AlertManager (alertes).

## Installation kube-prometheus-stack

```bash
# Ajouter repo Helm
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Installer stack complète
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace
```

## Métriques Collectées

- CPU/Memory par pod
- Taux de requêtes HTTP
- Latence P50/P95/P99
- Erreurs 5xx
- Disk I/O

## Dashboards Grafana

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-dashboard
data:
  dashboard.json: |
    {
      "panels": [
        {
          "title": "Pod CPU Usage",
          "targets": [
            {
              "expr": "rate(container_cpu_usage_seconds_total[5m])"
            }
          ]
        }
      ]
    }
```

## ROI

- **Détection incidents** : 30 min → 30 sec
- **Root cause analysis** : 2h → 10 min
- **Coûts cloud** : -25% via optimisation ressources$BODY$,
    'Stack monitoring Kubernetes complète. Prometheus + Grafana + AlertManager. Métriques temps réel, dashboards, alertes automatiques.',
    '/images/tutorials/k8s-monitoring.svg',
    'Kubernetes',
    ARRAY['Kubernetes', 'Monitoring', 'Prometheus', 'Grafana', 'Observability'],
    'published',
    NOW() - INTERVAL '40 days',
    212,
    26,
    'Monitoring Kubernetes : Prometheus + Grafana Stack Complète',
    'Stack monitoring K8s. Prometheus, Grafana, AlertManager. Dashboards, métriques, alertes temps réel.',
    ARRAY['kubernetes', 'monitoring', 'prometheus', 'grafana', 'observability']
);

-- K8S 4: Service Mesh Istio
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Istio : Service Mesh pour Microservices Kubernetes',
    'istio-service-mesh-kubernetes',
    $BODY$# Istio Service Mesh

## 🎯 Use Case : Sécuriser 50 Microservices

Architecture microservices avec 50 services. Istio gère : mTLS automatique, traffic management, observabilité, circuit breakers.

## Installation Istio

```bash
# Télécharger Istio
curl -L https://istio.io/downloadIstio | sh -
cd istio-1.20.0
export PATH=$PWD/bin:$PATH

# Installer
istioctl install --set profile=production -y

# Activer injection sidecar
kubectl label namespace default istio-injection=enabled
```

## Traffic Management

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
  - reviews
  http:
  - match:
    - headers:
        user:
          exact: canary
    route:
    - destination:
        host: reviews
        subset: v2
      weight: 100
  - route:
    - destination:
        host: reviews
        subset: v1
      weight: 90
    - destination:
        host: reviews
        subset: v2
      weight: 10
```

## ROI

- **Sécurité** : mTLS automatique entre tous les services
- **Canary Deployments** : 0 downtime
- **Observabilité** : Tracing distribué Jaeger$BODY$,
    'Service mesh Istio pour Kubernetes. mTLS automatique, traffic management, observabilité avancée. Sécurisez vos microservices.',
    '/images/tutorials/istio-mesh.svg',
    'Kubernetes',
    ARRAY['Istio', 'Service Mesh', 'Kubernetes', 'Microservices', 'mTLS'],
    'published',
    NOW() - INTERVAL '35 days',
    187,
    30,
    'Istio Service Mesh : Sécurité et Observabilité Microservices',
    'Istio pour Kubernetes. mTLS, traffic management, tracing. Service mesh production-ready.',
    ARRAY['istio', 'service mesh', 'kubernetes', 'microservices', 'mtls']
);

-- ========================================
-- CATÉGORIE : CI/CD (4 tutoriels)
-- ========================================

-- CI/CD 1: GitHub Actions
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'GitHub Actions : Pipeline CI/CD Complet du Test au Déploiement',
    'github-actions-cicd-pipeline-complete',
    $BODY$# GitHub Actions : Pipeline CI/CD

## 🎯 Use Case : Automatiser tout le Cycle de Vie

Application web. À chaque push : tests → build → scan sécu → deploy. Tout automatique, zéro intervention manuelle.

## Workflow Complet

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t myapp:${{ github.sha }} .
      - name: Push to Registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push myapp:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/myapp myapp=myapp:${{ github.sha }}
          kubectl rollout status deployment/myapp
```

## ROI

- **Déploiements** : 1h → 5 min automatique
- **Bugs détectés** : +80% via tests auto
- **Time-to-market** : -50%$BODY$,
    'Pipeline CI/CD complet avec GitHub Actions. Tests auto, build, scan sécurité, déploiement. Zéro intervention manuelle.',
    '/images/tutorials/github-actions.svg',
    'CI/CD',
    ARRAY['GitHub Actions', 'CI/CD', 'DevOps', 'Automation', 'Pipeline'],
    'published',
    NOW() - INTERVAL '30 days',
    267,
    22,
    'GitHub Actions : Pipeline CI/CD Automatique Complet',
    'GitHub Actions CI/CD. Tests, build, deploy automatiques. Pipeline production-ready.',
    ARRAY['github actions', 'cicd', 'devops', 'automation', 'pipeline']
);

-- CI/CD 2: GitLab CI
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'GitLab CI : Pipeline Multi-Environnements avec Auto DevOps',
    'gitlab-ci-pipeline-multi-environments',
    $BODY$# GitLab CI : Pipeline Multi-Env

## 🎯 Use Case : Dev → Staging → Production Automatique

3 environnements isolés. Pipeline : push dev → tests → deploy staging → tests e2e → deploy prod (approbation manuelle).

## .gitlab-ci.yml

```yaml
stages:
  - test
  - build
  - deploy-staging
  - deploy-production

variables:
  DOCKER_IMAGE: registry.gitlab.com/$CI_PROJECT_PATH

test:
  stage: test
  script:
    - npm ci
    - npm run test
    - npm run lint
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'

build:
  stage: build
  script:
    - docker build -t $DOCKER_IMAGE:$CI_COMMIT_SHA .
    - docker push $DOCKER_IMAGE:$CI_COMMIT_SHA

deploy:staging:
  stage: deploy-staging
  script:
    - kubectl config use-context staging
    - helm upgrade --install myapp ./helm --set image.tag=$CI_COMMIT_SHA
  environment:
    name: staging
    url: https://staging.example.com

deploy:production:
  stage: deploy-production
  script:
    - kubectl config use-context production
    - helm upgrade --install myapp ./helm --set image.tag=$CI_COMMIT_SHA
  environment:
    name: production
    url: https://example.com
  when: manual
  only:
    - main
```

## ROI

- **Environnements isolés** : 0 conflit
- **Approbations** : Contrôle humain sur production
- **Traçabilité** : Audit complet des déploiements$BODY$,
    'Pipeline GitLab CI multi-environnements. Dev, staging, production automatisés. Approbations manuelles, traçabilité complète.',
    '/images/tutorials/gitlab-ci.svg',
    'CI/CD',
    ARRAY['GitLab CI', 'CI/CD', 'Multi-Environment', 'DevOps', 'Pipeline'],
    'published',
    NOW() - INTERVAL '25 days',
    243,
    24,
    'GitLab CI : Pipeline Multi-Environnements Production-Ready',
    'GitLab CI multi-env. Dev, staging, prod. Approbations, rollback, traçabilité.',
    ARRAY['gitlab ci', 'cicd', 'multi-environment', 'devops', 'pipeline']
);

-- CI/CD 3: Jenkins Pipeline
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Jenkins : Pipeline as Code avec Groovy et Docker',
    'jenkins-pipeline-as-code-groovy-docker',
    $BODY$# Jenkins Pipeline as Code

## 🎯 Use Case : Legacy CI/CD Modernisé

Migration CI/CD Jenkins classique → Pipeline as Code. 50 jobs manuels → 1 Jenkinsfile versionné Git.

## Jenkinsfile

```groovy
pipeline {
    agent {
        docker {
            image 'node:20-alpine'
        }
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm run test:unit'
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh 'npm run test:integration'
                    }
                }
                stage('Lint') {
                    steps {
                        sh 'npm run lint'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    docker.build("myapp:${env.BUILD_ID}").push()
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'kubectl set image deployment/myapp myapp=myapp:${BUILD_ID}'
            }
        }
    }

    post {
        success {
            slackSend color: 'good', message: "Build ${env.BUILD_ID} réussi!"
        }
        failure {
            slackSend color: 'danger', message: "Build ${env.BUILD_ID} échoué!"
        }
    }
}
```

## ROI

- **Versionning** : Pipeline dans Git
- **Tests parallèles** : Temps divisé par 3
- **Notifications** : Slack/Email automatiques$BODY$,
    'Jenkins Pipeline as Code avec Groovy. Jenkinsfile versionné, tests parallèles, notifications automatiques. Legacy modernisé.',
    '/images/tutorials/jenkins-pipeline.svg',
    'CI/CD',
    ARRAY['Jenkins', 'Pipeline', 'Groovy', 'CI/CD', 'DevOps'],
    'published',
    NOW() - INTERVAL '20 days',
    189,
    26,
    'Jenkins Pipeline as Code : Jenkinsfile et Docker',
    'Jenkins Pipeline moderne. Jenkinsfile versionné, tests parallèles, Docker agents.',
    ARRAY['jenkins', 'pipeline', 'groovy', 'cicd', 'devops']
);

-- CI/CD 4: ArgoCD GitOps
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'ArgoCD : GitOps pour Kubernetes - CD Déclaratif',
    'argocd-gitops-kubernetes-declarative',
    $BODY$# ArgoCD : GitOps Kubernetes

## 🎯 Use Case : Git comme Source de Vérité

Infrastructure Kubernetes. Git = source unique de vérité. ArgoCD synchronise automatiquement cluster avec Git repo.

## Installation ArgoCD

```bash
# Installer ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Accéder UI
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

## Application Manifest

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/myapp
    targetRevision: HEAD
    path: k8s/
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
```

## Workflow GitOps

1. Dev modifie YAML dans Git
2. Pull Request → Review
3. Merge vers main
4. ArgoCD détecte changement
5. Sync automatique vers cluster

## ROI

- **Audit** : Tout changement tracé dans Git
- **Rollback** : Git revert = rollback instant
- **Disaster Recovery** : Cluster recréé depuis Git$BODY$,
    'ArgoCD GitOps pour Kubernetes. Git comme source de vérité, sync automatique, rollback facile. CD déclaratif production-ready.',
    '/images/tutorials/argocd-gitops.svg',
    'CI/CD',
    ARRAY['ArgoCD', 'GitOps', 'Kubernetes', 'CD', 'Declarative'],
    'published',
    NOW() - INTERVAL '15 days',
    278,
    28,
    'ArgoCD GitOps : Continuous Delivery Déclaratif Kubernetes',
    'ArgoCD pour GitOps K8s. Git source de vérité, sync auto, rollback instant.',
    ARRAY['argocd', 'gitops', 'kubernetes', 'cd', 'declarative']
);

-- ========================================
-- CATÉGORIE : TERRAFORM (3 tutoriels)
-- ========================================

-- TERRAFORM 1: AWS Infrastructure
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Terraform AWS : Infrastructure as Code Production-Ready',
    'terraform-aws-infrastructure-as-code',
    $BODY$# Terraform AWS IaC

## 🎯 Use Case : Créer Infrastructure AWS en 5 Minutes

Infrastructure AWS complète : VPC, subnets, EC2, RDS, S3. Sans Terraform : 2 jours. Avec Terraform : 5 min.

## Structure Projet

```
terraform/
├── main.tf
├── variables.tf
├── outputs.tf
├── modules/
│   ├── vpc/
│   ├── compute/
│   └── database/
```

## VPC Module

```hcl
module "vpc" {
  source = "./modules/vpc"

  vpc_cidr = "10.0.0.0/16"
  azs      = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]

  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnets = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]

  enable_nat_gateway = true
  enable_vpn_gateway = false

  tags = {
    Environment = "production"
    Project     = "myapp"
  }
}
```

## Déploiement

```bash
terraform init
terraform plan
terraform apply -auto-approve
```

## ROI

- **Reproductibilité** : Même infra en 1 commande
- **Versioning** : Infrastructure dans Git
- **Destruction** : terraform destroy = cleanup complet$BODY$,
    'Terraform pour AWS. Infrastructure as Code production-ready. VPC, EC2, RDS, S3. Reproductible, versionné, automatisé.',
    '/images/tutorials/terraform-aws.svg',
    'Terraform',
    ARRAY['Terraform', 'AWS', 'IaC', 'Infrastructure', 'Automation'],
    'published',
    NOW() - INTERVAL '12 days',
    298,
    25,
    'Terraform AWS : Infrastructure as Code Complete',
    'Terraform pour AWS. IaC production-ready. VPC, compute, database. Modules réutilisables.',
    ARRAY['terraform', 'aws', 'iac', 'infrastructure', 'automation']
);

-- TERRAFORM 2: Modules Réutilisables
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Terraform Modules : Créer des Composants Réutilisables',
    'terraform-modules-reusable-components',
    $BODY$# Terraform Modules Réutilisables

## 🎯 Use Case : DRY Infrastructure Code

15 microservices avec infra similaire. Sans modules : copier-coller. Avec modules : 1 définition, 15 instances.

## Module Structure

```
modules/microservice/
├── main.tf
├── variables.tf
├── outputs.tf
└── README.md
```

## Module Microservice

```hcl
# modules/microservice/main.tf
resource "aws_ecs_service" "this" {
  name            = var.service_name
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = var.desired_count

  load_balancer {
    target_group_arn = aws_lb_target_group.this.arn
    container_name   = var.service_name
    container_port   = var.container_port
  }
}

resource "aws_lb_target_group" "this" {
  name     = "${var.service_name}-tg"
  port     = var.container_port
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path                = var.health_check_path
    healthy_threshold   = 2
    unhealthy_threshold = 10
  }
}
```

## Utilisation

```hcl
module "api" {
  source = "./modules/microservice"

  service_name      = "api"
  cluster_id        = aws_ecs_cluster.main.id
  vpc_id            = module.vpc.id
  desired_count     = 3
  container_port    = 3000
  health_check_path = "/health"
}

module "worker" {
  source = "./modules/microservice"

  service_name      = "worker"
  cluster_id        = aws_ecs_cluster.main.id
  vpc_id            = module.vpc.id
  desired_count     = 5
  container_port    = 3001
  health_check_path = "/ready"
}
```

## ROI

- **DRY** : 1 définition, N instances
- **Maintenance** : Update module = update all
- **Standards** : Best practices enforced$BODY$,
    'Terraform modules réutilisables. DRY infrastructure, maintenance simplifiée, best practices enforced. Composants standardisés.',
    '/images/tutorials/terraform-modules.svg',
    'Terraform',
    ARRAY['Terraform', 'Modules', 'IaC', 'Reusability', 'Best Practices'],
    'published',
    NOW() - INTERVAL '10 days',
    176,
    22,
    'Terraform Modules : Composants Réutilisables IaC',
    'Terraform modules. Infrastructure DRY, réutilisable, standardisée. Best practices.',
    ARRAY['terraform', 'modules', 'iac', 'reusability', 'best practices']
);

-- TERRAFORM 3: State Management
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Terraform State : Remote Backend et Locking S3/DynamoDB',
    'terraform-state-remote-backend-s3',
    $BODY$# Terraform State Management

## 🎯 Use Case : Travail en Équipe sans Conflits

Équipe de 10 DevOps. State local = conflits. Remote state S3 + locking DynamoDB = collaboration fluide.

## Backend Configuration

```hcl
terraform {
  backend "s3" {
    bucket         = "mycompany-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "eu-west-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

## Setup Backend

```bash
# Créer bucket S3
aws s3 mb s3://mycompany-terraform-state
aws s3api put-bucket-versioning \
  --bucket mycompany-terraform-state \
  --versioning-configuration Status=Enabled

# Créer table DynamoDB pour locking
aws dynamodb create-table \
  --table-name terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

## Workspaces

```bash
# Créer workspaces pour environnements
terraform workspace new dev
terraform workspace new staging
terraform workspace new production

# Utiliser workspace
terraform workspace select production
terraform apply
```

## ROI

- **Collaboration** : 10 DevOps sans conflits
- **Versioning** : State versionné S3
- **Sécurité** : State chiffré, locking automatique$BODY$,
    'Terraform state remote avec S3 et DynamoDB. Collaboration équipe, locking, versioning. State sécurisé et partagé.',
    '/images/tutorials/terraform-state.svg',
    'Terraform',
    ARRAY['Terraform', 'State', 'S3', 'DynamoDB', 'Team Collaboration'],
    'published',
    NOW() - INTERVAL '8 days',
    203,
    20,
    'Terraform State : Remote Backend S3 et Locking',
    'Terraform remote state. S3 backend, DynamoDB locking. Collaboration équipe sécurisée.',
    ARRAY['terraform', 'state', 's3', 'dynamodb', 'collaboration']
);

-- ========================================
-- CATÉGORIE : ANSIBLE (3 tutoriels)
-- ========================================

-- ANSIBLE 1: Server Configuration
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Ansible : Automatiser la Configuration de 100 Serveurs',
    'ansible-server-configuration-automation',
    $BODY$# Ansible : Configuration Management

## 🎯 Use Case : Configurer 100 Serveurs en 10 Minutes

Datacenter avec 100 serveurs Ubuntu. Manuellement : 2 semaines. Avec Ansible : 10 minutes.

## Inventory

```ini
[webservers]
web[01:50].example.com

[databases]
db[01:10].example.com

[loadbalancers]
lb[01:05].example.com

[all:vars]
ansible_user=ubuntu
ansible_ssh_private_key_file=~/.ssh/id_rsa
```

## Playbook Web Servers

```yaml
---
- name: Configure Web Servers
  hosts: webservers
  become: yes

  tasks:
    - name: Install packages
      apt:
        name:
          - nginx
          - nodejs
          - npm
        state: present
        update_cache: yes

    - name: Configure Nginx
      template:
        src: templates/nginx.conf.j2
        dest: /etc/nginx/sites-available/default
      notify: restart nginx

    - name: Ensure Nginx is running
      service:
        name: nginx
        state: started
        enabled: yes

  handlers:
    - name: restart nginx
      service:
        name: nginx
        state: restarted
```

## Exécution

```bash
ansible-playbook -i inventory playbook.yml
```

## ROI

- **Vitesse** : 100 serveurs en 10 min
- **Idempotence** : Réexécution safe
- **Documentation** : Playbook = doc vivante$BODY$,
    'Ansible pour configuration management. Automatisez 100+ serveurs en minutes. Playbooks idempotents, documentation vivante.',
    '/images/tutorials/ansible-config.svg',
    'Ansible',
    ARRAY['Ansible', 'Automation', 'Configuration', 'DevOps', 'Infrastructure'],
    'published',
    NOW() - INTERVAL '6 days',
    198,
    24,
    'Ansible : Automatisation Configuration Serveurs à l''Échelle',
    'Ansible configuration management. 100+ serveurs automatisés. Playbooks idempotents.',
    ARRAY['ansible', 'automation', 'configuration', 'devops', 'infrastructure']
);

-- ANSIBLE 2: Roles et Galaxy
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Ansible Roles : Réutiliser et Partager vos Playbooks',
    'ansible-roles-galaxy-reusable',
    $BODY$# Ansible Roles & Galaxy

## 🎯 Use Case : Bibliothèque de Rôles Réutilisables

10 projets avec configurations similaires. Créer rôles réutilisables : DRY, maintenabilité, Ansible Galaxy.

## Structure Role

```
roles/webserver/
├── tasks/
│   └── main.yml
├── handlers/
│   └── main.yml
├── templates/
│   └── nginx.conf.j2
├── files/
│   └── index.html
├── vars/
│   └── main.yml
├── defaults/
│   └── main.yml
└── meta/
    └── main.yml
```

## Role Webserver

```yaml
# roles/webserver/tasks/main.yml
---
- name: Install Nginx
  apt:
    name: nginx
    state: present

- name: Configure Nginx
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
  notify: restart nginx

- name: Start Nginx
  service:
    name: nginx
    state: started
    enabled: yes
```

## Utilisation

```yaml
---
- name: Setup Web Servers
  hosts: webservers
  roles:
    - common
    - security
    - webserver
    - monitoring
```

## Ansible Galaxy

```bash
# Rechercher rôles
ansible-galaxy search nginx

# Installer role
ansible-galaxy install geerlingguy.nginx

# Créer role
ansible-galaxy init my-role
```

## ROI

- **Réutilisabilité** : 1 role = N projets
- **Community** : 20K+ roles Ansible Galaxy
- **Standardisation** : Best practices partagées$BODY$,
    'Ansible roles et Galaxy. Créez composants réutilisables, partagez sur Galaxy. DRY automation, community-driven.',
    '/images/tutorials/ansible-roles.svg',
    'Ansible',
    ARRAY['Ansible', 'Roles', 'Galaxy', 'Reusability', 'Community'],
    'published',
    NOW() - INTERVAL '4 days',
    167,
    21,
    'Ansible Roles : Playbooks Réutilisables et Galaxy',
    'Ansible roles réutilisables. Galaxy community, DRY automation. Best practices.',
    ARRAY['ansible', 'roles', 'galaxy', 'reusability', 'community']
);

-- ANSIBLE 3: Dynamic Inventory
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Ansible Dynamic Inventory : AWS EC2 et Cloud Discovery',
    'ansible-dynamic-inventory-aws-cloud',
    $BODY$# Ansible Dynamic Inventory

## 🎯 Use Case : Auto-Discovery Instances Cloud

Infrastructure cloud dynamique. Instances créées/supprimées fréquemment. Dynamic inventory = découverte automatique.

## AWS EC2 Plugin

```yaml
# aws_ec2.yml
plugin: aws_ec2
regions:
  - eu-west-1
  - us-east-1

filters:
  instance-state-name: running

keyed_groups:
  - key: tags.Environment
    prefix: env
  - key: tags.Role
    prefix: role
  - key: placement.availability_zone
    prefix: az

compose:
  ansible_host: public_ip_address
```

## Utilisation

```bash
# Lister inventory
ansible-inventory -i aws_ec2.yml --list

# Exécuter playbook
ansible-playbook -i aws_ec2.yml playbook.yml

# Cibler groupe spécifique
ansible-playbook -i aws_ec2.yml playbook.yml --limit env_production
```

## Playbook avec Groupes Dynamiques

```yaml
---
- name: Configure Web Servers
  hosts: role_webserver
  tasks:
    - name: Update packages
      apt:
        upgrade: safe

- name: Configure Databases
  hosts: role_database
  tasks:
    - name: Backup databases
      shell: pg_dump mydb > backup.sql
```

## ROI

- **Auto-Discovery** : Nouvelles instances auto-détectées
- **No Maintenance** : Inventory mis à jour automatiquement
- **Cloud-Native** : Support AWS, Azure, GCP$BODY$,
    'Ansible dynamic inventory pour cloud. Auto-discovery instances AWS EC2, Azure, GCP. Pas de maintenance inventory manuelle.',
    '/images/tutorials/ansible-dynamic.svg',
    'Ansible',
    ARRAY['Ansible', 'Dynamic Inventory', 'AWS', 'Cloud', 'Automation'],
    'published',
    NOW() - INTERVAL '2 days',
    189,
    19,
    'Ansible Dynamic Inventory : Auto-Discovery Cloud',
    'Ansible dynamic inventory. AWS EC2, Azure, GCP. Auto-discovery instances cloud.',
    ARRAY['ansible', 'dynamic inventory', 'aws', 'cloud', 'automation']
);

-- ========================================
-- CATÉGORIE : MONITORING (3 tutoriels)
-- ========================================

-- MONITORING 1: Prometheus + Grafana
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Prometheus + Grafana : Stack Monitoring Production Complète',
    'prometheus-grafana-monitoring-stack',
    $BODY$# Prometheus + Grafana Stack

## 🎯 Use Case : Monitoring 200 Services en Production

Infrastructure avec 200 microservices. Stack monitoring : Prometheus (métriques) + Grafana (dashboards) + AlertManager (alertes).

## Docker Compose Stack

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:latest
    volumes:
      - grafana-data:/var/lib/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

  alertmanager:
    image: prom/alertmanager:latest
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
    ports:
      - "9093:9093"

volumes:
  prometheus-data:
  grafana-data:
```

## Configuration Prometheus

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']

  - job_name: 'api'
    static_configs:
      - targets: ['api:3000']
```

## Dashboard Grafana

```json
{
  "dashboard": {
    "title": "System Monitoring",
    "panels": [
      {
        "title": "CPU Usage",
        "targets": [
          {
            "expr": "100 - (avg by (instance) (rate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)"
          }
        ]
      }
    ]
  }
}
```

## ROI

- **Visibilité** : Métriques temps réel 200 services
- **Alertes** : Incidents détectés en <30 sec
- **Debugging** : Root cause analysis facilité$BODY$,
    'Stack monitoring Prometheus + Grafana complète. Métriques temps réel, dashboards, alertes. Production-ready pour microservices.',
    '/images/tutorials/prometheus-grafana.svg',
    'Monitoring',
    ARRAY['Prometheus', 'Grafana', 'Monitoring', 'Observability', 'Metrics'],
    'published',
    NOW() - INTERVAL '28 days',
    312,
    27,
    'Prometheus + Grafana : Stack Monitoring Production',
    'Prometheus Grafana monitoring. Métriques, dashboards, alertes. Stack production-ready.',
    ARRAY['prometheus', 'grafana', 'monitoring', 'observability', 'metrics']
);

-- MONITORING 2: ELK Stack
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'ELK Stack : Centralisez vos Logs avec Elasticsearch',
    'elk-stack-centralized-logging',
    $BODY$# ELK Stack : Centralized Logging

## 🎯 Use Case : Logs de 100 Serveurs Centralisés

100 serveurs = 100 fichiers logs dispersés. ELK Stack : Elasticsearch (stockage) + Logstash (collecte) + Kibana (visualisation).

## Docker Compose ELK

```yaml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "5000:5000"

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
```

## Logstash Pipeline

```
input {
  beats {
    port => 5044
  }
  tcp {
    port => 5000
    codec => json
  }
}

filter {
  if [type] == "nginx" {
    grok {
      match => { "message" => "%{COMBINEDAPACHELOG}" }
    }
  }

  date {
    match => [ "timestamp", "ISO8601" ]
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "logs-%{+YYYY.MM.dd}"
  }
}
```

## Filebeat Configuration

```yaml
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /var/log/nginx/*.log
  fields:
    type: nginx

output.logstash:
  hosts: ["logstash:5044"]
```

## ROI

- **Centralisation** : 1 interface, 100 sources
- **Recherche** : Full-text search milliseconde
- **Alertes** : Patterns anormaux détectés auto$BODY$,
    'ELK Stack pour logs centralisés. Elasticsearch, Logstash, Kibana. Full-text search, visualisations, alertes. Production-ready.',
    '/images/tutorials/elk-stack.svg',
    'Monitoring',
    ARRAY['ELK', 'Elasticsearch', 'Logstash', 'Kibana', 'Logging'],
    'published',
    NOW() - INTERVAL '22 days',
    267,
    29,
    'ELK Stack : Logs Centralisés avec Elasticsearch',
    'ELK Stack logging. Elasticsearch Logstash Kibana. Logs centralisés, recherche, alertes.',
    ARRAY['elk', 'elasticsearch', 'logstash', 'kibana', 'logging']
);

-- MONITORING 3: Distributed Tracing
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Jaeger : Distributed Tracing pour Microservices',
    'jaeger-distributed-tracing-microservices',
    $BODY$# Jaeger Distributed Tracing

## 🎯 Use Case : Débugger Latence dans 20 Microservices

Requête traverse 20 microservices. Latence : 5 sec. Où est le problème ? Jaeger tracing identifie le coupable.

## Architecture

```
Client → API Gateway → Service A → Service B → Service C → DB
                    ↓            ↓            ↓
                  Jaeger       Jaeger       Jaeger
```

## Installation Jaeger

```bash
# Docker
docker run -d --name jaeger \
  -p 16686:16686 \
  -p 14268:14268 \
  jaegertracing/all-in-one:latest
```

## Instrumentation Node.js

```javascript
const { initTracer } = require('jaeger-client');

const config = {
  serviceName: 'my-service',
  sampler: {
    type: 'const',
    param: 1,
  },
  reporter: {
    logSpans: true,
    agentHost: 'localhost',
    agentPort: 6831,
  },
};

const tracer = initTracer(config);

// Span création
const span = tracer.startSpan('http_request');
span.setTag('http.method', 'GET');
span.setTag('http.url', '/api/users');

// Opération
await doWork();

span.finish();
```

## Analyse Trace

```
Request ID: abc123
Total: 5200ms

├─ API Gateway (50ms)
├─ Auth Service (200ms)
├─ User Service (100ms)
├─ Order Service (4800ms) ← PROBLÈME ICI
│  ├─ Database Query (4750ms) ← REQUÊTE LENTE
│  └─ Cache Check (50ms)
└─ Response (50ms)
```

## ROI

- **Debugging** : Problème identifié en minutes
- **Optimisation** : Bottlenecks visualisés
- **SLA** : Respect garantis via monitoring latence$BODY$,
    'Jaeger distributed tracing pour microservices. Identifiez latences, débugguez requêtes complexes. OpenTelemetry compatible.',
    '/images/tutorials/jaeger-tracing.svg',
    'Monitoring',
    ARRAY['Jaeger', 'Tracing', 'Distributed', 'Microservices', 'Observability'],
    'published',
    NOW() - INTERVAL '18 days',
    198,
    25,
    'Jaeger : Distributed Tracing pour Microservices',
    'Jaeger tracing distribué. Débuggage microservices, latence, bottlenecks. OpenTelemetry.',
    ARRAY['jaeger', 'tracing', 'distributed', 'microservices', 'observability']
);

-- ========================================
-- CATÉGORIE : AUTOMATION (3 tutoriels)
-- ========================================

-- AUTOMATION 1: Python Scripts
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Python : 10 Scripts DevOps pour Automatiser le Quotidien',
    'python-devops-automation-scripts',
    $BODY$# Python DevOps Automation

## 🎯 Use Case : Automatiser Tâches Répétitives

Tâches manuelles quotidiennes : backups, cleanups, monitoring. Python scripts = automation complète.

## Script 1: Backup Automatique

```python
import boto3
from datetime import datetime

def backup_to_s3(file_path, bucket_name):
    s3 = boto3.client('s3')

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    key = f'backups/{timestamp}_{file_path}'

    s3.upload_file(file_path, bucket_name, key)
    print(f'✅ Backup uploaded: {key}')

# Usage
backup_to_s3('/var/lib/postgresql/backup.sql', 'my-backups')
```

## Script 2: Cleanup Docker

```python
import docker

def cleanup_old_images():
    client = docker.from_env()

    # Supprimer images danglings
    client.images.prune(filters={'dangling': True})

    # Supprimer conteneurs stopped
    client.containers.prune()

    # Supprimer volumes unused
    client.volumes.prune()

    print('✅ Docker cleanup completed')

cleanup_old_images()
```

## Script 3: Health Check

```python
import requests
from slack_sdk import WebClient

SERVICES = [
    'https://api.example.com/health',
    'https://app.example.com/health',
]

slack = WebClient(token='xoxb-token')

for url in SERVICES:
    try:
        r = requests.get(url, timeout=5)
        if r.status_code != 200:
            slack.chat_postMessage(
                channel='#alerts',
                text=f'🚨 {url} is DOWN!'
            )
    except Exception as e:
        slack.chat_postMessage(
            channel='#alerts',
            text=f'🚨 {url} error: {e}'
        )
```

## Cron Automation

```bash
# Crontab
0 2 * * * python3 /scripts/backup.py
0 3 * * * python3 /scripts/cleanup.py
*/5 * * * * python3 /scripts/healthcheck.py
```

## ROI

- **Temps gagné** : 2h/jour → 0
- **Erreurs** : -95% (automation = no human error)
- **Proactivité** : Alertes avant incidents$BODY$,
    'Automatisez DevOps avec Python. Backups, cleanups, health checks, notifications. Scripts production-ready, cron automation.',
    '/images/tutorials/python-automation.svg',
    'Automation',
    ARRAY['Python', 'Automation', 'DevOps', 'Scripts', 'Cron'],
    'published',
    NOW() - INTERVAL '14 days',
    289,
    23,
    'Python DevOps : 10 Scripts Automation Essentiels',
    'Python automation DevOps. Backups, cleanups, monitoring. Scripts production-ready.',
    ARRAY['python', 'automation', 'devops', 'scripts', 'cron']
);

-- AUTOMATION 2: Bash Scripts
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Bash : Scripts Shell Avancés pour DevOps Automation',
    'bash-shell-scripts-devops-automation',
    $BODY$# Bash Scripts DevOps

## 🎯 Use Case : Deployment Script One-Click

Déploiement manuel : 20 commandes. Bash script : 1 commande = déploiement complet.

## Deploy Script

```bash
#!/bin/bash
set -euo pipefail

# Configuration
APP_NAME="myapp"
VERSION="${1:-latest}"
ENVIRONMENT="${2:-production}"

echo "🚀 Deploying $APP_NAME:$VERSION to $ENVIRONMENT"

# Backup actuel
echo "📦 Creating backup..."
kubectl get deployment $APP_NAME -o yaml > backup-$(date +%Y%m%d).yaml

# Build Docker image
echo "🐳 Building image..."
docker build -t $APP_NAME:$VERSION .

# Push vers registry
echo "📤 Pushing to registry..."
docker push registry.example.com/$APP_NAME:$VERSION

# Deploy Kubernetes
echo "☸️  Deploying to Kubernetes..."
kubectl set image deployment/$APP_NAME $APP_NAME=registry.example.com/$APP_NAME:$VERSION

# Wait rollout
echo "⏳ Waiting for rollout..."
kubectl rollout status deployment/$APP_NAME

# Health check
echo "🏥 Health check..."
for i in {1..30}; do
    if curl -sf http://api.example.com/health > /dev/null; then
        echo "✅ Deployment successful!"
        exit 0
    fi
    sleep 2
done

echo "❌ Health check failed!"
echo "🔄 Rolling back..."
kubectl rollout undo deployment/$APP_NAME
exit 1
```

## Usage

```bash
# Deploy version spécifique
./deploy.sh v1.2.3 production

# Deploy latest
./deploy.sh latest staging
```

## Script Monitoring

```bash
#!/bin/bash

# Check services
services=("nginx" "postgresql" "redis")

for service in "${services[@]}"; do
    if systemctl is-active --quiet $service; then
        echo "✅ $service is running"
    else
        echo "❌ $service is DOWN"
        systemctl restart $service

        # Notification Slack
        curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK \
          -d "{\"text\":\"⚠️ $service was down and has been restarted\"}"
    fi
done
```

## ROI

- **Déploiements** : 20 étapes → 1 commande
- **Fiabilité** : Script = toujours même process
- **Rollback** : Automatique en cas d'échec$BODY$,
    'Bash scripts avancés pour DevOps. Déploiements one-click, health checks, rollback auto. Production-ready shell automation.',
    '/images/tutorials/bash-automation.svg',
    'Automation',
    ARRAY['Bash', 'Shell', 'Automation', 'DevOps', 'Scripts'],
    'published',
    NOW() - INTERVAL '10 days',
    223,
    21,
    'Bash Scripts DevOps : Automation et Deployment',
    'Bash automation DevOps. Scripts déploiement, monitoring, rollback. Shell avancé.',
    ARRAY['bash', 'shell', 'automation', 'devops', 'scripts']
);

-- AUTOMATION 3: ChatOps Slack
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'ChatOps : Automatiser DevOps via Slack Bot',
    'chatops-slack-bot-devops-automation',
    $BODY$# ChatOps avec Slack Bot

## 🎯 Use Case : Déployer depuis Slack

Équipe DevOps. Besoin : déployer, scaler, rollback sans quitter Slack. Slack bot = interface DevOps.

## Architecture

```
Slack → Bot (Node.js) → Kubernetes API
              ↓
        Notifications ← CI/CD Pipeline
```

## Slack Bot Node.js

```javascript
const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Commande: /deploy
app.command('/deploy', async ({ command, ack, respond }) => {
  await ack();

  const [service, version] = command.text.split(' ');

  await respond(`🚀 Déploiement de ${service}:${version} en cours...`);

  try {
    // Déploiement K8s
    await kubectl.setImage(`deployment/${service}`, `${service}=${version}`);
    await respond(`✅ ${service}:${version} déployé avec succès!`);
  } catch (error) {
    await respond(`❌ Erreur: ${error.message}`);
  }
});

// Commande: /scale
app.command('/scale', async ({ command, ack, respond }) => {
  await ack();

  const [service, replicas] = command.text.split(' ');

  await kubectl.scale(`deployment/${service}`, replicas);
  await respond(`✅ ${service} scalé à ${replicas} replicas`);
});

// Commande: /status
app.command('/status', async ({ command, ack, respond }) => {
  await ack();

  const status = await kubectl.getDeployments();

  const message = status.map(d =>
    `• ${d.name}: ${d.ready}/${d.replicas} ready`
  ).join('\n');

  await respond(`📊 Status:\n${message}`);
});

app.start(3000);
```

## Webhooks CI/CD

```javascript
// Recevoir notifs CI/CD
app.post('/webhooks/cicd', async (req, res) => {
  const { status, service, version } = req.body;

  const emoji = status === 'success' ? '✅' : '❌';

  await app.client.chat.postMessage({
    channel: '#deployments',
    text: `${emoji} ${service}:${version} - ${status}`
  });

  res.sendStatus(200);
});
```

## Usage Slack

```
/deploy api v1.2.3
/scale worker 10
/rollback api
/status
/logs api --tail 50
```

## ROI

- **Accessibilité** : DevOps depuis mobile
- **Collaboration** : Toute l'équipe voit les déploiements
- **Audit** : Historique complet dans Slack$BODY$,
    'ChatOps Slack bot pour DevOps. Déployez, scalez, monitorez depuis Slack. Collaboration équipe, audit automatique.',
    '/images/tutorials/chatops-slack.svg',
    'Automation',
    ARRAY['ChatOps', 'Slack', 'Bot', 'Automation', 'DevOps'],
    'published',
    NOW() - INTERVAL '5 days',
    312,
    26,
    'ChatOps Slack : Automatiser DevOps via Bot',
    'ChatOps Slack bot. Déploiements, scaling, monitoring depuis Slack. Collaboration équipe.',
    ARRAY['chatops', 'slack', 'bot', 'automation', 'devops']
);

-- ========================================
-- VÉRIFICATION FINALE
-- ========================================

-- Afficher statistiques
SELECT
    '📊 STATISTIQUES' as section,
    COUNT(*) as total_tutoriels,
    COUNT(*) FILTER (WHERE status = 'published') as publies
FROM blog_posts;

-- Compter par catégorie
SELECT
    '📂 PAR CATÉGORIE' as section,
    category,
    COUNT(*) as nombre
FROM blog_posts
GROUP BY category
ORDER BY nombre DESC;

-- Message de succès
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE '✅ SUCCÈS : 28 TUTORIELS INSÉRÉS';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Cloud: 4 | DevOps: 4 | Kubernetes: 4';
    RAISE NOTICE 'CI/CD: 4 | Terraform: 3 | Ansible: 3';
    RAISE NOTICE 'Monitoring: 3 | Automation: 3';
    RAISE NOTICE '============================================';
END $$;
