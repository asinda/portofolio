import express from 'express';
import supabase from '../config/supabase.js';
import logger from '../config/logger.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Connexion utilisateur
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email et mot de passe requis'
            });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        res.json({
            success: true,
            data: {
                user: data.user,
                session: data.session
            },
            message: 'Connexion réussie'
        });
    } catch (error) {
        logger.error('Erreur login:', error);
        res.status(401).json({
            success: false,
            error: 'Email ou mot de passe incorrect'
        });
    }
});

/**
 * POST /api/auth/register
 * Inscription d'un nouvel utilisateur (admin seulement)
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, fullName } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email et mot de passe requis'
            });
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName || ''
                }
            }
        });

        if (error) throw error;

        res.status(201).json({
            success: true,
            data: {
                user: data.user
            },
            message: 'Utilisateur créé avec succès'
        });
    } catch (error) {
        logger.error('Erreur register:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la création du compte'
        });
    }
});

/**
 * POST /api/auth/logout
 * Déconnexion utilisateur
 */
router.post('/logout', async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        res.json({
            success: true,
            message: 'Déconnexion réussie'
        });
    } catch (error) {
        logger.error('Erreur logout:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la déconnexion'
        });
    }
});

/**
 * GET /api/auth/user
 * Récupérer l'utilisateur actuel
 */
router.get('/user', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Non authentifié'
            });
        }

        const token = authHeader.substring(7);
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                success: false,
                error: 'Token invalide'
            });
        }

        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        logger.error('Erreur get user:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération de l\'utilisateur'
        });
    }
});

export default router;
