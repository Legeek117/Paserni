import React, { useState, useEffect } from 'react';
import { validateImageUrl, generateImageCandidates } from '../utils/imageUtils';

interface ImageWithFallbackProps {
  src: string;
  fallback?: string;
  alt: string;
  className?: string;
  candidates?: string[];
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  fallback = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', 
  alt, 
  className = '',
  candidates 
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    
    const tryImages = async () => {
      setIsLoading(true);
      
      // Utiliser les candidats fournis ou générer automatiquement
      const imageCandidates = candidates || generateImageCandidates(src);
      
      // Essayer chaque candidat dans l'ordre
      for (const candidate of imageCandidates) {
        if (cancelled) break;
        
        const isValid = await validateImageUrl(candidate);
        if (isValid) {
          if (!cancelled) {
            setCurrentSrc(candidate);
            setIsLoading(false);
          }
          return;
        }
      }
      
      // Si aucun candidat ne fonctionne, utiliser le fallback
      if (!cancelled) {
        setCurrentSrc(fallback);
        setIsLoading(false);
      }
    };

    tryImages();
    
    return () => {
      cancelled = true;
    };
  }, [src, fallback, candidates]);

  if (isLoading) {
    return (
      <div className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-sm">Chargement...</div>
      </div>
    );
  }

  if (!currentSrc) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-sm">Image non disponible</div>
      </div>
    );
  }

  return (
    <img 
      src={currentSrc} 
      alt={alt} 
      className={className}
      onError={() => {
        if (currentSrc !== fallback) {
          setCurrentSrc(fallback);
        }
      }}
    />
  );
};

export default ImageWithFallback;
