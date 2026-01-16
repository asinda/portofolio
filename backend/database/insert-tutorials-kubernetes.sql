-- ========================================
-- TUTORIELS KUBERNETES (4 tutoriels)
-- ========================================
-- Remplacez '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3' par votre user_id

-- K8S 1: Microservices E-Commerce
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Kubernetes : Déployer 10 Microservices E-Commerce en Production',
    'kubernetes-microservices-ecommerce',
    $BODY$# Kubernetes Microservices Architecture

## 🎯 Use Case : E-Commerce avec 10 Microservices

Boutique en ligne : frontend, auth, catalogue, panier, commande, paiement, stock, notification, analytics, admin. Chaque service scale indépendamment.

## ROI

- Chaque service scale indépendamment
- Déploiements sans downtime (rolling updates)
- Résilience : un service down n'affecte pas les autres$BODY$,
    'Déployez une architecture microservices complète sur Kubernetes. 10 services indépendants, scaling granulaire, déploiements sans downtime. Use case e-commerce réel.',
    '/images/tutorials/kubernetes-microservices.svg',
    'Kubernetes',
    ARRAY['Kubernetes', 'Microservices', 'Docker', 'E-Commerce', 'Architecture'],
    'published',
    NOW() - INTERVAL '12 days',
    0,
    27,
    'Kubernetes Microservices : E-Commerce en Production',
    'Architecture microservices complète sur Kubernetes. 10 services, Ingress, secrets, ConfigMaps. Scaling indépendant, zéro downtime.',
    ARRAY['kubernetes', 'microservices', 'docker', 'e-commerce', 'k8s', 'architecture']
);

-- K8S 2: Auto-Scaling HPA + VPA
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Kubernetes Auto-Scaling : HPA + VPA pour Gérer le Trafic Black Friday',
    'kubernetes-autoscaling-hpa-vpa',
    $BODY$# Kubernetes Auto-Scaling : HPA + VPA

## 🎯 Use Case : Black Friday Traffic x100

E-commerce. Trafic normal : 100 req/sec. Black Friday : 10 000 req/sec. Kubernetes auto-scale pods et ressources automatiquement.

## Scénario Réel : Black Friday

**09h00** : 2 pods, 100 req/sec
**10h00** : Début promo → 1000 req/sec → HPA scale à 10 pods
**11h00** : Pic trafic → 10 000 req/sec → HPA scale à 50 pods, Cluster Autoscaler ajoute 5 nodes
**14h00** : Trafic retombe → Scale down progressif
**18h00** : Retour à 2 pods

**Résultat** : 0 downtime, latence stable, coûts optimisés$BODY$,
    'Maîtrisez le HPA et VPA Kubernetes pour gérer les pics de trafic. Auto-scaling horizontal et vertical. Use case Black Friday : de 2 à 50 pods automatiquement.',
    '/images/tutorials/kubernetes-autoscaling.svg',
    'Kubernetes',
    ARRAY['Kubernetes', 'HPA', 'VPA', 'Auto-Scaling', 'Performance', 'Black Friday'],
    'published',
    NOW() - INTERVAL '8 days',
    0,
    24,
    'Kubernetes HPA + VPA : Auto-Scaling Black Friday',
    'Auto-scaling Kubernetes avec HPA et VPA. Gérez les pics de trafic x100. Black Friday sans downtime. Configuration complète.',
    ARRAY['kubernetes', 'hpa', 'vpa', 'autoscaling', 'performance', 'k8s']
);

-- K8S 3: Helm Charts
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Helm Charts : Déploiement Standardisé Multi-Environnements',
    'kubernetes-helm-charts',
    $BODY$# Helm : Package Manager pour Kubernetes

## 🎯 Use Case : Déployer sur Dev/Staging/Prod en 1 Commande

3 environnements identiques mais configurations différentes (replicas, resources, domains). Helm = templates + valeurs.

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
- Versioning charts$BODY$,
    'Packagez vos applications Kubernetes avec Helm. Templates réutilisables, multi-environnements. Déploiement dev/staging/prod en 1 commande. Rollback facile.',
    '/images/tutorials/kubernetes-helm.svg',
    'Kubernetes',
    ARRAY['Kubernetes', 'Helm', 'Charts', 'Deployment', 'DevOps'],
    'published',
    NOW() - INTERVAL '5 days',
    0,
    21,
    'Helm Charts Kubernetes : Multi-Environnements Simplifié',
    'Maîtrisez Helm pour Kubernetes. Charts, templates, values. Déploiement multi-environnements en 1 commande. Rollback, versioning.',
    ARRAY['kubernetes', 'helm', 'charts', 'deployment', 'devops', 'k8s']
);

-- K8S 4: Istio Service Mesh
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Istio Service Mesh : Observabilité et Sécurité Microservices',
    'kubernetes-istio-service-mesh',
    $BODY$# Istio : Service Mesh pour Kubernetes

## 🎯 Use Case : Tracer 100% des Requêtes entre 10 Microservices

Application avec 10 microservices. Besoin : traçabilité complète, mTLS automatique, retry, circuit breaker, canary deployments.

## ROI

- Traçabilité : 100% requêtes tracées
- Sécurité : mTLS sans code
- Canary deployment : 0 downtime
- Circuit breaker : Résilience améliorée$BODY$,
    'Implémentez un service mesh avec Istio. mTLS automatique, distributed tracing, canary deployments, circuit breaker. Observabilité complète avec Kiali.',
    '/images/tutorials/kubernetes-istio.svg',
    'Kubernetes',
    ARRAY['Kubernetes', 'Istio', 'Service Mesh', 'Observability', 'Security', 'mTLS'],
    'published',
    NOW() - INTERVAL '3 days',
    0,
    26,
    'Istio Service Mesh : Observabilité et Sécurité K8s',
    'Service mesh Istio pour Kubernetes. mTLS, distributed tracing, traffic management. Sécurité et observabilité microservices.',
    ARRAY['kubernetes', 'istio', 'service mesh', 'observability', 'security', 'mtls']
);
