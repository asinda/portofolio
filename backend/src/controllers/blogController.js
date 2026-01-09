/**
 * BLOG CONTROLLER
 * Sprint 3 - Portfolio Alice Sindayigaya
 * Gestion CRUD blog posts + méthodes spécialisées
 */

import { createCRUDController } from './crudController.js';
import supabase from '../config/supabase.js';
import logger from '../config/logger.js';
import { generateSlug, calculateReadTime, extractExcerpt } from '../schemas/blog.schemas.js';

// Créer controller CRUD de base pour blog_posts
const baseBlogController = createCRUDController('blog_posts');

// ===================================
// MÉTHODES SPÉCIALISÉES BLOG
// ===================================

/**
 * GET /api/blog/posts/:slug
 * Récupérer un post par son slug (avec incrémentation vues)
 */
export async function getPostBySlug(req, res) {
    try {
        const { slug } = req.params;

        // Récupérer le post
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // Not found
                return res.status(404).json({
                    success: false,
                    error: 'Article non trouvé'
                });
            }
            throw error;
        }

        // Vérifier que le post est publié (sauf si auteur authentifié)
        const userId = req.user?.id;
        if (data.status !== 'published' && data.user_id !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Article non accessible'
            });
        }

        // Incrémenter les vues (seulement si publié)
        if (data.status === 'published') {
            await supabase.rpc('increment_post_views', { post_slug: slug });
        }

        // Compter les commentaires approuvés
        const { count: commentsCount } = await supabase
            .from('blog_comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', data.id)
            .eq('status', 'approved');

        return res.json({
            success: true,
            data: {
                ...data,
                comments_count: commentsCount || 0
            }
        });

    } catch (error) {
        logger.error('Erreur getPostBySlug:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération de l\'article'
        });
    }
}

/**
 * GET /api/blog/posts (override du CRUD de base pour enrichir)
 * Lister les posts avec filtres avancés
 */
export async function getAllPosts(req, res) {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            category,
            tag,
            search,
            sort = 'published_at',
            order = 'desc'
        } = req.query;

        const offset = (page - 1) * limit;

        // Construire requête
        let query = supabase
            .from('blog_posts')
            .select('*', { count: 'exact' });

        // Filtres
        if (status) {
            query = query.eq('status', status);
        } else {
            // Par défaut, seulement posts publiés si non-authentifié
            if (!req.user) {
                query = query.eq('status', 'published');
            }
        }

        if (category) {
            query = query.eq('category', category);
        }

        if (tag) {
            query = query.contains('tags', [tag]);
        }

        if (search) {
            query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
        }

        // Tri et pagination
        query = query
            .order(sort, { ascending: order === 'asc' })
            .range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) throw error;

        return res.json({
            success: true,
            data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        logger.error('Erreur getAllPosts:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des articles'
        });
    }
}

/**
 * POST /api/blog/posts (override pour auto-génération slug/excerpt/read_time)
 * Créer un nouveau post avec enrichissements automatiques
 */
export async function createPost(req, res) {
    try {
        const postData = { ...req.body };
        const userId = req.user.id;

        // 1. Auto-générer slug si absent
        if (!postData.slug) {
            postData.slug = generateSlug(postData.title);
        }

        // Vérifier unicité du slug
        const { data: existingPost } = await supabase
            .from('blog_posts')
            .select('slug')
            .eq('slug', postData.slug)
            .single();

        if (existingPost) {
            // Ajouter suffixe numérique
            const timestamp = Date.now();
            postData.slug = `${postData.slug}-${timestamp}`;
        }

        // 2. Auto-générer excerpt si absent
        if (!postData.excerpt && postData.content) {
            postData.excerpt = extractExcerpt(postData.content);
        }

        // 3. Calculer temps de lecture
        if (postData.content) {
            postData.read_time = calculateReadTime(postData.content);
        }

        // 4. Si publié, définir published_at
        if (postData.status === 'published' && !postData.published_at) {
            postData.published_at = new Date().toISOString();
        }

        // 5. Ajouter user_id
        postData.user_id = userId;

        // Créer le post
        const { data, error } = await supabase
            .from('blog_posts')
            .insert(postData)
            .select()
            .single();

        if (error) throw error;

        logger.info(`Post créé: ${data.slug} par user ${userId}`);

        return res.status(201).json({
            success: true,
            data
        });

    } catch (error) {
        logger.error('Erreur createPost:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la création de l\'article'
        });
    }
}

/**
 * PUT /api/blog/posts/:id (override pour mise à jour enrichie)
 * Mettre à jour un post avec enrichissements automatiques
 */
export async function updatePost(req, res) {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        const userId = req.user.id;

        // Vérifier propriété
        const { data: existingPost, error: fetchError } = await supabase
            .from('blog_posts')
            .select('user_id')
            .eq('id', id)
            .single();

        if (fetchError || !existingPost) {
            return res.status(404).json({
                success: false,
                error: 'Article non trouvé'
            });
        }

        if (existingPost.user_id !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Non autorisé à modifier cet article'
            });
        }

        // Re-calculer temps de lecture si content modifié
        if (updateData.content) {
            updateData.read_time = calculateReadTime(updateData.content);
        }

        // Si passage à published, définir published_at
        if (updateData.status === 'published' && !updateData.published_at) {
            updateData.published_at = new Date().toISOString();
        }

        // Mise à jour
        const { data, error } = await supabase
            .from('blog_posts')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        logger.info(`Post mis à jour: ${data.slug}`);

        return res.json({
            success: true,
            data
        });

    } catch (error) {
        logger.error('Erreur updatePost:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la mise à jour de l\'article'
        });
    }
}

/**
 * GET /api/blog/categories
 * Lister toutes les catégories avec comptage
 */
export async function getCategories(req, res) {
    try {
        // Récupérer les catégories distinctes avec count
        const { data, error } = await supabase
            .from('blog_posts')
            .select('category')
            .eq('status', 'published');

        if (error) throw error;

        // Compter les occurrences
        const categoryCounts = data.reduce((acc, { category }) => {
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});

        // Formater en tableau
        const categories = Object.entries(categoryCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        return res.json({
            success: true,
            data: categories
        });

    } catch (error) {
        logger.error('Erreur getCategories:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des catégories'
        });
    }
}

/**
 * GET /api/blog/tags
 * Lister tous les tags
 */
export async function getTags(req, res) {
    try {
        const { data, error } = await supabase
            .from('blog_tags')
            .select('*')
            .order('count', { ascending: false });

        if (error) throw error;

        return res.json({
            success: true,
            data
        });

    } catch (error) {
        logger.error('Erreur getTags:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des tags'
        });
    }
}

// ===================================
// EXPORTS
// ===================================

export const blogController = {
    // CRUD de base (hérite de crudController)
    ...baseBlogController,

    // Méthodes override enrichies
    getAll: getAllPosts,
    create: createPost,
    update: updatePost,

    // Méthodes spécialisées blog
    getBySlug: getPostBySlug,
    getCategories,
    getTags
};

export default blogController;
