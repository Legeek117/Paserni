import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, RotateCcw } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import CountrySelector from './CountrySelector';
import { useCms } from '../hooks/useCms';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const { navItems: cmsNavItems } = useCms();

  const fallbackNav = [
    { path: '/home', label: 'Accueil' },
    { path: '/departements', label: 'Nos départements' },
    { path: '/services', label: 'Nos services' },
    { path: '/programmes', label: 'Programmes, Formations' },
    { path: '/projet', label: 'Projets' },
    { path: '/galeries', label: "Galerie d'Art" },
    { path: '/restaurant', label: 'Restaurant' },
    { path: '/mes-commandes', label: 'Mes commandes' },
    { path: '/contact', label: 'Contact' },
  ];

  const navItems = (cmsNavItems && cmsNavItems.length > 0)
    ? cmsNavItems.map((n: { path: string; label: string }) => ({ path: n.path, label: n.label }))
    : fallbackNav;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white/95 backdrop-blur shadow-lg border-b border-accent-dark sticky top-0 z-[50]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex justify-between items-center py-2"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <a href="/" className="flex items-center space-x-4 group">
            <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} transitionSpeed={160} perspective={700} className="will-change-transform">
              <img
                src="/LOGO%20EP%20insubation%20(1).jpg"
                alt="Espace Paserni"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-contain bg-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (img.src.endsWith('/logo.png')) return;
                  img.src = '/logo.png';
                }}
              />
            </Tilt>
            <div className="transition-opacity duration-300 group-hover:opacity-90">
              <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">Espace Paserni</h1>
              <p className="text-sm text-gray-600">Arts • Culture • Incubation • Restauration</p>
            </div>
          </a>

          {/* Centered desktop nav */}
          <div className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
            <nav className="flex items-center justify-center bg-transparent rounded-md px-2 py-1 z-10">
              {navItems.map((item) => (
                <motion.div key={item.path} whileHover={{ y: -2 }} transition={{ duration: 0.12 }}>
                  <a
                    href={item.path}
                    className={`font-medium transition-all duration-200 inline-flex items-center justify-center px-4 py-2 mx-1 rounded-md hover:shadow-md relative
                      ${isActive(item.path)
                        ? 'text-orange-700 bg-orange-50 shadow-inner font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-500'
                        : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50/80'
                      }
                      focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:ring-offset-2`}
                  >
                    {item.label}
                  </a>
                </motion.div>
              ))}
            </nav>
          </div>

          {/* Right controls */}
          <div className="flex items-center space-x-3 ml-auto z-20">
            <div className="hidden lg:flex items-center space-x-3">
              <CountrySelector />
              <motion.button
                onClick={() => { window.location.href = '/'; }}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-orange-600 transition-colors duration-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                title="Changer de pays"
              >
                <RotateCcw size={16} />
                <span className="hidden sm:inline">Changer</span>
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-700 hover:text-orange-600">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </motion.div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className={`font-medium transition-colors duration-200 px-3 py-2 rounded-md ${isActive(item.path) ? 'text-orange-700 bg-orange-50' : 'text-gray-700 hover:text-orange-700 hover:bg-orange-50'}`}
                >
                  {item.label}
                </a>
              ))}

              <div className="pt-4 border-t border-gray-200 space-y-4">
                <CountrySelector />
                <a href="/" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-orange-600 transition-colors duration-200">
                  <RotateCcw size={16} />
                  <span>Changer de pays</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
