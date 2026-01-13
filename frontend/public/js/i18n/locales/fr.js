/**
 * ===================================
 * TRADUCTIONS FRANÇAISES (FR)
 * Portfolio Alice Sindayigaya - 2025
 * ===================================
 */

export default {
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
        paragraphs: [
            "Passionnée par l'innovation et l'excellence technique, j'ai développé une expertise solide en DevOps et Cloud Engineering à travers des expériences enrichissantes. Actuellement Responsable de Plateforme chez Cegedim Cloud, je conçois et optimise des architectures PaaS haute performance sur OpenSearch et MongoDB.",
            "Mon approche combine rigueur technique, vision stratégique et passion pour l'automatisation. J'aime relever des défis complexes, partager mes connaissances et contribuer à l'évolution des pratiques DevOps dans l'écosystème tech."
        ],
        stats: {
            devops: {
                number: "7+",
                label: "Années DevOps"
            },
            it: {
                number: "15+",
                label: "Années IT"
            },
            companies: {
                number: "5",
                label: "Entreprises"
            }
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
            cloud: "Cloud & PaaS",
            automation: "Automatisation",
            monitoring: "Supervision",
            opensource: "Open Source"
        }
    },

    // ============================================
    // SECTION COMPÉTENCES
    // ============================================
    skills: {
        label: "Compétences",
        title: "Technologies & Outils",

        categories: [
            {
                icon: "fa-cloud",
                title: "Plateformes Cloud",
                skills: ["Kubernetes", "AWS", "GCP", "OpenShift", "OpenStack"]
            },
            {
                icon: "fa-cogs",
                title: "Automatisation",
                skills: ["Ansible", "Terraform", "Python", "Bash", "Java", "PHP"]
            },
            {
                icon: "fa-chart-bar",
                title: "Supervision",
                skills: ["OpenSearch", "ELK Stack", "Grafana", "Prometheus", "Centreon", "Loki"]
            },
            {
                icon: "fa-sync-alt",
                title: "CI/CD",
                skills: ["GitLab", "Jenkins", "Sonar", "Artifactory", "Docker"]
            },
            {
                icon: "fa-database",
                title: "Bases de Données",
                skills: ["MongoDB", "OpenSearch", "Elasticsearch", "PostgreSQL"]
            },
            {
                icon: "fa-network-wired",
                title: "Réseau & Cybersécurité",
                skills: ["Spectrum", "Nagios", "Cisco"]
            }
        ]
    },

    // ============================================
    // SECTION BLOG
    // ============================================
    blog: {
        label: "Partage de Connaissances",
        title: "Blog & Tutoriels",
        description: "Articles techniques, guides pratiques et retours d'expérience sur DevOps et Cloud",

        categories: {
            all: "Tous les articles",
            tutorial: "Tutoriels",
            devops: "DevOps",
            cloud: "Cloud",
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

        meta: {
            date: "Date",
            readTime: "Temps de lecture",
            readArticle: "Lire l'article"
        }
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

        bottom: {
            copyright: "© 2025 Alice Sindayigaya. Tous droits réservés.",
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
