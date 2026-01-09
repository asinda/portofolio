-- ===================================
-- SUPABASE SETUP - CONTACT & ANALYTICS
-- ===================================
-- Sprint 3 - Portfolio Alice Sindayigaya
-- Tables: contact_messages, analytics_events, analytics_summary
-- ===================================

-- 1. TABLE: contact_messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,

    phone VARCHAR(20),
    company VARCHAR(150),

    status VARCHAR(20) NOT NULL DEFAULT 'new',

    ip_hash VARCHAR(64) NOT NULL,
    user_agent TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT valid_contact_status CHECK (status IN ('new', 'read', 'replied', 'archived', 'spam')),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX idx_contact_messages_email ON contact_messages(email);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can create contact messages"
    ON contact_messages
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Authenticated can read messages"
    ON contact_messages
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can update status"
    ON contact_messages
    FOR UPDATE
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- ===================================

-- 2. TABLE: analytics_events
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    event_type VARCHAR(50) NOT NULL,

    page_url VARCHAR(500) NOT NULL,
    page_title VARCHAR(200),
    referrer VARCHAR(500),

    session_id UUID NOT NULL,

    ip_hash VARCHAR(64) NOT NULL,
    user_agent TEXT,
    device_type VARCHAR(20),
    browser VARCHAR(50),
    os VARCHAR(50),
    country_code VARCHAR(2),

    metadata JSONB DEFAULT '{}',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT valid_event_type CHECK (event_type IN ('page_view', 'click', 'download', 'form_submit', 'scroll', 'custom')),
    CONSTRAINT valid_device_type CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'unknown'))
);

CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_page_url ON analytics_events(page_url);
CREATE INDEX idx_analytics_events_country ON analytics_events(country_code);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can track events"
    ON analytics_events
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Authenticated can read analytics"
    ON analytics_events
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- ===================================

-- 3. TABLE: analytics_summary
CREATE TABLE IF NOT EXISTS analytics_summary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    date DATE NOT NULL UNIQUE,

    total_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    total_events INTEGER DEFAULT 0,

    top_pages JSONB DEFAULT '[]',
    top_referrers JSONB DEFAULT '[]',
    devices JSONB DEFAULT '{}',
    countries JSONB DEFAULT '{}',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_summary_date ON analytics_summary(date DESC);

ALTER TABLE analytics_summary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read summary"
    ON analytics_summary
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- ===================================

-- FONCTIONS UTILITAIRES
CREATE OR REPLACE FUNCTION calculate_daily_analytics(target_date DATE)
RETURNS void AS $$
DECLARE
    views_count INTEGER;
    visitors_count INTEGER;
    events_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO views_count
    FROM analytics_events
    WHERE event_type = 'page_view'
    AND DATE(created_at) = target_date;

    SELECT COUNT(DISTINCT session_id) INTO visitors_count
    FROM analytics_events
    WHERE DATE(created_at) = target_date;

    SELECT COUNT(*) INTO events_count
    FROM analytics_events
    WHERE DATE(created_at) = target_date;

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

-- TRIGGER
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
