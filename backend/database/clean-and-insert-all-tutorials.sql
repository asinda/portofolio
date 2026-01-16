-- ========================================
-- SCRIPT COMPLET : NETTOYAGE + INSERTION
-- Supprime les tutoriels existants et insère les 20 nouveaux
-- ========================================

-- IMPORTANT: Remplacez '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3' par votre véritable user_id
-- Pour trouver votre user_id : SELECT id FROM auth.users LIMIT 1;

-- ========================================
-- ÉTAPE 1 : SUPPRIMER LES TUTORIELS EXISTANTS
-- ========================================

-- Supprimer tous les tutoriels des catégories concernées
DELETE FROM blog_posts
WHERE category IN ('DevOps', 'Cloud', 'Kubernetes', 'CI/CD', 'Monitoring');

-- Vérification : Afficher le nombre de tutoriels restants
-- SELECT category, COUNT(*) FROM blog_posts GROUP BY category;

-- ========================================
-- ÉTAPE 2 : INSÉRER LES 20 NOUVEAUX TUTORIELS
-- ========================================

-- CATÉGORIE 1 : DEVOPS (4 tutoriels de insert-tutorials-clean.sql)
-- CATÉGORIE 2 : CLOUD (4 tutoriels de insert-tutorials-cloud.sql)
-- CATÉGORIE 3 : KUBERNETES (4 tutoriels de insert-tutorials-kubernetes.sql)
-- CATÉGORIE 4 : DEVOPS + AI (4 tutoriels de insert-tutorials-devops-ai.sql)
-- CATÉGORIE 5 : CI/CD existants (4 tutoriels déjà présents)

-- ========================================
-- NOTE IMPORTANTE
-- ========================================
-- Ce script supprime UNIQUEMENT les catégories listées ci-dessus.
-- Les tutoriels CI/CD existants ne seront PAS supprimés si leur catégorie est 'CI/CD'.
--
-- POUR EXÉCUTER CE SCRIPT :
-- 1. Ouvrez Supabase SQL Editor
-- 2. Copiez le contenu des 4 fichiers SQL dans l'ordre :
--    - insert-tutorials-clean.sql
--    - insert-tutorials-cloud.sql
--    - insert-tutorials-kubernetes.sql
--    - insert-tutorials-devops-ai.sql
-- 3. Exécutez-les un par un après ce nettoyage

-- Fin du script de nettoyage
