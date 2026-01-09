import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { createCRUDController } from '../controllers/crudController.js';
import { TABLES } from '../config/supabase.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validate, idParamSchema } from '../middleware/validation.js';
import {
    experienceSchema,
    educationSchema,
    projectSchema,
    skillTechnicalSchema,
    skillLanguageSchema,
    skillSoftSchema,
    certificationSchema,
    profileSchema
} from '../schemas/portfolio.schemas.js';

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
router.put('/profile', authenticate, validate(profileSchema), updateProfile);

// Expérience
router.post('/experience', authenticate, validate(experienceSchema), experienceController.create);
router.put('/experience/:id', authenticate, validate(idParamSchema, 'params'), validate(experienceSchema), experienceController.update);
router.delete('/experience/:id', authenticate, validate(idParamSchema, 'params'), experienceController.delete);

// Formation
router.post('/education', authenticate, validate(educationSchema), educationController.create);
router.put('/education/:id', authenticate, validate(idParamSchema, 'params'), validate(educationSchema), educationController.update);
router.delete('/education/:id', authenticate, validate(idParamSchema, 'params'), educationController.delete);

// Projets
router.post('/projects', authenticate, validate(projectSchema), projectsController.create);
router.put('/projects/:id', authenticate, validate(idParamSchema, 'params'), validate(projectSchema), projectsController.update);
router.delete('/projects/:id', authenticate, validate(idParamSchema, 'params'), projectsController.delete);

// Compétences techniques
router.post('/skills/technical', authenticate, validate(skillTechnicalSchema), skillsTechnicalController.create);
router.put('/skills/technical/:id', authenticate, validate(idParamSchema, 'params'), validate(skillTechnicalSchema), skillsTechnicalController.update);
router.delete('/skills/technical/:id', authenticate, validate(idParamSchema, 'params'), skillsTechnicalController.delete);

// Langues
router.post('/skills/languages', authenticate, validate(skillLanguageSchema), skillsLanguagesController.create);
router.put('/skills/languages/:id', authenticate, validate(idParamSchema, 'params'), validate(skillLanguageSchema), skillsLanguagesController.update);
router.delete('/skills/languages/:id', authenticate, validate(idParamSchema, 'params'), skillsLanguagesController.delete);

// Soft skills
router.post('/skills/soft', authenticate, validate(skillSoftSchema), skillsSoftController.create);
router.put('/skills/soft/:id', authenticate, validate(idParamSchema, 'params'), validate(skillSoftSchema), skillsSoftController.update);
router.delete('/skills/soft/:id', authenticate, validate(idParamSchema, 'params'), skillsSoftController.delete);

// Certifications
router.post('/certifications', authenticate, validate(certificationSchema), certificationsController.create);
router.put('/certifications/:id', authenticate, validate(idParamSchema, 'params'), validate(certificationSchema), certificationsController.update);
router.delete('/certifications/:id', authenticate, validate(idParamSchema, 'params'), certificationsController.delete);

export default router;
