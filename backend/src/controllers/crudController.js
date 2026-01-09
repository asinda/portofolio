import supabase, { USE_LOCAL_DATA } from '../config/supabase.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import logger from '../config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les données locales si en mode dev
let localData = null;
if (USE_LOCAL_DATA) {
    const dataPath = join(__dirname, '../data.json');
    localData = JSON.parse(readFileSync(dataPath, 'utf-8'));
}

// Mapping des noms de tables vers les clés du data.json
const TABLE_TO_KEY_MAP = {
    'experiences': 'experience',
    'education': 'education',
    'projects': 'projects',
    'skills_technical': 'skills.technical',
    'skills_languages': 'skills.languages',
    'skills_soft': 'skills.soft',
    'certifications': 'certifications'
};

/**
 * Factory pour créer des contrôleurs CRUD génériques
 * @param {string} tableName - Nom de la table Supabase
 */
export const createCRUDController = (tableName) => {
    return {
        /**
         * GET - Récupérer tous les enregistrements
         */
        getAll: async (req, res) => {
            try {
                // Mode développement : utiliser les données locales
                if (USE_LOCAL_DATA && localData) {
                    const dataKey = TABLE_TO_KEY_MAP[tableName] || tableName;

                    // Gérer les clés imbriquées comme "skills.technical"
                    let data = localData;
                    const keys = dataKey.split('.');
                    for (const key of keys) {
                        data = data[key];
                    }

                    return res.json({
                        success: true,
                        data: data || []
                    });
                }

                // Mode production : utiliser Supabase
                const { data, error } = await supabase
                    .from(tableName)
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                res.json({
                    success: true,
                    data: data || []
                });
            } catch (error) {
                logger.error(`Erreur getAll ${tableName}:`, error);
                res.status(500).json({
                    success: false,
                    error: `Erreur lors de la récupération des ${tableName}`
                });
            }
        },

        /**
         * GET - Récupérer un enregistrement par ID
         */
        getById: async (req, res) => {
            try {
                const { id } = req.params;

                const { data, error } = await supabase
                    .from(tableName)
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (!data) {
                    return res.status(404).json({
                        success: false,
                        error: 'Enregistrement non trouvé'
                    });
                }

                res.json({
                    success: true,
                    data
                });
            } catch (error) {
                logger.error(`Erreur getById ${tableName}:`, error);
                res.status(500).json({
                    success: false,
                    error: 'Erreur lors de la récupération'
                });
            }
        },

        /**
         * POST - Créer un nouvel enregistrement
         */
        create: async (req, res) => {
            try {
                const newData = req.body;

                const { data, error } = await supabase
                    .from(tableName)
                    .insert([newData])
                    .select()
                    .single();

                if (error) throw error;

                res.status(201).json({
                    success: true,
                    data,
                    message: 'Créé avec succès'
                });
            } catch (error) {
                logger.error(`Erreur create ${tableName}:`, error);
                res.status(500).json({
                    success: false,
                    error: 'Erreur lors de la création'
                });
            }
        },

        /**
         * PUT - Mettre à jour un enregistrement
         */
        update: async (req, res) => {
            try {
                const { id } = req.params;
                const updates = req.body;

                const { data, error } = await supabase
                    .from(tableName)
                    .update(updates)
                    .eq('id', id)
                    .select()
                    .single();

                if (error) throw error;

                res.json({
                    success: true,
                    data,
                    message: 'Mis à jour avec succès'
                });
            } catch (error) {
                logger.error(`Erreur update ${tableName}:`, error);
                res.status(500).json({
                    success: false,
                    error: 'Erreur lors de la mise à jour'
                });
            }
        },

        /**
         * DELETE - Supprimer un enregistrement
         */
        delete: async (req, res) => {
            try {
                const { id } = req.params;

                const { error } = await supabase
                    .from(tableName)
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                res.json({
                    success: true,
                    message: 'Supprimé avec succès'
                });
            } catch (error) {
                logger.error(`Erreur delete ${tableName}:`, error);
                res.status(500).json({
                    success: false,
                    error: 'Erreur lors de la suppression'
                });
            }
        }
    };
};
