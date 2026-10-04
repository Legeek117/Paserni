import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useCountry } from '../contexts/CountryContext'
import { Plus, Trash2, Edit, Upload, X, Building, Search, Filter } from 'lucide-react'

interface Department {
  id?: string
  name: string
  slug: string
  description: string
  image_url: string
  country: string
  whatsapp_link: string
  order: number
  is_active: boolean
  created_at?: string
}

const DepartmentsPage: React.FC = () => {
  const { selectedCountry } = useCountry()
  const [loading, setLoading] = useState(true)
  const [departments, setDepartments] = useState<Department[]>([])
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [newDepartment, setNewDepartment] = useState<Department>({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    country: '',
    whatsapp_link: '',
    order: 0,
    is_active: true
  })

  // Utiliser les vrais pays de votre application
  const countries = [
    { code: 'BJ', name: 'Bénin', flag: '🇧🇯' },
    { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' }
  ]

  const mapSelectedCountryToCode = (c: string) => (c === 'benin' ? 'BJ' : c === 'cote-ivoire' ? 'CI' : '')

  useEffect(() => {
    loadDepartments()
    // Pré-sélectionner le pays courant dans les filtres et formulaires
    const code = mapSelectedCountryToCode(selectedCountry)
    setCountryFilter(code)
    setNewDepartment(prev => ({ ...prev, country: code }))
    if (editingDepartment) setEditingDepartment({ ...editingDepartment, country: code })
  }, [selectedCountry])

  useEffect(() => {
    filterDepartments()
  }, [departments, searchTerm, countryFilter])

  const loadDepartments = async () => {
    try {
      const { data } = await supabase
        .from('departments')
        .select('*')
        .eq('country', mapSelectedCountryToCode(selectedCountry))
        .order('order', { ascending: true })
      
      setDepartments(data || [])
    } catch (error) {
      }
    setLoading(false)
  }

  const filterDepartments = () => {
    let filtered = departments

    if (searchTerm) {
      filtered = filtered.filter(dept => 
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.slug.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (countryFilter) {
      filtered = filtered.filter(dept => dept.country === countryFilter)
    }

    setFilteredDepartments(filtered)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9\s-]/g, '') // Supprimer les caractères spéciaux
      .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
      .replace(/-+/g, '-') // Supprimer les tirets multiples
      .trim()
  }

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `departments/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image')
      return
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La taille du fichier ne doit pas dépasser 5MB')
      return
    }

    setUploading(true)
    try {
      const imageUrl = await uploadImage(file)
      
      if (editingDepartment) {
        setEditingDepartment({...editingDepartment, image_url: imageUrl})
      } else {
        setNewDepartment({...newDepartment, image_url: imageUrl})
      }
      
      // Créer un aperçu local
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
    } catch (error) {
      alert('Erreur lors de l\'upload de l\'image')
    } finally {
      setUploading(false)
    }
  }

  const addDepartment = async () => {
    if (!newDepartment.name || !newDepartment.country) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    // Générer le slug automatiquement si vide
    const slug = newDepartment.slug || generateSlug(newDepartment.name)
    
    try {
      const { error } = await supabase
        .from('departments')
        .insert([{
          ...newDepartment,
          slug: slug
        }])
      
      if (error) throw error
      
      setNewDepartment({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        country: mapSelectedCountryToCode(selectedCountry),
        whatsapp_link: '',
        order: departments.length,
        is_active: true
      })
      setPreviewImage(null)
      setShowAddForm(false)
      loadDepartments()
      alert('Département ajouté avec succès!')
    } catch (error) {
      alert('Erreur lors de l\'ajout du département')
    }
  }

  const updateDepartment = async () => {
    if (!editingDepartment?.id) return
    
    try {
      const { error } = await supabase
        .from('departments')
        .update(editingDepartment)
        .eq('id', editingDepartment.id)
      
      if (error) throw error
      
      setEditingDepartment(null)
      setPreviewImage(null)
      loadDepartments()
      alert('Département mis à jour avec succès!')
    } catch (error) {
      alert('Erreur lors de la mise à jour')
    }
  }

  const removeDepartment = async (id: string) => {
    if (!confirm('Supprimer ce département ?')) return
    
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      loadDepartments()
      alert('Département supprimé!')
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  const startEdit = (department: Department) => {
    setEditingDepartment({ ...department })
    setPreviewImage(null)
    setShowAddForm(true)
  }

  const cancelEdit = () => {
    setEditingDepartment(null)
    setShowAddForm(false)
    setPreviewImage(null)
    setNewDepartment({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      country: mapSelectedCountryToCode(selectedCountry),
      whatsapp_link: '',
      order: departments.length,
      is_active: true
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (loading) {
    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 animate-fadeIn">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 animate-fadeIn">
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Gestion des Départements</h2>
            <p className="text-gray-600">Gérer les départements et leurs informations</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105 active:scale-95 font-medium"
          >
            <Plus className="w-4 h-4" />
            Ajouter un département
          </button>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
              />
            </div>

            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
            >
              <option value="">Tous les pays</option>
              {countries.map(country => (
                <option key={country.code} value={country.code}>{country.flag} {country.name}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm('')
                setCountryFilter('')
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
            >
              <Filter className="w-4 h-4" />
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Formulaire d'ajout/modification */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingDepartment ? 'Modifier le département' : 'Ajouter un nouveau département'}
              </h3>
              <button
                onClick={cancelEdit}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du département *</label>
                <input
                  type="text"
                  value={editingDepartment ? editingDepartment.name : newDepartment.name}
                  onChange={(e) => {
                    const value = e.target.value
                    if (editingDepartment) {
                      setEditingDepartment({...editingDepartment, name: value})
                    } else {
                      setNewDepartment({...newDepartment, name: value, slug: generateSlug(value)})
                    }
                  }}
                  placeholder="Ex: PDG Building"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                <input
                  type="text"
                  value={editingDepartment ? editingDepartment.slug : newDepartment.slug}
                  onChange={(e) => {
                    const value = e.target.value
                    if (editingDepartment) {
                      setEditingDepartment({...editingDepartment, slug: value})
                    } else {
                      setNewDepartment({...newDepartment, slug: value})
                    }
                  }}
                  placeholder="Ex: pdg-building"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pays *</label>
                <select
                  value={editingDepartment ? editingDepartment.country : newDepartment.country}
                  onChange={(e) => {
                    const value = e.target.value
                    if (editingDepartment) {
                      setEditingDepartment({...editingDepartment, country: value})
                    } else {
                      setNewDepartment({...newDepartment, country: value})
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                >
                  <option value="">Sélectionner un pays</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>{country.flag} {country.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordre d'affichage</label>
                <input
                  type="number"
                  value={editingDepartment ? editingDepartment.order : newDepartment.order}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0
                    if (editingDepartment) {
                      setEditingDepartment({...editingDepartment, order: value})
                    } else {
                      setNewDepartment({...newDepartment, order: value})
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lien WhatsApp</label>
                <input
                  type="url"
                  value={editingDepartment ? editingDepartment.whatsapp_link : newDepartment.whatsapp_link}
                  onChange={(e) => {
                    const value = e.target.value
                    if (editingDepartment) {
                      setEditingDepartment({...editingDepartment, whatsapp_link: value})
                    } else {
                      setNewDepartment({...newDepartment, whatsapp_link: value})
                    }
                  }}
                  placeholder="https://wa.me/..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingDepartment ? editingDepartment.is_active : newDepartment.is_active}
                    onChange={(e) => {
                      const value = e.target.checked
                      if (editingDepartment) {
                        setEditingDepartment({...editingDepartment, is_active: value})
                      } else {
                        setNewDepartment({...newDepartment, is_active: value})
                      }
                    }}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Actif</span>
                </label>
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editingDepartment ? editingDepartment.description : newDepartment.description}
                  onChange={(e) => {
                    const value = e.target.value
                    if (editingDepartment) {
                      setEditingDepartment({...editingDepartment, description: value})
                    } else {
                      setNewDepartment({...newDepartment, description: value})
                    }
                  }}
                  placeholder="Description du département..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <div className="space-y-3">
                  {/* Upload d'image */}
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-300 flex items-center justify-center gap-2 text-gray-600 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                          <span>Upload en cours...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Choisir une image</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Aperçu de l'image */}
                  {(previewImage || (editingDepartment ? editingDepartment.image_url : newDepartment.image_url)) && (
                    <div className="relative">
                      <img
                        src={previewImage || (editingDepartment ? editingDepartment.image_url : newDepartment.image_url)}
                        alt="Aperçu"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null)
                          if (editingDepartment) {
                            setEditingDepartment({...editingDepartment, image_url: ''})
                          } else {
                            setNewDepartment({...newDepartment, image_url: ''})
                          }
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ''
                          }
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={editingDepartment ? updateDepartment : addDepartment}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105 active:scale-95 font-medium"
              >
                <Plus className="w-4 h-4" />
                {editingDepartment ? 'Mettre à jour' : 'Ajouter le département'}
              </button>
              <button
                onClick={cancelEdit}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Liste des départements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Départements existants ({filteredDepartments.length})
            </h3>
          </div>

          {filteredDepartments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Building className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Aucun département trouvé</p>
              <p className="text-sm">
                {departments.length === 0 
                  ? 'Commencez par ajouter votre premier département'
                  : 'Aucun département ne correspond à vos filtres'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDepartments.map((department) => {
                const country = countries.find(c => c.code === department.country)
                
                return (
                  <div key={department.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-300">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                      {department.image_url ? (
                        <img
                          src={department.image_url}
                          alt={department.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Building className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {country?.flag} {country?.name}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${department.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {department.is_active ? 'Actif' : 'Inactif'}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Ordre: {department.order}
                        </span>
                      </div>
                      
                      <h5 className="font-medium text-gray-900">{department.name}</h5>
                      <p className="text-xs text-gray-600 line-clamp-2">{department.description}</p>
                      <p className="text-xs text-gray-500 font-mono">/{department.slug}</p>
                      
                      {department.whatsapp_link && (
                        <a
                          href={department.whatsapp_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-700 transition-colors duration-300"
                        >
                          WhatsApp
                        </a>
                      )}
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {department.created_at && new Date(department.created_at).toLocaleDateString('fr-FR')}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(department)}
                          className="flex items-center gap-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 text-xs"
                        >
                          <Edit className="w-3 h-3" />
                          Modifier
                        </button>
                        <button
                          onClick={() => removeDepartment(department.id!)}
                          className="flex items-center gap-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 text-xs"
                        >
                          <Trash2 className="w-3 h-3" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DepartmentsPage
