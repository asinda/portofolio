-- Vérifier TOUS les tutoriels par catégorie
SELECT category, COUNT(*) as count
FROM blog_posts
GROUP BY category
ORDER BY category;

-- Voir les titres de tous les tutoriels
SELECT category, title, slug
FROM blog_posts
ORDER BY category, title;
