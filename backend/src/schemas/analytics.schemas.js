/**
 * SCHÉMAS ZOD - ANALYTICS SYSTEM
 * Sprint 3 - Portfolio Alice Sindayigaya
 * Validation pour tracking analytics RGPD-compliant
 */

import { z } from 'zod';

// ===================================
// SCHÉMA ANALYTICS EVENT
// ===================================

/**
 * Schéma pour tracker un événement analytics
 */
export const analyticsEventSchema = z.object({
    // Type d'événement
    event_type: z.enum(['page_view', 'click', 'download', 'form_submit', 'scroll', 'custom'], {
        errorMap: () => ({ message: 'Type d\'événement invalide' })
    }),

    // Page/ressource
    page_url: z.string()
        .url('URL invalide')
        .max(500, 'URL trop longue'),

    page_title: z.string()
        .max(200, 'Titre trop long')
        .optional(),

    referrer: z.string()
        .url('Referrer URL invalide')
        .max(500)
        .optional()
        .nullable(),

    // Session (UUID v4 généré côté client)
    session_id: z.string()
        .uuid('Session ID invalide'),

    // Device info (détecté côté client)
    device_type: z.enum(['mobile', 'tablet', 'desktop', 'unknown'], {
        errorMap: () => ({ message: 'Type de device invalide' })
    }).optional().default('unknown'),

    browser: z.string()
        .max(50)
        .optional(),

    os: z.string()
        .max(50)
        .optional(),

    country_code: z.string()
        .length(2, 'Code pays invalide (ISO 3166-1)')
        .toUpperCase()
        .optional()
        .nullable(),

    // Métadonnées personnalisées (JSON)
    metadata: z.record(z.string(), z.unknown()).optional().default({})
});

/**
 * Schéma pour query params dashboard analytics
 */
export const analyticsDashboardQuerySchema = z.object({
    // Période
    start_date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format date invalide (YYYY-MM-DD)')
        .optional(),

    end_date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format date invalide (YYYY-MM-DD)')
        .optional(),

    // Filtres
    event_type: z.enum(['page_view', 'click', 'download', 'form_submit', 'scroll', 'custom']).optional(),
    page_url: z.string().max(500).optional(),
    device_type: z.enum(['mobile', 'tablet', 'desktop', 'unknown']).optional(),
    country_code: z.string().length(2).optional(),

    // Pagination
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(1000).optional().default(100)
});

/**
 * Schéma pour requête résumé analytics
 */
export const analyticsSummaryQuerySchema = z.object({
    start_date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format date invalide')
        .optional(),

    end_date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format date invalide')
        .optional(),

    // Par défaut: derniers 30 jours
    days: z.coerce.number().int().min(1).max(365).optional().default(30)
});

// ===================================
// HELPERS
// ===================================

/**
 * Détecter type de device depuis user agent
 * @param {string} userAgent - User agent string
 * @returns {string} - 'mobile', 'tablet', 'desktop', 'unknown'
 */
export function detectDeviceType(userAgent) {
    if (!userAgent) return 'unknown';

    const ua = userAgent.toLowerCase();

    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
        return 'tablet';
    }

    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
        return 'mobile';
    }

    return 'desktop';
}

/**
 * Détecter navigateur depuis user agent
 * @param {string} userAgent - User agent string
 * @returns {string} - Nom du navigateur
 */
export function detectBrowser(userAgent) {
    if (!userAgent) return 'Unknown';

    const ua = userAgent.toLowerCase();

    if (ua.includes('edg')) return 'Edge';
    if (ua.includes('chrome')) return 'Chrome';
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
    if (ua.includes('opera') || ua.includes('opr')) return 'Opera';

    return 'Unknown';
}

/**
 * Détecter OS depuis user agent
 * @param {string} userAgent - User agent string
 * @returns {string} - Nom de l'OS
 */
export function detectOS(userAgent) {
    if (!userAgent) return 'Unknown';

    const ua = userAgent.toLowerCase();

    if (ua.includes('win')) return 'Windows';
    if (ua.includes('mac')) return 'macOS';
    if (ua.includes('linux')) return 'Linux';
    if (ua.includes('android')) return 'Android';
    if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';

    return 'Unknown';
}

/**
 * Valider si tracking autorisé (consentement RGPD)
 * @param {Object} req - Express request
 * @returns {boolean} - True si autorisé
 */
export function isTrackingAllowed(req) {
    // Vérifier cookie de consentement ou header
    const consent = req.cookies?.analytics_consent || req.headers['x-analytics-consent'];
    return consent === 'true' || consent === '1';
}

// ===================================
// EXPORTS
// ===================================

export default {
    analyticsEventSchema,
    analyticsDashboardQuerySchema,
    analyticsSummaryQuerySchema,
    detectDeviceType,
    detectBrowser,
    detectOS,
    isTrackingAllowed
};
