/**
 * ROUTES CONTACT
 * Sprint 3 - Portfolio Alice Sindayigaya
 * Routes pour formulaire de contact
 */

import express from 'express';
import { contactController } from '../controllers/contactController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { contactLimiter } from '../middleware/rateLimit.js';
import {
    contactMessageSchema,
    contactStatusSchema,
    contactQuerySchema
} from '../schemas/contact.schemas.js';
import { uuidParamSchema } from '../schemas/blog.schemas.js';

const router = express.Router();

// ===================================
// ROUTES PUBLIQUES
// ===================================

/**
 * POST /api/contact
 * Envoyer un message de contact (rate limited: 3/heure)
 * Email de notification envoyé automatiquement
 */
router.post(
    '/',
    contactLimiter, // Rate limit: 3 messages/heure
    validate(contactMessageSchema),
    contactController.create
);

// ===================================
// ROUTES ADMIN (AUTHENTIFIÉES)
// ===================================

/**
 * GET /api/contact/messages
 * Lister tous les messages (admin)
 * Query params: page, limit, status, search, sort, order
 */
router.get(
    '/messages',
    authenticate,
    validate(contactQuerySchema, 'query'),
    contactController.getAll
);

/**
 * GET /api/contact/messages/:id
 * Récupérer un message par ID (admin)
 * Marque automatiquement comme "read"
 */
router.get(
    '/messages/:id',
    authenticate,
    validate(uuidParamSchema, 'params'),
    contactController.getById
);

/**
 * PUT /api/contact/messages/:id/status
 * Mettre à jour le statut d'un message (admin)
 * Status: new, read, replied, archived, spam
 */
router.put(
    '/messages/:id/status',
    authenticate,
    validate(uuidParamSchema, 'params'),
    validate(contactStatusSchema),
    contactController.updateStatus
);

/**
 * DELETE /api/contact/messages/:id
 * Supprimer un message (admin)
 */
router.delete(
    '/messages/:id',
    authenticate,
    validate(uuidParamSchema, 'params'),
    contactController.delete
);

/**
 * GET /api/contact/stats
 * Statistiques des messages (admin)
 * Retourne: total, par statut, ce mois, cette semaine
 */
router.get(
    '/stats',
    authenticate,
    contactController.getStats
);

// ===================================
// EXPORT
// ===================================

export default router;
