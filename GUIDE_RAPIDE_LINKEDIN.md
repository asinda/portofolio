# Guide Rapide - Import LinkedIn

## 3 Méthodes pour Importer vos Données

### 🥇 Méthode 1 : Export GDPR (RECOMMANDÉE)

**Avantages** : ✅ Légal, ✅ Complet, ✅ Gratuit

**Étapes** :

1. **Demander l'export sur LinkedIn**
   - Allez sur LinkedIn → Paramètres → Confidentialité
   - Cliquez sur "Obtenir une copie de vos données"
   - Sélectionnez : Profil, Postes, Formation, Compétences, Certifications
   - Demandez l'archive (reçue sous 24h)

2. **Télécharger et décompresser**
   ```bash
   # Décompressez l'archive ZIP reçue par email
   unzip Basic_LinkedInDataExport_XX-XX-XXXX.zip
   ```

3. **Convertir en format Portfolio**
   ```bash
   cd backend/scripts
   pip install -r requirements.txt
   python linkedin_import.py /chemin/vers/Basic_LinkedInDataExport_XX-XX-XXXX
   ```

4. **Importer dans votre Portfolio**
   ```bash
   # Option A : Import dans Supabase
   node import_to_supabase.js portfolio_data.json

   # Option B : Remplacer data.json
   cp portfolio_data.json ../src/data.json
   ```

**Documentation complète** : [docs/LINKEDIN_DATA_EXPORT.md](docs/LINKEDIN_DATA_EXPORT.md)

---

### 🥈 Méthode 2 : Saisie Manuelle via Admin

**Avantages** : ✅ Simple, ✅ Contrôle total

**Étapes** :

1. **Lancer le backend et frontend**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend/public
   npx http-server -p 8000
   ```

2. **Accéder au panel admin**
   - Ouvrez http://localhost:8000/admin
   - Connectez-vous avec vos identifiants Supabase

3. **Remplir section par section**
   - Profil → Copiez/collez depuis LinkedIn
   - Expérience → Ajoutez chaque poste
   - Formation → Ajoutez vos diplômes
   - Compétences → Listez vos skills
   - Projets → Ajoutez vos réalisations

**Idéal pour** : Profils peu fournis, contrôle précis du contenu

---

### 🥉 Méthode 3 : Scraping Web (DÉCONSEILLÉ)

**⚠️ Avertissement** : Viole les CGU LinkedIn, souvent bloqué

**Si vous insistez** :
```bash
cd backend/scripts
pip install -r requirements.txt
python linkedin_scraper.py https://www.linkedin.com/in/votre-profil
```

**Pourquoi c'est déconseillé** :
- ❌ Illégal selon les CGU LinkedIn
- ❌ LinkedIn bloque les requêtes (code 999)
- ❌ Données incomplètes
- ❌ Risque de bannissement de compte

**Alternative** : Utilisez la Méthode 1 (Export GDPR)

---

## Comparaison des Méthodes

| Critère | Export GDPR | Saisie Manuelle | Scraping |
|---------|-------------|-----------------|----------|
| **Légalité** | ✅ 100% légal | ✅ Légal | ❌ Viole CGU |
| **Complétude** | ✅ Toutes données | ⚠️ Selon saisie | ❌ Partiel |
| **Rapidité** | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Facilité** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐ |
| **Fiabilité** | ✅ 100% | ✅ 100% | ❌ 20% |
| **Recommandé** | ✅ OUI | ✅ Pour petits profils | ❌ NON |

---

## Workflow Recommandé

```
┌─────────────────────┐
│  1. Export GDPR     │
│     (LinkedIn)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  2. Conversion      │
│  linkedin_import.py │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  3. Import Supabase │
│  ou data.json       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  4. Compléments     │
│  manuels (admin)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Portfolio à jour!  │
└─────────────────────┘
```

---

## Commandes Essentielles

### Installation des dépendances

```bash
# Python (pour conversion)
cd backend/scripts
pip install -r requirements.txt

# Node.js (pour API)
cd backend
npm install
```

### Conversion LinkedIn → Portfolio

```bash
cd backend/scripts
python linkedin_import.py /path/to/linkedin/export
```

### Import dans Supabase

```bash
cd backend/scripts
node import_to_supabase.js portfolio_data.json
```

### Lancer le Portfolio

```bash
# Terminal 1 - Backend API
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend/public
npx http-server -p 8000
```

---

## Compléments Manuels Recommandés

Après l'import automatique, ajoutez :

✅ **Photos**
- Photo de profil → `frontend/public/images/profile.jpg`
- Images de projets → `frontend/public/images/project-X.jpg`

✅ **Documents**
- CV PDF → `frontend/public/assets/cv.pdf`

✅ **Détails**
- Numéro de téléphone (via admin)
- Achievements détaillés (via admin)
- Technologies par projet (via admin)
- Soft skills (via admin)

---

## Fréquence de Mise à Jour

| Type | Fréquence | Méthode |
|------|-----------|---------|
| **Nouveau poste** | Immédiat | Panel admin |
| **Nouveau projet** | À chaque fois | Panel admin |
| **Nouvelles compétences** | Mensuel | Panel admin |
| **Mise à jour complète** | 3-6 mois | Export GDPR |

---

## Ressources

📖 **Documentation complète** :
- [Export GDPR LinkedIn](docs/LINKEDIN_DATA_EXPORT.md)
- [Configuration Supabase](docs/SUPABASE_SETUP.md)
- [Guide Admin](docs/ADMIN_GUIDE.md)
- [Scripts d'import](backend/scripts/README.md)

🔧 **Scripts disponibles** :
- `backend/scripts/linkedin_import.py` - Conversion CSV → JSON
- `backend/scripts/import_to_supabase.js` - Import dans Supabase
- `backend/scripts/linkedin_scraper.py` - Scraping (déconseillé)

🌐 **Liens utiles** :
- [LinkedIn Data Export](https://www.linkedin.com/help/linkedin/answer/50191)
- [Supabase Documentation](https://supabase.com/docs)
- [GDPR Data Portability](https://gdpr.eu/right-to-data-portability/)

---

## Support

❓ **Questions** : Consultez la documentation dans `docs/`
🐛 **Bugs** : Ouvrez une issue sur GitHub
💡 **Suggestions** : Pull requests bienvenues

---

**💡 Astuce** : Exportez vos données LinkedIn tous les 3-6 mois pour garder votre portfolio à jour automatiquement !
