# Guide de Création - Image Open Graph (OG)

## Objectif
Créer une image 1200x630 px pour améliorer le partage sur les réseaux sociaux (LinkedIn, Twitter, Facebook).

## Spécifications Techniques

### Dimensions
- **Largeur**: 1200 px
- **Hauteur**: 630 px
- **Ratio**: 1.91:1 (format recommandé par Open Graph)
- **Poids max**: 300 KB (idéalement < 200 KB)
- **Format**: JPG (meilleure compression que PNG)

### Contenu Requis
1. **Nom**: Alice Sindayigaya
2. **Titre**: Ingénieure DevOps & Cloud Engineer
3. **Sous-titre**: Kubernetes • AWS • GCP • Terraform • CI/CD
4. **Logo/Photo**: Photo professionnelle ou avatar
5. **Fond**: Dégradé avec les couleurs du site

## Option 1: Canva (Recommandé - Gratuit)

### Étapes

1. **Ouvrir Canva**: https://www.canva.com

2. **Créer un design personnalisé**:
   - Cliquer sur "Créer un design"
   - Sélectionner "Taille personnalisée"
   - Entrer: 1200 x 630 px
   - Cliquer sur "Créer"

3. **Configurer le fond**:
   ```
   Option A: Dégradé (Recommandé)
   - Couleur 1: #1a2332 (bleu foncé du site)
   - Couleur 2: #2c3e50 (bleu moyen)
   - Direction: Diagonale (45°)

   Option B: Image de fond
   - Utiliser une image tech (code, serveurs, cloud)
   - Appliquer un overlay semi-transparent #1a2332 (opacité 85%)
   ```

4. **Ajouter les éléments textuels**:

   **Nom (Titre principal)**:
   - Texte: "Alice Sindayigaya"
   - Police: Inter ou Space Grotesk (Bold)
   - Taille: 72 px
   - Couleur: #ffffff (blanc)
   - Position: Centre-haut (y=150)

   **Titre professionnel**:
   - Texte: "Ingénieure DevOps & Cloud Engineer"
   - Police: Inter (SemiBold)
   - Taille: 42 px
   - Couleur: #00a3ff (bleu primaire du site)
   - Position: Sous le nom (y=240)

   **Technologies**:
   - Texte: "Kubernetes • AWS • GCP • Terraform • Ansible • CI/CD"
   - Police: Inter (Regular)
   - Taille: 28 px
   - Couleur: #8a94a0 (gris clair)
   - Position: Sous le titre (y=310)

5. **Ajouter la photo (optionnel)**:
   - Uploader votre photo LinkedIn
   - Forme: Cercle (diamètre 200 px)
   - Position: Coin supérieur droit (x=950, y=100)
   - Bordure: 5 px, couleur #00a3ff

6. **Ajouter des icônes décoratives (optionnel)**:
   - Icônes: Cloud, Docker, Kubernetes (depuis Canva Elements)
   - Taille: 60-80 px
   - Opacité: 15-20%
   - Position: Coins et espaces vides

7. **Télécharger**:
   - Cliquer sur "Partager" → "Télécharger"
   - Format: JPG
   - Qualité: Standard (pour poids < 200 KB)
   - Cliquer sur "Télécharger"

8. **Renommer et placer**:
   ```bash
   # Renommer le fichier
   mv ~/Downloads/Alice-Sindayigaya-OG.jpg frontend/public/images/og-image.jpg

   # Vérifier la taille
   ls -lh frontend/public/images/og-image.jpg
   # Attendu: < 300 KB
   ```

## Option 2: Figma (Gratuit)

1. Créer un Frame 1200x630 px
2. Suivre les mêmes étapes de design que Canva
3. Exporter en JPG (Quality 80%)

## Option 3: Photoshop/GIMP

1. Nouveau document: 1200x630 px, 72 DPI
2. Ajouter dégradé de fond
3. Ajouter textes avec les polices du site
4. Exporter: Fichier → Exporter → JPG (Qualité 8-9/12)

## Template de Design (Description visuelle)

```
┌─────────────────────────────────────────────────────────────┐
│                                                    [Photo]    │
│                                                    circulaire │
│                   Alice Sindayigaya                 200px    │
│                   ═══════════════════                        │
│                                                              │
│           Ingénieure DevOps & Cloud Engineer                │
│                                                              │
│     Kubernetes • AWS • GCP • Terraform • Ansible • CI/CD    │
│                                                              │
│                                                              │
│    [Icône]                                      [Icône]      │
│    Docker                                       K8s          │
│    (opacité 15%)                               (opacité 15%) │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Dégradé: #1a2332 → #2c3e50 (diagonal)
```

## Vérification Post-Création

### 1. Vérifier les dimensions
```bash
# Avec ImageMagick
identify frontend/public/images/og-image.jpg
# Attendu: og-image.jpg JPEG 1200x630 ...

# Avec Node.js
node -e "const sharp=require('sharp'); sharp('frontend/public/images/og-image.jpg').metadata().then(m=>console.log(m.width+'x'+m.height))"
```

### 2. Vérifier le poids
```bash
ls -lh frontend/public/images/og-image.jpg
# Attendu: < 300 KB (idéalement < 200 KB)
```

### 3. Tester avec validateurs OG
- https://www.opengraph.xyz/
- https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

## HTML Déjà Configuré

Le fichier `index.html` contient déjà la balise Open Graph:

```html
<meta property="og:image" content="https://asinda.github.io/portofolio/images/og-image.jpg">
<meta name="twitter:image" content="https://asinda.github.io/portofolio/images/og-image.jpg">
```

Une fois l'image créée et placée dans `frontend/public/images/og-image.jpg`, elle sera automatiquement utilisée lors des partages sociaux.

## Palette de Couleurs du Site (Référence)

```css
--primary: #00a3ff;       /* Bleu primaire */
--accent: #ff6b35;        /* Orange accent */
--background: #1a2332;    /* Fond principal */
--surface: #2c3e50;       /* Surface secondaire */
--text-primary: #e8eaed;  /* Texte principal (blanc) */
--text-secondary: #c1c7cd; /* Texte secondaire */
--text-tertiary: #8a94a0;  /* Texte tertiaire (gris) */
```

## Exemples d'Inspiration

Voici des URLs d'exemples d'images OG réussies pour portfolios DevOps:
- Minimaliste avec dégradé + nom + titre
- Tech avec icônes cloud en arrière-plan
- Professionnel avec photo circulaire + technologies

## Résultat Attendu

Une fois l'image créée et déployée:
- ✅ Prévisualisation riche sur LinkedIn lors du partage
- ✅ Twitter Card avec image
- ✅ Aperçu Facebook attrayant
- ✅ SEO amélioré (Score Lighthouse SEO +2-3 points)

## Checklist Finale

- [ ] Image créée avec dimensions 1200x630 px
- [ ] Format JPG avec poids < 300 KB
- [ ] Contient nom, titre, et technologies
- [ ] Utilise les couleurs du site (#1a2332, #00a3ff)
- [ ] Placée dans `frontend/public/images/og-image.jpg`
- [ ] Testée avec OpenGraph.xyz
- [ ] Prévisualisation LinkedIn validée
- [ ] Déployée sur GitHub Pages
