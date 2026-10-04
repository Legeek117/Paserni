import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Tag, ShoppingCart } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import { useCountry } from '../contexts/CountryContext';
import { OrderButton } from '../components/OrderButton';
import { Cart } from '../components/Cart';
import { useCart } from '../contexts/CartContext';
import { getCountryContent } from '../data/countryContent';

const ValidatedImgMulti: React.FC<{ candidates: string[]; fallback: string; alt: string; className?: string }> = ({ candidates, fallback, alt, className }) => {
  const [src, setSrc] = useState<string | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const c of candidates) {
        const ok = await new Promise<boolean>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = c;
        });
        if (ok) { if (!cancelled) { setSrc(c); } return; }
      }
      if (!cancelled) setSrc(fallback);
    })();
    return () => { cancelled = true; };
  }, [candidates, fallback]);
  if (!src) return null;
  return <img src={src} alt={alt} className={className} />;
};

// Different animation presets to cycle through
const cardPresets = [
  { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 } },
  { initial: { opacity: 0, rotateX: -8 }, whileInView: { opacity: 1, rotateX: 0 } },
  { initial: { opacity: 0, rotateY: -10, x: -20 }, whileInView: { opacity: 1, rotateY: 0, x: 0 } },
  { initial: { opacity: 0, scale: 0.94 }, whileInView: { opacity: 1, scale: 1 } },
];

const Gallery: React.FC = () => {
  const { countryData } = useCountry();
  const content = getCountryContent(countryData.id);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const { state } = useCart();

  const categories = [
    { id: 'all', name: 'Toutes' },
    { id: 'decorative', name: 'Décoratif' },
    { id: 'fashion', name: 'Mode' }
  ];

  const artworks = [
    { id: "puzzle-chien", title: 'Puzzle Chien Numérique', artist: 'Espace Paserni', category: 'decorative', image: '/images-galeries/puzzle-chien.jpg.jpg', price: 15000, description: "Un puzzle éducatif plein de couleurs qui éveille l'esprit des petits artistes.", dimensions: '', year: '' },
    { id: "sac-amazone", title: 'Sac Amazone', artist: 'Espace Paserni', category: 'fashion', image: '/images-galeries/sac-amazone.jpg.jpg', price: 25000, description: "Sac à dos inspiré des amazones, alliant style, résistance et fierté culturelle.", dimensions: '', year: '' },
    { id: "cafebart-comptoir", title: 'CafébArt – Comptoir', artist: 'Espace Paserni', category: 'decorative', image: '/images-galeries/cafebart-comptoir.jpg.jpg', price: 50000, description: "Un espace chaleureux où la créativité sert de décor et de moteur.", dimensions: '', year: '' },
    { id: "sac-guerriere", title: 'Sac Guerrière', artist: 'Espace Paserni', category: 'fashion', image: '/images-galeries/sac-guerriere.jpg.jpg', price: 25000, description: "Sac à dos unique, célébrant la force et l'élégance à la béninoise.", dimensions: '', year: '' },
    { id: "masque-bleu", title: 'Masque Bleu', artist: 'Espace Paserni', category: 'decorative', image: '/images-galeries/masque-bleu.jpg.jpg', price: 20000, description: "Un masque stylisé qui rend hommage aux traditions avec une touche moderne.", dimensions: '', year: '' },
    { id: "mur-bienvenue", title: 'Bienvenue au Temple de la Créativité', artist: 'Espace Paserni', category: 'decorative', image: '/images-galeries/mur-bienvenue.jpg.jpg', price: 40000, description: "Notre credo gravé sur les murs : inspirer, créer et partager.", dimensions: '', year: '' }
  ];

  interface SupabaseProduct {
    id: string
    name: string
    image?: string
    price?: number | string
    subcategory?: string | null
    description?: string
    quantity?: number | null
  }

  const [dbArtworks, setDbArtworks] = useState<SupabaseProduct[]>([])
  const [loadingDb, setLoadingDb] = useState<boolean>(false)
  const [isSyncing, setIsSyncing] = useState(false)

  // Fonction pour charger les données avec timeout
  const loadGalleryData = React.useCallback(async () => {
    setLoadingDb(true)
    setIsSyncing(true)
    
    try {
      // Timeout de 10 secondes pour éviter les erreurs
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 10000)
      )
      
      const supabasePromise = supabase
        .from('products')
        .select('*')
        .eq('category', 'gallery')
        .eq('is_available', true)
      
      const { data, error } = await Promise.race([supabasePromise, timeoutPromise]) as any
      
      if (!error && data) {
        const mapped = (data as SupabaseProduct[])
          .filter(p => typeof p.quantity !== 'number' || (p.quantity || 0) > 0)
          .map(p => ({
            id: p.id,
            name: p.name,
            image: p.image || '',
            price: p.price || 0,
            subcategory: p.subcategory || null,
            description: p.description || '',
            quantity: typeof p.quantity === 'number' ? p.quantity : null
          })) as SupabaseProduct[]
        setDbArtworks(mapped)
      } else {
        }
    } catch (error) {
      } finally {
      setLoadingDb(false)
      setIsSyncing(false)
    }
  }, [])

  React.useEffect(() => {
    (async () => {
      await loadGalleryData()
    })()
  }, [loadGalleryData])

  // Rechargement automatique toutes les 30 secondes
  React.useEffect(() => {
    const interval = setInterval(() => {
      loadGalleryData()
    }, 30000) // 30 secondes

    return () => clearInterval(interval)
  }, [loadGalleryData])

  // Synchronisation temps réel avec Supabase
  React.useEffect(() => {
    const channel = supabase
      .channel('gallery-products')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'products',
          filter: 'category=eq.gallery'
        }, 
        (payload) => {
          loadGalleryData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadGalleryData])

  // Écoute des événements personnalisés depuis l'admin
  React.useEffect(() => {
    const handleProductsUpdate = (event: CustomEvent) => {
      if (event.detail?.category === 'gallery' || event.detail?.action === 'delete') {
        loadGalleryData()
      }
    }

    window.addEventListener('productsUpdated', handleProductsUpdate as EventListener)
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate as EventListener)
    }
  }, [loadGalleryData])

  // Fonction pour obtenir les œuvres sans doublons
  const getArtworksToDisplay = () => {
    // Créer un Set pour éviter les doublons basés sur le nom
    const seenNames = new Set<string>()
    type DisplayArtwork = { id: string; title: string; artist: string; category: string; image: string; price: number; description: string }
    const uniqueArtworks: DisplayArtwork[] = []
    
    // D'abord ajouter les œuvres de la BDD (priorité)
    dbArtworks.forEach((artwork) => {
      const key = artwork.name.toLowerCase().trim()
      if (!seenNames.has(key)) {
        seenNames.add(key)
        uniqueArtworks.push({ id: artwork.id, title: artwork.name, artist: 'Espace Paserni', category: artwork.subcategory || 'decorative', image: artwork.image || '', price: Number(artwork.price) || 0, description: artwork.description || '' })
      }
    })
    
    // Ensuite ajouter les œuvres statiques seulement si elles ne sont pas déjà présentes
    artworks.forEach((artwork) => {
      const key = artwork.title.toLowerCase().trim()
      if (!seenNames.has(key)) {
        seenNames.add(key)
        uniqueArtworks.push({ id: artwork.id, title: artwork.title, artist: artwork.artist, category: artwork.category, image: artwork.image || '', price: artwork.price || 0, description: artwork.description || '' })
      }
    })
    
    return uniqueArtworks
  }

  const sourceArtworks = getArtworksToDisplay()
  const filteredArtworks = selectedCategory === 'all' 
    ? sourceArtworks 
    : sourceArtworks.filter(artwork => artwork.category === selectedCategory);

  const candidateMap: Record<string, string[]> = {
    'puzzle-chien': ['/images-galeries/puzzle-chien.jpg.jpg'],
    'sac-amazone': ['/images-galeries/sac-amazone.jpg.jpg'],
    'cafebart-comptoir': ['/images-galeries/cafebart-comptoir.jpg.jpg'],
    'sac-guerriere': ['/images-galeries/sac-guerriere.jpg.jpg'],
    'terrasse-nocturne': ['/images-galeries/terasse-nuit.jpg.jpg'],
    'masque-bleu': ['/images-galeries/masque-bleu.jpg.jpg'],
    'mur-bienvenue': ['/images-galeries/mur-bienvenue.jpg.jpg']
  };

  return (
    <div className="min-h-screen py-8 pt-6 md:pt-8">
      {/* Retour link removed: kept only on department gallery pages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with transition */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="text-center mb-12">
          <h1 className="section-title">Galerie d'Art</h1>
          <p className="text-xl text-gray-1000 max-w-3xl mx-auto">
            Découvrez les créations uniques de nos artistes résidents et partenaires. 
            {content.gallery.description}
          </p>
          
          {/* Bouton Panier et indicateur de synchronisation */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              onClick={() => setShowCart(!showCart)}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              <ShoppingCart className="w-5 h-5" />
              Panier ({state.itemCount})
            </button>
            {isSyncing && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                Synchronisation en cours...
              </div>
            )}
          </div>
        </motion.div>

        {/* Single Filter Button */}
        <motion.div className="flex justify-center mb-12" initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              'bg-orange-600 text-white'
            }`}
          >
            Toutes les œuvres
          </button>
        </motion.div>

        {/* Artwork Grid with varied transitions per card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loadingDb ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des œuvres...</p>
            </div>
          ) : filteredArtworks.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">Aucune œuvre trouvée pour cette catégorie.</p>
            </div>
          ) : (
            filteredArtworks.map((artwork, index) => {
            const preset = cardPresets[index % cardPresets.length];
            return (
              <motion.div key={artwork.id} initial={preset.initial} whileInView={preset.whileInView} viewport={{ once: true }} transition={{ duration: 0.45 }}>
                <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} transitionSpeed={140} perspective={720} glareEnable={false} className="will-change-transform">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden card-hover border border-accent-dark">
                    {/* Artwork Image */}
                    <div className="relative group">
                      {candidateMap[artwork.id] ? (
                        <ValidatedImgMulti candidates={candidateMap[artwork.id]} fallback={artwork.image} alt={artwork.title} className="w-full h-64 object-cover" />
                      ) : (
                        <img src={artwork.image} alt={artwork.title} className="w-full h-64 object-cover" />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                    </div>

                    {/* Artwork Info */}
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                          {artwork.title}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <User size={16} className="mr-2" />
                          <span>{artwork.artist}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Tag size={16} className="mr-2" />
                          <span>{categories.find(cat => cat.id === artwork.category)?.name}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {artwork.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-orange-600">{artwork.price} F CFA</span>
                      </div>

                      <div className="mt-3">
                        <OrderButton 
                          item={{
                            id: artwork.id,
                            name: artwork.title,
                            price: artwork.price,
                            image: artwork.image || '',
                            type: 'gallery',
                            category: artwork.category
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            );
          })
          )}
        </div>

        {/* Panier */}
        {showCart && (
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Cart />
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Gallery;