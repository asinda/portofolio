/**
 * Script pour générer automatiquement les icônes PWA
 * Sprint 4 - Portfolio Alice Sindayigaya
 * Génère 8 tailles d'icônes à partir d'une image source
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PUBLIC_DIR = path.join(__dirname, 'public');
const ICONS_DIR = path.join(PUBLIC_DIR, 'icons');
const SOURCE_IMAGE = path.join(PUBLIC_DIR, 'images', 'profile.jpg'); // Image source haute résolution

// Tailles d'icônes PWA requises
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Couleur de fond et padding pour icônes maskables
const BACKGROUND_COLOR = { r: 26, g: 35, b: 50, alpha: 1 }; // #1a2332
const PADDING_PERCENT = 10; // 10% de padding pour maskable icons

/**
 * Créer une icône avec fond coloré et padding (maskable)
 */
async function createMaskableIcon(inputPath, outputPath, size) {
    try {
        // Calculer la taille de l'image avec padding
        const padding = Math.round(size * (PADDING_PERCENT / 100));
        const contentSize = size - (padding * 2);

        // Créer fond coloré
        const background = await sharp({
            create: {
                width: size,
                height: size,
                channels: 4,
                background: BACKGROUND_COLOR
            }
        }).png().toBuffer();

        // Redimensionner l'image source et composer sur le fond
        await sharp(inputPath)
            .resize(contentSize, contentSize, {
                fit: 'cover',
                position: 'center'
            })
            .toBuffer()
            .then(resizedBuffer => {
                return sharp(background)
                    .composite([{
                        input: resizedBuffer,
                        top: padding,
                        left: padding
                    }])
                    .png()
                    .toFile(outputPath);
            });

        console.log(`✅ Icône ${size}x${size} créée: ${path.basename(outputPath)}`);
    } catch (error) {
        console.error(`❌ Erreur pour icône ${size}x${size}:`, error.message);
        throw error;
    }
}

/**
 * Générer toutes les icônes PWA
 */
async function generatePWAIcons() {
    console.log('🎨 ================================');
    console.log('📱 Génération des icônes PWA...');
    console.log('🎨 ================================\n');

    // Vérifier que l'image source existe
    try {
        await fs.access(SOURCE_IMAGE);
        console.log(`📸 Image source: ${path.basename(SOURCE_IMAGE)}\n`);
    } catch (error) {
        console.error(`❌ Image source introuvable: ${SOURCE_IMAGE}`);
        console.log('\n💡 Conseil: Placez une image haute résolution (512x512+) dans:');
        console.log(`   ${SOURCE_IMAGE}`);
        process.exit(1);
    }

    // Créer le dossier icons s'il n'existe pas
    try {
        await fs.mkdir(ICONS_DIR, { recursive: true });
        console.log(`📁 Dossier créé: ${path.relative(PUBLIC_DIR, ICONS_DIR)}\n`);
    } catch (error) {
        // Le dossier existe déjà
    }

    // Générer chaque taille
    let successCount = 0;
    for (const size of ICON_SIZES) {
        const outputPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);

        try {
            await createMaskableIcon(SOURCE_IMAGE, outputPath, size);
            successCount++;
        } catch (error) {
            console.error(`❌ Échec pour ${size}x${size}`);
        }
    }

    // Récapitulatif
    console.log('\n🎨 ================================');
    console.log(`✅ ${successCount}/${ICON_SIZES.length} icônes générées avec succès!`);
    console.log('🎨 ================================\n');

    // Vérifier les fichiers créés
    console.log('📦 Fichiers créés:');
    for (const size of ICON_SIZES) {
        const filename = `icon-${size}x${size}.png`;
        const filepath = path.join(ICONS_DIR, filename);
        try {
            const stats = await fs.stat(filepath);
            const sizeKB = (stats.size / 1024).toFixed(2);
            console.log(`   ✓ ${filename} (${sizeKB} KB)`);
        } catch (error) {
            console.log(`   ✗ ${filename} (manquant)`);
        }
    }

    console.log('\n✅ Icônes PWA prêtes!');
    console.log('💡 Prochaine étape: Créer le Service Worker\n');
}

// Exécution
generatePWAIcons().catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
});
