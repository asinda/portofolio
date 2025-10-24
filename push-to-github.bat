@echo off
echo ====================================
echo Push vers GitHub
echo ====================================
echo.

echo 1. Ajout des fichiers au staging...
git add .

echo.
echo 2. Verification du statut...
git status

echo.
echo 3. Creation du commit...
git commit -m "feat: Ajout du portfolio complet avec administration Supabase

- Frontend moderne et responsive avec mode sombre/clair
- Systeme d'administration complet dans /admin/
- Integration Supabase (PostgreSQL, Auth, Storage)
- Gestion CRUD pour toutes les sections
- Upload de medias (images)
- Documentation complete (5 guides)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

echo.
echo 4. Push vers GitHub (branche dev)...
git push origin dev

echo.
echo ====================================
echo Push termine !
echo ====================================
echo.
echo Votre portfolio est maintenant sur GitHub :
echo https://github.com/asinda/portofolio
echo.
pause
