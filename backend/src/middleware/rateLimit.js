/**
 * RATE LIMITING MIDDLEWARE
 * Sprint 3 - Portfolio Alice Sindayigaya
 * Protection contre spam et abus (contact, comments, analytics)
 */

import rateLimit from 'express-rate-limit';
import logger from '../config/logger.js';

// ===================================
// RATE LIMITERS SPÉCIFIQUES
// ===================================

/**
 * Rate limiter STRICT pour formulaire contact
 * 3 messages par heure par IP
 */
export const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 3, // 3 requêtes max
    message: {
        success: false,
        error: 'Trop de messages envoyés. Veuillez réessayer dans 1 heure.',
        retryAfter: '1 hour'
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    handler: (req, res) => {
        logger.warn(`Rate limit dépassé (contact): IP ${req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Trop de messages envoyés. Veuillez réessayer dans 1 heure.',
            retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000 / 60) + ' minutes'
        });
    },
    skip: (req) => {
        // Skip rate limiting pour IPs whitelistées (optionnel)
        const whitelist = process.env.IP_WHITELIST?.split(',') || [];
        return whitelist.includes(req.ip);
    }
});

/**
 * Rate limiter pour commentaires blog
 * 5 commentaires par 15 minutes par IP
 */
export const commentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requêtes max
    message: {
        success: false,
        error: 'Trop de commentaires postés. Veuillez patienter 15 minutes.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Rate limit dépassé (comments): IP ${req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Trop de commentaires postés. Veuillez patienter.',
            retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000) + ' secondes'
        });
    }
});

/**
 * Rate limiter pour tracking analytics
 * 30 events par minute par session
 */
export const analyticsLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 requêtes max
    keyGenerator: (req) => {
        // Rate limit par session_id plutôt que par IP
        return req.body.session_id || req.ip;
    },
    message: {
        success: false,
        error: 'Trop d\'événements trackés. Ralentissez.',
        retryAfter: '1 minute'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Rate limit dépassé (analytics): session ${req.body.session_id || req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Trop d\'événements trackés.',
            retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000) + ' secondes'
        });
    },
    skip: (req) => {
        // Skip si tracking désactivé côté client
        return req.headers['x-analytics-consent'] !== 'true';
    }
});

/**
 * Rate limiter MODÉRÉ pour API générale
 * 100 requêtes par 15 minutes par IP
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requêtes max
    message: {
        success: false,
        error: 'Trop de requêtes. Veuillez ralentir.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Rate limit dépassé (API générale): IP ${req.ip}, route ${req.path}`);
        res.status(429).json({
            success: false,
            error: 'Trop de requêtes. Veuillez ralentir.',
            retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000 / 60) + ' minutes'
        });
    }
});

/**
 * Rate limiter STRICT pour login (authentification)
 * 5 tentatives par 15 minutes par IP
 */
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requêtes max
    message: {
        success: false,
        error: 'Trop de tentatives de connexion. Compte temporairement bloqué.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Ne compter que les échecs
    handler: (req, res) => {
        logger.warn(`Rate limit dépassé (login): IP ${req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Trop de tentatives de connexion. Compte temporairement bloqué.',
            retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000 / 60) + ' minutes'
        });
    }
});

// ===================================
// HELPER: IP WHITELIST CHECK
// ===================================

/**
 * Middleware pour whitelist IPs (bypass rate limiting)
 * Usage: app.use('/api/special', ipWhitelist, routes)
 */
export function ipWhitelist(req, res, next) {
    const whitelist = process.env.IP_WHITELIST?.split(',') || [];

    if (whitelist.includes(req.ip)) {
        logger.info(`IP whitelistée détectée: ${req.ip}`);
        return next();
    }

    // Si pas whitelistée, continuer normalement (rate limiting appliqué)
    next();
}

// ===================================
// STORE PERSONNALISÉ (OPTIONNEL - REDIS)
// ===================================

/**
 * Store Redis pour rate limiting distribué (production)
 * Nécessite: npm install rate-limit-redis redis
 */
/*
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.connect().catch(err => {
    logger.error('Erreur connexion Redis:', err);
});

export const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'rl:' // Prefix pour les clés Redis
});

// Utilisation:
// export const contactLimiter = rateLimit({
//     store: redisStore,
//     windowMs: 60 * 60 * 1000,
//     max: 3
// });
*/

// ===================================
// EXPORTS
// ===================================

export default {
    contactLimiter,
    commentLimiter,
    analyticsLimiter,
    apiLimiter,
    loginLimiter,
    ipWhitelist
};
