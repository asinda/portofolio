/**
 * ROUTES BLOG
 * Sprint 3 - Portfolio Alice Sindayigaya
 * Routes pour blog posts et commentaires
 */

import express from 'express';
import { blogController } from '../controllers/blogController.js';
import { blogCommentsController } from '../controllers/blogCommentsController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import {
    blogPostSchema,
    blogPostUpdateSchema,
    blogPostQuerySchema,
    blogSlugParamSchema,
    blogCommentSchema,
    blogCommentModerationSchema,
    blogCommentQuerySchema,
    uuidParamSchema
} from '../schemas/blog.schemas.js';

const router = express.Router();

// ===================================
// ROUTES BLOG POSTS
// ===================================

/**
 * GET /api/blog/posts
 * Lister les articles (public: seulement published, auteur: tous)
 * Query params: page, limit, status, category, tag, search, sort, order
 */
router.get(
    '/posts',
    validate(blogPostQuerySchema, 'query'),
    blogController.getAll
);

/**
 * GET /api/blog/posts/:slug
 * Récupérer un article par slug (incrémente vues si publié)
 */
router.get(
    '/posts/:slug',
    validate(blogSlugParamSchema, 'params'),
    blogController.getBySlug
);

/**
 * POST /api/blog/posts
 * Créer un nouvel article (authentifié)
 * Auto-génération: slug, excerpt, read_time, published_at
 */
router.post(
    '/posts',
    authenticate,
    validate(blogPostSchema),
    blogController.create
);

/**
 * PUT /api/blog/posts/:id
 * Mettre à jour un article (auteur uniquement)
 */
router.put(
    '/posts/:id',
    authenticate,
    validate(uuidParamSchema, 'params'),
    validate(blogPostUpdateSchema),
    blogController.update
);

/**
 * DELETE /api/blog/posts/:id
 * Supprimer un article (auteur uniquement)
 */
router.delete(
    '/posts/:id',
    authenticate,
    validate(uuidParamSchema, 'params'),
    blogController.delete
);

/**
 * POST /api/blog/posts/:id/view
 * Incrémenter le compteur de vues (public)
 */
router.post(
    '/posts/:id/view',
    validate(uuidParamSchema, 'params'),
    blogController.incrementViews
);

/**
 * GET /api/blog/categories
 * Lister toutes les catégories avec comptage
 */
router.get('/categories', blogController.getCategories);

/**
 * GET /api/blog/tags
 * Lister tous les tags
 */
router.get('/tags', blogController.getTags);

// ===================================
// ROUTES COMMENTAIRES (PUBLIC)
// ===================================

/**
 * GET /api/blog/posts/:postId/comments
 * Lister les commentaires approuvés d'un post (public)
 */
router.get(
    '/posts/:postId/comments',
    validate(uuidParamSchema, 'params'),
    validate(blogCommentQuerySchema, 'query'),
    blogCommentsController.getByPost
);

/**
 * POST /api/blog/comments
 * Créer un commentaire (public, modération requise)
 * Rate limited: voir server.js ou middleware spécifique
 */
router.post(
    '/comments',
    validate(blogCommentSchema),
    blogCommentsController.create
);

// ===================================
// ROUTES MODÉRATION (AUTEUR AUTHENTIFIÉ)
// ===================================

/**
 * GET /api/blog/comments/moderation
 * Lister les commentaires en attente de modération (auteur uniquement)
 * Query params: page, limit, status (pending/approved/spam/rejected)
 */
router.get(
    '/comments/moderation',
    authenticate,
    validate(blogCommentQuerySchema, 'query'),
    blogCommentsController.getPending
);

/**
 * PUT /api/blog/comments/:id/moderate
 * Modérer un commentaire: approuver, rejeter, spam (auteur uniquement)
 */
router.put(
    '/comments/:id/moderate',
    authenticate,
    validate(uuidParamSchema, 'params'),
    validate(blogCommentModerationSchema),
    blogCommentsController.moderate
);

/**
 * DELETE /api/blog/comments/:id
 * Supprimer un commentaire (auteur uniquement)
 */
router.delete(
    '/comments/:id',
    authenticate,
    validate(uuidParamSchema, 'params'),
    blogCommentsController.delete
);

// ===================================
// EXPORT
// ===================================

export default router;
