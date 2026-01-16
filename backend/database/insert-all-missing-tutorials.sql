-- ========================================
-- INSÉRER TOUS LES TUTORIELS MANQUANTS
-- Cloud (4) + Docker (4) + autres si nécessaire
-- ========================================
-- IMPORTANT: Remplacez '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3' par votre user_id

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

  tags = {
    Name = "public-subnet-${count.index + 1}"
  }
}

resource "aws_subnet" "private" {
  count = 3

  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 11}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "private-subnet-${count.index + 1}"
  }
}
```

## Étape 2 : Application Load Balancer

```hcl
resource "aws_lb" "main" {
  name               = "app-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = true

  tags = {
    Name = "production-alb"
  }
}

resource "aws_lb_target_group" "app" {
  name     = "app-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    path                = "/health"
    healthy_threshold   = 2
    unhealthy_threshold = 10
  }
}
```

## Étape 3 : Auto-Scaling Group

```hcl
resource "aws_launch_template" "app" {
  name_prefix   = "app-lt-"
  image_id      = data.aws_ami.amazon_linux_2.id
  instance_type = "t3.micro"

  user_data = base64encode(<<-EOF
    #!/bin/bash
    yum update -y
    yum install -y docker
    systemctl start docker
    docker run -d -p 80:8080 myapp:latest
  EOF
  )

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.app.id]
  }
}

resource "aws_autoscaling_group" "app" {
  desired_capacity    = 2
  max_size            = 10
  min_size            = 2
  target_group_arns   = [aws_lb_target_group.app.arn]
  vpc_zone_identifier = aws_subnet.private[*].id

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "app-server"
    propagate_at_launch = true
  }
}
```

## Étape 4 : RDS Multi-AZ

```hcl
resource "aws_db_instance" "main" {
  identifier             = "production-db"
  engine                 = "postgres"
  engine_version         = "15.3"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  storage_encrypted      = true

  db_name  = "myapp"
  username = "admin"
  password = var.db_password

  multi_az               = true
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.db.id]

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "mon:04:00-mon:05:00"

  skip_final_snapshot = false
  final_snapshot_identifier = "production-db-final-snapshot"
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
    NOW() - INTERVAL '25 days',
    0,
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

## Architecture

```
Azure Repos → Azure Pipelines → Azure Container Registry → Azure Kubernetes Service
```

## Étape 1 : Créer AKS Cluster

```bash
# Créer Resource Group
az group create --name myapp-rg --location westeurope

# Créer AKS
az aks create \
  --resource-group myapp-rg \
  --name myapp-aks \
  --node-count 3 \
  --enable-addons monitoring \
  --generate-ssh-keys

# Connecter kubectl
az aks get-credentials --resource-group myapp-rg --name myapp-aks
```

## Étape 2 : Azure Pipeline YAML

```yaml
trigger:
  branches:
    include:
      - main

variables:
  dockerRegistryServiceConnection: 'myacr-connection'
  imageRepository: 'myapp'
  containerRegistry: 'myacr.azurecr.io'
  dockerfilePath: '$(Build.SourcesDirectory)/Dockerfile'
  tag: '$(Build.BuildId)'

stages:
- stage: Build
  displayName: Build and Push
  jobs:
  - job: Build
    displayName: Build
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: Docker@2
      displayName: Build and push image
      inputs:
        command: buildAndPush
        repository: $(imageRepository)
        dockerfile: $(dockerfilePath)
        containerRegistry: $(dockerRegistryServiceConnection)
        tags: |
          $(tag)
          latest

- stage: Deploy
  displayName: Deploy to AKS
  dependsOn: Build
  jobs:
  - deployment: Deploy
    displayName: Deploy
    pool:
      vmImage: 'ubuntu-latest'
    environment: 'production'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: KubernetesManifest@0
            displayName: Deploy to Kubernetes
            inputs:
              action: 'deploy'
              kubernetesServiceConnection: 'aks-connection'
              namespace: 'production'
              manifests: |
                $(Pipeline.Workspace)/manifests/deployment.yml
                $(Pipeline.Workspace)/manifests/service.yml
              containers: |
                $(containerRegistry)/$(imageRepository):$(tag)
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
    NOW() - INTERVAL '30 days',
    0,
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

## Architecture

```
Client → Cloud Load Balancing → Cloud Run (Auto-Scale 0→1000) → Cloud SQL
```

## Déploiement Simple

```bash
# Build et deploy en 1 commande
gcloud run deploy myapi \
  --source . \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 100 \
  --cpu 1 \
  --memory 512Mi \
  --timeout 60s
```

## Configuration avancée

```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: myapi
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "0"
        autoscaling.knative.dev/maxScale: "100"
        autoscaling.knative.dev/target: "80"
    spec:
      containers:
      - image: gcr.io/myproject/myapi:latest
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: "1000m"
            memory: "512Mi"
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
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
    NOW() - INTERVAL '35 days',
    0,
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

## Architecture

```
Terraform → AWS (EC2) + Azure (SQL DB) + GCP (Vertex AI)
```

## Configuration Multi-Provider

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-west-1"
}

provider "azurerm" {
  features {}
}

provider "google" {
  project = "my-project"
  region  = "europe-west1"
}
```

## Déploiement Multi-Cloud

```hcl
# AWS : Compute
resource "aws_instance" "app" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
}

# Azure : Database
resource "azurerm_postgresql_server" "db" {
  name                = "myapp-db"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

# GCP : Machine Learning
resource "google_vertex_ai_endpoint" "ml" {
  display_name = "mymodel-endpoint"
  location     = "europe-west1"
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
    NOW() - INTERVAL '38 days',
    0,
    22,
    'Multi-Cloud Terraform : AWS + Azure + GCP Unifié',
    'Infrastructure multi-cloud avec Terraform. AWS, Azure, GCP. Vendor lock-in évité, résilience maximale.',
    ARRAY['multi-cloud', 'terraform', 'aws', 'azure', 'gcp', 'iac']
);

-- ========================================
-- CATÉGORIE : DOCKER (4 tutoriels - optionnel si Docker n'est pas dans les catégories valides)
-- Si vous avez une erreur de contrainte, commentez cette section
-- ========================================

-- Note: Si 'Docker' n'est pas une catégorie valide, ces tutoriels peuvent être mis en 'DevOps' à la place
-- Changez simplement 'Docker' par 'DevOps' dans les 4 INSERT ci-dessous

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

## Avant : Image Monolithique (1.2GB)

```dockerfile
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "dist/index.js"]
```

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
    NOW() - INTERVAL '48 days',
    0,
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
      - REDIS_URL=redis://redis:6379
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

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

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
    NOW() - INTERVAL '50 days',
    0,
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
    NOW() - INTERVAL '52 days',
    0,
    19,
    'Docker Security : Hardening et Scan Vulnérabilités',
    'Sécurisez Docker. Scan vulnérabilités, hardening, distroless. Conformité audit.',
    ARRAY['docker', 'security', 'devsecops', 'hardening']
);

-- DOCKER 4: Registry
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
    0,
    21,
    'Harbor Registry Docker : Scan Vulnérabilités Automatique',
    'Registry Docker privé Harbor. Scan Trivy, policies sécurité. Conformité entreprise.',
    ARRAY['docker', 'harbor', 'registry', 'security', 'trivy']
);
