import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useCountry } from '../contexts/CountryContext'
import { Plus, Trash2, Image as ImageIcon, MessageCircle, Search, Filter, Upload, Eye, Edit, X } from 'lucide-react'

interface DepartmentImage {
  id?: string
  department: string
  country: string
  image_url: string
  whatsapp_link: string
  title: string
  description: string
  created_at?: string
}

const DepartmentImagesPage: React.FC = () => {
  const { selectedCountry } = useCountry()
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState<DepartmentImage[]>([])
  const [filteredImages, setFilteredImages] = useState<DepartmentImage[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingImage, setEditingImage] = useState<DepartmentImage | null>(null)
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [newImage, setNewImage] = useState<DepartmentImage>({
    department: '',
    country: '',
    image_url: '',
    whatsapp_link: '',
    title: '',
    description: ''
  })

  // Utiliser les vrais pays de votre application
  const countries = [
    { code: 'BJ', name: 'Bénin', flag: '🇧🇯' },
    { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' }
  ]

  const mapSelectedCountryToCode = (c: string) => (c === 'benin' ? 'BJ' : c === 'cote-ivoire' ? 'CI' : '')

  // Utiliser les vrais départements de votre application avec leurs images
  const departments = [
    { id: 'building', name: 'PDG Building', image: '/images-galeries/PDG%20building.jpg.jpeg' },
    { id: 'com-events', name: 'PDG Com & Events', image: '/images-galeries/PDG COM & EVENTS.jpg' },
    { id: 'digital', name: 'PDG Digital Solutions', image: '/images-galeries/PDG Digital solutions.jpg.jpeg' },
    { id: 'galerie', name: 'PDG Galerie', image: '/images-galeries/PDG galerie.jpg.jpeg' },
    { id: 'learning', name: 'PDG Learning', image: '/images-galeries/PDG learning.jpg.jpeg' },
    { id: 'mobilier', name: 'PDG Mobilier', image: '/images-galeries/PDG mobilier.jpg.jpeg' },
    { id: 'projects', name: 'PDG Projects', image: '/images-galeries/PDG projects.jpg.jpeg' },
    { id: 'puzzles', name: 'PDG Puzzles', image: '/images-galeries/PDG puzzles.jpg.jpeg' },
    { id: 'cafe-bart', name: 'CAFÉ B\'ART PDG', image: '/images-galeries/Café b\'art pdg .jpg.jpeg' },
    { id: 'les-ateliers-pdg', name: 'Les Ateliers PDG', image: '/images-galeries/les-ateliers-pdg.jpeg' }
  ]

  useEffect(() => {
    loadImages()
    // Pré-sélectionner le pays courant dans les filtres et formulaires
    const code = mapSelectedCountryToCode(selectedCountry)
    setCountryFilter(code)
    setNewImage(prev => ({ ...prev, country: code }))
    if (editingImage) setEditingImage({ ...editingImage, country: code })
  }, [selectedCountry])

  useEffect(() => {
    filterImages()
  }, [images, searchTerm, selectedDepartment, countryFilter])

  const loadImages = async () => {
    try {
      const { data } = await supabase
        .from('department_images')
        .select('*')
        .eq('country', mapSelectedCountryToCode(selectedCountry))
        .order('created_at', { ascending: false })
      
      setImages(data || [])
    } catch (error) {
      }
    setLoading(false)
  }

  const filterImages = () => {
    let filtered = images

    if (searchTerm) {
      filtered = filtered.filter(img => 
        img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedDepartment) {
      filtered = filtered.filter(img => img.department === selectedDepartment)
    }

    if (countryFilter) {
      filtered = filtered.filter(img => img.country === countryFilter)
    }

    setFilteredImages(filtered)
  }

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `department-images/${fileName}`

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
      
      if (editingImage) {
        setEditingImage({...editingImage, image_url: imageUrl})
      } else {
        setNewImage({...newImage, image_url: imageUrl})
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

  const addImage = async () => {
    if (!newImage.department || !newImage.country || !newImage.image_url) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }
    
    try {
      const { error } = await supabase
        .from('department_images')
        .insert([newImage])
      
      if (error) throw error
      
      setNewImage({
        department: '',
        country: '',
        image_url: '',
        whatsapp_link: '',
        title: '',
        description: ''
      })
      setPreviewImage(null)
      setShowAddForm(false)
      loadImages()
      alert('Image ajoutée avec succès!')
    } catch (error) {
      alert('Erreur lors de l\'ajout de l\'image')
    }
  }

  const updateImage = async () => {
    if (!editingImage?.id) return
    
    try {
      const { error } = await supabase
        .from('department_images')
        .update(editingImage)
        .eq('id', editingImage.id)
      
      if (error) throw error
      
      setEditingImage(null)
      setPreviewImage(null)
      loadImages()
      alert('Image mise à jour avec succès!')
    } catch (error) {
      alert('Erreur lors de la mise à jour')
    }
  }

  const removeImage = async (id: string) => {
    if (!confirm('Supprimer cette image ?')) return
    
    try {
      const { error } = await supabase
        .from('department_images')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      loadImages()
      alert('Image supprimée!')
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  const startEdit = (image: DepartmentImage) => {
    setEditingImage({ ...image })
    setPreviewImage(null)
    setShowAddForm(true)
  }

  const cancelEdit = () => {
    setEditingImage(null)
    setShowAddForm(false)
    setPreviewImage(null)
    setNewImage({
      department: '',
      country: '',
      image_url: '',
      whatsapp_link: '',
      title: '',
      description: ''
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Images par Département</h2>
            <p className="text-gray-600">Gestion des images et liens WhatsApp par département et pays</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105 active:scale-95 font-medium"
          >
            <Plus className="w-4 h-4" />
            Ajouter une image
          </button>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
            >
              <option value="">Tous les départements</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>

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
                setSelectedDepartment('')
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
                {editingImage ? 'Modifier l\'image' : 'Ajouter une nouvelle image'}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Département *</label>
                <select
                  value={editingImage ? editingImage.department : newImage.department}
                  onChange={(e) => {
                    const value = e.target.value
                    if (editingImage) {
                      setEditingImage({...editingImage, department: value})
                    } else {
                      setNewImage({...newImage, department: value})
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                >
                  <option value="">Sélectionner un département</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pays *</label>
                <select
                  value={editingImage ? editingImage.country : newImage.country}
                  onChange={(e) => {
                    const value = e.target.value
                    if (editingImage) {
                      setEditingImage({...editingImage, country: value})
                    } else {
                      setNewImage({...newImage, country: value})
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Image *</label>
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
                  {(previewImage || (editingImage ? editingImage.image_url : newImage.image_url)) && (
                    <div className="relative">
                      <img
                        src={previewImage || (editingImage ? editingImage.image_url : newImage.image_url)}
                        alt="Aperçu"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null)
                          if (editingImage) {
                            setEditingImage({...editingImage, image_url: ''})
                          } else {
                            setNewImage({...newImage, image_url: ''})
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

                  {/* URL de l'image (pour affichage) */}
                  {(editingImage ? editingImage.image_url : newImage.image_url) && (
                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
                      <strong>URL:</strong> {(editingImage ? editingImage.image_url : newImage.image_url)}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lien WhatsApp</label>
                <input
                  type="url"
                  value={editingImage ? editingImage.whatsapp_link : newImage.whatsapp_link}
                  onChange={(e) => {
                    const value = e.target.value
                    if (editingImage) {
                      setEditingImage({...editingImage, whatsapp_link: value})
                    } else {
                      setNewImage({...newImage, whatsapp_link: value})
                    }
                  }}
                  placeholder="https://wa.me/..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                <input
                  type="text"
                  value={editingImage ? editingImage.title : newImage.title}
                  onChange={(e) => {
                    const value = e.target.value
                    if (editingImage) {
                      setEditingImage({...editingImage, title: value})
                    } else {
                      setNewImage({...newImage, title: value})
                    }
                  }}
                  placeholder="Titre de l'image"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={editingImage ? editingImage.description : newImage.description}
                  onChange={(e) => {
                    const value = e.target.value
                    if (editingImage) {
                      setEditingImage({...editingImage, description: value})
                    } else {
                      setNewImage({...newImage, description: value})
                    }
                  }}
                  placeholder="Description de l'image"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={editingImage ? updateImage : addImage}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105 active:scale-95 font-medium"
              >
                <Plus className="w-4 h-4" />
                {editingImage ? 'Mettre à jour' : 'Ajouter l\'image'}
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

        {/* Liste des images */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Images existantes ({filteredImages.length})
            </h3>
          </div>

          {filteredImages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Aucune image trouvée</p>
              <p className="text-sm">
                {images.length === 0 
                  ? 'Commencez par ajouter votre première image'
                  : 'Aucune image ne correspond à vos filtres'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image) => {
                const department = departments.find(d => d.id === image.department)
                const country = countries.find(c => c.code === image.country)
                
                return (
                  <div key={image.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-300">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                      <img
                        src={image.image_url}
                        alt={image.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {department?.image && (
                            <img 
                              src={department.image} 
                              alt={department.name}
                              className="w-4 h-4 object-cover rounded"
                            />
                          )}
                          <span>{department?.name}</span>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {country?.flag} {country?.name}
                        </span>
                      </div>
                      
                      {image.title && (
                        <h5 className="font-medium text-gray-900 text-sm">{image.title}</h5>
                      )}
                      
                      {image.description && (
                        <p className="text-xs text-gray-600 line-clamp-2">{image.description}</p>
                      )}
                      
                      {image.whatsapp_link && (
                        <a
                          href={image.whatsapp_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-700 transition-colors duration-300"
                        >
                          <MessageCircle className="w-3 h-3" />
                          WhatsApp
                        </a>
                      )}
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {image.created_at && new Date(image.created_at).toLocaleDateString('fr-FR')}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(image)}
                          className="flex items-center gap-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 text-xs"
                        >
                          <Edit className="w-3 h-3" />
                          Modifier
                        </button>
                        <button
                          onClick={() => removeImage(image.id!)}
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

export default DepartmentImagesPage

