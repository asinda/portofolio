# 🧪 GUIDE DE TEST PWA - Portfolio Alice Sindayigaya

**Date:** 9 janvier 2026
**Version:** Sprint 4 - PWA Complet
**Serveur local:** http://localhost:8080

---

## ✅ Statut du Serveur

🟢 **Serveur HTTP actif sur http://localhost:8080**

**Fichiers PWA vérifiés:**
- ✅ `manifest.json` - HTTP 200
- ✅ `sw.js` (Service Worker) - HTTP 200
- ✅ `offline.html` - HTTP 200
- ✅ `icons/icon-192x192.png` - HTTP 200

---

## 📋 TESTS À EFFECTUER

### TEST 1: Ouvrir le Portfolio dans Chrome

**Actions:**
1. Ouvrir **Google Chrome** (obligatoire, pas Firefox/Edge pour les tests PWA)
2. Aller sur: `http://localhost:8080`
3. Vérifier que la page se charge correctement

**Résultat attendu:**
- ✅ Page d'accueil visible
- ✅ Animations GSAP fonctionnent
- ✅ Navigation fluide

---

### TEST 2: Vérifier le Service Worker (DevTools)

**Actions:**
1. Appuyer sur **F12** pour ouvrir Chrome DevTools
2. Aller dans l'onglet **Application**
3. Dans le menu gauche, cliquer sur **Service Workers**

**Résultats attendus:**
- ✅ Service Worker présent: `/portofolio/sw.js`
- ✅ Statut: **"activated and is running"** (fond vert)
- ✅ Scope: `/portofolio/`
- ✅ Dans la console (onglet Console), voir: `✅ Service Worker enregistré: /portofolio/`

**Screenshot à vérifier:**
```
Service Workers
  ✓ /portofolio/sw.js
    Status: activated and is running
    Scope: /portofolio/
```

---

### TEST 3: Vérifier le Manifest PWA

**Actions:**
1. Dans DevTools → Onglet **Application**
2. Menu gauche → **Manifest**

**Résultats attendus:**
- ✅ **Identity:**
  - Name: "Alice Sindayigaya - Portfolio DevOps & Cloud Engineer"
  - Short name: "Alice DevOps"
- ✅ **Presentation:**
  - Display: standalone
  - Theme color: #00a3ff (bleu)
  - Background color: #1a2332 (bleu foncé)
- ✅ **Icons:** 8 icônes visibles (72x72 → 512x512)
- ✅ **Shortcuts:** 3 raccourcis (CV, Projets, Contact)

**Screenshot à vérifier:**
```
Manifest - http://localhost:8080/manifest.json
  ✓ Installable
  ✓ Icons: 8
  ✓ Theme color: #00a3ff
```

---

### TEST 4: Vérifier le Cache Storage

**Actions:**
1. DevTools → Application → **Cache Storage** (menu gauche)
2. Développer la section `portfolio-alice-v1.0.0`

**Résultats attendus:**
- ✅ Cache créé: `portfolio-alice-v1.0.0`
- ✅ Assets pré-cachés visibles (11+ fichiers):
  - `/portofolio/`
  - `/portofolio/index.html`
  - `/portofolio/offline.html`
  - `/portofolio/css/style-cityscape.css`
  - `/portofolio/js/main.js`
  - `/portofolio/js/animations.js`
  - `/portofolio/manifest.json`
  - `/portofolio/icons/icon-192x192.png`
  - `/portofolio/icons/icon-512x512.png`

**Screenshot à vérifier:**
```
Cache Storage
  ▼ portfolio-alice-v1.0.0
    ✓ /portofolio/ (11 items)
```

---

### TEST 5: Installer la PWA (Desktop)

**Actions:**
1. Dans la barre d'adresse Chrome, chercher l'icône **"Installer"** (➕ ou icône d'ordinateur)
2. Cliquer sur l'icône
3. Dans la popup, cliquer sur **"Installer"**

**Résultats attendus:**
- ✅ Popup d'installation apparaît avec:
  - Titre: "Alice DevOps"
  - Description visible
  - Icône 192x192 affichée
- ✅ Après installation, nouvelle fenêtre s'ouvre en mode standalone
- ✅ Pas de barre d'adresse visible
- ✅ Titre de la fenêtre: "Alice DevOps"
- ✅ Icône dans la barre des tâches Windows

**Comment désinstaller (pour re-tester):**
- Dans la fenêtre PWA: Menu (⋮) → "Désinstaller Alice DevOps"
- Ou: chrome://apps → Clic droit sur l'app → "Supprimer de Chrome"

---

### TEST 6: Tester le Mode Offline

**Actions:**
1. Dans DevTools, aller dans l'onglet **Network**
2. Cocher la case **"Offline"** (en haut)
3. Recharger la page (**Ctrl+R** ou F5)

**Résultats attendus:**
- ✅ Page `offline.html` s'affiche automatiquement
- ✅ Design visible:
  - Icône 📡 animé
  - Titre: "Vous êtes hors ligne"
  - Message d'erreur
  - Bouton "🔄 Réessayer"
  - Indicateur de statut rouge clignotant
- ✅ Dans la console, voir: Requêtes servies depuis le cache

**Actions de reconnexion:**
1. Décocher la case "Offline"
2. Attendre 3-5 secondes
3. L'indicateur devient vert: "Connexion rétablie!"
4. La page se recharge automatiquement

**Screenshot à vérifier:**
```
📡
Vous êtes hors ligne
Pas de connexion Internet détectée.
[🔄 Réessayer]
● Pas de connexion Internet
```

---

### TEST 7: Tester le Cache Offline (Navigation)

**Actions:**
1. En mode **Online**, naviguer sur plusieurs sections du site:
   - Accueil
   - CV
   - Projets
2. Activer le mode **Offline** (DevTools → Network → Offline)
3. Naviguer sur les sections visitées précédemment

**Résultats attendus:**
- ✅ CSS/JS/Images chargent depuis le cache
- ✅ Aucune erreur réseau dans la console
- ✅ Le site reste fonctionnel (avec données en cache)
- ✅ DevTools → Network → Requests viennent de "ServiceWorker"

---

### TEST 8: Lighthouse Audit

**Actions:**
1. DevTools → Onglet **Lighthouse** (ou "Performance" dans anciennes versions)
2. Configurer:
   - Mode: Desktop
   - Categories: ✅ Performance, ✅ PWA, ✅ Accessibility, ✅ Best Practices, ✅ SEO
3. Cliquer sur **"Analyze page load"**
4. Attendre 30-60 secondes

**Scores attendus:**

| Catégorie | Score Cible | Explication |
|-----------|-------------|-------------|
| **Performance** | 90-95+ | Optimisations Sprint 1 (WebP, fonts, minification) |
| **PWA** | 90-100 | Manifest + Service Worker + Icons + Offline |
| **Accessibility** | 95+ | Contrastes WCAG AA, ARIA, focus visible |
| **Best Practices** | 90+ | HTTPS (en prod), sécurité headers |
| **SEO** | 95-100 | Meta tags, sitemap, robots.txt, OG tags |

**Détails PWA à vérifier:**
- ✅ Fast and reliable: Page loads fast on 3G
- ✅ Installable: Meets installability requirements
- ✅ PWA Optimized: Content sized correctly for viewport
- ✅ Offline: Current page responds with 200 when offline
- ✅ Service Worker: Registered service worker
- ✅ Manifest: Web app manifest meets installability requirements
- ✅ Icons: Manifest includes icons at 192px and 512px
- ✅ Theme color: Sets theme color
- ✅ Viewport: Has <meta name="viewport">
- ✅ Apple touch icon: Provides apple-touch-icon

**Screenshot à prendre:**
```
Lighthouse Report
  Performance: 94 🟢
  PWA: 100 🟢
  Accessibility: 96 🟢
  Best Practices: 92 🟢
  SEO: 100 🟢
```

---

### TEST 9: Tester sur Mobile (Optionnel)

**Option A: Remote Debugging (Chrome sur Android)**

**Prérequis:**
- Téléphone Android
- Cable USB
- Chrome installé sur mobile

**Actions:**
1. Sur le PC: Chrome → `chrome://inspect`
2. Connecter téléphone en USB
3. Autoriser le débogage USB sur le téléphone
4. Dans chrome://inspect, cliquer sur "Inspect" sur l'appareil
5. Dans Remote Devices, ouvrir `http://IP_DU_PC:8000`

**Résultats attendus:**
- ✅ Site s'affiche sur mobile
- ✅ Bannière d'installation PWA apparaît (bas de l'écran)
- ✅ Après installation, icône sur l'écran d'accueil Android

---

**Option B: Tunnel ngrok (si pas de mobile physique)**

**Actions:**
```bash
# Installer ngrok: https://ngrok.com/download
ngrok http 8000
```

Ouvrir l'URL `https://xxxxx.ngrok.io` sur n'importe quel appareil mobile.

---

### TEST 10: Tester la Mise à Jour du Service Worker

**Actions:**
1. Modifier `sw.js`: Changer `CACHE_VERSION = 'v1.0.0'` → `'v1.0.1'`
2. Sauvegarder
3. Dans Chrome, recharger la page (**Ctrl+R**)
4. Regarder la console

**Résultats attendus:**
- ✅ Console affiche: `🔄 Nouvelle version du Service Worker détectée`
- ✅ Popup JavaScript: "Une nouvelle version est disponible. Recharger la page?"
- ✅ Cliquer "OK" → Page se recharge
- ✅ Nouveau Service Worker activé
- ✅ Ancien cache supprimé: `portfolio-alice-v1.0.0`
- ✅ Nouveau cache créé: `portfolio-alice-v1.0.1`

---

## 🐛 DÉPANNAGE

### Problème: Service Worker ne s'enregistre pas

**Solutions:**
1. Vérifier que vous utilisez `http://localhost` (pas `file://`)
2. Ouvrir la console: Chercher erreurs JavaScript
3. DevTools → Application → Service Workers → Cliquer "Unregister"
4. Recharger la page avec cache vidé: **Ctrl+Shift+R**
5. Vérifier que `sw.js` est accessible: `http://localhost:8080/sw.js`

---

### Problème: Manifest non détecté

**Solutions:**
1. Vérifier dans DevTools → Console: Pas d'erreur manifest
2. Vérifier dans DevTools → Network: `manifest.json` HTTP 200
3. Vérifier dans `index.html`: `<link rel="manifest" href="manifest.json">`
4. Vérifier le chemin: Doit être relatif à `index.html`

---

### Problème: Icônes PWA manquantes

**Solutions:**
1. Vérifier que le dossier `frontend/public/icons/` existe
2. Lister les fichiers: 8 icônes (72x72 → 512x512)
3. Tester une icône: `http://localhost:8080/icons/icon-192x192.png`
4. Re-générer si besoin: `cd frontend && node generate-pwa-icons.js`

---

### Problème: Page offline ne s'affiche pas

**Solutions:**
1. Vérifier `offline.html`: `http://localhost:8080/offline.html`
2. Vérifier dans Cache Storage: `offline.html` est pré-caché
3. Vider le cache: DevTools → Application → Clear site data
4. Recharger et re-tester offline

---

### Problème: Lighthouse score PWA < 90

**Causes fréquentes:**
- ❌ Service Worker pas enregistré
- ❌ Manifest manquant ou invalide
- ❌ Icônes 192x192 ou 512x512 manquantes
- ❌ Pas de page offline
- ❌ Testé en mode "file://" au lieu de "http://localhost"

**Solution:** Suivre tous les tests 1-7 ci-dessus

---

## ✅ CHECKLIST FINALE

Cocher après chaque test réussi:

- [ ] TEST 1: Page s'ouvre sur http://localhost:8080
- [ ] TEST 2: Service Worker "activated and running"
- [ ] TEST 3: Manifest affiché dans DevTools
- [ ] TEST 4: Cache Storage contient 11+ assets
- [ ] TEST 5: PWA installable (icône ➕ visible)
- [ ] TEST 6: Page offline.html s'affiche en mode offline
- [ ] TEST 7: Navigation fonctionne offline
- [ ] TEST 8: Lighthouse PWA ≥ 90
- [ ] TEST 9: (Optionnel) Testé sur mobile
- [ ] TEST 10: Mise à jour Service Worker fonctionne

---

## 📊 RAPPORT DE TEST

**Date du test:** __________
**Navigateur:** Chrome version ______
**OS:** Windows ______

**Scores Lighthouse obtenus:**
- Performance: ______ / 100
- PWA: ______ / 100
- Accessibility: ______ / 100
- Best Practices: ______ / 100
- SEO: ______ / 100

**Problèmes rencontrés:**
- Aucun ✅
- Liste des problèmes: _______________

**Statut final:**
- [ ] ✅ Tous les tests passent - Prêt pour déploiement
- [ ] ⚠️ Quelques tests échouent - Corrections nécessaires
- [ ] ❌ Problèmes majeurs - Revue complète requise

---

## 🚀 PROCHAINE ÉTAPE

Une fois tous les tests validés, vous pouvez passer au **déploiement production**:
- Frontend → GitHub Pages (automatique via CI/CD)
- Backend → Render avec nouvelles routes Sprint 3

**Commande pour arrêter le serveur de test:**
```bash
# Trouver le processus
ps aux | grep http-server
# Ou arrêter tous les processus Node.js sur le port 8000
```

---

**🎉 Bon test!**
