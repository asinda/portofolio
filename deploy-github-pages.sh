#!/bin/bash

# ===================================
# Script de déploiement GitHub Pages
# ===================================

echo "🚀 Déploiement du portfolio sur GitHub Pages..."
echo ""

# Vérifier qu'on est à la racine du projet
if [ ! -d "frontend/public" ]; then
    echo "❌ Erreur : Ce script doit être exécuté depuis la racine du projet"
    exit 1
fi

# Créer un dossier temporaire
echo "📁 Création du dossier temporaire..."
rm -rf temp-gh-pages
mkdir -p temp-gh-pages
cd temp-gh-pages

# Initialiser un nouveau repo Git
echo "🔧 Initialisation de Git..."
git init
git checkout -b gh-pages

# Copier les fichiers du frontend
echo "📋 Copie des fichiers du frontend..."
cp -r ../frontend/public/* .

# Créer le fichier .nojekyll (important pour GitHub Pages)
echo "📝 Création du fichier .nojekyll..."
touch .nojekyll

# Créer un fichier README pour la branche gh-pages
cat > README.md << 'EOF'
# Portfolio - Branche de déploiement

Cette branche contient les fichiers statiques déployés sur GitHub Pages.

**Ne pas modifier directement cette branche !**

Pour mettre à jour le site, modifiez les fichiers dans `frontend/public/` sur la branche `dev` ou `main`, puis relancez le script de déploiement.

---

Déployé automatiquement via `deploy-github-pages.sh`
EOF

# Ajouter tous les fichiers
echo "➕ Ajout des fichiers au commit..."
git add .
git commit -m "Deploy to GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')"

# Pousser vers GitHub
echo "⬆️  Push vers GitHub..."
git remote add origin git@github.com:asinda/portofolio.git 2>/dev/null || git remote set-url origin git@github.com:asinda/portofolio.git
git push -f origin gh-pages

# Nettoyer
echo "🧹 Nettoyage..."
cd ..
rm -rf temp-gh-pages

echo ""
echo "✅ Déploiement terminé avec succès !"
echo ""
echo "📍 Votre site sera accessible dans 2-3 minutes sur :"
echo "   https://asinda.github.io/portofolio/"
echo ""
echo "🎛️  Panel admin :"
echo "   https://asinda.github.io/portofolio/admin"
echo ""
