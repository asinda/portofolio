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
    'Terraform : Infrastructure as Code - Guide Multi-Environnements',
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
    'Ansible : Provisionner 100 Serveurs en 10 Minutes',
    'Maîtrisez Ansible pour automatiser vos serveurs. Playbooks, rôles, inventaires dynamiques. Provisionner 100 serveurs en 10 minutes, zéro erreur.',
    ARRAY['ansible', 'automation', 'devops', 'configuration management', 'ssh', 'provisioning']
);

