-- ========================================
-- INSERTION DE 16 NOUVEAUX TUTORIELS
-- 4 par catégorie : DevOps, Cloud, Kubernetes, Docker
-- ========================================

-- Remplacez USER_ID par votre véritable user_id
-- Par exemple : '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3'
-- \set USER_ID '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3'

-- ========================================
-- CATÉGORIE : DEVOPS (4 tutoriels)
-- ========================================

-- ====================================
-- 1. Monitoring avec Prometheus & Grafana
-- ====================================
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
    'Monitoring Production avec Prometheus et Grafana',
    'monitoring-prometheus-grafana',
    $$# Monitoring Production avec Prometheus et Grafana

## 🎯 Use Case : Superviser une Application E-Commerce

Imaginez que vous gérez une boutique en ligne qui traite 10 000 commandes par jour. Sans monitoring, vous découvrirez les problèmes quand les clients se plaindront. Trop tard !

Avec Prometheus + Grafana, vous détectez les anomalies en temps réel :
- ⚡ Temps de réponse API > 500ms ? Alerte envoyée !
- 💾 Base de données à 90% ? Scale automatique !
- 🔥 CPU > 80% ? Déploiement de nouveaux pods !

## Architecture du Monitoring

```
Application (Metrics Exporter)
    ↓
Prometheus (Collecte + Stockage)
    ↓
Grafana (Visualisation)
    ↓
AlertManager (Notifications Slack/Email)
```

## Étape 1 : Installation Prometheus

**Via Docker Compose :**

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.retention.time=30d'

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana-data:/var/lib/grafana

volumes:
  prometheus-data:
  grafana-data:
```

**Configuration Prometheus (prometheus.yml) :**

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

# Alertes
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

# Règles d'alertes
rule_files:
  - "alerts.yml"

# Cibles à scraper
scrape_configs:
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'my-app'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['my-app:8080']

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']
```

## Étape 2 : Instrumenter votre Application

**Node.js avec prom-client :**

```javascript
import express from 'express';
import promClient from 'prom-client';

const app = express();

// Créer un registre pour les métriques
const register = new promClient.Register();
promClient.collectDefaultMetrics({ register });

// Métriques custom
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Durée des requêtes HTTP',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 1, 3, 5, 10]
});
register.registerMetric(httpRequestDuration);

const ordersTotal = new promClient.Counter({
  name: 'orders_total',
  help: 'Nombre total de commandes'
});
register.registerMetric(ordersTotal);

// Middleware pour mesurer les requêtes
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode
    });
  });
  next();
});

// Endpoint /metrics pour Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Routes business
app.post('/api/orders', (req, res) => {
  ordersTotal.inc();
  res.json({ success: true });
});

app.listen(8080);
```

## Étape 3 : Créer des Dashboards Grafana

### Dashboard "Vue d'ensemble Application"

**Panneau 1 : Requests Per Second (RPS)**

```promql
rate(http_requests_total[5m])
```

**Panneau 2 : Latence P95**

```promql
histogram_quantile(0.95,
  rate(http_request_duration_seconds_bucket[5m])
)
```

**Panneau 3 : Taux d'erreur**

```promql
rate(http_requests_total{status=~"5.."}[5m])
/ rate(http_requests_total[5m]) * 100
```

**Panneau 4 : Commandes par minute**

```promql
rate(orders_total[1m]) * 60
```

## Étape 4 : Alertes Intelligentes

**Fichier alerts.yml :**

```yaml
groups:
  - name: production_alerts
    interval: 30s
    rules:
      # Alerte latence élevée
      - alert: HighLatency
        expr: |
          histogram_quantile(0.95,
            rate(http_request_duration_seconds_bucket[5m])
          ) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Latence élevée détectée"
          description: "P95 latency is {{ $value }}s (threshold: 1s)"

      # Alerte taux d'erreur
      - alert: HighErrorRate
        expr: |
          rate(http_requests_total{status=~"5.."}[5m])
          / rate(http_requests_total[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Taux d'erreur élevé : {{ $value | humanizePercentage }}"

      # Alerte disque plein
      - alert: DiskAlmostFull
        expr: |
          (node_filesystem_avail_bytes / node_filesystem_size_bytes) < 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Disque presque plein : {{ $value | humanizePercentage }} restant"
```

## Use Case Réel : Black Friday

**Contexte :** Votre e-commerce fait x10 de trafic pendant le Black Friday.

**Sans monitoring :**
- ❌ Latence monte à 10s → Clients partent
- ❌ Base de données surchargée → Site down
- ❌ Découverte du problème après 2h → Pertes financières importantes

**Avec monitoring :**
- ✅ **11h23** : Alerte latence élevée détectée
- ✅ **11h24** : Auto-scaling Kubernetes activé (pods x3)
- ✅ **11h25** : Latence revenue à 200ms
- ✅ **11h30** : Alerte base de données → Read replicas ajoutés
- ✅ **Résultat** : 0 downtime, satisfaction client 100%

## Métriques Clés à Monitorer

### Pour une API REST

| Métrique | Alerte si |
|----------|-----------|
| P95 Latency | > 500ms |
| Error rate | > 1% |
| RPS | Variation > 50% |
| CPU usage | > 80% |
| Memory | > 85% |
| DB connections | > 90% du pool |

## Conclusion

Le monitoring n'est pas optionnel en production. Avec Prometheus + Grafana, vous passez de la réaction (éteindre les incendies) à l'anticipation (prévenir les incendies).

**ROI :** Détection 100x plus rapide, coûts downtime -95%, sommeil retrouvé 😴

---

**Auteur** : Alice Sindayigaya - Ingénieure DevOps
**Date** : Janvier 2026
**Tags** : Monitoring, Prometheus, Grafana, AlertManager, DevOps$$,
    'Apprenez à mettre en place un système de monitoring production complet avec Prometheus et Grafana. Détectez les anomalies en temps réel avec des alertes intelligentes et des dashboards interactifs.',
    '/images/tutorials/devops-monitoring.svg',
    'DevOps',
    ARRAY['Prometheus', 'Grafana', 'Monitoring', 'DevOps', 'AlertManager', 'Observability'],
    'published',
    NOW() - INTERVAL '5 days',
    0,
    20,
    'Monitoring Production : Prometheus + Grafana - Guide Complet',
    'Système de monitoring complet avec Prometheus et Grafana. Métriques, alertes, dashboards. Détection anomalies en temps réel. Use case e-commerce Black Friday.',
    ARRAY['prometheus', 'grafana', 'monitoring', 'devops', 'alertmanager', 'observability', 'metrics', 'dashboards']
);

-- ====================================
-- 2. Logs centralisés avec ELK Stack
-- ====================================
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
    'Logs Centralisés avec ELK Stack (Elasticsearch, Logstash, Kibana)',
    'elk-stack-logs-centralises',
    $$# Logs Centralisés avec ELK Stack

## 🎯 Use Case : Déboguer un Bug en Production

Il est 3h du matin. Votre application plante en production. Vous avez 50 serveurs qui génèrent des logs. Comment trouver la cause ?

**Sans ELK :**
- ❌ SSH sur 50 serveurs, un par un
- ❌ grep dans des fichiers de 10 GB
- ❌ Corrélation manuelle entre services
- ❌ **Temps de résolution : 4 heures**

**Avec ELK :**
- ✅ Recherche full-text en 0.2s
- ✅ Filtres par service, niveau, timestamps
- ✅ Traçabilité complète (trace_id)
- ✅ **Temps de résolution : 10 minutes**

## Architecture ELK

```
Applications (JSON Logs)
    ↓
Filebeat (Shipping)
    ↓
Logstash (Processing + Enrichment)
    ↓
Elasticsearch (Storage + Search)
    ↓
Kibana (Visualization)
```

## Installation via Docker Compose

```yaml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms2g -Xmx2g"
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - es-data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    ports:
      - "5044:5044"
      - "9600:9600"
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch

  filebeat:
    image: docker.elastic.co/beats/filebeat:8.11.0
    user: root
    volumes:
      - ./filebeat/filebeat.yml:/usr/share/filebeat/filebeat.yml
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    depends_on:
      - logstash

volumes:
  es-data:
```

## Configuration Logstash

**Fichier logstash/pipeline/logstash.conf :**

```ruby
input {
  beats {
    port => 5044
  }
}

filter {
  # Parser les logs JSON
  json {
    source => "message"
  }

  # Extraire le timestamp
  date {
    match => [ "timestamp", "ISO8601" ]
    target => "@timestamp"
  }

  # Ajouter géolocalisation (si IP présente)
  geoip {
    source => "client_ip"
    target => "geoip"
  }

  # Enrichir avec metadata
  mutate {
    add_field => {
      "environment" => "%{[kubernetes][namespace]}"
      "app_version" => "%{[labels][version]}"
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "logs-%{[service]}}-%{+YYYY.MM.dd}"
  }

  # Debug output (optionnel)
  stdout {
    codec => rubydebug
  }
}
```

## Formater vos Logs (Structured Logging)

**❌ MAUVAIS : Logs non structurés**

```javascript
console.log('User 123 logged in from 192.168.1.1');
console.log('Error connecting to database');
```

**✅ BON : Logs structurés JSON**

```javascript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label })
  },
  timestamp: () => `,"timestamp":"${new Date().toISOString()}"`
});

// Log structuré
logger.info({
  event: 'user_login',
  user_id: 123,
  ip: '192.168.1.1',
  trace_id: req.headers['x-trace-id']
}, 'User logged in successfully');

// Log erreur
logger.error({
  event: 'database_error',
  error: error.message,
  stack: error.stack,
  query: 'SELECT * FROM users',
  trace_id: req.headers['x-trace-id']
}, 'Database connection failed');
```

## Créer des Visualisations Kibana

### 1. Recherche simple

```
service:api AND level:error AND @timestamp:[now-1h TO now]
```

### 2. Dashboard "Erreurs par Service"

**Aggregation :**
```json
{
  "aggs": {
    "errors_by_service": {
      "terms": { "field": "service.keyword", "size": 10 },
      "aggs": {
        "error_count": {
          "value_count": { "field": "level.keyword" }
        }
      }
    }
  }
}
```

### 3. Traçabilité Distribuée

**Recherche par trace_id :**

```
trace_id:"550e8400-e29b-41d4-a716-446655440000"
```

Vous verrez tous les logs de tous les services pour cette requête !

## Use Case Réel : Bug Mystérieux

**Problème :** Les utilisateurs se plaignent de timeouts aléatoires.

**Investigation avec Kibana :**

1. **Filtrer les erreurs récentes :**
   `level:error AND @timestamp:[now-30m TO now]`

2. **Grouper par service :**
   → 80% des erreurs viennent du service `payment-api`

3. **Regarder les logs détaillés :**
   ```
   service:payment-api AND level:error
   ```

4. **Découverte :** Connexions PostgreSQL qui ne se ferment pas !
   ```json
   {
     "error": "too many clients already",
     "active_connections": 100,
     "max_connections": 100
   }
   ```

5. **Solution :** Augmenter le pool de connexions + ajouter connection timeouts

6. **Vérification :** Plus d'erreurs dans les 5 dernières minutes !
   **Temps total : 12 minutes au lieu de 4 heures**

## Alertes Automatiques

**Alerte si > 100 erreurs/min :**

```json
{
  "trigger": {
    "schedule": { "interval": "1m" }
  },
  "input": {
    "search": {
      "request": {
        "indices": ["logs-*"],
        "body": {
          "query": {
            "bool": {
              "must": [
                { "match": { "level": "error" }},
                { "range": { "@timestamp": { "gte": "now-1m" }}}
              ]
            }
          }
        }
      }
    }
  },
  "condition": {
    "compare": { "ctx.payload.hits.total": { "gt": 100 }}
  },
  "actions": {
    "send_slack": {
      "webhook": {
        "url": "https://hooks.slack.com/...",
        "body": "⚠️ Alert: {{ ctx.payload.hits.total }} errors in the last minute!"
      }
    }
  }
}
```

## Conclusion

ELK transforme le debugging en production. Plus besoin de SSH, grep, ou prières.

**ROI :**
- Temps de résolution : -90%
- MTTR (Mean Time To Repair) : 10 min au lieu de 4h
- Satisfaction devs : 📈

---

**Auteur** : Alice Sindayigaya
**Tags** : ELK, Elasticsearch, Logstash, Kibana, Logs, DevOps$$,
    'Mettez en place une plateforme de logs centralisés avec ELK Stack. Recherche full-text ultra-rapide, traçabilité distribuée, alertes automatiques. Déboguez 10x plus vite !',
    '/images/tutorials/devops-elk.svg',
    'DevOps',
    ARRAY['ELK', 'Elasticsearch', 'Logstash', 'Kibana', 'Logs', 'DevOps', 'Observability'],
    'published',
    NOW() - INTERVAL '10 days',
    0,
    25,
    'ELK Stack : Logs Centralisés - Guide Pratique',
    'Plateforme de logs centralisés avec ELK Stack. Recherche full-text, traçabilité distribuée, alertes. Déboguez en 10 minutes au lieu de 4 heures.',
    ARRAY['elk stack', 'elasticsearch', 'logstash', 'kibana', 'logs', 'devops', 'observability', 'debugging']
);

-- ====================================
-- 3. Infrastructure as Code avec Terraform
-- ====================================
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
    'Infrastructure as Code avec Terraform : Déploiement Multi-Environnements',
    'terraform-infrastructure-as-code',
    $$# Infrastructure as Code avec Terraform

## 🎯 Use Case : Déployer 3 Environnements Identiques en 5 Minutes

Vous devez créer 3 environnements (dev, staging, production) avec :
- 3 VPCs AWS
- 6 EC2 instances
- 3 RDS PostgreSQL
- 3 Load Balancers
- Sécurité, monitoring, backups

**Manuellement :** 3 jours + risque d'erreurs humaines
**Avec Terraform :** 5 minutes, reproductible, versionné !

## Pourquoi l'Infrastructure as Code ?

### ❌ Sans IaC (Configuration Manuelle)
- Cliquer dans la console AWS pendant des heures
- Documentation obsolète
- Impossible de reproduire l'environnement
- Drift entre dev et production

### ✅ Avec Terraform
- Code versionné dans Git
- Déploiements reproductibles
- Rollback facile
- Review de code pour l'infra !

## Installation Terraform

```bash
# macOS
brew install terraform

# Linux
wget https://releases.hashicorp.com/terraform/1.7.0/terraform_1.7.0_linux_amd64.zip
unzip terraform_1.7.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Vérifier
terraform version
# Terraform v1.7.0
```

## Structure de Projet Terraform

```
terraform/
├── main.tf              # Ressources principales
├── variables.tf         # Variables d'entrée
├── outputs.tf           # Valeurs de sortie
├── terraform.tfvars     # Valeurs des variables
├── modules/
│   ├── vpc/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── ec2/
│   └── rds/
└── environments/
    ├── dev.tfvars
    ├── staging.tfvars
    └── prod.tfvars
```

## Exemple Complet : Application 3-Tiers

### 1. Configuration Provider (main.tf)

```hcl
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Backend S3 pour state partagé
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "app/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}
```

### 2. Variables (variables.tf)

```hcl
variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "eu-west-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "my-app"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
}
```

### 3. Module VPC (modules/vpc/main.tf)

```hcl
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_name}-vpc-${var.environment}"
  }
}

resource "aws_subnet" "public" {
  count = 2

  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 4, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-${count.index + 1}-${var.environment}"
  }
}

resource "aws_subnet" "private" {
  count = 2

  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 4, count.index + 2)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "${var.project_name}-private-${count.index + 1}-${var.environment}"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw-${var.environment}"
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}
```

### 4. Module EC2 (modules/ec2/main.tf)

```hcl
resource "aws_security_group" "web" {
  name        = "${var.project_name}-web-sg-${var.environment}"
  description = "Security group for web servers"
  vpc_id      = var.vpc_id

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

resource "aws_instance" "web" {
  count = var.instance_count

  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  subnet_id     = var.subnet_ids[count.index % length(var.subnet_ids)]

  vpc_security_group_ids = [aws_security_group.web.id]

  user_data = templatefile("${path.module}/user_data.sh", {
    environment = var.environment
  })

  tags = {
    Name = "${var.project_name}-web-${count.index + 1}-${var.environment}"
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}
```

### 5. Fichiers de Variables par Environnement

**environments/dev.tfvars :**

```hcl
environment       = "dev"
vpc_cidr          = "10.0.0.0/16"
instance_type     = "t3.micro"
instance_count    = 1
db_instance_class = "db.t3.micro"
```

**environments/prod.tfvars :**

```hcl
environment       = "prod"
vpc_cidr          = "10.1.0.0/16"
instance_type     = "t3.large"
instance_count    = 3
db_instance_class = "db.r6g.xlarge"
```

## Commandes Terraform

### Initialiser

```bash
terraform init
```

### Planifier (Dry-run)

```bash
# Dev
terraform plan -var-file=environments/dev.tfvars

# Prod
terraform plan -var-file=environments/prod.tfvars
```

### Appliquer

```bash
# Dev
terraform apply -var-file=environments/dev.tfvars

# Prod (avec confirmation)
terraform apply -var-file=environments/prod.tfvars
```

### Détruire

```bash
terraform destroy -var-file=environments/dev.tfvars
```

## Use Case Réel : Migration Datacenter → Cloud

**Contexte :** Startup avec infra on-premise à migrer vers AWS.

**Étapes :**

1. **Inventaire infra existante**
   - 5 serveurs web
   - 2 bases de données
   - 1 load balancer

2. **Coder l'infra en Terraform** (1 semaine)

3. **Déployer environnement de test** (5 minutes)
   ```bash
   terraform apply -var-file=environments/test.tfvars
   ```

4. **Valider avec équipe**

5. **Déployer production** (5 minutes)
   ```bash
   terraform apply -var-file=environments/prod.tfvars
   ```

6. **Résultat :**
   - Migration complétée en 2 semaines
   - Infrastructure reproductible
   - Rollback possible en 5 minutes

## Bonnes Pratiques

### 1. État Distant (Remote State)

```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "app/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

### 2. Modules Réutilisables

Ne répétez pas le code ! Créez des modules.

```hcl
module "vpc_dev" {
  source = "./modules/vpc"

  environment  = "dev"
  vpc_cidr     = "10.0.0.0/16"
  project_name = "my-app"
}

module "vpc_prod" {
  source = "./modules/vpc"

  environment  = "prod"
  vpc_cidr     = "10.1.0.0/16"
  project_name = "my-app"
}
```

### 3. Outputs pour Interconnexion

```hcl
output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = aws_subnet.public[*].id
}
```

## Conclusion

Terraform transforme l'infrastructure en code. Plus de clics, plus d'erreurs humaines, juste du code versionné et reproductible.

**ROI :**
- Déploiements : 100x plus rapides
- Erreurs : -95%
- Documentation toujours à jour (c'est le code !)

---

**Auteur** : Alice Sindayigaya
**Tags** : Terraform, IaC, AWS, DevOps, Automation$$,
    'Maîtrisez l''Infrastructure as Code avec Terraform. Déployez des environnements complets en 5 minutes. Architecture multi-environnements, modules réutilisables, state management.',
    '/images/tutorials/devops-terraform.svg',
    'DevOps',
    ARRAY['Terraform', 'IaC', 'AWS', 'DevOps', 'Automation', 'Infrastructure'],
    'published',
    NOW() - INTERVAL '15 days',
    0,
    22,
    'Terraform : Infrastructure as Code - Guide Complet Multi-Environnements',
    'Déployez des infrastructures complètes avec Terraform. Modules réutilisables, multi-environnements, state management. Du dev à la prod en 5 minutes.',
    ARRAY['terraform', 'iac', 'infrastructure as code', 'aws', 'devops', 'automation']
);

-- ====================================
-- 4. Configuration Management avec Ansible
-- ====================================
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
    'Ansible : Provisionner 100 Serveurs en 10 Minutes',
    'ansible-configuration-management',
    $$# Ansible : Configuration Management à Grande Échelle

## 🎯 Use Case : Provisionner 100 Serveurs

Votre startup explose. Vous passez de 5 à 100 serveurs. Il faut installer :
- Node.js + PM2
- Nginx
- PostgreSQL client
- Monitoring agents
- Certificats SSL
- Configurations spécifiques

**Manuellement :** 2 semaines + erreurs garanties
**Avec Ansible :** 10 minutes, zéro erreur, reproductible !

## Qu'est-ce qu'Ansible ?

Ansible est un outil d'automatisation qui configure vos serveurs via SSH. Pas d'agent à installer, juste du YAML.

### Avantages

✅ **Agentless** : SSH uniquement, pas de daemon à installer
✅ **Idempotent** : Exécuter 10x = même résultat qu'1x
✅ **YAML simple** : Pas de code compliqué
✅ **Inventaire dynamique** : AWS, Azure, GCP auto-discovery

## Installation

```bash
# macOS
brew install ansible

# Linux
sudo apt install ansible -y

# Python pip
pip install ansible

# Vérifier
ansible --version
# ansible [core 2.16.0]
```

## Structure de Projet Ansible

```
ansible/
├── ansible.cfg           # Configuration globale
├── inventory/
│   ├── hosts.yml         # Inventaire statique
│   └── aws_ec2.yml       # Inventaire dynamique AWS
├── group_vars/
│   ├── all.yml           # Variables communes
│   ├── webservers.yml
│   └── databases.yml
├── roles/
│   ├── common/
│   │   ├── tasks/main.yml
│   │   ├── handlers/main.yml
│   │   └── templates/
│   ├── nginx/
│   ├── nodejs/
│   └── postgresql/
└── playbooks/
    ├── site.yml          # Playbook principal
    ├── deploy.yml
    └── rollback.yml
```

## Inventaire : Définir vos Serveurs

### Inventaire Statique (inventory/hosts.yml)

```yaml
all:
  children:
    webservers:
      hosts:
        web1:
          ansible_host: 192.168.1.10
        web2:
          ansible_host: 192.168.1.11
        web3:
          ansible_host: 192.168.1.12
      vars:
        ansible_user: ubuntu
        ansible_ssh_private_key_file: ~/.ssh/id_rsa

    databases:
      hosts:
        db1:
          ansible_host: 192.168.1.20
        db2:
          ansible_host: 192.168.1.21
      vars:
        ansible_user: ubuntu
        postgresql_version: 15

    monitoring:
      hosts:
        prometheus:
          ansible_host: 192.168.1.30
```

### Inventaire Dynamique AWS (inventory/aws_ec2.yml)

```yaml
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
```

## Playbook : Provisionner des Serveurs Web

### playbooks/site.yml

```yaml
---
- name: Configure All Servers
  hosts: all
  become: yes

  roles:
    - common
    - security

- name: Configure Web Servers
  hosts: webservers
  become: yes

  roles:
    - nodejs
    - nginx
    - pm2

- name: Configure Databases
  hosts: databases
  become: yes

  roles:
    - postgresql
    - backup
```

## Rôle : Installation Node.js

### roles/nodejs/tasks/main.yml

```yaml
---
- name: Add NodeSource repository
  shell: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  args:
    creates: /etc/apt/sources.list.d/nodesource.list

- name: Install Node.js
  apt:
    name: nodejs
    state: present
    update_cache: yes

- name: Verify Node.js version
  command: node --version
  register: node_version
  changed_when: false

- name: Display Node.js version
  debug:
    msg: "Node.js version: {{ node_version.stdout }}"

- name: Install global npm packages
  npm:
    name: "{{ item }}"
    global: yes
    state: present
  loop:
    - pm2
    - yarn
```

## Rôle : Configuration Nginx

### roles/nginx/tasks/main.yml

```yaml
---
- name: Install Nginx
  apt:
    name: nginx
    state: present
    update_cache: yes

- name: Remove default site
  file:
    path: /etc/nginx/sites-enabled/default
    state: absent
  notify: Reload Nginx

- name: Create site configuration
  template:
    src: site.conf.j2
    dest: "/etc/nginx/sites-available/{{ app_name }}"
    owner: root
    group: root
    mode: '0644'
  notify: Reload Nginx

- name: Enable site
  file:
    src: "/etc/nginx/sites-available/{{ app_name }}"
    dest: "/etc/nginx/sites-enabled/{{ app_name }}"
    state: link
  notify: Reload Nginx

- name: Start and enable Nginx
  service:
    name: nginx
    state: started
    enabled: yes
```

### roles/nginx/templates/site.conf.j2

```nginx
upstream {{ app_name }} {
  {% for host in groups['webservers'] %}
  server {{ hostvars[host]['ansible_host'] }}:{{ app_port }};
  {% endfor %}
}

server {
  listen 80;
  server_name {{ domain_name }};

  location / {
    proxy_pass http://{{ app_name }};
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
  }
}
```

### roles/nginx/handlers/main.yml

```yaml
---
- name: Reload Nginx
  service:
    name: nginx
    state: reloaded
```

## Variables

### group_vars/all.yml

```yaml
---
app_name: my-app
app_port: 3000
domain_name: example.com
nodejs_version: 20
```

### group_vars/webservers.yml

```yaml
---
max_connections: 1000
worker_processes: auto
```

## Exécuter un Playbook

```bash
# Vérifier la syntaxe
ansible-playbook playbooks/site.yml --syntax-check

# Dry-run (ne modifie rien)
ansible-playbook playbooks/site.yml --check

# Exécuter
ansible-playbook playbooks/site.yml

# Exécuter sur un groupe spécifique
ansible-playbook playbooks/site.yml --limit webservers

# Avec verbosité
ansible-playbook playbooks/site.yml -vvv
```

## Commandes Ad-Hoc

```bash
# Ping tous les serveurs
ansible all -m ping

# Vérifier l'espace disque
ansible all -m shell -a "df -h"

# Redémarrer Nginx sur tous les web servers
ansible webservers -m service -a "name=nginx state=restarted" --become

# Mettre à jour tous les serveurs
ansible all -m apt -a "upgrade=dist update_cache=yes" --become

# Copier un fichier
ansible webservers -m copy -a "src=app.conf dest=/etc/myapp/app.conf" --become
```

## Use Case Réel : Scaling Black Friday

**Contexte :** E-commerce, préparation Black Friday. Besoin de 50 serveurs web supplémentaires.

**Avec Ansible :**

1. **Lancer 50 EC2 instances** (via Terraform)

2. **Inventaire dynamique** récupère les IPs automatiquement

3. **Provisionner en une commande**
   ```bash
   ansible-playbook playbooks/site.yml --limit "role_webserver"
   ```

4. **10 minutes plus tard :**
   - Node.js installé
   - Application déployée
   - Nginx configuré
   - SSL activé
   - Monitoring en place

5. **Après Black Friday, détruire**
   ```bash
   terraform destroy
   ```

**Résultat :** Infrastructure éphémère, coût optimisé, zéro stress !

## Bonnes Pratiques

### 1. Idempotence

Vos tasks doivent être idempotentes :

```yaml
# ❌ MAUVAIS : Toujours exécuté
- name: Add line to config
  shell: echo "config=value" >> /etc/myapp/config

# ✅ BON : Idempotent
- name: Set config value
  lineinfile:
    path: /etc/myapp/config
    line: "config=value"
    create: yes
```

### 2. Utiliser des Rôles

Ne mettez pas tout dans un seul playbook. Créez des rôles réutilisables.

### 3. Secrets avec Ansible Vault

```bash
# Créer un fichier chiffré
ansible-vault create group_vars/prod/secrets.yml

# Éditer
ansible-vault edit group_vars/prod/secrets.yml

# Exécuter avec vault password
ansible-playbook site.yml --ask-vault-pass
```

### 4. Tags pour Exécution Partielle

```yaml
- name: Install packages
  apt:
    name: "{{ item }}"
    state: present
  loop: "{{ packages }}"
  tags:
    - packages
    - install
```

```bash
# Exécuter seulement les tasks avec tag "install"
ansible-playbook site.yml --tags install
```

## Conclusion

Ansible transforme l'administration système. Fini SSH manuel, scripts bash fragiles, documentation obsolète.

**ROI :**
- Provisionner 100 serveurs : 10 minutes
- Configuration reproductible : 100%
- Erreurs humaines : -99%

---

**Auteur** : Alice Sindayigaya
**Tags** : Ansible, Automation, DevOps, Configuration Management$$,
    'Automatisez la configuration de vos serveurs avec Ansible. Provisionner 100 serveurs en 10 minutes. Playbooks, rôles, inventaires dynamiques. Zéro agent, 100% SSH.',
    '/images/tutorials/devops-ansible.svg',
    'DevOps',
    ARRAY['Ansible', 'Automation', 'DevOps', 'Configuration Management', 'SSH'],
    'published',
    NOW() - INTERVAL '20 days',
    0,
    28,
    'Ansible : Configuration Management - Provisionner 100 Serveurs en 10 Minutes',
    'Maîtrisez Ansible pour automatiser vos serveurs. Playbooks, rôles, inventaires dynamiques. Provisionner 100 serveurs en 10 minutes, zéro erreur.',
    ARRAY['ansible', 'automation', 'devops', 'configuration management', 'ssh', 'provisioning']
);

-- ========================================
-- CATÉGORIE : CLOUD (4 tutoriels)
-- ========================================

-- ====================================
-- 1. AWS : Architecture 3-Tiers Scalable
-- ====================================
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
    'AWS : Déployer une Architecture 3-Tiers Scalable',
    'aws-architecture-3-tiers',
    $$# AWS : Architecture 3-Tiers Production-Ready

## 🎯 Use Case : Application E-Commerce Haute Disponibilité

Vous lancez une boutique en ligne. Objectif : supporter 100 000 utilisateurs simultanés pendant les soldes, avec 99.99% uptime.

**Architecture requise :**
- Frontend (Web) : React SPA sur CloudFront + S3
- Backend (API) : EC2 Auto-scaling derrière ALB
- Base de données : RDS PostgreSQL Multi-AZ
- Cache : ElastiCache Redis
- Stockage fichiers : S3
- CDN : CloudFront

**Sans architecture 3-tiers :** Site down après 1000 utilisateurs
**Avec architecture scalable :** 100K utilisateurs, latence < 100ms

## Architecture 3-Tiers AWS

```
┌─────────────────────────────────────────────────────┐
│                   INTERNET                           │
└───────────────────┬─────────────────────────────────┘
                    │
          ┌─────────▼──────────┐
          │   Route 53 (DNS)   │
          └─────────┬──────────┘
                    │
          ┌─────────▼──────────┐
          │   CloudFront (CDN)  │
          └─────────┬──────────┘
                    │
    ┌───────────────┴───────────────┐
    │                               │
┌───▼────┐                   ┌──────▼──────┐
│   S3   │                   │     ALB     │
│(Static)│                   │(Load Balancer)│
└────────┘                   └──────┬──────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
            ┌───────▼────────┐          ┌───────▼────────┐
            │  EC2 (AZ-1)     │          │  EC2 (AZ-2)     │
            │  Auto-Scaling   │          │  Auto-Scaling   │
            └───────┬─────────┘          └───────┬─────────┘
                    │                            │
                    └────────────┬───────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    ElastiCache Redis    │
                    │       (Cache)           │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   RDS PostgreSQL        │
                    │   Multi-AZ (Primary)    │
                    │   + Read Replica        │
                    └─────────────────────────┘
```

## Étape 1 : VPC et Réseaux

### Créer le VPC

```bash
# Variables
VPC_CIDR="10.0.0.0/16"
REGION="eu-west-1"

# Créer VPC
VPC_ID=$(aws ec2 create-vpc \
    --cidr-block $VPC_CIDR \
    --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=my-app-vpc}]' \
    --query 'Vpc.VpcId' --output text)

# Activer DNS
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-support
```

### Créer les Subnets (6 subnets : 2 public, 2 privé app, 2 privé DB)

```bash
# Subnet Public AZ-1
PUBLIC_SUBNET_1=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block 10.0.1.0/24 \
    --availability-zone eu-west-1a \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=public-az1}]' \
    --query 'Subnet.SubnetId' --output text)

# Subnet Public AZ-2
PUBLIC_SUBNET_2=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block 10.0.2.0/24 \
    --availability-zone eu-west-1b \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=public-az2}]' \
    --query 'Subnet.SubnetId' --output text)

# Subnet Privé App AZ-1
PRIVATE_APP_SUBNET_1=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block 10.0.11.0/24 \
    --availability-zone eu-west-1a \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=private-app-az1}]' \
    --query 'Subnet.SubnetId' --output text)

# Subnet Privé App AZ-2
PRIVATE_APP_SUBNET_2=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block 10.0.12.0/24 \
    --availability-zone eu-west-1b \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=private-app-az2}]' \
    --query 'Subnet.SubnetId' --output text)

# Subnet Privé DB AZ-1
PRIVATE_DB_SUBNET_1=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block 10.0.21.0/24 \
    --availability-zone eu-west-1a \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=private-db-az1}]' \
    --query 'Subnet.SubnetId' --output text)

# Subnet Privé DB AZ-2
PRIVATE_DB_SUBNET_2=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block 10.0.22.0/24 \
    --availability-zone eu-west-1b \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=private-db-az2}]' \
    --query 'Subnet.SubnetId' --output text)
```

### Internet Gateway et NAT Gateway

```bash
# Internet Gateway (pour subnets publics)
IGW_ID=$(aws ec2 create-internet-gateway \
    --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=my-igw}]' \
    --query 'InternetGateway.InternetGatewayId' --output text)

aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID

# NAT Gateway (pour subnets privés)
EIP_ID=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)

NAT_GW_ID=$(aws ec2 create-nat-gateway \
    --subnet-id $PUBLIC_SUBNET_1 \
    --allocation-id $EIP_ID \
    --tag-specifications 'ResourceType=natgateway,Tags=[{Key=Name,Value=my-nat}]' \
    --query 'NatGateway.NatGatewayId' --output text)
```

## Étape 2 : RDS PostgreSQL Multi-AZ

```bash
# Créer DB Subnet Group
aws rds create-db-subnet-group \
    --db-subnet-group-name my-app-db-subnet \
    --db-subnet-group-description "DB subnet group" \
    --subnet-ids $PRIVATE_DB_SUBNET_1 $PRIVATE_DB_SUBNET_2

# Créer RDS PostgreSQL
aws rds create-db-instance \
    --db-instance-identifier my-app-db \
    --db-instance-class db.t3.medium \
    --engine postgres \
    --engine-version 15.4 \
    --master-username admin \
    --master-user-password YourSecurePassword123! \
    --allocated-storage 100 \
    --storage-type gp3 \
    --db-subnet-group-name my-app-db-subnet \
    --vpc-security-group-ids $DB_SECURITY_GROUP_ID \
    --backup-retention-period 7 \
    --multi-az \
    --publicly-accessible false \
    --enable-cloudwatch-logs-exports '["postgresql"]'
```

## Étape 3 : ElastiCache Redis

```bash
# Créer Cache Subnet Group
aws elasticache create-cache-subnet-group \
    --cache-subnet-group-name my-app-cache-subnet \
    --cache-subnet-group-description "Cache subnet group" \
    --subnet-ids $PRIVATE_APP_SUBNET_1 $PRIVATE_APP_SUBNET_2

# Créer ElastiCache Redis
aws elasticache create-replication-group \
    --replication-group-id my-app-redis \
    --replication-group-description "Redis for my app" \
    --engine redis \
    --cache-node-type cache.t3.micro \
    --num-cache-clusters 2 \
    --automatic-failover-enabled \
    --cache-subnet-group-name my-app-cache-subnet \
    --security-group-ids $REDIS_SECURITY_GROUP_ID
```

## Étape 4 : Application Load Balancer

```bash
# Créer ALB
ALB_ARN=$(aws elbv2 create-load-balancer \
    --name my-app-alb \
    --subnets $PUBLIC_SUBNET_1 $PUBLIC_SUBNET_2 \
    --security-groups $ALB_SECURITY_GROUP_ID \
    --scheme internet-facing \
    --type application \
    --ip-address-type ipv4 \
    --query 'LoadBalancers[0].LoadBalancerArn' --output text)

# Créer Target Group
TG_ARN=$(aws elbv2 create-target-group \
    --name my-app-tg \
    --protocol HTTP \
    --port 3000 \
    --vpc-id $VPC_ID \
    --health-check-path /health \
    --health-check-interval-seconds 30 \
    --health-check-timeout-seconds 5 \
    --healthy-threshold-count 2 \
    --unhealthy-threshold-count 3 \
    --query 'TargetGroups[0].TargetGroupArn' --output text)

# Créer Listener
aws elbv2 create-listener \
    --load-balancer-arn $ALB_ARN \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=$TG_ARN
```

## Étape 5 : Auto Scaling Group

```bash
# Créer Launch Template
LAUNCH_TEMPLATE_ID=$(aws ec2 create-launch-template \
    --launch-template-name my-app-template \
    --version-description "v1" \
    --launch-template-data '{
        "ImageId": "ami-0c55b159cbfafe1f0",
        "InstanceType": "t3.medium",
        "KeyName": "my-keypair",
        "SecurityGroupIds": ["'$APP_SECURITY_GROUP_ID'"],
        "UserData": "'$(base64 -w 0 user-data.sh)'",
        "IamInstanceProfile": {"Name": "my-app-instance-profile"},
        "TagSpecifications": [{
            "ResourceType": "instance",
            "Tags": [{"Key": "Name", "Value": "my-app-instance"}]
        }]
    }' \
    --query 'LaunchTemplate.LaunchTemplateId' --output text)

# Créer Auto Scaling Group
aws autoscaling create-auto-scaling-group \
    --auto-scaling-group-name my-app-asg \
    --launch-template LaunchTemplateId=$LAUNCH_TEMPLATE_ID,Version=1 \
    --min-size 2 \
    --max-size 10 \
    --desired-capacity 2 \
    --vpc-zone-identifier "$PRIVATE_APP_SUBNET_1,$PRIVATE_APP_SUBNET_2" \
    --target-group-arns $TG_ARN \
    --health-check-type ELB \
    --health-check-grace-period 300
```

## Étape 6 : Auto-Scaling Policies

```bash
# Scale Up Policy (si CPU > 70%)
aws autoscaling put-scaling-policy \
    --auto-scaling-group-name my-app-asg \
    --policy-name scale-up \
    --policy-type TargetTrackingScaling \
    --target-tracking-configuration '{
        "PredefinedMetricSpecification": {
            "PredefinedMetricType": "ASGAverageCPUUtilization"
        },
        "TargetValue": 70.0
    }'

# Scale Down automatique (intégré dans TargetTracking)
```

## Étape 7 : CloudFront + S3 (Frontend)

```bash
# Créer S3 Bucket pour frontend
aws s3 mb s3://my-app-frontend-$(date +%s)

# Activer static website hosting
aws s3 website s3://my-app-frontend --index-document index.html --error-document error.html

# Upload frontend
aws s3 sync ./dist s3://my-app-frontend --delete

# Créer CloudFront Distribution
aws cloudfront create-distribution --distribution-config '{
    "CallerReference": "my-app-'$(date +%s)'",
    "Comment": "My App Frontend CDN",
    "Enabled": true,
    "Origins": {
        "Quantity": 2,
        "Items": [{
            "Id": "S3-Frontend",
            "DomainName": "my-app-frontend.s3.amazonaws.com",
            "S3OriginConfig": {"OriginAccessIdentity": ""}
        }, {
            "Id": "ALB-API",
            "DomainName": "'$(aws elbv2 describe-load-balancers --load-balancer-arns $ALB_ARN --query 'LoadBalancers[0].DNSName' --output text)'",
            "CustomOriginConfig": {
                "HTTPPort": 80,
                "OriginProtocolPolicy": "http-only"
            }
        }]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-Frontend",
        "ViewerProtocolPolicy": "redirect-to-https",
        "AllowedMethods": {"Quantity": 2, "Items": ["GET", "HEAD"]},
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {"Forward": "none"}
        }
    },
    "CacheBehaviors": {
        "Quantity": 1,
        "Items": [{
            "PathPattern": "/api/*",
            "TargetOriginId": "ALB-API",
            "ViewerProtocolPolicy": "https-only",
            "AllowedMethods": {"Quantity": 7, "Items": ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]},
            "ForwardedValues": {
                "QueryString": true,
                "Headers": {"Quantity": 1, "Items": ["*"]},
                "Cookies": {"Forward": "all"}
            }
        }]
    }
}'
```

## Use Case Réel : Scaling Black Friday

**Contexte :** E-commerce, passage de 1K à 100K utilisateurs simultanés.

**Avant (serveur unique) :**
- 1 serveur EC2 t3.large
- Coût : 70€/mois
- Limite : 1000 users max
- Downtime Black Friday : 6h

**Après (architecture 3-tiers) :**
- Auto-scaling : 2-10 instances
- RDS Multi-AZ avec Read Replicas
- ElastiCache Redis
- CloudFront CDN
- Coût normal : 200€/mois
- Coût Black Friday (3 jours) : 450€
- **Limite : 100K users**
- **Downtime : 0**

## Monitoring et Alertes

```bash
# CloudWatch Alarm : CPU > 80%
aws cloudwatch put-metric-alarm \
    --alarm-name high-cpu \
    --alarm-description "Alarm when CPU exceeds 80%" \
    --metric-name CPUUtilization \
    --namespace AWS/EC2 \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2 \
    --alarm-actions arn:aws:sns:eu-west-1:123456789012:my-alerts

# Alarm : Erreurs ALB > 10%
aws cloudwatch put-metric-alarm \
    --alarm-name high-5xx-errors \
    --metric-name HTTPCode_Target_5XX_Count \
    --namespace AWS/ApplicationELB \
    --statistic Sum \
    --period 60 \
    --threshold 100 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2 \
    --alarm-actions arn:aws:sns:eu-west-1:123456789012:my-alerts
```

## Conclusion

Une architecture 3-tiers bien conçue sur AWS vous permet de scaler de 0 à 1 million d'utilisateurs sans refonte.

**ROI :**
- Uptime : 99.99%
- Scalabilité : x100
- Coûts : Pay-as-you-go (économies en heures creuses)

---

**Auteur** : Alice Sindayigaya
**Tags** : AWS, Cloud, Architecture, Scalability$$,
    'Déployez une architecture 3-tiers production-ready sur AWS. Auto-scaling, Multi-AZ, CloudFront, RDS, ElastiCache. Supportez 100K utilisateurs avec 99.99% uptime.',
    '/images/tutorials/cloud-aws.svg',
    'Cloud',
    ARRAY['AWS', 'Cloud', 'Architecture', 'Scalability', 'EC2', 'RDS', 'Auto-Scaling'],
    'published',
    NOW() - INTERVAL '25 days',
    0,
    30,
    'AWS Architecture 3-Tiers : Guide Production-Ready avec Auto-Scaling',
    'Architecture 3-tiers scalable sur AWS. VPC, EC2 Auto-Scaling, RDS Multi-AZ, ElastiCache, CloudFront. Du POC à 100K utilisateurs.',
    ARRAY['aws', 'cloud', 'architecture', '3-tier', 'scalability', 'auto-scaling', 'rds', 'elasticache']
);

-- ========================================
-- TUTORIELS RESTANTS (Cloud + Kubernetes + Docker)
-- À ajouter après les tutoriels existants
-- ========================================

-- CLOUD 2: Azure
INSERT INTO blog_posts (user_id, title, slug, content, excerpt, cover_image, category, tags, status, published_at, views, read_time, seo_title, seo_description, seo_keywords)
VALUES ('3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3', 'Azure DevOps + AKS : Pipeline CI/CD Complet de A à Z', 'azure-devops-aks-cicd', $$# Azure DevOps + AKS : Pipeline CI/CD Production

## 🎯 Use Case : Du Commit au Déploiement en 5 Minutes

Startup SaaS, 10 devs, 50 déploiements/jour. Besoin : pipeline automatisé de Git push à production Kubernetes, avec tests, sécurité, et rollback automatique.

## Architecture

```
Git Push → Azure Repos → Azure Pipeline → Build Docker → Push ACR → Deploy AKS → Tests E2E → Production
```

## Configuration Azure Pipeline

```yaml
trigger:
  branches:
    include:
      - main
      - develop

variables:
  dockerRegistryServiceConnection: 'acr-connection'
  imageRepository: 'myapp'
  containerRegistry: 'myacr.azurecr.io'
  dockerfilePath: '$(Build.SourcesDirectory)/Dockerfile'
  tag: '$(Build.BuildId)'
  k8sNamespace: 'production'

stages:
- stage: Build
  displayName: Build and push Docker image
  jobs:
  - job: Build
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
    environment: 'production'
    pool:
      vmImage: 'ubuntu-latest'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: Kubernetes@1
            displayName: kubectl apply
            inputs:
              connectionType: 'Kubernetes Service Connection'
              kubernetesServiceEndpoint: 'aks-cluster'
              namespace: $(k8sNamespace)
              command: 'apply'
              arguments: '-f k8s/deployment.yml'
```

## Créer Cluster AKS

```bash
az aks create \
  --resource-group my-rg \
  --name my-aks-cluster \
  --node-count 3 \
  --node-vm-size Standard_DS2_v2 \
  --enable-addons monitoring \
  --generate-ssh-keys \
  --network-plugin azure \
  --enable-managed-identity
```

## ROI

- Déploiements : 5 minutes vs 2 heures
- Rollback : 30 secondes vs 1 heure
- Erreurs production : -80%$$, 'Pipeline CI/CD complet avec Azure DevOps et AKS. Du commit Git au déploiement Kubernetes en 5 minutes. Tests automatisés, rollback, monitoring intégré.', '/images/tutorials/cloud-azure.svg', 'Cloud', ARRAY['Azure', 'AKS', 'DevOps', 'CI/CD', 'Kubernetes', 'Pipeline'], 'published', NOW() - INTERVAL '30 days', 0, 25, 'Azure DevOps + AKS : Pipeline CI/CD Complet', 'Pipeline CI/CD avec Azure DevOps et AKS. Automatisation complète du build au déploiement Kubernetes. Tests, sécurité, rollback.', ARRAY['azure', 'aks', 'devops', 'ci/cd', 'kubernetes', 'pipeline']);

-- CLOUD 3: GCP
INSERT INTO blog_posts (user_id, title, slug, content, excerpt, cover_image, category, tags, status, published_at, views, read_time, seo_title, seo_description, seo_keywords)
VALUES ('3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3', 'GCP Cloud Run + Cloud SQL : Application Serverless Scalable', 'gcp-cloud-run-serverless', $$# GCP Cloud Run : Serverless Container Platform

## 🎯 Use Case : API REST qui Scale de 0 à 10 000 RPS

API de géolocalisation. Trafic variable : 10 requêtes/min la nuit, 10 000 requêtes/sec en journée. Avec Cloud Run, payez seulement ce que vous utilisez.

## Architecture

```
Internet → Cloud Load Balancer → Cloud Run (Autoscale 0-1000) → Cloud SQL (PostgreSQL)
```

## Dockerfile Optimisé

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.js"]
```

## Déployer sur Cloud Run

```bash
# Build image
gcloud builds submit --tag gcr.io/my-project/myapp

# Deploy
gcloud run deploy myapp \
  --image gcr.io/my-project/myapp \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 100 \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars "DATABASE_URL=postgresql://..."
```

## Connecter Cloud SQL

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
});
```

## ROI

**Avant (VM permanente)** : 70€/mois pour 1% utilisation
**Après (Cloud Run)** : 5€/mois, scale automatique, zéro maintenance$$, 'Déployez une application serverless avec GCP Cloud Run. Scale automatique de 0 à 10000 requêtes/sec. Paiement à l''usage. Intégration Cloud SQL.', '/images/tutorials/cloud-gcp.svg', 'Cloud', ARRAY['GCP', 'Cloud Run', 'Serverless', 'Cloud SQL', 'PostgreSQL', 'Docker'], 'published', NOW() - INTERVAL '35 days', 0, 20, 'GCP Cloud Run : Application Serverless Scalable', 'Application serverless avec Cloud Run et Cloud SQL. Autoscaling 0-1000 instances. Payez seulement ce que vous utilisez. Guide complet.', ARRAY['gcp', 'cloud run', 'serverless', 'cloud sql', 'autoscaling', 'docker']);

-- CLOUD 4: Multi-Cloud
INSERT INTO blog_posts (user_id, title, slug, content, excerpt, cover_image, category, tags, status, published_at, views, read_time, seo_title, seo_description, seo_keywords)
VALUES ('3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3', 'Multi-Cloud Terraform : Déployer sur AWS + Azure + GCP Simultanément', 'terraform-multi-cloud', $$# Multi-Cloud avec Terraform

## 🎯 Use Case : Disaster Recovery Multi-Cloud

Application bancaire critique. SLA 99.999% requis. Stratégie : déployer simultanément sur AWS (primary), Azure (hot standby), GCP (backup).

## Architecture Terraform Multi-Provider

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
  project = "my-gcp-project"
  region  = "europe-west1"
}

# Module réutilisable
module "app_aws" {
  source = "./modules/app"
  providers = { cloud = aws }
  cloud_provider = "aws"
}

module "app_azure" {
  source = "./modules/app"
  providers = { cloud = azurerm }
  cloud_provider = "azure"
}

module "app_gcp" {
  source = "./modules/app"
  providers = { cloud = google }
  cloud_provider = "gcp"
}
```

## Global Load Balancing

```hcl
resource "cloudflare_load_balancer" "global_lb" {
  zone_id = var.cloudflare_zone_id
  name    = "myapp.com"

  default_pool_ids = [
    cloudflare_load_balancer_pool.aws.id,
    cloudflare_load_balancer_pool.azure.id,
    cloudflare_load_balancer_pool.gcp.id
  ]

  steering_policy = "geo"
}
```

## ROI

- Uptime : 99.999% (5 min downtime/an)
- Latence réduite : Traffic routé vers le cloud le plus proche
- Résilience : Failover automatique si un cloud tombe$$, 'Déployez simultanément sur AWS, Azure et GCP avec Terraform. Disaster recovery multi-cloud, global load balancing, failover automatique. SLA 99.999%.', '/images/tutorials/cloud-multicloud.svg', 'Cloud', ARRAY['Multi-Cloud', 'Terraform', 'AWS', 'Azure', 'GCP', 'Disaster Recovery'], 'published', NOW() - INTERVAL '40 days', 0, 23, 'Multi-Cloud Terraform : AWS + Azure + GCP Simultanément', 'Stratégie multi-cloud avec Terraform. Déployez sur AWS, Azure, GCP en une commande. Disaster recovery, load balancing global, SLA 99.999%.', ARRAY['multi-cloud', 'terraform', 'aws', 'azure', 'gcp', 'disaster recovery']);

-- ========================================
-- CATÉGORIE : KUBERNETES (4 tutoriels)
-- ========================================

-- K8S 1: Microservices
INSERT INTO blog_posts (user_id, title, slug, content, excerpt, cover_image, category, tags, status, published_at, views, read_time, seo_title, seo_description, seo_keywords)
VALUES ('3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3', 'Kubernetes : Déployer 10 Microservices E-Commerce en Production', 'kubernetes-microservices-ecommerce', $$# Kubernetes Microservices Architecture

## 🎯 Use Case : E-Commerce avec 10 Microservices

Boutique en ligne : frontend, auth, catalogue, panier, commande, paiement, stock, notification, analytics, admin. Chaque service scale indépendamment.

## Architecture

```
┌─────────────────────────────────────┐
│         Ingress (NGINX)              │
│    myapp.com/api/auth → auth-svc    │
│    myapp.com/api/cart → cart-svc    │
└─────────────────────────────────────┘
              │
   ┌──────────┴──────────┐
   │                     │
┌──▼───┐           ┌─────▼────┐
│ Auth │           │  Cart    │
│ Pod  │           │  Pod     │
└──┬───┘           └─────┬────┘
   │                     │
┌──▼──────────────────────▼────┐
│      PostgreSQL (StatefulSet) │
└───────────────────────────────┘
```

## Deployment + Service

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  namespace: ecommerce
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auth
  template:
    metadata:
      labels:
        app: auth
    spec:
      containers:
      - name: auth
        image: myapp/auth:v1.2.0
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: auth-svc
spec:
  selector:
    app: auth
  ports:
  - port: 80
    targetPort: 3000
```

## Ingress Configuration

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ecommerce-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: myapp.com
    http:
      paths:
      - path: /api/auth
        pathType: Prefix
        backend:
          service:
            name: auth-svc
            port:
              number: 80
      - path: /api/cart
        pathType: Prefix
        backend:
          service:
            name: cart-svc
            port:
              number: 80
```

## ROI

- Chaque service scale indépendamment
- Déploiements sans downtime (rolling updates)
- Résilience : un service down n'affecte pas les autres$$, 'Déployez une architecture microservices complète sur Kubernetes. 10 services indépendants, scaling granulaire, déploiements sans downtime. Use case e-commerce réel.', '/images/tutorials/kubernetes-microservices.svg', 'Kubernetes', ARRAY['Kubernetes', 'Microservices', 'Docker', 'E-Commerce', 'Architecture'], 'published', NOW() - INTERVAL '12 days', 0, 27, 'Kubernetes Microservices : E-Commerce en Production', 'Architecture microservices complète sur Kubernetes. 10 services, Ingress, secrets, ConfigMaps. Scaling indépendant, zéro downtime.', ARRAY['kubernetes', 'microservices', 'docker', 'e-commerce', 'k8s', 'architecture']);

-- K8S 2: Auto-scaling
INSERT INTO blog_posts (user_id, title, slug, content, excerpt, cover_image, category, tags, status, published_at, views, read_time, seo_title, seo_description, seo_keywords)
VALUES ('3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3', 'Kubernetes Auto-Scaling : HPA + VPA pour Gérer le Trafic Black Friday', 'kubernetes-autoscaling-hpa-vpa', $$# Kubernetes Auto-Scaling : HPA + VPA

## 🎯 Use Case : Black Friday Traffic x100

E-commerce. Trafic normal : 100 req/sec. Black Friday : 10 000 req/sec. Kubernetes auto-scale pods et ressources automatiquement.

## Horizontal Pod Autoscaler (HPA)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  minReplicas: 2
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "1000"
```

## Vertical Pod Autoscaler (VPA)

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: myapp-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  updatePolicy:
    updateMode: "Auto"
  resourcePolicy:
    containerPolicies:
    - containerName: myapp
      minAllowed:
        cpu: 100m
        memory: 128Mi
      maxAllowed:
        cpu: 2
        memory: 2Gi
```

## Cluster Autoscaler

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cluster-autoscaler
  namespace: kube-system
data:
  config: |
    nodes:
      min: 3
      max: 20
    scaleDownDelay: 10m
    scaleDownUnneededTime: 10m
```

## Scénario Réel : Black Friday

**09h00** : 2 pods, 100 req/sec
**10h00** : Début promo → 1000 req/sec → HPA scale à 10 pods
**11h00** : Pic trafic → 10 000 req/sec → HPA scale à 50 pods, Cluster Autoscaler ajoute 5 nodes
**14h00** : Trafic retombe → Scale down progressif
**18h00** : Retour à 2 pods

**Résultat** : 0 downtime, latence stable, coûts optimisés$$, 'Maîtrisez le HPA et VPA Kubernetes pour gérer les pics de trafic. Auto-scaling horizontal et vertical. Use case Black Friday : de 2 à 50 pods automatiquement.', '/images/tutorials/kubernetes-autoscaling.svg', 'Kubernetes', ARRAY['Kubernetes', 'HPA', 'VPA', 'Auto-Scaling', 'Performance', 'Black Friday'], 'published', NOW() - INTERVAL '8 days', 0, 24, 'Kubernetes HPA + VPA : Auto-Scaling Black Friday', 'Auto-scaling Kubernetes avec HPA et VPA. Gérez les pics de trafic x100. Black Friday sans downtime. Configuration complète.', ARRAY['kubernetes', 'hpa', 'vpa', 'autoscaling', 'performance', 'k8s']);

-- K8S 3: Helm
INSERT INTO blog_posts (user_id, title, slug, content, excerpt, cover_image, category, tags, status, published_at, views, read_time, seo_title, seo_description, seo_keywords)
VALUES ('3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3', 'Helm Charts : Déploiement Standardisé Multi-Environnements', 'kubernetes-helm-charts', $$# Helm : Package Manager pour Kubernetes

## 🎯 Use Case : Déployer sur Dev/Staging/Prod en 1 Commande

3 environnements identiques mais configurations différentes (replicas, resources, domains). Helm = templates + valeurs.

## Structure Helm Chart

```
myapp/
├── Chart.yaml
├── values.yaml
├── values-dev.yaml
├── values-staging.yaml
├── values-prod.yaml
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    └── _helpers.tpl
```

## Chart.yaml

```yaml
apiVersion: v2
name: myapp
version: 1.0.0
appVersion: "1.2.0"
description: My awesome application
type: application
```

## values.yaml (defaults)

```yaml
replicaCount: 2

image:
  repository: myapp
  tag: latest
  pullPolicy: IfNotPresent

resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
  limits:
    memory: "256Mi"
    cpu: "200m"

ingress:
  enabled: true
  className: "nginx"
  host: "myapp.local"
```

## templates/deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "myapp.fullname" . }}
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        resources:
          {{- toYaml .Values.resources | nindent 12 }}
```

## Déployer

```bash
# Dev
helm install myapp . -f values-dev.yaml --namespace dev

# Staging
helm install myapp . -f values-staging.yaml --namespace staging

# Production
helm install myapp . -f values-prod.yaml --namespace production
```

## ROI

- 1 chart, N environnements
- Rollback en 1 commande
- Versioning charts$$, 'Packagez vos applications Kubernetes avec Helm. Templates réutilisables, multi-environnements. Déploiement dev/staging/prod en 1 commande. Rollback facile.', '/images/tutorials/kubernetes-helm.svg', 'Kubernetes', ARRAY['Kubernetes', 'Helm', 'Charts', 'Deployment', 'DevOps'], 'published', NOW() - INTERVAL '5 days', 0, 21, 'Helm Charts Kubernetes : Multi-Environnements Simplifié', 'Maîtrisez Helm pour Kubernetes. Charts, templates, values. Déploiement multi-environnements en 1 commande. Rollback, versioning.', ARRAY['kubernetes', 'helm', 'charts', 'deployment', 'devops', 'k8s']);

-- K8S 4: Istio Service Mesh
INSERT INTO blog_posts (user_id, title, slug, content, excerpt, cover_image, category, tags, status, published_at, views, read_time, seo_title, seo_description, seo_keywords)
VALUES ('3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3', 'Istio Service Mesh : Observabilité et Sécurité Microservices', 'kubernetes-istio-service-mesh', $$# Istio : Service Mesh pour Kubernetes

## 🎯 Use Case : Tracer 100% des Requêtes entre 10 Microservices

Application avec 10 microservices. Besoin : traçabilité complète, mTLS automatique, retry, circuit breaker, canary deployments.

## Installer Istio

```bash
istioctl install --set profile=demo
kubectl label namespace default istio-injection=enabled
```

## Architecture Istio

```
Request → Ingress Gateway → Service A (+ Envoy Proxy)
                                  ↓
                            Service B (+ Envoy Proxy)
                                  ↓
                            Service C (+ Envoy Proxy)
```

## VirtualService : Traffic Management

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: myapp
spec:
  hosts:
  - myapp.com
  http:
  - match:
    - headers:
        canary:
          exact: "true"
    route:
    - destination:
        host: myapp
        subset: v2
      weight: 100
  - route:
    - destination:
        host: myapp
        subset: v1
      weight: 90
    - destination:
        host: myapp
        subset: v2
      weight: 10
```

## mTLS Automatique

```yaml
apiVersion: security.istio.io/v1beta1
kind:PeerAuthentication
metadata:
  name: default
spec:
  mtls:
    mode: STRICT
```

## Observabilité avec Kiali

```bash
kubectl apply -f samples/addons/kiali.yaml
kubectl apply -f samples/addons/jaeger.yaml
kubectl apply -f samples/addons/prometheus.yaml
kubectl apply -f samples/addons/grafana.yaml

istioctl dashboard kiali
```

## ROI

- Traçabilité : 100% requêtes tracées
- Sécurité : mTLS sans code
- Canary deployment : 0 downtime
- Circuit breaker : Résilience++$$, 'Implémentez un service mesh avec Istio. mTLS automatique, distributed tracing, canary deployments, circuit breaker. Observabilité complète avec Kiali.', '/images/tutorials/kubernetes-istio.svg', 'Kubernetes', ARRAY['Kubernetes', 'Istio', 'Service Mesh', 'Observability', 'Security', 'mTLS'], 'published', NOW() - INTERVAL '3 days', 0, 26, 'Istio Service Mesh : Observabilité et Sécurité K8s', 'Service mesh Istio pour Kubernetes. mTLS, distributed tracing, traffic management. Sécurité et observabilité microservices.', ARRAY['kubernetes', 'istio', 'service mesh', 'observability', 'security', 'mtls']);

-- ========================================
-- CATÉGORIE : DOCKER (4 tutoriels)
-- ========================================

-- DOCKER 1: Multi-stage builds
INSERT INTO blog_posts (user_id, title, slug, content, excerpt, cover_image, category, tags, status, published_at, views, read_time, seo_title, seo_description, seo_keywords)
VALUES ('3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3', 'Docker Multi-Stage Builds : Réduire vos Images de 1GB à 50MB', 'docker-multi-stage-builds', $$# Docker Multi-Stage Builds

## 🎯 Use Case : Image Node.js de 1.2GB → 85MB

Application Node.js. Image initiale : 1.2GB (node_modules, build tools). Après multi-stage : 85MB. Temps de déploiement : -90%.

## ❌ Dockerfile Classique (1.2GB)

```dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["node", "dist/server.js"]
```

**Problèmes** : devDependencies, build tools, sources TypeScript inclus

## ✅ Multi-Stage Build (85MB)

```dockerfile
# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

## Optimisations Avancées

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Runner (distroless)
FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["dist/server.js"]
```

**Résultat final : 45MB !**

## ROI

- Taille image : 1.2GB → 45MB (-96%)
- Push DockerHub : 5 min → 10 sec
- Déploiement K8s : 2 min → 5 sec
- Sécurité : Surface d'attaque réduite$$, 'Optimisez vos images Docker avec multi-stage builds. Réduisez de 1GB à 50MB. Déploiements 10x plus rapides. Distroless images pour sécurité maximale.', '/images/tutorials/docker-multistage.svg', 'Docker', ARRAY['Docker', 'Multi-Stage', 'Optimization', 'DevOps', 'Security'], 'published', NOW() - INTERVAL '18 days', 0, 18, 'Docker Multi-Stage : Réduire Images de 1GB à 50MB', 'Maîtrisez les multi-stage builds Docker. Réduisez vos images de 96%. Déploiements ultra-rapides. Distroless images.', ARRAY['docker', 'multi-stage', 'optimization', 'performance', 'security']);

-- DOCKER 2: Compose
INSERT INTO blog_posts (user_id, title, slug, content, excerpt, cover_image, category, tags, status, published_at, views, read_time, seo_title, seo_description, seo_keywords)
VALUES ('3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3', 'Docker Compose : Stack Microservices Complète en Local', 'docker-compose-microservices', $$# Docker Compose : Orchestration Multi-Conteneurs

## 🎯 Use Case : Lancer 10 Services en 1 Commande

Environnement local : API, DB, Redis, RabbitMQ, frontend, Mailcatcher, etc. `docker compose up` = tout démarre en 30 secondes.

## docker-compose.yml Complet

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - API_URL=http://api:5000
    depends_on:
      - api

  api:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/mydb
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - ./backend:/app
      - /app/node_modules

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: user
      RABBITMQ_DEFAULT_PASS: pass

volumes:
  postgres-data:
  redis-data:
```

## Commandes Utiles

```bash
# Démarrer tout
docker compose up -d

# Voir les logs
docker compose logs -f api

# Rebuild un service
docker compose up -d --build api

# Scaler un service
docker compose up -d --scale api=3

# Arrêter et supprimer
docker compose down -v
```

## ROI

- Onboarding nouveau dev : 5 min vs 2 jours
- Environnement identique pour toute l'équipe
- Tests d'intégration locaux$$, 'Orchestrez vos microservices localement avec Docker Compose. Stack complète en 1 commande. Frontend, backend, DB, cache, queues. Onboarding devs en 5 minutes.', '/images/tutorials/docker-compose.svg', 'Docker', ARRAY['Docker', 'Docker Compose', 'Microservices', 'Development', 'DevOps'], 'published', NOW() - INTERVAL '22 days', 0, 19, 'Docker Compose : Stack Microservices Locale Complète', 'Maîtrisez Docker Compose pour développement local. Multi-conteneurs, healthchecks, volumes. Stack complète en 1 commande.', ARRAY['docker', 'docker compose', 'microservices', 'development', 'devops']);

-- DOCKER 3: Harbor Registry
INSERT INTO blog_posts (user_id, title, slug, content, excerpt, cover_image, category, tags, status, published_at, views, read_time, seo_title, seo_description, seo_keywords)
VALUES ('3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3', 'Harbor : Registry Docker Privé avec Scan de Vulnérabilités', 'docker-harbor-private-registry', $$# Harbor : Private Docker Registry

## 🎯 Use Case : Sécuriser vos Images Docker en Entreprise

Startup avec 50 images privées. DockerHub public = risque sécurité. Harbor = registry privé + scan vulnérabilités + replication.

## Installer Harbor

```bash
wget https://github.com/goharbor/harbor/releases/download/v2.10.0/harbor-offline-installer-v2.10.0.tgz
tar xzvf harbor-offline-installer-v2.10.0.tgz
cd harbor

# Éditer harbor.yml
vim harbor.yml
# hostname: registry.mycompany.com
# https:
#   certificate: /path/to/cert.crt
#   private_key: /path/to/cert.key

sudo ./install.sh --with-trivy
```

## Push Image vers Harbor

```bash
# Login
docker login registry.mycompany.com
Username: admin
Password: ****

# Tag
docker tag myapp:latest registry.mycompany.com/my-project/myapp:latest

# Push
docker push registry.mycompany.com/my-project/myapp:latest
```

## Scan Automatique

Harbor utilise Trivy pour scanner :
- CVE (vulnérabilités)
- Secrets hardcodés
- Mauvaises configurations

**Exemple résultat** :
- Total : 156 vulnérabilités
- Critical : 3
- High : 12
- Medium : 58
- Low : 83

## Policies de Sécurité

```yaml
# Bloquer push si vulnérabilités critiques
Project Policy:
  Prevent vulnerable images from running: true
  Severity: Critical
  CVE allowlist: []
```

## ROI

- Toutes les images scannées automatiquement
- Blocage images vulnérables
- Conformité sécurité$$, 'Déployez un registry Docker privé avec Harbor. Scan automatique des vulnérabilités avec Trivy. Policies de sécurité. Replication multi-sites.', '/images/tutorials/docker-harbor.svg', 'Docker', ARRAY['Docker', 'Harbor', 'Registry', 'Security', 'Trivy', 'DevSecOps'], 'published', NOW() - INTERVAL '28 days', 0, 22, 'Harbor Registry : Docker Privé avec Scan Vulnérabilités', 'Registry Docker privé avec Harbor. Scan vulnérabilités Trivy, policies sécurité, replication. Conformité entreprise.', ARRAY['docker', 'harbor', 'registry', 'security', 'trivy', 'devsecops']);

-- DOCKER 4: Security
INSERT INTO blog_posts (user_id, title, slug, content, excerpt, cover_image, category, tags, status, published_at, views, read_time, seo_title, seo_description, seo_keywords)
VALUES ('3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3', 'Sécurité Docker : Hardening et Scan de Vulnérabilités', 'docker-security-hardening', $$# Docker Security Best Practices

## 🎯 Use Case : Passer un Audit de Sécurité

Audit PCI-DSS pour application bancaire. Exigences : conteneurs non-root, images scannées, secrets chiffrés, réseau isolé.

## 1. Images Sécurisées

```dockerfile
# ❌ MAUVAIS
FROM ubuntu
RUN apt-get install -y curl
CMD ["./app"]

# ✅ BON
FROM gcr.io/distroless/static-debian12
COPY --chown=65534:65534 app /app
USER 65534
CMD ["/app"]
```

## 2. Scanner les Images

```bash
# Trivy
trivy image myapp:latest

# Grype
grype myapp:latest

# Snyk
snyk container test myapp:latest
```

## 3. Docker Bench Security

```bash
docker run --rm --net host --pid host --cap-add audit_control \
  -v /var/lib:/var/lib \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /etc:/etc:ro \
  docker/docker-bench-security
```

## 4. Hardening docker-compose

```yaml
services:
  app:
    image: myapp:latest
    read_only: true
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    user: "1000:1000"
    tmpfs:
      - /tmp
```

## 5. Secrets Management

```bash
# Docker Secrets
echo "my_db_password" | docker secret create db_password -

# Utiliser dans service
docker service create \
  --secret db_password \
  --name myapp \
  myapp:latest
```

## Checklist Sécurité

- [ ] Images à jour (< 30 jours)
- [ ] Scan vulnérabilités daily
- [ ] Pas de secrets hardcodés
- [ ] User non-root
- [ ] Read-only filesystem
- [ ] Capabilities minimales
- [ ] Network isolation
- [ ] Logs centralisés$$, 'Sécurisez vos conteneurs Docker. Hardening, scan vulnérabilités, distroless images, secrets management. Conformité audit PCI-DSS. Checklist complète.', '/images/tutorials/docker-security.svg', 'Docker', ARRAY['Docker', 'Security', 'DevSecOps', 'Hardening', 'Vulnerabilities'], 'published', NOW() - INTERVAL '32 days', 0, 20, 'Docker Security : Hardening et Conformité PCI-DSS', 'Sécurisez vos conteneurs Docker. Scan vulnérabilités, hardening, distroless, secrets. Conformité audit. Best practices complètes.', ARRAY['docker', 'security', 'devsecops', 'hardening', 'vulnerabilities', 'compliance']);
