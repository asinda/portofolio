/**
 * SCHÉMAS ZOD - CONTACT SYSTEM
 * Sprint 3 - Portfolio Alice Sindayigaya
 * Validation pour formulaire de contact
 */

import { z } from 'zod';

// ===================================
// SCHÉMA CONTACT MESSAGE
// ===================================

/**
 * Schéma pour créer un message de contact
 */
export const contactMessageSchema = z.object({
    // Informations requises
    name: z.string()
        .min(2, 'Nom trop court (min 2 caractères)')
        .max(100, 'Nom trop long (max 100 caractères)')
        .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nom invalide (lettres, espaces, apostrophes, tirets uniquement)'),

    email: z.string()
        .email('Email invalide')
        .max(255, 'Email trop long')
        .toLowerCase(),

    subject: z.string()
        .min(5, 'Sujet trop court (min 5 caractères)')
        .max(200, 'Sujet trop long (max 200 caractères)'),

    message: z.string()
        .min(20, 'Message trop court (min 20 caractères)')
        .max(5000, 'Message trop long (max 5000 caractères)')
        .refine(
            (val) => {
                // Anti-spam: détecter trop de liens
                const linkCount = (val.match(/https?:\/\//gi) || []).length;
                return linkCount <= 3;
            },
            {
                message: 'Maximum 3 liens autorisés (anti-spam)'
            }
        )
        .refine(
            (val) => {
                // Anti-spam: détecter messages tout en majuscules
                const upperCaseRatio = (val.match(/[A-Z]/g) || []).length / val.length;
                return upperCaseRatio < 0.7;
            },
            {
                message: 'Trop de majuscules détecté (possible spam)'
            }
        ),

    // Informations optionnelles
    phone: z.string()
        .regex(/^[\d\s\-\+\(\)]{10,20}$/, 'Numéro de téléphone invalide')
        .optional()
        .nullable(),

    company: z.string()
        .max(150, 'Nom de société trop long')
        .optional()
        .nullable()
});

/**
 * Schéma pour mise à jour statut message (admin)
 */
export const contactStatusSchema = z.object({
    status: z.enum(['new', 'read', 'replied', 'archived', 'spam'], {
        errorMap: () => ({ message: 'Statut invalide' })
    })
});

/**
 * Schéma pour query params filtrage messages
 */
export const contactQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    status: z.enum(['new', 'read', 'replied', 'archived', 'spam']).optional(),
    search: z.string().max(200).optional(),
    sort: z.enum(['created_at', 'name', 'email']).optional().default('created_at'),
    order: z.enum(['asc', 'desc']).optional().default('desc')
});

// ===================================
// EXPORTS
// ===================================

export default {
    contactMessageSchema,
    contactStatusSchema,
    contactQuerySchema
};
