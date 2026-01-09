/**
 * BLOG COMMENTS CONTROLLER
 * Sprint 3 - Portfolio Alice Sindayigaya
 * Gestion commentaires blog avec modération
 */

import supabase from '../config/supabase.js';
import logger from '../config/logger.js';
import crypto from 'crypto';

// ===================================
// COMMENTAIRES PUBLICS
// ===================================

/**
 * GET /api/blog/posts/:postId/comments
 * Récupérer les commentaires approuvés d'un post
 */
export async function getCommentsByPost(req, res) {
    try {
        const { postId } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const { data, error, count } = await supabase
            .from('blog_comments')
            .select('*', { count: 'exact' })
            .eq('post_id', postId)
            .eq('status', 'approved')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

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
        logger.error('Erreur getCommentsByPost:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des commentaires'
        });
    }
}

/**
 * POST /api/blog/comments
 * Créer un nouveau commentaire (modération requise)
 */
export async function createComment(req, res) {
    try {
        const commentData = { ...req.body };

        // Hasher l'IP (RGPD)
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        commentData.ip_hash = crypto
            .createHash('sha256')
            .update(ipAddress)
            .digest('hex');

        // User agent
        commentData.user_agent = req.headers['user-agent'];

        // Statut par défaut: pending (modération)
        commentData.status = 'pending';

        // Créer le commentaire
        const { data, error } = await supabase
            .from('blog_comments')
            .insert(commentData)
            .select()
            .single();

        if (error) throw error;

        logger.info(`Commentaire créé (pending): ${data.id} sur post ${data.post_id}`);

        return res.status(201).json({
            success: true,
            message: 'Commentaire soumis. Il sera visible après modération.',
            data: {
                id: data.id,
                status: data.status
            }
        });

    } catch (error) {
        logger.error('Erreur createComment:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la création du commentaire'
        });
    }
}

// ===================================
// MODÉRATION (AUTEUR AUTHENTIFIÉ)
// ===================================

/**
 * GET /api/blog/comments/moderation
 * Lister les commentaires en attente de modération (auteur uniquement)
 */
export async function getPendingComments(req, res) {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20, status = 'pending' } = req.query;
        const offset = (page - 1) * limit;

        // Récupérer les commentaires des posts de l'auteur
        const { data, error, count } = await supabase
            .from('blog_comments')
            .select(`
                *,
                blog_posts!inner(id, title, slug, user_id)
            `, { count: 'exact' })
            .eq('blog_posts.user_id', userId)
            .eq('status', status)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

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
        logger.error('Erreur getPendingComments:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des commentaires'
        });
    }
}

/**
 * PUT /api/blog/comments/:id/moderate
 * Modérer un commentaire (approuver, rejeter, spam)
 */
export async function moderateComment(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved', 'rejected', 'spam'
        const userId = req.user.id;

        // Vérifier que le commentaire appartient à un post de l'auteur
        const { data: comment, error: fetchError } = await supabase
            .from('blog_comments')
            .select(`
                *,
                blog_posts!inner(user_id)
            `)
            .eq('id', id)
            .single();

        if (fetchError || !comment) {
            return res.status(404).json({
                success: false,
                error: 'Commentaire non trouvé'
            });
        }

        if (comment.blog_posts.user_id !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Non autorisé à modérer ce commentaire'
            });
        }

        // Mise à jour du statut
        const { data, error } = await supabase
            .from('blog_comments')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        logger.info(`Commentaire ${id} modéré: ${status} par user ${userId}`);

        return res.json({
            success: true,
            data
        });

    } catch (error) {
        logger.error('Erreur moderateComment:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la modération du commentaire'
        });
    }
}

/**
 * DELETE /api/blog/comments/:id
 * Supprimer un commentaire (auteur uniquement)
 */
export async function deleteComment(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Vérifier propriété
        const { data: comment, error: fetchError } = await supabase
            .from('blog_comments')
            .select(`
                *,
                blog_posts!inner(user_id)
            `)
            .eq('id', id)
            .single();

        if (fetchError || !comment) {
            return res.status(404).json({
                success: false,
                error: 'Commentaire non trouvé'
            });
        }

        if (comment.blog_posts.user_id !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Non autorisé à supprimer ce commentaire'
            });
        }

        // Supprimer
        const { error } = await supabase
            .from('blog_comments')
            .delete()
            .eq('id', id);

        if (error) throw error;

        logger.info(`Commentaire ${id} supprimé par user ${userId}`);

        return res.json({
            success: true,
            message: 'Commentaire supprimé'
        });

    } catch (error) {
        logger.error('Erreur deleteComment:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la suppression du commentaire'
        });
    }
}

// ===================================
// EXPORTS
// ===================================

export const blogCommentsController = {
    // Public
    getByPost: getCommentsByPost,
    create: createComment,

    // Modération (auteur authentifié)
    getPending: getPendingComments,
    moderate: moderateComment,
    delete: deleteComment
};

export default blogCommentsController;
