# Script de déploiement pour Windows PowerShell
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("netlify", "lws", "both")]
    [string]$Target
)

Write-Host "🚀 Déploiement Espace Paserni" -ForegroundColor Green
Write-Host "Cible: $Target" -ForegroundColor Yellow

switch ($Target) {
    "netlify" {
        Write-Host "📦 Build pour Netlify..." -ForegroundColor Blue
        npm run build:netlify
        Write-Host "✅ Build Netlify terminé!" -ForegroundColor Green
        Write-Host "📁 Dossier de déploiement: dist/" -ForegroundColor Cyan
    }
    "lws" {
        Write-Host "📦 Build pour LWS..." -ForegroundColor Blue
        npm run build:lws
        Write-Host "✅ Build LWS terminé!" -ForegroundColor Green
        Write-Host "📁 Dossier de déploiement: dist/ (avec .htaccess)" -ForegroundColor Cyan
    }
    "both" {
        Write-Host "📦 Build pour Netlify..." -ForegroundColor Blue
        npm run build:netlify
        Write-Host "📦 Build pour LWS..." -ForegroundColor Blue
        npm run build:lws
        Write-Host "✅ Tous les builds terminés!" -ForegroundColor Green
    }
}

Write-Host "🎉 Déploiement prêt!" -ForegroundColor Green
Write-Host "📋 Consultez DEPLOYMENT-GUIDE.md pour les instructions détaillées" -ForegroundColor Yellow


