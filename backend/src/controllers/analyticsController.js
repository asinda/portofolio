/**
 * ANALYTICS CONTROLLER
 * Sprint 3 - Portfolio Alice Sindayigaya
 * Tracking analytics RGPD-compliant (IP hashée)
 */

import supabase from '../config/supabase.js';
import logger from '../config/logger.js';
import crypto from 'crypto';
import { detectDeviceType, detectBrowser, detectOS } from '../schemas/analytics.schemas.js';

// ===================================
// PUBLIC - TRACKING EVENTS
// ===================================

/**
 * POST /api/analytics/track
 * Tracker un événement (rate limited: 30/min par session)
 */
export async function trackEvent(req, res) {
    try {
        const eventData = { ...req.body };

        // Hasher l'IP (RGPD - JAMAIS stocker IP brute)
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        eventData.ip_hash = crypto
            .createHash('sha256')
            .update(ipAddress)
            .digest('hex');

        // User agent
        const userAgent = req.headers['user-agent'];
        eventData.user_agent = userAgent;

        // Auto-détecter device/browser/os si non fourni
        if (!eventData.device_type && userAgent) {
            eventData.device_type = detectDeviceType(userAgent);
        }

        if (!eventData.browser && userAgent) {
            eventData.browser = detectBrowser(userAgent);
        }

        if (!eventData.os && userAgent) {
            eventData.os = detectOS(userAgent);
        }

        // Créer l'événement
        const { data, error } = await supabase
            .from('analytics_events')
            .insert(eventData)
            .select()
            .single();

        if (error) throw error;

        logger.info(`Analytics event tracké: ${data.event_type} sur ${data.page_url}`);

        return res.status(201).json({
            success: true,
            data: {
                id: data.id,
                created_at: data.created_at
            }
        });

    } catch (error) {
        logger.error('Erreur trackEvent:', error);
        // Ne pas exposer erreurs détaillées pour tracking (sécurité)
        return res.status(500).json({
            success: false,
            error: 'Erreur tracking'
        });
    }
}

// ===================================
// ADMIN - DASHBOARD ANALYTICS
// ===================================

/**
 * GET /api/analytics/dashboard
 * Dashboard analytics avec métriques agrégées (admin authentifié)
 */
export async function getDashboard(req, res) {
    try {
        const {
            start_date,
            end_date,
            event_type,
            page_url,
            device_type,
            days = 30
        } = req.query;

        // Définir période par défaut (derniers X jours)
        const endDate = end_date ? new Date(end_date) : new Date();
        const startDate = start_date ? new Date(start_date) : new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        // Construire requête
        let query = supabase
            .from('analytics_events')
            .select('*', { count: 'exact' })
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());

        if (event_type) {
            query = query.eq('event_type', event_type);
        }

        if (page_url) {
            query = query.eq('page_url', page_url);
        }

        if (device_type) {
            query = query.eq('device_type', device_type);
        }

        const { data: events, error, count } = await query;

        if (error) throw error;

        // Calculer métriques
        const metrics = {
            total_events: count,
            unique_sessions: new Set(events.map(e => e.session_id)).size,
            page_views: events.filter(e => e.event_type === 'page_view').length,

            // Répartition devices
            devices: events.reduce((acc, e) => {
                acc[e.device_type] = (acc[e.device_type] || 0) + 1;
                return acc;
            }, {}),

            // Répartition browsers
            browsers: events.reduce((acc, e) => {
                if (e.browser) {
                    acc[e.browser] = (acc[e.browser] || 0) + 1;
                }
                return acc;
            }, {}),

            // Répartition OS
            os: events.reduce((acc, e) => {
                if (e.os) {
                    acc[e.os] = (acc[e.os] || 0) + 1;
                }
                return acc;
            }, {}),

            // Top pages (page_views uniquement)
            top_pages: Object.entries(
                events
                    .filter(e => e.event_type === 'page_view')
                    .reduce((acc, e) => {
                        const key = e.page_url;
                        acc[key] = (acc[key] || 0) + 1;
                        return acc;
                    }, {})
            )
                .map(([url, views]) => ({ url, views }))
                .sort((a, b) => b.views - a.views)
                .slice(0, 10),

            // Top referrers
            top_referrers: Object.entries(
                events
                    .filter(e => e.referrer)
                    .reduce((acc, e) => {
                        acc[e.referrer] = (acc[e.referrer] || 0) + 1;
                        return acc;
                    }, {})
            )
                .map(([referrer, count]) => ({ referrer, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10),

            // Répartition pays
            countries: events.reduce((acc, e) => {
                if (e.country_code) {
                    acc[e.country_code] = (acc[e.country_code] || 0) + 1;
                }
                return acc;
            }, {})
        };

        return res.json({
            success: true,
            data: {
                period: {
                    start: startDate.toISOString(),
                    end: endDate.toISOString(),
                    days: Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
                },
                metrics
            }
        });

    } catch (error) {
        logger.error('Erreur getDashboard:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération du dashboard'
        });
    }
}

/**
 * GET /api/analytics/summary
 * Résumés pré-calculés par jour (rapide, pour dashboard)
 */
export async function getSummary(req, res) {
    try {
        const { start_date, end_date, days = 30 } = req.query;

        // Définir période
        const endDate = end_date ? new Date(end_date) : new Date();
        const startDate = start_date ? new Date(start_date) : new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const { data, error } = await supabase
            .from('analytics_summary')
            .select('*')
            .gte('date', startDate.toISOString().split('T')[0])
            .lte('date', endDate.toISOString().split('T')[0])
            .order('date', { ascending: true });

        if (error) throw error;

        // Calculer totaux
        const totals = data.reduce((acc, day) => {
            acc.total_views += day.total_views || 0;
            acc.total_visitors += day.unique_visitors || 0;
            acc.total_events += day.total_events || 0;
            return acc;
        }, {
            total_views: 0,
            total_visitors: 0,
            total_events: 0
        });

        return res.json({
            success: true,
            data: {
                period: {
                    start: startDate.toISOString().split('T')[0],
                    end: endDate.toISOString().split('T')[0],
                    days: data.length
                },
                totals,
                daily: data
            }
        });

    } catch (error) {
        logger.error('Erreur getSummary:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération du résumé'
        });
    }
}

/**
 * GET /api/analytics/real-time
 * Événements en temps réel (dernières 5 minutes)
 */
export async function getRealTime(req, res) {
    try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        const { data, error } = await supabase
            .from('analytics_events')
            .select('event_type, page_url, device_type, created_at, session_id')
            .gte('created_at', fiveMinutesAgo.toISOString())
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        // Compter sessions actives (uniques dans les 5 dernières minutes)
        const activeSessions = new Set(data.map(e => e.session_id)).size;

        return res.json({
            success: true,
            data: {
                active_sessions: activeSessions,
                recent_events: data
            }
        });

    } catch (error) {
        logger.error('Erreur getRealTime:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des données en temps réel'
        });
    }
}

/**
 * POST /api/analytics/calculate-daily
 * Calculer résumé journalier (cron job)
 */
export async function calculateDailySummary(req, res) {
    try {
        const { date } = req.body; // Format: YYYY-MM-DD
        const targetDate = date || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Appeler fonction Supabase
        const { error } = await supabase.rpc('calculate_daily_analytics', {
            target_date: targetDate
        });

        if (error) throw error;

        logger.info(`Résumé analytics calculé pour ${targetDate}`);

        return res.json({
            success: true,
            message: `Résumé calculé pour ${targetDate}`
        });

    } catch (error) {
        logger.error('Erreur calculateDailySummary:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors du calcul du résumé'
        });
    }
}

// ===================================
// EXPORTS
// ===================================

export const analyticsController = {
    // Public (rate limited)
    track: trackEvent,

    // Admin
    getDashboard,
    getSummary,
    getRealTime,
    calculateDaily: calculateDailySummary
};

export default analyticsController;
