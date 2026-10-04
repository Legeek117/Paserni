import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Calendar, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Banner {
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
}

interface BannerPopupProps {
  banners: Banner[];
  filteredBanners?: Banner[];
  allBannersClosed?: boolean;
  onClose: (bannerId: string) => void;
  onBannerClick: (banner: Banner) => void;
  onShowBannersAgain?: () => void;
}

const BannerPopup: React.FC<BannerPopupProps> = ({ 
  banners, 
  filteredBanners = [],
  allBannersClosed = false, 
  onClose, 
  onBannerClick, 
  onShowBannersAgain 
}) => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Utiliser les bannières passées en paramètre (déjà filtrées)
  const activeBanners = banners.sort((a, b) => b.priority - a.priority);
  const currentBanner = activeBanners[currentBannerIndex];

  // Déterminer si on doit afficher le popup
  const shouldShowPopup = filteredBanners.length > 0 && !allBannersClosed && currentBanner;

  useEffect(() => {
    setIsVisible(shouldShowPopup);
  }, [shouldShowPopup]);

  // Ne pas rendre le composant si aucune bannière disponible
  if (activeBanners.length === 0) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose(currentBanner.id);
  };

  const handleBannerClick = () => {
    onBannerClick(currentBanner);
    if (currentBanner.link) {
      window.open(currentBanner.link, '_blank', 'noopener,noreferrer');
    }
  };

  const nextBanner = () => {
    // Réafficher les bannières si elles étaient fermées
    if (allBannersClosed && onShowBannersAgain) {
      onShowBannersAgain();
    }
    setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const previousBanner = () => {
    // Réafficher les bannières si elles étaient fermées
    if (allBannersClosed && onShowBannersAgain) {
      onShowBannersAgain();
    }
    setCurrentBannerIndex((prev) => 
      prev === 0 ? activeBanners.length - 1 : prev - 1
    );
  };

  const getBannerSize = () => {
    switch (currentBanner.size) {
      case 'small': return 'max-w-sm';
      case 'large': return 'max-w-4xl';
      default: return 'max-w-2xl';
    }
  };

  const getBannerPosition = () => {
    switch (currentBanner.position) {
      case 'top': return 'top-4';
      case 'bottom': return 'bottom-4';
      default: return 'top-1/2 -translate-y-1/2';
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
          <>
            {/* Overlay avec animation améliorée */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
            {/* Backdrop avec blur progressif */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 0.6, backdropFilter: "blur(8px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/50 to-black/70"
              onClick={handleClose}
            />

            {/* Banner Content avec animations améliorées */}
            <motion.div
              key={currentBanner.id}
              initial={{ 
                scale: 0.7, 
                opacity: 0, 
                rotateX: -15,
                y: 50
              }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                rotateX: 0,
                y: 0
              }}
              exit={{ 
                scale: 0.8, 
                opacity: 0, 
                rotateX: 15,
                y: -30
              }}
              transition={{ 
                type: "spring", 
                duration: 0.6,
                bounce: 0.3,
                ease: [0.175, 0.885, 0.32, 1.115]
              }}
              className={`relative ${getBannerSize()} w-full bg-white rounded-3xl shadow-2xl overflow-hidden ${getBannerPosition()} transform-gpu`}
              style={{
                backgroundColor: currentBanner.background_color || '#ffffff',
                color: currentBanner.text_color || '#000000',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              }}
            >
            {/* Close Button avec animation */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.2 }}
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-110 backdrop-blur-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Banner Content avec animations */}
            <div className="relative">
              {currentBanner.image && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 overflow-hidden"
                  style={{ minHeight: '200px', maxHeight: '400px' }}
                >
                  <motion.img
                    src={currentBanner.image}
                    alt={currentBanner.title}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      img.style.display = 'none';
                    }}
                  />
                </motion.div>
              )}

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{currentBanner.title}</h3>
                    {currentBanner.description && (
                      <p className="text-gray-600 mb-4">{currentBanner.description}</p>
                    )}
                  </div>
                </div>

                {/* Banner Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  {currentBanner.start_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Début: {new Date(currentBanner.start_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {currentBanner.end_date && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Fin: {new Date(currentBanner.end_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {currentBanner.countries && currentBanner.countries.length > 0 && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{currentBanner.countries.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {currentBanner.link && (
                    <button
                      onClick={handleBannerClick}
                      className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
                    >
                      {currentBanner.link_text || 'En savoir plus'}
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Flèches de navigation - Toujours visibles si plus d'une bannière */}
            {activeBanners.length > 1 && (
              <>
                <button
                  onClick={previousBanner}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-2xl border-2 border-white/30 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-2xl group"
                  aria-label="Bannière précédente"
                  style={{ opacity: 1 }}
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-105 transition-transform" />
                </button>
                <button
                  onClick={nextBanner}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-2xl border-2 border-white/30 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-2xl group"
                  aria-label="Bannière suivante"
                  style={{ opacity: 1 }}
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-105 transition-transform" />
                </button>
              </>
            )}

            {/* Indicateurs de bannières (points) */}
            {activeBanners.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {activeBanners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBannerIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentBannerIndex 
                        ? 'bg-orange-600 scale-125' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Aller à la bannière ${index + 1}`}
                  />
                ))}
              </div>
            )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BannerPopup;
