/**
 * SCHÉMAS ZOD - BLOG SYSTEM
 * Sprint 3 - Portfolio Alice Sindayigaya
 * Validation pour: blog_posts, blog_comments, blog_tags
 */

import { z } from 'zod';

// ===================================
// SCHÉMAS BLOG POSTS
// ===================================

/**
 * Schéma de base pour un article de blog (sans refinements)
 */
const blogPostBaseSchema = z.object({
    // Contenu (requis)
    title: z.string()
        .min(5, 'Titre trop court (min 5 caractères)')
        .max(200, 'Titre trop long (max 200 caractères)'),

    slug: z.string()
        .min(3, 'Slug trop court')
        .max(250, 'Slug trop long')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug invalide (lowercase, hyphens uniquement)')
        .optional(), // Auto-généré si absent

    content: z.string()
        .min(50, 'Contenu trop court (min 50 caractères)')
        .max(100000, 'Contenu trop long (max 100k caractères)'),

    excerpt: z.string()
        .max(500, 'Extrait trop long (max 500 caractères)')
        .optional(),

    cover_image: z.string()
        .url('URL image invalide')
        .max(500)
        .optional(),

    // Organisation
    category: z.enum([
        'DevOps',
        'Cloud',
        'Kubernetes',
        'Terraform',
        'Ansible',
        'CI/CD',
        'Monitoring',
        'Automation',
        'Career',
        'Tutorial',
        'Other'
    ], {
        errorMap: () => ({ message: 'Catégorie invalide' })
    }),

    tags: z.array(
        z.string()
            .min(2)
            .max(50)
            .regex(/^[a-z0-9-]+$/, 'Tag invalide (lowercase, hyphens)')
    )
        .max(10, 'Maximum 10 tags')
        .optional()
        .default([]),

    // Publication
    status: z.enum(['draft', 'published', 'archived'], {
        errorMap: () => ({ message: 'Statut invalide' })
    }).default('draft'),

    published_at: z.string()
        .datetime('Date de publication invalide')
        .or(z.date())
        .optional()
        .nullable(),

    // Métriques (optionnel, calculé auto)
    read_time: z.number()
        .int()
        .min(1)
        .max(120)
        .optional(),

    // SEO (optionnel)
    seo_title: z.string()
        .max(70, 'SEO title trop long (max 70 caractères)')
        .optional(),

    seo_description: z.string()
        .max(160, 'SEO description trop longue (max 160 caractères)')
        .optional(),

    seo_keywords: z.array(z.string().max(50))
        .max(20, 'Maximum 20 keywords SEO')
        .optional()
});

/**
 * Schéma pour créer un article de blog (avec validation refinements)
 */
export const blogPostSchema = blogPostBaseSchema.refine(
    (data) => {
        // Si publié, published_at doit être défini
        if (data.status === 'published' && !data.published_at) {
            return false;
        }
        return true;
    },
    {
        message: 'Date de publication requise pour status=published',
        path: ['published_at']
    }
);

/**
 * Schéma pour mise à jour partielle d'un post (sans refinements)
 */
export const blogPostUpdateSchema = blogPostBaseSchema.partial();

/**
 * Schéma pour query params de recherche/filtrage posts
 */
export const blogPostQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    category: z.string().optional(),
    tag: z.string().optional(),
    search: z.string().max(200).optional(),
    sort: z.enum(['created_at', 'updated_at', 'published_at', 'views', 'title']).optional().default('published_at'),
    order: z.enum(['asc', 'desc']).optional().default('desc')
});

// ===================================
// SCHÉMAS BLOG COMMENTS
// ===================================

/**
 * Schéma pour créer un commentaire (public, non-authentifié)
 */
export const blogCommentSchema = z.object({
    post_id: z.string()
        .uuid('ID post invalide'),

    parent_comment_id: z.string()
        .uuid('ID commentaire parent invalide')
        .optional()
        .nullable(),

    // Auteur (non-authentifié)
    author_name: z.string()
        .min(2, 'Nom trop court (min 2 caractères)')
        .max(100, 'Nom trop long (max 100 caractères)')
        .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nom invalide (lettres, espaces, tirets uniquement)'),

    author_email: z.string()
        .email('Email invalide')
        .max(255, 'Email trop long'),

    author_website: z.string()
        .url('URL website invalide')
        .max(255)
        .optional()
        .nullable(),

    // Contenu
    content: z.string()
        .min(10, 'Commentaire trop court (min 10 caractères)')
        .max(5000, 'Commentaire trop long (max 5000 caractères)')
        .refine(
            (val) => {
                // Détecter spam: trop de liens
                const linkCount = (val.match(/https?:\/\//gi) || []).length;
                return linkCount <= 2;
            },
            {
                message: 'Maximum 2 liens autorisés (anti-spam)'
            }
        )
});

/**
 * Schéma pour modération de commentaire (admin/auteur)
 */
export const blogCommentModerationSchema = z.object({
    status: z.enum(['pending', 'approved', 'spam', 'rejected'], {
        errorMap: () => ({ message: 'Statut invalide' })
    })
});

/**
 * Schéma pour query params commentaires
 */
export const blogCommentQuerySchema = z.object({
    post_id: z.string().uuid().optional(),
    status: z.enum(['pending', 'approved', 'spam', 'rejected']).optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20)
});

// ===================================
// SCHÉMAS BLOG TAGS
// ===================================

/**
 * Schéma pour créer un tag
 */
export const blogTagSchema = z.object({
    name: z.string()
        .min(2, 'Nom tag trop court')
        .max(50, 'Nom tag trop long')
        .regex(/^[a-zA-Z0-9\s-]+$/, 'Tag invalide (lettres, chiffres, espaces, tirets)'),

    slug: z.string()
        .min(2)
        .max(60)
        .regex(/^[a-z0-9-]+$/, 'Slug invalide (lowercase, hyphens)')
        .optional() // Auto-généré depuis name si absent
});

// ===================================
// SCHÉMAS UTILITAIRES
// ===================================

/**
 * Schéma pour récupérer un post par slug
 */
export const blogSlugParamSchema = z.object({
    slug: z.string()
        .min(3)
        .max(250)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug invalide')
});

/**
 * Schéma pour UUID param
 */
export const uuidParamSchema = z.object({
    id: z.string().uuid('UUID invalide')
});

/**
 * Schéma pour incrémenter vues
 */
export const incrementViewsSchema = z.object({
    slug: z.string().min(3).max(250)
});

// ===================================
// HELPERS
// ===================================

/**
 * Générer un slug depuis un titre
 * @param {string} title - Titre de l'article
 * @returns {string} - Slug formaté
 */
export function generateSlug(title) {
    return title
        .toLowerCase()
        .normalize('NFD') // Décomposer les accents
        .replace(/[\u0300-\u036f]/g, '') // Retirer les accents
        .replace(/[^a-z0-9\s-]/g, '') // Retirer caractères spéciaux
        .trim()
        .replace(/\s+/g, '-') // Espaces → tirets
        .replace(/-+/g, '-'); // Tirets multiples → 1 seul
}

/**
 * Calculer temps de lecture estimé
 * @param {string} content - Contenu de l'article (markdown/html)
 * @returns {number} - Minutes de lecture
 */
export function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return Math.max(1, minutes); // Minimum 1 minute
}

/**
 * Extraire extrait depuis contenu si absent
 * @param {string} content - Contenu complet
 * @param {number} maxLength - Longueur max (défaut 300)
 * @returns {string} - Extrait
 */
export function extractExcerpt(content, maxLength = 300) {
    // Retirer balises HTML/Markdown
    const plainText = content
        .replace(/<[^>]+>/g, '') // HTML tags
        .replace(/[#*_`~]/g, '') // Markdown symbols
        .trim();

    if (plainText.length <= maxLength) {
        return plainText;
    }

    // Couper à la phrase précédente
    const excerpt = plainText.substring(0, maxLength);
    const lastPeriod = excerpt.lastIndexOf('.');

    if (lastPeriod > maxLength / 2) {
        return excerpt.substring(0, lastPeriod + 1);
    }

    return excerpt + '...';
}

// ===================================
// EXPORTS
// ===================================

export default {
    // Posts
    blogPostSchema,
    blogPostUpdateSchema,
    blogPostQuerySchema,
    blogSlugParamSchema,
    incrementViewsSchema,

    // Comments
    blogCommentSchema,
    blogCommentModerationSchema,
    blogCommentQuerySchema,

    // Tags
    blogTagSchema,

    // Utilitaires
    uuidParamSchema,

    // Helpers
    generateSlug,
    calculateReadTime,
    extractExcerpt
};
