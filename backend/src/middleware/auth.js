import supabase from '../config/supabase.js';
import logger from '../config/logger.js';

/**
 * Middleware pour vérifier l'authentification via Supabase
 */
export const authenticate = async (req, res, next) => {
    try {
        // Récupérer le token depuis l'en-tête Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Token d\'authentification manquant'
            });
        }

        const token = authHeader.substring(7); // Retirer "Bearer "

        // Vérifier le token avec Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                success: false,
                error: 'Token invalide ou expiré'
            });
        }

        // Ajouter l'utilisateur à la requête
        req.user = user;
        next();
    } catch (error) {
        logger.error('Erreur d\'authentification:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la vérification de l\'authentification'
        });
    }
};

/**
 * Middleware optionnel pour les routes qui peuvent être publiques ou privées
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const { data: { user } } = await supabase.auth.getUser(token);
            req.user = user || null;
        }

        next();
    } catch (error) {
        logger.error('Erreur d\'authentification optionnelle:', error);
        next();
    }
};
