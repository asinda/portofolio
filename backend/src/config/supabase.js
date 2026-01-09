import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

// Mode de développement avec fallback sur données locales
const USE_LOCAL_DATA = process.env.NODE_ENV === 'development' &&
    (!process.env.SUPABASE_URL || process.env.SUPABASE_URL === 'https://placeholder.supabase.co');

// Vérifier que les variables d'environnement sont définies (sauf en mode dev avec données locales)
if (!USE_LOCAL_DATA && (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY)) {
    logger.error('❌ Erreur : Variables d\'environnement Supabase manquantes');
    logger.info('📝 Créez un fichier .env à partir de .env.example');
    process.exit(1);
}

let supabase = null;

// Créer le client Supabase avec la clé service (pour les opérations backend)
if (!USE_LOCAL_DATA) {
    supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
    logger.info('✅ Mode Supabase activé');
} else {
    logger.info('⚠️  Mode développement : Utilisation des données locales (data.json)');
    logger.info('💡 Pour utiliser Supabase, configurez les vraies clés dans .env');
}

// Noms des tables
export const TABLES = {
    PROFILE: 'profile',
    EXPERIENCE: 'experiences',
    EDUCATION: 'education',
    PROJECTS: 'projects',
    SKILLS_TECHNICAL: 'skills_technical',
    SKILLS_LANGUAGES: 'skills_languages',
    SKILLS_SOFT: 'skills_soft',
    CERTIFICATIONS: 'certifications',
    MEDIA: 'media'
};

// Noms des buckets de stockage
export const STORAGE_BUCKETS = {
    IMAGES: 'portfolio-images',
    DOCUMENTS: 'portfolio-documents'
};

export { USE_LOCAL_DATA };
export default supabase;
