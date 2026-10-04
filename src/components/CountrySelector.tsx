import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, CheckIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useCountry, countries, Country } from '../contexts/CountryContext';





            
              

const CountrySelector: React.FC = () => {
  const { selectedCountry, countryData, setCountry, isLoading, isAutoDetected } = useCountry();
  const [isOpen, setIsOpen] = useState(false);
  const handleCountryChange = (country: Country) => {
    setCountry(country);
    setIsOpen(false);
    const urlParams = new URLSearchParams(window.location.search);
    const redirectTo = urlParams.get('redirectTo');
    if (redirectTo) {
      window.location.href = redirectTo;
    } else {
      window.location.href = '/home';
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg animate-pulse">
        <GlobeAltIcon className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-500">Détection...</span>
      </div>
    );
  }
  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-colors duration-200 border border-gray-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-lg">{countryData.flag}</span>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {countryData.name}
        </span>
        <span className="text-xs text-gray-500 sm:hidden">
          {countryData.code}
        </span>
        {isAutoDetected && (
          <span className="text-xs text-green-600 font-medium hidden sm:block">
            Auto
          </span>
        )}
        <ChevronDownIcon 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay pour fermer en cliquant à côté */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            {/* Menu déroulant */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden"
            >
              {Object.values(countries).map((country) => (
                <motion.button
                  key={country.id}
                  onClick={() => handleCountryChange(country.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                    selectedCountry === country.id ? 'bg-blue-50' : ''
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{country.flag}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {country.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {country.city}
                      </div>
                    </div>
                  </div>
                  {selectedCountry === country.id && (
                    <CheckIcon className="w-4 h-4 text-blue-600" />
                  )}
                </motion.button>
              ))}
              {/* Indicateur de détection automatique */}
              {isAutoDetected && (
                <div className="px-4 py-2 bg-green-50 border-t border-green-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-700 font-medium">
                      Détection automatique activée
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
export default CountrySelector;
