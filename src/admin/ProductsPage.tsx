import React from 'react'
import { supabase, Product } from '../lib/supabase'
import { useCountry } from '../contexts/CountryContext'
import { Plus, Pencil, Trash2, Upload as UploadIcon, X } from 'lucide-react'
import { restaurantSeed, gallerySeed, SeedProduct } from '../data/siteSeed'

type EditableProduct = Omit<Product, 'created_at' | 'id'> & { id?: string }

const emptyProduct: EditableProduct = {
  id: undefined,
  name: '',
  description: '',
  price: 0,
  image: '',
  category: 'restaurant',
  subcategory: '',
  quantity: 0,
  is_available: true
}

const ProductsPage: React.FC = () => {
  const { selectedCountry } = useCountry()
  const [loading, setLoading] = React.useState(true)
  const [items, setItems] = React.useState<Product[]>([])
  const [hasCountryColumn, setHasCountryColumn] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [query, setQuery] = React.useState('')
  const [category, setCategory] = React.useState<'all' | 'restaurant' | 'gallery'>('all')
  const [modalOpen, setModalOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<EditableProduct>(emptyProduct)
  
  const subcategoryOptions: Record<'restaurant' | 'gallery', string[]> = {
    restaurant: ['plats', 'accompagnements', 'jus', 'bieres', 'liqueur'],
    gallery: ['decorative', 'fashion', 'sculpture', 'painting']
  }
  
  const modalRef = React.useRef<HTMLDivElement | null>(null)
  const nameInputRef = React.useRef<HTMLInputElement | null>(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (hasCountryColumn) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('country', selectedCountry)
          .order('created_at', { ascending: false })
        if (error) throw error
        setItems(data || [])
      } else {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        setItems(data || [])
      }
    } catch (e: any) {
      const msg = e?.message || ''
      if (/column\s+\"?country\"?\s+does not exist/i.test(msg)) {
        setHasCountryColumn(false)
        const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
        setItems(data || [])
      } else {
        setError(msg)
      }
    }
    setLoading(false)
  }, [hasCountryColumn, selectedCountry])

  React.useEffect(() => { load() }, [load])

  // Ensure visibility/focus when modal opens
  React.useEffect(() => {
    if (modalOpen) {
      try {
        setTimeout(() => {
          modalRef.current?.scrollIntoView({ block: 'start' })
          nameInputRef.current?.focus()
          window.scrollTo({ top: 0 })
        }, 0)
      } catch {}
    }
    return () => { /* no-op */ }
  }, [modalOpen])

  const filtered = items.filter(p => {
    const okCategory = category === 'all' ? true : p.category === category
    const q = query.trim().toLowerCase()
    const okQuery = !q || p.name.toLowerCase().includes(q) || (p.subcategory || '').toLowerCase().includes(q)
    return okCategory && okQuery
  })

  const openCreate = () => { setDraft(emptyProduct); setModalOpen(true) }
  
  const openEdit = (p: Product) => {
    setDraft({
      id: p.id,
      name: p.name,
      description: p.description || '',
      price: Number(p.price) || 0,
      image: p.image || '',
      category: p.category as any,
      subcategory: p.subcategory || '',
      quantity: typeof p.quantity === 'number' ? p.quantity : 0,
      is_available: !!p.is_available
    }); setModalOpen(true)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (draft.id) {
        // Primary attempt: full payload including optional columns
        let { error } = await supabase.from('products').update({
          name: draft.name,
          description: draft.description,
          price: draft.price,
          image: draft.image,
          category: draft.category,
          subcategory: draft.subcategory,
          is_available: draft.is_available,
          ...(hasCountryColumn ? { country: selectedCountry } : {})
        }).eq('id', draft.id)
        if (error) {
          // Fallback for schemas without quantity/country columns
          const minimal = {
            name: draft.name,
            description: draft.description,
            price: draft.price,
            image: draft.image,
            category: draft.category,
            subcategory: draft.subcategory,
            is_available: draft.is_available
          }
          const retry = await supabase.from('products').update(minimal as any).eq('id', draft.id)
          if (retry.error) throw retry.error
        }
      } else {
        // Primary attempt: full payload
        let { error } = await supabase.from('products').insert([{
          name: draft.name,
          description: draft.description,
          price: draft.price,
          image: draft.image,
          category: draft.category,
          subcategory: draft.subcategory,
          ...(hasCountryColumn ? { country: selectedCountry } : {}),
          is_available: draft.is_available
        }])
        if (error) {
          // Fallback for schemas without quantity/country columns
          const minimal = [{
            name: draft.name,
            description: draft.description,
            price: draft.price,
            image: draft.image,
            category: draft.category,
            subcategory: draft.subcategory,
            is_available: draft.is_available
          }]
          const retry = await supabase.from('products').insert(minimal as any)
          if (retry.error) throw retry.error
        }
      }
      setModalOpen(false)
      await load()
      
      // Forcer le rechargement des pages publiques
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('productsUpdated', { 
          detail: { category: draft.category, action: draft.id ? 'update' : 'create' }
        }))
      }, 100)
    } catch (err: any) {
      setError((err?.details || err?.message) ?? 'Erreur enregistrement')
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return
    setLoading(true)
    setError(null)
    const { error } = hasCountryColumn
      ? await supabase.from('products').delete().eq('id', id).eq('country', selectedCountry)
      : await supabase.from('products').delete().eq('id', id)
    if (error) setError(error.message)
    await load()
    
    // Forcer le rechargement des pages publiques
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('productsUpdated', { 
        detail: { action: 'delete' }
      }))
    }, 100)
    
    setLoading(false)
  }

  const importFromSite = async () => {
    if (!confirm('Importer tous les articles visibles sur le site dans Produits ?')) return
    setLoading(true)
    setError(null)
    try {
      const all: SeedProduct[] = [...restaurantSeed, ...gallerySeed]
      for (const s of all) {
        const q = supabase.from('products')
          .delete()
          .eq('name', s.name)
          .eq('category', s.category)
          .eq('subcategory', s.subcategory || '')
        if (hasCountryColumn) await q.eq('country', selectedCountry)
        else await q
      }
      const { error } = await supabase.from('products').insert(
        all.map(s => ({
          name: s.name,
          description: s.description,
          price: s.price,
          image: s.image,
          category: s.category,
          subcategory: s.subcategory || '',
          ...(hasCountryColumn ? { country: selectedCountry } : {}),
          is_available: s.is_available
        }))
      )
      if (error) throw error
      await load()
      alert('Import terminé')
    } catch (e: any) {
      setError(e.message || 'Erreur import')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header moderne */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Catalogue des Produits</h2>
              <p className="text-gray-600">Gérez vos articles restaurant et galerie</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button 
                onClick={importFromSite} 
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-orange-600 text-orange-700 hover:bg-orange-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <span>Importer depuis le site</span>
              </button>
              <button 
                onClick={openCreate} 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Nouveau produit</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Filtres et recherche modernes */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="space-y-4">
            <div className="relative">
              <input 
                value={query} 
                onChange={(e)=>setQuery(e.target.value)} 
                placeholder="🔍 Rechercher un produit (nom, sous-catégorie)" 
                className="w-full px-6 py-4 text-base border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 hover:bg-gray-50 hover:shadow-md" 
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <select 
                value={category} 
                onChange={(e)=>setCategory(e.target.value as any)} 
                className="px-4 py-3 text-base border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm"
              >
                <option value="all">🏪 Toutes catégories</option>
                <option value="restaurant">🍽️ Restaurant</option>
                <option value="gallery">🎨 Galerie</option>
              </select>
              
              <button 
                onClick={load} 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Rafraîchir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 m-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-flex items-center gap-3 text-gray-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                <span className="text-lg">Chargement des produits...</span>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
                  <p className="text-gray-500">Essayez de modifier vos critères de recherche ou ajoutez un nouveau produit.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((p) => (
                    <div key={p.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                      <div className="h-48 bg-gray-100 bg-no-repeat bg-center bg-contain relative" style={{ backgroundImage: `url(${p.image || ''})` }}>
                        <div className="absolute top-3 left-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            p.is_available 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {p.is_available ? 'Disponible' : 'Indisponible'}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {p.category === 'restaurant' && '🍽️ Restaurant'}
                            {p.category === 'gallery' && '🎨 Galerie'}
                            {p.category === 'mobilier' && '🪑 Mobilier'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <div className="mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{p.name}</h3>
                          {p.subcategory && (
                            <p className="text-sm text-gray-500 capitalize">{p.subcategory}</p>
                          )}
                        </div>
                        
                        <div className="mb-4">
                          <div className="text-2xl font-bold text-orange-600 mb-2">
                            {Number(p.price).toLocaleString('fr-FR')} F CFA
                          </div>
                          <div className="text-sm text-gray-600">
                            Stock: {typeof p.quantity === 'number' ? p.quantity : 0}
                          </div>
                        </div>
                        
                        {p.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{p.description}</p>
                        )}
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openEdit(p)} 
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 font-medium"
                          >
                            <Pencil className="w-4 h-4" />
                            <span>Éditer</span>
                          </button>
                          <button 
                            onClick={() => remove(p.id)} 
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {modalOpen && (
        <div className="fixed inset-0 z-[9999]" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>setModalOpen(false)} />
          <div
            ref={modalRef}
            className="absolute right-0 top-0 h-full w-full sm:w-[600px] bg-white shadow-2xl p-6 overflow-y-auto overscroll-contain touch-pan-y"
            onClick={(e)=>e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {draft.id ? 'Modifier le produit' : 'Nouveau produit'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={save} className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="font-semibold">Pays:</span>
                  <span className="uppercase bg-white px-2 py-1 rounded border">{selectedCountry}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du produit *</label>
                <input 
                  ref={nameInputRef} 
                  value={draft.name} 
                  onChange={(e)=>setDraft({...draft, name:e.target.value})} 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300" 
                  placeholder="Nom du produit"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix (F CFA) *</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={draft.price} 
                    onChange={(e)=>setDraft({...draft, price:Number(e.target.value)})} 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300" 
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantité en stock</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={draft.quantity ?? 0} 
                    onChange={(e)=>setDraft({...draft, quantity:Number(e.target.value)})} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300" 
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                  <select 
                    value={draft.category} 
                    onChange={(e)=>{
                      const next = (e.target.value as 'restaurant' | 'gallery')
                      const firstSub = subcategoryOptions[next]?.[0] || ''
                      setDraft({...draft, category: next, subcategory: firstSub})
                    }} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                  >
                    <option value="restaurant">🍽️ Restaurant</option>
                    <option value="gallery">🎨 Galerie</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sous-catégorie</label>
                  <select 
                    value={draft.subcategory} 
                    onChange={(e)=>setDraft({...draft, subcategory:e.target.value})} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                  >
                    <option value="">— Sélectionner —</option>
                    {(subcategoryOptions[(draft.category as 'restaurant' | 'gallery')] || []).map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilité</label>
                <select 
                  value={draft.is_available ? '1' : '0'} 
                  onChange={(e)=>setDraft({...draft, is_available:e.target.value==='1'})} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                >
                  <option value="1">✅ Disponible</option>
                  <option value="0">❌ Indisponible</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image (URL)</label>
                  <input 
                    value={draft.image} 
                    onChange={(e)=>setDraft({...draft, image:e.target.value})} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300" 
                    placeholder="https://exemple.com/image.jpg" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléverser une image</label>
                  <UploadControl onUploaded={(url)=>setDraft({...draft, image:url})} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  value={draft.description} 
                  onChange={(e)=>setDraft({...draft, description:e.target.value})} 
                  rows={4} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300" 
                  placeholder="Description du produit..."
                />
              </div>
              
              <div className="sticky bottom-0 bg-white pt-6 pb-2 -mx-6 px-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={()=>setModalOpen(false)} 
                    className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 font-medium"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 font-medium"
                  >
                    {draft.id ? 'Mettre à jour' : 'Créer le produit'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Inline upload control for product images
const UploadControl: React.FC<{ onUploaded: (url: string) => void }> = ({ onUploaded }) => {
  const [busy, setBusy] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const handlePick = () => inputRef.current?.click()
  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('images').upload(path, file, {
        cacheControl: '3600', upsert: false, contentType: file.type || 'image/jpeg'
      })
      if (error) throw error
      const { data } = supabase.storage.from('images').getPublicUrl(path)
      if (data?.publicUrl) onUploaded(data.publicUrl)
    } catch (err) {
      alert("Échec du téléversement. Vérifiez le bucket 'images' et les permissions.")
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }
  return (
    <div className="flex items-center gap-2">
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
      <button type="button" onClick={handlePick} disabled={busy} className="inline-flex items-center gap-2 px-3 py-2 border rounded w-full justify-center">
        <UploadIcon className="w-4 h-4" /> {busy ? 'Téléversement…' : 'Choisir un fichier'}
      </button>
    </div>
  )
}

export default ProductsPage