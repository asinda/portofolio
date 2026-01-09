# Guide d'Optimisation d'Images - Sprint 1

## Conversion GIF → WebP (CRITIQUE pour LCP)

### Fichier à convertir
- **Source**: `frontend/public/images/api-coding.gif` (341 KB)
- **Cible**: `frontend/public/images/api-coding.webp` (~80 KB)
- **Économie**: 261 KB (-76%)
- **Impact**: LCP passera de 3.5s à ~2.2s (-37%)

### Option 1: Squoosh.app (Recommandé - En ligne, gratuit)

1. **Ouvrir Squoosh**: https://squoosh.app
2. **Uploader** `api-coding.gif` (glisser-déposer)
3. **Configurer le codec**:
   - Format de sortie: **WebP**
   - Qualité: **85** (bon équilibre qualité/taille)
   - Effort: **6** (compression optimale)
4. **Télécharger** le fichier converti
5. **Renommer** en `api-coding.webp`
6. **Placer** dans `frontend/public/images/`

### Option 2: FFmpeg (Local - Si installé)

```bash
# Installation FFmpeg (si besoin)
# Windows: choco install ffmpeg
# Mac: brew install ffmpeg
# Linux: sudo apt install ffmpeg

# Conversion
cd frontend/public/images
ffmpeg -i api-coding.gif -vcodec libwebp -quality 85 -loop 0 api-coding.webp

# Vérifier la taille
ls -lh api-coding.*
```

### Option 3: Node.js avec sharp (Automatique)

```bash
cd frontend

# Installer sharp (dev dependency)
npm install --save-dev sharp

# Créer script de conversion
cat > convert-to-webp.js << 'EOF'
import sharp from 'sharp';
import { readFileSync } from 'fs';

const inputGif = 'public/images/api-coding.gif';
const outputWebp = 'public/images/api-coding.webp';

sharp(inputGif, { animated: true })
  .webp({ quality: 85, effort: 6 })
  .toFile(outputWebp)
  .then(info => {
    const originalSize = (readFileSync(inputGif).length / 1024).toFixed(2);
    const newSize = (info.size / 1024).toFixed(2);
    const savings = ((1 - info.size / readFileSync(inputGif).length) * 100).toFixed(1);

    console.log('✅ Conversion terminée!');
    console.log(`   Taille originale: ${originalSize} KB`);
    console.log(`   Nouvelle taille: ${newSize} KB`);
    console.log(`   Économie: ${savings}%`);
  })
  .catch(err => console.error('❌ Erreur:', err));
EOF

# Exécuter la conversion
node convert-to-webp.js
```

## Vérification Post-Conversion

### 1. Vérifier que le fichier existe
```bash
ls -lh frontend/public/images/api-coding.webp
# Attendu: ~80 KB
```

### 2. Tester dans le navigateur
```bash
cd frontend/public
python -m http.server 8000
# Ouvrir: http://localhost:8000
# Vérifier: DevTools → Network → L'image api-coding.webp est chargée
```

### 3. Mesurer l'impact avec Lighthouse
```bash
# Avant conversion (GIF 341 KB)
# LCP: ~3.5s
# Performance: ~75

# Après conversion (WebP 80 KB)
# LCP: ~2.2s (-37%)
# Performance: ~85 (+10 points)
```

## HTML Déjà Mis à Jour

Le fichier `index.html` a déjà été modifié pour utiliser le format WebP avec fallback:

```html
<picture>
    <source srcset="images/api-coding.webp" type="image/webp">
    <img src="images/api-coding.gif"
         alt="Ingénieure DevOps spécialisée en développement d'API et programmation cloud"
         loading="lazy"
         width="600"
         height="400">
</picture>
```

**Fonctionnement**:
- Les navigateurs modernes (Chrome, Firefox, Safari, Edge) chargeront automatiquement le WebP (~80 KB)
- Les anciens navigateurs utiliseront le fallback GIF (341 KB)
- `loading="lazy"` retarde le chargement jusqu'à ce que l'image soit visible
- `width` et `height` préviennent les Layout Shifts (CLS)

## Prochaines Étapes

Une fois la conversion terminée:
1. ✅ Placer `api-coding.webp` dans `frontend/public/images/`
2. 🧪 Tester le site localement
3. 🚀 Commit et deploy
4. 📊 Relancer Lighthouse pour vérifier l'amélioration

## Résultat Attendu

| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| **Taille image** | 341 KB | 80 KB | -76% |
| **LCP** | 3.5s | 2.2s | -37% |
| **Performance** | 75 | 85 | +10 pts |
| **Page Weight** | 430 KB | 200 KB | -53% |
