# Import des Données LinkedIn - Méthode Officielle

## Méthode Recommandée : LinkedIn Data Export (GDPR)

Cette méthode est **100% légale** et vous donne accès à **TOUTES** vos données LinkedIn de manière structurée.

## Avantages

✅ **Légal** : Utilise l'API officielle de LinkedIn
✅ **Complet** : Toutes vos données (expérience, formation, compétences, etc.)
✅ **Structuré** : Format JSON/CSV facile à traiter
✅ **Gratuit** : Service offert par LinkedIn (droit GDPR)
✅ **Fiable** : Pas de risque de blocage

## Étapes pour Exporter vos Données

### 1. Demander l'export de vos données

1. Connectez-vous à [LinkedIn](https://www.linkedin.com)
2. Cliquez sur votre photo de profil (en haut à droite)
3. Sélectionnez **Paramètres et confidentialité**
4. Allez dans l'onglet **Confidentialité des données**
5. Cliquez sur **Obtenir une copie de vos données**

### 2. Sélectionner les données à exporter

Cochez les catégories suivantes pour votre portfolio :

- ✅ **Profil** - Informations de base
- ✅ **Postes** - Expérience professionnelle
- ✅ **Formation** - Parcours académique
- ✅ **Compétences** - Liste des compétences
- ✅ **Certifications** - Certificats et licences
- ✅ **Recommandations** - Recommandations reçues (optionnel)
- ✅ **Projets** - Projets réalisés (optionnel)

### 3. Recevoir l'archive

1. Cliquez sur **Demander l'archive**
2. LinkedIn prépare vos données (peut prendre jusqu'à 24h)
3. Vous recevrez un email avec un lien de téléchargement
4. Téléchargez l'archive ZIP

### 4. Extraire les données

Décompressez l'archive. Vous obtiendrez :

```
Basic_LinkedInDataExport_XX-XX-XXXX/
├── Profile.csv
├── Positions.csv
├── Education.csv
├── Skills.csv
├── Certifications.csv
└── ...
```

## Convertir les Données pour votre Portfolio

Utilisez notre script de conversion :

```bash
cd backend/scripts

# Installer les dépendances si nécessaire
pip install pandas

# Convertir les données
python linkedin_import.py /chemin/vers/Basic_LinkedInDataExport_XX-XX-XXXX
```

Le script va :
1. Lire tous les fichiers CSV
2. Les convertir au format JSON de votre portfolio
3. Créer un fichier `portfolio_data.json`

## Importer dans votre Portfolio

### Option 1 : Import via l'API (Recommandé)

```bash
# Depuis le dossier backend/scripts
node import_to_supabase.js portfolio_data.json
```

### Option 2 : Import manuel via l'Admin

1. Ouvrez `http://localhost:8000/admin`
2. Connectez-vous
3. Dans chaque section, utilisez "Import JSON"
4. Collez les données correspondantes

### Option 3 : Remplacer data.json

```bash
cp portfolio_data.json backend/src/data.json
cp portfolio_data.json frontend/public/data.json
```

## Automatisation (Optionnel)

Pour automatiser le processus complet :

```bash
# Script tout-en-un
cd backend/scripts
./linkedin_to_portfolio.sh /chemin/vers/export
```

Ce script :
1. Convertit les données LinkedIn
2. Les importe dans Supabase
3. Met à jour le frontend

## Fréquence de Mise à Jour

LinkedIn permet de demander un export :
- **1 fois par jour maximum**
- Conservez vos archives pour référence

## Alternative : Extension de Navigateur

Si vous préférez une solution plus visuelle :

1. **LinkedIn Profile Scraper** (Chrome Extension)
   - ⚠️ Vérifiez qu'elle respecte les CGU
   - Utilisez uniquement sur votre propre profil

2. **Manual Copy/Paste**
   - Copiez section par section depuis votre profil
   - Collez dans le panel admin

## Données non Disponibles dans l'Export

Certaines données nécessitent une saisie manuelle :
- Photos de profil (télécharger séparément)
- Images de projets
- Logos d'entreprises
- Fichiers joints (CV, certificats)

## Conformité et Confidentialité

✅ **GDPR Compliant** : Votre droit d'accès à vos données
✅ **Sécurisé** : Données chiffrées dans l'archive
✅ **Privé** : Aucune donnée partagée avec des tiers
✅ **Contrôlé** : Vous décidez ce qui est publié

## Comparaison des Méthodes

| Méthode | Légal | Complet | Facilité | Recommandé |
|---------|-------|---------|----------|------------|
| **Data Export (GDPR)** | ✅ | ✅ | ⭐⭐⭐⭐ | ✅ OUI |
| API Officielle | ✅ | ✅ | ⭐⭐ | ✅ Pour devs |
| Web Scraping | ❌ | ❌ | ⭐ | ❌ Non |
| Saisie Manuelle | ✅ | ✅ | ⭐ | ✅ Petits profils |

## Dépannage

### L'export prend plus de 24h
→ Normal pour les profils volumineux, patience

### Fichiers CSV vides
→ Vérifiez que vous avez bien coché les catégories lors de la demande

### Erreur lors de la conversion
→ Vérifiez que pandas est installé : `pip install pandas`

### Données incomplètes
→ Complétez manuellement via le panel admin

## Support

Pour toute question sur l'export LinkedIn :
- [Centre d'aide LinkedIn](https://www.linkedin.com/help/linkedin/answer/50191)
- [GDPR Data Portability](https://gdpr.eu/right-to-data-portability/)

## Prochaines Étapes

1. ✅ Demandez votre export LinkedIn
2. ⏳ Attendez l'email (jusqu'à 24h)
3. ✅ Téléchargez et décompressez
4. ✅ Utilisez `linkedin_import.py`
5. ✅ Importez dans votre portfolio

---

**💡 Astuce** : Faites un export tous les 3-6 mois pour garder votre portfolio à jour !
