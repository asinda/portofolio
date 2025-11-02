import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../server.js';

describe('API Server Tests', () => {
    describe('GET /api/health', () => {
        test('devrait retourner le statut de santé du serveur', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('message', 'API Portfolio - Serveur en ligne');
            expect(response.body).toHaveProperty('version', '1.0.0');
            expect(response.body).toHaveProperty('timestamp');
        });

        test('devrait retourner un timestamp valide', async () => {
            const response = await request(app).get('/api/health');
            const timestamp = new Date(response.body.timestamp);

            expect(timestamp).toBeInstanceOf(Date);
            expect(timestamp.getTime()).not.toBeNaN();
        });
    });

    describe('Routes 404', () => {
        test('devrait retourner 404 pour une route inexistante', async () => {
            const response = await request(app)
                .get('/api/route-inexistante')
                .expect('Content-Type', /json/)
                .expect(404);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error', 'Route non trouvée');
        });

        test('devrait retourner 404 pour POST sur route inexistante', async () => {
            const response = await request(app)
                .post('/api/route-inexistante')
                .expect(404);

            expect(response.body.success).toBe(false);
        });
    });

    describe('Sécurité - Rate Limiting', () => {
        test('devrait accepter les requêtes normales', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    describe('Middlewares', () => {
        test('devrait parser le JSON correctement', async () => {
            const response = await request(app)
                .post('/api/portfolio/experiences')
                .send({ test: 'data' })
                .set('Content-Type', 'application/json');

            // Même si la route nécessite auth, le parsing JSON doit fonctionner
            expect(response.status).not.toBe(400); // Pas d'erreur de parsing
        });
    });
});
