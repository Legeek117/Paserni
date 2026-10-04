/**
 * Utilitaires pour la gestion des images
 */

// Mapping des noms d'images avec leurs chemins corrects
export const IMAGE_PATHS = {
  // Galerie principale
  'puzzle-chien': '/images-galeries/puzzle-chien.jpg.jpg',
  'sac-amazone': '/images-galeries/sac-amazone.jpg.jpg',
  'cafebart-comptoir': '/images-galeries/cafebart-comptoir.jpg.jpg',
  'sac-guerriere': '/images-galeries/sac-guerriere.jpg.jpg',
  'terrasse-nuit': '/images-galeries/terasse-nuit.jpg.jpg',
  'masque-bleu': '/images-galeries/masque-bleu.jpg.jpg',
  'mur-bienvenue': '/images-galeries/mur-bienvenue.jpg.jpg',
  'pate-mais': '/images-galeries/pâte de maïs.jpg',
  
  // Logos
  'logo-1': '/logo 1.jpeg',
  'logo-2': '/logo2.jpeg',
  'logo-ep': '/LOGO EP insubation (1).jpg',
  
  // Départements PDG
  'pdg-building': '/images-galeries/PDG building.jpg.jpeg',
  'pdg-com-events': '/images-galeries/PDG COM & EVENTS.jpg',
  'pdg-digital': '/images-galeries/PDG Digital solutions.jpg.jpeg',
  'pdg-galerie': '/images-galeries/PDG galerie.jpg.jpeg',
  'pdg-learning': '/images-galeries/PDG learning.jpg.jpeg',
  'pdg-mobilier': '/images-galeries/PDG mobilier.jpg.jpeg',
  'pdg-projects': '/images-galeries/PDG projects.jpg.jpeg',
} as const;

/**
 * Récupère le chemin d'une image par son ID
 */
export const getImagePath = (imageId: keyof typeof IMAGE_PATHS): string => {
  return IMAGE_PATHS[imageId] || '';
};

/**
 * Valide qu'une image existe avant de l'afficher
 */
export const validateImageUrl = async (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

/**
 * Composant pour afficher une image avec fallback
 */
export interface ImageWithFallbackProps {
  src: string;
  fallback?: string;
  alt: string;
  className?: string;
}

/**
 * Nettoie les noms de fichiers encodés URL
 */
export const cleanImagePath = (path: string): string => {
  return decodeURIComponent(path)
    .replace(/\.jpg\.jpg$/, '.jpg')
    .replace(/\.jpeg\.jpeg$/, '.jpeg')
    .replace(/\s+/g, '-')
    .toLowerCase();
};

/**
 * Génère des chemins alternatifs pour une image
 */
export const generateImageCandidates = (basePath: string): string[] => {
  const candidates = [basePath];
  
  // Ajouter des variantes avec différentes extensions
  const withoutExt = basePath.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  candidates.push(
    `${withoutExt}.jpg`,
    `${withoutExt}.jpeg`,
    `${withoutExt}.png`,
    `${withoutExt}.webp`
  );
  
  // Ajouter des variantes avec nettoyage du nom
  const cleaned = cleanImagePath(basePath);
  if (cleaned !== basePath) {
    candidates.push(cleaned);
  }
  
  return [...new Set(candidates)]; // Supprimer les doublons
};
