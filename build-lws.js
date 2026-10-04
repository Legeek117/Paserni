import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🔧 Configuration du build LWS...');

// Créer le dossier assets s'il n'existe pas
const assetsDir = join('dist', 'assets');
if (!existsSync(assetsDir)) {
    mkdirSync(assetsDir, { recursive: true });
}

// Copier les fichiers .htaccess
const filesToCopy = [
    { src: 'public/.htaccess', dest: 'dist/.htaccess' },
    { src: 'public/assets/.htaccess', dest: 'dist/assets/.htaccess' }
];

filesToCopy.forEach(({ src, dest }) => {
    try {
        copyFileSync(src, dest);
        console.log(`✅ Copié: ${src} → ${dest}`);
    } catch (error) {
        console.log(`⚠️  Impossible de copier ${src}: ${error.message}`);
    }
});

console.log('🎉 Build LWS configuré avec succès !');
