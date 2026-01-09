-- ===================================
-- SUPABASE SETUP - BLOG SYSTEM
-- ===================================
-- Sprint 3 - Portfolio Alice Sindayigaya
-- Tables: blog_posts, blog_comments, blog_tags
-- Features: Blog avec commentaires et modération
-- ===================================

-- 1. TABLE: blog_posts
-- Articles de blog avec SEO, catégories, tags, statut de publication
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Contenu
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(250) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    cover_image VARCHAR(500),

    -- Organisation
    category VARCHAR(50) NOT NULL DEFAULT 'DevOps',
    tags TEXT[] DEFAULT '{}',

    -- Publication
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,

    -- Métriques
    views INTEGER DEFAULT 0,
    read_time INTEGER, -- minutes estimées

    -- SEO
    seo_title VARCHAR(70),
    seo_description VARCHAR(160),
    seo_keywords TEXT[],

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Contraintes
    CONSTRAINT valid_status CHECK (status IN ('draft', 'published', 'archived')),
    CONSTRAINT valid_category CHECK (category IN ('DevOps', 'Cloud', 'Kubernetes', 'Terraform', 'Ansible', 'CI/CD', 'Monitoring', 'Automation', 'Career', 'Tutorial', 'Other')),
    CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

-- Index pour performances
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_user_id ON blog_posts(user_id);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_posts_updated_at();

-- Fonction pour auto-générer slug
CREATE OR REPLACE FUNCTION generate_blog_slug(title_text TEXT)
RETURNS TEXT AS $$
DECLARE
    slug_text TEXT;
    counter INTEGER := 0;
    final_slug TEXT;
BEGIN
    -- Convertir en minuscules, remplacer espaces par tirets
    slug_text := lower(regexp_replace(title_text, '[^a-zA-Z0-9\s]', '', 'g'));
    slug_text := regexp_replace(slug_text, '\s+', '-', 'g');
    slug_text := trim(both '-' from slug_text);

    final_slug := slug_text;

    -- Vérifier unicité, ajouter suffixe si nécessaire
    WHILE EXISTS (SELECT 1 FROM blog_posts WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := slug_text || '-' || counter;
    END LOOP;

    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- ===================================

-- 2. TABLE: blog_comments
-- Commentaires sur les articles avec modération
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,

    -- Auteur (non-authentifié)
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    author_website VARCHAR(255),

    -- Contenu
    content TEXT NOT NULL,

    -- Modération
    status VARCHAR(20) NOT NULL DEFAULT 'pending',

    -- Métadonnées
    ip_hash VARCHAR(64), -- SHA-256 hash de l'IP (RGPD)
    user_agent TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Contraintes
    CONSTRAINT valid_comment_status CHECK (status IN ('pending', 'approved', 'spam', 'rejected')),
    CONSTRAINT valid_email CHECK (author_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Index pour performances
CREATE INDEX idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX idx_blog_comments_status ON blog_comments(status);
CREATE INDEX idx_blog_comments_created_at ON blog_comments(created_at DESC);
CREATE INDEX idx_blog_comments_parent ON blog_comments(parent_comment_id);

-- ===================================

-- 3. TABLE: blog_tags
-- Tags pour organisation des articles
CREATE TABLE IF NOT EXISTS blog_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(60) UNIQUE NOT NULL,
    count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX idx_blog_tags_slug ON blog_tags(slug);
CREATE INDEX idx_blog_tags_count ON blog_tags(count DESC);

-- ===================================

-- ROW LEVEL SECURITY (RLS)
-- ===================================

-- Activer RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;

-- POLICIES - blog_posts
-- ===================================

-- Public peut lire les posts publiés
CREATE POLICY "Public can read published posts"
    ON blog_posts
    FOR SELECT
    USING (status = 'published');

-- Auteur peut tout faire sur ses posts
CREATE POLICY "Author can manage own posts"
    ON blog_posts
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Admin peut tout faire (à créer un rôle admin si nécessaire)
-- Pour l'instant, uniquement l'auteur

-- POLICIES - blog_comments
-- ===================================

-- Public peut lire les commentaires approuvés
CREATE POLICY "Public can read approved comments"
    ON blog_comments
    FOR SELECT
    USING (status = 'approved');

-- Public peut créer des commentaires (en attente de modération)
CREATE POLICY "Public can create comments"
    ON blog_comments
    FOR INSERT
    WITH CHECK (true);

-- Auteur du post peut gérer les commentaires de son post
CREATE POLICY "Post author can manage comments"
    ON blog_comments
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM blog_posts
            WHERE blog_posts.id = blog_comments.post_id
            AND blog_posts.user_id = auth.uid()
        )
    );

-- POLICIES - blog_tags
-- ===================================

-- Public peut lire tous les tags
CREATE POLICY "Public can read tags"
    ON blog_tags
    FOR SELECT
    USING (true);

-- Authentifié peut créer/modifier tags
CREATE POLICY "Authenticated can manage tags"
    ON blog_tags
    FOR ALL
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- ===================================

-- DONNÉES D'EXEMPLE (OPTIONNEL)
-- ===================================

-- Insérer quelques tags communs
INSERT INTO blog_tags (name, slug) VALUES
    ('DevOps', 'devops'),
    ('Kubernetes', 'kubernetes'),
    ('Docker', 'docker'),
    ('Terraform', 'terraform'),
    ('Ansible', 'ansible'),
    ('CI/CD', 'cicd'),
    ('AWS', 'aws'),
    ('GCP', 'gcp'),
    ('Monitoring', 'monitoring'),
    ('Automation', 'automation')
ON CONFLICT (slug) DO NOTHING;

-- Exemple de post (remplacer user_id par un UUID réel)
-- INSERT INTO blog_posts (user_id, title, slug, content, excerpt, category, tags, status, published_at) VALUES
-- (
--     '00000000-0000-0000-0000-000000000000', -- Remplacer par votre user_id
--     'Introduction au DevOps avec Kubernetes',
--     'introduction-devops-kubernetes',
--     'Contenu complet de l''article...',
--     'Découvrez les fondamentaux du DevOps et comment Kubernetes révolutionne le déploiement d''applications.',
--     'DevOps',
--     ARRAY['kubernetes', 'devops', 'docker'],
--     'published',
--     NOW()
-- );

-- ===================================
-- FONCTIONS UTILITAIRES
-- ===================================

-- Fonction pour incrémenter les vues d'un post
CREATE OR REPLACE FUNCTION increment_post_views(post_slug TEXT)
RETURNS void AS $$
BEGIN
    UPDATE blog_posts
    SET views = views + 1
    WHERE slug = post_slug AND status = 'published';
END;
$$ LANGUAGE plpgsql;

-- Fonction pour compter les commentaires approuvés d'un post
CREATE OR REPLACE FUNCTION count_approved_comments(post_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
    comment_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO comment_count
    FROM blog_comments
    WHERE post_id = post_id_param AND status = 'approved';

    RETURN comment_count;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour le count des tags
CREATE OR REPLACE FUNCTION update_tag_count()
RETURNS void AS $$
BEGIN
    UPDATE blog_tags
    SET count = (
        SELECT COUNT(*)
        FROM blog_posts
        WHERE status = 'published'
        AND blog_tags.slug = ANY(blog_posts.tags)
    );
END;
$$ LANGUAGE plpgsql;

-- ===================================
-- VUES UTILES (OPTIONNEL)
-- ===================================

-- Vue pour posts avec métadonnées enrichies
CREATE OR REPLACE VIEW blog_posts_with_stats AS
SELECT
    bp.*,
    (SELECT COUNT(*) FROM blog_comments WHERE post_id = bp.id AND status = 'approved') AS comments_count,
    (SELECT author_name FROM blog_comments WHERE post_id = bp.id AND status = 'approved' ORDER BY created_at DESC LIMIT 1) AS latest_comment_author
FROM blog_posts bp;

-- ===================================
-- NOTES D'IMPLÉMENTATION
-- ===================================

/*
IMPORTANT:

1. Exécuter ce script dans Supabase SQL Editor:
   - Aller sur: https://supabase.com/dashboard
   - Projet → SQL Editor
   - Copier-coller ce script
   - Run

2. Créer un utilisateur pour tester:
   - Authentication → Users → Add user
   - Copier l'UUID du user
   - Utiliser cet UUID pour créer des posts de test

3. RLS actif:
   - Public peut lire posts publiés
   - Auteur authentifié peut gérer ses posts
   - Public peut créer commentaires (modération)
   - Auteur peut modérer commentaires de ses posts

4. Indexes créés:
   - Slug (unique, recherche rapide)
   - Status (filtrage published/draft)
   - Published_at (tri chronologique)
   - Category (filtrage par catégorie)

5. Fonctions utilitaires:
   - generate_blog_slug(): Auto-génération slug unique
   - increment_post_views(): +1 vue
   - count_approved_comments(): Nombre commentaires
   - update_tag_count(): MAJ compteur tags

6. Sécurité:
   - IP hashée SHA-256 (RGPD)
   - Email validé par contrainte regex
   - Slug validé (lowercase, hyphens)
   - Status enum strict

7. Next steps (backend):
   - Créer schemas Zod (blog.schemas.js)
   - Créer controller (blogController.js)
   - Créer routes (blog.js)
   - Rate limiting commentaires (3-5/15min)
*/
