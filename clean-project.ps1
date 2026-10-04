# Script de nettoyage pour Les Ateliers PDG
# Utilisation: .\clean-project.ps1

Write-Host "🧹 Nettoyage du projet..." -ForegroundColor Yellow

# Arrêter tous les processus Node
Write-Host "Arrêt des processus Node..." -ForegroundColor Blue
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Supprimer les dossiers de cache
Write-Host "Suppression des caches..." -ForegroundColor Blue
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".vite" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue

# Nettoyer le cache npm
Write-Host "Nettoyage du cache npm..." -ForegroundColor Blue
npm cache clean --force

# Réinstaller les dépendances
Write-Host "Réinstallation des dépendances..." -ForegroundColor Blue
npm install

Write-Host "✅ Nettoyage terminé ! Vous pouvez maintenant lancer: npm run dev" -ForegroundColor Green
