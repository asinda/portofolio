# 🌍 Ajouter le Support Multi-Langue au Blog

Ce guide explique comment activer le support multi-langue (Français/Anglais) pour les articles du blog.

## 📋 Étape 1 : Exécuter la Migration SQL

La migration ajoute les colonnes nécessaires pour stocker les traductions anglaises.

### Sur Supabase Dashboard

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Menu de gauche → **SQL Editor**
4. Cliquez sur **New query**
5. Copiez-collez le contenu du fichier `add-i18n-blog.sql`
6. Cliquez sur **Run** (ou appuyez sur `Ctrl + Enter`)

### Via Supabase CLI (alternative)

```bash
cd backend/database
supabase db push add-i18n-blog.sql
```

## ✅ Vérification

Après avoir exécuté la migration, vérifiez que les colonnes ont été ajoutées :

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'blog_posts'
AND column_name LIKE '%_en';
```

Vous devriez voir :
- `title_en` (text)
- `content_en` (text)
- `excerpt_en` (text)
- `seo_title_en` (text)
- `seo_description_en` (text)
- `default_locale` (text)

## 📝 Étape 2 : Ajouter les Traductions

Les traductions ne sont PAS automatiques. Vous devez les ajouter manuellement pour chaque article.

### Méthode 1 : Via SQL Editor

```sql
UPDATE blog_posts
SET
    title_en = 'English Title Here',
    content_en = '# English Content Here\n\nFull article content in English (Markdown format)...',
    excerpt_en = 'Short English summary...'
WHERE slug = 'mon-article-slug';
```

### Méthode 2 : Via l'API (authentifié)

```bash
curl -X PUT https://portfolio-backend-uj9f.onrender.com/api/blog/posts/{id} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title_en": "English Title",
    "content_en": "# English Content\n\nFull article...",
    "excerpt_en": "Short English summary"
  }'
```

### Méthode 3 : Via Supabase Table Editor

1. Dashboard Supabase → **Table Editor**
2. Sélectionnez la table `blog_posts`
3. Double-cliquez sur la cellule `title_en` de l'article à traduire
4. Entrez la traduction
5. Répétez pour `content_en` et `excerpt_en`

## 🚀 Étape 3 : Tester

Une fois les traductions ajoutées, testez :

### 1. Test API Backend

```bash
# Articles en français (par défaut)
curl "https://portfolio-backend-uj9f.onrender.com/api/blog/posts?limit=5"

# Articles en anglais
curl "https://portfolio-backend-uj9f.onrender.com/api/blog/posts?limit=5&locale=en"
```

### 2. Test Frontend

1. Ouvrez https://asinda.github.io/portofolio/#blog
2. Changez la langue avec le sélecteur de langue (FR/EN)
3. Les articles devraient se recharger automatiquement dans la langue choisie

## 🔧 Comment ça Marche

### Backend

L'API supporte maintenant le paramètre `?locale=en` ou `?locale=fr` :

```
GET /api/blog/posts?locale=en
GET /api/blog/posts/:slug?locale=en
```

**Logique** :
- Si `locale=en` ET que `title_en` existe → retourne la version anglaise
- Sinon → retourne la version française (fallback)

### Frontend

Le frontend :
1. Détecte la langue courante via `localStorage.getItem('portfolio_language')`
2. Ajoute automatiquement `&locale=XX` à toutes les requêtes API
3. Écoute les changements de langue et recharge les articles automatiquement

## 📊 Structure des Données

### Avant Migration

```json
{
  "title": "Mon article",
  "content": "Contenu en français...",
  "excerpt": "Résumé français"
}
```

### Après Migration (avec traduction)

```json
{
  "title": "Mon article",
  "title_en": "My Article",
  "content": "Contenu en français...",
  "content_en": "English content...",
  "excerpt": "Résumé français",
  "excerpt_en": "English summary",
  "is_translated": true,
  "current_locale": "en",
  "available_locales": ["fr", "en"]
}
```

## ⚠️ Important

1. **Les traductions ne sont pas automatiques** - Vous devez traduire chaque article manuellement
2. **Fallback automatique** - Si une traduction n'existe pas, la version française s'affiche
3. **Compatible avec l'existant** - Tous les articles actuels continuent de fonctionner sans modification

## 🎯 Prochaines Étapes

Pour traduire efficacement les 28 articles :

1. **Option manuelle** : Traduire article par article via Supabase Table Editor
2. **Option semi-automatique** : Utiliser un outil de traduction (DeepL API, GPT) + script
3. **Option IA** : Créer un script qui utilise GPT-4 pour traduire automatiquement

## 💡 Conseils

- Commencez par traduire les articles les plus populaires
- Gardez le même ton et style dans les traductions
- Les codes et commandes techniques n'ont pas besoin de traduction
- Adaptez les exemples si nécessaire (ex: "Bonjour" → "Hello")

---

**Support** : Si vous avez des questions, consultez le code dans :
- Backend : `backend/src/controllers/blogController.js`
- Frontend : `frontend/public/js/blog.js`
