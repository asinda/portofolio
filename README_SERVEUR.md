# 🚀 Guide de Démarrage du Serveur Local

## Méthode Rapide (Recommandée)

Double-cliquez sur **`DEMARRER_SERVEUR.bat`** dans le dossier `frontend/public/`

Le script détectera automatiquement Python, Node.js ou PHP et démarrera le serveur.

---

## Méthodes Manuelles

### Option 1: Python (Le plus simple)

```bash
cd frontend/public
python -m http.server 8000
```

Puis ouvrez: **http://localhost:8000**

### Option 2: Node.js

```bash
cd frontend/public
npx http-server -p 8000
```

Puis ouvrez: **http://localhost:8000**

### Option 3: PHP

```bash
cd frontend/public
php -S localhost:8000
```

Puis ouvrez: **http://localhost:8000**

### Option 4: VSCode Live Server

1. Installez l'extension "Live Server" dans VSCode
2. Clic-droit sur `index.html` → "Open with Live Server"

---

## 🐛 Dépannage

### Python n'est pas reconnu

**Solution:** Ajoutez Python au PATH

1. Trouvez où Python est installé:
   ```bash
   where python
   ```

2. Si rien n'apparaît, installez Python:
   - Téléchargez: https://www.python.org/downloads/
   - **COCHEZ "Add Python to PATH"** pendant l'installation
   - Redémarrez votre terminal

3. Si Python est installé mais pas dans PATH:
   - Recherchez "Variables d'environnement" dans Windows
   - Ajoutez le chemin Python (ex: `C:\Python311`) à la variable PATH

### Node.js/npx n'est pas reconnu

**Solution:** Installez Node.js

1. Téléchargez: https://nodejs.org/
2. Installez avec les options par défaut
3. Redémarrez votre terminal

### Le port 8000 est déjà utilisé

**Solution:** Utilisez un autre port

```bash
# Python
python -m http.server 3000

# Node.js
npx http-server -p 3000

# PHP
php -S localhost:3000
```

Puis ouvrez: **http://localhost:3000**

---

## ❓ Pourquoi ai-je besoin d'un serveur local?

Certaines fonctionnalités avancées du portfolio nécessitent un serveur HTTP pour fonctionner correctement:

- ✅ **Variantes Hero Canvas** (Matrix Rain, Grid 3D, Gradient Mesh)
- ✅ **Chargement dynamique des modules ES6**
- ✅ **Fetch API** pour charger les données JSON
- ✅ **CORS** pour les requêtes cross-origin

Sans serveur, vous pouvez ouvrir `index.html` directement, mais certaines fonctionnalités seront limitées.

---

## 📦 Fichiers de Démarrage Disponibles

- **`DEMARRER_SERVEUR.bat`** - Script intelligent (essaie Python → Node.js → PHP)
- **`OUVRIR_PORTFOLIO.bat`** - Ouverture directe (pas de serveur, fonctionnalités limitées)

---

## ✅ Vérification

Une fois le serveur démarré, vous devriez voir:

```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

Ouvrez **http://localhost:8000** dans votre navigateur.

Si tout fonctionne:
- ✅ Portfolio s'affiche
- ✅ Toggle light/dark fonctionne
- ✅ Variantes hero chargent correctement
- ✅ Animations scroll fluides
- ✅ Micro-interactions actives

---

## 🆘 Besoin d'Aide?

Si aucune méthode ne fonctionne:

1. Vérifiez que vous êtes dans le bon dossier: `frontend/public/`
2. Essayez de redémarrer votre terminal en mode Administrateur
3. Vérifiez votre firewall/antivirus (peut bloquer le port 8000)
4. Utilisez l'extension VSCode "Live Server" comme alternative

---

**Portfolio Alice Sindayigaya - Design Tech Futuriste 2025** 🚀
