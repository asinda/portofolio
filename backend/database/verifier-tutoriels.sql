-- ========================================
-- VÉRIFICATION DÉTAILLÉE DES TUTORIELS
-- ========================================

-- 1. Nombre total
SELECT
    '📊 TOTAL' as info,
    COUNT(*) as nombre
FROM blog_posts;

-- 2. Par catégorie avec détails
SELECT
    '📂 PAR CATÉGORIE' as info,
    category,
    COUNT(*) as nombre,
    string_agg(title, ' | ') as titres
FROM blog_posts
GROUP BY category
ORDER BY nombre DESC, category;

-- 3. Liste complète de tous les slugs
SELECT
    '🔗 TOUS LES SLUGS' as info,
    ROW_NUMBER() OVER (ORDER BY published_at DESC) as numero,
    category,
    slug,
    title,
    status
FROM blog_posts
ORDER BY published_at DESC;

-- 4. Compter par statut
SELECT
    '📋 PAR STATUT' as info,
    status,
    COUNT(*) as nombre
FROM blog_posts
GROUP BY status;
