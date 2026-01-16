-- Article enrichi : Azure DevOps + AKS
UPDATE blog_posts
SET content = $BODY$# Azure : Pipeline DevOps Complet avec AKS et ACR

## 🎯 Use Case : Migration de 20 Microservices vers Azure Kubernetes

Votre entreprise migre son infrastructure monolithique vers une architecture microservices sur Azure. 20 services doivent être conteneurisés, déployés sur AKS (Azure Kubernetes Service), avec un pipeline CI/CD automatisé de bout en bout. Chaque commit doit déclencher : build, tests, push vers ACR (Azure Container Registry), et déploiement sur AKS.

**Contexte réel** : Une scale-up SaaS avec 5 développeurs doit déployer 50 fois par jour. Sans automation : 30 minutes par déploiement manuel = 25 heures/jour perdues. Avec Azure DevOps + AKS : déploiement automatique en 5 minutes.

## 📋 Prérequis

Avant de commencer, vous aurez besoin de :

```bash
# Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
az --version

# kubectl
az aks install-cli

# Connexion Azure
az login
az account set --subscription "YOUR_SUBSCRIPTION_ID"
```

Variables d'environnement :
```bash
export RESOURCE_GROUP="myapp-rg"
export LOCATION="westeurope"
export ACR_NAME="myappacr"
export AKS_CLUSTER="myapp-aks"
export PROJECT_NAME="myapp"
```

## 🏗️ 1. Setup Infrastructure Azure

### Créer Resource Group

```bash
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION
```

### Créer Azure Container Registry (ACR)

```bash
# Créer ACR Premium (avec geo-replication, signing)
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Premium \
  --admin-enabled true

# Récupérer credentials
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query "username" -o tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" -o tsv)

# Login Docker
az acr login --name $ACR_NAME

# Test : Push image
docker tag nginx:latest $ACR_NAME.azurecr.io/nginx:latest
docker push $ACR_NAME.azurecr.io/nginx:latest
```

### Créer AKS Cluster

```bash
# Créer AKS avec autoscaling et monitoring
az aks create \
  --resource-group $RESOURCE_GROUP \
  --name $AKS_CLUSTER \
  --node-count 3 \
  --node-vm-size Standard_D4s_v3 \
  --enable-cluster-autoscaler \
  --min-count 2 \
  --max-count 10 \
  --network-plugin azure \
  --enable-managed-identity \
  --attach-acr $ACR_NAME \
  --enable-addons monitoring \
  --generate-ssh-keys

# Récupérer credentials kubectl
az aks get-credentials \
  --resource-group $RESOURCE_GROUP \
  --name $AKS_CLUSTER \
  --overwrite-existing

# Vérifier connexion
kubectl get nodes
```

**Output attendu** :
```
NAME                                STATUS   ROLES   AGE     VERSION
aks-nodepool1-12345678-vmss000000   Ready    agent   5m30s   v1.28.3
aks-nodepool1-12345678-vmss000001   Ready    agent   5m25s   v1.28.3
aks-nodepool1-12345678-vmss000002   Ready    agent   5m28s   v1.28.3
```

## 🔄 2. Pipeline Azure DevOps YAML Complet

Créer `azure-pipelines.yml` à la racine du projet :

```yaml
# Pipeline CI/CD complet pour Azure AKS
trigger:
  branches:
    include:
      - main
      - develop
  paths:
    exclude:
      - README.md
      - docs/*

# Variables du pipeline
variables:
  # Azure
  azureSubscription: 'MyAzureConnection'
  resourceGroup: 'myapp-rg'
  aksCluster: 'myapp-aks'

  # Container Registry
  containerRegistry: 'myappacr.azurecr.io'
  imageRepository: 'myapp'
  dockerfilePath: '$(Build.SourcesDirectory)/Dockerfile'

  # Tags
  tag: '$(Build.BuildId)'
  latestTag: 'latest'

  # Kubernetes
  k8sNamespace: 'production'
  deploymentName: 'myapp'

stages:
# ===========================
# Stage 1: BUILD & TEST
# ===========================
- stage: Build
  displayName: 'Build and Test'
  jobs:
  - job: BuildJob
    displayName: 'Build Docker Image'
    pool:
      vmImage: 'ubuntu-latest'

    steps:
    # Checkout code
    - checkout: self
      fetchDepth: 1

    # Setup Node.js (si app Node.js)
    - task: NodeTool@0
      inputs:
        versionSpec: '20.x'
      displayName: 'Install Node.js'

    # Install dependencies
    - script: |
        npm ci
      displayName: 'npm install'

    # Run tests
    - script: |
        npm run test:ci
        npm run test:coverage
      displayName: 'Run tests'

    # Publish test results
    - task: PublishTestResults@2
      condition: succeededOrFailed()
      inputs:
        testResultsFormat: 'JUnit'
        testResultsFiles: '**/test-results.xml'
        failTaskOnFailedTests: true
      displayName: 'Publish test results'

    # Publish code coverage
    - task: PublishCodeCoverageResults@1
      inputs:
        codeCoverageTool: 'Cobertura'
        summaryFileLocation: '$(System.DefaultWorkingDirectory)/coverage/cobertura-coverage.xml'
      displayName: 'Publish coverage'

    # Build Docker image
    - task: Docker@2
      displayName: 'Build Docker image'
      inputs:
        containerRegistry: '$(azureSubscription)'
        repository: '$(imageRepository)'
        command: 'build'
        Dockerfile: '$(dockerfilePath)'
        tags: |
          $(tag)
          $(latestTag)
        arguments: '--build-arg BUILD_DATE=$(Build.BuildNumber)'

# ===========================
# Stage 2: SECURITY SCAN
# ===========================
- stage: SecurityScan
  displayName: 'Security Scanning'
  dependsOn: Build
  jobs:
  - job: ScanJob
    displayName: 'Trivy Security Scan'
    pool:
      vmImage: 'ubuntu-latest'

    steps:
    # Scan image avec Trivy
    - script: |
        # Install Trivy
        wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
        echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
        sudo apt-get update
        sudo apt-get install trivy -y

        # Scan image
        trivy image --severity HIGH,CRITICAL \
          --exit-code 1 \
          --format json \
          --output trivy-report.json \
          $(containerRegistry)/$(imageRepository):$(tag)
      displayName: 'Trivy vulnerability scan'
      continueOnError: false

    # Publish scan results
    - task: PublishBuildArtifacts@1
      inputs:
        PathtoPublish: 'trivy-report.json'
        ArtifactName: 'security-scan'
      displayName: 'Publish scan results'

# ===========================
# Stage 3: PUSH TO ACR
# ===========================
- stage: Push
  displayName: 'Push to ACR'
  dependsOn: SecurityScan
  condition: succeeded()
  jobs:
  - job: PushJob
    displayName: 'Push Docker Image to ACR'
    pool:
      vmImage: 'ubuntu-latest'

    steps:
    # Push image to ACR
    - task: Docker@2
      displayName: 'Push to Azure Container Registry'
      inputs:
        containerRegistry: '$(azureSubscription)'
        repository: '$(imageRepository)'
        command: 'push'
        tags: |
          $(tag)
          $(latestTag)

# ===========================
# Stage 4: DEPLOY TO AKS
# ===========================
- stage: Deploy
  displayName: 'Deploy to AKS'
  dependsOn: Push
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  jobs:
  - deployment: DeployJob
    displayName: 'Deploy to Kubernetes'
    pool:
      vmImage: 'ubuntu-latest'
    environment: 'production-aks'
    strategy:
      runOnce:
        deploy:
          steps:
          # Download K8s manifests
          - checkout: self

          # Replace tokens in manifests
          - task: replacetokens@5
            displayName: 'Replace tokens in k8s manifests'
            inputs:
              rootDirectory: '$(System.DefaultWorkingDirectory)/k8s'
              targetFiles: '*.yaml'
              tokenPattern: 'default'
              writeOutput: true

          # Deploy to AKS
          - task: KubernetesManifest@0
            displayName: 'Deploy to AKS'
            inputs:
              action: 'deploy'
              kubernetesServiceConnection: '$(azureSubscription)'
              namespace: '$(k8sNamespace)'
              manifests: |
                $(System.DefaultWorkingDirectory)/k8s/deployment.yaml
                $(System.DefaultWorkingDirectory)/k8s/service.yaml
                $(System.DefaultWorkingDirectory)/k8s/ingress.yaml
              containers: '$(containerRegistry)/$(imageRepository):$(tag)'

          # Wait for rollout
          - script: |
              kubectl rollout status deployment/$(deploymentName) -n $(k8sNamespace) --timeout=5m
            displayName: 'Wait for rollout completion'

          # Run smoke tests
          - script: |
              # Get service URL
              SERVICE_IP=$(kubectl get svc $(deploymentName) -n $(k8sNamespace) -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

              # Health check
              curl -f http://$SERVICE_IP/health || exit 1

              echo "✅ Deployment successful!"
            displayName: 'Smoke tests'

# ===========================
# Stage 5: POST-DEPLOY
# ===========================
- stage: PostDeploy
  displayName: 'Post-Deployment'
  dependsOn: Deploy
  jobs:
  - job: NotifyJob
    displayName: 'Notifications'
    pool:
      vmImage: 'ubuntu-latest'

    steps:
    # Slack notification
    - task: Bash@3
      displayName: 'Send Slack notification'
      inputs:
        targetType: 'inline'
        script: |
          curl -X POST $(SLACK_WEBHOOK_URL) \
            -H 'Content-Type: application/json' \
            -d '{
              "text": "✅ Deployment successful",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Deployment successful* 🎉\n*Build*: $(Build.BuildNumber)\n*Branch*: $(Build.SourceBranchName)\n*Commit*: $(Build.SourceVersion)"
                  }
                }
              ]
            }'
```

## 📦 3. Manifestes Kubernetes

### deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: production
  labels:
    app: myapp
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        version: "#{Build.BuildId}#"
    spec:
      containers:
      - name: myapp
        image: myappacr.azurecr.io/myapp:#{Build.BuildId}#
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3000"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp
  namespace: production
spec:
  type: LoadBalancer
  selector:
    app: myapp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
```

## 🔍 4. Monitoring et Observabilité

### Azure Monitor Container Insights

```bash
# Activer Container Insights
az aks enable-addons \
  --resource-group $RESOURCE_GROUP \
  --name $AKS_CLUSTER \
  --addons monitoring

# Voir logs
az monitor log-analytics workspace show \
  --resource-group $RESOURCE_GROUP \
  --workspace-name DefaultWorkspace

# Query logs avec KQL
az monitor log-analytics query \
  --workspace "YOUR_WORKSPACE_ID" \
  --analytics-query "ContainerLog | where TimeGenerated > ago(1h) | limit 100"
```

### Prometheus + Grafana sur AKS

```bash
# Installer Prometheus via Helm
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set grafana.adminPassword=admin123

# Port-forward Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
# Accéder : http://localhost:3000
```

## 🚨 5. Troubleshooting

### Pipeline échoue à la connexion ACR

**Erreur** :
```
Error: unauthorized: authentication required
```

**Solution** :
```bash
# Vérifier service connection dans Azure DevOps
# Project Settings > Service connections > Azure Resource Manager

# Ou attacher ACR manuellement
az aks update \
  --name $AKS_CLUSTER \
  --resource-group $RESOURCE_GROUP \
  --attach-acr $ACR_NAME
```

### Pods en CrashLoopBackOff

**Diagnostic** :
```bash
# Voir logs
kubectl logs -n production deployment/myapp --tail=100

# Décrire pod
kubectl describe pod -n production -l app=myapp

# Events cluster
kubectl get events -n production --sort-by='.lastTimestamp'
```

**Solutions courantes** :
- Vérifier variables d'environnement
- Vérifier resources limits (OOMKilled)
- Vérifier health check endpoints

### Déploiement lent

**Optimisation** :
```yaml
# Dans deployment.yaml
spec:
  progressDeadlineSeconds: 600  # Timeout 10min
  strategy:
    rollingUpdate:
      maxSurge: 2        # Créer 2 pods en plus
      maxUnavailable: 0  # Garder tous les pods actuels
```

## 📈 ROI et Métriques

### Avant Azure DevOps + AKS
- ⏱️ **Temps déploiement** : 30 minutes manuellement
- 🔄 **Fréquence** : 2-3 déploiements/semaine
- ❌ **Taux d'erreur** : 15% (erreurs humaines)
- 💰 **Coût infra** : Serveurs over-provisionnés 24/7
- 👨‍💻 **DevOps temps** : 10h/semaine sur déploiements

### Après Azure DevOps + AKS
- ⚡ **Temps déploiement** : **5 minutes** automatique
- 🚀 **Fréquence** : **50 déploiements/jour**
- ✅ **Taux d'erreur** : **<1%** (automation)
- 💰 **Coût infra** : **-35%** (autoscaling)
- 👨‍💻 **DevOps temps** : **2h/semaine** (monitoring)

### Métriques Business
- **Time-to-market** : -85% (features en prod 6x plus vite)
- **Developer productivity** : +40% (plus de temps sur le code, moins sur déploiements)
- **Mean Time To Recovery (MTTR)** : 5 min (rollback automatique)
- **Deployment frequency** : 25x augmentation
- **Lead time** : Commit → Production en 15 minutes

## 🎓 Best Practices

1. **Environments séparés** : Dev, Staging, Prod sur namespaces différents
2. **GitOps** : Utiliser ArgoCD pour sync Git → AKS
3. **Secrets** : Azure Key Vault pour secrets (jamais dans Git)
4. **Tagging** : Toujours tagger images avec SHA Git + build number
5. **Monitoring** : Alertes Prometheus sur pod restarts, latency, errors
6. **Cost management** : Utiliser node pools avec autoscaling
7. **Security** : Network policies, Pod Security Standards

## 🔗 Ressources

- [Azure AKS Documentation](https://learn.microsoft.com/azure/aks/)
- [Azure DevOps Pipelines YAML](https://learn.microsoft.com/azure/devops/pipelines/yaml-schema)
- [Azure Container Registry](https://learn.microsoft.com/azure/container-registry/)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
$BODY$,
read_time = 15
WHERE slug = 'azure-devops-aks-pipeline';
