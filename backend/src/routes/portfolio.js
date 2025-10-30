import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { createCRUDController } from '../controllers/crudController.js';
import { TABLES } from '../config/supabase.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Créer les contrôleurs CRUD pour chaque section
const experienceController = createCRUDController(TABLES.EXPERIENCE);
const educationController = createCRUDController(TABLES.EDUCATION);
const projectsController = createCRUDController(TABLES.PROJECTS);
const skillsTechnicalController = createCRUDController(TABLES.SKILLS_TECHNICAL);
const skillsLanguagesController = createCRUDController(TABLES.SKILLS_LANGUAGES);
const skillsSoftController = createCRUDController(TABLES.SKILLS_SOFT);
const certificationsController = createCRUDController(TABLES.CERTIFICATIONS);

// =====================
// ROUTES PUBLIQUES (GET)
// =====================

// Profil
router.get('/profile', getProfile);

// Expérience
router.get('/experience', experienceController.getAll);
router.get('/experience/:id', experienceController.getById);

// Formation
router.get('/education', educationController.getAll);
router.get('/education/:id', educationController.getById);

// Projets
router.get('/projects', projectsController.getAll);
router.get('/projects/:id', projectsController.getById);

// Compétences techniques
router.get('/skills/technical', skillsTechnicalController.getAll);

// Langues
router.get('/skills/languages', skillsLanguagesController.getAll);

// Soft skills
router.get('/skills/soft', skillsSoftController.getAll);

// Certifications
router.get('/certifications', certificationsController.getAll);
router.get('/certifications/:id', certificationsController.getById);

// =====================
// ROUTES PROTÉGÉES (CREATE, UPDATE, DELETE)
// =====================

// Profil
router.put('/profile', authenticate, updateProfile);

// Expérience
router.post('/experience', authenticate, experienceController.create);
router.put('/experience/:id', authenticate, experienceController.update);
router.delete('/experience/:id', authenticate, experienceController.delete);

// Formation
router.post('/education', authenticate, educationController.create);
router.put('/education/:id', authenticate, educationController.update);
router.delete('/education/:id', authenticate, educationController.delete);

// Projets
router.post('/projects', authenticate, projectsController.create);
router.put('/projects/:id', authenticate, projectsController.update);
router.delete('/projects/:id', authenticate, projectsController.delete);

// Compétences techniques
router.post('/skills/technical', authenticate, skillsTechnicalController.create);
router.put('/skills/technical/:id', authenticate, skillsTechnicalController.update);
router.delete('/skills/technical/:id', authenticate, skillsTechnicalController.delete);

// Langues
router.post('/skills/languages', authenticate, skillsLanguagesController.create);
router.put('/skills/languages/:id', authenticate, skillsLanguagesController.update);
router.delete('/skills/languages/:id', authenticate, skillsLanguagesController.delete);

// Soft skills
router.post('/skills/soft', authenticate, skillsSoftController.create);
router.put('/skills/soft/:id', authenticate, skillsSoftController.update);
router.delete('/skills/soft/:id', authenticate, skillsSoftController.delete);

// Certifications
router.post('/certifications', authenticate, certificationsController.create);
router.put('/certifications/:id', authenticate, certificationsController.update);
router.delete('/certifications/:id', authenticate, certificationsController.delete);

export default router;
