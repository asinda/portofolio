-- ========================================
-- ÉTAPE 2 : FIXER LES IMAGES CI/CD
-- À exécuter APRÈS l'étape 1
-- ========================================

-- Remplacer .jpg par .svg pour les tutoriels CI/CD
UPDATE blog_posts
SET cover_image = REPLACE(cover_image, '.jpg', '.svg')
WHERE category = 'CI/CD'
  AND cover_image LIKE '%.jpg';

-- Résultat attendu : UPDATE X
