/**
 * Script pour corriger les IDs dupliqués dans les fichiers SVG
 * Remplace id="grad" par des IDs uniques basés sur le nom du fichier
 */

const fs = require('fs');
const path = require('path');

const tutorialsDir = __dirname;

// Lire tous les fichiers SVG
const svgFiles = fs.readdirSync(tutorialsDir).filter(file => file.endsWith('.svg'));

console.log(`🔍 ${svgFiles.length} fichiers SVG trouvés\n`);

let fixedCount = 0;
let errorCount = 0;

svgFiles.forEach(filename => {
    const filePath = path.join(tutorialsDir, filename);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Vérifier si le fichier contient id="grad"
    if (!content.includes('id="grad"')) {
        return; // Pas besoin de corriger ce fichier
    }

    // Créer un ID unique basé sur le nom du fichier
    // Exemple: docker-security.svg → docker-security-grad
    const baseName = path.basename(filename, '.svg');
    const uniqueId = `${baseName}-grad`;

    // Remplacer id="grad" et url(#grad)
    let newContent = content
        .replace(/id="grad"/g, `id="${uniqueId}"`)
        .replace(/url\(#grad\)/g, `url(#${uniqueId})`);

    // Vérifier si des changements ont été faits
    if (newContent !== content) {
        try {
            fs.writeFileSync(filePath, newContent, 'utf-8');
            console.log(`✅ ${filename} → id="${uniqueId}"`);
            fixedCount++;
        } catch (error) {
            console.error(`❌ Erreur avec ${filename}:`, error.message);
            errorCount++;
        }
    }
});

console.log(`\n📊 Résumé :`);
console.log(`   ✅ Fichiers corrigés : ${fixedCount}`);
console.log(`   ❌ Erreurs : ${errorCount}`);
console.log(`   ⏭️  Fichiers ignorés : ${svgFiles.length - fixedCount - errorCount}`);
console.log(`\n🎉 Terminé !`);
