/**
 * CONTACT CONTROLLER
 * Sprint 3 - Portfolio Alice Sindayigaya
 * Gestion formulaire de contact avec notification email
 */

import supabase from '../config/supabase.js';
import logger from '../config/logger.js';
import crypto from 'crypto';
import { sendContactNotification } from '../utils/email.js';

// ===================================
// PUBLIC - CRÉER MESSAGE
// ===================================

/**
 * POST /api/contact
 * Créer un message de contact (rate limited: 3/heure)
 */
export async function createContactMessage(req, res) {
    try {
        const messageData = { ...req.body };

        // Hasher l'IP (RGPD)
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        messageData.ip_hash = crypto
            .createHash('sha256')
            .update(ipAddress)
            .digest('hex');

        // User agent
        messageData.user_agent = req.headers['user-agent'];

        // Statut par défaut
        messageData.status = 'new';

        // Créer le message
        const { data, error } = await supabase
            .from('contact_messages')
            .insert(messageData)
            .select()
            .single();

        if (error) throw error;

        logger.info(`Message contact créé: ${data.id} de ${data.email}`);

        // Envoyer email de notification (async, ne pas bloquer la réponse)
        sendContactNotification(data)
            .then(() => logger.info(`Email notification envoyé pour message ${data.id}`))
            .catch(err => logger.error('Erreur envoi email notification:', err));

        return res.status(201).json({
            success: true,
            message: 'Message envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
            data: {
                id: data.id,
                created_at: data.created_at
            }
        });

    } catch (error) {
        logger.error('Erreur createContactMessage:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de l\'envoi du message. Veuillez réessayer.'
        });
    }
}

// ===================================
// ADMIN - GESTION MESSAGES
// ===================================

/**
 * GET /api/contact/messages
 * Lister tous les messages (admin authentifié)
 */
export async function getAllMessages(req, res) {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            search,
            sort = 'created_at',
            order = 'desc'
        } = req.query;

        const offset = (page - 1) * limit;

        // Construire requête
        let query = supabase
            .from('contact_messages')
            .select('*', { count: 'exact' });

        // Filtres
        if (status) {
            query = query.eq('status', status);
        }

        if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%,message.ilike.%${search}%`);
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
        logger.error('Erreur getAllMessages:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des messages'
        });
    }
}

/**
 * GET /api/contact/messages/:id
 * Récupérer un message par ID (admin authentifié)
 */
export async function getMessageById(req, res) {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // Not found
                return res.status(404).json({
                    success: false,
                    error: 'Message non trouvé'
                });
            }
            throw error;
        }

        // Marquer comme lu automatiquement
        if (data.status === 'new') {
            await supabase
                .from('contact_messages')
                .update({ status: 'read' })
                .eq('id', id);
        }

        return res.json({
            success: true,
            data
        });

    } catch (error) {
        logger.error('Erreur getMessageById:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération du message'
        });
    }
}

/**
 * PUT /api/contact/messages/:id/status
 * Mettre à jour le statut d'un message (admin authentifié)
 */
export async function updateMessageStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Définir processed_at si statut = replied
        const updateData = { status };
        if (status === 'replied' || status === 'archived') {
            updateData.processed_at = new Date().toISOString();
        }

        const { data, error } = await supabase
            .from('contact_messages')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({
                    success: false,
                    error: 'Message non trouvé'
                });
            }
            throw error;
        }

        logger.info(`Message ${id} status mis à jour: ${status}`);

        return res.json({
            success: true,
            data
        });

    } catch (error) {
        logger.error('Erreur updateMessageStatus:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la mise à jour du statut'
        });
    }
}

/**
 * DELETE /api/contact/messages/:id
 * Supprimer un message (admin authentifié)
 */
export async function deleteMessage(req, res) {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('contact_messages')
            .delete()
            .eq('id', id);

        if (error) throw error;

        logger.info(`Message ${id} supprimé`);

        return res.json({
            success: true,
            message: 'Message supprimé'
        });

    } catch (error) {
        logger.error('Erreur deleteMessage:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la suppression du message'
        });
    }
}

/**
 * GET /api/contact/stats
 * Statistiques des messages (admin authentifié)
 */
export async function getContactStats(req, res) {
    try {
        // Compter par statut
        const { data: allMessages, error } = await supabase
            .from('contact_messages')
            .select('status, created_at');

        if (error) throw error;

        const stats = {
            total: allMessages.length,
            new: allMessages.filter(m => m.status === 'new').length,
            read: allMessages.filter(m => m.status === 'read').length,
            replied: allMessages.filter(m => m.status === 'replied').length,
            archived: allMessages.filter(m => m.status === 'archived').length,
            spam: allMessages.filter(m => m.status === 'spam').length
        };

        // Messages ce mois
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);

        stats.this_month = allMessages.filter(m => new Date(m.created_at) >= thisMonth).length;

        // Messages cette semaine
        const thisWeek = new Date();
        thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
        thisWeek.setHours(0, 0, 0, 0);

        stats.this_week = allMessages.filter(m => new Date(m.created_at) >= thisWeek).length;

        return res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        logger.error('Erreur getContactStats:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des statistiques'
        });
    }
}

// ===================================
// EXPORTS
// ===================================

export const contactController = {
    // Public
    create: createContactMessage,

    // Admin
    getAll: getAllMessages,
    getById: getMessageById,
    updateStatus: updateMessageStatus,
    delete: deleteMessage,
    getStats: getContactStats
};

export default contactController;
