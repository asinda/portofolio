@echo off
chcp 65001 >nul
cls
echo ============================================
echo   🚀 PORTFOLIO ALICE SINDAYIGAYA - 2025
echo   Design Tech Futuriste Professionnel
echo ============================================
echo.
echo Démarrage du serveur sur http://localhost:8000
echo.
echo 📌 NE FERMEZ PAS CETTE FENÊTRE pendant l'utilisation
echo 📌 Pour arrêter: Ctrl+C ou fermer cette fenêtre
echo.
echo ============================================

cd /d "%~dp0"

REM Attendre 2 secondes puis ouvrir le navigateur
timeout /t 2 /nobreak >nul
start "" "http://localhost:8000"

REM Démarrer le serveur Node.js
npx -y http-server -p 8000 -c-1

pause
