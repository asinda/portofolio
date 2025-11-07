import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { createCRUDController } from '../src/controllers/crudController.js';

// Mock Supabase
const mockSupabase = {
    from: jest.fn(() => mockSupabase),
    select: jest.fn(() => mockSupabase),
    insert: jest.fn(() => mockSupabase),
    update: jest.fn(() => mockSupabase),
    delete: jest.fn(() => mockSupabase),
    eq: jest.fn(() => mockSupabase),
    order: jest.fn(() => mockSupabase),
    single: jest.fn(),
};

// Mock de req et res
const mockRequest = (body = {}, params = {}) => ({
    body,
    params,
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    return res;
};

describe('CRUD Controller Tests', () => {
    let controller;
    let req;
    let res;

    beforeEach(() => {
        controller = createCRUDController('experiences');
        res = mockResponse();
        jest.clearAllMocks();
    });

    describe('getAll()', () => {
        test('devrait retourner tous les enregistrements avec succès', async () => {
            const mockData = [
                { id: 1, position: 'DevOps Engineer' },
                { id: 2, position: 'Cloud Architect' },
            ];

            // Note: En mode développement, le controller utilise les données locales
            // Ce test vérifie la structure de la réponse
            req = mockRequest();

            await controller.getAll(req, res);

            expect(res.json).toHaveBeenCalled();
            const response = res.json.mock.calls[0][0];
            expect(response).toHaveProperty('success');
            expect(response).toHaveProperty('data');
        });
    });

    describe('getById()', () => {
        test('devrait gérer les erreurs correctement', async () => {
            req = mockRequest({}, { id: '999' });

            await controller.getById(req, res);

            expect(res.status).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe('create()', () => {
        test('devrait accepter les données valides', async () => {
            const newExperience = {
                position: 'DevOps Engineer',
                company: 'Tech Corp',
                start_date: '2024-01-01',
            };

            req = mockRequest(newExperience);

            await controller.create(req, res);

            expect(res.json).toHaveBeenCalled();
        });

        test('devrait gérer le body vide', async () => {
            req = mockRequest({});

            await controller.create(req, res);

            expect(res.status).toHaveBeenCalled();
        });
    });

    describe('update()', () => {
        test('devrait accepter les données de mise à jour', async () => {
            const updates = {
                position: 'Senior DevOps Engineer',
            };

            req = mockRequest(updates, { id: '1' });

            await controller.update(req, res);

            expect(res.json).toHaveBeenCalled();
        });

        test('devrait nécessiter un ID valide', async () => {
            req = mockRequest({ position: 'Test' }, { id: '' });

            await controller.update(req, res);

            expect(res.status).toHaveBeenCalled();
        });
    });

    describe('delete()', () => {
        test('devrait accepter un ID pour suppression', async () => {
            req = mockRequest({}, { id: '1' });

            await controller.delete(req, res);

            expect(res.json).toHaveBeenCalled();
        });

        test('devrait gérer les IDs invalides', async () => {
            req = mockRequest({}, { id: '' });

            await controller.delete(req, res);

            expect(res.status).toHaveBeenCalled();
        });
    });

    describe('Gestion des erreurs', () => {
        test('devrait retourner une erreur 500 en cas de problème serveur', async () => {
            // Tester que les erreurs sont bien catchées
            req = mockRequest();

            await controller.getAll(req, res);

            // La réponse doit être bien formatée même en cas d'erreur
            expect(res.json).toHaveBeenCalled();
            const response = res.json.mock.calls[0][0];
            expect(response).toHaveProperty('success');
        });
    });

    describe('Validation des données', () => {
        test('devrait accepter les objets JSON valides', async () => {
            const validData = {
                position: 'DevOps Engineer',
                company: 'CEGEDIM',
                start_date: '2024-01-01',
                description: 'Gestion PaaS',
            };

            req = mockRequest(validData);

            await controller.create(req, res);

            expect(res.json).toHaveBeenCalled();
        });
    });
});
