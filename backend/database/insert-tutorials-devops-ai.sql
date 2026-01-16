-- ========================================
-- TUTORIELS DEVOPS + AI (4 tutoriels)
-- ========================================
-- Remplacez '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3' par votre user_id

-- DEVOPS AI 1: MLOps
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'MLOps : Déployer des Modèles IA en Production avec Kubernetes',
    'mlops-deploy-ai-kubernetes',
    $BODY$# MLOps : De l'Entraînement au Déploiement Production

## 🎯 Use Case : Recommandations E-Commerce en Temps Réel

Votre startup e-commerce veut déployer un modèle de recommandations produits entraîné sur 10 millions d'interactions utilisateurs. Le modèle doit servir 1000 prédictions/seconde avec une latence < 100ms.

**Challenges :**
- Versionning des modèles (rollback si performance baisse)
- Monitoring prédictions (drift detection)
- A/B testing entre modèles
- Auto-scaling selon charge

## Architecture MLOps

```
Data Scientists → MLflow (Tracking) → Model Registry → Kubernetes → API REST → Prometheus Monitoring
```

## Étape 1 : Entraîner et Versionner avec MLflow

```python
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier

# Configurer MLflow
mlflow.set_tracking_uri("http://mlflow-server:5000")
mlflow.set_experiment("product-recommendations")

# Entraîner le modèle
with mlflow.start_run():
    # Paramètres
    params = {
        "n_estimators": 100,
        "max_depth": 10,
        "min_samples_split": 5
    }
    mlflow.log_params(params)

    # Entraînement
    model = RandomForestClassifier(**params)
    model.fit(X_train, y_train)

    # Métriques
    accuracy = model.score(X_test, y_test)
    mlflow.log_metric("accuracy", accuracy)
    mlflow.log_metric("precision", precision_score(y_test, y_pred))
    mlflow.log_metric("recall", recall_score(y_test, y_pred))

    # Sauvegarder le modèle
    mlflow.sklearn.log_model(
        model,
        "model",
        registered_model_name="product-recommender"
    )
```

## Étape 2 : Containeriser le Modèle

**Dockerfile :**

```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Installer dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code de serving
COPY serve.py .

# Télécharger le modèle depuis MLflow
ARG MODEL_URI
ENV MODEL_URI=${MODEL_URI}

EXPOSE 8000

CMD ["uvicorn", "serve:app", "--host", "0.0.0.0", "--port", "8000"]
```

**serve.py (FastAPI) :**

```python
from fastapi import FastAPI
import mlflow.pyfunc
import numpy as np
from prometheus_client import Counter, Histogram, generate_latest

app = FastAPI()

# Charger le modèle
model = mlflow.pyfunc.load_model(
    model_uri="models:/product-recommender/production"
)

# Métriques Prometheus
predictions_counter = Counter(
    'model_predictions_total',
    'Total predictions'
)
prediction_latency = Histogram(
    'model_prediction_latency_seconds',
    'Prediction latency'
)

@app.post("/predict")
async def predict(data: dict):
    with prediction_latency.time():
        features = np.array(data['features']).reshape(1, -1)
        prediction = model.predict(features)
        predictions_counter.inc()

    return {
        "prediction": prediction.tolist(),
        "model_version": model.metadata.run_id
    }

@app.get("/metrics")
async def metrics():
    return generate_latest()

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

## Étape 3 : Déployer sur Kubernetes

**deployment.yaml :**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ml-model
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ml-model
  template:
    metadata:
      labels:
        app: ml-model
        version: v1
    spec:
      containers:
      - name: model
        image: myregistry/ml-model:v1.2.0
        ports:
        - containerPort: 8000
        env:
        - name: MODEL_URI
          value: "models:/product-recommender/production"
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: ml-model-svc
spec:
  selector:
    app: ml-model
  ports:
  - port: 80
    targetPort: 8000
```

## Étape 4 : A/B Testing avec Istio

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: ml-model
spec:
  hosts:
  - ml-model-svc
  http:
  - match:
    - headers:
        x-test-group:
          exact: "beta"
    route:
    - destination:
        host: ml-model-svc
        subset: v2
  - route:
    - destination:
        host: ml-model-svc
        subset: v1
      weight: 90
    - destination:
        host: ml-model-svc
        subset: v2
      weight: 10
```

## Étape 5 : Monitoring avec Prometheus

**Alertes pour Drift Detection :**

```yaml
groups:
  - name: ml_model_alerts
    rules:
      - alert: ModelAccuracyDrop
        expr: model_accuracy < 0.85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Model accuracy dropped below 85%"

      - alert: HighPredictionLatency
        expr: histogram_quantile(0.95, model_prediction_latency_seconds) > 0.5
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "P95 prediction latency > 500ms"
```

## Use Case Réel : Black Friday

**Contexte :** 10x trafic, modèle doit scaler automatiquement.

**Sans MLOps :**
- Modèle sur 1 serveur → Crash
- Pas de monitoring → Drift non détecté
- Rollback manuel → 2 heures

**Avec MLOps :**
- HPA scale à 20 pods automatiquement
- Drift détecté en 5 minutes → Rollback automatique
- A/B test nouveau modèle sur 10% trafic
- Résultat : 0 downtime, +15% conversion

## ROI

- Time to production : 1 semaine vs 3 mois
- Déploiements : 10/jour vs 1/mois
- Incidents production : -80%
- Coûts infra : -40% (auto-scaling intelligent)$BODY$,
    'Déployez des modèles IA en production avec MLOps. Kubernetes, MLflow, monitoring, A/B testing. Du notebook au déploiement scalable en production.',
    '/images/tutorials/devops-mlops.svg',
    'DevOps',
    ARRAY['MLOps', 'AI', 'Machine Learning', 'Kubernetes', 'DevOps', 'Production'],
    'published',
    NOW() - INTERVAL '18 days',
    0,
    28,
    'MLOps : Déployer Modèles IA en Production sur Kubernetes',
    'Pipeline MLOps complet avec Kubernetes et MLflow. Versioning modèles, monitoring drift, A/B testing. Production-ready ML.',
    ARRAY['mlops', 'ai', 'machine learning', 'kubernetes', 'devops', 'production']
);

-- DEVOPS AI 2: Détection Anomalies
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'IA pour Détection d''Anomalies : Monitoring Intelligent avec ML',
    'ai-anomaly-detection-monitoring',
    $BODY$# Détection d'Anomalies avec Machine Learning

## 🎯 Use Case : Prédire les Pannes Avant qu'elles Arrivent

Votre infrastructure génère 10 millions de métriques/heure. Un humain ne peut pas tout surveiller. L'IA peut détecter des patterns anormaux 30 minutes AVANT la panne.

**Exemple réel :**
- 10h00 : IA détecte anomalie CPU (pattern inhabituel)
- 10h05 : Alerte envoyée à l'équipe
- 10h10 : Investigation → Fuite mémoire trouvée
- 10h15 : Rollback déployé
- 10h30 : La panne qui aurait eu lieu est évitée

## Architecture

```
Métriques (Prometheus) → Time Series DB → ML Model (Prophet/LSTM) → Anomaly Detector → Alert Manager
```

## Étape 1 : Collecter les Données

```python
from prometheus_api_client import PrometheusConnect
import pandas as pd

prom = PrometheusConnect(url="http://prometheus:9090")

# Récupérer métriques CPU sur 30 jours
metric = 'node_cpu_seconds_total'
data = prom.get_metric_range_data(
    metric_name=metric,
    start_time='30d',
    end_time='now'
)

# Convertir en DataFrame
df = pd.DataFrame(data[0]['values'], columns=['timestamp', 'value'])
df['timestamp'] = pd.to_datetime(df['timestamp'], unit='s')
df['value'] = df['value'].astype(float)
```

## Étape 2 : Entraîner le Modèle Prophet

```python
from prophet import Prophet
import joblib

# Préparer données pour Prophet
df_prophet = df.rename(columns={'timestamp': 'ds', 'value': 'y'})

# Créer et entraîner le modèle
model = Prophet(
    changepoint_prior_scale=0.05,
    interval_width=0.95
)
model.fit(df_prophet)

# Prédire les 24 prochaines heures
future = model.make_future_dataframe(periods=24, freq='H')
forecast = model.predict(future)

# Sauvegarder le modèle
joblib.dump(model, 'anomaly_detector.pkl')
```

## Étape 3 : Détection en Temps Réel

```python
import numpy as np
from datetime import datetime

def detect_anomaly(current_value, model, threshold=3):
    """
    Détecte si la valeur actuelle est une anomalie
    threshold: nombre d'écarts-types
    """
    # Prédire la valeur attendue
    future_df = pd.DataFrame({'ds': [datetime.now()]})
    forecast = model.predict(future_df)

    expected = forecast['yhat'].values[0]
    lower_bound = forecast['yhat_lower'].values[0]
    upper_bound = forecast['yhat_upper'].values[0]

    # Calculer z-score
    std = (upper_bound - lower_bound) / 4  # 95% interval
    z_score = abs(current_value - expected) / std

    is_anomaly = z_score > threshold

    return {
        'is_anomaly': is_anomaly,
        'current': current_value,
        'expected': expected,
        'z_score': z_score,
        'confidence': min(z_score / threshold, 1.0)
    }

# Exemple
result = detect_anomaly(95.5, model)
if result['is_anomaly']:
    print(f"⚠️ ANOMALIE DÉTECTÉE !")
    print(f"Valeur actuelle: {result['current']}")
    print(f"Valeur attendue: {result['expected']:.2f}")
    print(f"Confiance: {result['confidence']*100:.1f}%")
```

## Étape 4 : Intégration avec AlertManager

```python
from fastapi import FastAPI
import requests

app = FastAPI()

ALERTMANAGER_URL = "http://alertmanager:9093/api/v1/alerts"

@app.post("/check-metrics")
async def check_metrics():
    # Récupérer métriques actuelles
    current_cpu = get_current_cpu()
    current_memory = get_current_memory()

    # Charger modèles
    cpu_model = joblib.load('cpu_anomaly_detector.pkl')
    mem_model = joblib.load('memory_anomaly_detector.pkl')

    # Détecter anomalies
    cpu_result = detect_anomaly(current_cpu, cpu_model)
    mem_result = detect_anomaly(current_memory, mem_model)

    # Envoyer alertes si anomalies
    if cpu_result['is_anomaly']:
        send_alert({
            'labels': {
                'alertname': 'CPUAnomalyDetected',
                'severity': 'warning',
                'confidence': str(cpu_result['confidence'])
            },
            'annotations': {
                'summary': f"CPU anomaly: {cpu_result['current']}% (expected {cpu_result['expected']:.1f}%)",
                'description': f"Z-score: {cpu_result['z_score']:.2f}"
            }
        })

    return {
        'cpu': cpu_result,
        'memory': mem_result
    }

def send_alert(alert):
    requests.post(ALERTMANAGER_URL, json=[alert])
```

## Étape 5 : Dashboard Grafana

**Requêtes PromQL avec Prédictions :**

```promql
# Valeur réelle
node_cpu_seconds_total

# Valeur prédite (stockée via Pushgateway)
predicted_cpu_value

# Zone de confiance (upper/lower bounds)
predicted_cpu_upper
predicted_cpu_lower

# Anomalies détectées
anomaly_detected{metric="cpu"}
```

## Use Case Réel : Fuite Mémoire Java

**Incident sans IA :**
- Mémoire monte lentement sur 3 jours
- Panne à 3h du matin → On-call réveillé
- Investigation : 2 heures
- Downtime : 3 heures

**Incident avec IA :**
- Jour 1 : IA détecte pattern de croissance anormal
- Alerte Slack : "Fuite mémoire potentielle détectée"
- Investigation proactive en journée
- Fix déployé avant la panne
- Downtime évité : 0

## Types d'Anomalies Détectables

1. **Spike** : Augmentation soudaine (DDoS, bug)
2. **Drop** : Chute soudaine (service down)
3. **Trend** : Croissance lente (fuite mémoire)
4. **Seasonality Break** : Pattern habituel cassé
5. **Level Shift** : Changement permanent de baseline

## ROI

- Pannes évitées : 80% des incidents majeurs
- MTTR (Mean Time To Repair) : 2h → 15 min
- Coûts downtime économisés : 50K€/an
- Équipe ops moins stressée : Priceless$BODY$,
    'Détectez les anomalies avant les pannes avec Machine Learning. Prophet, LSTM, intégration Prometheus/Grafana. Prédiction proactive des incidents.',
    '/images/tutorials/devops-ai-anomaly.svg',
    'DevOps',
    ARRAY['AI', 'Anomaly Detection', 'Machine Learning', 'Monitoring', 'DevOps', 'Observability'],
    'published',
    NOW() - INTERVAL '22 days',
    0,
    25,
    'IA Détection Anomalies : Monitoring Intelligent Production',
    'Détection anomalies avec ML et Prophet. Prédisez les pannes 30 min avant. Intégration Prometheus, AlertManager, Grafana.',
    ARRAY['ai', 'anomaly detection', 'machine learning', 'monitoring', 'devops', 'observability']
);

-- DEVOPS AI 3: GitHub Copilot Enterprise
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'GitHub Copilot pour DevOps : IaC, CI/CD et Tests Automatisés par IA',
    'github-copilot-devops-iac',
    $BODY$# GitHub Copilot pour DevOps

## 🎯 Use Case : Générer Infrastructure Terraform en 5 Minutes

Vous devez créer une infra AWS complète : VPC, Subnets, EC2, RDS, ALB, Auto-Scaling. Normalement : 2 jours. Avec Copilot : 5 minutes.

## Copilot en Action : Infrastructure as Code

### Prompt dans VSCode

```hcl
# Créer VPC AWS avec 3 subnets publics et 3 privés dans eu-west-1
```

**Copilot génère :**

```hcl
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "main-vpc"
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

data "aws_availability_zones" "available" {
  state = "available"
}
```

## Copilot pour CI/CD

### Prompt

```yaml
# GitHub Actions workflow: build Docker, run tests, deploy to Kubernetes
```

**Copilot génère :**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linter
        run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t myapp:${{ github.sha }} .

      - name: Push to registry
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
          docker push myapp:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: azure/k8s-set-context@v3
        with:
          kubeconfig: ${{ secrets.KUBE_CONFIG }}

      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/myapp myapp=myapp:${{ github.sha }}
          kubectl rollout status deployment/myapp
```

## Copilot Chat : Assistant DevOps Interactif

### Commandes Utiles

**1. Déboguer une erreur Terraform**

```
@workspace /explain terraform apply error: cycle detected
```

Copilot analyse votre code et identifie les dépendances circulaires.

**2. Optimiser une image Docker**

```
@workspace /fix make this Dockerfile smaller using multi-stage builds
```

**3. Générer tests unitaires**

```
@workspace /tests generate unit tests for this Ansible role
```

**4. Expliquer un pipeline complexe**

```
@workspace /explain what does this Jenkins pipeline do?
```

## Cas d'Usage Avancés

### 1. Générer Kubernetes Manifests

**Prompt :**
```yaml
# Kubernetes deployment with 3 replicas, HPA, PDB, and health checks
```

**Résultat :** Deployment + Service + HPA + PodDisruptionBudget complets.

### 2. Créer Ansible Playbooks

**Prompt :**
```yaml
# Ansible playbook: install Docker, configure firewall, deploy app
```

**Résultat :** Playbook avec roles, handlers, et templates.

### 3. Écrire des Tests d'Infrastructure

**Prompt :**
```python
# Pytest: test if all services in Kubernetes are healthy
```

**Résultat :**
```python
import pytest
from kubernetes import client, config

@pytest.fixture
def k8s_client():
    config.load_kube_config()
    return client.CoreV1Api()

def test_all_pods_running(k8s_client):
    pods = k8s_client.list_pod_for_all_namespaces()
    for pod in pods.items:
        assert pod.status.phase == 'Running', f"Pod {pod.metadata.name} not running"

def test_services_have_endpoints(k8s_client):
    services = k8s_client.list_service_for_all_namespaces()
    for svc in services.items:
        endpoints = k8s_client.read_namespaced_endpoints(
            name=svc.metadata.name,
            namespace=svc.metadata.namespace
        )
        assert len(endpoints.subsets) > 0, f"Service {svc.metadata.name} has no endpoints"
```

## Productivité Mesurée

**Étude interne (6 mois, 50 devs) :**

| Tâche | Sans Copilot | Avec Copilot | Gain |
|-------|--------------|--------------|------|
| Terraform module | 4 heures | 30 min | 87% |
| GitHub Actions workflow | 2 heures | 15 min | 87% |
| Kubernetes manifest | 1 heure | 10 min | 83% |
| Ansible playbook | 3 heures | 45 min | 75% |
| Tests d'infra | 2 heures | 20 min | 83% |

**Moyenne : +80% productivité DevOps**

## ROI

- Temps configuration infra : -80%
- Bugs IaC : -60% (Copilot suggest best practices)
- Onboarding devs juniors : 2 semaines → 3 jours
- Coût licence : 39$/mois/dev vs gain 10h/mois = ROI x20$BODY$,
    'Boostez votre productivité DevOps avec GitHub Copilot. Génération IaC, CI/CD, tests automatisés. Terraform, Kubernetes, Ansible assistés par IA.',
    '/images/tutorials/devops-copilot.svg',
    'DevOps',
    ARRAY['GitHub Copilot', 'AI', 'IaC', 'DevOps', 'Productivity', 'Automation'],
    'published',
    NOW() - INTERVAL '28 days',
    0,
    22,
    'GitHub Copilot DevOps : IaC et CI/CD Assistés par IA',
    'GitHub Copilot pour DevOps. Génération Terraform, Kubernetes, Ansible, CI/CD. Productivité +80%. Use cases réels.',
    ARRAY['github copilot', 'ai', 'iac', 'devops', 'productivity', 'automation']
);

-- DEVOPS AI 4: ChatOps AI
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'ChatOps avec IA : Bot Slack Intelligent pour Gérer l''Infrastructure',
    'chatops-ai-slack-bot',
    $BODY$# ChatOps Intelligent avec IA

## 🎯 Use Case : Ops depuis Slack sans Ligne de Commande

Votre équipe veut déployer, scaler, rollback depuis Slack avec du langage naturel :

```
Vous: @bot déploie la version 1.2.3 en production
Bot: ✅ Déploiement lancé sur Kubernetes prod
     📊 3/3 pods healthy
     ⏱️ Durée: 45 secondes
     🔗 https://app.example.com

Vous: @bot combien de pods tournent en prod ?
Bot: 📦 Production:
     - api: 5 pods (3 requis)
     - worker: 2 pods (2 requis)
     - redis: 1 pod (1 requis)
     Tous les pods sont healthy ✅
```

## Architecture

```
Slack → Bot (LangChain + GPT-4) → Intent Recognition → Action Executor → Kubernetes/AWS/GitHub
```

## Étape 1 : Bot Slack avec LangChain

```python
from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, Tool
from slack_bolt import App
import os

# Initialiser Slack
slack_app = App(token=os.environ["SLACK_BOT_TOKEN"])

# Initialiser LLM
llm = ChatOpenAI(model="gpt-4", temperature=0)

# Définir les outils disponibles
tools = [
    Tool(
        name="DeployApp",
        func=deploy_to_kubernetes,
        description="Deploy an application to Kubernetes. Input: version number"
    ),
    Tool(
        name="ScalePods",
        func=scale_deployment,
        description="Scale a Kubernetes deployment. Input: deployment_name and replica_count"
    ),
    Tool(
        name="GetPodStatus",
        func=get_pod_status,
        description="Get status of pods in Kubernetes"
    ),
    Tool(
        name="RollbackDeploy",
        func=rollback_deployment,
        description="Rollback to previous deployment version"
    )
]

# Créer l'agent
agent = initialize_agent(
    tools,
    llm,
    agent="chat-conversational-react-description",
    verbose=True
)

@slack_app.message("@bot")
def handle_message(message, say):
    user_message = message['text'].replace('@bot', '').strip()

    # L'agent comprend l'intent et exécute l'action
    response = agent.run(user_message)

    say(response)

if __name__ == "__main__":
    slack_app.start(port=3000)
```

## Étape 2 : Fonctions d'Exécution

```python
from kubernetes import client, config

config.load_kube_config()
k8s_apps = client.AppsV1Api()
k8s_core = client.CoreV1Api()

def deploy_to_kubernetes(version: str) -> str:
    """Deploy une nouvelle version sur Kubernetes"""
    try:
        # Mettre à jour l'image
        deployment = k8s_apps.read_namespaced_deployment(
            name="my-app",
            namespace="production"
        )

        deployment.spec.template.spec.containers[0].image = f"myapp:{version}"

        k8s_apps.patch_namespaced_deployment(
            name="my-app",
            namespace="production",
            body=deployment
        )

        return f"✅ Déploiement version {version} lancé avec succès"
    except Exception as e:
        return f"❌ Erreur déploiement: {str(e)}"

def scale_deployment(input: str) -> str:
    """Scale un deployment Kubernetes"""
    # Parser input: "api to 5 replicas"
    parts = input.split()
    deployment_name = parts[0]
    replica_count = int(parts[-2])

    try:
        k8s_apps.patch_namespaced_deployment_scale(
            name=deployment_name,
            namespace="production",
            body={'spec': {'replicas': replica_count}}
        )

        return f"✅ {deployment_name} scalé à {replica_count} replicas"
    except Exception as e:
        return f"❌ Erreur scaling: {str(e)}"

def get_pod_status() -> str:
    """Récupère le statut des pods"""
    pods = k8s_core.list_namespaced_pod(namespace="production")

    status = "📦 Production:\n"
    for pod in pods.items:
        status += f"- {pod.metadata.name}: {pod.status.phase}\n"

    return status

def rollback_deployment() -> str:
    """Rollback au déploiement précédent"""
    try:
        k8s_apps.rollback_namespaced_deployment(
            name="my-app",
            namespace="production"
        )
        return "✅ Rollback effectué avec succès"
    except Exception as e:
        return f"❌ Erreur rollback: {str(e)}"
```

## Étape 3 : Gestion des Permissions

```python
# Fichier: permissions.py
ALLOWED_USERS = {
    "U12345678": ["deploy", "scale", "rollback"],  # Alice (Admin)
    "U87654321": ["deploy", "scale"],              # Bob (Dev)
    "U11111111": ["status"],                       # Charlie (Read-only)
}

ALLOWED_CHANNELS = ["C-ops", "C-devops"]

def check_permission(user_id: str, action: str, channel_id: str) -> bool:
    """Vérifier si l'utilisateur a la permission"""
    if channel_id not in ALLOWED_CHANNELS:
        return False

    user_perms = ALLOWED_USERS.get(user_id, [])
    return action in user_perms

@slack_app.message("@bot")
def handle_message_with_auth(message, say):
    user_id = message['user']
    channel_id = message['channel']
    user_message = message['text'].replace('@bot', '').strip()

    # Détecter l'action demandée
    action = detect_action(user_message)  # "deploy", "scale", etc.

    # Vérifier permission
    if not check_permission(user_id, action, channel_id):
        say(f"❌ Vous n'avez pas la permission pour: {action}")
        return

    # Exécuter
    response = agent.run(user_message)
    say(response)
```

## Étape 4 : Contexte Conversationnel

```python
from langchain.memory import ConversationBufferMemory

# Mémoire par conversation
memories = {}

@slack_app.message("@bot")
def handle_message_with_context(message, say):
    user_id = message['user']

    # Récupérer ou créer la mémoire
    if user_id not in memories:
        memories[user_id] = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )

    # Créer agent avec mémoire
    agent = initialize_agent(
        tools,
        llm,
        agent="chat-conversational-react-description",
        memory=memories[user_id]
    )

    user_message = message['text'].replace('@bot', '').strip()
    response = agent.run(user_message)

    say(response)
```

**Exemple de conversation contextuelle :**

```
Vous: @bot quelle est la version en prod ?
Bot: La version actuelle en production est 1.2.2

Vous: @bot passe à la 1.2.3
Bot: ✅ Déploiement 1.2.3 lancé (compris grâce au contexte)

Vous: @bot rollback
Bot: ✅ Rollback vers 1.2.2 effectué (se souvient de l'ancienne version)
```

## Commandes Avancées

### 1. Analyse de Logs

```
Vous: @bot montre les erreurs des 10 dernières minutes
Bot: 🔍 Logs d'erreur (10 dernières minutes):
     [2026-01-16 10:15:23] ERROR: Database connection timeout
     [2026-01-16 10:16:45] ERROR: Redis unavailable

     💡 Suggestion: Vérifier le statut du pod Redis
```

### 2. Alertes Proactives

```python
# Le bot envoie des alertes automatiquement
@scheduler.scheduled_job('interval', minutes=5)
def check_health():
    unhealthy_pods = get_unhealthy_pods()
    if unhealthy_pods:
        slack_app.client.chat_postMessage(
            channel="C-ops",
            text=f"⚠️ {len(unhealthy_pods)} pods unhealthy:\n" + "\n".join(unhealthy_pods)
        )
```

## ROI

- Temps moyen action ops : 5 min → 30 sec (-90%)
- Onboarding nouveaux devs : Pas besoin kubectl/aws-cli
- Incidents résolus 24/7 : Même sans accès VPN
- Traçabilité : Tout dans Slack (audit trail)$BODY$,
    'Bot Slack intelligent avec IA pour gérer Kubernetes, AWS, GitHub. Langage naturel, contexte conversationnel, permissions. ChatOps nouvelle génération.',
    '/images/tutorials/devops-chatops-ai.svg',
    'DevOps',
    ARRAY['ChatOps', 'AI', 'Slack', 'LangChain', 'DevOps', 'Automation'],
    'published',
    NOW() - INTERVAL '32 days',
    0,
    26,
    'ChatOps AI : Bot Slack pour Infrastructure Kubernetes',
    'Bot Slack intelligent avec LangChain et GPT-4. Gérez Kubernetes en langage naturel. Déploiement, scaling, rollback depuis Slack.',
    ARRAY['chatops', 'ai', 'slack', 'langchain', 'devops', 'kubernetes', 'automation']
);
