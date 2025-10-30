# Scripts d'Import LinkedIn

Ce dossier contient des scripts pour importer vos données LinkedIn dans votre portfolio.

## Vue d'ensemble

| Script | Description | Recommandé |
|--------|-------------|------------|
| `linkedin_import.py` | Convertit l'export GDPR LinkedIn | ✅ OUI |
| `import_to_supabase.js` | Importe dans Supabase | ✅ OUI |
| `linkedin_scraper.py` | Scraping web (déconseillé) | ❌ Non |

## Méthode Recommandée : Export GDPR

### Étape 1 : Obtenir vos données LinkedIn

Suivez le guide complet : [`docs/LINKEDIN_DATA_EXPORT.md`](../../docs/LINKEDIN_DATA_EXPORT.md)

Résumé rapide :
1. LinkedIn > Paramètres > Confidentialité > Obtenir une copie de vos données
2. Sélectionnez : Profil, Postes, Formation, Compétences, Certifications
3. Attendez l'email (jusqu'à 24h)
4. Téléchargez et décompressez l'archive

### Étape 2 : Installer les dépendances

**Python** (pour la conversion) :
```bash
pip install -r requirements.txt
```

**Node.js** (pour l'import dans Supabase) :
```bash
# Dépendances déjà dans backend/package.json
cd ..
npm install
```

### Étape 3 : Convertir les données

```bash
python linkedin_import.py /chemin/vers/Basic_LinkedInDataExport_XX-XX-XXXX
```

Cela crée un fichier `portfolio_data.json` avec vos données au bon format.

### Étape 4 : Importer dans Supabase

```bash
node import_to_supabase.js portfolio_data.json
```

Ou directement remplacer data.json :
```bash
cp portfolio_data.json ../src/data.json
cp portfolio_data.json ../../frontend/public/data.json
```

## Fichiers de sortie

### portfolio_data.json

Format du fichier généré :

```json
{
  "profile": {
    "name": "Alice Sindayigaya",
    "title": "Développeuse Full Stack",
    "location": "Paris, France",
    "email": "alice@example.com",
    "linkedin": "https://linkedin.com/in/alicesindayigaya",
    "about": "Passionnée par..."
  },
  "experience": [
    {
      "position": "Développeuse",
      "company": "Entreprise",
      "startDate": "Janvier 2023",
      "endDate": "Présent",
      "current": true,
      "description": "...",
      "achievements": []
    }
  ],
  "education": [...],
  "skills": {
    "technical": [...],
    "languages": [...],
    "soft": [...]
  },
  "projects": [...],
  "certifications": [...]
}
```

## Scripts détaillés

### linkedin_import.py

Convertit les CSV LinkedIn en JSON portfolio.

**Usage** :
```bash
python linkedin_import.py <dossier-export>
```

**Fichiers lus** :
- ✅ Profile.csv (requis)
- ✅ Positions.csv (requis)
- ⚪ Education.csv (optionnel)
- ⚪ Skills.csv (optionnel)
- ⚪ Certifications.csv (optionnel)
- ⚪ Languages.csv (optionnel)
- ⚪ Projects.csv (optionnel)

**Sortie** : `portfolio_data.json`

**Limitations** :
- Téléphone : à ajouter manuellement
- Images : à télécharger séparément
- Achievements : à compléter manuellement
- Niveau des compétences : LinkedIn ne le fournit pas

### import_to_supabase.js

Importe le JSON dans votre base Supabase.

**Prérequis** :
- Fichier `.env` configuré dans `backend/`
- Tables Supabase créées (voir `docs/SUPABASE_SETUP.md`)

**Usage** :
```bash
node import_to_supabase.js portfolio_data.json
```

**Ce qu'il fait** :
1. Lit le fichier JSON
2. Se connecte à Supabase
3. Insère les données dans les tables
4. Affiche les statistiques

**En cas d'erreur** :
- Vérifiez votre `.env`
- Vérifiez que les tables existent
- Vérifiez la structure du JSON

### linkedin_scraper.py (Non recommandé)

⚠️ **DÉCONSEILLÉ** : Scraping web de LinkedIn

**Pourquoi ne pas l'utiliser** :
- ❌ Viole les CGU de LinkedIn
- ❌ LinkedIn bloque les requêtes (code 999)
- ❌ Données incomplètes
- ❌ Risque de bannissement

**Alternative recommandée** :
→ Utilisez `linkedin_import.py` avec l'export GDPR

**Si vous insistez** :
```bash
python linkedin_scraper.py https://www.linkedin.com/in/votre-profil
```

## Workflow complet

```bash
# 1. Demander l'export LinkedIn (interface web)

# 2. Une fois reçu, décompresser l'archive
unzip Basic_LinkedInDataExport_XX-XX-XXXX.zip

# 3. Convertir les données
python linkedin_import.py Basic_LinkedInDataExport_XX-XX-XXXX/

# 4. Vérifier le résultat
cat portfolio_data.json

# 5. (Optionnel) Compléter manuellement
# Éditez portfolio_data.json pour ajouter :
# - Téléphone
# - Achievements
# - Images
# - Détails supplémentaires

# 6. Importer dans Supabase
node import_to_supabase.js portfolio_data.json

# 7. Vérifier dans l'admin
# Ouvrez http://localhost:8000/admin
```

## Compléments manuels recommandés

Après l'import automatique, complétez :

### Dans le panel admin

1. **Photos** :
   - Photo de profil
   - Images de projets

2. **Achievements** :
   - Pour chaque expérience
   - Résultats quantifiables

3. **Technologies** :
   - Pour chaque projet
   - Stack technique utilisée

4. **Soft Skills** :
   - Compétences interpersonnelles
   - Leadership, communication, etc.

### Fichiers à télécharger séparément

- **CV (PDF)** → `frontend/public/assets/cv.pdf`
- **Photo de profil** → `frontend/public/images/profile.jpg`
- **Images projets** → `frontend/public/images/project-X.jpg`

## Automatisation

Pour automatiser l'import régulier :

```bash
#!/bin/bash
# linkedin_to_portfolio.sh

EXPORT_DIR=$1

if [ -z "$EXPORT_DIR" ]; then
    echo "Usage: ./linkedin_to_portfolio.sh /chemin/vers/export"
    exit 1
fi

echo "🔄 Conversion..."
python linkedin_import.py "$EXPORT_DIR"

echo "📤 Import dans Supabase..."
node import_to_supabase.js portfolio_data.json

echo "✅ Terminé !"
```

Usage :
```bash
chmod +x linkedin_to_portfolio.sh
./linkedin_to_portfolio.sh /chemin/vers/Basic_LinkedInDataExport_XX-XX-XXXX
```

## Fréquence recommandée

- **Mise à jour complète** : Tous les 3-6 mois
- **Nouveaux postes/projets** : Via le panel admin
- **Petites modifications** : Via le panel admin

## Dépannage

### "Module pandas not found"
```bash
pip install pandas
```

### "SUPABASE_URL is not defined"
```bash
# Créer le fichier .env dans backend/
cd ..
cp .env.example .env
# Éditer .env avec vos vraies valeurs
```

### "Permission denied" sur les scripts
```bash
chmod +x *.py *.js
```

### Données manquantes après import
→ Vérifiez que vous avez sélectionné toutes les catégories lors de l'export LinkedIn

### Erreurs d'encodage CSV
→ Le script essaie UTF-8 puis Latin-1. Si ça échoue, ouvrez le CSV et resauvegardez en UTF-8.

## Support

- Guide complet : [`docs/LINKEDIN_DATA_EXPORT.md`](../../docs/LINKEDIN_DATA_EXPORT.md)
- Configuration Supabase : [`docs/SUPABASE_SETUP.md`](../../docs/SUPABASE_SETUP.md)
- GitHub Issues : [Signaler un problème](https://github.com/asinda/portofolio/issues)

## Licence

MIT - Libre d'utilisation pour votre portfolio personnel.
