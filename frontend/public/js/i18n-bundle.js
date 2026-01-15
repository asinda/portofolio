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
        title: "DevOps Engineer passionate about automation and cloud",
        paragraphs: [
            "Passionate about innovation and technical excellence, I have developed solid expertise in DevOps and Cloud Engineering through enriching experiences. Currently Platform Manager at Cegedim Cloud, I design and optimize high-performance PaaS architectures on OpenSearch and MongoDB.",
            "My approach combines technical rigor, strategic vision, and passion for automation. I enjoy tackling complex challenges, sharing knowledge, and contributing to the evolution of DevOps practices in the tech ecosystem."
        ],
        stats: {
            devops: {
                number: "7+",
                label: "Years DevOps"
            },
            it: {
                number: "15+",
                label: "Years IT"
            },
            companies: {
                number: "5",
                label: "Companies"
            }
        },
        imageAlt: "DevOps Engineer specialized in API development and cloud programming"
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
            cloud: "Cloud & PaaS",
            automation: "Automation",
            monitoring: "Monitoring",
            opensource: "Open Source"
        }
    },

    // ============================================
    // SKILLS SECTION
    // ============================================
    skills: {
        label: "Skills",
        title: "Technologies & Tools",

        categories: [
            {
                icon: "fa-cloud",
                title: "Cloud Platforms",
                skills: ["Kubernetes", "AWS", "GCP", "OpenShift", "OpenStack"]
            },
            {
                icon: "fa-cogs",
                title: "Automation",
                skills: ["Ansible", "Terraform", "Python", "Bash", "Java", "PHP"]
            },
            {
                icon: "fa-chart-bar",
                title: "Monitoring",
                skills: ["OpenSearch", "ELK Stack", "Grafana", "Prometheus", "Centreon", "Loki"]
            },
            {
                icon: "fa-sync-alt",
                title: "CI/CD",
                skills: ["GitLab", "Jenkins", "Sonar", "Artifactory", "Docker"]
            },
            {
                icon: "fa-database",
                title: "Databases",
                skills: ["MongoDB", "OpenSearch", "Elasticsearch", "PostgreSQL"]
            },
            {
                icon: "fa-network-wired",
                title: "Network & Cybersecurity",
                skills: ["Spectrum", "Nagios", "Cisco"]
            }
        ]
    },

    // ============================================
    // BLOG SECTION
    // ============================================
    blog: {
        label: "Knowledge Sharing",
        title: "Blog & Tutorials",
        description: "Technical articles, practical guides and experience feedback on DevOps and Cloud",

        categories: {
            all: "All articles",
            tutorial: "Tutorials",
            devops: "DevOps",
            cloud: "Cloud",
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

        meta: {
            date: "Date",
            readTime: "Read time",
            readArticle: "Read article"
        }
    },

    // ============================================
    // FOOTER
    // ============================================
    footer: {
        brand: {
            name: "Alice Sindayigaya",
            description: "DevOps Engineer specialized in Cloud, Automation and Monitoring. Passionate about creating modern and scalable infrastructures."
        },

        navigation: {
            title: "Navigation",
            links: [
                { text: "Home", href: "#home" },
                { text: "My Resume", href: "#cv" },
                { text: "Projects", href: "#projects" },
                { text: "Blog & Tutorials", href: "#blog" }
            ]
        },

        expertise: {
            title: "Expertise",
            links: [
                { text: "Cloud & PaaS", href: "#services" },
                { text: "Automation", href: "#services" },
                { text: "Monitoring", href: "#services" },
                { text: "Skills", href: "#skills" }
            ]
        },

        bottom: {
            copyright: "© 2025 Alice Sindayigaya. All rights reserved.",
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
            const elements = document.querySelectorAll('[data-i18n]');
            elements.forEach(el => {
                const key = el.getAttribute('data-i18n');
                el.textContent = this.t(key);
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
            const langSwitcher = new LangSwitcher(i18n);

            // Exposer globalement pour debugging
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                window.i18n = i18n;
                window.langSwitcher = langSwitcher;
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
