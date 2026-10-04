import React, { useState, useEffect } from 'react'
import { Save, Globe, MapPin, Phone, Mail } from 'lucide-react'
import { useSiteSettings } from '../hooks/useSiteSettings'

interface SiteSettings {
  site_name: string
  site_description: string
  contact_email: string
  contact_phone: string
  address: string
  city: string
  opening_hours: string
  website_url: string
}

const SettingsPage: React.FC = () => {
  const [saving, setSaving] = useState(false)
  const { settings, loading, saveSettings: saveToDb, error } = useSiteSettings()
  const [localSettings, setLocalSettings] = useState<SiteSettings>({
    site_name: 'Espace Paserni',
    site_description: 'Restaurant et galerie d\'art',
    contact_email: '',
    contact_phone: '',
    address: '',
    city: '',
    opening_hours: 'Lun-Ven: 8h-18h, Sam: 9h-17h',
    website_url: ''
  })

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings)
    }
  }, [settings])

  const handleSave = async () => {
    setSaving(true)
    try {
      const success = await saveToDb(localSettings)
      if (success) {
        alert('Paramètres sauvegardés avec succès!')
      } else {
        alert('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      alert('Erreur lors de la sauvegarde')
    }
    setSaving(false)
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Paramètres</h2>
            <p className="text-gray-600">Configuration du site et gestion des images par département</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105 active:scale-95 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <p className="font-medium">Erreur</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Paramètres généraux */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Informations générales</h3>
              <p className="text-sm text-gray-600">Configuration de base du site</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du site</label>
                <input
                  type="text"
                  value={localSettings.site_name}
                  onChange={(e) => setLocalSettings({...localSettings, site_name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={localSettings.site_description}
                  onChange={(e) => setLocalSettings({...localSettings, site_description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL du site</label>
                <input
                  type="url"
                  value={localSettings.website_url}
                  onChange={(e) => setLocalSettings({...localSettings, website_url: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email de contact</label>
                <input
                  type="email"
                  value={localSettings.contact_email}
                  onChange={(e) => setLocalSettings({...localSettings, contact_email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={localSettings.contact_phone}
                  onChange={(e) => setLocalSettings({...localSettings, contact_phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horaires d'ouverture</label>
                <input
                  type="text"
                  value={localSettings.opening_hours}
                  onChange={(e) => setLocalSettings({...localSettings, opening_hours: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                  placeholder="Ex: Lun-Ven: 8h-18h, Sam: 9h-17h"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Adresse"
                value={localSettings.address}
                onChange={(e) => setLocalSettings({...localSettings, address: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
              />
              <input
                type="text"
                placeholder="Ville"
                value={localSettings.city}
                onChange={(e) => setLocalSettings({...localSettings, city: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SettingsPage
