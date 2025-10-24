# Configuration Supabase pour votre Portfolio

Ce guide vous explique comment configurer Supabase (base de données PostgreSQL gratuite et open source) pour votre portfolio.

## 📋 Table des matières

1. [Créer un compte Supabase](#1-créer-un-compte-supabase)
2. [Créer un nouveau projet](#2-créer-un-nouveau-projet)
3. [Créer les tables](#3-créer-les-tables)
4. [Configurer l'authentification](#4-configurer-lauthentification)
5. [Configurer le Storage](#5-configurer-le-storage)
6. [Obtenir les clés API](#6-obtenir-les-clés-api)
7. [Configurer votre application](#7-configurer-votre-application)
8. [Créer votre premier utilisateur](#8-créer-votre-premier-utilisateur)

---

## 1. Créer un compte Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur **"Start your project"**
3. Connectez-vous avec GitHub ou créez un compte
4. C'est **100% gratuit** pour commencer

---

## 2. Créer un nouveau projet

1. Dans le dashboard Supabase, cliquez sur **"New Project"**
2. Remplissez les informations :
   - **Name** : `portfolio` (ou le nom de votre choix)
   - **Database Password** : Choisissez un mot de passe fort et **sauvegardez-le** (vous en aurez besoin)
   - **Region** : Choisissez la région la plus proche de vous
   - **Pricing Plan** : Sélectionnez **"Free"**
3. Cliquez sur **"Create new project"**
4. Attendez 1-2 minutes que le projet se crée

---

## 3. Créer les tables

### Méthode 1 : SQL Editor (Recommandé)

1. Dans votre projet Supabase, allez dans **"SQL Editor"** (menu de gauche)
2. Cliquez sur **"New query"**
3. Copiez-collez ce script SQL complet :

```sql
-- ===================================
-- Création des tables
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
```

4. Cliquez sur **"Run"** (ou appuyez sur Ctrl+Enter)
5. Vous devriez voir : **"Success. No rows returned"**

---

## 4. Configurer l'authentification

1. Allez dans **"Authentication"** > **"Providers"**
2. Activez **"Email"**
3. Dans **"Email Auth"**, configurez :
   - **Enable Email Confirmations** : ❌ Désactivez (pour simplifier)
   - **Enable Email provider** : ✅ Activé

---

## 5. Configurer le Storage

1. Allez dans **"Storage"** (menu de gauche)
2. Cliquez sur **"Create a new bucket"**
3. Créez deux buckets :

### Bucket 1 : Images
- **Name** : `portfolio-images`
- **Public bucket** : ✅ Cochez cette case
- Cliquez sur **"Create bucket"**

### Bucket 2 : Documents
- **Name** : `portfolio-documents`
- **Public bucket** : ✅ Cochez cette case
- Cliquez sur **"Create bucket"**

### Configurer les politiques de Storage

Pour chaque bucket (`portfolio-images` et `portfolio-documents`) :

1. Cliquez sur le bucket
2. Allez dans **"Policies"**
3. Cliquez sur **"New Policy"**
4. Choisissez **"Allow public read access"**
5. Ajoutez aussi une politique pour l'upload :

```sql
-- Politique pour permettre l'upload
CREATE POLICY "Les utilisateurs authentifiés peuvent uploader"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-images');

-- Politique pour permettre la suppression
CREATE POLICY "Les utilisateurs peuvent supprimer leurs fichiers"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-images');
```

---

## 6. Obtenir les clés API

1. Allez dans **"Settings"** > **"API"**
2. Vous verrez deux sections importantes :

### Project URL
- Exemple : `https://abcdefghijklm.supabase.co`
- **Copiez cette URL**

### API Keys
- **anon / public** : C'est la clé publique (safe pour le frontend)
- **Copiez cette clé**

⚠️ **NE PARTAGEZ JAMAIS** la clé **service_role** - elle donne un accès complet !

---

## 7. Configurer votre application

1. Ouvrez le fichier `admin/js/config.js`
2. Remplacez les valeurs :

```javascript
const SUPABASE_URL = 'https://abcdefghijklm.supabase.co'; // Votre URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Votre clé anon
```

3. Sauvegardez le fichier

---

## 8. Créer votre premier utilisateur

### Méthode 1 : Via l'interface Supabase (Recommandé)

1. Dans Supabase, allez dans **"Authentication"** > **"Users"**
2. Cliquez sur **"Add user"** > **"Create new user"**
3. Remplissez :
   - **Email** : votre@email.com
   - **Password** : un mot de passe fort
   - **Auto Confirm User** : ✅ Cochez cette case
4. Cliquez sur **"Create user"**

### Méthode 2 : Via la page de connexion

1. Allez sur `http://localhost:8000/admin/`
2. Utilisez les identifiants que vous venez de créer
3. Connectez-vous !

---

## ✅ Vérification

Pour vérifier que tout fonctionne :

1. Ouvrez `http://localhost:8000/admin/`
2. Connectez-vous avec vos identifiants
3. Vous devriez voir le tableau de bord d'administration
4. Essayez d'ajouter une expérience ou un projet
5. Vérifiez dans Supabase > **"Table Editor"** que les données sont bien enregistrées

---

## 🎉 Félicitations !

Votre système d'administration est maintenant configuré et prêt à l'emploi !

## 📚 Prochaines étapes

1. Remplissez votre profil
2. Ajoutez vos expériences
3. Ajoutez vos projets
4. Uploadez vos images
5. Connectez le frontend au backend

## 🆘 Problèmes courants

### "Configuration Supabase manquante"
- Vérifiez que vous avez bien modifié `admin/js/config.js`
- Vérifiez que l'URL et la clé sont correctes

### "Erreur lors de la connexion"
- Vérifiez que vous avez créé un utilisateur
- Vérifiez que l'authentification Email est activée
- Vérifiez que l'email de confirmation est désactivé

### "Permission denied"
- Vérifiez que les politiques RLS sont bien créées
- Vérifiez que vous êtes connecté avec le bon utilisateur

### "Erreur CORS"
- Assurez-vous d'utiliser un serveur local (pas file://)
- Vérifiez que l'URL Supabase est correcte

---

## 🔐 Sécurité

- ✅ Les politiques RLS sont configurées pour protéger vos données
- ✅ Seul vous pouvez modifier vos données
- ✅ Le public peut seulement voir (en lecture seule)
- ✅ La clé anon est safe pour le frontend

## 📱 Déploiement

Quand vous déployez votre site (Netlify, Vercel, etc.) :

1. Les mêmes clés Supabase fonctionneront
2. Pas besoin de serveur backend
3. Tout est géré par Supabase

---

Besoin d'aide ? Consultez la [documentation officielle Supabase](https://supabase.com/docs)
