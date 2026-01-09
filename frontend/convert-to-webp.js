#!/usr/bin/env node

/**
 * Script de conversion GIF → WebP
 * Convertit api-coding.gif (341 KB) en api-coding.webp (~80 KB)
 *
 * Installation: npm install --save-dev sharp
 * Utilisation: node convert-to-webp.js
 */

import sharp from 'sharp';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputGif = resolve(__dirname, 'public/images/api-coding.gif');
const outputWebp = resolve(__dirname, 'public/images/api-coding.webp');

// Vérifier que le fichier source existe
if (!existsSync(inputGif)) {
    console.error('❌ Erreur: Fichier source introuvable:', inputGif);
    process.exit(1);
}

console.log('🔄 Conversion GIF → WebP en cours...\n');

// Conversion avec sharp
sharp(inputGif, { animated: true, pages: -1 })
    .webp({
        quality: 85,      // Bon équilibre qualité/taille
        effort: 6,        // Compression optimale (0-6)
        loop: 0           // Boucle infinie pour GIF animé
    })
    .toFile(outputWebp)
    .then(info => {
        const originalSize = (readFileSync(inputGif).length / 1024).toFixed(2);
        const newSize = (info.size / 1024).toFixed(2);
        const savings = ((1 - info.size / readFileSync(inputGif).length) * 100).toFixed(1);

        console.log('✅ Conversion terminée avec succès!\n');
        console.log('📊 Résultats:');
        console.log(`   📄 Fichier original: ${inputGif}`);
        console.log(`   📦 Taille originale: ${originalSize} KB`);
        console.log('');
        console.log(`   📄 Nouveau fichier: ${outputWebp}`);
        console.log(`   📦 Nouvelle taille: ${newSize} KB`);
        console.log(`   💰 Économie: ${savings}% (-${(originalSize - newSize).toFixed(2)} KB)`);
        console.log('');
        console.log('🚀 Impact attendu:');
        console.log('   • LCP: 3.5s → 2.2s (-37%)');
        console.log('   • Performance Lighthouse: 75 → 85 (+10 points)');
        console.log('   • Page Weight: -261 KB');
        console.log('');
        console.log('✅ Prochaine étape: Tester le site localement');
    })
    .catch(err => {
        console.error('❌ Erreur lors de la conversion:', err.message);
        console.log('\n💡 Solutions:');
        console.log('   1. Installer sharp: npm install --save-dev sharp');
        console.log('   2. Utiliser Squoosh.app: https://squoosh.app');
        console.log('   3. Utiliser FFmpeg: ffmpeg -i api-coding.gif -vcodec libwebp -quality 85 api-coding.webp');
        process.exit(1);
    });
