-- ========================================
-- TUTORIELS DOCKER (4 tutoriels)
-- ========================================
-- Remplacez '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3' par votre user_id

-- DOCKER 1: Multi-Stage Builds
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Docker Multi-Stage Builds : Réduire vos Images de 1GB à 50MB',
    'docker-multi-stage-builds',
    $BODY$# Docker Multi-Stage Builds

## 🎯 Use Case : Image Node.js de 1.2GB → 85MB

Application Node.js. Image initiale : 1.2GB (node_modules, build tools). Après multi-stage : 85MB. Temps de déploiement : -90%.

## ROI

- Taille image : 1.2GB → 45MB (-96%)
- Push DockerHub : 5 min → 10 sec
- Déploiement K8s : 2 min → 5 sec
- Sécurité : Surface d'attaque réduite$BODY$,
    'Optimisez vos images Docker avec multi-stage builds. Réduisez de 1GB à 50MB. Déploiements 10x plus rapides. Distroless images pour sécurité maximale.',
    '/images/tutorials/docker-multistage.svg',
    'DevOps',
    ARRAY['Docker', 'Multi-Stage', 'Optimization', 'DevOps', 'Security'],
    'published',
    NOW() - INTERVAL '18 days',
    0,
    18,
    'Docker Multi-Stage : Réduire Images de 1GB à 50MB',
    'Maîtrisez les multi-stage builds Docker. Réduisez vos images de 96%. Déploiements ultra-rapides. Distroless images.',
    ARRAY['docker', 'multi-stage', 'optimization', 'performance', 'security']
);

-- DOCKER 2: Docker Compose
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Docker Compose : Stack Microservices Complète en Local',
    'docker-compose-microservices',
    $BODY$# Docker Compose : Orchestration Multi-Conteneurs

## 🎯 Use Case : Lancer 10 Services en 1 Commande

Environnement local : API, DB, Redis, RabbitMQ, frontend, Mailcatcher, etc. `docker compose up` = tout démarre en 30 secondes.

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
- Tests d'intégration locaux$BODY$,
    'Orchestrez vos microservices localement avec Docker Compose. Stack complète en 1 commande. Frontend, backend, DB, cache, queues. Onboarding devs en 5 minutes.',
    '/images/tutorials/docker-compose.svg',
    'Docker',
    ARRAY['Docker', 'Docker Compose', 'Microservices', 'Development', 'DevOps'],
    'published',
    NOW() - INTERVAL '22 days',
    0,
    19,
    'Docker Compose : Stack Microservices Locale Complète',
    'Maîtrisez Docker Compose pour développement local. Multi-conteneurs, healthchecks, volumes. Stack complète en 1 commande.',
    ARRAY['docker', 'docker compose', 'microservices', 'development', 'devops']
);

-- DOCKER 3: Harbor Registry
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Harbor : Registry Docker Privé avec Scan de Vulnérabilités',
    'docker-harbor-private-registry',
    $BODY$# Harbor : Private Docker Registry

## 🎯 Use Case : Sécuriser vos Images Docker en Entreprise

Startup avec 50 images privées. DockerHub public = risque sécurité. Harbor = registry privé + scan vulnérabilités + replication.

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

## ROI

- Toutes les images scannées automatiquement
- Blocage images vulnérables
- Conformité sécurité$BODY$,
    'Déployez un registry Docker privé avec Harbor. Scan automatique des vulnérabilités avec Trivy. Policies de sécurité. Replication multi-sites.',
    '/images/tutorials/docker-harbor.svg',
    'Docker',
    ARRAY['Docker', 'Harbor', 'Registry', 'Security', 'Trivy', 'DevSecOps'],
    'published',
    NOW() - INTERVAL '28 days',
    0,
    22,
    'Harbor Registry : Docker Privé avec Scan Vulnérabilités',
    'Registry Docker privé avec Harbor. Scan vulnérabilités Trivy, policies sécurité, replication. Conformité entreprise.',
    ARRAY['docker', 'harbor', 'registry', 'security', 'trivy', 'devsecops']
);

-- DOCKER 4: Sécurité Docker
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Sécurité Docker : Hardening et Scan de Vulnérabilités',
    'docker-security-hardening',
    $BODY$# Docker Security Best Practices

## 🎯 Use Case : Passer un Audit de Sécurité

Audit PCI-DSS pour application bancaire. Exigences : conteneurs non-root, images scannées, secrets chiffrés, réseau isolé.

## Checklist Sécurité

- Images à jour (< 30 jours)
- Scan vulnérabilités daily
- Pas de secrets hardcodés
- User non-root
- Read-only filesystem
- Capabilities minimales
- Network isolation
- Logs centralisés$BODY$,
    'Sécurisez vos conteneurs Docker. Hardening, scan vulnérabilités, distroless images, secrets management. Conformité audit PCI-DSS. Checklist complète.',
    '/images/tutorials/docker-security.svg',
    'Docker',
    ARRAY['Docker', 'Security', 'DevSecOps', 'Hardening', 'Vulnerabilities'],
    'published',
    NOW() - INTERVAL '32 days',
    0,
    20,
    'Docker Security : Hardening et Conformité PCI-DSS',
    'Sécurisez vos conteneurs Docker. Scan vulnérabilités, hardening, distroless, secrets. Conformité audit. Best practices complètes.',
    ARRAY['docker', 'security', 'devsecops', 'hardening', 'vulnerabilities', 'compliance']
);
