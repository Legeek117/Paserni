/**
 * Utilitaires pour la gestion des images avec fallback
 */

/**
 * Génère des chemins de fallback pour une image
 * Essaie d'abord le nouveau chemin, puis l'ancien
 */
export const getImageWithFallback = (imageName: string): string[] => {
  const newPath = `/images-galeries/${imageName}`;
  const oldPath = `/galeries/${imageName}`;
  
  return [newPath, oldPath];
};

/**
 * Composant d'image avec fallback automatique
 */
export const createImageWithFallback = (imageName: string, alt: string, title: string) => {
  const fallbackPaths = getImageWithFallback(imageName);
  
  return {
    id: imageName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    src: fallbackPaths[0], // Nouveau chemin en priorité
    fallbackSrc: fallbackPaths[1], // Ancien chemin en fallback
    alt,
    title
  };
};

/**
 * Hook pour gérer le fallback d'image
 */
import { useState } from 'react';

export const useImageFallback = (src: string) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  
  const handleError = () => {
    if (!hasError) {
      // Si c'est le nouveau chemin, essayer l'ancien
      if (src.includes('/images-galeries/')) {
        const fallbackSrc = src.replace('/images-galeries/', '/galeries/');
        setCurrentSrc(fallbackSrc);
        setHasError(true);
      }
    }
  };
  
  return {
    src: currentSrc,
    onError: handleError
  };
};
