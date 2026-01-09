#!/bin/bash
# Script de build pour optimisations Sprint 1
# Portfolio Alice Sindayigaya

echo "🚀 Build Portfolio - Sprint 1 Optimisations"
echo ""

# Vérifier si les outils sont installés
command -v cleancss >/dev/null 2>&1 || { echo "⚠️  clean-css-cli n'est pas installé. Installez avec: npm install -g clean-css-cli"; exit 1; }
command -v terser >/dev/null 2>&1 || { echo "⚠️  terser n'est pas installé. Installez avec: npm install -g terser"; exit 1; }

# 1. Minification CSS
echo "📦 Minification CSS..."
cleancss -o public/css/style-cityscape.min.css public/css/style-cityscape.css
if [ $? -eq 0 ]; then
    echo "✅ CSS minifié: $(du -h public/css/style-cityscape.min.css 2>/dev/null | cut -f1 || echo 'N/A')"
else
    echo "❌ Erreur lors de la minification CSS"
    exit 1
fi

# 2. Minification JS
echo "📦 Minification JS..."
terser public/js/main.js -o public/js/main.min.js -c -m
if [ $? -eq 0 ]; then
    echo "✅ main.js minifié: $(du -h public/js/main.min.js 2>/dev/null | cut -f1 || echo 'N/A')"
else
    echo "❌ Erreur lors de la minification de main.js"
    exit 1
fi

terser public/js/data.js -o public/js/data.min.js -c -m
if [ $? -eq 0 ]; then
    echo "✅ data.js minifié: $(du -h public/js/data.min.js 2>/dev/null | cut -f1 || echo 'N/A')"
else
    echo "❌ Erreur lors de la minification de data.js"
    exit 1
fi

# 3. Afficher résumé
echo ""
echo "📊 Résumé des tailles:"
echo "CSS:"
ls -lh public/css/style-cityscape*.css 2>/dev/null || echo "Fichiers CSS non trouvés"
echo ""
echo "JS:"
ls -lh public/js/*.js 2>/dev/null | grep -E '(main|data)' || echo "Fichiers JS non trouvés"

echo ""
echo "✅ Build terminé avec succès!"
echo ""
echo "ℹ️  N'oubliez pas de:"
echo "  1. Convertir api-coding.gif → WebP avec https://squoosh.app"
echo "  2. Mettre à jour index.html pour utiliser les fichiers minifiés"
