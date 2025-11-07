#!/usr/bin/env node
/**
 * Script d'import des données portfolio vers Supabase
 *
 * Usage:
 *   node import_to_supabase.js portfolio_data.json
 *
 * Prérequis:
 *   - Fichier .env configuré avec les clés Supabase
 *   - Tables Supabase créées (voir SUPABASE_SETUP.md)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
config({ path: resolve(__dirname, '../.env') });

// Vérifier les variables d'environnement
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('❌ Variables d\'environnement manquantes');
    console.log('📝 Créez un fichier .env dans backend/ avec :');
    console.log('   SUPABASE_URL=https://xxx.supabase.co');
    console.log('   SUPABASE_SERVICE_KEY=xxx');
    process.exit(1);
}

// Initialiser Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// Noms des tables
const TABLES = {
    PROFILE: 'profile',
    EXPERIENCE: 'experiences',
    EDUCATION: 'education',
    PROJECTS: 'projects',
    SKILLS_TECHNICAL: 'skills_technical',
    SKILLS_LANGUAGES: 'skills_languages',
    SKILLS_SOFT: 'skills_soft',
    CERTIFICATIONS: 'certifications'
};

/**
 * Importe les données dans Supabase
 */
async function importData(filePath) {
    console.log('='  .repeat(60));
    console.log('  IMPORT DES DONNÉES DANS SUPABASE');
    console.log('='  .repeat(60));
    console.log(`\n📁 Fichier source : ${filePath}\n`);

    // Lire le fichier JSON
    let data;
    try {
        const fileContent = readFileSync(filePath, 'utf-8');
        data = JSON.parse(fileContent);
    } catch (error) {
        console.error('❌ Erreur de lecture du fichier:', error.message);
        process.exit(1);
    }

    let stats = {
        success: 0,
        errors: 0
    };

    // Importer le profil
    if (data.profile) {
        console.log('👤 Import du profil...');
        const result = await importProfile(data.profile);
        result ? stats.success++ : stats.errors++;
    }

    // Importer les expériences
    if (data.experience && data.experience.length > 0) {
        console.log(`💼 Import de ${data.experience.length} expériences...`);
        const result = await importBatch(TABLES.EXPERIENCE, data.experience);
        stats.success += result.success;
        stats.errors += result.errors;
    }

    // Importer la formation
    if (data.education && data.education.length > 0) {
        console.log(`🎓 Import de ${data.education.length} formations...`);
        const result = await importBatch(TABLES.EDUCATION, data.education);
        stats.success += result.success;
        stats.errors += result.errors;
    }

    // Importer les projets
    if (data.projects && data.projects.length > 0) {
        console.log(`🚀 Import de ${data.projects.length} projets...`);
        const result = await importBatch(TABLES.PROJECTS, data.projects);
        stats.success += result.success;
        stats.errors += result.errors;
    }

    // Importer les compétences techniques
    if (data.skills?.technical && data.skills.technical.length > 0) {
        console.log(`⚡ Import de ${data.skills.technical.length} compétences techniques...`);
        const result = await importBatch(TABLES.SKILLS_TECHNICAL, data.skills.technical);
        stats.success += result.success;
        stats.errors += result.errors;
    }

    // Importer les langues
    if (data.skills?.languages && data.skills.languages.length > 0) {
        console.log(`🌍 Import de ${data.skills.languages.length} langues...`);
        const result = await importBatch(TABLES.SKILLS_LANGUAGES, data.skills.languages);
        stats.success += result.success;
        stats.errors += result.errors;
    }

    // Importer les soft skills
    if (data.skills?.soft && data.skills.soft.length > 0) {
        console.log(`💡 Import de ${data.skills.soft.length} soft skills...`);
        const result = await importBatch(TABLES.SKILLS_SOFT, data.skills.soft);
        stats.success += result.success;
        stats.errors += result.errors;
    }

    // Importer les certifications
    if (data.certifications && data.certifications.length > 0) {
        console.log(`🏆 Import de ${data.certifications.length} certifications...`);
        const result = await importBatch(TABLES.CERTIFICATIONS, data.certifications);
        stats.success += result.success;
        stats.errors += result.errors;
    }

    // Résultats
    console.log('\n' + '='.repeat(60));
    console.log('  RÉSULTATS');
    console.log('='.repeat(60));
    console.log(`✅ Réussis : ${stats.success}`);
    console.log(`❌ Erreurs : ${stats.errors}`);
    console.log('\n✅ Import terminé !\n');
}

/**
 * Importe le profil (upsert si existe déjà)
 */
async function importProfile(profile) {
    try {
        const { data, error } = await supabase
            .from(TABLES.PROFILE)
            .upsert({ id: 1, ...profile }, { onConflict: 'id' })
            .select();

        if (error) throw error;

        console.log('   ✅ Profil importé');
        return true;
    } catch (error) {
        console.error('   ❌ Erreur profil:', error.message);
        return false;
    }
}

/**
 * Importe un lot d'enregistrements
 */
async function importBatch(table, items) {
    let success = 0;
    let errors = 0;

    for (const item of items) {
        try {
            const { error } = await supabase
                .from(table)
                .insert([item]);

            if (error) throw error;

            success++;
            process.stdout.write('.');
        } catch (error) {
            errors++;
            process.stdout.write('x');
            console.error(`\n   ❌ Erreur: ${error.message}`);
        }
    }

    console.log(`\n   ✅ ${success} importés, ${errors} erreurs`);
    return { success, errors };
}

/**
 * Fonction principale
 */
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.error('❌ Usage: node import_to_supabase.js <fichier.json>');
        console.log('\nExemple:');
        console.log('  node import_to_supabase.js portfolio_data.json');
        process.exit(1);
    }

    const filePath = resolve(args[0]);

    try {
        await importData(filePath);
    } catch (error) {
        console.error('\n❌ Erreur lors de l\'import:', error.message);
        process.exit(1);
    }
}

// Exécuter
main();
