-- ===================================
-- Script d'insertion des données de test
-- ===================================

-- IMPORTANT : Avant d'exécuter ce script, vous devez :
-- 1. Créer un utilisateur dans Supabase (Authentication > Users)
-- 2. Copier son UUID (user_id)
-- 3. Remplacer 'VOTRE_USER_ID' ci-dessous par cet UUID

-- Définir le user_id (remplacez par votre UUID utilisateur)
-- Exemple : SET user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
-- Pour obtenir votre user_id : SELECT id FROM auth.users;

-- ===================================
-- Insertion du profil
-- ===================================
INSERT INTO profile (user_id, name, title, email, phone, location, photo, about, linkedin, github, website)
SELECT
    id,
    'Alice Sindayigaya',
    'Ingénieure DevOps',
    'alicesindayigaya@gmail.com',
    '07 61 29 12 84',
    'Toulouse, France',
    'images/profile.jpg',
    'Passionnée par l''innovation et l''excellence technique, j''ai développé une expertise solide en DevOps et Cloud Engineering à travers des expériences enrichissantes. Actuellement Responsable de Plateforme chez Cegedim Cloud, je conçois et optimise des architectures PaaS haute performance sur OpenSearch et MongoDB. Mon approche combine rigueur technique, vision stratégique et passion pour l''automatisation. J''aime relever des défis complexes, partager mes connaissances et contribuer à l''évolution des pratiques DevOps dans l''écosystème tech.',
    'https://www.linkedin.com/in/alicesindayigaya',
    'https://github.com/asinda',
    'https://alicesindayigaya.com'
FROM auth.users
WHERE email = 'alicesindayigaya@gmail.com'
LIMIT 1;

-- ===================================
-- Insertion des expériences
-- ===================================
INSERT INTO experiences (user_id, position, company, location, start_date, end_date, current, description, achievements)
SELECT
    id,
    'Ingénieure DevOps - Responsable de plateforme',
    'Cegedim Cloud',
    'Labège, France',
    'Janvier 2024',
    'Présent',
    true,
    'Responsable du développement et de l''exploitation des plateformes PaaS OpenSearch et MongoDB dans un environnement cloud haute disponibilité.',
    ARRAY[
        'Conception, déploiement et optimisation des plateformes OpenSearch et MongoDB',
        'Intégration des plateformes dans l''écosystème cloud existant',
        'Garantie de la sécurité, de la performance et de la scalabilité des environnements',
        'Mise en place de processus d''automatisation pour le déploiement et la maintenance'
    ]
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

INSERT INTO experiences (user_id, position, company, location, start_date, end_date, current, description, achievements)
SELECT
    id,
    'Ingénieure DevOps - Elasticsearch',
    'Inetum (Coperbee)',
    'Toulouse, France',
    'Septembre 2021',
    'Décembre 2023',
    false,
    'Mise en place et maintenance de la plateforme de logs basée sur la stack ELK pour Airbus Defence and Space / Geo.',
    ARRAY[
        'Déploiement et gestion de la stack ELK (Elasticsearch, Logstash, Kibana) en production',
        'Automatisation du déploiement avec Ansible, Terraform, Python et Bash',
        'Supervision des plateformes avec Centreon, Grafana et Prometheus',
        'Support niveau 3 et optimisation des performances des clusters Elasticsearch'
    ]
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

INSERT INTO experiences (user_id, position, company, location, start_date, end_date, current, description, achievements)
SELECT
    id,
    'Ingénieure DevOps',
    'Neosoft',
    'Toulouse, France',
    'Avril 2021',
    'Septembre 2021',
    false,
    'Mise en place et maintenance des outils CI/CD pour BPCE-IT dans le cadre d''une mission de conseil.',
    ARRAY[
        'Déploiement et configuration de GitLab, SonarQube, Artifactory et Jenkins',
        'Support utilisateurs pour la prise en main des outils CI/CD',
        'Documentation des processus et bonnes pratiques',
        'Formation des équipes de développement aux pratiques DevOps'
    ]
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

INSERT INTO experiences (user_id, position, company, location, start_date, end_date, current, description, achievements)
SELECT
    id,
    'Ingénieure DevOps',
    'CTS IT',
    'Toulouse, France',
    'Novembre 2018',
    'Avril 2021',
    false,
    'Mise en place et maintenance des outils de supervision réseau et cybersécurité dans un environnement multi-cloud.',
    ARRAY[
        'Déploiement et exploitation de solutions de supervision (Spectrum, Centreon, Nagios)',
        'Automatisation du déploiement des équipements Cisco avec Ansible, GitLab et Jenkins',
        'Migration et gestion d''infrastructures sur AWS et OpenShift',
        'Développement d''outils de contrôle de conformité des équipements réseau',
        'Orchestration de conteneurs avec Kubernetes'
    ]
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

INSERT INTO experiences (user_id, position, company, location, start_date, end_date, current, description, achievements)
SELECT
    id,
    'Stagiaire Développeuse Web (Flask-Python-JavaScript)',
    'Airbus Operations SAS',
    'Toulouse, France',
    'Mars 2018',
    'Août 2018',
    false,
    'Stage de fin d''études axé sur le développement web et l''introduction aux pratiques DevOps.',
    ARRAY[
        'Développement de web services pour le calcul de performance des moteurs d''avion',
        'Amélioration des interfaces web d''administration',
        'Participation à la mise en place d''outils DevOps (GitLab, Artifactory, Jenkins, SonarQube)',
        'Intégration de tests automatisés dans les pipelines CI/CD'
    ]
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

INSERT INTO experiences (user_id, position, company, location, start_date, end_date, current, description, achievements)
SELECT
    id,
    'Stagiaire Développeuse Web (SharePoint-JavaScript)',
    'Limagrain',
    'Saint-Rémy-de-Provence, France',
    'Avril 2017',
    'Août 2017',
    false,
    'Développement du module intranet pour la recherche végétale.',
    ARRAY[
        'Développement du module « Phenotyping tools » du site intranet SharePoint',
        'Mise en place d''une base de données pour la recherche végétale',
        'Création d''une base de connaissance collaborative'
    ]
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

INSERT INTO experiences (user_id, position, company, location, start_date, end_date, current, description, achievements)
SELECT
    id,
    'Stagiaire Développeuse Web (Symfony 2.8)',
    'ENEDIS',
    'Clermont-Ferrand, France',
    'Avril 2016',
    'Août 2016',
    false,
    'Refonte d''une application web de gestion logistique avec intégration SAP.',
    ARRAY[
        'Refonte complète d''une application web de gestion des magasins',
        'Automatisation des commandes de réapprovisionnement vers SAP',
        'Développement en Symfony 2.8 avec architecture MVC'
    ]
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

INSERT INTO experiences (user_id, position, company, location, start_date, end_date, current, description, achievements)
SELECT
    id,
    'Responsable du Service Informatique',
    'SOGEA-SATOM BURUNDI',
    'Bujumbura, Burundi',
    'Septembre 2009',
    'Août 2013',
    false,
    'Gestion complète du service informatique d''une entreprise de BTP sur 6 sites.',
    ARRAY[
        'Traitement des incidents complexes et diagnostic niveau 3',
        'Formation et intégration de nouveaux collaborateurs',
        'Management d''une équipe de 6 techniciens répartis sur 6 sites',
        'Reporting et suivi des projets informatiques auprès de la direction',
        'Gestion du budget IT et des investissements matériels'
    ]
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

-- ===================================
-- Insertion des formations
-- ===================================
INSERT INTO education (user_id, degree, institution, location, start_date, end_date, description)
SELECT
    id,
    'Master 2 Informatique',
    'Université Clermont Auvergne',
    'Clermont-Ferrand, France',
    '2016',
    '2018',
    'Mention Bien - Spécialisation en développement logiciel et systèmes distribués'
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

INSERT INTO education (user_id, degree, institution, location, start_date, end_date, description)
SELECT
    id,
    'Master 1 Informatique',
    'Université Blaise Pascal',
    'Clermont-Ferrand, France',
    '2015',
    '2016',
    'Mention Bien'
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

INSERT INTO education (user_id, degree, institution, location, start_date, end_date, description)
SELECT
    id,
    'Licence Informatique',
    'Université Blaise Pascal',
    'Clermont-Ferrand, France',
    '2013',
    '2014',
    'Mention Bien'
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

INSERT INTO education (user_id, degree, institution, location, start_date, end_date, description)
SELECT
    id,
    'Licence Informatique de Gestion',
    'Université Lumière de Bujumbura',
    'Bujumbura, Burundi',
    '2004',
    '2009',
    'Mention Très Bien'
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

-- ===================================
-- Insertion des projets
-- ===================================
INSERT INTO projects (user_id, title, description, image, technologies, category, link, github)
SELECT
    id,
    'Plateforme PaaS OpenSearch',
    'Conception et déploiement d''une plateforme PaaS OpenSearch haute disponibilité pour Cegedim Cloud. Architecture multi-cluster avec réplication, monitoring avancé et automatisation complète du cycle de vie.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    ARRAY['OpenSearch', 'Kubernetes', 'Ansible', 'Terraform', 'Grafana', 'Python'],
    'cloud',
    '',
    ''
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

INSERT INTO projects (user_id, title, description, image, technologies, category, link, github)
SELECT
    id,
    'Plateforme PaaS MongoDB',
    'Mise en place d''une plateforme MongoDB as a Service avec provisionnement automatisé, backup automatique, monitoring et scaling automatique. Support de milliers de bases de données en production.',
    'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&q=80',
    ARRAY['MongoDB', 'Kubernetes', 'Terraform', 'Ansible', 'Prometheus'],
    'cloud',
    '',
    ''
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

INSERT INTO projects (user_id, title, description, image, technologies, category, link, github)
SELECT
    id,
    'Stack ELK Airbus',
    'Déploiement et exploitation d''une plateforme de logs centralisée basée sur Elasticsearch, Logstash et Kibana pour Airbus Defence and Space. Gestion de plusieurs To de logs par jour avec haute disponibilité.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    ARRAY['Elasticsearch', 'Logstash', 'Kibana', 'Ansible', 'Terraform', 'Centreon'],
    'monitoring',
    '',
    ''
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

INSERT INTO projects (user_id, title, description, image, technologies, category, link, github)
SELECT
    id,
    'Infrastructure CI/CD BPCE-IT',
    'Mise en place complète de la chaîne CI/CD pour BPCE-IT incluant GitLab, Jenkins, SonarQube et Artifactory. Formation des équipes et documentation des bonnes pratiques DevOps.',
    'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&q=80',
    ARRAY['GitLab', 'Jenkins', 'SonarQube', 'Artifactory', 'Docker'],
    'automation',
    '',
    ''
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

INSERT INTO projects (user_id, title, description, image, technologies, category, link, github)
SELECT
    id,
    'Automatisation Réseau Cisco',
    'Développement d''outils d''automatisation pour le déploiement et la configuration d''équipements réseau Cisco. Pipelines CI/CD pour la gestion de configuration as code et contrôle de conformité.',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
    ARRAY['Ansible', 'Python', 'GitLab', 'Jenkins', 'Kubernetes'],
    'automation',
    '',
    ''
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

INSERT INTO projects (user_id, title, description, image, technologies, category, link, github)
SELECT
    id,
    'Plateforme de Supervision Multi-Cloud',
    'Architecture de supervision centralisée pour environnements AWS et OpenShift avec Spectrum, Centreon et Nagios. Alerting intelligent et tableaux de bord temps réel.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    ARRAY['Spectrum', 'Centreon', 'Nagios', 'AWS', 'OpenShift', 'Grafana'],
    'monitoring',
    '',
    ''
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

-- ===================================
-- Insertion des compétences techniques
-- ===================================
INSERT INTO skills_technical (user_id, name)
SELECT id, unnest(ARRAY[
    'Python', 'Java', 'PHP', 'Bash', 'Ansible', 'Terraform',
    'OpenSearch', 'Elasticsearch', 'ELK Stack', 'Centreon', 'Spectrum',
    'Grafana', 'Prometheus', 'Loki', 'Kubernetes', 'GCP', 'AWS',
    'OpenShift', 'OpenStack', 'GitLab', 'Jenkins', 'SonarQube',
    'Artifactory', 'MongoDB', 'Docker', 'CI/CD', 'Linux'
])
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

-- ===================================
-- Insertion des langues
-- ===================================
INSERT INTO skills_languages (user_id, name, level)
SELECT
    id,
    'Français',
    'Courant'
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

INSERT INTO skills_languages (user_id, name, level)
SELECT
    id,
    'Anglais',
    'Intermédiaire'
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

-- ===================================
-- Insertion des soft skills
-- ===================================
INSERT INTO skills_soft (user_id, name)
SELECT id, unnest(ARRAY[
    'Leadership d''équipe',
    'Autonomie et proactivité',
    'Résolution de problèmes complexes',
    'Communication technique',
    'Gestion de projets',
    'Formation et mentorat',
    'Adaptabilité',
    'Travail en équipe'
])
FROM auth.users WHERE email = 'alicesindayigaya@gmail.com' LIMIT 1;

-- ===================================
-- Fin du script
-- ===================================
-- Vérifier les insertions
SELECT 'Profile' as table_name, COUNT(*) as count FROM profile
UNION ALL
SELECT 'Experiences', COUNT(*) FROM experiences
UNION ALL
SELECT 'Education', COUNT(*) FROM education
UNION ALL
SELECT 'Projects', COUNT(*) FROM projects
UNION ALL
SELECT 'Skills Technical', COUNT(*) FROM skills_technical
UNION ALL
SELECT 'Skills Languages', COUNT(*) FROM skills_languages
UNION ALL
SELECT 'Skills Soft', COUNT(*) FROM skills_soft;
