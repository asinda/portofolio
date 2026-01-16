# Script PowerShell pour corriger l'encodage et supprimer les $$ problématiques

$inputFile = "C:\Users\ASINDAYIGAYA\Documents\projet\portofolio\backend\database\insert-new-tutorials.sql"
$outputFile = "C:\Users\ASINDAYIGAYA\Documents\projet\portofolio\backend\database\insert-new-tutorials-fixed.sql"

# Lire le fichier avec l'encodage UTF-8
$content = Get-Content -Path $inputFile -Raw -Encoding UTF8

# Remplacer les $$ problématiques dans le contenu markdown par du texte
$content = $content -replace '- Erreurs production : -80%\$\$,', '- Erreurs production réduites de 80%$$,'
$content = $content -replace 'zéro maintenance\$\$,', 'zéro maintenance$$,'
$content = $content -replace 'cloud tombe\$\$,', 'cloud tombe$$,'
$content = $content -replace 'pas les autres\$\$,', 'pas les autres$$,'
$content = $content -replace 'coûts optimisés\$\$,', 'coûts optimisés$$,'
$content = $content -replace 'Versioning charts\$\$,', 'Versioning charts$$,'
$content = $content -replace 'Résilience\+\+\$\$,', 'Résilience améliorée$$,'
$content = $content -replace 'attaque réduite\$\$,', 'attaque réduite$$,'
$content = $content -replace 'intégration locaux\$\$,', 'intégration locaux$$,'
$content = $content -replace 'Conformité sécurité\$\$,', 'Conformité sécurité$$,'
$content = $content -replace 'Logs centralisés\$\$,', 'Logs centralisés$$,'

# Écrire le fichier corrigé
$content | Out-File -FilePath $outputFile -Encoding UTF8 -NoNewline

Write-Host "Fichier corrigé créé : $outputFile"
