// Données du portfolio - Alice Sindayigaya
const portfolioData = {
    projects: [
        {
            id: 1,
            title: "JobTaillor — Générateur de CV intelligent",
            description: "SaaS d'aide à la candidature : l'IA analyse une offre d'emploi et réécrit votre CV en mettant en avant les compétences pertinentes. Le candidat obtient un document PDF prêt à envoyer en moins de 2 minutes. Stack : Next.js 15, GPT-4, Supabase, Stripe pour les abonnements, Clerk pour l'authentification et PostHog pour le suivi des conversions.",
            category: "SaaS",
            image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
            technologies: ["Next.js 15", "TypeScript", "OpenAI GPT-4", "Supabase", "Stripe", "Clerk"],
            year: "2025"
        },
        {
            id: 2,
            title: "Klip — Studio de contenu vidéo IA",
            description: "SaaS qui transforme une vidéo YouTube en série de clips TikTok prêts à publier. Le pipeline importe la vidéo avec yt-dlp, la découpe via FFmpeg, génère les sous-titres avec Whisper et ajoute une voix-off ElevenLabs. Les jobs sont orchestrés par BullMQ sur Redis, les fichiers stockés sur AWS S3, et l'ensemble est exportable en ZIP depuis l'interface Next.js.",
            category: "SaaS",
            image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
            technologies: ["Next.js 14", "TypeScript", "FFmpeg", "OpenAI Whisper", "ElevenLabs", "AWS S3", "BullMQ"],
            year: "2024"
        },
        {
            id: 3,
            title: "ijwi — Plateforme éducative multilingue IA",
            description: "Application de storytelling biblique interactif pour enfants de 3 à 14 ans, disponible en 5 langues (français, anglais, kinyarwanda, suédois, swahili). Chaque histoire est accompagnée d'un chat pédagogique propulsé par Claude d'Anthropic et de quizzes adaptatifs. L'internationalisation est gérée avec next-intl et les données persistées sur Supabase.",
            category: "IA",
            image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
            technologies: ["Next.js 14", "TypeScript", "Anthropic Claude", "Supabase", "next-intl", "Tailwind CSS"],
            year: "2024"
        },
        {
            id: 4,
            title: "ijwi Studio — Orchestrateur de médias IA",
            description: "Outil de production visuelle qui orchestre plusieurs APIs d'IA générative en parallèle pour créer illustrations et animations de scènes bibliques. Leonardo.ai produit les images fixes, Luma Dream Machine génère les vidéos et Fal.ai traite les animations. L'état global est géré par Zustand, la suite de tests couvre les flux e2e avec Playwright et les unitaires avec Vitest.",
            category: "IA",
            image: "https://images.unsplash.com/photo-1655720031554-a929595ffad7?w=800&q=80",
            technologies: ["Next.js 16", "TypeScript", "Leonardo.ai", "Luma AI", "Fal.ai", "Zustand", "Playwright"],
            year: "2025"
        },
        {
            id: 5,
            title: "Solutions PaaS — Kubernetes & OpenSearch",
            description: "Responsable de la conception et de l'opération des plateformes PaaS chez Cegedim Cloud : clusters OpenSearch multi-nœuds, bases MongoDB managées et services de messagerie. L'infrastructure haute disponibilité est provisionnée via Terraform, configurée avec Ansible et supervisée 24/7 par une stack Prometheus/Grafana avec alerting Alertmanager.",
            category: "DevOps",
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
            technologies: ["Kubernetes", "OpenSearch", "MongoDB", "Terraform", "Ansible", "Prometheus"],
            year: "CEGEDIM"
        },
        {
            id: 6,
            title: "Pipeline CI/CD GitOps — GitLab & ArgoCD",
            description: "Mise en place d'une chaîne de livraison continue GitOps pour les équipes Airbus DS. Chaque commit déclenche : build Docker, analyse SonarQube, scan de vulnérabilités Trivy, push vers Artifactory et synchronisation automatique ArgoCD sur le cluster Kubernetes cible. Les déploiements en production utilisent la stratégie blue-green pour garantir zéro interruption de service.",
            category: "DevOps",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
            technologies: ["GitLab CI/CD", "ArgoCD", "Docker", "SonarQube", "Trivy", "Artifactory"],
            year: "AIRBUS"
        },
        {
            id: 7,
            title: "Observabilité complète — ELK, Grafana & Prometheus",
            description: "Déploiement d'une stack d'observabilité full-stack pour superviser 50+ microservices chez Inetum/Airbus Geo. Logstash centralise les logs vers Elasticsearch, Kibana expose les dashboards métiers, Prometheus scrape les métriques applicatives et Grafana unifie la visualisation. Alertmanager achemine les alertes critiques vers Slack et PagerDuty avec des règles de routage par équipe.",
            category: "DevOps",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
            technologies: ["ELK Stack", "Grafana", "Prometheus", "Loki", "Alertmanager", "OpenSearch"],
            year: "INETUM"
        },
        {
            id: 8,
            title: "alice-in-prodland — Marque de contenus DevOps/SRE",
            description: "Marque de produits digitaux DevOps/SRE : cours CKA bilingue (FR+EN) en 8 chapitres généré avec Python/ReportLab, prompt packs IA et scripts Kubernetes vendus sur Gumroad. Contenu faceless publié sur TikTok, LinkedIn et YouTube avec voix clonée via ElevenLabs. Pipeline de production automatisé : rédaction → mise en page PDF → publication Gumroad → clip vidéo IA.",
            category: "SaaS",
            image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
            technologies: ["Python", "ReportLab", "ElevenLabs", "Gumroad", "Next.js", "TikTok API"],
            year: "2025"
        }
    ],

    blog: [
        {
            id: 1,
            title: "Déployer un cluster Kubernetes production-ready avec kubeadm",
            excerpt: "Guide complet pour bootstrapper un cluster K8s multi-nœuds avec haute disponibilité, network policies et monitoring intégré.",
            cover_image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
            content: "## Introduction\n\nCet article couvre l'installation et la configuration d'un cluster Kubernetes production-ready avec kubeadm.\n\n## Prérequis\n\n- 3 VMs Ubuntu 22.04 (1 control-plane, 2 workers)\n- 2 vCPU / 4 GB RAM minimum par nœud\n- Accès root et connectivité réseau entre les nœuds\n\n## Installation de kubeadm\n\n```bash\napt-get update && apt-get install -y kubelet kubeadm kubectl\nkubeadm init --pod-network-cidr=10.244.0.0/16\n```\n\n## Configurer kubectl\n\n```bash\nmkdir -p $HOME/.kube\ncp -i /etc/kubernetes/admin.conf $HOME/.kube/config\n```\n\n## Installer Calico CNI\n\n```bash\nkubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.0/manifests/calico.yaml\n```\n\n## Résultat\n\nUn cluster HA prêt pour la production avec Calico CNI, metrics-server et Prometheus stack.",
            category: "Kubernetes",
            tags: ["Kubernetes", "kubeadm", "DevOps", "Linux"],
            published_at: "2025-03-15T10:00:00Z",
            read_time: 12,
            views: 847
        },
        {
            id: 2,
            title: "Infrastructure as Code avec Terraform sur AWS — Bonnes pratiques",
            excerpt: "Structurer des modules Terraform réutilisables, gérer les états distants avec S3+DynamoDB et automatiser les déploiements multi-environnements.",
            cover_image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
            content: "## Pourquoi structurer son code Terraform ?\n\nUn projet IaC bien structuré réduit la dette technique et facilite la collaboration.\n\n## Structure recommandée\n\n```\nterraform/\n├── modules/\n│   ├── vpc/\n│   ├── eks/\n│   └── rds/\n├── environments/\n│   ├── dev/\n│   ├── staging/\n│   └── prod/\n└── global/\n```\n\n## Remote state avec S3\n\n```hcl\nterraform {\n  backend \"s3\" {\n    bucket         = \"my-tf-state\"\n    key            = \"prod/terraform.tfstate\"\n    region         = \"eu-west-1\"\n    dynamodb_table = \"tf-lock\"\n    encrypt        = true\n  }\n}\n```",
            category: "Terraform",
            tags: ["Terraform", "AWS", "IaC", "Cloud"],
            published_at: "2025-02-20T09:00:00Z",
            read_time: 10,
            views: 612
        },
        {
            id: 3,
            title: "Pipeline CI/CD complet avec GitLab et ArgoCD (GitOps)",
            excerpt: "Mettre en place un pipeline de livraison continue GitOps : build Docker, scan Trivy, push registry, sync ArgoCD automatique.",
            cover_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
            content: "## Architecture GitOps\n\nLe pattern GitOps utilise Git comme source de vérité unique pour l'état de l'infrastructure.\n\n## Pipeline .gitlab-ci.yml\n\n```yaml\nstages:\n  - build\n  - test\n  - scan\n  - deploy\n\nbuild:image:\n  stage: build\n  script:\n    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .\n    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA\n\nscan:trivy:\n  stage: scan\n  script:\n    - trivy image --exit-code 1 --severity HIGH,CRITICAL $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA\n```\n\n## Sync ArgoCD\n\nArgoCD surveille le repo Git et synchronise automatiquement les changements vers le cluster.",
            category: "CI/CD",
            tags: ["GitLab", "ArgoCD", "GitOps", "Docker", "Kubernetes"],
            published_at: "2025-01-10T14:00:00Z",
            read_time: 15,
            views: 1024
        },
        {
            id: 4,
            title: "Monitoring avec Prometheus & Grafana : alertes intelligentes",
            excerpt: "Configurer Prometheus Alertmanager avec des règles d'alerte pertinentes et des dashboards Grafana pour une observabilité complète.",
            cover_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
            content: "## Stack d'observabilité\n\nPrometheus + Grafana + Alertmanager forment le trio incontournable pour monitorer une infrastructure Kubernetes.\n\n## Installation avec Helm\n\n```bash\nhelm repo add prometheus-community https://prometheus-community.github.io/helm-charts\nhelm install kube-prometheus-stack prometheus-community/kube-prometheus-stack \\\n  --namespace monitoring --create-namespace\n```\n\n## Règle d'alerte exemple\n\n```yaml\ngroups:\n- name: kubernetes\n  rules:\n  - alert: PodCrashLooping\n    expr: rate(kube_pod_container_status_restarts_total[15m]) > 0.25\n    for: 5m\n    annotations:\n      summary: \"Pod {{ $labels.pod }} en CrashLoop\"\n```",
            category: "Monitoring",
            tags: ["Prometheus", "Grafana", "Alertmanager", "Kubernetes"],
            published_at: "2024-12-05T11:00:00Z",
            read_time: 8,
            views: 743
        },
        {
            id: 5,
            title: "Automatiser les déploiements avec Ansible — Playbooks avancés",
            excerpt: "Écrire des playbooks Ansible robustes avec roles, variables chiffrées Vault, gestion des erreurs et tests Molecule.",
            cover_image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
            content: "## Pourquoi Ansible ?\n\nAnsible permet d'automatiser la configuration des serveurs sans agent. Idéal pour les déploiements reproductibles.\n\n## Structure d'un role Ansible\n\n```\nroles/\n└── webserver/\n    ├── tasks/main.yml\n    ├── handlers/main.yml\n    ├── templates/nginx.conf.j2\n    └── vars/main.yml\n```\n\n## Chiffrement avec Vault\n\n```bash\nansible-vault encrypt_string 'mon_secret' --name 'db_password'\nansible-playbook deploy.yml --ask-vault-pass\n```",
            category: "Ansible",
            tags: ["Ansible", "Automation", "DevOps", "Infrastructure"],
            published_at: "2024-11-18T09:00:00Z",
            read_time: 11,
            views: 589
        },
        {
            id: 6,
            title: "OpenSearch : déploiement HA et gestion des index",
            excerpt: "Déployer un cluster OpenSearch haute disponibilité sur Kubernetes avec snapshots automatiques, ILM policies et sécurité TLS.",
            cover_image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80",
            content: "## OpenSearch vs Elasticsearch\n\nOpenSearch est le fork open-source maintenu par AWS. Compatible API Elasticsearch 7.10, sans licence commerciale.\n\n## Déploiement sur Kubernetes\n\n```yaml\napiVersion: apps/v1\nkind: StatefulSet\nmetadata:\n  name: opensearch\nspec:\n  replicas: 3\n  template:\n    spec:\n      containers:\n      - name: opensearch\n        image: opensearchproject/opensearch:2.11\n        env:\n        - name: cluster.name\n          value: opensearch-cluster\n```\n\n## Index Lifecycle Management\n\n```json\n{\n  \"policy\": {\n    \"phases\": {\n      \"hot\":    { \"actions\": { \"rollover\": { \"max_size\": \"50gb\" } } },\n      \"delete\": { \"min_age\": \"30d\",  \"actions\": { \"delete\": {} } }\n    }\n  }\n}\n```",
            category: "DevOps",
            tags: ["OpenSearch", "Kubernetes", "PaaS", "Elasticsearch"],
            published_at: "2024-10-22T10:00:00Z",
            read_time: 13,
            views: 456
        }
    ]
};
