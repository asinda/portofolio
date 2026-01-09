import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import corsMiddleware from './src/middleware/cors.js';
import portfolioRoutes from './src/routes/portfolio.js';
import authRoutes from './src/routes/auth.js';
import blogRoutes from './src/routes/blog.js';
import contactRoutes from './src/routes/contact.js';
import analyticsRoutes from './src/routes/analytics.js';
import logger from './src/config/logger.js';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// =====================
// MIDDLEWARES DE SÉCURITÉ
// =====================

// Helmet pour sécuriser les headers HTTP
app.use(helmet());

// CORS
app.use(corsMiddleware);

// Rate limiting pour éviter les abus
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite à 100 requêtes par fenêtre
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});

app.use('/api/', limiter);

// =====================
// MIDDLEWARES GÉNÉRAUX
// =====================

// Parser JSON
app.use(express.json());

// Parser URL-encoded
app.use(express.urlencoded({ extended: true }));

// =====================
// ROUTES
// =====================

// Route de santé (health check)
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'API Portfolio - Serveur en ligne',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Routes du portfolio
app.use('/api/portfolio', portfolioRoutes);

// Routes du blog (Sprint 3)
app.use('/api/blog', blogRoutes);

// Routes de contact (Sprint 3)
app.use('/api/contact', contactRoutes);

// Routes analytics (Sprint 3)
app.use('/api/analytics', analyticsRoutes);

// =====================
// GESTION DES ERREURS
// =====================

// Route 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route non trouvée'
    });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
    logger.error('Erreur serveur:', err);

    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Erreur interne du serveur'
    });
});

// =====================
// DÉMARRAGE DU SERVEUR
// =====================

// Démarrer le serveur seulement si ce fichier est exécuté directement
// Permet d'exporter l'app pour les tests
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        logger.info('🚀 ================================');
        logger.info(`✅ Serveur démarré sur le port ${PORT}`);
        logger.info(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
        logger.info(`📡 API disponible sur: http://localhost:${PORT}/api`);
        logger.info(`💚 Health check: http://localhost:${PORT}/api/health`);
        logger.info('🚀 ================================');
    });

    // Gestion des erreurs non gérées
    process.on('unhandledRejection', (err) => {
        logger.error('❌ Erreur non gérée:', err);
        process.exit(1);
    });
}

// Exporter l'app pour les tests
export default app;
