-- ========================================
-- VÉRIFICATION FINALE
-- À exécuter APRÈS avoir inséré tous les tutoriels
-- ========================================

-- Compter les tutoriels par catégorie
SELECT category, COUNT(*) as count
FROM blog_posts
GROUP BY category
ORDER BY category;

-- Résultat attendu :
-- CI/CD      : 4
-- Cloud      : 4
-- DevOps     : 8
-- Kubernetes : 4
-- TOTAL      : 20
