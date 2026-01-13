/**
 * ===================================
 * ENGLISH TRANSLATIONS (EN)
 * Portfolio Alice Sindayigaya - 2025
 * ===================================
 */

export default {
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
