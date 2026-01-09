# Tests Sprint 2 - Animations GSAP

**Date**: 9 janvier 2025
**URL de test**: http://127.0.0.1:8000
**Status serveur**: ✅ En ligne

---

## 📋 Checklist de Tests - Animations

### Étape 1: Vérifications Initiales (Console JavaScript)

**Instructions**:
1. Ouvrir Chrome DevTools: `F12` ou `Ctrl+Shift+I`
2. Onglet **Console**
3. Vérifier les messages de confirmation

**Attendu**:
```
✅ Animations GSAP initialisées
📜 animations.js chargé - Sprint 2 GSAP
```

**Erreurs à vérifier**:
- ❌ Aucune erreur rouge dans la console
- ⚠️ Les erreurs 404 `/api/portfolio/*` sont normales (backend non lancé)

**Status**: [ ] Validé

---

### Étape 2: Hero Section - Particules Animées

**Instructions**:
1. Regarder le **fond de la section hero** (en haut de page)
2. Observer les petites particules bleues flottantes

**Attendu**:
- 50 petites particules bleues (#00a3ff)
- Mouvement fluide et organique (haut/bas, gauche/droite)
- Vitesse variée (certaines rapides, d'autres lentes)
- Effet de profondeur

**Comment vérifier**:
- Particules visibles: [ ] Oui / [ ] Non
- Mouvement fluide: [ ] Oui / [ ] Non (si laggy, voir tests performance)
- Nombre approximatif: [ ] ~50 particules

**Status**: [ ] Validé

---

### Étape 3: Hero Title - Reveal Séquentiel

**Instructions**:
1. **Recharger la page** (F5 ou Ctrl+R)
2. Observer le titre principal du hero (nom "Alice Sindayigaya" ou titre H1)
3. Les lettres doivent apparaître une par une

**Attendu**:
- Chaque caractère apparaît séquentiellement (de gauche à droite)
- Effet de rotation 3D (flip)
- Durée totale: ~1.5 secondes
- Rebond élastique (back ease)

**Comment vérifier**:
- Animation démarre après ~0.3s: [ ] Oui / [ ] Non
- Lettres apparaissent une par une: [ ] Oui / [ ] Non
- Effet 3D visible: [ ] Oui / [ ] Non

**Notes**: Si l'animation ne se voit pas, c'est que SplitType n'a pas trouvé le titre. Vérifier le sélecteur dans animations.js ligne 99.

**Status**: [ ] Validé

---

### Étape 4: Scroll Progress Indicator

**Instructions**:
1. Regarder en **haut de la page** (barre fixe)
2. **Scroller** vers le bas
3. Observer la barre de progression

**Attendu**:
- Barre fine (3px) en haut de page
- Dégradé bleu (#00a3ff) → orange (#ff6b35)
- Se remplit de gauche à droite proportionnellement au scroll
- Atteint 100% en bas de page

**Comment vérifier**:
- Barre visible en haut: [ ] Oui / [ ] Non
- Se remplit au scroll: [ ] Oui / [ ] Non
- Dégradé bleu→orange: [ ] Oui / [ ] Non

**Status**: [ ] Validé

---

### Étape 5: Cards 3D Hover (Hero/Stats/Services)

**Instructions**:
1. Trouver les **cards** dans la page (hero, stats, services)
2. **Passer la souris** sur chaque card
3. Observer l'effet d'inclinaison 3D

**Attendu**:
- Card suit le mouvement de la souris
- Inclinaison 3D (max 15°)
- Effet de brillance (glare) visible
- Zoom léger (5%)
- Retour fluide quand souris sort

**Sélecteurs concernés**:
- `.hero-card`
- `.stat-card`
- `.service-card`

**Comment vérifier**:
- Cards trouvées: [ ] Oui / [ ] Non (combien: ___)
- Effet 3D fonctionne: [ ] Oui / [ ] Non
- Brillance visible: [ ] Oui / [ ] Non
- Retour fluide: [ ] Oui / [ ] Non

**Status**: [ ] Validé

---

### Étape 6: About Section - Image Parallax

**Instructions**:
1. **Scroller** jusqu'à la section "À propos" / "About"
2. Observer l'image principale
3. **Scroller lentement** de haut en bas

**Attendu**:
- Image se déplace plus lentement que le scroll
- Effet de profondeur (parallax)
- Zoom léger (110%)
- Mouvement continu et fluide

**Comment vérifier**:
- Section About trouvée: [ ] Oui / [ ] Non
- Image bouge au scroll: [ ] Oui / [ ] Non
- Effet parallax visible: [ ] Oui / [ ] Non

**Status**: [ ] Validé

---

### Étape 7: Stats Counters Animés

**Instructions**:
1. Trouver les **statistiques** (nombres avec + ou similaire)
   - Exemple: "7+ ans", "50+ projets", etc.
2. **Recharger la page** (F5)
3. **Scroller** jusqu'aux stats
4. Observer les compteurs

**Attendu**:
- Compteurs partent de 0
- S'animent jusqu'au nombre cible
- Durée: 2 secondes
- Animation se déclenche quand stats entrent dans viewport (80%)

**Comment vérifier**:
- Stats trouvées: [ ] Oui / [ ] Non (combien: ___)
- Compteurs s'animent de 0: [ ] Oui / [ ] Non
- Animation fluide: [ ] Oui / [ ] Non

**Notes**: Sélecteurs attendus: `.stat-number`, `.counter`, `[data-count]`

**Status**: [ ] Validé

---

### Étape 8: Projects Cards - Hover Animation

**Instructions**:
1. Trouver les **cartes de projets** (section "Projets" / "Projects")
2. **Passer la souris** sur chaque carte
3. Observer l'élévation

**Attendu**:
- Carte s'élève de 10px au hover
- Ombre bleue intense apparaît: `0 20px 60px rgba(0, 163, 255, 0.4)`
- Retour fluide au mouseleave
- Animation au scroll: fade in + slide up

**Comment vérifier**:
- Cards projets trouvées: [ ] Oui / [ ] Non (combien: ___)
- Élévation au hover: [ ] Oui / [ ] Non
- Ombre bleue visible: [ ] Oui / [ ] Non
- Fade in au scroll: [ ] Oui / [ ] Non

**Status**: [ ] Validé

---

### Étape 9: Skills - Progress Bars Animées

**Instructions**:
1. Trouver la section **Compétences** / "Skills"
2. **Recharger la page** (F5)
3. **Scroller** jusqu'à la section skills
4. Observer les barres de progression

**Attendu**:
- Barres partent de 0% (vides)
- Se remplissent de gauche à droite
- Durée: 1.5 secondes
- Ease: power2.out (rapide début, ralenti fin)

**Comment vérifier**:
- Section Skills trouvée: [ ] Oui / [ ] Non
- Barres trouvées: [ ] Oui / [ ] Non (combien: ___)
- Animation se déclenche au scroll: [ ] Oui / [ ] Non
- Se remplissent de 0 à 100%: [ ] Oui / [ ] Non

**Notes**: Sélecteurs attendus: `.skill-bar`, `.progress-bar`

**Status**: [ ] Validé

---

### Étape 10: Curseur Personnalisé (Desktop uniquement)

**Instructions**:
1. **Déplacer la souris** sur la page
2. Observer le curseur custom (cercle orange)
3. **Passer sur un lien ou bouton**

**Attendu**:
- Cercle orange (20x20 px) suit la souris
- Léger retard (easing fluide)
- Mix-blend-mode: difference (contraste inversé)
- S'agrandit (40x40 px) sur hover liens/boutons
- Opacité: 0.5

**Comment vérifier**:
- Curseur visible: [ ] Oui / [ ] Non
- Suit la souris: [ ] Oui / [ ] Non
- S'agrandit sur hover: [ ] Oui / [ ] Non
- Retard fluide: [ ] Oui / [ ] Non

**Notes**:
- Désactivé si largeur < 768px (mobile)
- Mix-blend-mode peut ne pas fonctionner sur tous navigateurs

**Status**: [ ] Validé

---

### Étape 11: Magnetic Buttons

**Instructions**:
1. Trouver les **boutons CTA** / `.btn-primary`
2. **Déplacer lentement la souris** vers un bouton
3. Observer l'attraction magnétique
4. **Sortir la souris** rapidement

**Attendu**:
- Bouton "attiré" vers le curseur (30% du déplacement)
- Effet magnétique fluide
- Retour élastique avec rebond quand souris sort
- Ease: elastic.out

**Comment vérifier**:
- Boutons trouvés: [ ] Oui / [ ] Non (combien: ___)
- Effet magnétique visible: [ ] Oui / [ ] Non
- Retour avec rebond: [ ] Oui / [ ] Non

**Notes**: Désactivé sur mobile (< 768px)

**Status**: [ ] Validé

---

## 🧪 Tests Performance (Chrome DevTools)

### Test 1: Framerate 60fps

**Instructions**:
1. Ouvrir DevTools: `F12`
2. Onglet **Performance**
3. Cliquer sur **Record** (cercle)
4. **Scroller** pendant 10 secondes sur toute la page
5. Cliquer sur **Stop**
6. Analyser le résultat

**Métriques à vérifier**:
- **FPS (Frames Per Second)**:
  - Ligne verte en haut du graph
  - Doit rester à **60fps constant** (ligne plate)
  - Acceptable: Quelques drops à 55fps (occasionnels)
  - ⚠️ Problème si < 50fps ou drops fréquents

- **GPU (Graphics Processing Unit)**:
  - Vérifier section "GPU" dans le timeline
  - Doit être **actif** (layers verts)
  - Si gris = pas d'accélération GPU

- **CPU Usage**:
  - Pendant scroll: < 60% acceptable
  - Au repos (idle): < 30%

**Résultats**:
- FPS moyen: ___ fps
- Drops observés: [ ] Oui / [ ] Non (fréquence: ___)
- GPU actif: [ ] Oui / [ ] Non
- CPU usage: ___ %

**Status**: [ ] Validé

---

### Test 2: Console Errors

**Instructions**:
1. Ouvrir Console DevTools: `F12` → Console
2. **Filtrer uniquement les erreurs**: Cliquer sur "Errors" (icône rouge)
3. Vérifier qu'il n'y a **aucune erreur JavaScript**

**Erreurs attendues (OK)**:
- ❌ `/api/portfolio/*` 404 (backend non lancé)
- ❌ `/favicon.ico` 404 (pas de favicon)

**Erreurs bloquantes (PAS OK)**:
- ❌ `gsap is not defined`
- ❌ `SplitType is not defined`
- ❌ `VanillaTilt is not defined`
- ❌ `Cannot read property ... of null`

**Résultats**:
- Erreurs JavaScript: [ ] Aucune / [ ] Présentes (détails: ___)
- CDN chargés: [ ] Tous / [ ] Manquants (lesquels: ___)

**Status**: [ ] Validé

---

## ♿ Tests Accessibilité

### Test prefers-reduced-motion

**Instructions**:
1. **Activer prefers-reduced-motion** dans Chrome:
   - Aller à: `chrome://settings/accessibility`
   - Activer "Prefers reduced motion"
   - OU: Activer dans les paramètres Windows (Paramètres → Accessibilité → Affichage → Effets d'animation)

2. **Recharger la page** (F5)

3. **Vérifier que TOUTES les animations sont désactivées**:
   - Pas de particules visibles
   - Pas de curseur custom
   - Pas d'animations au scroll
   - Transitions instantanées

**Attendu**:
- Console affiche: `Mode animations réduites activé (prefers-reduced-motion)`
- Aucune animation ne démarre
- Particules cachées
- Curseur custom caché

**Résultats**:
- Message console: [ ] Présent / [ ] Absent
- Animations désactivées: [ ] Toutes / [ ] Certaines (lesquelles: ___)
- Particules cachées: [ ] Oui / [ ] Non
- Curseur caché: [ ] Oui / [ ] Non

**Status**: [ ] Validé

---

## 📱 Tests Mobile (Responsive)

### Test Responsive < 768px

**Instructions**:
1. Chrome DevTools: `F12`
2. Cliquer sur **Toggle device toolbar**: `Ctrl+Shift+M`
3. Sélectionner **iPhone 12 Pro** ou **Samsung Galaxy S21**
4. **Recharger la page** (F5)

**Attendu (animations simplifiées)**:
- ❌ Pas de curseur personnalisé
- ✅ Particules présentes mais opacité réduite (50%)
- ❌ Pas d'effet magnetic sur boutons
- ❌ Cards 3D simplifiées (pas de tilt)
- ✅ Scroll progress fonctionne
- ✅ Stats counters fonctionnent
- ✅ Progress bars fonctionnent

**Résultats**:
- Curseur absent: [ ] Oui / [ ] Non
- Particules réduites: [ ] Oui / [ ] Non
- Magnetic désactivé: [ ] Oui / [ ] Non
- Cards 3D désactivées: [ ] Oui / [ ] Non
- Animations scroll OK: [ ] Oui / [ ] Non
- Performance fluide: [ ] Oui / [ ] Non (laggy?)

**Status**: [ ] Validé

---

## 🎯 Récapitulatif Final

### Animations Validées

| # | Animation | Status | Notes |
|---|-----------|--------|-------|
| 1 | Particules Hero | [ ] ✅ / [ ] ❌ | ___ |
| 2 | Titre Reveal | [ ] ✅ / [ ] ❌ | ___ |
| 3 | Scroll Progress | [ ] ✅ / [ ] ❌ | ___ |
| 4 | Cards 3D Hover | [ ] ✅ / [ ] ❌ | ___ |
| 5 | Image Parallax | [ ] ✅ / [ ] ❌ | ___ |
| 6 | Stats Counters | [ ] ✅ / [ ] ❌ | ___ |
| 7 | Projects Hover | [ ] ✅ / [ ] ❌ | ___ |
| 8 | Skills Bars | [ ] ✅ / [ ] ❌ | ___ |
| 9 | Curseur Custom | [ ] ✅ / [ ] ❌ | ___ |
| 10 | Magnetic Buttons | [ ] ✅ / [ ] ❌ | ___ |

### Performance

- FPS: [ ] ≥60fps / [ ] <60fps (moyenne: ___ fps)
- GPU: [ ] Actif / [ ] Inactif
- Console: [ ] Aucune erreur / [ ] Erreurs présentes

### Accessibilité

- prefers-reduced-motion: [ ] Fonctionne / [ ] Ne fonctionne pas
- Mobile responsive: [ ] Optimisé / [ ] Problèmes

---

## 🐛 Problèmes Identifiés

### Problèmes Bloquants (❌)

_(Lister ici les animations qui ne fonctionnent pas du tout)_

1. ___
2. ___
3. ___

### Problèmes Mineurs (⚠️)

_(Lister ici les animations qui fonctionnent mais avec des défauts)_

1. ___
2. ___
3. ___

### Problèmes de Performance (⚡)

_(FPS drops, lag, etc.)_

1. ___
2. ___

---

## ✅ Validation Finale

**Sprint 2 - Animations GSAP**:

- [ ] Toutes les animations (10/10) fonctionnent correctement
- [ ] Performance acceptable (≥55fps constant)
- [ ] Aucune erreur JavaScript bloquante
- [ ] prefers-reduced-motion respecté
- [ ] Mobile optimisé (animations simplifiées)

**Score global**: ___/10 animations validées

**Prêt pour production**: [ ] Oui / [ ] Non (si non, pourquoi: ___)

---

**Date des tests**: ___________
**Testeur**: ___________
**Navigateur**: Chrome ___ / Firefox ___ / Safari ___
**OS**: Windows ___ / macOS ___ / Linux ___
