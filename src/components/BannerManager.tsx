import React, { useEffect } from 'react';
import { useBanners } from '../hooks/useBanners';
import BannerPopup from './BannerPopup';

const BannerManager: React.FC = () => {
  const {
    filteredBanners,
    availableBanners,
    allBannersClosed,
    handleBannerClose,
    handleBannerClick,
    handleBannerView,
    showBannersAgain
  } = useBanners();

  // Enregistrer la vue de la première bannière visible
  useEffect(() => {
    if (filteredBanners.length > 0) {
      handleBannerView(filteredBanners[0].id);
    }
  }, [filteredBanners, handleBannerView]);

  // Ne pas afficher s'il n'y a aucune bannière disponible
  if (availableBanners.length === 0) {
    return null;
  }

  return (
    <BannerPopup
      banners={availableBanners}
      filteredBanners={filteredBanners}
      allBannersClosed={allBannersClosed}
      onClose={handleBannerClose}
      onBannerClick={handleBannerClick}
      onShowBannersAgain={showBannersAgain}
    />
  );
};

export default BannerManager;
