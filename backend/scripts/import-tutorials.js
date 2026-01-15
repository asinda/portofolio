/**
 * SCRIPT D'IMPORT DES TUTORIELS DANS SUPABASE
 * Sprint 3 - Portfolio Alice Sindayigaya
 *
 * Ce script importe les 4 tutoriels CI/CD dans la table blog_posts de Supabase
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Utiliser service key pour bypass RLS

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ ERREUR: Variables d\'environnement SUPABASE_URL et SUPABASE_SERVICE_KEY requises');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Chemins des fichiers
const TUTORIALS_DIR = path.join(__dirname, '../../frontend/public/blog/tutorials');
const TUTORIALS_JSON = path.join(__dirname, '../../frontend/public/blog/tutorials.json');

// Mapping des catégories JSON vers catégories DB
const CATEGORY_MAPPING = {
    'CI/CD': 'CI/CD',
    'DevOps': 'DevOps',
    'Cloud': 'Cloud',
    'Automation': 'Automation'
};

/**
 * Lire le contenu d'un fichier markdown
 */
function readMarkdownFile(filename) {
    const filePath = path.join(TUTORIALS_DIR, filename);
    if (!fs.existsSync(filePath)) {
        throw new Error(`Fichier non trouvé: ${filePath}`);
    }
    return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Générer un slug depuis un titre
 */
function generateSlug(title) {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

/**
 * Calculer le temps de lecture en minutes
 */
function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Extraire un extrait du contenu markdown
 */
function extractExcerpt(content, maxLength = 300) {
    // Retirer les headers markdown
    let plainText = content
        .replace(/^#+ .+$/gm, '') // Headers
        .replace(/```[\s\S]*?```/g, '') // Code blocks
        .replace(/`[^`]+`/g, '') // Inline code
        .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
        .replace(/\*(.+?)\*/g, '$1') // Italic
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Links
        .replace(/^\s*[-*+]\s+/gm, '') // Lists
        .replace(/^\s*\d+\.\s+/gm, '') // Numbered lists
        .trim();

    // Prendre les premiers paragraphes
    const paragraphs = plainText.split(/\n\n+/).filter(p => p.trim().length > 0);

    if (paragraphs.length === 0) {
        return content.substring(0, maxLength) + '...';
    }

    let excerpt = '';
    for (const para of paragraphs) {
        if (excerpt.length + para.length <= maxLength) {
            excerpt += para + ' ';
        } else {
            break;
        }
    }

    excerpt = excerpt.trim();
    if (excerpt.length < maxLength && paragraphs.length > 0) {
        excerpt = paragraphs[0];
    }

    if (excerpt.length > maxLength) {
        excerpt = excerpt.substring(0, maxLength);
        const lastPeriod = excerpt.lastIndexOf('.');
        if (lastPeriod > maxLength / 2) {
            excerpt = excerpt.substring(0, lastPeriod + 1);
        } else {
            excerpt += '...';
        }
    }

    return excerpt;
}

/**
 * Convertir les métadonnées du JSON en format Supabase
 */
function convertTutorialToPost(tutorial, content, userId) {
    const slug = generateSlug(tutorial.title);
    const readTime = parseInt(tutorial.readTime) || calculateReadTime(content);
    const excerpt = tutorial.description || extractExcerpt(content);
    const category = CATEGORY_MAPPING[tutorial.category] || 'Tutorial';

    return {
        user_id: userId,
        title: tutorial.title,
        slug: slug,
        content: content,
        excerpt: excerpt,
        cover_image: tutorial.image,
        category: category,
        tags: tutorial.tags || [],
        status: 'published',
        published_at: new Date(tutorial.date).toISOString(),
        views: 0,
        read_time: readTime,
        seo_title: tutorial.title,
        seo_description: excerpt.substring(0, 160),
        seo_keywords: tutorial.tags || []
    };
}

/**
 * Importer les tutoriels dans Supabase
 */
async function importTutorials() {
    console.log('🚀 Démarrage de l\'import des tutoriels...\n');

    try {
        // 1. Lire le fichier JSON des tutoriels
        console.log('📖 Lecture du fichier tutorials.json...');
        const tutorialsData = JSON.parse(fs.readFileSync(TUTORIALS_JSON, 'utf-8'));
        console.log(`✅ ${tutorialsData.tutorials.length} tutoriels trouvés\n`);

        // 2. Récupérer l'utilisateur (premier user dans auth.users)
        console.log('👤 Récupération de l\'utilisateur...');
        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

        if (usersError) {
            throw new Error(`Erreur lors de la récupération des utilisateurs: ${usersError.message}`);
        }

        if (!users || users.length === 0) {
            throw new Error('❌ Aucun utilisateur trouvé. Créez d\'abord un utilisateur dans Supabase Authentication.');
        }

        const userId = users[0].id;
        console.log(`✅ Utilisateur trouvé: ${users[0].email} (${userId})\n`);

        // 3. Vérifier si la table blog_posts existe
        console.log('🔍 Vérification de la table blog_posts...');
        const { data: tableCheck, error: tableError } = await supabase
            .from('blog_posts')
            .select('id')
            .limit(1);

        if (tableError) {
            console.error('❌ La table blog_posts n\'existe pas encore !');
            console.error('📋 Exécutez d\'abord le script SQL: backend/database/blog-schema.sql');
            console.error('   Dans Supabase > SQL Editor > Nouvelle requête > Coller le contenu du fichier');
            process.exit(1);
        }
        console.log('✅ Table blog_posts trouvée\n');

        // 4. Supprimer les tutoriels existants (si relance du script)
        console.log('🗑️  Suppression des tutoriels existants...');
        const { error: deleteError } = await supabase
            .from('blog_posts')
            .delete()
            .eq('user_id', userId)
            .in('category', ['CI/CD', 'DevOps', 'Tutorial']);

        if (deleteError) {
            console.warn(`⚠️  Avertissement lors de la suppression: ${deleteError.message}`);
        } else {
            console.log('✅ Tutoriels existants supprimés\n');
        }

        // 5. Importer chaque tutoriel
        console.log('📝 Import des tutoriels:\n');
        const posts = [];

        for (const tutorial of tutorialsData.tutorials) {
            console.log(`   • ${tutorial.title}`);

            // Lire le contenu du fichier markdown
            const filename = path.basename(tutorial.file);
            const content = readMarkdownFile(filename);

            // Convertir en format Supabase
            const post = convertTutorialToPost(tutorial, content, userId);
            posts.push(post);

            console.log(`     → Slug: ${post.slug}`);
            console.log(`     → Catégorie: ${post.category}`);
            console.log(`     → Tags: ${post.tags.join(', ')}`);
            console.log(`     → Temps de lecture: ${post.read_time} min`);
            console.log(`     → Taille contenu: ${content.length} caractères\n`);
        }

        // 6. Insérer dans Supabase
        console.log('💾 Insertion dans Supabase...');
        const { data: insertedPosts, error: insertError } = await supabase
            .from('blog_posts')
            .insert(posts)
            .select();

        if (insertError) {
            throw new Error(`Erreur lors de l'insertion: ${insertError.message}`);
        }

        console.log(`✅ ${insertedPosts.length} tutoriels importés avec succès !\n`);

        // 7. Afficher le récapitulatif
        console.log('📊 Récapitulatif:');
        console.log('   =====================================');
        insertedPosts.forEach(post => {
            console.log(`   • ${post.title}`);
            console.log(`     ID: ${post.id}`);
            console.log(`     Slug: ${post.slug}`);
            console.log(`     Status: ${post.status}`);
            console.log(`     Publié le: ${new Date(post.published_at).toLocaleDateString('fr-FR')}`);
            console.log('');
        });

        console.log('🎉 Import terminé avec succès !');
        console.log('\n🔗 Testez l\'API:');
        console.log(`   curl http://localhost:5000/api/blog/posts`);
        console.log(`   curl http://localhost:5000/api/blog/posts/${insertedPosts[0].slug}`);

    } catch (error) {
        console.error('\n❌ Erreur lors de l\'import:', error.message);
        console.error(error);
        process.exit(1);
    }
}

// Exécuter l'import
importTutorials();
