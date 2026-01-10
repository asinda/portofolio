@echo off
echo ============================================
echo   PORTFOLIO ALICE SINDAYIGAYA - 2025
echo   Design Tech Futuriste Professionnel
echo ============================================
echo.
echo Ouverture du portfolio dans votre navigateur...
echo.

REM Ouvrir index.html dans le navigateur par défaut
start "" "%~dp0index.html"

echo.
echo ✅ Portfolio ouvert dans le navigateur!
echo.
echo REMARQUE: Certaines fonctionnalités avancees (variantes hero)
echo peuvent ne pas fonctionner sans serveur HTTP local.
echo.
echo Pour demarrer un serveur local, tapez:
echo   cd "%~dp0"
echo   python -m http.server 8000
echo.
pause
