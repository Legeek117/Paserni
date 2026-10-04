#!/usr/bin/env node

// Script de validation finale pour la configuration SPA Netlify
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 VALIDATION FINALE - Configuration SPA Netlify\n');

let allTestsPassed = true;

// 1. Vérification de la configuration Vite
console.log('⚙️ 1. Configuration Vite:');
const viteConfigPath = path.join(__dirname, 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  const hasCorrectBase = viteConfig.includes("base: '/'");
  const hasDistOutput = viteConfig.includes("outDir: 'dist'");
  
  console.log(`   ${hasCorrectBase ? '✅' : '❌'} Base path: / (absolu)`);
  console.log(`   ${hasDistOutput ? '✅' : '❌'} Dossier de sortie: dist`);
  
  if (!hasCorrectBase) {
    allTestsPassed = false;
    console.log('   ⚠️  PROBLÈME: Base path doit être "/" pour Netlify');
  }
} else {
  console.log('   ❌ Fichier vite.config.ts non trouvé');
  allTestsPassed = false;
}

// 2. Vérification du routeur React
console.log('\n🛣️ 2. Routeur React:');
const mainTsxPath = path.join(__dirname, 'src', 'main.tsx');
if (fs.existsSync(mainTsxPath)) {
  const mainContent = fs.readFileSync(mainTsxPath, 'utf8');
  const usesBrowserRouter = mainContent.includes('BrowserRouter');
  const usesHashRouter = mainContent.includes('HashRouter');
  
  console.log(`   ${usesBrowserRouter ? '✅' : '❌'} BrowserRouter (mode history)`);
  console.log(`   ${!usesHashRouter ? '✅' : '❌'} Pas de HashRouter`);
  
  if (!usesBrowserRouter || usesHashRouter) {
    allTestsPassed = false;
    console.log('   ⚠️  PROBLÈME: Doit utiliser BrowserRouter pour SPA');
  }
} else {
  console.log('   ❌ Fichier src/main.tsx non trouvé');
  allTestsPassed = false;
}

// 3. Vérification des fichiers de redirection
console.log('\n📁 3. Fichiers de redirection:');
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');

// Vérifier _redirects dans dist/
const redirectsDistPath = path.join(distDir, '_redirects');
const redirectsExists = fs.existsSync(redirectsDistPath);
console.log(`   ${redirectsExists ? '✅' : '❌'} _redirects dans dist/`);

if (redirectsExists) {
  const redirectsContent = fs.readFileSync(redirectsDistPath, 'utf8');
  const hasSPARule = redirectsContent.includes('/*') && redirectsContent.includes('/index.html') && redirectsContent.includes('200');
  const hasCorrectFormat = redirectsContent.includes('/*    /index.html   200');
  
  console.log(`   ${hasSPARule ? '✅' : '❌'} Règle SPA présente`);
  console.log(`   ${hasCorrectFormat ? '✅' : '❌'} Format correct`);
  
  if (!hasSPARule || !hasCorrectFormat) {
    allTestsPassed = false;
    console.log('   ⚠️  PROBLÈME: Règle SPA manquante ou incorrecte');
  }
} else {
  allTestsPassed = false;
  console.log('   ⚠️  PROBLÈME: Fichier _redirects manquant dans dist/');
}

// Vérifier netlify.toml
const netlifyTomlPath = path.join(__dirname, 'netlify.toml');
const netlifyTomlExists = fs.existsSync(netlifyTomlPath);
console.log(`   ${netlifyTomlExists ? '✅' : '❌'} netlify.toml à la racine`);

if (netlifyTomlExists) {
  const netlifyContent = fs.readFileSync(netlifyTomlPath, 'utf8');
  const hasSPARule = netlifyContent.includes('from = "/*"') && netlifyContent.includes('to = "/index.html"') && netlifyContent.includes('status = 200');
  
  console.log(`   ${hasSPARule ? '✅' : '❌'} Règle SPA dans netlify.toml`);
  
  if (!hasSPARule) {
    allTestsPassed = false;
    console.log('   ⚠️  PROBLÈME: Règle SPA manquante dans netlify.toml');
  }
} else {
  allTestsPassed = false;
  console.log('   ⚠️  PROBLÈME: Fichier netlify.toml manquant');
}

// 4. Vérification du build
console.log('\n📦 4. Build de production:');
if (fs.existsSync(distDir)) {
  const distFiles = fs.readdirSync(distDir);
  const hasIndexHtml = distFiles.includes('index.html');
  const hasAssets = distFiles.includes('assets');
  const hasRedirects = distFiles.includes('_redirects');
  
  console.log(`   ${hasIndexHtml ? '✅' : '❌'} index.html présent`);
  console.log(`   ${hasAssets ? '✅' : '❌'} Dossier assets présent`);
  console.log(`   ${hasRedirects ? '✅' : '❌'} Fichier _redirects présent`);
  
  if (!hasIndexHtml || !hasAssets || !hasRedirects) {
    allTestsPassed = false;
    console.log('   ⚠️  PROBLÈME: Build incomplet');
  }
  
  // Vérifier le contenu de index.html
  if (hasIndexHtml) {
    const indexContent = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
    const hasReactRoot = indexContent.includes('id="root"');
    const hasScripts = indexContent.includes('<script');
    const hasCorrectPaths = indexContent.includes('/assets/');
    
    console.log(`   ${hasReactRoot ? '✅' : '❌'} Élément root React`);
    console.log(`   ${hasScripts ? '✅' : '❌'} Scripts présents`);
    console.log(`   ${hasCorrectPaths ? '✅' : '❌'} Chemins absolus (/assets/)`);
    
    if (!hasReactRoot || !hasScripts || !hasCorrectPaths) {
      allTestsPassed = false;
      console.log('   ⚠️  PROBLÈME: index.html mal formé');
    }
  }
} else {
  console.log('   ❌ Dossier dist/ non trouvé');
  allTestsPassed = false;
}

// 5. Résumé final
console.log('\n🎯 5. Résumé de la validation:');
if (allTestsPassed) {
  console.log('   ✅ TOUS LES TESTS RÉUSSIS');
  console.log('   🚀 Configuration SPA prête pour Netlify');
  console.log('\n📋 Prochaines étapes:');
  console.log('   1. Déployer le contenu de dist/ sur Netlify');
  console.log('   2. Tester les routes: /home, /departements, /services');
  console.log('   3. Tester le rafraîchissement sur chaque page');
  console.log('   4. Vérifier que les fichiers statiques se chargent');
} else {
  console.log('   ❌ CERTAINS TESTS ONT ÉCHOUÉ');
  console.log('   ⚠️  Corriger les problèmes avant le déploiement');
  console.log('\n🔧 Actions recommandées:');
  console.log('   1. Exécuter: npm run build:netlify');
  console.log('   2. Vérifier que dist/_redirects contient: /*    /index.html   200');
  console.log('   3. Vérifier que vite.config.ts a: base: "/"');
  console.log('   4. Relancer ce script de validation');
}

console.log('\n✨ Validation terminée!');


