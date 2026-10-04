#!/usr/bin/env node

// Script de diagnostic complet pour Netlify SPA
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 DIAGNOSTIC NETLIFY SPA - Espace Paserni\n');

// 1. Vérification de l'emplacement des fichiers de redirection
console.log('📁 1. Vérification des fichiers de redirection:');
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');

const filesToCheck = [
  { name: '_redirects', dir: 'dist', required: true },
  { name: 'netlify.toml', dir: 'root', required: true },
  { name: 'index.html', dir: 'dist', required: true },
  { name: '_headers', dir: 'dist', required: false }
];

filesToCheck.forEach(file => {
  let filePath;
  if (file.dir === 'dist') {
    filePath = path.join(distDir, file.name);
  } else if (file.dir === 'public') {
    filePath = path.join(publicDir, file.name);
  } else {
    filePath = path.join(__dirname, file.name);
  }
  
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : (file.required ? '❌' : '⚠️');
  console.log(`   ${status} ${file.name} (${file.dir})`);
  
  if (exists && file.name === '_redirects') {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasSPARule = content.includes('/*') && content.includes('/index.html') && content.includes('200');
    console.log(`      ${hasSPARule ? '✅' : '❌'} Règle SPA présente`);
  }
});

// 2. Vérification de la configuration Vite
console.log('\n⚙️ 2. Vérification de la configuration Vite:');
const viteConfigPath = path.join(__dirname, 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  const hasCorrectBase = viteConfig.includes("base: '/'");
  const hasDistOutput = viteConfig.includes("outDir: 'dist'");
  
  console.log(`   ${hasCorrectBase ? '✅' : '❌'} Base path configuré correctement (/)`);
  console.log(`   ${hasDistOutput ? '✅' : '❌'} Dossier de sortie: dist`);
} else {
  console.log('   ❌ Fichier vite.config.ts non trouvé');
}

// 3. Vérification du routeur React
console.log('\n🛣️ 3. Vérification du routeur React:');
const mainTsxPath = path.join(__dirname, 'src', 'main.tsx');
if (fs.existsSync(mainTsxPath)) {
  const mainContent = fs.readFileSync(mainTsxPath, 'utf8');
  const usesBrowserRouter = mainContent.includes('BrowserRouter');
  const usesHashRouter = mainContent.includes('HashRouter');
  
  console.log(`   ${usesBrowserRouter ? '✅' : '❌'} Utilise BrowserRouter (mode history)`);
  console.log(`   ${!usesHashRouter ? '✅' : '❌'} N'utilise PAS HashRouter`);
} else {
  console.log('   ❌ Fichier src/main.tsx non trouvé');
}

// 4. Vérification des routes dans App.tsx
console.log('\n📋 4. Vérification des routes définies:');
const appTsxPath = path.join(__dirname, 'src', 'App.tsx');
if (fs.existsSync(appTsxPath)) {
  const appContent = fs.readFileSync(appTsxPath, 'utf8');
  const routeCount = (appContent.match(/<Route/g) || []).length;
  const hasRoutes = appContent.includes('<Routes>');
  
  console.log(`   ${hasRoutes ? '✅' : '❌'} Composant Routes présent`);
  console.log(`   📊 Nombre de routes: ${routeCount}`);
  
  // Extraire quelques routes importantes
  const routes = appContent.match(/path="[^"]+"/g) || [];
  const importantRoutes = routes.slice(0, 5).map(route => route.replace('path="', '').replace('"', ''));
  console.log(`   🔗 Exemples de routes: ${importantRoutes.join(', ')}`);
} else {
  console.log('   ❌ Fichier src/App.tsx non trouvé');
}

// 5. Vérification du contenu du build
console.log('\n📦 5. Vérification du contenu du build:');
if (fs.existsSync(distDir)) {
  const distFiles = fs.readdirSync(distDir);
  const hasIndexHtml = distFiles.includes('index.html');
  const hasAssets = distFiles.includes('assets');
  const hasRedirects = distFiles.includes('_redirects');
  
  console.log(`   ${hasIndexHtml ? '✅' : '❌'} index.html présent`);
  console.log(`   ${hasAssets ? '✅' : '❌'} Dossier assets présent`);
  console.log(`   ${hasRedirects ? '✅' : '❌'} Fichier _redirects présent`);
  
  if (hasIndexHtml) {
    const indexContent = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
    const hasReactRoot = indexContent.includes('id="root"');
    const hasScripts = indexContent.includes('<script');
    console.log(`   ${hasReactRoot ? '✅' : '❌'} Élément root React présent`);
    console.log(`   ${hasScripts ? '✅' : '❌'} Scripts présents`);
  }
} else {
  console.log('   ❌ Dossier dist/ non trouvé - Exécutez npm run build');
}

// 6. Recommandations
console.log('\n💡 6. Recommandations:');
console.log('   📋 Checklist de déploiement:');
console.log('   1. Exécuter: npm run build:netlify');
console.log('   2. Vérifier que dist/_redirects contient: /*    /index.html   200');
console.log('   3. Vérifier que netlify.toml est à la racine du projet');
console.log('   4. Déployer le contenu de dist/ sur Netlify');
console.log('   5. Tester les routes: /home, /departements, /services, etc.');
console.log('   6. Tester le rafraîchissement sur chaque route');

console.log('\n🎯 7. Tests à effectuer après déploiement:');
console.log('   • Navigation interne (clics sur les liens)');
console.log('   • Accès direct aux URLs (taper l\'URL dans le navigateur)');
console.log('   • Rafraîchissement (F5) sur chaque page');
console.log('   • Partage de liens directs');
console.log('   • Test des routes admin: /admin/*');

console.log('\n✨ Diagnostic terminé!');


