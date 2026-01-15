# Déploiement Multi-Environnements avec Terraform et Ansible

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

### Structure du Projet

```
terraform/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   │   └── ...
│   └── production/
│       └── ...
├── modules/
│   ├── vpc/
│   ├── eks/
│   ├── rds/
│   └── s3/
├── backend.tf
└── versions.tf
```

### Configuration du Backend

```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "mon-projet-terraform-state"
    key            = "env/${var.environment}/terraform.tfstate"
    region         = "eu-west-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"

    # Versionning pour rollback
    versioning = true
  }
}
```

### Module VPC

```hcl
# modules/vpc/main.tf
variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
}

variable "azs" {
  description = "Availability Zones"
  type        = list(string)
}

locals {
  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
    Project     = "mon-projet"
  }
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(local.tags, {
    Name = "${var.environment}-vpc"
  })
}

# Subnets Publics
resource "aws_subnet" "public" {
  count = length(var.azs)

  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 4, count.index)
  availability_zone       = var.azs[count.index]
  map_public_ip_on_launch = true

  tags = merge(local.tags, {
    Name                                        = "${var.environment}-public-${var.azs[count.index]}"
    "kubernetes.io/role/elb"                    = "1"
    "kubernetes.io/cluster/${var.environment}"  = "shared"
  })
}

# Subnets Privés
resource "aws_subnet" "private" {
  count = length(var.azs)

  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 4, count.index + length(var.azs))
  availability_zone = var.azs[count.index]

  tags = merge(local.tags, {
    Name                                        = "${var.environment}-private-${var.azs[count.index]}"
    "kubernetes.io/role/internal-elb"           = "1"
    "kubernetes.io/cluster/${var.environment}"  = "shared"
  })
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(local.tags, {
    Name = "${var.environment}-igw"
  })
}

# NAT Gateway
resource "aws_eip" "nat" {
  count = length(var.azs)
  vpc   = true

  tags = merge(local.tags, {
    Name = "${var.environment}-nat-eip-${count.index}"
  })
}

resource "aws_nat_gateway" "main" {
  count = length(var.azs)

  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = merge(local.tags, {
    Name = "${var.environment}-nat-${count.index}"
  })

  depends_on = [aws_internet_gateway.main]
}

# Route Tables
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = merge(local.tags, {
    Name = "${var.environment}-public-rt"
  })
}

resource "aws_route_table" "private" {
  count  = length(var.azs)
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[count.index].id
  }

  tags = merge(local.tags, {
    Name = "${var.environment}-private-rt-${count.index}"
  })
}

# Route Table Associations
resource "aws_route_table_association" "public" {
  count = length(var.azs)

  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private" {
  count = length(var.azs)

  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

# Outputs
output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_ids" {
  value = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}
```

### Module EKS

```hcl
# modules/eks/main.tf
variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "cluster_version" {
  type    = string
  default = "1.28"
}

variable "node_groups" {
  type = map(object({
    desired_size = number
    min_size     = number
    max_size     = number
    instance_types = list(string)
  }))
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = "${var.environment}-eks"
  cluster_version = var.cluster_version

  vpc_id     = var.vpc_id
  subnet_ids = var.subnet_ids

  # Cluster endpoint
  cluster_endpoint_public_access  = true
  cluster_endpoint_private_access = true

  # Addons
  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
    aws-ebs-csi-driver = {
      most_recent = true
    }
  }

  # Node groups
  eks_managed_node_groups = {
    for name, config in var.node_groups : name => {
      desired_size = config.desired_size
      min_size     = config.min_size
      max_size     = config.max_size

      instance_types = config.instance_types
      capacity_type  = "ON_DEMAND"

      labels = {
        Environment = var.environment
        NodeGroup   = name
      }

      taints = name == "spot" ? [{
        key    = "spot"
        value  = "true"
        effect = "NoSchedule"
      }] : []

      tags = {
        Environment = var.environment
        NodeGroup   = name
      }
    }
  }

  # Security
  node_security_group_additional_rules = {
    ingress_self_all = {
      description = "Node to node all traffic"
      protocol    = "-1"
      from_port   = 0
      to_port     = 0
      type        = "ingress"
      self        = true
    }
  }

  tags = {
    Environment = var.environment
    Terraform   = "true"
  }
}

output "cluster_id" {
  value = module.eks.cluster_id
}

output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "cluster_certificate_authority_data" {
  value     = module.eks.cluster_certificate_authority_data
  sensitive = true
}
```

### Configuration par Environnement

```hcl
# environments/production/main.tf
terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = "production"
      ManagedBy   = "Terraform"
      Project     = "mon-projet"
      CostCenter  = "engineering"
    }
  }
}

locals {
  environment = "production"
}

module "vpc" {
  source = "../../modules/vpc"

  environment = local.environment
  vpc_cidr    = "10.0.0.0/16"
  azs         = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]
}

module "eks" {
  source = "../../modules/eks"

  environment = local.environment
  vpc_id      = module.vpc.vpc_id
  subnet_ids  = module.vpc.private_subnet_ids

  node_groups = {
    general = {
      desired_size   = 3
      min_size       = 3
      max_size       = 10
      instance_types = ["t3.large"]
    }
    compute = {
      desired_size   = 2
      min_size       = 2
      max_size       = 20
      instance_types = ["c5.2xlarge"]
    }
  }
}

module "rds" {
  source = "../../modules/rds"

  environment         = local.environment
  vpc_id              = module.vpc.vpc_id
  subnet_ids          = module.vpc.private_subnet_ids
  instance_class      = "db.r5.xlarge"
  allocated_storage   = 100
  multi_az            = true
  backup_retention    = 30
}
```

```hcl
# environments/production/terraform.tfvars
aws_region = "eu-west-1"

# Plus de ressources pour la production
vpc_cidr = "10.0.0.0/16"

# High availability
enable_multi_az = true
enable_backup   = true
backup_retention_days = 30

# Performance
rds_instance_class = "db.r5.xlarge"
eks_node_instance_type = "c5.2xlarge"
```

```hcl
# environments/dev/terraform.tfvars
aws_region = "eu-west-1"

# Ressources minimales pour dev
vpc_cidr = "10.10.0.0/16"

# Single AZ pour économiser
enable_multi_az = false
enable_backup   = false

# Instances plus petites
rds_instance_class = "db.t3.small"
eks_node_instance_type = "t3.medium"
```

## Partie 2 : Configuration avec Ansible

### Structure Ansible

```
ansible/
├── inventories/
│   ├── dev/
│   │   ├── hosts
│   │   └── group_vars/
│   ├── staging/
│   └── production/
├── roles/
│   ├── common/
│   ├── docker/
│   ├── kubernetes/
│   └── monitoring/
├── playbooks/
│   ├── site.yml
│   ├── deploy.yml
│   └── rollback.yml
└── ansible.cfg
```

### Inventory Dynamic

```yaml
# inventories/production/aws_ec2.yml
plugin: aws_ec2

regions:
  - eu-west-1

filters:
  tag:Environment: production
  instance-state-name: running

keyed_groups:
  - key: tags.Role
    prefix: role
  - key: tags.Environment
    prefix: env

hostnames:
  - private-ip-address

compose:
  ansible_host: private_ip_address
```

### Playbook de Déploiement

```yaml
# playbooks/deploy.yml
---
- name: Deploy Application
  hosts: "{{ target_env }}"
  become: yes
  serial: "{{ rolling_update_batch | default('25%') }}"
  max_fail_percentage: 10

  pre_tasks:
    - name: Check if environment is valid
      fail:
        msg: "Invalid environment: {{ target_env }}"
      when: target_env not in ['dev', 'staging', 'production']

    - name: Wait for system to be ready
      wait_for_connection:
        timeout: 300

    - name: Gather facts
      setup:

  roles:
    - role: common
      tags: [common]

    - role: docker
      tags: [docker]
      when: container_runtime == "docker"

    - role: kubernetes
      tags: [k8s]
      when: orchestrator == "kubernetes"

  tasks:
    - name: Create application directory
      file:
        path: /opt/app
        state: directory
        owner: app
        group: app
        mode: '0755'

    - name: Deploy application configuration
      template:
        src: "templates/{{ target_env }}/app-config.yml.j2"
        dest: /opt/app/config.yml
        owner: app
        group: app
        mode: '0640'
      notify: restart application

    - name: Pull Docker image
      docker_image:
        name: "{{ docker_registry }}/{{ app_name }}:{{ app_version }}"
        source: pull
        force_source: yes

    - name: Deploy container
      docker_container:
        name: "{{ app_name }}"
        image: "{{ docker_registry }}/{{ app_name }}:{{ app_version }}"
        state: started
        restart_policy: unless-stopped
        env:
          NODE_ENV: "{{ target_env }}"
          DB_HOST: "{{ db_host }}"
          REDIS_URL: "{{ redis_url }}"
        ports:
          - "3000:3000"
        volumes:
          - /opt/app/config.yml:/app/config.yml:ro
          - /opt/app/logs:/app/logs:rw
        healthcheck:
          test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
          interval: 30s
          timeout: 10s
          retries: 3
          start_period: 40s
        labels:
          environment: "{{ target_env }}"
          version: "{{ app_version }}"
      register: container_result

    - name: Wait for application to be healthy
      uri:
        url: "http://{{ ansible_host }}:3000/health"
        status_code: 200
      retries: 10
      delay: 6

    - name: Run smoke tests
      uri:
        url: "http://{{ ansible_host }}:3000/{{ item }}"
        status_code: 200
      loop:
        - health
        - ready
        - metrics

  post_tasks:
    - name: Register deployment in monitoring
      uri:
        url: "{{ monitoring_api }}/deployments"
        method: POST
        body_format: json
        body:
          environment: "{{ target_env }}"
          version: "{{ app_version }}"
          timestamp: "{{ ansible_date_time.iso8601 }}"
          status: "success"

  handlers:
    - name: restart application
      docker_container:
        name: "{{ app_name }}"
        state: started
        restart: yes
```

### Variables par Environnement

```yaml
# inventories/production/group_vars/all.yml
---
# Application
app_name: mon-app
app_version: "{{ lookup('env', 'APP_VERSION') | default('latest', true) }}"
docker_registry: registry.example.com

# Infrastructure
target_env: production
container_runtime: docker
orchestrator: kubernetes

# Rolling update
rolling_update_batch: "25%"
max_fail_percentage: 10

# Database (depuis Vault)
db_host: "{{ vault_db_host }}"
db_port: 5432
db_name: prod_db

# Redis
redis_url: "{{ vault_redis_url }}"

# Monitoring
monitoring_api: https://monitoring.example.com/api
enable_metrics: true
enable_tracing: true

# Security
enable_tls: true
tls_cert_path: /etc/ssl/certs/app.crt
tls_key_path: /etc/ssl/private/app.key
```

```yaml
# inventories/dev/group_vars/all.yml
---
app_name: mon-app
app_version: latest
docker_registry: localhost:5000

target_env: dev
container_runtime: docker
orchestrator: docker-compose

rolling_update_batch: "100%"  # Pas de rolling update en dev

db_host: localhost
db_port: 5432
db_name: dev_db

redis_url: redis://localhost:6379

monitoring_api: http://localhost:9090
enable_metrics: false
enable_tracing: false

enable_tls: false
```

## Partie 3 : Gestion des Secrets avec Vault

### Configuration Vault

```hcl
# vault/policies/app-production.hcl
path "secret/data/production/app/*" {
  capabilities = ["read", "list"]
}

path "secret/data/production/database/*" {
  capabilities = ["read"]
}

path "aws/creds/production-app" {
  capabilities = ["read"]
}
```

### Intégration Ansible + Vault

```yaml
# playbooks/deploy.yml (avec Vault)
---
- name: Deploy with Vault Secrets
  hosts: "{{ target_env }}"
  vars:
    vault_addr: https://vault.example.com
    vault_token: "{{ lookup('env', 'VAULT_TOKEN') }}"

  tasks:
    - name: Fetch secrets from Vault
      set_fact:
        db_password: "{{ lookup('community.hashi_vault.hashi_vault', 'secret=secret/data/{{ target_env }}/database/password token={{ vault_token }} url={{ vault_addr }}') }}"
        api_key: "{{ lookup('community.hashi_vault.hashi_vault', 'secret=secret/data/{{ target_env }}/app/api_key token={{ vault_token }} url={{ vault_addr }}') }}"

    - name: Deploy application with secrets
      docker_container:
        name: "{{ app_name }}"
        image: "{{ docker_registry }}/{{ app_name }}:{{ app_version }}"
        env:
          DB_PASSWORD: "{{ db_password }}"
          API_KEY: "{{ api_key }}"
```

## Partie 4 : Pipeline de Déploiement Multi-Env

```yaml
# .github/workflows/deploy-multi-env.yml
name: Deploy Multi-Environment

on:
  push:
    branches:
      - main
      - develop
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        type: choice
        options:
          - dev
          - staging
          - production

jobs:
  # =============================
  # TERRAFORM PLAN
  # =============================
  terraform-plan:
    name: Terraform Plan
    runs-on: ubuntu-latest
    strategy:
      matrix:
        environment: [dev, staging, production]

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-1

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.6.0

      - name: Terraform Init
        working-directory: terraform/environments/${{ matrix.environment }}
        run: terraform init

      - name: Terraform Plan
        working-directory: terraform/environments/${{ matrix.environment }}
        run: |
          terraform plan -out=tfplan
          terraform show -json tfplan > plan.json

      - name: Upload plan
        uses: actions/upload-artifact@v4
        with:
          name: tfplan-${{ matrix.environment }}
          path: terraform/environments/${{ matrix.environment }}/tfplan

  # =============================
  # DEPLOY DEV
  # =============================
  deploy-dev:
    name: Deploy to Dev
    runs-on: ubuntu-latest
    needs: terraform-plan
    if: github.ref == 'refs/heads/develop'
    environment:
      name: dev
      url: https://dev.mon-app.com

    steps:
      - uses: actions/checkout@v4

      - name: Download Terraform plan
        uses: actions/download-artifact@v4
        with:
          name: tfplan-dev
          path: terraform/environments/dev

      - name: Terraform Apply
        working-directory: terraform/environments/dev
        run: terraform apply -auto-approve tfplan

      - name: Setup Ansible
        run: |
          pip3 install ansible
          ansible-galaxy collection install community.general

      - name: Deploy with Ansible
        run: |
          ansible-playbook -i inventories/dev playbooks/deploy.yml \
            -e "target_env=dev" \
            -e "app_version=${{ github.sha }}"

  # =============================
  # DEPLOY STAGING
  # =============================
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [terraform-plan, deploy-dev]
    if: github.ref == 'refs/heads/main'
    environment:
      name: staging
      url: https://staging.mon-app.com

    steps:
      - uses: actions/checkout@v4

      - name: Download Terraform plan
        uses: actions/download-artifact@v4
        with:
          name: tfplan-staging

      - name: Terraform Apply
        working-directory: terraform/environments/staging
        run: terraform apply -auto-approve tfplan

      - name: Deploy with Ansible
        run: |
          ansible-playbook -i inventories/staging playbooks/deploy.yml \
            -e "target_env=staging" \
            -e "app_version=${{ github.sha }}"

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          BASE_URL: https://staging.mon-app.com

  # =============================
  # DEPLOY PRODUCTION
  # =============================
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [deploy-staging]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://mon-app.com

    steps:
      - uses: actions/checkout@v4

      - name: Download Terraform plan
        uses: actions/download-artifact@v4
        with:
          name: tfplan-production

      - name: Terraform Apply
        working-directory: terraform/environments/production
        run: terraform apply -auto-approve tfplan

      - name: Blue-Green Deployment
        run: |
          # Deploy to Blue environment
          ansible-playbook -i inventories/production playbooks/deploy.yml \
            -e "target_env=production" \
            -e "app_version=${{ github.sha }}" \
            -e "deployment_slot=blue" \
            -e "rolling_update_batch=25%"

      - name: Smoke tests on Blue
        run: |
          ./scripts/smoke-tests.sh https://blue.mon-app.com

      - name: Switch traffic to Blue
        run: |
          ./scripts/switch-traffic.sh blue

      - name: Monitor for 5 minutes
        run: |
          ./scripts/monitor-deployment.sh 300

      - name: Rollback on failure
        if: failure()
        run: |
          ./scripts/switch-traffic.sh green
          ansible-playbook -i inventories/production playbooks/rollback.yml
```

## Partie 5 : Stratégies de Déploiement

### Blue-Green Deployment

```bash
#!/bin/bash
# scripts/blue-green-deploy.sh

ENVIRONMENT=$1
NEW_VERSION=$2
CURRENT_SLOT=$(aws elbv2 describe-target-groups \
  --names "${ENVIRONMENT}-app" \
  --query 'TargetGroups[0].Tags[?Key==`ActiveSlot`].Value' \
  --output text)

# Déterminer le nouveau slot
if [ "$CURRENT_SLOT" == "blue" ]; then
  NEW_SLOT="green"
else
  NEW_SLOT="blue"
fi

echo "Current slot: $CURRENT_SLOT"
echo "Deploying to slot: $NEW_SLOT"

# Déployer sur le nouveau slot
ansible-playbook -i inventories/$ENVIRONMENT \
  playbooks/deploy.yml \
  -e "deployment_slot=$NEW_SLOT" \
  -e "app_version=$NEW_VERSION"

# Health check
for i in {1..30}; do
  if curl -f "https://$NEW_SLOT.$ENVIRONMENT.mon-app.com/health"; then
    echo "✅ Health check passed"
    break
  fi
  sleep 10
done

# Switch traffic
echo "Switching traffic to $NEW_SLOT..."
aws elbv2 modify-listener --listener-arn $LISTENER_ARN \
  --default-actions Type=forward,TargetGroupArn=$NEW_SLOT_TG_ARN

# Tag the new active slot
aws elbv2 add-tags --resource-arns $TG_ARN \
  --tags Key=ActiveSlot,Value=$NEW_SLOT

echo "✅ Deployment completed successfully"
```

### Canary Deployment

```yaml
# k8s/canary/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-canary
spec:
  replicas: 1  # 10% du trafic
  selector:
    matchLabels:
      app: mon-app
      version: canary
  template:
    metadata:
      labels:
        app: mon-app
        version: canary
    spec:
      containers:
        - name: app
          image: mon-app:v2.0.0
---
apiVersion: v1
kind: Service
metadata:
  name: app-service
spec:
  selector:
    app: mon-app  # Sélectionne stable + canary
  ports:
    - port: 80
      targetPort: 3000
```

## Bonnes Pratiques

### ✅ À FAIRE
- ✅ Infrastructure as Code pour TOUT
- ✅ Un environnement = une branche Git
- ✅ Secrets dans Vault, jamais en dur
- ✅ Tests automatisés avant chaque déploiement
- ✅ Rollback plan toujours prêt
- ✅ Monitoring différencié par environnement
- ✅ Coûts optimisés par environnement

### ❌ À ÉVITER
- ❌ Modification manuelle des environnements
- ❌ Production identique au dev (surdimensionné)
- ❌ Déploiement direct en production
- ❌ Pas de stratégie de rollback
- ❌ Secrets partagés entre environnements

## Conclusion

Une stratégie multi-environnements solide garantit :
- ✅ Déploiements sûrs et prévisibles
- ✅ Coûts optimisés (dev < staging < prod)
- ✅ Tests exhaustifs avant production
- ✅ Rollback rapide en cas de problème
- ✅ Conformité et audit facilités

**ROI** : 0 downtime, déploiements 15x plus fréquents, coûts infra -40%

---

**Auteur** : Alice Sindayigaya - Ingénieure DevOps
**Date** : Janvier 2026
**Tags** : Terraform, Ansible, Multi-Env, IaC, AWS, DevOps
