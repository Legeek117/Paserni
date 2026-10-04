import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Globe } from 'lucide-react';
import { countries, Country, useCountry } from '../contexts/CountryContext';

const CountrySelection: React.FC = () => {
  const navigate = useNavigate();
  const { setCountry } = useCountry();
  
  const handleCountrySelect = (country: Country) => {
    // Utiliser la fonction setCountry du contexte pour une mise à jour cohérente
    setCountry(country);
    
    const params = new URLSearchParams(window.location.search);
    const redirectTo = params.get('redirectTo');
    if (redirectTo) {
      navigate(redirectTo);
    } else {
      navigate(`/home?country=${country}`);
    }
  };
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };
  const cardVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };
  const countryFeatures = {
      'benin': {
      highlights: [
        "Centre Créatif et Culturel",
        "Événements artistiques",
        "Formations en arts et Design",
        "Bar et Restaurant"
      ],
      stats: "500+ projets réalisés"
    },
    'cote-ivoire': {
      highlights: [
        "Centre Créatif et Culturel",
        "Galerie d'art",
        "Événements privés",
        "Formations spécialisées"
      ],
      stats: "200+ projets réalisés"
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header avec logo */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            <img 
              src="/LOGO%20EP%20insubation%20(1).jpg" 
              alt="Espace Paserni" 
              className="w-16 h-16 rounded-lg object-cover shadow-md"
            />
            <div className="ml-4">
              <h1 className="text-3xl font-serif font-bold text-gray-900">Espace Paserni</h1>
              <p className="text-gray-600">Arts • Culture • Incubation • Restauration</p>
            </div>
          </div>
        </div>
      </div>
      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            Choisissez votre pays
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Espace Paserni est présent dans plusieurs pays. Sélectionnez votre localisation 
            pour accéder aux informations et services adaptés à votre région.
          </p>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-10"
        >
          {Object.values(countries).map((country) => (
            <motion.div
              key={country.id}
              variants={cardVariants}
              whileHover={{ 
                y: -6,
                scale: 1.03,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="relative group cursor-pointer z-0"
              onClick={() => handleCountrySelect(country.id)}
            >
              <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                {/* Header de la carte */}
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white relative overflow-hidden z-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-6xl">{country.flag}</span>
                      <Globe className="w-8 h-8 opacity-80" />
                    </div>
                    <h3 className="text-3xl font-bold mb-2">{country.name}</h3>
                    <p className="text-orange-100 text-lg">{country.city}</p>
                  </div>
                </div>
                {/* Contenu de la carte */}
                <div className="p-8">
                  <div className="space-y-6">
                    {/* Informations de contact */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-gray-600">
                        <MapPin className="w-5 h-5 text-orange-500" />
                        <span className="text-sm">{country.address}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Users className="w-5 h-5 text-orange-500" />
                        <span className="text-sm">{countryFeatures[country.id].stats}</span>
                      </div>
                    </div>
                    {/* Points forts */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Points forts :</h4>
                      <ul className="space-y-2">
                        {countryFeatures[country.id].highlights.map((highlight, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Bouton d'action */}
                    <div className="pt-4">
                      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-lg font-medium text-center group-hover:from-orange-600 group-hover:to-amber-600 transition-all duration-300">
                        Accéder à {country.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
        {/* Footer informatif */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Vous ne trouvez pas votre pays ?
            </h3>
            <p className="text-gray-600 mb-6">
              Espace Paserni s'étend continuellement. Contactez-nous pour connaître 
              nos projets d'expansion dans votre région.
            </p>
            {/* 'Nous contacter' button removed as requested */}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CountrySelection;