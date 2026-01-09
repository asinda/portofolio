/**
 * ROUTES ANALYTICS
 * Sprint 3 - Portfolio Alice Sindayigaya
 * Routes pour tracking analytics RGPD-compliant
 */

import express from 'express';
import { analyticsController } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { analyticsLimiter } from '../middleware/rateLimit.js';
import {
    analyticsEventSchema,
    analyticsDashboardQuerySchema,
    analyticsSummaryQuerySchema
} from '../schemas/analytics.schemas.js';

const router = express.Router();

// ===================================
// ROUTES PUBLIQUES (TRACKING)
// ===================================

/**
 * POST /api/analytics/track
 * Tracker un événement (rate limited: 30/min par session)
 * IP hashée SHA-256 (RGPD)
 * Nécessite consentement utilisateur (header X-Analytics-Consent: true)
 */
router.post(
    '/track',
    analyticsLimiter, // Rate limit: 30 events/minute
    validate(analyticsEventSchema),
    analyticsController.track
);

// ===================================
// ROUTES ADMIN (DASHBOARD)
// ===================================

/**
 * GET /api/analytics/dashboard
 * Dashboard analytics avec métriques agrégées (admin)
 * Query params: start_date, end_date, event_type, page_url, device_type, days
 * Retourne: total events, sessions uniques, top pages, devices, browsers, etc.
 */
router.get(
    '/dashboard',
    authenticate,
    validate(analyticsDashboardQuerySchema, 'query'),
    analyticsController.getDashboard
);

/**
 * GET /api/analytics/summary
 * Résumés pré-calculés par jour (rapide, optimisé)
 * Query params: start_date, end_date, days
 * Retourne: métriques quotidiennes + totaux
 */
router.get(
    '/summary',
    authenticate,
    validate(analyticsSummaryQuerySchema, 'query'),
    analyticsController.getSummary
);

/**
 * GET /api/analytics/real-time
 * Événements en temps réel (dernières 5 minutes)
 * Retourne: sessions actives + 50 derniers events
 */
router.get(
    '/real-time',
    authenticate,
    analyticsController.getRealTime
);

/**
 * POST /api/analytics/calculate-daily
 * Calculer résumé journalier (cron job)
 * Body: { date: 'YYYY-MM-DD' } (optionnel, défaut = hier)
 */
router.post(
    '/calculate-daily',
    authenticate,
    analyticsController.calculateDaily
);

// ===================================
// EXPORT
// ===================================

export default router;
