import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Répertoire des logs
const logDir = path.join(__dirname, '../../logs');

// Format personnalisé pour les logs
const customFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${stack || message}`;
    })
);

// Configuration des transports
const transports = [
    // Console en développement uniquement
    ...(process.env.NODE_ENV !== 'production' ? [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                customFormat
            )
        })
    ] : []),

    // Fichier rotatif pour les erreurs
    new DailyRotateFile({
        filename: path.join(logDir, 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxFiles: '30d', // Garder 30 jours d'historique
        format: customFormat
    }),

    // Fichier rotatif pour tous les logs
    new DailyRotateFile({
        filename: path.join(logDir, 'combined-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxFiles: '14d', // Garder 14 jours d'historique
        format: customFormat
    })
];

// Création du logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info', // Niveau par défaut: info
    transports
});

// Logger de démarrage
if (process.env.NODE_ENV !== 'test') {
    logger.info('Logger Winston initialisé');
    logger.info(`Niveau de log: ${logger.level}`);
    logger.info(`Environnement: ${process.env.NODE_ENV || 'development'}`);
}

export default logger;
