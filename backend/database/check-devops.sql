-- Vérifier les tutoriels DevOps existants
SELECT id, title, slug, published_at
FROM blog_posts
WHERE category = 'DevOps'
ORDER BY published_at DESC;
