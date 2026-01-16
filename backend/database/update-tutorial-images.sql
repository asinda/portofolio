-- ========================================
-- MISE À JOUR DES IMAGES DES TUTORIELS
-- ========================================

-- Mettre à jour les images pour utiliser les SVG
UPDATE blog_posts
SET cover_image = '/images/tutorials/github-actions.svg'
WHERE slug = 'github-actions-pipeline-cicd';

UPDATE blog_posts
SET cover_image = '/images/tutorials/gitlab-k8s.svg'
WHERE slug = 'gitlab-cicd-docker-kubernetes';

UPDATE blog_posts
SET cover_image = '/images/tutorials/tests-quality.svg'
WHERE slug = 'tests-automatises-qualite-code';

UPDATE blog_posts
SET cover_image = '/images/tutorials/terraform-ansible.svg'
WHERE slug = 'deploiement-multi-environnements';

-- Vérifier les mises à jour
SELECT title, cover_image, category
FROM blog_posts
WHERE slug IN (
    'github-actions-pipeline-cicd',
    'gitlab-cicd-docker-kubernetes',
    'tests-automatises-qualite-code',
    'deploiement-multi-environnements'
);
