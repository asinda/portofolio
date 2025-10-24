// ===================================
// Configuration Supabase
// ===================================

// ⚠️ IMPORTANT : Remplacez ces valeurs par vos propres clés Supabase
// Obtenez-les sur : https://app.supabase.com/project/_/settings/api

const SUPABASE_URL = 'VOTRE_SUPABASE_URL'; // Ex: https://xxx.supabase.co
const SUPABASE_ANON_KEY = 'VOTRE_SUPABASE_ANON_KEY'; // La clé publique (anon/public)

// Initialisation du client Supabase
let supabase = null;

// Vérifier si les clés sont configurées
if (SUPABASE_URL === 'VOTRE_SUPABASE_URL' || SUPABASE_ANON_KEY === 'VOTRE_SUPABASE_ANON_KEY') {
    console.error('⚠️ Configuration Supabase manquante !');
    console.log('📝 Suivez les instructions dans SUPABASE_SETUP.md pour configurer votre base de données');
} else {
    // Créer l'instance Supabase
    supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase initialisé avec succès');
}

// ===================================
// Configuration des tables
// ===================================

const TABLES = {
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

// ===================================
// Configuration du Storage
// ===================================

const STORAGE_BUCKETS = {
    IMAGES: 'portfolio-images',
    DOCUMENTS: 'portfolio-documents'
};

// ===================================
// Export de la configuration
// ===================================

window.SupabaseConfig = {
    supabase,
    TABLES,
    STORAGE_BUCKETS,
    isConfigured: () => supabase !== null
};
