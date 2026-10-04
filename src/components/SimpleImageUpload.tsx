import React, { useState } from 'react';
import { Image as ImageIcon, ExternalLink, Check, X } from 'lucide-react';

interface SimpleImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

const SimpleImageUpload: React.FC<SimpleImageUploadProps> = ({
  value,
  onChange,
  onError,
  className = ''
}) => {
  const [imageUrl, setImageUrl] = useState(value || '');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const validateImageUrl = async (url: string): Promise<boolean> => {
    if (!url) return false;
    
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('content-type');
      return response.ok && contentType?.startsWith('image/') === true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = async (url: string) => {
    setImageUrl(url);
    onChange(url);
    
    if (url) {
      setLoading(true);
      const valid = await validateImageUrl(url);
      setIsValid(valid);
      setLoading(false);
      
      if (!valid) {
        onError?.('URL d\'image invalide ou inaccessible');
      }
    } else {
      setIsValid(null);
    }
  };

  const handleRemove = () => {
    setImageUrl('');
    onChange('');
    setIsValid(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Input URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL de l'image
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://exemple.com/image.jpg"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          {imageUrl && (
            <button
              onClick={handleRemove}
              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Supprimer l'image"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Validation Status */}
      {imageUrl && (
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Vérification...</span>
            </div>
          ) : isValid === true ? (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-4 h-4" />
              <span className="text-sm">Image valide</span>
            </div>
          ) : isValid === false ? (
            <div className="flex items-center gap-2 text-red-600">
              <X className="w-4 h-4" />
              <span className="text-sm">URL invalide</span>
            </div>
          ) : null}
        </div>
      )}

      {/* Preview */}
      {imageUrl && isValid && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Aperçu
          </label>
          <div className="relative">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
              onError={() => setIsValid(false)}
            />
            <div className="absolute top-2 right-2">
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/80 hover:bg-white text-gray-600 rounded-lg transition-colors"
                title="Ouvrir l'image"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Sources d'images recommandées :</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Unsplash</strong> : https://unsplash.com (images gratuites)</li>
          <li>• <strong>Pexels</strong> : https://pexels.com (images gratuites)</li>
          <li>• <strong>Pixabay</strong> : https://pixabay.com (images gratuites)</li>
          <li>• <strong>Vos propres images</strong> : Hébergées sur votre serveur</li>
        </ul>
        <p className="text-xs text-blue-600 mt-2">
          💡 <strong>Astuce</strong> : Utilisez des images de 1200x800px pour un meilleur rendu
        </p>
      </div>
    </div>
  );
};

export default SimpleImageUpload;
