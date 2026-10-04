import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Check } from 'lucide-react';
import { imageUploadService, UploadResult } from '../services/imageUploadService';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onError?: (error: string) => void;
  className?: string;
  maxWidth?: number;
  maxHeight?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onError,
  className = '',
  maxWidth = 1200,
  maxHeight = 800
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus('uploading');

    try {
      // Redimensionner l'image si nécessaire
      const resizedFile = await imageUploadService.resizeImage(file, maxWidth, maxHeight);
      
      // Upload vers Supabase Storage
      const result: UploadResult = await imageUploadService.uploadImage(resizedFile);
      
      if (result.success && result.url) {
        setPreview(result.url);
        onChange(result.url);
        setUploadStatus('success');
        
        // Reset status après 2 secondes
        setTimeout(() => setUploadStatus('idle'), 2000);
      } else {
        setUploadStatus('error');
        onError?.(result.error || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      setUploadStatus('error');
      onError?.(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zone d'upload */}
      <div
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-200
          ${preview 
            ? 'border-green-300 bg-green-50' 
            : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
          }
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">Image sélectionnée</p>
              <button
                onClick={handleClick}
                className="mt-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Changer l'image
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {uploading ? (
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
              ) : (
                <ImageIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-700">
                {uploading ? 'Upload en cours...' : 'Cliquez pour sélectionner une image'}
              </p>
              <p className="text-sm text-gray-500">
                Formats acceptés: JPEG, PNG, WebP (max 5MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Status indicators */}
      {uploadStatus === 'success' && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <Check className="w-4 h-4" />
          <span>Image uploadée avec succès</span>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <X className="w-4 h-4" />
          <span>Erreur lors de l'upload</span>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Conseils pour une meilleure image :</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Utilisez des images de haute qualité (1200x800px recommandé)</li>
          <li>• Évitez les textes sur l'image (ils seront ajoutés séparément)</li>
          <li>• Choisissez des couleurs qui contrastent avec votre texte</li>
          <li>• L'image sera automatiquement redimensionnée si nécessaire</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUpload;
