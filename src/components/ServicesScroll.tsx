import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ServiceScrollItem {
  id: string;
  imageSrc: string;
  alt?: string;
  title?: string;
  href?: string;
  whatsappLink?: string;
}

export interface ServicesScrollProps {
  services: ServiceScrollItem[];
  className?: string;
  speedPxPerStep?: number;
}

const ServicesScroll: React.FC<ServicesScrollProps> = ({ services, className, speedPxPerStep = 1 }) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const animationRef = React.useRef<number | null>(null);
  const scrollPosition = React.useRef(0);
  
  // Dupliquer les services pour un défilement infini fluide
  const duplicatedServices = [...services, ...services];
  
  const animate = React.useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const itemWidth = 140 + 24; // min-width + gap
    const totalWidth = services.length * itemWidth;
    
    scrollPosition.current += speedPxPerStep;
    
    // Si on a défilé d'une largeur complète, on remet à zéro
    if (scrollPosition.current >= totalWidth) {
      scrollPosition.current = 0;
    }
    
    container.scrollLeft = scrollPosition.current;
    animationRef.current = requestAnimationFrame(animate);
  }, [services.length, speedPxPerStep]);
  
  React.useEffect(() => {
    if (containerRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);
  
  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="overflow-hidden pb-4"
        aria-label="Défilement des services"
      >
        <div className="flex gap-6 md:gap-8 px-1 justify-center" style={{ width: '200%' }}>
          {duplicatedServices.map((s, index) => (
            <div key={`${s.id}-${index}`} className="min-w-[140px] md:min-w-[170px] flex flex-col items-center">
              {s.href ? (
                s.href.startsWith('/') ? (
                  <Link to={s.href} className="group flex flex-col items-center">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white shadow-lg border border-orange-100 overflow-hidden flex items-center justify-center ring-0 group-hover:ring-2 ring-orange-200 transition-shadow">
                      <img src={s.imageSrc} alt={s.alt || ''} className="w-full h-full object-cover object-center" />
                    </div>
                    {s.title && (
                      <div className="text-center mt-3 text-sm md:text-base font-semibold text-gray-900 max-w-[180px]">
                        {s.title}
                      </div>
                    )}
                    {s.whatsappLink && (
                      <a
                        href={s.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors duration-300"
                      >
                        <MessageCircle className="w-3 h-3" />
                        WhatsApp
                      </a>
                    )}
                  </Link>
                ) : (
                  <a href={s.href} className="group flex flex-col items-center">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white shadow-lg border border-orange-100 overflow-hidden flex items-center justify-center ring-0 group-hover:ring-2 ring-orange-200 transition-shadow">
                      <img src={s.imageSrc} alt={s.alt || ''} className="w-full h-full object-cover object-center" />
                    </div>
                    {s.title && (
                      <div className="text-center mt-3 text-sm md:text-base font-semibold text-gray-900 max-w-[180px]">
                        {s.title}
                      </div>
                    )}
                    {s.whatsappLink && (
                      <a
                        href={s.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors duration-300"
                      >
                        <MessageCircle className="w-3 h-3" />
                        WhatsApp
                      </a>
                    )}
                  </a>
                )
              ) : (
                <>
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white shadow-lg border border-orange-100 overflow-hidden flex items-center justify-center">
                    <img src={s.imageSrc} alt={s.alt || ''} className="w-full h-full object-cover object-center" />
                  </div>
                  {s.title && (
                    <div className="text-center mt-3 text-sm md:text-base font-semibold text-gray-900 max-w-[180px]">
                      {s.title}
                    </div>
                  )}
                  {s.whatsappLink && (
                    <a
                      href={s.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors duration-300"
                    >
                      <MessageCircle className="w-3 h-3" />
                      WhatsApp
                    </a>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ServicesScroll;
