import React, { useState, useEffect, useCallback } from 'react'
import { supabase, Product } from '../lib/supabase'
import Tilt from 'react-parallax-tilt'
import { OrderButton } from '../components/OrderButton'
import { Clock, MapPin, ShoppingCart, ChefHat, Beer, Utensils, Coffee, Wine } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCountry } from '../contexts/CountryContext'
import { Cart } from '../components/Cart'
import { useCart } from '../contexts/CartContext'

// Les catégories seront maintenant générées dynamiquement depuis la base de données

const openingHours = [
  { day: 'Mardi - Samedi', hours: '10h - 22h' },
  { day: 'Dimanche', hours: '12h - 22h' }
]

const Restaurant: React.FC = () => {
  const { countryData } = useCountry()
  const { state } = useCart()

  const [dbItems, setDbItems] = useState<Record<string, Product[]>>({})
  const [availableCategories, setAvailableCategories] = useState<Array<{id: string, name: string, icon: any}>>([])
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCart, setShowCart] = useState(false)

  const loadRestaurantData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'restaurant')
        .eq('is_available', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      const grouped: Record<string, Product[]> = {}
      const categoriesSet = new Set<string>()
      
      for (const p of (data || []) as Product[]) {
        const sub = (p.subcategory || 'plats').toLowerCase()
        if (!grouped[sub]) grouped[sub] = []
        grouped[sub].push(p)
        categoriesSet.add(sub)
      }
      
      // Mapping des catégories avec leurs icônes thématiques
      const categoryIcons: Record<string, any> = {
        'plats': ChefHat,
        'spécialités': ChefHat,
        'bières': Beer,
        'accompagnements': Utensils,
        'jus': Coffee,
        'liqueur': Wine,
        'liqueurs': Wine,
        'boissons': Coffee,
        'desserts': ChefHat,
        'entrées': Utensils
      }
      
      // Fonction pour normaliser le nom de catégorie
      const normalizeCategoryName = (cat: string) => {
        const normalized = cat.toLowerCase().trim()
        if (normalized === 'plats') return 'Spécialités'
        return cat.charAt(0).toUpperCase() + cat.slice(1)
      }
      
      // Générer les catégories dynamiquement depuis la base de données
      const categories = Array.from(categoriesSet).map(cat => ({
        id: cat,
        name: normalizeCategoryName(cat),
        icon: categoryIcons[cat.toLowerCase()] || ChefHat
      }))
      
      setAvailableCategories(categories)
      setDbItems(grouped)
      
      // Définir la première catégorie comme active si aucune n'est sélectionnée
      if (categories.length > 0) {
        setActiveCategory(prev => prev || categories[0].id)
      }
      
      // Debug logs supprimés - tout fonctionne !
    } catch (e: any) {
      setError(e?.message || 'Erreur lors du chargement des produits')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadRestaurantData() }, [loadRestaurantData])

  useEffect(() => {
    const interval = setInterval(() => { loadRestaurantData() }, 30000)
    return () => clearInterval(interval)
  }, [loadRestaurantData])

  useEffect(() => {
    const channel = supabase
      .channel('restaurant-products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products', filter: "category=eq.restaurant" }, () => {
        loadRestaurantData()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [loadRestaurantData])

  useEffect(() => {
    const handleProductsUpdate = (event: CustomEvent) => {
      if (event.detail?.category === 'restaurant' || event.detail?.action === 'delete') {
        loadRestaurantData()
      }
    }
    window.addEventListener('productsUpdated', handleProductsUpdate as EventListener)
    return () => window.removeEventListener('productsUpdated', handleProductsUpdate as EventListener)
  }, [loadRestaurantData])

  const getCurrentStatus = () => {
    const now = new Date()
    const day = now.getDay()
    const hour = now.getHours()
    if (day >= 1 && day <= 4) return hour >= 9 && hour < 22 ? 'Ouvert' : 'Fermé'
    if (day >= 5 && day <= 6) return hour >= 9 && hour < 24 ? 'Ouvert' : 'Fermé'
    return 'Ouvert'
  }

  const status = getCurrentStatus()

  const getItemsToDisplay = (category: string) => {
    return dbItems[category] || []
  }

  return (
    <div className="min-h-screen py-8 pt-6 md:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="section-title">{countryData.id === 'cote-ivoire' ? "Resto b'Art PDG" : 'Café Bar & Restaurant'}</h1>
          <p className="text-xl text-gray-1000 max-w-3xl mx-auto">
            Savourez une cuisine créative dans un cadre artistique unique. Notre menu mélange traditions culinaires locales et créativité moderne.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <button onClick={() => setShowCart(!showCart)} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold">
              <ShoppingCart className="w-5 h-5" />
              Panier ({state.itemCount})
            </button>
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                Chargement en cours...
              </div>
            )}
            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div className="bg-white rounded-xl shadow-lg p-6 text-center border border-accent-dark" initial={{ opacity: 0, rotate: -2, y: 16 }} whileInView={{ opacity: 1, rotate: 0, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="mb-4"><Clock size={48} className="text-orange-600 mx-auto mb-2" /><h2 className="text-2xl font-serif font-bold text-gray-900">État Actuel</h2></div>
            <div className={`text-3xl font-bold mb-4 ${status === 'Ouvert' ? 'text-green-600' : status === 'Fermé' ? 'text-red-600' : 'text-yellow-600'}`}>{status}</div>
          </motion.div>

          <motion.div className="bg-white rounded-xl shadow-lg p-6 border border-accent-dark" initial={{ opacity: 0, rotate: 2, y: 16 }} whileInView={{ opacity: 1, rotate: 0, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.05 }}>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 text-center">Horaires d'Ouverture</h2>
            <div className="space-y-3">
              {openingHours.map((schedule, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100"><span className="font-medium text-gray-900">{schedule.day}</span><span className="text-gray-600">{schedule.hours}</span></div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div className="bg-white rounded-xl shadow-lg p-8" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Notre Menu</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6"></div>
          </div>

          <div className="mb-8 overflow-x-auto -mx-4 px-4">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-2 rounded-xl inline-flex gap-2 whitespace-nowrap min-h-[70px] shadow-inner">
              {availableCategories.map((category) => {
                const Icon = category.icon as React.ElementType
                const productCount = dbItems[category.id]?.length || 0
                return (
                  <button 
                    key={category.id} 
                    onClick={() => setActiveCategory(category.id)} 
                    className={`group flex items-center space-x-3 px-6 py-4 rounded-lg font-display font-medium transition-all duration-300 transform hover:scale-105 ${
                      activeCategory === category.id 
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/25 scale-105' 
                        : 'text-gray-700 hover:text-orange-600 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <Icon 
                      size={22} 
                      className={`transition-colors duration-300 ${
                        activeCategory === category.id 
                          ? 'text-white' 
                          : 'text-gray-600 group-hover:text-orange-600'
                      }`} 
                    />
                    <span className="font-semibold tracking-wide">{category.name}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      activeCategory === category.id 
                        ? 'bg-white/20 text-white' 
                        : 'bg-orange-100 text-orange-600 group-hover:bg-orange-200'
                    }`}>
                      {productCount}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[200px]">
            {getItemsToDisplay(activeCategory).map((item, index: number) => (
              <motion.div 
                key={item.id || index} 
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="h-48 bg-cover bg-center bg-no-repeat bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden" style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'contain' }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-serif font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">{item.name}</h3>
                    <span className="text-lg font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">{Number(item.price).toLocaleString('fr-FR')} F CFA</span>
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed font-sans">{item.description}</p>
                  <div className="mt-4">
                    <OrderButton item={{ id: item.id, name: item.name, price: Number(item.price), image: item.image || '', type: 'restaurant', category: activeCategory }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {showCart && (
          <motion.div className="mt-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Cart />
          </motion.div>
        )}

        <motion.div className="mt-8 bg-white rounded-xl shadow-lg p-8" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 flex items-center"><MapPin className="text-orange-600 mr-2" /> Localisation</h2>
          <p className="text-gray-600 mb-4">{countryData.address}</p>
          <a href="https://maps.app.goo.gl/HSmG2YqQrajoHjsE7?g_st=awb" target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">Ouvrir dans Google Maps</a>
        </motion.div>
      </div>
    </div>
  )
}

export default Restaurant