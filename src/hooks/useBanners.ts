import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useCountry } from '../contexts/CountryContext';
import { bannerService, Banner } from '../services/bannerService';

export const useBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [filteredBanners, setFilteredBanners] = useState<Banner[]>([]);
  const [availableBanners, setAvailableBanners] = useState<Banner[]>([]);
  const [closedBanners, setClosedBanners] = useState<Set<string>>(new Set());
  const [allBannersClosed, setAllBannersClosed] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const location = useLocation();
  const { selectedCountry } = useCountry();

  const loadBanners = useCallback(async (forceRefresh: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const allBanners = await bannerService.getBanners(forceRefresh);
      setBanners(allBanners);
      
      // Filtrer les bannières selon le contexte
      const filtered = bannerService.filterBannersForContext(
        allBanners,
        selectedCountry,
        location.pathname
      );
      
      // Vérifier s'il y a de nouvelles bannières depuis la dernière fermeture
      const currentBannerIds = allBanners.map(b => b.id).sort().join(',');
      const lastBannerIds = banners.map(b => b.id).sort().join(',');
      const hasNewBanners = forceRefresh && currentBannerIds !== lastBannerIds;
      
      // Si de nouvelles bannières sont détectées, réinitialiser l'état de fermeture
      if (hasNewBanners && allBannersClosed) {
        setAllBannersClosed(false);
        setClosedBanners(new Set());
      }
      
      // Bannières disponibles pour la navigation (toujours gardées)
      const navBanners = filtered.filter(banner => 
        bannerService.shouldShowBanner(banner)
      );
      
      // Filtrer les bannières qui doivent être affichées (vide si fermées)
      const visibleBanners = allBannersClosed ? [] : navBanners.filter(banner => 
        !closedBanners.has(banner.id)
      );

      
      setAvailableBanners(navBanners);
      setFilteredBanners(visibleBanners);
    } catch (err) {
      setError('Erreur lors du chargement des bannières');
    } finally {
      setLoading(false);
    }
  }, [selectedCountry, location.pathname, closedBanners, allBannersClosed]);

  useEffect(() => {
    loadBanners();
    
    // Refresh automatique toutes les 30 secondes pour détecter les nouvelles bannières
    const interval = setInterval(() => {
      loadBanners(true); // Force refresh
    }, 30000);
    
    return () => clearInterval(interval);
  }, [loadBanners]);

  const handleBannerClose = useCallback((bannerId: string) => {
    // Quand on clique sur la croix, fermer toutes les bannières
    setAllBannersClosed(true);
    setFilteredBanners([]);
  }, []);

  const handleBannerClick = useCallback(async (banner: Banner) => {
    try {
      await bannerService.recordBannerClick(banner.id);
    } catch (error) {
      // Erreur lors de l'enregistrement du clic
    }
  }, []);

  const handleBannerView = useCallback(async (bannerId: string) => {
    try {
      await bannerService.recordBannerView(bannerId);
    } catch (error) {
      // Erreur lors de l'enregistrement de la vue
    }
  }, []);

  const refreshBanners = useCallback(() => {
    loadBanners(true);
  }, [loadBanners]);

  const showBannersAgain = useCallback(() => {
    setAllBannersClosed(false);
  }, []);

  return {
    banners,
    filteredBanners,
    availableBanners,
    loading,
    error,
    allBannersClosed,
    handleBannerClose,
    handleBannerClick,
    handleBannerView,
    refreshBanners,
    showBannersAgain
  };
};
