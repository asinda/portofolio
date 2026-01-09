# Guide de Tests - Sprint 3 Backend

**Date**: 9 janvier 2025
**Durée estimée**: 30 minutes
**Prérequis**: Backend en cours d'exécution

---

## 📋 Checklist Préparation

### Étape 1: Configuration Supabase (10 min)

**A. Exécuter Scripts SQL**:

1. Ouvrir Supabase Dashboard: https://supabase.com/dashboard
2. Sélectionner votre projet
3. Aller dans **SQL Editor** (menu gauche)

4. **Copier-coller et exécuter** `docs/SUPABASE_BLOG_SETUP.sql`:
   - Créera: blog_posts, blog_comments, blog_tags
   - Indexes + RLS policies + Fonctions
   - Devrait afficher: "Success. No rows returned"

5. **Copier-coller et exécuter** `docs/SUPABASE_CONTACT_ANALYTICS_SETUP.sql`:
   - Créera: contact_messages, analytics_events, analytics_summary
   - Indexes + RLS policies + Fonctions
   - Devrait afficher: "Success. No rows returned"

6. **Vérifier tables créées**:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
    'blog_posts',
    'blog_comments',
    'blog_tags',
    'contact_messages',
    'analytics_events',
    'analytics_summary'
);
```
**Attendu**: 6 lignes retournées ✅

---

### Étape 2: Configuration Resend (5 min)

**A. Créer compte Resend**:
1. Aller sur: https://resend.com/signup
2. S'inscrire avec email
3. Confirmer email

**B. Obtenir clé API**:
1. Dashboard → **API Keys**
2. Cliquer **Create API Key**
3. Nom: "Portfolio Backend"
4. Copier la clé: `re_xxxxxxxxxxxxx`

**C. Configurer domaine expéditeur** (optionnel, sinon utiliser domaine sandbox):
- Si vous avez un domaine: Dashboard → **Domains** → Add Domain
- Sinon: Utiliser le domaine sandbox fourni par défaut

**D. Mettre à jour `.env`**:
```env
# Ajouter dans backend/.env
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=Portfolio <onboarding@resend.dev>
EMAIL_TO=votre.email@example.com
```

**Note**: En mode sandbox, vous ne pouvez envoyer qu'à votre email vérifié.

---

### Étape 3: Démarrer Backend (2 min)

```bash
cd backend

# Vérifier .env contient RESEND_API_KEY
cat .env | grep RESEND

# Démarrer backend
npm run dev
```

**Attendu**:
```
[info] Backend démarré sur port 5000
```

**Vérifier santé**:
```bash
curl http://localhost:5000/api/health
```

**Attendu**:
```json
{
  "success": true,
  "message": "API Portfolio - Serveur en ligne",
  "version": "1.0.0"
}
```

---

## 🧪 Tests Fonctionnels

### Test 1: Blog - Créer un Post (Auth Requise)

**A. Login (obtenir JWT)**:
```bash
# Remplacer par vos credentials Supabase
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "votre.email@example.com",
    "password": "votrepassword"
  }'
```

**Attendu**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

**⚠️ Important**: Copier le token JWT pour les tests suivants.

---

**B. Créer un post de blog**:

**Définir token** (remplacer par votre token):
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Créer le post**:
```bash
curl -X POST http://localhost:5000/api/blog/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction au DevOps avec Kubernetes",
    "content": "Kubernetes est devenu l outil incontournable pour orchestrer des conteneurs en production. Dans cet article, nous allons explorer les concepts fondamentaux de Kubernetes et comment il révolutionne le monde du DevOps. Nous verrons comment déployer des applications, gérer la mise à l échelle automatique, et assurer la haute disponibilité de vos services. Kubernetes permet de déclarer l état désiré de votre infrastructure et s assure que cet état est maintenu en permanence.",
    "category": "Kubernetes",
    "tags": ["kubernetes", "devops", "docker", "cloud"],
    "status": "published"
  }'
```

**Attendu** (vérifier ces auto-enrichissements):
```json
{
  "success": true,
  "data": {
    "id": "uuid-generated",
    "slug": "introduction-devops-kubernetes",  // ✅ Auto-généré
    "excerpt": "Kubernetes est devenu l outil...",  // ✅ Auto-extrait (300 chars)
    "read_time": 2,  // ✅ Auto-calculé (minutes)
    "published_at": "2025-01-09T...",  // ✅ Auto-défini (status=published)
    "views": 0,
    "created_at": "2025-01-09T..."
  }
}
```

**Checklist validation**:
- [ ] Slug auto-généré (lowercase, hyphens)
- [ ] Excerpt auto-extrait du content
- [ ] Read time calculé (2 minutes)
- [ ] published_at défini automatiquement
- [ ] Status = 'published'

---

**C. Lister les posts (Public, pas d'auth)**:
```bash
curl http://localhost:5000/api/blog/posts
```

**Attendu**:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "Introduction au DevOps avec Kubernetes",
      "slug": "introduction-devops-kubernetes",
      "excerpt": "...",
      "category": "Kubernetes",
      "views": 0
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

**D. Récupérer post par slug (incrémente vues)**:
```bash
# Première lecture
curl http://localhost:5000/api/blog/posts/introduction-devops-kubernetes

# Deuxième lecture
curl http://localhost:5000/api/blog/posts/introduction-devops-kubernetes
```

**Attendu** (après 2ème lecture):
```json
{
  "success": true,
  "data": {
    "slug": "introduction-devops-kubernetes",
    "views": 2,  // ✅ Incrémenté automatiquement
    "comments_count": 0
  }
}
```

**Checklist validation**:
- [ ] Vues incrémentées à chaque lecture (0 → 1 → 2)
- [ ] comments_count retourné (0)

---

### Test 2: Blog - Commentaires avec Modération

**A. Créer un commentaire (Public, pas d'auth)**:
```bash
curl -X POST http://localhost:5000/api/blog/comments \
  -H "Content-Type: application/json" \
  -d '{
    "post_id": "REMPLACER_PAR_UUID_POST",
    "author_name": "Jean Dupont",
    "author_email": "jean.dupont@example.com",
    "content": "Excellent article! Kubernetes a vraiment changé ma façon de déployer des applications. Merci pour ces explications claires."
  }'
```

**⚠️ Important**: Remplacer `REMPLACER_PAR_UUID_POST` par l'UUID du post créé précédemment.

**Attendu**:
```json
{
  "success": true,
  "message": "Commentaire soumis. Il sera visible après modération.",
  "data": {
    "id": "uuid-comment",
    "status": "pending"  // ✅ En attente de modération
  }
}
```

**Checklist validation**:
- [ ] Commentaire créé avec status='pending'
- [ ] IP hashée SHA-256 (vérifier dans Supabase table blog_comments)

---

**B. Lister commentaires du post (Public)**:
```bash
curl "http://localhost:5000/api/blog/posts/UUID_POST/comments"
```

**Attendu**:
```json
{
  "success": true,
  "data": [],  // ✅ Vide car status='pending' (pas approuvé)
  "pagination": { ... }
}
```

**Validation**: Aucun commentaire visible (non approuvé) ✅

---

**C. Modérer le commentaire (Admin, auth requise)**:

**Lister commentaires en attente**:
```bash
curl http://localhost:5000/api/blog/comments/moderation \
  -H "Authorization: Bearer $TOKEN"
```

**Attendu**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-comment",
      "author_name": "Jean Dupont",
      "content": "Excellent article!...",
      "status": "pending"
    }
  ]
}
```

**Approuver le commentaire**:
```bash
COMMENT_ID="uuid-comment-copié"

curl -X PUT "http://localhost:5000/api/blog/comments/$COMMENT_ID/moderate" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```

**Attendu**:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "status": "approved"  // ✅ Approuvé
  }
}
```

**Re-lister commentaires publics**:
```bash
curl "http://localhost:5000/api/blog/posts/UUID_POST/comments"
```

**Attendu**:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "author_name": "Jean Dupont",
      "content": "Excellent article!...",
      "status": "approved"  // ✅ Maintenant visible
    }
  ]
}
```

**Checklist validation**:
- [ ] Commentaire pending → approved
- [ ] Commentaire maintenant visible publiquement

---

### Test 3: Contact Form avec Email

**A. Envoyer un message (Public, rate limited 3/heure)**:
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Martin",
    "email": "alice.martin@example.com",
    "subject": "Demande de collaboration DevOps",
    "message": "Bonjour, je suis responsable infrastructure chez TechCorp. Nous recherchons un expert DevOps pour un projet Kubernetes. Votre profil correspond parfaitement à nos besoins. Pourriez-vous me contacter pour discuter des détails?",
    "phone": "+33 6 12 34 56 78",
    "company": "TechCorp"
  }'
```

**Attendu**:
```json
{
  "success": true,
  "message": "Message envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
  "data": {
    "id": "uuid-message",
    "created_at": "2025-01-09T..."
  }
}
```

**Vérifier email reçu**:
- ✅ Ouvrir votre boîte email (EMAIL_TO dans .env)
- ✅ Devrait recevoir un email avec template HTML professionnel
- ✅ Sujet: "📬 Nouveau contact: Demande de collaboration DevOps"
- ✅ Bouton "Répondre par Email" présent

**Checklist validation**:
- [ ] Message créé avec status='new'
- [ ] Email de notification reçu (vérifier boîte)
- [ ] Template HTML correct (dégradé bleu, bouton)
- [ ] IP hashée SHA-256 dans Supabase

---

**B. Test Rate Limiting (3/heure)**:
```bash
# Envoyer 4 messages rapidement
for i in {1..4}; do
  curl -X POST http://localhost:5000/api/contact \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"Test $i\",
      \"email\": \"test$i@example.com\",
      \"subject\": \"Test rate limit\",
      \"message\": \"Message de test numéro $i pour vérifier le rate limiting de 3 messages par heure.\"
    }"
  echo -e "\n---\n"
done
```

**Attendu** (4ème message):
```json
{
  "success": false,
  "error": "Trop de messages envoyés. Veuillez réessayer dans 1 heure.",
  "retryAfter": "60 minutes"
}
```

**Checklist validation**:
- [ ] 3 premiers messages: 201 Created
- [ ] 4ème message: 429 Too Many Requests
- [ ] Message "Trop de messages envoyés"

---

**C. Lister messages (Admin)**:
```bash
curl http://localhost:5000/api/contact/messages \
  -H "Authorization: Bearer $TOKEN"
```

**Attendu**:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Alice Martin",
      "email": "alice.martin@example.com",
      "subject": "Demande de collaboration DevOps",
      "status": "new",
      "created_at": "..."
    },
    ...
  ],
  "pagination": { "total": 4 }
}
```

---

**D. Changer statut message**:
```bash
MESSAGE_ID="uuid-message-copié"

curl -X PUT "http://localhost:5000/api/contact/messages/$MESSAGE_ID/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "read"}'
```

**Attendu**:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "status": "read"  // ✅ Mis à jour
  }
}
```

---

### Test 4: Analytics RGPD-Compliant

**A. Tracker un événement (Public)**:

**Générer session ID**:
```bash
# Windows (PowerShell)
$SESSION_ID = [guid]::NewGuid()

# Linux/Mac
SESSION_ID=$(uuidgen)
```

**Tracker page view**:
```bash
curl -X POST http://localhost:5000/api/analytics/track \
  -H "Content-Type: application/json" \
  -H "X-Analytics-Consent: true" \
  -d "{
    \"event_type\": \"page_view\",
    \"page_url\": \"https://asinda.github.io/portofolio/\",
    \"page_title\": \"Alice Sindayigaya - Portfolio DevOps & Cloud\",
    \"session_id\": \"$SESSION_ID\",
    \"device_type\": \"desktop\"
  }"
```

**Attendu**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-event",
    "created_at": "2025-01-09T..."
  }
}
```

---

**Tracker plusieurs événements**:
```bash
# Click
curl -X POST http://localhost:5000/api/analytics/track \
  -H "Content-Type: application/json" \
  -H "X-Analytics-Consent: true" \
  -d "{
    \"event_type\": \"click\",
    \"page_url\": \"https://asinda.github.io/portofolio/#projects\",
    \"session_id\": \"$SESSION_ID\",
    \"metadata\": {\"element\": \"project-card\", \"project_id\": \"k8s-deployment\"}
  }"

# Download
curl -X POST http://localhost:5000/api/analytics/track \
  -H "Content-Type: application/json" \
  -H "X-Analytics-Consent: true" \
  -d "{
    \"event_type\": \"download\",
    \"page_url\": \"https://asinda.github.io/portofolio/assets/cv-alice-sindayigaya.pdf\",
    \"session_id\": \"$SESSION_ID\"
  }"
```

**Checklist validation**:
- [ ] 3 événements créés
- [ ] IP hashée SHA-256 (vérifier dans Supabase analytics_events)
- [ ] Device/Browser/OS auto-détectés

---

**B. Dashboard Analytics (Admin)**:
```bash
curl "http://localhost:5000/api/analytics/dashboard?days=7" \
  -H "Authorization: Bearer $TOKEN"
```

**Attendu**:
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2025-01-02T...",
      "end": "2025-01-09T...",
      "days": 7
    },
    "metrics": {
      "total_events": 3,
      "unique_sessions": 1,
      "page_views": 1,
      "devices": { "desktop": 3 },
      "browsers": { "Chrome": 3 },
      "os": { "Windows": 3 },
      "top_pages": [
        {
          "url": "https://asinda.github.io/portofolio/",
          "views": 1
        }
      ],
      "top_referrers": []
    }
  }
}
```

**Checklist validation**:
- [ ] total_events = 3
- [ ] unique_sessions = 1
- [ ] page_views = 1
- [ ] Devices détectés correctement
- [ ] Top pages listées

---

**C. Temps réel**:
```bash
curl http://localhost:5000/api/analytics/real-time \
  -H "Authorization: Bearer $TOKEN"
```

**Attendu**:
```json
{
  "success": true,
  "data": {
    "active_sessions": 1,
    "recent_events": [
      {
        "event_type": "download",
        "page_url": "https://...",
        "device_type": "desktop",
        "created_at": "2025-01-09T..."
      },
      ...
    ]
  }
}
```

---

## ✅ Checklist Finale de Validation

### Blog System
- [ ] Post créé avec auto-enrichissement (slug, excerpt, read_time, published_at)
- [ ] Liste posts publics fonctionne
- [ ] Post par slug incrémente vues
- [ ] Commentaire créé avec status='pending'
- [ ] Modération commentaire fonctionne (pending → approved)
- [ ] Commentaire approuvé visible publiquement

### Contact Form
- [ ] Message créé avec success
- [ ] Email notification reçu avec template HTML
- [ ] Rate limiting fonctionne (3 messages max/heure)
- [ ] 4ème message retourne 429 Too Many Requests
- [ ] Admin peut lister messages
- [ ] Admin peut changer statut (new → read)

### Analytics
- [ ] Événements trackés avec succès
- [ ] IP hashée SHA-256 (vérifier dans Supabase)
- [ ] Device/Browser/OS auto-détectés
- [ ] Dashboard retourne métriques correctes
- [ ] Temps réel fonctionne (5 dernières minutes)

### Sécurité
- [ ] RLS Supabase actif (public voit seulement published posts)
- [ ] JWT authentication fonctionne
- [ ] Rate limiting appliqué (contact, comments, analytics)
- [ ] IP jamais stockée en clair (SHA-256 uniquement)
- [ ] Validation Zod bloque données invalides

---

## 🐛 Résolution Problèmes Courants

### Erreur: "RESEND_API_KEY manquante"
**Solution**: Ajouter clé dans `backend/.env`:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Erreur: "Route non trouvée /api/blog"
**Solution**: Vérifier imports dans `server.js`:
```javascript
import blogRoutes from './src/routes/blog.js';
app.use('/api/blog', blogRoutes);
```

### Erreur 401: "Non autorisé"
**Solution**: Token JWT expiré, refaire login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"...","password":"..."}'
```

### Email non reçu
**Solutions**:
1. Vérifier logs backend pour erreurs Resend
2. Vérifier `EMAIL_TO` dans `.env`
3. Mode sandbox: ne peut envoyer qu'à email vérifié
4. Vérifier spam/indésirables

### Tables Supabase manquantes
**Solution**: Réexécuter scripts SQL:
1. `docs/SUPABASE_BLOG_SETUP.sql`
2. `docs/SUPABASE_CONTACT_ANALYTICS_SETUP.sql`

---

## 📊 Résultat Attendu

**Sprint 3 validé si**:
- ✅ 6 tables Supabase créées
- ✅ 23 routes API fonctionnelles
- ✅ Blog posts avec auto-enrichissement
- ✅ Commentaires avec modération
- ✅ Contact avec email notifications
- ✅ Analytics avec IP hashée
- ✅ Rate limiting appliqué
- ✅ RLS Supabase actif

**Score**: ___/8 modules validés

**Prêt pour production**: [ ] Oui / [ ] Non

---

**Date des tests**: ___________
**Testeur**: ___________
**Résultat global**: ✅ SUCCÈS / ⚠️ PROBLÈMES MINEURS / ❌ ÉCHEC

