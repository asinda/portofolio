# Tests Unitaires - Backend Portfolio

## 📋 Vue d'Ensemble

Ce dossier contient les tests unitaires pour l'API backend du portfolio. Les tests utilisent **Jest** et **Supertest** pour vérifier le bon fonctionnement de l'application.

## 🧪 Tests Disponibles

### 1. `server.test.js`
Tests du serveur Express principal :
- ✅ Health check endpoint (`/api/health`)
- ✅ Gestion des routes 404
- ✅ Rate limiting
- ✅ Parsing JSON

### 2. `crudController.test.js`
Tests du contrôleur CRUD générique :
- ✅ `getAll()` - Récupération de tous les enregistrements
- ✅ `getById()` - Récupération par ID
- ✅ `create()` - Création d'un enregistrement
- ✅ `update()` - Mise à jour d'un enregistrement
- ✅ `delete()` - Suppression d'un enregistrement
- ✅ Gestion des erreurs
- ✅ Validation des données

### 3. `auth.test.js`
Tests du middleware d'authentification :
- ✅ Validation du token JWT
- ✅ Gestion des tokens manquants
- ✅ Gestion des tokens invalides
- ✅ Format Bearer token
- ✅ Authentification optionnelle
- ✅ Tests de sécurité (injection, tokens longs)

## 🚀 Exécution des Tests

### Commandes Disponibles

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch (re-exécution automatique)
npm run test:watch

# Exécuter les tests avec couverture de code
npm run test:coverage
```

### Résultats Attendus

```
Test Suites: 3 total
Tests:       27 total
Time:        ~4s
```

## 📊 Couverture de Code

La commande `npm run test:coverage` génère un rapport de couverture dans le dossier `coverage/`.

Pour voir le rapport HTML :
1. Exécutez `npm run test:coverage`
2. Ouvrez `coverage/lcov-report/index.html` dans votre navigateur

## ⚙️ Configuration

### Jest Configuration (`jest.config.js`)
- **Environment** : Node.js
- **Modules** : ES Modules (import/export)
- **Timeout** : 10 secondes par test
- **Coverage** : Collecte sur `src/**/*.js` et `server.js`

### Variables d'Environnement

Les tests utilisent `NODE_ENV=test` automatiquement.

Un fichier `.env.test` est disponible pour les tests nécessitant des configurations spécifiques.

## 🔧 Développement

### Ajouter de Nouveaux Tests

1. Créez un nouveau fichier `*.test.js` dans `__tests__/`
2. Importez les dépendances nécessaires :
   ```javascript
   import { describe, test, expect } from '@jest/globals';
   ```
3. Écrivez vos tests :
   ```javascript
   describe('Ma nouvelle fonctionnalité', () => {
       test('devrait faire quelque chose', () => {
           expect(true).toBe(true);
       });
   });
   ```

### Bonnes Pratiques

- ✅ Un fichier de test par module
- ✅ Utilisez des descriptions claires (en français)
- ✅ Groupez les tests avec `describe()`
- ✅ Mockez les dépendances externes (Supabase, API tierces)
- ✅ Testez les cas d'erreur autant que les cas de succès
- ✅ Visez au minimum 70% de couverture de code

## 🐛 Dépannage

### Problème : Tests lents
**Solution** : Augmentez le timeout dans `jest.config.js` ou dans un test spécifique :
```javascript
test('mon test lent', async () => {
    // ...
}, 20000); // 20 secondes
```

### Problème : Erreurs de modules ES
**Solution** : Vérifiez que `"type": "module"` est bien dans `package.json`

### Problème : Tests échouent avec Supabase
**Solution** : Les tests en mode développement utilisent les données locales (`data.json`). Pas besoin de configurer Supabase pour les tests.

## 📚 Ressources

- [Documentation Jest](https://jestjs.io/docs/getting-started)
- [Documentation Supertest](https://github.com/visionmedia/supertest)
- [Guide Testing Node.js](https://nodejs.org/en/docs/guides/testing/)

## 🎯 Objectifs de Couverture

| Module | Couverture Cible |
|--------|------------------|
| Controllers | 80% |
| Middleware | 85% |
| Routes | 75% |
| Serveur | 90% |

## ✅ Checklist Avant Commit

Avant de commiter du code, assurez-vous que :
- [ ] Tous les tests passent (`npm test`)
- [ ] La couverture n'a pas diminué
- [ ] Les nouveaux fichiers ont des tests associés
- [ ] Aucun test n'est désactivé (`.skip()`)
