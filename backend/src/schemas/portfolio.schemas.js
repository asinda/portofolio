import { z } from 'zod';

// ============================================
// SCHÉMAS PORTFOLIO
// ============================================

/**
 * Schéma pour les expériences professionnelles
 */
export const experienceSchema = z.object({
    position: z.string()
        .min(1, 'Position requise')
        .max(200, 'Position trop longue'),
    company: z.string()
        .min(1, 'Entreprise requise')
        .max(200, 'Nom d\'entreprise trop long'),
    location: z.string()
        .max(200, 'Localisation trop longue')
        .optional(),
    start_date: z.string()
        .regex(/^\d{4}-\d{2}$/, 'Format de date invalide (YYYY-MM requis)'),
    end_date: z.string()
        .regex(/^\d{4}-\d{2}$/, 'Format de date invalide (YYYY-MM requis)')
        .optional(),
    current: z.boolean()
        .optional()
        .default(false),
    description: z.string()
        .max(5000, 'Description trop longue')
        .optional(),
    achievements: z.array(
        z.string().max(500, 'Achievement trop long')
    ).max(20, 'Trop d\'achievements')
        .optional()
});

/**
 * Schéma pour les projets
 */
export const projectSchema = z.object({
    title: z.string()
        .min(1, 'Titre requis')
        .max(200, 'Titre trop long'),
    description: z.string()
        .min(10, 'Description trop courte (minimum 10 caractères)')
        .max(2000, 'Description trop longue'),
    image: z.string()
        .url('URL d\'image invalide')
        .optional(),
    technologies: z.array(
        z.string().max(50, 'Nom de technologie trop long')
    ).max(30, 'Trop de technologies')
        .optional(),
    link: z.string()
        .url('URL du projet invalide')
        .optional(),
    github: z.string()
        .url('URL GitHub invalide')
        .optional(),
    category: z.enum([
        'web', 'mobile', 'desktop', 'cloud', 'devops',
        'data', 'automation', 'monitoring', 'other'
    ]).default('web')
});

/**
 * Schéma pour l'éducation
 */
export const educationSchema = z.object({
    degree: z.string()
        .min(1, 'Diplôme requis')
        .max(200, 'Nom de diplôme trop long'),
    institution: z.string()
        .min(1, 'Institution requise')
        .max(200, 'Nom d\'institution trop long'),
    location: z.string()
        .max(200, 'Localisation trop longue')
        .optional(),
    start_date: z.string()
        .regex(/^\d{4}$/, 'Format d\'année invalide (YYYY requis)'),
    end_date: z.string()
        .regex(/^\d{4}$/, 'Format d\'année invalide (YYYY requis)'),
    description: z.string()
        .max(2000, 'Description trop longue')
        .optional()
});

/**
 * Schéma pour les compétences techniques
 */
export const skillTechnicalSchema = z.object({
    name: z.string()
        .min(1, 'Nom de compétence requis')
        .max(100, 'Nom de compétence trop long'),
    category: z.string()
        .max(50, 'Catégorie trop longue')
        .optional(),
    level: z.enum(['débutant', 'intermédiaire', 'avancé', 'expert'])
        .optional()
});

/**
 * Schéma pour les langues
 */
export const skillLanguageSchema = z.object({
    name: z.string()
        .min(1, 'Nom de langue requis')
        .max(100, 'Nom de langue trop long'),
    level: z.enum(['débutant', 'intermédiaire', 'avancé', 'natif', 'bilingue'])
});

/**
 * Schéma pour les soft skills
 */
export const skillSoftSchema = z.object({
    name: z.string()
        .min(1, 'Nom de compétence requis')
        .max(100, 'Nom de compétence trop long')
});

/**
 * Schéma pour les certifications
 */
export const certificationSchema = z.object({
    name: z.string()
        .min(1, 'Nom de certification requis')
        .max(200, 'Nom de certification trop long'),
    issuer: z.string()
        .min(1, 'Émetteur requis')
        .max(200, 'Nom d\'émetteur trop long'),
    date: z.string()
        .regex(/^\d{4}-\d{2}$/, 'Format de date invalide (YYYY-MM requis)'),
    expiry_date: z.string()
        .regex(/^\d{4}-\d{2}$/, 'Format de date invalide (YYYY-MM requis)')
        .optional(),
    link: z.string()
        .url('URL de certification invalide')
        .optional(),
    credential_id: z.string()
        .max(200, 'ID de credential trop long')
        .optional()
});

/**
 * Schéma pour le profil utilisateur
 */
export const profileSchema = z.object({
    name: z.string()
        .min(1, 'Nom requis')
        .max(200, 'Nom trop long'),
    title: z.string()
        .min(1, 'Titre professionnel requis')
        .max(200, 'Titre trop long'),
    email: z.string()
        .email('Email invalide'),
    phone: z.string()
        .regex(/^[\d\s+()-]+$/, 'Numéro de téléphone invalide')
        .optional(),
    location: z.string()
        .max(200, 'Localisation trop longue')
        .optional(),
    photo: z.string()
        .url('URL de photo invalide')
        .optional(),
    about: z.string()
        .max(5000, 'Texte "À propos" trop long')
        .optional(),
    linkedin: z.string()
        .url('URL LinkedIn invalide')
        .optional(),
    github: z.string()
        .url('URL GitHub invalide')
        .optional(),
    website: z.string()
        .url('URL de site web invalide')
        .optional(),
    twitter: z.string()
        .url('URL Twitter invalide')
        .optional()
});

// ============================================
// EXPORTS GROUPÉS
// ============================================

export const portfolioSchemas = {
    experience: experienceSchema,
    project: projectSchema,
    education: educationSchema,
    skillTechnical: skillTechnicalSchema,
    skillLanguage: skillLanguageSchema,
    skillSoft: skillSoftSchema,
    certification: certificationSchema,
    profile: profileSchema
};
