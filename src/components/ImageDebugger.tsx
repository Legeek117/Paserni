import React, { useState, useEffect } from 'react';

interface ImageDebuggerProps {
  imageSrc: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
}


    
    
    
    
    // Timeout pour détecter les images qui ne se chargent pas
    


const ImageDebugger: React.FC<ImageDebuggerProps> = ({ imageSrc, onLoad, onError }) => {
  const [debugInfo, setDebugInfo] = useState<string>('');
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setDebugInfo(`✅ Image chargée: ${imageSrc}`);
      onLoad?.();
    };
    img.onerror = (e) => {
      const error = `❌ Erreur de chargement: ${imageSrc}`;
      setDebugInfo(error);
      onError?.(error);
    };
    img.src = imageSrc;
    const timeout = setTimeout(() => {
      if (!img.complete) {
        const timeoutError = `⏰ Timeout: ${imageSrc}`;
        setDebugInfo(timeoutError);
        onError?.(timeoutError);
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [imageSrc, onLoad, onError]);
  return (
    <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
      {debugInfo}
    </div>
  );
};

export default ImageDebugger;
