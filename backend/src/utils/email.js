/**
 * EMAIL SERVICE - RESEND
 * Sprint 3 - Portfolio Alice Sindayigaya
 * Service d'envoi d'emails pour notifications contact
 */

import { Resend } from 'resend';
import logger from '../config/logger.js';

// Initialiser Resend avec clé API (lazy init)
let resend = null;

function getResendClient() {
    if (!resend && process.env.RESEND_API_KEY) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
}

// Configuration email
const FROM_EMAIL = process.env.EMAIL_FROM || 'Portfolio <noreply@yourdomain.com>';
const TO_EMAIL = process.env.EMAIL_TO || 'alice.sindayigaya@example.com';

// ===================================
// TEMPLATES EMAIL
// ===================================

/**
 * Template HTML pour notification de contact
 */
function getContactNotificationTemplate(data) {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #00a3ff 0%, #0066cc 100%);
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
        }
        .content {
            padding: 30px;
        }
        .field {
            margin-bottom: 20px;
        }
        .field-label {
            font-weight: 600;
            color: #00a3ff;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        .field-value {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 4px;
            border-left: 3px solid #00a3ff;
        }
        .message-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 4px;
            border-left: 3px solid #00a3ff;
            margin: 20px 0;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background: #00a3ff;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
            margin: 20px 0;
        }
        .metadata {
            font-size: 12px;
            color: #999;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📬 Nouveau Message de Contact</h1>
        </div>

        <div class="content">
            <p style="font-size: 16px; color: #666; margin-bottom: 25px;">
                Vous avez reçu un nouveau message via votre portfolio.
            </p>

            <div class="field">
                <div class="field-label">Nom</div>
                <div class="field-value">${data.name}</div>
            </div>

            <div class="field">
                <div class="field-label">Email</div>
                <div class="field-value">
                    <a href="mailto:${data.email}" style="color: #00a3ff; text-decoration: none;">
                        ${data.email}
                    </a>
                </div>
            </div>

            ${data.phone ? `
            <div class="field">
                <div class="field-label">Téléphone</div>
                <div class="field-value">${data.phone}</div>
            </div>
            ` : ''}

            ${data.company ? `
            <div class="field">
                <div class="field-label">Société</div>
                <div class="field-value">${data.company}</div>
            </div>
            ` : ''}

            <div class="field">
                <div class="field-label">Sujet</div>
                <div class="field-value"><strong>${data.subject}</strong></div>
            </div>

            <div class="field">
                <div class="field-label">Message</div>
                <div class="message-box">${data.message}</div>
            </div>

            <div style="text-align: center;">
                <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" class="button">
                    Répondre par Email
                </a>
            </div>

            <div class="metadata">
                <strong>ID Message:</strong> ${data.id}<br>
                <strong>Date:</strong> ${new Date(data.created_at).toLocaleString('fr-FR')}<br>
                <strong>User Agent:</strong> ${data.user_agent || 'N/A'}
            </div>
        </div>

        <div class="footer">
            <p>
                Cette notification a été générée automatiquement par votre portfolio.<br>
                Connectez-vous à votre <a href="${process.env.ADMIN_PANEL_URL || '#'}" style="color: #00a3ff;">panneau d'administration</a> pour gérer ce message.
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
}

/**
 * Template plain text (fallback)
 */
function getContactNotificationText(data) {
    return `
NOUVEAU MESSAGE DE CONTACT
===========================

Nom: ${data.name}
Email: ${data.email}
${data.phone ? `Téléphone: ${data.phone}\n` : ''}${data.company ? `Société: ${data.company}\n` : ''}
Sujet: ${data.subject}

MESSAGE:
${data.message}

---
ID: ${data.id}
Date: ${new Date(data.created_at).toLocaleString('fr-FR')}

Répondre: mailto:${data.email}
    `.trim();
}

// ===================================
// FONCTIONS D'ENVOI
// ===================================

/**
 * Envoyer notification de nouveau message de contact
 * @param {Object} data - Données du message de contact
 * @returns {Promise<Object>} - Résultat Resend
 */
export async function sendContactNotification(data) {
    try {
        // Vérifier que Resend est configuré
        if (!process.env.RESEND_API_KEY) {
            logger.warn('RESEND_API_KEY non configuré, email non envoyé');
            return { success: false, error: 'API key manquante' };
        }

        const resendClient = getResendClient();
        if (!resendClient) {
            logger.warn('Client Resend non disponible');
            return { success: false, error: 'Client email non disponible' };
        }

        // Envoyer l'email
        const result = await resendClient.emails.send({
            from: FROM_EMAIL,
            to: TO_EMAIL,
            subject: `📬 Nouveau contact: ${data.subject}`,
            html: getContactNotificationTemplate(data),
            text: getContactNotificationText(data),
            replyTo: data.email,
            tags: [
                { name: 'type', value: 'contact' },
                { name: 'source', value: 'portfolio' }
            ]
        });

        logger.info(`Email notification envoyé: ${result.id}`);

        return { success: true, ...result };

    } catch (error) {
        logger.error('Erreur sendContactNotification:', error);
        throw error;
    }
}

/**
 * Envoyer email de confirmation à l'expéditeur (optionnel)
 * @param {Object} data - Données du message
 * @returns {Promise<Object>} - Résultat Resend
 */
export async function sendContactConfirmation(data) {
    try {
        if (!process.env.RESEND_API_KEY) {
            return { success: false, error: 'API key manquante' };
        }

        const resendClient = getResendClient();
        if (!resendClient) {
            return { success: false, error: 'Client email non disponible' };
        }

        const confirmationHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 20px auto; padding: 30px; background: #ffffff; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #00a3ff; margin: 0; }
        .content { margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Message Bien Reçu</h1>
        </div>
        <div class="content">
            <p>Bonjour ${data.name},</p>
            <p>Merci de m'avoir contacté via mon portfolio. J'ai bien reçu votre message concernant :</p>
            <p style="background: #f8f9fa; padding: 15px; border-left: 3px solid #00a3ff;">
                <strong>${data.subject}</strong>
            </p>
            <p>Je vous répondrai dans les plus brefs délais, généralement sous 24-48 heures.</p>
            <p>Cordialement,<br><strong>Alice Sindayigaya</strong><br>Ingénieure DevOps & Cloud</p>
        </div>
        <div class="footer">
            <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
        </div>
    </div>
</body>
</html>
        `.trim();

        const result = await resendClient.emails.send({
            from: FROM_EMAIL,
            to: data.email,
            subject: '✅ Message bien reçu - Alice Sindayigaya',
            html: confirmationHTML,
            text: `Bonjour ${data.name},\n\nMerci de m'avoir contacté. J'ai bien reçu votre message et vous répondrai sous 24-48h.\n\nCordialement,\nAlice Sindayigaya`,
            tags: [
                { name: 'type', value: 'confirmation' },
                { name: 'source', value: 'portfolio' }
            ]
        });

        logger.info(`Email confirmation envoyé à: ${data.email}`);

        return { success: true, ...result };

    } catch (error) {
        logger.error('Erreur sendContactConfirmation:', error);
        throw error;
    }
}

// ===================================
// EXPORTS
// ===================================

export default {
    sendContactNotification,
    sendContactConfirmation
};
