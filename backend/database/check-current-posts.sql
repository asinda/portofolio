-- ========================================
-- VÉRIFIER LES ARTICLES ACTUELS DU BLOG
-- ========================================

-- Compter le nombre total d'articles
SELECT
    '📊 STATISTIQUES GLOBALES' as section,
    COUNT(*) as total_articles,
    COUNT(*) FILTER (WHERE status = 'published') as publies,
    COUNT(*) FILTER (WHERE status = 'draft') as brouillons
FROM blog_posts;

-- Compter par catégorie
SELECT
    '📂 PAR CATÉGORIE' as section,
    category,
    COUNT(*) as nombre_articles
FROM blog_posts
GROUP BY category
ORDER BY nombre_articles DESC;

-- Liste détaillée de tous les articles
SELECT
    '📝 LISTE COMPLÈTE' as section,
    title as titre,
    category as categorie,
    status as statut,
    published_at::date as date_publication,
    views as vues,
    read_time as temps_lecture_min
FROM blog_posts
ORDER BY published_at DESC;

-- Afficher les slugs (pour détecter les doublons potentiels)
SELECT
    '🔗 SLUGS' as section,
    slug,
    title as titre,
    category as categorie
FROM blog_posts
ORDER BY category, slug;
