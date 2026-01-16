-- ========================================
-- FIX: Mettre à jour les chemins d'images CI/CD
-- Remplacer .jpg par .svg pour les tutoriels CI/CD existants
-- ========================================

-- Mettre à jour les images des tutoriels CI/CD
UPDATE blog_posts
SET cover_image = REPLACE(cover_image, '.jpg', '.svg')
WHERE category = 'CI/CD'
  AND cover_image LIKE '%.jpg';

-- Vérifier les mises à jour
SELECT title, cover_image
FROM blog_posts
WHERE category = 'CI/CD'
ORDER BY title;

-- Résultat attendu : Toutes les images doivent se terminer par .svg
