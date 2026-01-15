# Configuration Base de Données Blog

Ce dossier contient les scripts SQL pour configurer le système de blog dans Supabase.

## 📋 Étape 1 : Créer les tables dans Supabase

1. Ouvrez votre projet Supabase : [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Allez dans **SQL Editor** (menu de gauche)
3. Cliquez sur **"New query"**
4. Copiez le contenu du fichier `blog-schema.sql`
5. Collez-le dans l'éditeur SQL
6. Cliquez sur **"Run"** ou appuyez sur `Ctrl+Enter`
7. Vous devriez voir : ✅ **"Success. No rows returned"**

## 📊 Tables créées

- **`blog_posts`** - Articles de blog/tutoriels
- **`blog_comments`** - Commentaires (avec système de modération)
- **`blog_tags`** - Tags des articles
- **`blog_stats`** - Vue pour les statistiques

## 🔐 Sécurité (RLS)

Les politiques Row Level Security sont automatiquement configurées :
- ✅ Lecture publique des articles publiés
- ✅ Auteur peut gérer tous ses articles (draft, published, archived)
- ✅ Commentaires nécessitent modération
- ✅ Auteur peut modérer les commentaires

## 🚀 Étape 2 : Importer les tutoriels

Une fois les tables créées, exécutez le script d'import :

```bash
cd backend
node scripts/import-tutorials.js
```

Ce script va :
1. Lire les 4 fichiers markdown des tutoriels
2. Extraire les métadonnées du fichier `tutorials.json`
3. Insérer les tutoriels dans la table `blog_posts`
4. Afficher un récapitulatif

## ✅ Vérification

Après l'import, testez l'API :

```bash
# Lister tous les articles
curl http://localhost:5000/api/blog/posts

# Récupérer un article par slug
curl http://localhost:5000/api/blog/posts/github-actions-pipeline-cicd

# Obtenir les catégories
curl http://localhost:5000/api/blog/categories

# Obtenir les tags
curl http://localhost:5000/api/blog/tags
```

## 📚 Routes API disponibles

### Public (sans authentification)
- `GET /api/blog/posts` - Lister les articles publiés
- `GET /api/blog/posts/:slug` - Récupérer un article
- `GET /api/blog/categories` - Lister les catégories
- `GET /api/blog/tags` - Lister les tags
- `GET /api/blog/posts/:postId/comments` - Commentaires approuvés
- `POST /api/blog/comments` - Créer un commentaire (modération requise)

### Authentifié (auteur uniquement)
- `POST /api/blog/posts` - Créer un article
- `PUT /api/blog/posts/:id` - Modifier un article
- `DELETE /api/blog/posts/:id` - Supprimer un article
- `GET /api/blog/comments/moderation` - Commentaires en attente
- `PUT /api/blog/comments/:id/moderate` - Modérer un commentaire
- `DELETE /api/blog/comments/:id` - Supprimer un commentaire

## 🔧 Paramètres de requête

### GET /api/blog/posts

```
?page=1              # Numéro de page (défaut: 1)
&limit=10            # Nombre par page (défaut: 10, max: 100)
&status=published    # Filtrer par statut (draft|published|archived)
&category=DevOps     # Filtrer par catégorie
&tag=docker          # Filtrer par tag
&search=kubernetes   # Recherche dans titre/contenu
&sort=published_at   # Trier par (created_at|updated_at|published_at|views|title)
&order=desc          # Ordre (asc|desc)
```

**Exemple** :
```bash
curl "http://localhost:5000/api/blog/posts?category=CI/CD&limit=5&sort=views&order=desc"
```

## 🛠️ Maintenance

### Réinitialiser les tutoriels

Si vous voulez réimporter les tutoriels :

```bash
node scripts/import-tutorials.js
```

Le script supprime automatiquement les tutoriels existants avant d'insérer les nouveaux.

### Vérifier les statistiques

```sql
-- Dans Supabase SQL Editor
SELECT * FROM blog_stats;
```

### Nettoyer les commentaires spam

```sql
-- Dans Supabase SQL Editor
DELETE FROM blog_comments WHERE status = 'spam';
```

## 📝 Notes

- Les tutoriels sont en format **Markdown**
- Le temps de lecture est calculé automatiquement (200 mots/minute)
- Les slugs sont générés automatiquement depuis les titres
- Les excerpts sont extraits des premiers paragraphes
- Les vues sont incrémentées automatiquement à chaque lecture
