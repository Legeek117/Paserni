#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧹 Nettoyage du cache Vite...');

// Supprimer le dossier node_modules/.vite
const viteCacheDir = path.join(__dirname, 'node_modules', '.vite');
if (fs.existsSync(viteCacheDir)) {
  fs.rmSync(viteCacheDir, { recursive: true, force: true });
  console.log('✅ Cache Vite supprimé');
}

// Supprimer le dossier dist
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
  console.log('✅ Dossier dist supprimé');
}

console.log('🎉 Nettoyage terminé !');
console.log('💡 Redémarrez le serveur avec: npm run dev');
