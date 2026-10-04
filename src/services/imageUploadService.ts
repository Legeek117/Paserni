import { supabase } from '../lib/supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

class ImageUploadService {
  private static instance: ImageUploadService;
  private readonly BUCKET_NAME = 'banner-images';
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  static getInstance(): ImageUploadService {
    if (!ImageUploadService.instance) {
      ImageUploadService.instance = new ImageUploadService();
    }
    return ImageUploadService.instance;
  }

  /**
   * Vérifie si le bucket existe en essayant d'y accéder directement
   */
  private async ensureBucketExists(): Promise<boolean> {
    try {
      // Essayer directement d'accéder au bucket en listant ses objets
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list('', { limit: 1 });
      
      // Si on peut lister (même si vide), le bucket existe
      if (error && error.message.includes('Bucket not found')) {
        // Le bucket n'existe pas
        return false;
      }
      
      // Si il y a une autre erreur (permissions, etc.), on assume que le bucket existe
      return true;
    } catch (error) {
      // Erreur lors de la vérification du bucket
      // En cas d'erreur, on essaie quand même l'upload
      return true;
    }
  }

  /**
   * Valide le fichier avant upload
   */
  private validateFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'Aucun fichier sélectionné' };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: `Le fichier est trop volumineux. Taille maximale: ${this.MAX_FILE_SIZE / 1024 / 1024}MB` };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: 'Type de fichier non autorisé. Formats acceptés: JPEG, PNG, WebP' };
    }

    return { valid: true };
  }

  /**
   * Génère un nom de fichier unique
   */
  private generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    return `banner_${timestamp}_${random}.${extension}`;
  }

  /**
   * Upload une image vers Supabase Storage
   */
  async uploadImage(file: File, folder: string = 'banners'): Promise<UploadResult> {
    try {
      // Valider le fichier
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Générer le nom de fichier unique
      const fileName = this.generateFileName(file.name);
      const filePath = `${folder}/${fileName}`;

      // Upload du fichier
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        // Erreur lors de l'upload
        return { success: false, error: error.message };
      }

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      return {
        success: true,
        url: urlData.publicUrl
      };
    } catch (error) {
      // Erreur lors de l'upload
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      };
    }
  }

  /**
   * Supprime une image du storage
   */
  async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      // Extraire le nom du fichier de l'URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const folder = urlParts[urlParts.length - 2];
      const filePath = `${folder}/${fileName}`;

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        // Erreur lors de la suppression
        return false;
      }

      return true;
    } catch (error) {
      // Erreur lors de la suppression
      return false;
    }
  }

  /**
   * Liste les images disponibles
   */
  async listImages(folder: string = 'banners'): Promise<{ name: string; url: string }[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(folder);

      if (error) {
        // Erreur lors de la liste des images
        return [];
      }

      return data.map(file => ({
        name: file.name,
        url: supabase.storage.from(this.BUCKET_NAME).getPublicUrl(`${folder}/${file.name}`).data.publicUrl
      }));
    } catch (error) {
      // Erreur lors de la liste des images
      return [];
    }
  }

  /**
   * Redimensionne une image côté client (optionnel)
   */
  async resizeImage(file: File, maxWidth: number = 1200, maxHeight: number = 800): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculer les nouvelles dimensions
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        // Redimensionner
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir en blob
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, { type: file.type });
            resolve(resizedFile);
          } else {
            reject(new Error('Erreur lors du redimensionnement'));
          }
        }, file.type, 0.9);
      };

      img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
      img.src = URL.createObjectURL(file);
    });
  }
}

export const imageUploadService = ImageUploadService.getInstance();
export default imageUploadService;
