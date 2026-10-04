import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: { src: string; alt: string }[];
  interval?: number;
}






const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, interval = 8000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Autoplay désactivé - navigation manuelle uniquement
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  //   }, interval);
  //   return () => clearInterval(timer);
  // }, [images.length, interval]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative w-full min-h-[60vh] h-[500px] sm:h-[550px] md:h-[600px] lg:h-[65vh] xl:h-[70vh] max-h-[700px] overflow-hidden rounded-xl bg-black">
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: index === currentIndex ? 1 : 0,
              scale: index === currentIndex ? 1 : 1.1,
            }}
            transition={{
              opacity: { duration: 1.2, ease: "easeInOut" },
              scale: { duration: 8, ease: "linear" }
            }}
            style={{
              zIndex: index === currentIndex ? 1 : 0
            }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transform-gpu"
              style={{
                WebkitBackfaceVisibility: "hidden",
                backfaceVisibility: "hidden"
              }}
            />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 pointer-events-none" />
      </div>
      {/* Indicateurs */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="group relative p-2"
            aria-label={`Image ${index + 1}`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  index === currentIndex 
                    ? 'bg-white scale-100 opacity-100' 
                    : 'bg-white/40 scale-75 opacity-60 group-hover:opacity-80 group-hover:scale-90'
                }`}
              />
            </div>
            <div
              className={`w-4 h-4 rounded-full transition-transform duration-500 ${
                index === currentIndex 
                  ? 'scale-100 border-2 border-white/30' 
                  : 'scale-0 border-2 border-transparent'
              }`}
            />
          </button>
        ))}
      </div>
      
      {/* Boutons de navigation pour les images */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 bg-black/80 hover:bg-black/95 text-white rounded-full shadow-2xl border border-white/30 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-2xl group opacity-80 hover:opacity-100"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-105 transition-transform" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 bg-black/80 hover:bg-black/95 text-white rounded-full shadow-2xl border border-white/30 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-2xl group opacity-80 hover:opacity-100"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-105 transition-transform" />
          </button>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
