import supabase, { TABLES, USE_LOCAL_DATA } from '../config/supabase.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les données locales si en mode dev
let localData = null;
if (USE_LOCAL_DATA) {
    const dataPath = join(__dirname, '../data.json');
    localData = JSON.parse(readFileSync(dataPath, 'utf-8'));
}

/**
 * Récupérer les informations du profil
 */
export const getProfile = async (req, res) => {
    try {
        // Mode développement : utiliser les données locales
        if (USE_LOCAL_DATA) {
            return res.json({
                success: true,
                data: localData.profile
            });
        }

        // Mode production : utiliser Supabase
        const { data, error } = await supabase
            .from(TABLES.PROFILE)
            .select('*')
            .single();

        if (error) throw error;

        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Erreur getProfile:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération du profil'
        });
    }
};

/**
 * Mettre à jour le profil
 */
export const updateProfile = async (req, res) => {
    try {
        // Mode développement : simulation de mise à jour
        if (USE_LOCAL_DATA) {
            return res.json({
                success: true,
                data: { ...localData.profile, ...req.body },
                message: 'Profil mis à jour avec succès (mode développement - non persisté)'
            });
        }

        // Mode production : utiliser Supabase
        const updates = req.body;

        const { data, error } = await supabase
            .from(TABLES.PROFILE)
            .update(updates)
            .eq('id', 1) // Assumant un seul profil avec id=1
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            data,
            message: 'Profil mis à jour avec succès'
        });
    } catch (error) {
        console.error('Erreur updateProfile:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la mise à jour du profil'
        });
    }
};
