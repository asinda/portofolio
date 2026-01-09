-- ===================================
-- SUPABASE SETUP - CONTACT & ANALYTICS
-- ===================================
-- Sprint 3 - Portfolio Alice Sindayigaya
-- Tables: contact_messages, analytics_events, analytics_summary
-- ===================================

-- ===================================
-- 1. TABLE: contact_messages
-- ===================================
-- Messages de contact avec rate limiting et anti-spam

CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Informations contact
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,

    -- Optionnel
    phone VARCHAR(20),
    company VARCHAR(150),

    -- Statut de traitement
    status VARCHAR(20) NOT NULL DEFAULT 'new',

    -- Anti-spam & sécurité
    ip_hash VARCHAR(64) NOT NULL, -- SHA-256 hash (RGPD)
    user_agent TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,

    -- Contraintes
    CONSTRAINT valid_contact_status CHECK (status IN ('new', 'read', 'replied', 'archived', 'spam')),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Index
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX idx_contact_messages_email ON contact_messages(email);

-- RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public peut créer (rate limited au niveau app)
CREATE POLICY "Public can create contact messages"
    ON contact_messages
    FOR INSERT
    WITH CHECK (true);

-- Authentifié peut lire (admin/auteur)
CREATE POLICY "Authenticated can read messages"
    ON contact_messages
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Authentifié peut mettre à jour statut
CREATE POLICY "Authenticated can update status"
    ON contact_messages
    FOR UPDATE
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- ===================================
-- 2. TABLE: analytics_events
-- ===================================
-- Events analytics RGPD-compliant (IP hashée)

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Type d'événement
    event_type VARCHAR(50) NOT NULL,

    -- Page/ressource
    page_url VARCHAR(500) NOT NULL,
    page_title VARCHAR(200),
    referrer VARCHAR(500),

    -- Session
    session_id UUID NOT NULL,

    -- Données anonymisées (RGPD)
    ip_hash VARCHAR(64) NOT NULL, -- SHA-256, pas d'IP brute
    user_agent TEXT,
    device_type VARCHAR(20), -- mobile, tablet, desktop
    browser VARCHAR(50),
    os VARCHAR(50),
    country_code VARCHAR(2), -- ISO 3166-1 alpha-2

    -- Métadonnées personnalisées
    metadata JSONB DEFAULT '{}',

    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Contraintes
    CONSTRAINT valid_event_type CHECK (event_type IN ('page_view', 'click', 'download', 'form_submit', 'scroll', 'custom')),
    CONSTRAINT valid_device_type CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'unknown'))
);

-- Index pour performances (queries analytics)
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_page_url ON analytics_events(page_url);
CREATE INDEX idx_analytics_events_country ON analytics_events(country_code);

-- Partition par date (optionnel, pour grandes volumétries)
-- CREATE INDEX idx_analytics_events_created_at_brin ON analytics_events USING BRIN (created_at);

-- RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Public peut créer events (rate limited)
CREATE POLICY "Public can track events"
    ON analytics_events
    FOR INSERT
    WITH CHECK (true);

-- Authentifié peut lire (dashboard analytics)
CREATE POLICY "Authenticated can read analytics"
    ON analytics_events
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- ===================================
-- 3. TABLE: analytics_summary
-- ===================================
-- Résumés analytics pré-calculés (performance dashboard)

CREATE TABLE IF NOT EXISTS analytics_summary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Période
    date DATE NOT NULL UNIQUE,

    -- Métriques globales
    total_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0, -- comptage sessions uniques
    total_events INTEGER DEFAULT 0,

    -- Top pages (JSONB pour flexibilité)
    top_pages JSONB DEFAULT '[]', -- [{ url, views, title }, ...]

    -- Top referrers
    top_referrers JSONB DEFAULT '[]',

    -- Répartition devices
    devices JSONB DEFAULT '{}', -- { mobile: 45, desktop: 50, tablet: 5 }

    -- Répartition pays
    countries JSONB DEFAULT '{}', -- { FR: 120, US: 80, ... }

    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_analytics_summary_date ON analytics_summary(date DESC);

-- RLS
ALTER TABLE analytics_summary ENABLE ROW LEVEL SECURITY;

-- Authentifié peut lire (dashboard)
CREATE POLICY "Authenticated can read summary"
    ON analytics_summary
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- ===================================
-- FONCTIONS UTILITAIRES
-- ===================================

-- Fonction pour calculer résumé journalier
CREATE OR REPLACE FUNCTION calculate_daily_analytics(target_date DATE)
RETURNS void AS $$
DECLARE
    views_count INTEGER;
    visitors_count INTEGER;
    events_count INTEGER;
BEGIN
    -- Compter vues
    SELECT COUNT(*) INTO views_count
    FROM analytics_events
    WHERE event_type = 'page_view'
    AND DATE(created_at) = target_date;

    -- Compter visiteurs uniques (sessions)
    SELECT COUNT(DISTINCT session_id) INTO visitors_count
    FROM analytics_events
    WHERE DATE(created_at) = target_date;

    -- Compter total events
    SELECT COUNT(*) INTO events_count
    FROM analytics_events
    WHERE DATE(created_at) = target_date;

    -- Upsert résumé
    INSERT INTO analytics_summary (date, total_views, unique_visitors, total_events)
    VALUES (target_date, views_count, visitors_count, events_count)
    ON CONFLICT (date)
    DO UPDATE SET
        total_views = EXCLUDED.total_views,
        unique_visitors = EXCLUDED.unique_visitors,
        total_events = EXCLUDED.total_events,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Fonction pour nettoyer events anciens (RGPD - conservation limitée)
CREATE OR REPLACE FUNCTION cleanup_old_analytics(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM analytics_events
    WHERE created_at < NOW() - (days_to_keep || ' days')::INTERVAL;

    GET DIAGNOSTICS deleted_count = ROW_COUNT;

    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ===================================
-- TRIGGERS
-- ===================================

-- Trigger pour updated_at sur analytics_summary
CREATE OR REPLACE FUNCTION update_analytics_summary_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER analytics_summary_updated_at
    BEFORE UPDATE ON analytics_summary
    FOR EACH ROW
    EXECUTE FUNCTION update_analytics_summary_updated_at();

-- ===================================
-- DONNÉES D'EXEMPLE (OPTIONNEL)
-- ===================================

-- Exemple de message contact
-- INSERT INTO contact_messages (name, email, subject, message, ip_hash) VALUES
-- (
--     'John Doe',
--     'john.doe@example.com',
--     'Demande de collaboration',
--     'Bonjour, je suis intéressé par vos services DevOps...',
--     encode(sha256('192.168.1.1'::bytea), 'hex')
-- );

-- ===================================
-- CRON JOBS (OPTIONNEL - Supabase Edge Functions)
-- ===================================

/*
Configurer un cron pour calculer résumés quotidiens:

1. Créer Edge Function:
   - supabase/functions/daily-analytics/index.ts
   - Appeler calculate_daily_analytics(CURRENT_DATE - 1)

2. Configurer cron dans Supabase Dashboard:
   - Database → Cron Jobs
   - Schedule: 0 1 * * * (1h du matin chaque jour)

3. Nettoyer events anciens (tous les mois):
   - SELECT cleanup_old_analytics(90);
*/

-- ===================================
-- NOTES D'IMPLÉMENTATION
-- ===================================

/*
CONTACT:
- Rate limiting: 3 messages/heure par IP (middleware Express)
- Email notification avec Resend API
- IP hashée SHA-256 (RGPD)
- Validation email stricte

ANALYTICS:
- IP JAMAIS stockée en clair (SHA-256 uniquement)
- Session ID: UUID v4 généré côté client
- Conservation: 90 jours max (RGPD)
- Résumés pré-calculés pour dashboard rapide
- Rate limiting: 30 events/min par session

RGPD:
- Pas d'IP brute stockée
- Pas de cookies tiers
- Données anonymisées
- Droit à l'oubli: cleanup_old_analytics()
- Consentement utilisateur (frontend)

SÉCURITÉ:
- RLS actif sur toutes les tables
- Public peut créer (rate limited app)
- Authentifié peut lire (dashboard admin)
- IP hashée pour prévenir tracking
*/
