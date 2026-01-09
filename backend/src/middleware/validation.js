import { z } from 'zod';
import logger from '../config/logger.js';

/**
 * Middleware factory pour valider les données avec Zod
 * @param {z.ZodSchema} schema - Schéma Zod de validation
 * @param {string} source - Source des données à valider: 'body', 'query', 'params'
 * @returns {Function} Middleware Express
 */
export const validate = (schema, source = 'body') => {
    return async (req, res, next) => {
        try {
            const dataToValidate = req[source];

            // Valider les données avec le schéma Zod
            const validatedData = await schema.parseAsync(dataToValidate);

            // Remplacer les données par les données validées et sanitizées
            req[source] = validatedData;

            logger.debug(`Validation réussie pour ${req.method} ${req.path}`);
            next();
        } catch (error) {
            // Si erreur de validation Zod
            if (error instanceof z.ZodError) {
                logger.warn(`Erreur de validation pour ${req.method} ${req.path}:`, {
                    errors: error.errors
                });

                return res.status(400).json({
                    success: false,
                    error: 'Erreur de validation des données',
                    details: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message,
                        code: err.code
                    }))
                });
            }

            // Autre type d'erreur
            logger.error('Erreur inattendue dans le middleware de validation:', error);
            next(error);
        }
    };
};

// ============================================
// SCHÉMAS UTILITAIRES
// ============================================

/**
 * Schéma pour la pagination dans les query params
 */
export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sort: z.string().max(50).optional().default('created_at'),
    order: z.enum(['asc', 'desc']).default('desc')
});

/**
 * Schéma pour la recherche dans les query params
 */
export const searchSchema = z.object({
    q: z.string().max(200).optional(),
    category: z.string().max(50).optional(),
    tags: z.string().transform(str => str ? str.split(',').map(t => t.trim()) : []).optional()
});

/**
 * Helper pour valider les IDs numériques dans les params
 */
export const idParamSchema = z.object({
    id: z.coerce.number().int().positive({ message: 'ID doit être un nombre positif' })
});

/**
 * Helper pour valider les slugs dans les params
 */
export const slugParamSchema = z.object({
    slug: z.string()
        .min(1, 'Slug requis')
        .max(200, 'Slug trop long')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug invalide (lettres minuscules, chiffres et tirets uniquement)')
});
