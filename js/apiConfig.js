/**
 * Configuration de l'API pour le portfolio
 *
 * IMPORTANT : Après le déploiement du backend sur Render,
 * remplacez 'VOTRE_URL_RENDER' par l'URL réelle de votre backend.
 *
 * Exemple : https://portfolio-backend-xxxx.onrender.com/api
 */

const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://portfolio-backend-uj9f.onrender.com/api';

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_BASE_URL };
}
