-- Vérifier les tutoriels CI/CD existants avec détails
SELECT id, title, slug, published_at
FROM blog_posts
WHERE category = 'CI/CD'
ORDER BY published_at DESC;
