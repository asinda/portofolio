-- ===================================
-- AJOUT SUPPORT MULTI-LANGUE POUR LE BLOG
-- Ajoute les colonnes pour les traductions anglaises
-- ===================================

-- Ajouter les colonnes pour les versions anglaises
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS content_en TEXT,
ADD COLUMN IF NOT EXISTS excerpt_en TEXT,
ADD COLUMN IF NOT EXISTS seo_title_en TEXT,
ADD COLUMN IF NOT EXISTS seo_description_en TEXT;

-- Ajouter une colonne pour la langue par défaut de l'article
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS default_locale TEXT DEFAULT 'fr' CHECK (default_locale IN ('fr', 'en'));

-- Créer un index pour la recherche par locale
CREATE INDEX IF NOT EXISTS idx_blog_posts_locale ON blog_posts(default_locale);

-- Commentaires sur les colonnes
COMMENT ON COLUMN blog_posts.title_en IS 'Titre de l''article en anglais';
COMMENT ON COLUMN blog_posts.content_en IS 'Contenu de l''article en anglais (Markdown)';
COMMENT ON COLUMN blog_posts.excerpt_en IS 'Résumé de l''article en anglais';
COMMENT ON COLUMN blog_posts.seo_title_en IS 'Meta titre pour SEO en anglais';
COMMENT ON COLUMN blog_posts.seo_description_en IS 'Meta description pour SEO en anglais';
COMMENT ON COLUMN blog_posts.default_locale IS 'Langue par défaut de l''article (fr ou en)';

-- ===================================
-- NOTES D'UTILISATION
-- ===================================

/*
UTILISATION:

1. Les colonnes originales (title, content, excerpt) contiennent la version française
2. Les colonnes *_en contiennent les traductions anglaises
3. default_locale indique quelle version a été écrite en premier

EXEMPLE DE REQUÊTE AVEC LOCALE:

-- Récupérer un article dans la langue préférée
SELECT
    id,
    slug,
    CASE WHEN :locale = 'en' AND title_en IS NOT NULL
         THEN title_en ELSE title END as title,
    CASE WHEN :locale = 'en' AND content_en IS NOT NULL
         THEN content_en ELSE content END as content,
    CASE WHEN :locale = 'en' AND excerpt_en IS NOT NULL
         THEN excerpt_en ELSE excerpt END as excerpt,
    category,
    tags,
    cover_image,
    published_at,
    views,
    read_time
FROM blog_posts
WHERE status = 'published';

*/
