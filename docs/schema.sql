-- ===================================
-- Création des tables pour Portfolio
-- ===================================

-- Table Profile (informations personnelles)
CREATE TABLE profile (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    photo TEXT,
    about TEXT,
    linkedin TEXT,
    github TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Table Experiences
CREATE TABLE experiences (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    position TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT,
    current BOOLEAN DEFAULT FALSE,
    description TEXT,
    achievements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table Education
CREATE TABLE education (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    degree TEXT NOT NULL,
    institution TEXT NOT NULL,
    location TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table Projects
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    technologies TEXT[],
    link TEXT,
    github TEXT,
    category TEXT DEFAULT 'web',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table Skills Technical
CREATE TABLE skills_technical (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table Skills Languages
CREATE TABLE skills_languages (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    name TEXT NOT NULL,
    level TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table Skills Soft
CREATE TABLE skills_soft (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table Certifications
CREATE TABLE certifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date TEXT NOT NULL,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- Politiques de sécurité (RLS)
-- ===================================

-- Activer RLS sur toutes les tables
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills_technical ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills_soft ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Politiques pour Profile
CREATE POLICY "Les utilisateurs peuvent voir leur profil" ON profile
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer leur profil" ON profile
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leur profil" ON profile
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Tout le monde peut voir les profils (public)" ON profile
    FOR SELECT USING (true);

-- Politiques pour Experiences
CREATE POLICY "Les utilisateurs peuvent voir leurs expériences" ON experiences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer des expériences" ON experiences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leurs expériences" ON experiences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs expériences" ON experiences
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Tout le monde peut voir les expériences (public)" ON experiences
    FOR SELECT USING (true);

-- Politiques pour Education
CREATE POLICY "Les utilisateurs peuvent voir leur formation" ON education
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer des formations" ON education
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leur formation" ON education
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leur formation" ON education
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Tout le monde peut voir les formations (public)" ON education
    FOR SELECT USING (true);

-- Politiques pour Projects
CREATE POLICY "Les utilisateurs peuvent voir leurs projets" ON projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer des projets" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leurs projets" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs projets" ON projects
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Tout le monde peut voir les projets (public)" ON projects
    FOR SELECT USING (true);

-- Politiques pour Skills Technical
CREATE POLICY "Les utilisateurs peuvent gérer leurs compétences techniques" ON skills_technical
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Tout le monde peut voir les compétences techniques (public)" ON skills_technical
    FOR SELECT USING (true);

-- Politiques pour Skills Languages
CREATE POLICY "Les utilisateurs peuvent gérer leurs langues" ON skills_languages
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Tout le monde peut voir les langues (public)" ON skills_languages
    FOR SELECT USING (true);

-- Politiques pour Skills Soft
CREATE POLICY "Les utilisateurs peuvent gérer leurs soft skills" ON skills_soft
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Tout le monde peut voir les soft skills (public)" ON skills_soft
    FOR SELECT USING (true);

-- Politiques pour Certifications
CREATE POLICY "Les utilisateurs peuvent voir leurs certifications" ON certifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer des certifications" ON certifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leurs certifications" ON certifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs certifications" ON certifications
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Tout le monde peut voir les certifications (public)" ON certifications
    FOR SELECT USING (true);

-- ===================================
-- Index pour améliorer les performances
-- ===================================

CREATE INDEX idx_experiences_user_id ON experiences(user_id);
CREATE INDEX idx_education_user_id ON education(user_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_skills_technical_user_id ON skills_technical(user_id);
CREATE INDEX idx_skills_languages_user_id ON skills_languages(user_id);
CREATE INDEX idx_skills_soft_user_id ON skills_soft(user_id);
CREATE INDEX idx_certifications_user_id ON certifications(user_id);
