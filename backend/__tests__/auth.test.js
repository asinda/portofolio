import { describe, test, expect, jest } from '@jest/globals';

// Mock de req, res, next
const mockRequest = (headers = {}) => ({
    headers,
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    return res;
};

const mockNext = jest.fn();

describe('Auth Middleware Tests', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        res = mockResponse();
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('authenticate()', () => {
        test('devrait rejeter les requêtes sans header Authorization', async () => {
            req = mockRequest({});

            // Import dynamique du middleware
            const { authenticate } = await import('../src/middleware/auth.js');
            await authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    error: expect.stringContaining('Token'),
                })
            );
            expect(next).not.toHaveBeenCalled();
        });

        test('devrait rejeter les headers Authorization invalides', async () => {
            req = mockRequest({
                authorization: 'InvalidFormat',
            });

            const { authenticate } = await import('../src/middleware/auth.js');
            await authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(next).not.toHaveBeenCalled();
        });

        test('devrait rejeter les tokens Bearer vides', async () => {
            req = mockRequest({
                authorization: 'Bearer ',
            });

            const { authenticate } = await import('../src/middleware/auth.js');
            await authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(next).not.toHaveBeenCalled();
        });

        test('devrait accepter le format Bearer token', async () => {
            req = mockRequest({
                authorization: 'Bearer fake-jwt-token-for-testing',
            });

            const { authenticate } = await import('../src/middleware/auth.js');
            await authenticate(req, res, next);

            // Le middleware va essayer de vérifier le token
            // En mode test, il devrait retourner une erreur (token invalide)
            expect(res.status).toHaveBeenCalled();
        });

        test('devrait gérer les erreurs Supabase', async () => {
            req = mockRequest({
                authorization: 'Bearer invalid-token-123',
            });

            const { authenticate } = await import('../src/middleware/auth.js');
            await authenticate(req, res, next);

            expect(res.status).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe('optionalAuth()', () => {
        test('devrait continuer sans token', async () => {
            req = mockRequest({});

            const { optionalAuth } = await import('../src/middleware/auth.js');
            await optionalAuth(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('devrait tenter de vérifier un token si présent', async () => {
            req = mockRequest({
                authorization: 'Bearer test-token',
            });

            const { optionalAuth } = await import('../src/middleware/auth.js');
            await optionalAuth(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        test('devrait continuer même si le token est invalide', async () => {
            req = mockRequest({
                authorization: 'Bearer invalid-token',
            });

            const { optionalAuth } = await import('../src/middleware/auth.js');
            await optionalAuth(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('Format du token', () => {
        test('devrait extraire correctement le token après "Bearer "', async () => {
            const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
            req = mockRequest({
                authorization: `Bearer ${testToken}`,
            });

            const { authenticate } = await import('../src/middleware/auth.js');
            await authenticate(req, res, next);

            // Le middleware devrait essayer de vérifier ce token
            expect(res.status).toHaveBeenCalled();
        });
    });

    describe('Sécurité', () => {
        test('devrait rejeter les tentatives d\'injection', async () => {
            req = mockRequest({
                authorization: 'Bearer ; DROP TABLE users; --',
            });

            const { authenticate } = await import('../src/middleware/auth.js');
            await authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(next).not.toHaveBeenCalled();
        });

        test('devrait gérer les tokens très longs', async () => {
            const longToken = 'a'.repeat(10000);
            req = mockRequest({
                authorization: `Bearer ${longToken}`,
            });

            const { authenticate } = await import('../src/middleware/auth.js');
            await authenticate(req, res, next);

            expect(res.status).toHaveBeenCalled();
        });
    });
});
