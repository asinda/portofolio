# Guide d'utilisation de l'Administration

Bienvenue dans le panneau d'administration de votre portfolio ! Ce guide vous explique comment utiliser toutes les fonctionnalités.

## 🚀 Accès à l'administration

1. Lancez votre serveur local :
   ```bash
   npx http-server -p 8000
   ```

2. Accédez à : **http://localhost:8000/admin/**

3. Connectez-vous avec vos identifiants Supabase

## 📊 Tableau de bord

Le tableau de bord vous donne un aperçu rapide de votre portfolio :
- Nombre d'expériences
- Nombre de projets
- Nombre de compétences
- Nombre de certifications

## 🔧 Sections disponibles

### 1. Mon Profil

Gérez vos informations personnelles :

- **Informations de base** :
  - Nom complet
  - Titre professionnel
  - Email et téléphone
  - Localisation

- **À propos** :
  - Rédigez une présentation de vous-même (2-3 paragraphes)

- **Liens sociaux** :
  - LinkedIn
  - GitHub
  - Site web personnel

- **Photo de profil** :
  - URL de votre photo (uploadez d'abord dans "Médias")

**Comment faire** :
1. Cliquez sur "Profil" dans le menu
2. Remplissez le formulaire
3. Cliquez sur "Enregistrer"

---

### 2. Expériences Professionnelles

Gérez votre historique professionnel.

**Ajouter une expérience** :
1. Cliquez sur "Expériences" dans le menu
2. Cliquez sur "+ Nouvelle expérience"
3. Remplissez :
   - Poste
   - Entreprise
   - Localisation
   - Dates (début et fin)
   - Cochez "Poste actuel" si c'est votre emploi actuel
   - Description de vos missions
4. Cliquez sur "Enregistrer"

**Modifier une expérience** :
- Cliquez sur le bouton "Modifier" (icône crayon) sur l'expérience

**Supprimer une expérience** :
- Cliquez sur le bouton "Supprimer" (icône poubelle)

---

### 3. Formation

Gérez votre parcours académique.

**Ajouter une formation** :
1. Cliquez sur "Formation" dans le menu
2. Cliquez sur "+ Nouvelle formation"
3. Remplissez :
   - Diplôme obtenu
   - Nom de l'institution
   - Localisation
   - Années (début et fin)
   - Description (mention, spécialisation, etc.)
4. Cliquez sur "Enregistrer"

---

### 4. Projets

Présentez vos réalisations.

**Ajouter un projet** :
1. Cliquez sur "Projets" dans le menu
2. Cliquez sur "+ Nouveau projet"
3. Remplissez :
   - **Titre** : Nom du projet
   - **Description** : Expliquez le projet (2-3 phrases)
   - **Image** : URL de l'image (uploadez d'abord dans "Médias")
   - **Technologies** : Séparez par des virgules (ex: "React, Node.js, MongoDB")
   - **Lien du projet** : URL du site déployé
   - **Lien GitHub** : URL du repository
4. Cliquez sur "Enregistrer"

**Conseils** :
- Utilisez des captures d'écran de qualité pour vos projets
- Décrivez l'objectif et votre contribution
- Mettez en avant les technologies utilisées

---

### 5. Compétences

Gérez vos compétences techniques et interpersonnelles.

#### Compétences Techniques
1. Cliquez sur "Compétences" > Onglet "Techniques"
2. Cliquez sur "+ Ajouter"
3. Entrez le nom de la compétence (ex: "JavaScript", "Python", "Docker")
4. Cliquez sur "Ajouter"

**Supprimer** : Cliquez sur la croix (×) sur la compétence

#### Langues
1. Onglet "Langues"
2. Cliquez sur "+ Ajouter"
3. Entrez :
   - Nom de la langue
   - Niveau (Débutant, Intermédiaire, Avancé, Courant, Natif)
4. Cliquez sur "Ajouter"

#### Compétences Interpersonnelles (Soft Skills)
1. Onglet "Interpersonnelles"
2. Cliquez sur "+ Ajouter"
3. Entrez la compétence (ex: "Communication", "Leadership", "Travail d'équipe")
4. Cliquez sur "Ajouter"

---

### 6. Certifications

Ajoutez vos certifications et réalisations.

**Ajouter une certification** :
1. Cliquez sur "Certifications"
2. Cliquez sur "+ Nouvelle certification"
3. Remplissez :
   - Nom de la certification
   - Organisme émetteur
   - Date d'obtention
   - Lien vers la certification (optionnel)
4. Cliquez sur "Enregistrer"

---

### 7. Gestion des Médias

Uploadez et gérez vos images et fichiers.

**Uploader des fichiers** :
1. Cliquez sur "Médias"
2. Glissez-déposez vos fichiers dans la zone d'upload
   - OU cliquez pour parcourir vos fichiers
3. Les fichiers sont automatiquement uploadés

**Utiliser une image** :
1. Une fois uploadée, cliquez sur le bouton "Copier" (icône)
2. L'URL est copiée dans votre presse-papiers
3. Collez cette URL dans les champs "Image" de vos projets ou profil

**Supprimer un fichier** :
- Cliquez sur le bouton "Supprimer" (icône poubelle)

**Types de fichiers supportés** :
- Images : JPG, PNG, GIF, WebP
- Documents : PDF (pour CV, etc.)

---

## 💡 Conseils et bonnes pratiques

### Images
- **Taille recommandée** :
  - Photo de profil : 500x500px (format carré)
  - Images de projets : 800x600px (ratio 4:3)
- **Format** : JPG ou PNG
- **Poids** : < 500 KB par image (utilisez [TinyPNG](https://tinypng.com) pour compresser)

### Rédaction
- **À propos** : 2-3 paragraphes, soyez authentique et professionnel
- **Descriptions d'expériences** : Utilisez des verbes d'action (Développé, Conçu, Optimisé, etc.)
- **Projets** : Expliquez le problème résolu et votre rôle

### Organisation
- **Ordre chronologique** : Les expériences et formations apparaissent du plus récent au plus ancien
- **Mise à jour régulière** : Gardez votre portfolio à jour avec vos dernières réalisations

---

## 🔄 Synchronisation

Le bouton **"Synchroniser"** en haut à droite :
- Recharge toutes les données depuis Supabase
- Utile si vous avez modifié des données directement dans Supabase
- Rafraîchit les statistiques du tableau de bord

---

## 👁️ Prévisualiser vos changements

1. Cliquez sur **"Voir le site"** en haut à droite
2. Votre portfolio s'ouvre dans un nouvel onglet
3. Les modifications sont visibles immédiatement

---

## 🚪 Déconnexion

1. Cliquez sur **"Déconnexion"** en bas du menu latéral
2. Vous serez redirigé vers la page de connexion

---

## 🆘 Résolution de problèmes

### "Configuration Supabase manquante"
**Solution** :
- Vérifiez que vous avez modifié `admin/js/config.js`
- Assurez-vous que l'URL et la clé sont correctes
- Consultez [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

### "Permission denied" ou "Erreur lors de l'enregistrement"
**Solution** :
- Vérifiez que vous êtes connecté
- Vérifiez que les politiques RLS sont créées dans Supabase
- Consultez la console du navigateur (F12) pour plus d'erreurs

### Les images ne s'affichent pas
**Solution** :
- Vérifiez que le bucket Supabase est public
- Vérifiez que l'URL de l'image est correcte
- Consultez [SUPABASE_SETUP.md](SUPABASE_SETUP.md) section Storage

### Impossible de se connecter
**Solution** :
- Vérifiez vos identifiants
- Vérifiez que l'authentification Email est activée dans Supabase
- Créez un utilisateur via Supabase Dashboard > Authentication > Users

---

## 📱 Utilisation sur mobile/tablette

L'administration est responsive et fonctionne sur tous les appareils :
- **Mobile** : Menu hamburger pour accéder aux sections
- **Tablette** : Interface adaptée à l'écran
- **Desktop** : Interface complète avec sidebar

---

## 🔐 Sécurité

- ✅ Seul vous pouvez modifier vos données (authentification requise)
- ✅ Les données sont protégées par les politiques RLS de Supabase
- ✅ Le public peut uniquement voir votre portfolio (lecture seule)
- ✅ Vos identifiants de connexion sont chiffrés

**Bonnes pratiques** :
- Utilisez un mot de passe fort
- Ne partagez jamais vos identifiants Supabase
- Déconnectez-vous si vous utilisez un ordinateur public

---

## 📚 Ressources

- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Configuration détaillée de Supabase
- [README.md](README.md) - Documentation générale du projet
- [CLAUDE.md](CLAUDE.md) - Architecture technique du projet
- [Documentation Supabase](https://supabase.com/docs) - Documentation officielle

---

Besoin d'aide ? Consultez les ressources ci-dessus ou vérifiez la console du navigateur (F12) pour les messages d'erreur détaillés.

**Bon travail avec votre portfolio ! 🎉**
