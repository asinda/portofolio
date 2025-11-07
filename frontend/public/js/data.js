// Données du portfolio - Alice Sindayigaya
const portfolioData = {
    projects: [
        {
            id: 1,
            title: "Solutions PaaS (Platform as a Service)",
            description: "Conception et déploiement de plateformes en tant que service complètes incluant OpenSearch, MongoDB, et bases de données managées. Infrastructure hautement disponible, scalable et sécurisée avec monitoring 24/7. Automatisation complète du déploiement et de la maintenance avec Kubernetes, Terraform et Ansible.",
            category: "PaaS",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
            technologies: ["Kubernetes", "OpenSearch", "MongoDB", "Terraform", "Ansible"],
            company: "Services Cloud",
            year: "Solutions Entreprise"
        },
        {
            id: 2,
            title: "Solutions SaaS (Software as a Service)",
            description: "Développement et hébergement d'applications SaaS complètes avec architecture microservices. CI/CD automatisé, monitoring avancé avec ELK Stack, déploiement multi-cloud (AWS, GCP, Azure). Gestion des bases de données, sauvegardes automatiques, haute disponibilité et reprise après sinistre.",
            category: "SaaS",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
            technologies: ["Docker", "Kubernetes", "GitLab CI/CD", "ELK Stack", "Prometheus"],
            company: "Applications Cloud",
            year: "Solutions sur mesure"
        },
        {
            id: 3,
            title: "Solutions IaaS (Infrastructure as a Service)",
            description: "Mise en place d'infrastructures cloud complètes sur AWS, GCP et Azure. Provisioning automatisé avec Terraform, gestion des réseaux virtuels, load balancers, auto-scaling, sécurité périmétrique et conformité. Infrastructure as Code pour une reproductibilité totale.",
            category: "IaaS",
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
            technologies: ["AWS", "GCP", "Azure", "Terraform", "Ansible"],
            company: "Infrastructure Cloud",
            year: "Solutions évolutives"
        },
        {
            id: 4,
            title: "Automatisation & DevOps",
            description: "Mise en place de pipelines CI/CD complets avec GitLab, Jenkins, et ArgoCD. Automatisation des déploiements, tests automatisés, quality gates, gestion des artifacts. Infrastructure immutable, GitOps, blue-green deployments et canary releases pour des déploiements sans interruption.",
            category: "DevOps",
            image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80",
            technologies: ["GitLab", "Jenkins", "ArgoCD", "SonarQube", "Artifactory"],
            company: "CI/CD Solutions",
            year: "Automatisation complète"
        },
        {
            id: 5,
            title: "Monitoring & Observabilité",
            description: "Solutions complètes de supervision et monitoring avec stack ELK (Elasticsearch, Logstash, Kibana), Grafana, Prometheus et Loki. Dashboards personnalisés, alerting intelligent, analyse de logs en temps réel, métriques applicatives et infrastructure. APM et distributed tracing.",
            category: "Monitoring",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
            technologies: ["Grafana", "Prometheus", "ELK Stack", "Loki", "OpenSearch"],
            company: "Observabilité",
            year: "Supervision 24/7"
        },
        {
            id: 6,
            title: "Sécurité & Conformité Cloud",
            description: "Audit et sécurisation des infrastructures cloud. Mise en place de solutions de sécurité (WAF, DDoS protection, encryption), gestion des identités (IAM), conformité RGPD, ISO 27001. Scanners de vulnérabilités, gestion des secrets avec Vault, policies as code.",
            category: "Sécurité",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
            technologies: ["HashiCorp Vault", "AWS Security", "Falco", "Trivy", "OpenPolicy"],
            company: "Cybersécurité",
            year: "Conformité garantie"
        }
    ]
};
