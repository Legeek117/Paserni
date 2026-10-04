import { supabase } from '../lib/supabase';

export interface Banner {
  id: string;
  title: string;
  description?: string;
  image?: string;
  link?: string;
  link_text?: string;
  start_date?: string;
  end_date?: string;
  countries?: string[];
  pages?: string[];
  priority: number;
  is_active: boolean;
  background_color?: string;
  text_color?: string;
  position: 'top' | 'center' | 'bottom';
  size: 'small' | 'medium' | 'large';
  created_at: string;
  updated_at: string;
}

export interface BannerStats {
  bannerId: string;
  views: number;
  clicks: number;
  conversions: number;
}

class BannerService {
  private static instance: BannerService;
  private banners: Banner[] = [];
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 30 * 1000; // 30 secondes pour permettre un refresh plus rapide

  static getInstance(): BannerService {
    if (!BannerService.instance) {
      BannerService.instance = new BannerService();
    }
    return BannerService.instance;
  }

  /**
   * Récupère toutes les bannières depuis Supabase
   */
  async getBanners(forceRefresh: boolean = false): Promise<Banner[]> {
    const now = Date.now();
    
    if (!forceRefresh && this.banners.length > 0 && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.banners;
    }

    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('priority', { ascending: false });

      if (error) {
        return this.banners;
      }

      this.banners = data || [];
      this.lastFetch = now;
      return this.banners;
    } catch (error) {
      return this.banners;
    }
  }

  /**
   * Filtre les bannières selon le contexte actuel
   */
  filterBannersForContext(
    banners: Banner[], 
    currentCountry: string, 
    currentPage: string
  ): Banner[] {
    const now = new Date();
    
    return banners.filter(banner => {
      // Vérifier si la bannière est active
      if (!banner.is_active) {
        return false;
      }
      
      // Vérifier seulement la date de fin (les bannières s'affichent même avant la date de début)
      if (banner.end_date && new Date(banner.end_date) < now) {
        return false;
      }
      
      // ⭐ AFFICHAGE UNIQUEMENT SUR LA PAGE D'ACCUEIL
      if (currentPage !== '/home') {
        return false;
      }
      
      // Vérifier le pays - IMPORTANT: Si aucun pays spécifié, la bannière s'affiche partout
      if (banner.countries && banner.countries.length > 0) {
        if (!banner.countries.includes(currentCountry)) {
          return false;
        }
      }
      
      // Vérifier la page (optionnel maintenant que c'est limité à /home)
      if (banner.pages && banner.pages.length > 0) {
        if (!banner.pages.includes(currentPage)) {
          return false;
        }
      }
      
      return true;
    });
  }

  /**
   * Enregistre une vue de bannière
   */
  async recordBannerView(bannerId: string): Promise<void> {
    try {
      await supabase
        .from('banner_stats')
        .upsert({
          banner_id: bannerId,
          views: 1,
          clicks: 0,
          conversions: 0,
          date: new Date().toISOString().split('T')[0]
        }, {
          onConflict: 'banner_id,date',
          ignoreDuplicates: false
        });
    } catch (error) {
      // Erreur lors de l'enregistrement de la vue
    }
  }

  /**
   * Enregistre un clic sur une bannière
   */
  async recordBannerClick(bannerId: string): Promise<void> {
    try {
      await supabase
        .from('banner_stats')
        .upsert({
          banner_id: bannerId,
          views: 0,
          clicks: 1,
          conversions: 0,
          date: new Date().toISOString().split('T')[0]
        }, {
          onConflict: 'banner_id,date',
          ignoreDuplicates: false
        });
    } catch (error) {
      // Erreur lors de l'enregistrement du clic
    }
  }

  /**
   * Gère les cookies de bannière
   */
  private getBannerCookie(bannerId: string): boolean {
    const cookies = document.cookie.split(';');
    const bannerCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`banner_${bannerId}=`)
    );
    return bannerCookie ? bannerCookie.split('=')[1] === 'closed' : false;
  }

  private setBannerCookie(bannerId: string): void {
    // Utiliser sessionStorage pour que la bannière revienne au rechargement
    try {
      sessionStorage.setItem(`banner_${bannerId}_closed`, 'true');
      // Aussi en cookie temporaire pour la session actuelle
      document.cookie = `banner_${bannerId}=closed; path=/; max-age=${60 * 60}`; // 1 heure max
    } catch (error) {
      // Erreur lors de la sauvegarde de la fermeture
    }
  }

  /**
   * Vérifie si une bannière doit être affichée
   */
  shouldShowBanner(banner: Banner): boolean {
    // Vérifier seulement la date de fin (les bannières s'affichent même avant la date de début)
    const now = new Date();
    if (banner.end_date && new Date(banner.end_date) < now) return false;
    
    // La bannière s'affiche toujours au rechargement de page
    // Elle ne reste fermée que temporairement
    return true;
  }

  /**
   * Marque une bannière comme fermée
   */
  markBannerAsClosed(bannerId: string): void {
    this.setBannerCookie(bannerId);
  }

  /**
   * Invalide le cache des bannières
   */
  invalidateCache(): void {
    this.lastFetch = 0;
    this.banners = [];
  }

  /**
   * Crée une nouvelle bannière (admin)
   */
  async createBanner(bannerData: Omit<Banner, 'id' | 'created_at' | 'updated_at'>): Promise<Banner | null> {
    try {
      const { data, error } = await supabase
        .from('banners')
        .insert([bannerData])
        .select()
        .single();

      if (error) {
        // Erreur lors de la création de la bannière
        return null;
      }

      // Invalider complètement le cache pour forcer le refresh
      this.invalidateCache();
      return data;
    } catch (error) {
      // Erreur lors de la création de la bannière
      return null;
    }
  }

  /**
   * Met à jour une bannière (admin)
   */
  async updateBanner(bannerId: string, bannerData: Partial<Banner>): Promise<Banner | null> {
    try {
      const { data, error } = await supabase
        .from('banners')
        .update(bannerData)
        .eq('id', bannerId)
        .select()
        .single();

      if (error) {
        // Erreur lors de la mise à jour de la bannière
        return null;
      }

      // Invalider complètement le cache pour forcer le refresh
      this.invalidateCache();
      return data;
    } catch (error) {
      // Erreur lors de la mise à jour de la bannière
      return null;
    }
  }

  /**
   * Supprime une bannière (admin)
   */
  async deleteBanner(bannerId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', bannerId);

      if (error) {
        // Erreur lors de la suppression de la bannière
        return false;
      }

      // Invalider complètement le cache pour forcer le refresh
      this.invalidateCache();
      return true;
    } catch (error) {
      // Erreur lors de la suppression de la bannière
      return false;
    }
  }

  /**
   * Récupère les statistiques d'une bannière
   */
  async getBannerStats(bannerId: string): Promise<BannerStats | null> {
    try {
      const { data, error } = await supabase
        .from('banner_stats')
        .select('*')
        .eq('banner_id', bannerId);

      if (error) {
        // Erreur lors du chargement des statistiques
        return null;
      }

      if (!data || data.length === 0) {
        return { bannerId, views: 0, clicks: 0, conversions: 0 };
      }

      const stats = data.reduce((acc, stat) => ({
        bannerId,
        views: acc.views + (stat.views || 0),
        clicks: acc.clicks + (stat.clicks || 0),
        conversions: acc.conversions + (stat.conversions || 0)
      }), { bannerId, views: 0, clicks: 0, conversions: 0 });

      return stats;
    } catch (error) {
      // Erreur lors du chargement des statistiques
      return null;
    }
  }
}

export const bannerService = BannerService.getInstance();
export default bannerService;
