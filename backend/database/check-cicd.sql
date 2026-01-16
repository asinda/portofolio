-- Vérifier les tutoriels CI/CD existants
SELECT id, title, slug, cover_image
FROM blog_posts
WHERE category = 'CI/CD'
ORDER BY title;
