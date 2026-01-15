-- ===================================
-- TABLES BLOG SYSTEM
-- Sprint 3 - Portfolio Alice Sindayigaya
-- ===================================

-- Table: blog_posts
-- Stocke les articles de blog/tutoriels
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,

    -- Contenu
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image TEXT,

    -- Organisation
    category TEXT NOT NULL CHECK (category IN (
        'DevOps', 'Cloud', 'Kubernetes', 'Terraform',
        'Ansible', 'CI/CD', 'Monitoring', 'Automation',
        'Career', 'Tutorial', 'Other'
    )),
    tags TEXT[] DEFAULT '{}',

    -- Publication
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,

    -- Métriques
    views INTEGER DEFAULT 0,
    read_time INTEGER, -- en minutes

    -- SEO
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Contraintes
    CONSTRAINT title_length CHECK (char_length(title) >= 5 AND char_length(title) <= 200),
    CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    CONSTRAINT content_length CHECK (char_length(content) >= 50),
    CONSTRAINT excerpt_length CHECK (excerpt IS NULL OR char_length(excerpt) <= 500)
);

-- Table: blog_comments
-- Commentaires sur les articles (avec modération)
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
    parent_comment_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,

    -- Auteur (non-authentifié pour permettre commentaires publics)
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    author_website TEXT,

    -- Contenu
    content TEXT NOT NULL,

    -- Modération
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'rejected')),
    moderated_by UUID REFERENCES auth.users,
    moderated_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    ip_address INET,
    user_agent TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Contraintes
    CONSTRAINT author_name_length CHECK (char_length(author_name) >= 2 AND char_length(author_name) <= 100),
    CONSTRAINT content_length CHECK (char_length(content) >= 10 AND char_length(content) <= 5000)
);

-- Table: blog_tags
-- Tags des articles (table de jointure implicite via array)
-- Cette table est optionnelle si on utilise directement l'array dans blog_posts
CREATE TABLE IF NOT EXISTS blog_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT tag_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 50),
    CONSTRAINT tag_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- ===================================
-- INDEX POUR PERFORMANCES
-- ===================================

CREATE INDEX IF NOT EXISTS idx_blog_posts_user_id ON blog_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_comment_id);

CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);

-- ===================================
-- FONCTIONS TRIGGERS
-- ===================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour blog_posts
DROP TRIGGER IF EXISTS set_updated_at_blog_posts ON blog_posts;
CREATE TRIGGER set_updated_at_blog_posts
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour blog_comments
DROP TRIGGER IF EXISTS set_updated_at_blog_comments ON blog_comments;
CREATE TRIGGER set_updated_at_blog_comments
    BEFORE UPDATE ON blog_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================

-- Activer RLS sur toutes les tables
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;

-- Politiques pour blog_posts

-- Lecture publique des articles publiés
CREATE POLICY "Tout le monde peut lire les articles publiés" ON blog_posts
    FOR SELECT USING (status = 'published');

-- Auteur peut voir tous ses articles (draft, published, archived)
CREATE POLICY "Auteur peut voir tous ses articles" ON blog_posts
    FOR SELECT USING (auth.uid() = user_id);

-- Auteur peut créer des articles
CREATE POLICY "Auteur peut créer des articles" ON blog_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auteur peut modifier ses articles
CREATE POLICY "Auteur peut modifier ses articles" ON blog_posts
    FOR UPDATE USING (auth.uid() = user_id);

-- Auteur peut supprimer ses articles
CREATE POLICY "Auteur peut supprimer ses articles" ON blog_posts
    FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour blog_comments

-- Lecture publique des commentaires approuvés
CREATE POLICY "Tout le monde peut lire les commentaires approuvés" ON blog_comments
    FOR SELECT USING (status = 'approved');

-- Auteur peut voir tous les commentaires (modération)
CREATE POLICY "Auteur peut voir tous les commentaires" ON blog_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM blog_posts
            WHERE blog_posts.id = blog_comments.post_id
            AND blog_posts.user_id = auth.uid()
        )
    );

-- Public peut créer des commentaires (modération requise)
CREATE POLICY "Public peut créer des commentaires" ON blog_comments
    FOR INSERT WITH CHECK (true);

-- Auteur peut modérer les commentaires
CREATE POLICY "Auteur peut modérer les commentaires" ON blog_comments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM blog_posts
            WHERE blog_posts.id = blog_comments.post_id
            AND blog_posts.user_id = auth.uid()
        )
    );

-- Auteur peut supprimer des commentaires
CREATE POLICY "Auteur peut supprimer les commentaires" ON blog_comments
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM blog_posts
            WHERE blog_posts.id = blog_comments.post_id
            AND blog_posts.user_id = auth.uid()
        )
    );

-- Politiques pour blog_tags

-- Lecture publique des tags
CREATE POLICY "Tout le monde peut lire les tags" ON blog_tags
    FOR SELECT USING (true);

-- Seul l'auteur authentifié peut gérer les tags
CREATE POLICY "Auteur authentifié peut créer des tags" ON blog_tags
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Auteur authentifié peut modifier des tags" ON blog_tags
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Auteur authentifié peut supprimer des tags" ON blog_tags
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- ===================================
-- VUE POUR STATISTIQUES
-- ===================================

CREATE OR REPLACE VIEW blog_stats AS
SELECT
    COUNT(*) as total_posts,
    COUNT(*) FILTER (WHERE status = 'published') as published_posts,
    COUNT(*) FILTER (WHERE status = 'draft') as draft_posts,
    SUM(views) as total_views,
    COUNT(DISTINCT category) as total_categories,
    (
        SELECT COUNT(DISTINCT tag)
        FROM blog_posts, unnest(tags) as tag
    ) as total_tags,
    (
        SELECT COUNT(*)
        FROM blog_comments
        WHERE status = 'approved'
    ) as total_approved_comments,
    (
        SELECT COUNT(*)
        FROM blog_comments
        WHERE status = 'pending'
    ) as pending_comments
FROM blog_posts;

-- ===================================
-- SEED DATA (optionnel)
-- ===================================

-- Cette section sera remplie par le script d'import des tutoriels
