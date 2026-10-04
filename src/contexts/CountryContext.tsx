import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Country = 'benin' | 'cote-ivoire';

export interface CountryData {
  id: Country;
  name: string;
  flag: string;
  code: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  specialPhone?: string;
  mapsUrl?: string;
}

export const countries: Record<Country, CountryData> = {
  'benin': {
    id: 'benin',
    name: 'Bénin',
    flag: '🇧🇯',
    code: 'BJ',
    phone: '+229 96 23 13 04',
    email: 'serge@espacepaserni.org, infos@espacepaserni.org',
    address: 'Cotonou, Bénin',
    city: 'Cotonou',
    specialPhone: '+229 01 21 33 36 88'
  },
  'cote-ivoire': {
    id: 'cote-ivoire',
    name: 'Côte d\'Ivoire',
    flag: '🇨🇮',
    code: 'CI',
    phone: '+225 0767206712',
    email: 'serge@espacepaserni.org, infos@espacepaserni.org',
    address: 'Abidjan, Côte d\'Ivoire',
    city: 'Abidjan',
    specialPhone: '+229 0544964461',
    mapsUrl: 'https://maps.app.goo.gl/vtwT6H86NiuB6ehg6?g_st=aw'
  }
};
interface CountryContextType {
  selectedCountry: Country;
  countryData: CountryData;
  setCountry: (country: Country) => void;
  isLoading: boolean;
  isAutoDetected: boolean;
}
const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
};
interface CountryProviderProps {
  children: ReactNode;
}

  // Détection automatique de géolocalisation
        // Vérifier d'abord l'URL pour un paramètre de pays

        // Vérifier si on a déjà un pays sauvegardé

        // Toujours rediriger vers la sélection si on n'est pas déjà sur cette page,
        // en mémorisant la route d'origine pour retourner dessus après le choix du pays

        // Tentative de détection par IP (seulement sur la page de sélection)

        // En cas d'erreur, on garde le Bénin par défaut

    // Mettre à jour l'URL avec le paramètre de pays

export const CountryProvider: React.FC<CountryProviderProps> = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>('benin');
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoDetected, setIsAutoDetected] = useState(false);
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlCountry = urlParams.get('country') as Country;
        if (urlCountry && countries[urlCountry]) {
          setSelectedCountry(urlCountry);
          setIsLoading(false);
          localStorage.setItem('selectedCountry', urlCountry);
          return;
        }
        const savedCountry = localStorage.getItem('selectedCountry') as Country;
        if (savedCountry && countries[savedCountry]) {
          setSelectedCountry(savedCountry);
          setIsLoading(false);
          return;
        }
        if (window.location.pathname !== '/') {
          const original = window.location.pathname + window.location.search + window.location.hash;
          const redirectUrl = `/?redirectTo=${encodeURIComponent(original)}`;
          window.location.href = redirectUrl;
          return;
        }
        try {
          const response = await fetch('https://ipapi.co/json/', {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          const data = await response.json();
          if (data.country_code) {
            let detectedCountry: Country = 'benin'; // Fallback par défaut
            if (data.country_code === 'BJ') {
              detectedCountry = 'benin';
            } else if (data.country_code === 'CI') {
              detectedCountry = 'cote-ivoire';
            }
            setSelectedCountry(detectedCountry);
            setIsAutoDetected(true);
            localStorage.setItem('selectedCountry', detectedCountry);
          }
        } catch (fetchError) {
          // Utiliser le pays par défaut sans erreur
        }
      } catch (error) {
        } finally {
        setIsLoading(false);
      }
    };
    detectCountry();
  }, []);

  // Écouter les changements d'URL pour mettre à jour le pays
  useEffect(() => {
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlCountry = urlParams.get('country') as Country;
      if (urlCountry && countries[urlCountry]) {
        setSelectedCountry(prev => {
          if (prev !== urlCountry) {
            localStorage.setItem('selectedCountry', urlCountry);
            setIsAutoDetected(false);
            return urlCountry;
          }
          return prev;
        });
      }
    };

    // Écouter les changements de navigation
    window.addEventListener('popstate', handleUrlChange);
    
    // Vérifier immédiatement au cas où l'URL a changé
    handleUrlChange();

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const setCountry = (country: Country) => {
    setSelectedCountry(country);
    setIsAutoDetected(false);
    localStorage.setItem('selectedCountry', country);
    const url = new URL(window.location.href);
    url.searchParams.set('country', country);
    window.history.replaceState({}, '', url.toString());
  };
  const countryData = countries[selectedCountry];

  // Optionnel: purge des avis locaux pour une intervention d'urgence.
  // Utiliser dans .env :
  // VITE_PURGE_REVIEWS=true -> supprime toutes les clés commençant par "reviews_"
  // VITE_PURGE_REVIEWS_COUNTRY=benin -> supprime seulement `reviews_benin`
  React.useEffect(() => {
    try {
      const meta: any = import.meta;
      const purgeAll = Boolean(meta?.env?.VITE_PURGE_REVIEWS === 'true');
      const purgeCountry = typeof meta?.env?.VITE_PURGE_REVIEWS_COUNTRY === 'string' ? String(meta.env.VITE_PURGE_REVIEWS_COUNTRY).trim() : '';
      if (purgeCountry) {
        const key = `reviews_${purgeCountry}`;
        localStorage.removeItem(key);
        } else if (purgeAll) {
        Object.keys(localStorage).filter(k => k.startsWith('reviews_')).forEach(k => localStorage.removeItem(k));
      }
    } catch (err) {
      // Non critique
      }
  }, []);
  return (
    <CountryContext.Provider value={{
      selectedCountry,
      countryData,
      setCountry,
      isLoading,
      isAutoDetected
    }}>
      {children}
    </CountryContext.Provider>
  );
};
