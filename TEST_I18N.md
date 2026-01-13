# Guide de Test du Système i18n

Ce document décrit comment tester le système d'internationalisation FR/EN du portfolio.

## 🚀 Démarrage rapide

### 1. Lancer le serveur local

```bash
cd frontend/public
python -m http.server 8000
```

Ouvrir dans le navigateur : http://localhost:8000

### 2. Vérifications initiales

**Console du navigateur (F12)** :
Vous devriez voir ces messages dans l'ordre :

```
🌐 Initialisation du système i18n...
✅ Traductions chargées: ['fr', 'en']
📦 Langue depuis localStorage: fr (ou 🌐 Langue depuis navigateur: fr)
✅ i18n initialisé: langue='fr'
✅ Interface LangSwitcher créée
✅ LangSwitcher initialisé
✅ XXX éléments traduits
✅ Meta tags mis à jour pour SEO
✅ Langue appliquée: fr
```

**Bouton FR/EN visible** :
- Le bouton doit apparaître dans le header à droite de la navigation
- Le bouton "FR" doit être actif (fond bleu dégradé)
- Le bouton "EN" doit être inactif (transparent)

## ✅ Tests à effectuer

### Test 1 : Changement de langue (Navigation)

1. **Cliquer sur le bouton "EN"**
2. **Vérifier les changements** :

| Section | Français (FR) | Anglais (EN) |
|---------|---------------|--------------|
| Navigation | Accueil, CV, Projets, Blog & Tutos | Home, Resume, Projects, Blog & Tutorials |
| Hero - Label | Ingénieure DevOps | DevOps Engineer |
| Hero - Greeting | Bonjour, je suis | Hi, I'm |
| Hero - CTA | Découvrir mon CV | View my Resume |
| About - Label | À propos de moi | About Me |
| About - Title | Ingénieure DevOps passionnée... | DevOps Engineer passionate... |

3. **Re-cliquer sur "FR"** pour revenir au français
4. **Vérifier que tout revient en français**

### Test 2 : Persistance (localStorage)

1. Changer la langue vers EN
2. **Recharger la page (F5)**
3. ✅ **La langue EN doit être conservée**
4. Changer vers FR et recharger
5. ✅ **La langue FR doit être conservée**

### Test 3 : Meta tags SEO

1. Ouvrir les DevTools (F12)
2. Aller dans l'onglet **Elements/Inspector**
3. Chercher la balise `<head>`
4. **Vérifier le `<title>`** :
   - FR : "Alice Sindayigaya | Ingénieure DevOps & Cloud | AWS, Kubernetes, Terraform"
   - EN : "Alice Sindayigaya | DevOps & Cloud Engineer | AWS, Kubernetes, Terraform"

5. **Vérifier `<meta name="description">`** :
   - FR : "Ingénieure DevOps avec 7+ ans d'expérience..."
   - EN : "DevOps Engineer with 7+ years of experience..."

6. **Vérifier `<meta property="og:locale">`** :
   - FR : `fr_FR`
   - EN : `en_US`

### Test 4 : Animations de transition

1. Changer de langue
2. ✅ **Observer l'animation de fade** sur les textes (durée : ~300ms)
3. ✅ **Le bouton actif doit avoir une animation de pulse**

### Test 5 : Accessibilité (ARIA)

1. **Inspecter le bouton de navigation toggle** :
   ```html
   <button aria-label="Toggle navigation">
   ```
   - Doit changer selon la langue

2. **Inspecter les liens sociaux du footer** :
   ```html
   <a aria-label="LinkedIn">
   ```
   - FR : "LinkedIn"
   - EN : "LinkedIn" (identique)

3. **Tester la navigation au clavier** :
   - Tab pour naviguer
   - Enter/Space pour activer les boutons FR/EN
   - ✅ Focus visible sur le bouton actif

### Test 6 : Sections complètes

Vérifier que TOUTES ces sections changent de langue :

- [x] Navigation
- [x] Hero (label, greeting, name, CTA, cards)
- [x] About (label, title, paragraphs, stats)
- [x] CV (header, experiences, education, languages, skills)
- [x] Services (header, 3 cards avec features)
- [x] Projects (header, filtres)
- [x] Skills (header, 6 catégories)
- [x] Blog (header, catégories, CTA)
- [x] Footer (brand, navigation, expertise, copyright)
- [x] Back to Top (aria-label)

### Test 7 : Mobile / Responsive

1. Ouvrir les DevTools
2. Activer le mode responsive (Ctrl+Shift+M)
3. **Tester sur différentes tailles** :
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)

4. ✅ **Le bouton FR/EN doit être visible et fonctionnel sur toutes les tailles**
5. ✅ **Sur mobile, le bouton doit apparaître avant le menu toggle**

### Test 8 : Performance

1. Ouvrir l'onglet **Network** des DevTools
2. Recharger la page
3. **Vérifier le chargement des modules i18n** :
   - `init-i18n.js` (type: module)
   - `i18n/i18n.js` (type: module)
   - `i18n/locales/fr.js` (type: module)
   - `i18n/locales/en.js` (type: module)
   - `lang-switcher.js` (type: module)

4. **Temps de changement de langue** :
   - Doit être quasi-instantané (< 100ms)
   - Animation visible mais fluide

### Test 9 : Compatibilité navigateurs

Tester sur :
- [x] Chrome (recommandé)
- [x] Firefox
- [x] Safari
- [x] Edge

### Test 10 : Console - Mode debug

En localhost, le système expose les objets globalement pour le debug :

```javascript
// Dans la console du navigateur
window.i18n                    // Instance I18n
window.langSwitcher            // Instance LangSwitcher

// Tester manuellement
window.i18n.getCurrentLanguage()  // Retourne 'fr' ou 'en'
window.i18n.t('nav.home')         // Retourne "Accueil" ou "Home"
window.i18n.switchLanguage('en')  // Change vers EN
```

## 🐛 Problèmes courants et solutions

### Problème 1 : Le bouton FR/EN n'apparaît pas

**Causes possibles** :
- CSS `lang-toggle.css` non chargé
- Script i18n non exécuté

**Solutions** :
1. Vérifier la console pour les erreurs
2. Vérifier que `lang-toggle.css` est chargé (onglet Network)
3. Vérifier que `init-i18n.js` est chargé avec `type="module"`

### Problème 2 : Les textes ne changent pas

**Causes possibles** :
- Attributs `data-i18n` manquants
- Clés de traduction incorrectes

**Solutions** :
1. Inspecter l'élément HTML
2. Vérifier qu'il a l'attribut `data-i18n="key.path"`
3. Vérifier dans la console : `window.i18n.t('key.path')`

### Problème 3 : Erreur "Cannot read property 'translations'"

**Cause** : Les fichiers de traduction ne sont pas chargés

**Solutions** :
1. Vérifier que `fr.js` et `en.js` existent dans `js/i18n/locales/`
2. Vérifier qu'ils exportent correctement avec `export default { ... }`
3. Vérifier les erreurs de syntaxe dans les fichiers JSON

### Problème 4 : Meta tags non mis à jour

**Cause** : Les meta tags n'ont pas les bons sélecteurs

**Solution** :
- Vérifier que les meta tags existent dans le `<head>`
- La méthode `updateMetaTags()` les trouve et les met à jour automatiquement

### Problème 5 : Langue par défaut incorrecte

**Priorité de détection** :
1. localStorage (`portfolio_language`)
2. Langue du navigateur (`navigator.language`)
3. Langue par défaut (`fr`)

**Solution** :
- Vider le localStorage : `localStorage.removeItem('portfolio_language')`
- Recharger la page

## ✨ Fonctionnalités avancées à tester

### Animation de transition personnalisée

Le système ajoute la classe `lang-switching` au `<body>` pendant le changement :

```css
body.lang-switching [data-i18n] {
    animation: textFadeTransition 0.3s ease-in-out;
}
```

### Support des éléments dynamiques

Si vous ajoutez du contenu dynamiquement (via JS) :

```javascript
// Créer un élément
const element = document.createElement('span');
element.setAttribute('data-i18n', 'nav.home');
element.textContent = window.i18n.t('nav.home');

// L'ajouter au DOM
document.body.appendChild(element);

// Après changement de langue, appeler :
window.i18n.translateElements();
```

### Interpolation de variables

```javascript
// Dans le fichier de traduction
{
    welcome: "Bonjour {{name}}, vous avez {{count}} messages"
}

// Utilisation
window.i18n.t('welcome', { name: 'Alice', count: 5 })
// Résultat : "Bonjour Alice, vous avez 5 messages"
```

### Formatage de dates et nombres

```javascript
const date = new Date('2025-01-13');
window.i18n.formatDate(date, { dateStyle: 'long' })
// FR : "13 janvier 2025"
// EN : "January 13, 2025"

window.i18n.formatNumber(1234.56)
// FR : "1 234,56"
// EN : "1,234.56"
```

## 📝 Checklist de validation finale

Avant de valider le système i18n, vérifier :

- [ ] Toutes les sections du site changent de langue
- [ ] Le bouton FR/EN est visible et fonctionnel
- [ ] Les animations sont fluides
- [ ] La langue est persistée après rechargement
- [ ] Les meta tags SEO changent correctement
- [ ] L'accessibilité (ARIA) fonctionne
- [ ] Le système fonctionne sur mobile
- [ ] Aucune erreur dans la console
- [ ] Les 3 navigateurs principaux fonctionnent
- [ ] Le localStorage conserve la préférence utilisateur

## 🎯 Résultat attendu

✅ **Système i18n 100% fonctionnel** :
- Changement de langue instantané
- Toutes les sections traduites
- SEO multilingue optimisé
- Accessibilité respectée
- Performance optimale
- Expérience utilisateur fluide

## 📚 Ressources

- **Code source** : `frontend/public/js/i18n/`
- **Traductions** : `frontend/public/js/i18n/locales/`
- **Styles** : `frontend/public/css/lang-toggle.css`
- **Guide intégration** : `INTEGRATION_I18N_GUIDE.md`
- **Documentation projet** : `CLAUDE.md`
