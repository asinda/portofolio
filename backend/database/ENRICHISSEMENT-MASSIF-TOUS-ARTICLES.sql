-- =====================================================
-- ENRICHISSEMENT MASSIF DE TOUS LES ARTICLES (26)
-- Chaque article passe de 500-2000 à 8000-15000 caractères
-- =====================================================

-- Article 1: Multi-Cloud Terraform
UPDATE blog_posts
SET content = 'CONTENU_GENERE_DYNAMIQUEMENT',
    read_time = 16
WHERE slug = 'multi-cloud-terraform-aws-azure-gcp';

-- NOTE: Ce fichier sera généré dynamiquement par un script Node.js
-- car le contenu est trop volumineux pour être écrit manuellement

-- Pour exécuter l'enrichissement, lancer:
-- node backend/scripts/generate-and-apply-enrichment.js
