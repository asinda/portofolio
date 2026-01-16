-- ========================================
-- ÉTAPE 1 : NETTOYAGE
-- À exécuter EN PREMIER dans Supabase SQL Editor
-- ========================================

-- Supprimer les tutoriels existants des catégories à réinsérer
DELETE FROM blog_posts
WHERE category IN ('DevOps', 'Cloud', 'Kubernetes');

-- Résultat attendu : DELETE X (où X = nombre supprimé)
