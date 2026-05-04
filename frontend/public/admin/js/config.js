// ===================================
// Configuration Supabase
// ===================================

// ⚠️ IMPORTANT : Remplacez ces valeurs par vos propres clés Supabase
// Obtenez-les sur : https://app.supabase.com/project/_/settings/api

const SUPABASE_URL = 'https://hfmxchnbivkdvxenbech.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbXhjaG5iaXZrZHZ4ZW5iZWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDIzMjEsImV4cCI6MjA3NzkxODMyMX0._tMACo7wZfyQ43SiJLsfH-W4wVhGVVtSUOJ_eZvdBDQ';

// Initialisation du client Supabase
let supabaseClient = null;

// Vérifier si les clés sont configurées
if (SUPABASE_URL === 'VOTRE_SUPABASE_URL' || SUPABASE_ANON_KEY === 'VOTRE_SUPABASE_ANON_KEY') {
    console.error('⚠️ Configuration Supabase manquante !');
    console.log('📝 Suivez les instructions dans SUPABASE_SETUP.md pour configurer votre base de données');
} else {
    // Créer l'instance Supabase
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase initialisé avec succès');
}

// ===================================
// Export de la configuration
// ===================================

window.SupabaseConfig = {
    supabase: supabaseClient,
    TABLES: {
        PROFILE: 'profile',
        EXPERIENCE: 'experiences',
        EDUCATION: 'education',
        PROJECTS: 'projects',
        SKILLS_TECHNICAL: 'skills_technical',
        SKILLS_LANGUAGES: 'skills_languages',
        SKILLS_SOFT: 'skills_soft',
        CERTIFICATIONS: 'certifications',
        BLOG_POSTS: 'blog_posts',
        BLOG_COMMENTS: 'blog_comments',
        BLOG_TAGS: 'blog_tags',
        MEDIA: 'media'
    },
    STORAGE_BUCKETS: {
        IMAGES: 'portfolio-images',
        DOCUMENTS: 'portfolio-documents'
    },
    isConfigured: () => supabaseClient !== null
};
