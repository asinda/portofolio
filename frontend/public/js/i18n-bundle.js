/**
 * ===================================
 * I18N BUNDLE - Version sans modules ES6
 * Tout le code i18n dans un seul fichier
 * Portfolio Alice Sindayigaya - 2025
 * ===================================
 */

(function() {
    'use strict';

    // ============================================
    // TRADUCTIONS FR
    // ============================================
    /**
 * ===================================
 * TRADUCTIONS FRANÇAISES (FR)
 * Portfolio Alice Sindayigaya - 2025
 * ===================================
 */

const translationsFR = {
    // ============================================
    // META TAGS SEO
    // ============================================
    meta: {
        title: "Alice Sindayigaya | Ingénieure DevOps & Cloud | AWS, Kubernetes, Terraform",
        description: "Ingénieure DevOps avec 7+ ans d'expérience en Cloud (AWS, GCP), Kubernetes, Terraform, Ansible. Spécialiste PaaS chez Cegedim Cloud. Portfolio & projets.",
        keywords: "DevOps, Cloud Engineer, Kubernetes, AWS, GCP, Terraform, Ansible, CI/CD, Docker, OpenSearch, MongoDB, GitLab, Jenkins, Ingénieure DevOps France"
    },

    // ============================================
    // NAVIGATION
    // ============================================
    nav: {
        home: "Accueil",
        cv: "CV",
        projects: "Projets",
        blog: "Blog & Tutos",
        logo: "Alice S.",
        toggleAriaLabel: "Toggle navigation"
    },

    // ============================================
    // SECTION HERO
    // ============================================
    hero: {
        label: "Ingénieure DevOps",
        greeting: "Bonjour, je suis",
        name: "Alice Sindayigaya",
        descriptions: [
            "Architecte Cloud passionnée | Kubernetes & Terraform",
            "Experte DevOps | CI/CD & Automatisation",
            "Spécialiste PaaS | OpenSearch & MongoDB",
            "Ingénieure Infrastructure | AWS & GCP"
        ],
        cta: {
            cv: "Découvrir mon CV",
            projects: "Mes Projets",
            blog: "Blog & Tutos"
        },
        scrollIndicator: "Scroll Down",
        cards: {
            cloud: {
                title: "Cloud",
                description: "AWS, GCP, Kubernetes"
            },
            automation: {
                title: "Automatisation",
                description: "Ansible, Terraform, CI/CD"
            },
            monitoring: {
                title: "Supervision",
                description: "ELK, Grafana, Prometheus"
            }
        }
    },

    // ============================================
    // SECTION À PROPOS
    // ============================================
    about: {
        label: "À propos de moi",
        title: "Ingénieure DevOps passionnée par l'automatisation et le cloud",
        p1: "Ingénieure DevOps/SRE avec 10+ ans d'expérience dans des environnements critiques. Actuellement Responsable de Plateforme chez Cegedim Cloud, je pilote bout-en-bout les plateformes PaaS OpenSearch et MongoDB — de l'architecture à la documentation, avec DevSecOps intégré (Trivy, Vault, SBOM/SLSA).",
        p2a: "Créatrice de ",
        p2b: " — marque de produits digitaux DevOps/SRE (guides CKA bilingues, prompt packs IA, scripts Kubernetes) distribués sur Gumroad et TikTok. Nationalité française, éligible habilitation II 901.",
        stats: {
            devops: "Années DevOps",
            it: "Années IT",
            companies: "Entreprises"
        },
        imageAlt: "Ingénieure DevOps spécialisée en développement d'API et programmation cloud"
    },

    // ============================================
    // SECTION CV
    // ============================================
    cv: {
        label: "Parcours Professionnel",
        title: "Mon CV",
        description: "Plus de 7 ans d'expérience en DevOps et Cloud Engineering",

        // Expériences professionnelles
        experience: {
            title: "Expériences Professionnelles",
            items: [
                {
                    date: "01/2024 - Actuel",
                    position: "Ingénieure DevOps – Responsable PaaS",
                    company: "CEGEDIM CLOUD - Labège",
                    tasks: [
                        "Développement et optimisation des plateformes PaaS (OpenSearch, MongoDB)",
                        "Architecture cloud hautement disponible, scalable et sécurisée"
                    ]
                },
                {
                    date: "09/2021 - 12/2023",
                    position: "Ingénieure DevOps – Elasticsearch",
                    company: "INETUM - Coperbee pour Airbus DS/Geo",
                    tasks: [
                        "Plateforme de logs ELK Stack avec automatisation Ansible, Terraform",
                        "Supervision avancée avec Centreon, Grafana, Prometheus"
                    ]
                },
                {
                    date: "11/2018 - 09/2021",
                    position: "Ingénieure DevOps",
                    company: "Neosoft & CTS IT - Toulouse",
                    tasks: [
                        "CI/CD : GitLab, Jenkins, SonarQube, Artifactory (BPCE-IT)",
                        "Supervision réseau et automatisation avec Kubernetes, Ansible"
                    ]
                }
            ],
            summary: {
                years: "2009 - 2018",
                text: "Expériences diverses : Airbus, ENEDIS, Limagrain, SOGEA-SATOM",
                tags: ["Développement Web", "Management IT"]
            }
        },

        // Formation
        education: {
            title: "Formation",
            items: [
                {
                    date: "2015 - 2018",
                    degree: "Master Informatique (Bac+5)",
                    school: "Université Clermont Auvergne",
                    mention: "Mention Bien"
                },
                {
                    date: "2013 - 2014",
                    degree: "Licence Informatique (Bac+3)",
                    school: "Université Blaise Pascal - France",
                    mention: "Mention Bien"
                },
                {
                    date: "2004 - 2009",
                    degree: "Licence Informatique de Gestion",
                    school: "Université Lumière - Burundi",
                    mention: "Mention Très Bien"
                }
            ]
        },

        // Langues & Loisirs
        languages: {
            title: "Langues & Loisirs",
            items: [
                {
                    label: "Langues :",
                    value: "Français (Courant), Anglais (Intermédiaire)"
                },
                {
                    label: "Loisirs :",
                    value: "Association humanitaire, Chorale Gospel, Jeux de société"
                }
            ]
        },

        // Compétences & Expertises
        skills: {
            title: "Compétences & Expertises",
            categories: [
                {
                    icon: "fa-cloud",
                    title: "Cloud & Infrastructure",
                    skills: ["Kubernetes", "OpenShift", "AWS / GCP / Azure", "OpenStack"]
                },
                {
                    icon: "fa-infinity",
                    title: "Automatisation & CI/CD",
                    skills: ["Ansible", "Terraform", "GitLab CI/CD", "Jenkins", "ArgoCD"]
                },
                {
                    icon: "fa-chart-line",
                    title: "Monitoring & PaaS",
                    skills: ["OpenSearch", "ELK Stack", "Grafana", "Prometheus", "MongoDB"]
                }
            ]
        },

        exp1: {
            date: "Janv. 2024 → Présent",
            title: "Ingénieure DevOps — Responsable de plateforme",
            company: "Cegedim.cloud · Labège (CDI)",
            t1: "Pilotage PaaS OpenSearch & MongoDB — architecture, déploiement, exploitation 24/7",
            t2: "MongoDB 8.0 Ops Manager HA : replica sets, sharding, sauvegardes PBM vs Rubrik",
            t3: "Pipelines GitLab CI/CD full-IaC (Terraform + Ansible) avec DevSecOps : Trivy, Vault, SBOM/SLSA",
            t4: "Observabilité Prometheus / Grafana / Loki — alerting vers Zoom Chat via webhooks"
        },
        exp2: {
            date: "Sept. 2021 → Déc. 2023",
            title: "Ingénieure DevOps — Plateforme ELK / Mission Critical",
            company: "Inetum · Mission Airbus DS/Geo · Toulouse (CDI)",
            t1: "Exploitation plateforme de logs Mission Critical ELK — incidents P1/P2 en autonomie",
            t2: "Automatisation complète : Ansible, Terraform, Python, Bash",
            t3: "Supervision multi-niveaux : Centreon, Grafana, Prometheus (17 checks documentés)"
        },
        exp3: {
            date: "Avr. 2021 → Sept. 2021",
            title: "Ingénieure DevOps — CI/CD",
            company: "Neosoft · Mission BPCE-IT · Toulouse (CDI)",
            t1: "Déploiement chaîne CI/CD (GitLab, SonarQube, Artifactory, Jenkins) pour SI bancaire",
            t2: "Support et formation des équipes développement à l'adoption des pipelines"
        },
        exp4: {
            date: "Nov. 2018 → Avr. 2021",
            title: "Ingénieure DevOps — Infrastructure & Cybersécurité",
            company: "CTS IT · Toulouse (CDI)",
            t1: "Supervision réseau & cybersécurité : Spectrum, Centreon, Nagios, AWS, OpenShift",
            t2: "Automatisation déploiements Cisco via Ansible, GitLab CI et Kubernetes",
            t3: "Développement d'outils Python de contrôle de conformité réseau"
        },
        summary: {
            text: "Airbus Operations (stage Flask/DevOps) · SOGEA-SATOM Burundi (Resp. IT, 6 techniciens)",
            tag2: "Management IT"
        },
        edu1: { degree: "Master Informatique (Bac+5)", mention: "Mention Bien" },
        edu2: { degree: "Licence Informatique (Bac+3)", mention: "Mention Bien" },
        edu3: { degree: "Licence Informatique de Gestion", mention: "Mention Très Bien" },
        langs: {
            title: "Langues & Loisirs",
            langLabel: "Langues :",
            langValue: "Français (Courant), Anglais (Intermédiaire)",
            hobbiesLabel: "Loisirs :",
            hobbiesValue: "Association humanitaire, Chorale Gospel, Jeux de société"
        },
        skills: {
            title: "Compétences & Expertises",
            cat1: "Cloud & Infrastructure",
            cat2: "Automatisation & CI/CD",
            cat3: "Monitoring & PaaS"
        },
        actions: {
            linkedinButton: "Voir sur LinkedIn"
        }
    },

    // ============================================
    // SECTION SERVICES / EXPERTISES
    // ============================================
    services: {
        label: "Expertises",
        title: "Domaines de compétences",
        description: "Solutions complètes en DevOps, Cloud et Automatisation",

        items: [
            {
                icon: "fa-cloud",
                title: "Architecture Cloud",
                description: "Conception et déploiement d'environnements cloud modernes, scalables et sécurisés sur AWS, GCP et OpenStack.",
                features: [
                    "Kubernetes & OpenShift",
                    "Plateformes PaaS",
                    "Infrastructure as Code"
                ]
            },
            {
                icon: "fa-cogs",
                title: "Automatisation & CI/CD",
                description: "Mise en place de pipelines CI/CD complets avec automatisation du déploiement et de la configuration.",
                features: [
                    "GitLab, Jenkins, Artifactory",
                    "Ansible & Terraform",
                    "Scripts Python & Bash"
                ],
                featured: true,
                badge: "Spécialité"
            },
            {
                icon: "fa-chart-line",
                title: "Supervision & Monitoring",
                description: "Implémentation de solutions de supervision complètes pour garantir la performance et la disponibilité.",
                features: [
                    "ELK Stack & OpenSearch",
                    "Grafana & Prometheus",
                    "Centreon & Loki"
                ]
            }
        ]
    },

    // ============================================
    // SECTION PROJETS
    // ============================================
    projects: {
        label: "Réalisations",
        title: "Projets & Cas d'Usage",
        description: "Architectures Cloud, Automatisations et Plateformes que j'ai conçues et déployées",

        filters: {
            all: "Tous",
            ia: "IA"
        }
    },

    // ============================================
    // SECTION COMPÉTENCES
    // ============================================
    skills: {
        label: "Compétences",
        title: "Technologies & Outils",
        cat1: "Cloud & Infrastructure",
        cat2: "Automatisation & IaC",
        cat3: "Monitoring & PaaS",
        cat4: "Développement Web",
        cat5: "IA & APIs",
        cat6: "Bases de Données"
    },

    // ============================================
    // SECTION BLOG
    // ============================================
    blog: {
        label: "Partage de Connaissances",
        title: "Blog & Tutoriels",
        description: "Articles techniques, guides pratiques et retours d'expérience sur DevOps et Cloud",

        searchPlaceholder: "Rechercher un article...",
        previous: "Article précédent",
        next: "Article suivant",
        noResults: "Aucun article trouvé",
        error: "Impossible de charger les articles. Veuillez réessayer plus tard.",

        categories: {
            all: "Tous",
            tutorial: "Tutoriels",
            devops: "DevOps",
            cloud: "Cloud",
            kubernetes: "Kubernetes",
            "ci/cd": "CI/CD",
            terraform: "Terraform",
            ansible: "Ansible",
            monitoring: "Monitoring",
            automation: "Automatisation"
        },

        // Exemples d'articles (statiques pour la démo)
        articles: [
            {
                title: "Déployer une application sur Kubernetes avec Helm",
                excerpt: "Guide complet pour déployer vos applications sur Kubernetes en utilisant Helm Charts et les bonnes pratiques DevOps.",
                date: "À venir",
                readTime: "10 min",
                tags: ["Kubernetes", "Helm", "DevOps"],
                badge: "Tutoriel",
                link: "#"
            },
            {
                title: "Infrastructure as Code avec Terraform",
                excerpt: "Automatisez le provisionnement de votre infrastructure cloud avec Terraform et apprenez les patterns avancés.",
                date: "À venir",
                readTime: "15 min",
                tags: ["Terraform", "IaC", "AWS"],
                badge: "Tutoriel",
                link: "#"
            },
            {
                title: "Optimiser OpenSearch pour la production",
                excerpt: "Retour d'expérience sur l'optimisation et la gestion d'un cluster OpenSearch en production avec des milliers de requêtes par seconde.",
                date: "À venir",
                readTime: "8 min",
                tags: ["OpenSearch", "Performance", "PaaS"],
                badge: "Article",
                link: "#"
            }
        ],

        cta: {
            text: "Section en construction - Articles techniques à venir prochainement !",
            button: "Suivez-moi sur LinkedIn"
        },

        loading: "Chargement des articles…",

        meta: {
            date: "Date",
            readTime: "Temps de lecture",
            readArticle: "Lire l'article",
            views: "vues"
        }
    },

    // ============================================
    // PROJETS
    // ============================================
    projects: {
        loading: "Chargement des projets…"
    },

    // ============================================
    // FOOTER
    // ============================================
    footer: {
        brand: {
            name: "Alice Sindayigaya",
            description: "Ingénieure DevOps spécialisée en Cloud, Automatisation et Supervision. Passionnée par la création d'infrastructures modernes et scalables."
        },

        navigation: {
            title: "Navigation",
            links: [
                { text: "Accueil", href: "#home" },
                { text: "Mon CV", href: "#cv" },
                { text: "Projets", href: "#projects" },
                { text: "Blog & Tutos", href: "#blog" }
            ]
        },

        expertise: {
            title: "Expertises",
            links: [
                { text: "Cloud & PaaS", href: "#services" },
                { text: "Automatisation", href: "#services" },
                { text: "Supervision", href: "#services" },
                { text: "Compétences", href: "#skills" }
            ]
        },

        brand: {
            description: "Ingénieure DevOps spécialisée en Cloud, Automatisation et Supervision. Passionnée par la création d'infrastructures modernes et scalables."
        },
        nav: {
            title: "Navigation",
            cv: "Mon CV"
        },
        expertise: {
            title: "Expertises",
            l1: "Cloud & PaaS",
            l2: "Automatisation",
            l3: "Supervision",
            l4: "Compétences"
        },
        bottom: {
            copyright: "© 2025 Alice Sindayigaya · Tous droits réservés.",
            admin: "Admin"
        },

        social: {
            linkedinAria: "LinkedIn",
            githubAria: "GitHub",
            emailAria: "Email"
        }
    },

    // ============================================
    // BOUTONS & LABELS COMMUNS
    // ============================================
    common: {
        buttons: {
            discoverCV: "Découvrir mon CV",
            myProjects: "Mes Projets",
            blogTutos: "Blog & Tutos",
            viewOnLinkedIn: "Voir sur LinkedIn",
            followOnLinkedIn: "Suivez-moi sur LinkedIn",
            readArticle: "Lire l'article",
            seeMore: "Voir plus",
            backToTop: "Retour en haut de la page"
        },

        labels: {
            date: "Date",
            readTime: "Temps de lecture",
            company: "Entreprise",
            position: "Poste",
            tasks: "Missions",
            skills: "Compétences",
            tools: "Outils",
            features: "Fonctionnalités",
            languages: "Langues",
            hobbies: "Loisirs",
            scrollDown: "Défiler vers le bas",
            loading: "Chargement...",
            comingSoon: "À venir"
        },

        time: {
            current: "Actuel",
            present: "Présent",
            years: "années",
            year: "année",
            months: "mois",
            month: "mois",
            days: "jours",
            day: "jour",
            min: "min"
        },

        messages: {
            constructionNotice: "Section en construction",
            noResults: "Aucun résultat trouvé",
            error: "Une erreur est survenue",
            success: "Succès"
        }
    },

    // ============================================
    // ATTRIBUTS ARIA & ACCESSIBILITÉ
    // ============================================
    aria: {
        navigation: "Navigation principale",
        toggleMenu: "Toggle navigation",
        backToTop: "Retour en haut de la page",
        openInNewTab: "Ouvrir dans un nouvel onglet",
        switchTheme: "Changer le thème",
        switchLanguage: "Changer la langue",
        socialLinks: "Liens vers les réseaux sociaux"
    }
};


    // ============================================
    // TRADUCTIONS EN
    // ============================================
    /**
 * ===================================
 * ENGLISH TRANSLATIONS (EN)
 * Portfolio Alice Sindayigaya - 2025
 * ===================================
 */

const translationsEN = {
    // ============================================
    // META TAGS SEO
    // ============================================
    meta: {
        title: "Alice Sindayigaya | DevOps & Cloud Engineer | AWS, Kubernetes, Terraform",
        description: "DevOps Engineer with 7+ years of experience in Cloud (AWS, GCP), Kubernetes, Terraform, Ansible. PaaS Specialist at Cegedim Cloud. Portfolio & projects.",
        keywords: "DevOps, Cloud Engineer, Kubernetes, AWS, GCP, Terraform, Ansible, CI/CD, Docker, OpenSearch, MongoDB, GitLab, Jenkins, DevOps Engineer France"
    },

    // ============================================
    // NAVIGATION
    // ============================================
    nav: {
        home: "Home",
        cv: "Resume",
        projects: "Projects",
        blog: "Blog & Tutorials",
        logo: "Alice S.",
        toggleAriaLabel: "Toggle navigation"
    },

    // ============================================
    // HERO SECTION
    // ============================================
    hero: {
        label: "DevOps Engineer",
        greeting: "Hi, I'm",
        name: "Alice Sindayigaya",
        descriptions: [
            "Passionate Cloud Architect | Kubernetes & Terraform",
            "DevOps Expert | CI/CD & Automation",
            "PaaS Specialist | OpenSearch & MongoDB",
            "Infrastructure Engineer | AWS & GCP"
        ],
        cta: {
            cv: "View my Resume",
            projects: "My Projects",
            blog: "Blog & Tutorials"
        },
        scrollIndicator: "Scroll Down",
        cards: {
            cloud: {
                title: "Cloud",
                description: "AWS, GCP, Kubernetes"
            },
            automation: {
                title: "Automation",
                description: "Ansible, Terraform, CI/CD"
            },
            monitoring: {
                title: "Monitoring",
                description: "ELK, Grafana, Prometheus"
            }
        }
    },

    // ============================================
    // ABOUT SECTION
    // ============================================
    about: {
        label: "About Me",
        title: "DevOps/SRE Engineer passionate about automation and cloud",
        p1: "DevOps/SRE Engineer with 10+ years of experience in critical environments. Currently Platform Manager at Cegedim Cloud, I drive end-to-end PaaS platforms for OpenSearch and MongoDB — from architecture to documentation, with integrated DevSecOps (Trivy, Vault, SBOM/SLSA).",
        p2a: "Creator of ",
        p2b: " — a digital DevOps/SRE product brand (bilingual CKA guides, AI prompt packs, Kubernetes scripts) distributed on Gumroad and TikTok. French national, eligible for security clearance II 901.",
        stats: {
            devops: "Years DevOps",
            it: "Years IT",
            companies: "Companies"
        },
        imageAlt: "DevOps/SRE Engineer specialized in cloud infrastructure and platform engineering"
    },

    // ============================================
    // CV SECTION
    // ============================================
    cv: {
        label: "Professional Background",
        title: "My Resume",
        description: "Over 7 years of experience in DevOps and Cloud Engineering",

        // Professional Experience
        experience: {
            title: "Professional Experience",
            items: [
                {
                    date: "01/2024 - Present",
                    position: "DevOps Engineer – PaaS Manager",
                    company: "CEGEDIM CLOUD - Labège",
                    tasks: [
                        "Development and optimization of PaaS platforms (OpenSearch, MongoDB)",
                        "Highly available, scalable and secure cloud architecture"
                    ]
                },
                {
                    date: "09/2021 - 12/2023",
                    position: "DevOps Engineer – Elasticsearch",
                    company: "INETUM - Coperbee for Airbus DS/Geo",
                    tasks: [
                        "ELK Stack log platform with Ansible and Terraform automation",
                        "Advanced monitoring with Centreon, Grafana, Prometheus"
                    ]
                },
                {
                    date: "11/2018 - 09/2021",
                    position: "DevOps Engineer",
                    company: "Neosoft & CTS IT - Toulouse",
                    tasks: [
                        "CI/CD: GitLab, Jenkins, SonarQube, Artifactory (BPCE-IT)",
                        "Network monitoring and automation with Kubernetes, Ansible"
                    ]
                }
            ],
            summary: {
                years: "2009 - 2018",
                text: "Various experiences: Airbus, ENEDIS, Limagrain, SOGEA-SATOM",
                tags: ["Web Development", "IT Management"]
            }
        },

        // Education
        education: {
            title: "Education",
            items: [
                {
                    date: "2015 - 2018",
                    degree: "Master's Degree in Computer Science",
                    school: "Clermont Auvergne University",
                    mention: "Honors"
                },
                {
                    date: "2013 - 2014",
                    degree: "Bachelor's Degree in Computer Science",
                    school: "Blaise Pascal University - France",
                    mention: "Honors"
                },
                {
                    date: "2004 - 2009",
                    degree: "Bachelor's Degree in IT Management",
                    school: "Lumière University - Burundi",
                    mention: "High Honors"
                }
            ]
        },

        // Languages & Hobbies
        languages: {
            title: "Languages & Hobbies",
            items: [
                {
                    label: "Languages:",
                    value: "French (Fluent), English (Intermediate)"
                },
                {
                    label: "Hobbies:",
                    value: "Humanitarian association, Gospel Choir, Board games"
                }
            ]
        },

        // Skills & Expertise
        skills: {
            title: "Skills & Expertise",
            categories: [
                {
                    icon: "fa-cloud",
                    title: "Cloud & Infrastructure",
                    skills: ["Kubernetes", "OpenShift", "AWS / GCP / Azure", "OpenStack"]
                },
                {
                    icon: "fa-infinity",
                    title: "Automation & CI/CD",
                    skills: ["Ansible", "Terraform", "GitLab CI/CD", "Jenkins", "ArgoCD"]
                },
                {
                    icon: "fa-chart-line",
                    title: "Monitoring & PaaS",
                    skills: ["OpenSearch", "ELK Stack", "Grafana", "Prometheus", "MongoDB"]
                }
            ]
        },

        exp1: {
            date: "Jan. 2024 → Present",
            title: "DevOps Engineer — Platform Manager",
            company: "Cegedim.cloud · Labège (Permanent)",
            t1: "PaaS management for OpenSearch & MongoDB — architecture, deployment, 24/7 operations",
            t2: "MongoDB 8.0 Ops Manager HA: replica sets, sharding, PBM vs Rubrik backups",
            t3: "GitLab CI/CD full-IaC pipelines (Terraform + Ansible) with DevSecOps: Trivy, Vault, SBOM/SLSA",
            t4: "Prometheus / Grafana / Loki observability — alerting via Zoom Chat webhooks"
        },
        exp2: {
            date: "Sep. 2021 → Dec. 2023",
            title: "DevOps Engineer — ELK Platform / Mission Critical",
            company: "Inetum · Airbus DS/Geo Mission · Toulouse (Permanent)",
            t1: "Mission Critical ELK log platform operations — autonomous P1/P2 incident handling",
            t2: "Full automation: Ansible, Terraform, Python, Bash",
            t3: "Multi-level monitoring: Centreon, Grafana, Prometheus (17 documented checks)"
        },
        exp3: {
            date: "Apr. 2021 → Sep. 2021",
            title: "DevOps Engineer — CI/CD",
            company: "Neosoft · BPCE-IT Mission · Toulouse (Permanent)",
            t1: "CI/CD chain deployment (GitLab, SonarQube, Artifactory, Jenkins) for banking IT",
            t2: "Dev team support and training on pipeline adoption"
        },
        exp4: {
            date: "Nov. 2018 → Apr. 2021",
            title: "DevOps Engineer — Infrastructure & Cybersecurity",
            company: "CTS IT · Toulouse (Permanent)",
            t1: "Network & cybersecurity monitoring: Spectrum, Centreon, Nagios, AWS, OpenShift",
            t2: "Cisco deployment automation via Ansible, GitLab CI and Kubernetes",
            t3: "Python tools development for network compliance checking"
        },
        summary: {
            text: "Airbus Operations (Flask/DevOps internship) · SOGEA-SATOM Burundi (IT Manager, 6 technicians)",
            tag2: "IT Management"
        },
        edu1: { degree: "Master's in Computer Science (Bac+5)", mention: "With Honors" },
        edu2: { degree: "Bachelor's in Computer Science (Bac+3)", mention: "With Honors" },
        edu3: { degree: "Bachelor's in IT Management", mention: "With High Honors" },
        langs: {
            title: "Languages & Hobbies",
            langLabel: "Languages:",
            langValue: "French (Fluent), English (Intermediate)",
            hobbiesLabel: "Hobbies:",
            hobbiesValue: "Humanitarian association, Gospel Choir, Board games"
        },
        skills: {
            title: "Skills & Expertise",
            cat1: "Cloud & Infrastructure",
            cat2: "Automation & CI/CD",
            cat3: "Monitoring & PaaS"
        },
        actions: {
            linkedinButton: "View on LinkedIn"
        }
    },

    // ============================================
    // SERVICES / EXPERTISE SECTION
    // ============================================
    services: {
        label: "Expertise",
        title: "Areas of Expertise",
        description: "Complete solutions in DevOps, Cloud and Automation",

        items: [
            {
                icon: "fa-cloud",
                title: "Cloud Architecture",
                description: "Design and deployment of modern, scalable and secure cloud environments on AWS, GCP and OpenStack.",
                features: [
                    "Kubernetes & OpenShift",
                    "PaaS Platforms",
                    "Infrastructure as Code"
                ]
            },
            {
                icon: "fa-cogs",
                title: "Automation & CI/CD",
                description: "Implementation of complete CI/CD pipelines with deployment and configuration automation.",
                features: [
                    "GitLab, Jenkins, Artifactory",
                    "Ansible & Terraform",
                    "Python & Bash Scripts"
                ],
                featured: true,
                badge: "Specialty"
            },
            {
                icon: "fa-chart-line",
                title: "Monitoring & Supervision",
                description: "Implementation of complete monitoring solutions to ensure performance and availability.",
                features: [
                    "ELK Stack & OpenSearch",
                    "Grafana & Prometheus",
                    "Centreon & Loki"
                ]
            }
        ]
    },

    // ============================================
    // PROJECTS SECTION
    // ============================================
    projects: {
        label: "Achievements",
        title: "Projects & Use Cases",
        description: "Cloud Architectures, Automations and Platforms I designed and deployed",

        filters: {
            all: "All",
            ia: "AI"
        }
    },

    // ============================================
    // SKILLS SECTION
    // ============================================
    skills: {
        label: "Skills",
        title: "Technologies & Tools",
        cat1: "Cloud & Infrastructure",
        cat2: "Automation & IaC",
        cat3: "Monitoring & PaaS",
        cat4: "Web Development",
        cat5: "AI & APIs",
        cat6: "Databases"
    },

    // ============================================
    // BLOG SECTION
    // ============================================
    blog: {
        label: "Knowledge Sharing",
        title: "Blog & Tutorials",
        description: "Technical articles, practical guides and experience feedback on DevOps and Cloud",

        searchPlaceholder: "Search for an article...",
        previous: "Previous article",
        next: "Next article",
        noResults: "No articles found",
        error: "Unable to load articles. Please try again later.",

        categories: {
            all: "All",
            tutorial: "Tutorials",
            devops: "DevOps",
            cloud: "Cloud",
            kubernetes: "Kubernetes",
            "ci/cd": "CI/CD",
            terraform: "Terraform",
            ansible: "Ansible",
            monitoring: "Monitoring",
            automation: "Automation"
        },

        // Sample articles (static for demo)
        articles: [
            {
                title: "Deploy an application on Kubernetes with Helm",
                excerpt: "Complete guide to deploy your applications on Kubernetes using Helm Charts and DevOps best practices.",
                date: "Coming soon",
                readTime: "10 min",
                tags: ["Kubernetes", "Helm", "DevOps"],
                badge: "Tutorial",
                link: "#"
            },
            {
                title: "Infrastructure as Code with Terraform",
                excerpt: "Automate your cloud infrastructure provisioning with Terraform and learn advanced patterns.",
                date: "Coming soon",
                readTime: "15 min",
                tags: ["Terraform", "IaC", "AWS"],
                badge: "Tutorial",
                link: "#"
            },
            {
                title: "Optimize OpenSearch for production",
                excerpt: "Experience feedback on optimizing and managing an OpenSearch cluster in production with thousands of queries per second.",
                date: "Coming soon",
                readTime: "8 min",
                tags: ["OpenSearch", "Performance", "PaaS"],
                badge: "Article",
                link: "#"
            }
        ],

        cta: {
            text: "Section under construction - Technical articles coming soon!",
            button: "Follow me on LinkedIn"
        },

        loading: "Loading articles…",

        meta: {
            date: "Date",
            readTime: "Read time",
            readArticle: "Read article",
            views: "views"
        }
    },

    // ============================================
    // PROJECTS
    // ============================================
    projects: {
        loading: "Loading projects…"
    },

    // ============================================
    // FOOTER
    // ============================================
    footer: {
        brand: {
            name: "Alice Sindayigaya",
            description: "DevOps Engineer specialized in Cloud, Automation and Monitoring. Passionate about creating modern and scalable infrastructures."
        },

        nav: {
            title: "Navigation",
            cv: "My Resume"
        },
        expertise: {
            title: "Expertise",
            l1: "Cloud & PaaS",
            l2: "Automation",
            l3: "Monitoring",
            l4: "Skills"
        },
        bottom: {
            copyright: "© 2025 Alice Sindayigaya · All rights reserved.",
            admin: "Admin"
        },

        social: {
            linkedinAria: "LinkedIn",
            githubAria: "GitHub",
            emailAria: "Email"
        }
    },

    // ============================================
    // COMMON BUTTONS & LABELS
    // ============================================
    common: {
        buttons: {
            discoverCV: "View my Resume",
            myProjects: "My Projects",
            blogTutos: "Blog & Tutorials",
            viewOnLinkedIn: "View on LinkedIn",
            followOnLinkedIn: "Follow me on LinkedIn",
            readArticle: "Read article",
            seeMore: "See more",
            backToTop: "Back to top"
        },

        labels: {
            date: "Date",
            readTime: "Read time",
            company: "Company",
            position: "Position",
            tasks: "Responsibilities",
            skills: "Skills",
            tools: "Tools",
            features: "Features",
            languages: "Languages",
            hobbies: "Hobbies",
            scrollDown: "Scroll down",
            loading: "Loading...",
            comingSoon: "Coming soon"
        },

        time: {
            current: "Present",
            present: "Present",
            years: "years",
            year: "year",
            months: "months",
            month: "month",
            days: "days",
            day: "day",
            min: "min"
        },

        messages: {
            constructionNotice: "Section under construction",
            noResults: "No results found",
            error: "An error occurred",
            success: "Success"
        }
    },

    // ============================================
    // ARIA ATTRIBUTES & ACCESSIBILITY
    // ============================================
    aria: {
        navigation: "Main navigation",
        toggleMenu: "Toggle navigation",
        backToTop: "Back to top",
        openInNewTab: "Open in new tab",
        switchTheme: "Switch theme",
        switchLanguage: "Switch language",
        socialLinks: "Social media links"
    }
};


    // ============================================
    // CLASSE I18N
    // ============================================
    class I18n {
        constructor() {
            this.translations = { fr: translationsFR, en: translationsEN };
            this.currentLang = null;
            this.defaultLang = 'fr';
            this.init();
        }

        init() {
            console.log('🌐 Initialisation du système i18n...');
            const savedLang = localStorage.getItem('portfolio_language');
            const browserLang = navigator.language.split('-')[0];
            const lang = savedLang || (browserLang === 'en' ? 'en' : 'fr');

            this.currentLang = lang;
            this.applyLanguage(lang);
            console.log('✅ i18n initialisé:', lang);
        }

        t(key, vars = {}) {
            const keys = key.split('.');
            let value = this.translations[this.currentLang];

            for (const k of keys) {
                if (value && typeof value === 'object') {
                    value = value[k];
                } else {
                    return key;
                }
            }

            if (typeof value === 'string') {
                return value.replace(/{{(w+)}}/g, (match, varName) => {
                    return vars[varName] || match;
                });
            }

            return key;
        }

        switchLanguage(lang) {
            if (lang !== 'fr' && lang !== 'en') return;
            this.currentLang = lang;
            localStorage.setItem('portfolio_language', lang);
            this.applyLanguage(lang);
            window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: lang } }));
        }

        applyLanguage(lang) {
            document.documentElement.lang = lang;
            this.translateElements();
            this.updateMetaTags();
        }

        translateElements() {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                el.textContent = this.t(el.getAttribute('data-i18n'));
            });
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                el.placeholder = this.t(el.getAttribute('data-i18n-placeholder'));
            });
        }

        updateMetaTags() {
            const title = this.t('meta.title');
            const description = this.t('meta.description');

            document.title = title;

            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', description);

            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.setAttribute('content', title);

            const ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) ogDesc.setAttribute('content', description);
        }

        getCurrentLanguage() {
            return this.currentLang;
        }
    }

    // ============================================
    // COMPOSANT LANG SWITCHER
    // ============================================
    class LangSwitcher {
        constructor(i18nInstance) {
            this.i18n = i18nInstance;
            this.init();
        }

        init() {
            this.createSwitcher();
            console.log('✅ LangSwitcher initialisé');
        }

        createSwitcher() {
            // Le bouton #langToggle est déjà dans le HTML et géré par app.js
            if (document.getElementById('langToggle')) return;

            const header = document.querySelector('.header .container');
            if (!header) return;

            const switcherHTML = `
                <div class="lang-switcher">
                    <button class="lang-btn" data-lang="fr" aria-label="Français">FR</button>
                    <button class="lang-btn" data-lang="en" aria-label="English">EN</button>
                </div>
            `;

            const navToggle = header.querySelector('.nav-toggle');
            if (navToggle) {
                navToggle.insertAdjacentHTML('beforebegin', switcherHTML);
            } else {
                header.insertAdjacentHTML('beforeend', switcherHTML);
            }

            this.attachEvents();
            this.updateUI(this.i18n.getCurrentLanguage());
        }

        attachEvents() {
            const buttons = document.querySelectorAll('.lang-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const lang = btn.getAttribute('data-lang');
                    this.switchLanguage(lang);
                });
            });
        }

        switchLanguage(lang) {
            this.i18n.switchLanguage(lang);
            this.updateUI(lang);
        }

        updateUI(activeLang) {
            const buttons = document.querySelectorAll('.lang-btn');
            buttons.forEach(btn => {
                const btnLang = btn.getAttribute('data-lang');
                if (btnLang === activeLang) {
                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');
                } else {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                }
            });
        }
    }

    // ============================================
    // INITIALISATION
    // ============================================
    function initI18n() {
        try {
            console.log('🌐 Initialisation du système i18n (bundle)...');
            const i18n = new I18n();

            // Exposer AVANT LangSwitcher pour que app.js puisse l'utiliser
            window.i18n = i18n;

            try {
                new LangSwitcher(i18n);
            } catch (e) {
                console.warn('LangSwitcher ignoré:', e.message);
            }

            console.log('✅ Système i18n initialisé avec succès');
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation i18n:', error);
        }
    }

    // Lancer l'initialisation
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initI18n);
    } else {
        initI18n();
    }
})();
