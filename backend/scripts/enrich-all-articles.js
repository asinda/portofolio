import supabase from '../src/config/supabase.js';

// Articles enrichis avec contenu complet
const enrichedArticles = {
    'aws-architecture-3-tiers': {
        content: `# AWS : Déployer une Architecture 3-Tiers Scalable

## 🎯 Use Case : Application Web Haute Disponibilité

Votre startup SaaS doit déployer une application web qui supporte 100K utilisateurs simultanés avec 99.99% uptime. L'architecture doit être résiliente, scalable automatiquement, et distribuée sur plusieurs zones de disponibilité pour survivre à une panne datacenter.

**Contexte réel** : Une plateforme e-commerce traite 1M de transactions/jour. L'architecture 3-tiers classique (Web, App, DB) doit être hautement disponible avec autoscaling, load balancing, et disaster recovery.

## 📋 Architecture 3-Tiers sur AWS

### Composants

1. **Tier 1 - Web (Public Subnets)** : Application Load Balancer + Auto Scaling Group
2. **Tier 2 - Application (Private Subnets)** : EC2 instances avec business logic
3. **Tier 3 - Database (Private Subnets)** : RDS Multi-AZ avec read replicas

### Schéma Infrastructure

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    Internet Gateway                      │
└────────────────────┬────────────────────────────────────┘
                     │
      ┌──────────────┴──────────────┐
      │   Application Load Balancer  │  (Public)
      │         Multi-AZ             │
      └──────────────┬──────────────┘
                     │
      ┌──────────────┴──────────────┐
      │  Auto Scaling Group (Web)    │  (Public)
      │  EC2: Nginx + Static Assets  │
      └──────────────┬──────────────┘
                     │
      ┌──────────────┴──────────────┐
      │  Auto Scaling Group (App)    │  (Private)
      │  EC2: Node.js/Python/Java    │
      └──────────────┬──────────────┘
                     │
      ┌──────────────┴──────────────┐
      │  RDS Multi-AZ PostgreSQL     │  (Private)
      │  Primary + Read Replicas     │
      └─────────────────────────────┘
\`\`\`

## 🏗️ Terraform Infrastructure as Code

### vpc.tf - Réseau VPC

\`\`\`hcl
# VPC avec 3 AZ pour haute disponibilité
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "production-vpc"
    Environment = "production"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "production-igw"
  }
}

# Subnets publics (Web tier) - 3 AZ
resource "aws_subnet" "public" {
  count                   = 3
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.\${count.index + 1}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-\${count.index + 1}"
    Tier = "web"
  }
}

# Subnets privés (App tier) - 3 AZ
resource "aws_subnet" "private_app" {
  count             = 3
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.\${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "private-app-subnet-\${count.index + 1}"
    Tier = "application"
  }
}

# Subnets privés (DB tier) - 3 AZ
resource "aws_subnet" "private_db" {
  count             = 3
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.\${count.index + 20}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "private-db-subnet-\${count.index + 1}"
    Tier = "database"
  }
}

# NAT Gateway pour subnets privés
resource "aws_eip" "nat" {
  count  = 3
  domain = "vpc"

  tags = {
    Name = "nat-eip-\${count.index + 1}"
  }
}

resource "aws_nat_gateway" "main" {
  count         = 3
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = {
    Name = "nat-gateway-\${count.index + 1}"
  }
}

# Route tables
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "public-route-table"
  }
}

resource "aws_route_table" "private" {
  count  = 3
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[count.index].id
  }

  tags = {
    Name = "private-route-table-\${count.index + 1}"
  }
}
\`\`\`

### alb.tf - Application Load Balancer

\`\`\`hcl
# ALB Security Group
resource "aws_security_group" "alb" {
  name        = "alb-sg"
  description = "Security group for ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "production-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = true
  enable_http2              = true

  tags = {
    Name = "production-alb"
  }
}

# Target Group
resource "aws_lb_target_group" "app" {
  name     = "app-target-group"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 10
    timeout             = 5
    interval            = 30
    path                = "/health"
    matcher             = "200"
  }

  deregistration_delay = 30

  tags = {
    Name = "app-tg"
  }
}

# Listener HTTP (redirect to HTTPS)
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# Listener HTTPS
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
  certificate_arn   = aws_acm_certificate.main.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}
\`\`\`

### asg.tf - Auto Scaling Group

\`\`\`hcl
# Launch Template
resource "aws_launch_template" "app" {
  name_prefix   = "app-lt-"
  image_id      = data.aws_ami.amazon_linux_2.id
  instance_type = "t3.medium"

  vpc_security_group_ids = [aws_security_group.app.id]

  user_data = base64encode(<<-EOF
              #!/bin/bash
              yum update -y
              yum install -y docker
              systemctl start docker
              systemctl enable docker

              # Run app container
              docker run -d \\
                -p 3000:3000 \\
                -e DB_HOST=\${aws_db_instance.main.address} \\
                -e DB_NAME=myapp \\
                -e DB_USER=admin \\
                myapp:latest
              EOF
  )

  iam_instance_profile {
    name = aws_iam_instance_profile.app.name
  }

  monitoring {
    enabled = true
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "app-instance"
    }
  }
}

# Auto Scaling Group
resource "aws_autoscaling_group" "app" {
  name                = "app-asg"
  vpc_zone_identifier = aws_subnet.private_app[*].id
  target_group_arns   = [aws_lb_target_group.app.arn]
  health_check_type   = "ELB"
  health_check_grace_period = 300

  min_size         = 2
  max_size         = 10
  desired_capacity = 3

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "app-asg-instance"
    propagate_at_launch = true
  }
}

# Auto Scaling Policies
resource "aws_autoscaling_policy" "scale_up" {
  name                   = "scale-up"
  scaling_adjustment     = 2
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = aws_autoscaling_group.app.name
}

resource "aws_autoscaling_policy" "scale_down" {
  name                   = "scale-down"
  scaling_adjustment     = -1
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = aws_autoscaling_group.app.name
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "high-cpu-utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 120
  statistic           = "Average"
  threshold           = 80

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.app.name
  }

  alarm_actions = [aws_autoscaling_policy.scale_up.arn]
}
\`\`\`

### rds.tf - Base de Données RDS

\`\`\`hcl
# RDS Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "main-db-subnet-group"
  subnet_ids = aws_subnet.private_db[*].id

  tags = {
    Name = "main-db-subnet-group"
  }
}

# RDS Security Group
resource "aws_security_group" "rds" {
  name        = "rds-sg"
  description = "Security group for RDS"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# RDS PostgreSQL Multi-AZ
resource "aws_db_instance" "main" {
  identifier     = "production-db"
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.r6g.xlarge"

  allocated_storage     = 100
  max_allocated_storage = 1000
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = "myapp"
  username = "admin"
  password = random_password.db_password.result

  multi_az               = true
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "mon:04:00-mon:05:00"

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  deletion_protection = true
  skip_final_snapshot = false
  final_snapshot_identifier = "production-db-final-snapshot"

  performance_insights_enabled = true

  tags = {
    Name = "production-database"
  }
}

# Read Replica
resource "aws_db_instance" "replica" {
  identifier             = "production-db-replica"
  replicate_source_db    = aws_db_instance.main.identifier
  instance_class         = "db.r6g.large"
  publicly_accessible    = false
  skip_final_snapshot    = true

  tags = {
    Name = "production-database-replica"
  }
}
\`\`\`

## 🚀 Déploiement

\`\`\`bash
# Initialize Terraform
terraform init

# Plan (voir les changements)
terraform plan -out=tfplan

# Apply (déployer infrastructure)
terraform apply tfplan

# Outputs (récupérer ALB URL, RDS endpoint, etc.)
terraform output
\`\`\`

## 📊 Monitoring et Observabilité

### CloudWatch Dashboards

\`\`\`hcl
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "production-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "TargetResponseTime", { stat = "Average" }],
            [".", "RequestCount", { stat = "Sum" }],
            [".", "HTTPCode_Target_5XX_Count", { stat = "Sum" }]
          ]
          period = 300
          stat   = "Average"
          region = "eu-west-1"
          title  = "ALB Metrics"
        }
      },
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/RDS", "CPUUtilization", { stat = "Average" }],
            [".", "DatabaseConnections", { stat = "Sum" }],
            [".", "ReadLatency", { stat = "Average" }],
            [".", "WriteLatency", { stat = "Average" }]
          ]
          period = 300
          region = "eu-west-1"
          title  = "RDS Metrics"
        }
      }
    ]
  })
}
\`\`\`

## 🔒 Sécurité et Best Practices

1. **Network Isolation** : 3 tiers de subnets (public, private app, private DB)
2. **Security Groups** : Règles strictes, least privilege
3. **Encryption** : RDS encrypted at rest, SSL/TLS in transit
4. **Secrets Management** : AWS Secrets Manager pour credentials
5. **IAM Roles** : EC2 instances avec roles, pas de access keys
6. **WAF** : AWS WAF sur ALB pour protection applicative
7. **Backups** : RDS automated backups 7 jours + manual snapshots

## 🚨 Disaster Recovery

### RTO/RPO

- **RTO (Recovery Time Objective)** : <30 minutes
- **RPO (Recovery Point Objective)** : <5 minutes

### Procédure de Failover

\`\`\`bash
# RDS Multi-AZ failover automatique
# En cas de panne AZ primaire:
# 1. RDS détecte la panne (60-120 secondes)
# 2. Promeut automatiquement standby replica
# 3. Met à jour DNS endpoint
# 4. Applications reconnectent automatiquement

# ASG self-healing
# EC2 unhealthy instances automatiquement remplacées
\`\`\`

## 📈 ROI et Métriques

### Avant Architecture 3-Tiers AWS
- ⏱️ **Downtime** : 2-3 pannes/mois = 4h downtime
- 💰 **Coût** : Serveurs sur-provisionnés 24/7
- 📈 **Scaling** : Manuel, 2-3 heures
- 🔧 **Maintenance** : Nuits/weekends pour patches
- ❌ **Disponibilité** : 99.5% (43h downtime/an)

### Après Architecture 3-Tiers AWS
- ✅ **Downtime** : 0 pannes (Multi-AZ, autoscaling)
- 💰 **Coût** : -40% (autoscaling, right-sizing)
- 📈 **Scaling** : Automatique, <5 minutes
- 🔧 **Maintenance** : Zero-downtime (rolling updates)
- ✅ **Disponibilité** : 99.99% (52 minutes downtime/an)

### Métriques Business
- **Capacity** : 10K → 100K users simultanés
- **Response Time** : -60% (ALB, caching)
- **Costs** : -40% vs on-premise
- **Time to Market** : -85% (Terraform IaC)

## 🔗 Ressources

- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [AWS Reference Architectures](https://aws.amazon.com/architecture/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS Auto Scaling Best Practices](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-best-practices.html)`,
        read_time: 18
    },

    'gcp-cloud-run-serverless': {
        content: `# GCP Cloud Run : Serverless Containers Auto-Scalant

## 🎯 Use Case : API REST avec Trafic Variable (0 à 10K req/s)

Votre API REST a un trafic très variable : 0 requêtes la nuit (2h-6h), pic à 10,000 requêtes/seconde en journée. Avec des serveurs classiques, vous payez 24/7 pour gérer les pics. Avec Cloud Run, vous payez uniquement pour les requêtes effectuées, et le scaling à 0 élimine les coûts pendant les heures creuses.

**Contexte réel** : Une API de traitement d'images pour une app mobile. Trafic nul la nuit, 50K requêtes/heure en journée. Cloud Run scale automatiquement de 0 à 100 instances en quelques secondes.

## 📋 Pourquoi Cloud Run ?

### Avantages

- ✅ **Scale to Zero** : 0€ quand inutilisé
- ✅ **Auto-scaling** : 0 → 1000 instances en <30 secondes
- ✅ **Pay-per-use** : Facturation à la milliseconde
- ✅ **Fully Managed** : 0 infrastructure à gérer
- ✅ **Any Language** : Supporte tout conteneur
- ✅ **HTTPS automatique** : Certificats SSL/TLS inclus

### vs Alternatives

| Feature | Cloud Run | GKE | Cloud Functions | App Engine |
|---------|-----------|-----|-----------------|------------|
| Containers | ✅ | ✅ | ❌ | ❌ |
| Scale to 0 | ✅ | ❌ | ✅ | ⚠️ |
| Cold start | ~500ms | N/A | ~1s | ~2s |
| Max instance size | 8 vCPU 32GB | Unlimited | 8GB | 8GB |
| Management | Full | Partial | Full | Full |

## 🐳 Dockerfile Optimisé pour Cloud Run

### Exemple Node.js

\`\`\`dockerfile
# Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Build application
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Cloud Run requires listening on $PORT
ENV PORT=8080
EXPOSE 8080

# Non-root user
USER node

# Health check endpoint required
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \\
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "dist/index.js"]
\`\`\`

### Exemple Python FastAPI

\`\`\`dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Cloud Run port
ENV PORT=8080

# Non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Run with Uvicorn
CMD exec uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1
\`\`\`

## 🚀 Déploiement via gcloud CLI

### Déploiement Simple

\`\`\`bash
# Build et deploy en une commande
gcloud run deploy myapi \\
  --source . \\
  --platform managed \\
  --region europe-west1 \\
  --allow-unauthenticated

# Cloud Run build automatiquement l'image via Buildpacks ou Dockerfile
\`\`\`

### Déploiement Avancé avec Options

\`\`\`bash
gcloud run deploy myapi \\
  --image gcr.io/my-project/myapi:latest \\
  --platform managed \\
  --region europe-west1 \\
  --allow-unauthenticated \\
  --min-instances 0 \\
  --max-instances 100 \\
  --concurrency 80 \\
  --cpu 2 \\
  --memory 1Gi \\
  --timeout 300 \\
  --port 8080 \\
  --set-env-vars "NODE_ENV=production,LOG_LEVEL=info" \\
  --set-secrets "DB_PASSWORD=db-password:latest" \\
  --cpu-throttling \\
  --execution-environment gen2 \\
  --ingress all \\
  --vpc-connector my-vpc-connector \\
  --service-account myapi-sa@my-project.iam.gserviceaccount.com
\`\`\`

**Explication des options** :
- `--min-instances 0` : Scale to zero pour économiser
- `--max-instances 100` : Maximum 100 instances simultanées
- `--concurrency 80` : 80 requêtes par instance
- `--cpu 2` : 2 vCPU par instance
- `--memory 1Gi` : 1GB RAM par instance
- `--timeout 300` : Timeout 5 minutes (max)
- `--execution-environment gen2` : 2ème génération (plus rapide)
- `--vpc-connector` : Accès VPC privé (ex: Cloud SQL)

## 🏗️ Terraform Deployment

### main.tf

\`\`\`hcl
# Enable required APIs
resource "google_project_service" "run_api" {
  service = "run.googleapis.com"
}

resource "google_project_service" "iam_api" {
  service = "iam.googleapis.com"
}

# Service Account pour Cloud Run
resource "google_service_account" "cloudrun_sa" {
  account_id   = "cloudrun-sa"
  display_name = "Cloud Run Service Account"
}

# IAM pour accès Cloud SQL
resource "google_project_iam_member" "cloudsql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:\${google_service_account.cloudrun_sa.email}"
}

# Cloud Run Service
resource "google_cloud_run_service" "api" {
  name     = "myapi"
  location = "europe-west1"

  template {
    spec {
      service_account_name = google_service_account.cloudrun_sa.email

      containers {
        image = "gcr.io/\${var.project_id}/myapi:latest"

        ports {
          container_port = 8080
        }

        resources {
          limits = {
            cpu    = "2"
            memory = "1Gi"
          }
        }

        env {
          name  = "NODE_ENV"
          value = "production"
        }

        env {
          name = "DB_PASSWORD"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.db_password.secret_id
              key  = "latest"
            }
          }
        }

        # Cloud SQL connection
        env {
          name  = "DB_HOST"
          value = "/cloudsql/\${google_sql_database_instance.main.connection_name}"
        }
      }

      container_concurrency = 80
      timeout_seconds       = 300

      # Scale to zero
      scaling {
        min_instance_count = 0
        max_instance_count = 100
      }
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale"      = "100"
        "autoscaling.knative.dev/minScale"      = "0"
        "run.googleapis.com/cloudsql-instances" = google_sql_database_instance.main.connection_name
        "run.googleapis.com/cpu-throttling"     = "true"
        "run.googleapis.com/execution-environment" = "gen2"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  autogenerate_revision_name = true

  depends_on = [google_project_service.run_api]
}

# Public access
resource "google_cloud_run_service_iam_member" "public_access" {
  service  = google_cloud_run_service.api.name
  location = google_cloud_run_service.api.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Output URL
output "cloud_run_url" {
  value = google_cloud_run_service.api.status[0].url
}
\`\`\`

## 🔄 CI/CD avec GitHub Actions

\`\`\`yaml
name: Deploy to Cloud Run

on:
  push:
    branches:
      - main

env:
  PROJECT_ID: my-gcp-project
  SERVICE_NAME: myapi
  REGION: europe-west1

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - id: auth
      uses: google-github-actions/auth@v2
      with:
        credentials_json: \${{ secrets.GCP_SA_KEY }}

    - name: Set up Cloud SDK
      uses: google-github-actions/setup-gcloud@v2

    - name: Configure Docker
      run: gcloud auth configure-docker

    - name: Build image
      run: |
        docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME:$GITHUB_SHA .

    - name: Push image to GCR
      run: |
        docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:$GITHUB_SHA

    - name: Deploy to Cloud Run
      run: |
        gcloud run deploy $SERVICE_NAME \\
          --image gcr.io/$PROJECT_ID/$SERVICE_NAME:$GITHUB_SHA \\
          --platform managed \\
          --region $REGION \\
          --allow-unauthenticated \\
          --min-instances 0 \\
          --max-instances 100

    - name: Smoke test
      run: |
        URL=$(gcloud run services describe $SERVICE_NAME \\
          --region $REGION \\
          --format 'value(status.url)')

        curl -f $URL/health || exit 1
        echo "✅ Deployment successful!"
\`\`\`

## 📊 Monitoring avec Cloud Monitoring

### Métriques Importantes

\`\`\`bash
# Request count
gcloud monitoring metrics list \\
  --filter="metric.type:run.googleapis.com/request_count"

# Request latencies
gcloud monitoring metrics list \\
  --filter="metric.type:run.googleapis.com/request_latencies"

# Container instance count
gcloud monitoring metrics list \\
  --filter="metric.type:run.googleapis.com/container/instance_count"
\`\`\`

### Alertes CloudMonitoring

\`\`\`hcl
# Alert sur latence élevée
resource "google_monitoring_alert_policy" "high_latency" {
  display_name = "High Latency Alert"
  combiner     = "OR"
  conditions {
    display_name = "Request latency > 1s"
    condition_threshold {
      filter          = "resource.type = \\"cloud_run_revision\\" AND metric.type = \\"run.googleapis.com/request_latencies\\""
      duration        = "60s"
      comparison      = "COMPARISON_GT"
      threshold_value = 1000
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_MEAN"
      }
    }
  }

  notification_channels = [google_monitoring_notification_channel.email.name]
}
\`\`\`

## 🔐 Sécurité et Best Practices

### 1. Authentication avec IAM

\`\`\`bash
# Service privé (authentification requise)
gcloud run deploy myapi \\
  --no-allow-unauthenticated

# Accorder accès à un service account
gcloud run services add-iam-policy-binding myapi \\
  --region europe-west1 \\
  --member="serviceAccount:caller-sa@project.iam.gserviceaccount.com" \\
  --role="roles/run.invoker"
\`\`\`

### 2. Appel avec Token IAM

\`\`\`bash
# Obtenir token
TOKEN=$(gcloud auth print-identity-token)

# Appeler service
curl -H "Authorization: Bearer $TOKEN" \\
  https://myapi-xxx-ew.a.run.app/api/protected
\`\`\`

### 3. Secrets avec Secret Manager

\`\`\`bash
# Créer secret
echo -n "my-secret-password" | gcloud secrets create db-password --data-file=-

# Accorder accès au service account
gcloud secrets add-iam-policy-binding db-password \\
  --member="serviceAccount:cloudrun-sa@project.iam.gserviceaccount.com" \\
  --role="roles/secretmanager.secretAccessor"

# Utiliser dans Cloud Run
gcloud run deploy myapi \\
  --set-secrets="DB_PASSWORD=db-password:latest"
\`\`\`

## 🚨 Troubleshooting

### Cold Starts Lents

**Problème** : Première requête après scale to zero prend 2-3 secondes

**Solutions** :
\`\`\`bash
# 1. Utiliser min-instances pour garder au moins 1 instance warm
gcloud run services update myapi --min-instances 1

# 2. Optimiser l'image Docker (multi-stage, distroless)
# 3. Utiliser execution-environment gen2
gcloud run services update myapi \\
  --execution-environment gen2

# 4. Précharger dépendances au startup
\`\`\`

### Timeout 504

**Problème** : Requêtes longues timeout après 60s

**Solutions** :
\`\`\`bash
# Augmenter timeout (max 60 min pour gen2)
gcloud run services update myapi --timeout 600

# Pour tasks longues, utiliser Cloud Tasks + Cloud Run
\`\`\`

### Out of Memory

**Problème** : Container killed avec exit code 137

**Solutions** :
\`\`\`bash
# Augmenter mémoire
gcloud run services update myapi --memory 2Gi

# Monitoring mémoire
gcloud monitoring time-series list \\
  --filter='metric.type="run.googleapis.com/container/memory/utilizations"'
\`\`\`

## 💰 Optimisation des Coûts

### Calculateur de Coûts

**Exemple** : API avec 10M requêtes/mois, 200ms avg response time

\`\`\`
Requêtes :     10,000,000 × $0.40/million    = $4
vCPU time :    10M × 0.2s × 2 vCPU × $0.00002400 = $96
Memory time :  10M × 0.2s × 1GB × $0.00000250  = $5
Total :        $105/mois

vs VM e2-standard-2 (2 vCPU, 8GB) 24/7 : $49 + $30 (LoadBalancer) = $79/mois
Mais VM ne scale pas automatiquement et coûte même avec 0 trafic!
\`\`\`

### Stratégies d'Optimisation

1. **Scale to zero la nuit** : Économie 50% si trafic uniquement en journée
2. **Concurrency élevée** : 80-100 requêtes par instance
3. **CPU throttling** : Enable si pas CPU-intensive
4. **Request timeout** : Réduire pour éviter instances bloquées
5. **Compression** : Gzip responses pour réduire bandwidth

## 📈 ROI et Métriques

### Avant Cloud Run (VM traditionnelles)
- 💰 **Coût** : $150/mois (VM 24/7 + Load Balancer)
- ⏱️ **Scaling** : Manuel, 10-15 minutes
- 🔧 **Maintenance** : Patches OS, updates, monitoring
- 📊 **Utilisation** : 20% (over-provisioning pour pics)
- ❌ **Coût nuit** : $50/mois gaspillés (0 trafic)

### Après Cloud Run
- 💰 **Coût** : $105/mois (pay-per-use)
- ⏱️ **Scaling** : Automatique, <30 secondes
- 🔧 **Maintenance** : 0 (fully managed)
- 📊 **Utilisation** : 100% (scale to zero)
- ✅ **Coût nuit** : $0 (scale to zero)

### Métriques Business
- **Costs** : -30% vs VM
- **Time to Market** : -90% (deploy en 2 min)
- **Ops Time** : -100% (no servers to manage)
- **Scalability** : 10x (auto-scale to 1000 instances)

## 🎓 Use Cases Idéaux

✅ **Parfait pour** :
- APIs REST/GraphQL
- Webhooks
- Backend for frontend (BFF)
- Microservices
- Batch jobs (avec Cloud Tasks)
- Scheduled tasks (avec Cloud Scheduler)

❌ **Pas adapté pour** :
- Applications stateful (sessions)
- WebSockets longue durée
- Processing >60 min (utiliser Cloud Functions 2nd gen)
- GPU workloads (utiliser GKE)

## 🔗 Ressources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Run Pricing Calculator](https://cloud.google.com/products/calculator)
- [Best Practices](https://cloud.google.com/run/docs/tips)
- [Cloud Run Button](https://github.com/GoogleCloudPlatform/cloud-run-button)`,
        read_time: 16
    }

    // Je vais continuer avec les autres articles...
};

// Fonction pour mettre à jour tous les articles
async function enrichAllArticles() {
    console.log('\n🚀 ENRICHISSEMENT DE TOUS LES ARTICLES\n');
    console.log('='.repeat(80));

    let successCount = 0;
    let errorCount = 0;

    for (const [slug, data] of Object.entries(enrichedArticles)) {
        console.log(`\n📝 Traitement: ${slug}`);
        console.log(`   Longueur: ${data.content.length} caractères`);

        const { error } = await supabase
            .from('blog_posts')
            .update({
                content: data.content,
                read_time: data.read_time
            })
            .eq('slug', slug);

        if (error) {
            console.error(`   ❌ Erreur:`, error.message);
            errorCount++;
        } else {
            console.log(`   ✅ Enrichi avec succès!`);
            successCount++;
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`\n📊 RÉSUMÉ:`);
    console.log(`   ✅ Succès: ${successCount}`);
    console.log(`   ❌ Erreurs: ${errorCount}`);
    console.log(`\n✨ Traitement terminé!\n`);
}

enrichAllArticles().catch(console.error);
