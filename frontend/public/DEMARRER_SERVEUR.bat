@echo off
chcp 65001 >nul
echo ============================================
echo   PORTFOLIO ALICE SINDAYIGAYA - 2025
echo   Démarrage du serveur local Node.js
echo ============================================
echo.

REM Aller dans le répertoire du portfolio
cd /d "%~dp0"

echo [1/4] Vérification de Node.js...
where node >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Node.js trouvé! Démarrage du serveur sur http://localhost:8000
    echo.
    echo 📌 IMPORTANT: Ne fermez pas cette fenêtre!
    echo 📌 Pour arrêter le serveur: Ctrl+C
    echo.
    echo Ouverture automatique du navigateur...
    echo.
    timeout /t 2 /nobreak >nul
    start "" "http://localhost:8000"
    npx -y http-server -p 8000 -o
    goto :end
)

echo ❌ Node.js non trouvé.
echo.

echo [2/4] Vérification de Python...
where python >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Python trouvé! Démarrage du serveur sur http://localhost:8000
    echo.
    echo 📌 IMPORTANT: Ne fermez pas cette fenêtre!
    echo 📌 Pour arrêter le serveur: Ctrl+C
    echo.
    echo Ouvrez votre navigateur sur: http://localhost:8000
    echo.
    start "" "http://localhost:8000"
    python -m http.server 8000
    goto :end
)

echo ❌ Python non trouvé.
echo.

echo [2/4] Vérification de Node.js/npx...
where npx >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Node.js trouvé! Démarrage du serveur sur http://localhost:8000
    echo.
    echo 📌 IMPORTANT: Ne fermez pas cette fenêtre!
    echo 📌 Pour arrêter le serveur: Ctrl+C
    echo.
    echo Ouvrez votre navigateur sur: http://localhost:8000
    echo.
    start "" "http://localhost:8000"
    npx http-server -p 8000
    goto :end
)

echo ❌ Node.js/npx non trouvé.
echo.

echo [3/4] Vérification de PHP...
where php >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ PHP trouvé! Démarrage du serveur sur http://localhost:8000
    echo.
    echo 📌 IMPORTANT: Ne fermez pas cette fenêtre!
    echo 📌 Pour arrêter le serveur: Ctrl+C
    echo.
    echo Ouvrez votre navigateur sur: http://localhost:8000
    echo.
    start "" "http://localhost:8000"
    php -S localhost:8000
    goto :end
)

echo ❌ PHP non trouvé.
echo.

echo [4/4] Aucun serveur local détecté sur votre système.
echo.
echo ============================================
echo   SOLUTIONS DISPONIBLES
echo ============================================
echo.
echo Option A - Installer Python (RECOMMANDÉ):
echo   1. Téléchargez: https://www.python.org/downloads/
echo   2. Cochez "Add Python to PATH" pendant l'installation
echo   3. Redémarrez ce script
echo.
echo Option B - Installer Node.js:
echo   1. Téléchargez: https://nodejs.org/
echo   2. Installez avec les options par défaut
echo   3. Redémarrez ce script
echo.
echo Option C - Utiliser l'extension VSCode:
echo   1. Installez "Live Server" dans VSCode
echo   2. Clic-droit sur index.html → "Open with Live Server"
echo.
echo Option D - Ouverture directe (LIMITÉ):
echo   Appuyez sur une touche pour ouvrir index.html directement
echo   ⚠️ Les variantes Hero Canvas peuvent ne pas fonctionner
echo.
pause
start "" "%~dp0index.html"

:end
pause
