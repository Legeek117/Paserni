import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, MapPin, ExternalLink, Power, PowerOff } from 'lucide-react';
import { bannerService, Banner } from '../services/bannerService';
import ImageUpload from '../components/ImageUpload';
import { countries, Country, useCountry } from '../contexts/CountryContext';

const BannersPage: React.FC = () => {
  const { selectedCountry } = useCountry();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<Partial<Banner>>({
    title: '',
    description: '',
    image: '',
    link: '',
    link_text: 'En savoir plus',
    start_date: '',
    end_date: '',
    countries: [],
    pages: [],
    priority: 1,
    is_active: true,
    background_color: '#ffffff',
    text_color: '#000000',
    position: 'top',
    size: 'medium'
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const allBanners = await bannerService.getBanners(true);
      setBanners(allBanners);
    } catch (error) {
      // Erreur lors du chargement des bannières
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        await bannerService.updateBanner(editingBanner.id, formData);
      } else {
        await bannerService.createBanner(formData as Omit<Banner, 'id' | 'created_at' | 'updated_at'>);
      }
      setShowForm(false);
      setEditingBanner(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        link: '',
        link_text: 'En savoir plus',
        start_date: '',
        end_date: '',
        countries: [],
        pages: [],
        priority: 1,
        is_active: true,
        background_color: '#ffffff',
        text_color: '#000000',
        position: 'top',
        size: 'medium'
      });
      loadBanners();
    } catch (error) {
      // Erreur lors de la sauvegarde
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData(banner);
    setShowForm(true);
  };

  const handleDelete = async (bannerId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette bannière ?')) {
      try {
        await bannerService.deleteBanner(bannerId);
        loadBanners();
      } catch (error) {
        // Erreur lors de la suppression
      }
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      await bannerService.updateBanner(banner.id, { is_active: !banner.is_active });
      loadBanners();
    } catch (error) {
      // Erreur lors de la mise à jour
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion des Bannières</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 mt-2">
            <p className="text-sm sm:text-base">Créez et gérez vos bannières publicitaires</p>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm w-fit">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Vue: {countries[selectedCountry]?.flag} {countries[selectedCountry]?.name}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm sm:text-base">Nouvelle Bannière</span>
        </button>
      </div>

      {/* Formulaire de création/édition */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            {editingBanner ? 'Modifier la bannière' : 'Nouvelle bannière'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priorité
                </label>
                <input
                  type="number"
                  value={formData.priority || 1}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  min="1"
                  max="10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image de la bannière
              </label>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                onError={() => {/* Erreur upload */}}
                maxWidth={1200}
                maxHeight={800}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pays ciblés
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.values(countries).map((country) => (
                  <label key={country.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.countries?.includes(country.id) || false}
                      onChange={(e) => {
                        const currentCountries = formData.countries || [];
                        const updatedCountries = e.target.checked
                          ? [...currentCountries, country.id]
                          : currentCountries.filter(id => id !== country.id);
                        setFormData({ ...formData, countries: updatedCountries });
                      }}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      {country.flag} {country.name}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Laissez vide pour afficher dans tous les pays
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lien de destination
                </label>
                <input
                  type="url"
                  value={formData.link || ''}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://exemple.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texte du bouton
                </label>
                <input
                  type="text"
                  value={formData.link_text || ''}
                  onChange={(e) => setFormData({ ...formData, link_text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="En savoir plus"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_date ? new Date(formData.start_date).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin
                </label>
                <input
                  type="datetime-local"
                  value={formData.end_date ? new Date(formData.end_date).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <select
                  value={formData.position || 'top'}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value as 'top' | 'center' | 'bottom' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="top">Haut</option>
                  <option value="center">Centre</option>
                  <option value="bottom">Bas</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active || false}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">Bannière active</span>
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingBanner(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                {editingBanner ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des bannières */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold">Bannières ({banners.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                  Bannière
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Statut
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Période
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4">
                    <div className="flex items-start sm:items-center gap-3">
                      {banner.image && (
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="w-12 h-9 sm:w-16 sm:h-12 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => {
                            const img = e.currentTarget as HTMLImageElement;
                            img.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">{banner.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{banner.description}</div>
                        <div className="text-xs text-gray-400 space-y-1 mt-1">
                          <div className="flex items-center gap-2">
                            <span>Priorité: {banner.priority}</span>
                            {/* Statut visible sur mobile dans la première colonne */}
                            <span className="sm:hidden">
                              {banner.is_active ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                                  Inactive
                                </span>
                              )}
                            </span>
                          </div>
                          {banner.countries && banner.countries.length > 0 ? (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className={`${banner.countries.includes(selectedCountry) ? 'text-green-600' : 'text-gray-400'} truncate`}>
                                {banner.countries.map(countryId => {
                                  const country = countries[countryId as Country];
                                  return country ? `${country.flag} ${country.name}` : countryId;
                                }).join(', ')}
                              </span>
                              {banner.countries.includes(selectedCountry) && (
                                <span className="text-green-500 text-xs">✓</span>
                              )}
                            </div>
                          ) : (
                            <div className="text-green-600">🌍 Tous les pays <span className="text-xs">✓</span></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(banner)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          banner.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                        }`}
                      >
                        {banner.is_active ? (
                          <>
                            <Power className="w-4 h-4" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <PowerOff className="w-4 h-4" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                      
                      <div className="text-xs text-gray-500">
                        {banner.is_active ? 'Visible sur le site' : 'Masquée'}
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-3 sm:px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {banner.start_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span className="truncate">{new Date(banner.start_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {banner.end_date && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span className="truncate">{new Date(banner.end_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex-shrink-0"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      {banner.link && (
                        <a
                          href={banner.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                          title="Voir le lien"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BannersPage;
