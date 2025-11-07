#!/usr/bin/env node
/**
 * Script rapide pour récupérer les données LinkedIn publiques
 * Usage: node quick_linkedin_fetch.js
 */

import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { writeFileSync } from 'fs';

const LINKEDIN_PROFILE_URL = 'https://www.linkedin.com/in/alicesindayigaya';

async function fetchLinkedInProfile() {
    console.log('🔍 Récupération des données LinkedIn...\n');
    console.log(`URL: ${LINKEDIN_PROFILE_URL}\n`);

    try {
        // Tentative de fetch
        const response = await fetch(LINKEDIN_PROFILE_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept-Language': 'fr-FR,fr;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
        });

        if (response.status === 999) {
            console.log('❌ LinkedIn a bloqué la requête (code 999)\n');
            console.log('💡 Solutions alternatives :\n');
            console.log('1. Copier-coller manuellement depuis votre profil');
            console.log('2. Utiliser l\'export GDPR LinkedIn (voir LINKEDIN_DATA_EXPORT.md)');
            console.log('3. Remplir via le panel admin (http://localhost:8000/admin)\n');
            return fallbackToManualEntry();
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Tentative d'extraction (très limitée car LinkedIn charge via JS)
        const profileData = {
            profile: {
                name: "Alice Sindayigaya",
                title: extractTitle($) || "Développeuse Full Stack",
                location: extractLocation($) || "France",
                email: "alice.sindayigaya@example.com",
                phone: "+33 X XX XX XX XX",
                linkedin: LINKEDIN_PROFILE_URL,
                github: "https://github.com/asinda",
                website: "",
                photo: "images/profile.jpg",
                about: extractAbout($) || "Passionnée par le développement web et les nouvelles technologies."
            },
            experience: [],
            education: [],
            skills: {
                technical: [],
                languages: [],
                soft: []
            },
            projects: [],
            certifications: []
        };

        console.log('⚠️  Extraction limitée - LinkedIn charge le contenu via JavaScript\n');
        console.log('📝 Données extraites :');
        console.log(`   Nom: ${profileData.profile.name}`);
        console.log(`   Titre: ${profileData.profile.title}`);
        console.log(`   Localisation: ${profileData.profile.location}\n`);

        return profileData;

    } catch (error) {
        console.error('❌ Erreur:', error.message);
        return fallbackToManualEntry();
    }
}

function extractTitle($) {
    // Tentatives avec différents sélecteurs
    const selectors = [
        '.top-card-layout__headline',
        'h2.mt1',
        '.pv-text-details__left-panel .text-body-medium'
    ];

    for (const selector of selectors) {
        const text = $(selector).first().text().trim();
        if (text) return text;
    }

    return null;
}

function extractLocation($) {
    const selectors = [
        '.top-card__subline-item',
        '.pv-text-details__left-panel .text-body-small'
    ];

    for (const selector of selectors) {
        const text = $(selector).first().text().trim();
        if (text && !text.includes('followers')) return text;
    }

    return null;
}

function extractAbout($) {
    const selectors = [
        '.core-section-container__content .break-words',
        '.pv-about__summary-text'
    ];

    for (const selector of selectors) {
        const text = $(selector).first().text().trim();
        if (text) return text;
    }

    return null;
}

function fallbackToManualEntry() {
    console.log('\n📋 SAISIE MANUELLE RECOMMANDÉE\n');
    console.log('Je vais créer un template avec vos informations de base.\n');

    // Créer un template avec les infos connues
    const profileData = {
        profile: {
            name: "Alice Sindayigaya",
            title: "Développeuse / Analyste",
            location: "France",
            email: "alicesindayigaya@gmail.com",
            phone: "+33 X XX XX XX XX",
            linkedin: "https://www.linkedin.com/in/alicesindayigaya",
            github: "https://github.com/asinda",
            website: "",
            photo: "images/profile.jpg",
            about: "Professionnelle passionnée par la technologie et l'innovation. Spécialisée dans le développement et l'analyse de solutions numériques."
        },
        experience: [
            {
                position: "Votre Poste Actuel",
                company: "Cegedim",
                location: "France",
                startDate: "Mois Année",
                endDate: "Présent",
                current: true,
                description: "Décrivez vos responsabilités principales...",
                achievements: [
                    "Réalisation importante #1",
                    "Réalisation importante #2",
                    "Réalisation importante #3"
                ]
            }
        ],
        education: [
            {
                degree: "Votre Diplôme",
                institution: "Votre École/Université",
                location: "Ville, Pays",
                startDate: "Année",
                endDate: "Année",
                description: "Spécialisation, mention..."
            }
        ],
        skills: {
            technical: [
                { name: "JavaScript", level: "Avancé", category: "Frontend" },
                { name: "Python", level: "Intermédiaire", category: "Backend" },
                { name: "SQL", level: "Avancé", category: "Database" },
                { name: "Git", level: "Avancé", category: "Outils" }
            ],
            languages: [
                { name: "Français", level: "Natif" },
                { name: "Anglais", level: "Courant" }
            ],
            soft: [
                { name: "Travail d'équipe", level: "Excellent" },
                { name: "Communication", level: "Excellent" },
                { name: "Résolution de problèmes", level: "Excellent" }
            ]
        },
        projects: [
            {
                title: "Portfolio Personnel",
                description: "Développement d'un portfolio moderne avec backend API et panel d'administration",
                startDate: "Octobre 2024",
                endDate: "Présent",
                url: "",
                image: "images/project1.jpg",
                technologies: ["HTML", "CSS", "JavaScript", "Node.js", "Supabase"],
                category: "Personnel",
                featured: true
            }
        ],
        certifications: []
    };

    return profileData;
}

async function main() {
    console.log('='  .repeat(60));
    console.log('  RÉCUPÉRATION RAPIDE DES DONNÉES LINKEDIN');
    console.log('='  .repeat(60) + '\n');

    const profileData = await fetchLinkedInProfile();

    // Sauvegarder
    const outputPath = '../../frontend/public/data.json';
    writeFileSync(outputPath, JSON.stringify(profileData, null, 2));

    console.log('✅ Fichier data.json mis à jour !\n');
    console.log('📍 Emplacement: frontend/public/data.json\n');
    console.log('🌐 Rechargez votre navigateur: http://localhost:8000\n');
    console.log('💡 Pour compléter vos données :');
    console.log('   1. Éditez data.json manuellement');
    console.log('   2. OU utilisez le panel admin: http://localhost:8000/admin');
    console.log('   3. OU suivez le guide: docs/LINKEDIN_DATA_EXPORT.md\n');
}

main().catch(console.error);
