import React from 'react'
import { MessageCircle } from 'lucide-react'
import { useDepartmentImages } from '../hooks/useDepartmentImages'
import { useCountry } from '../contexts/CountryContext'

interface DynamicGalleryImagesProps {
  department: string
  className?: string
}

const DynamicGalleryImages: React.FC<DynamicGalleryImagesProps> = ({
  department,
  className = ''
}) => {
  const { getImagesByDepartmentAndCountry, loading } = useDepartmentImages()
  const { selectedCountry } = useCountry()

  // Récupérer les images pour ce département et ce pays
  const countryCode = selectedCountry === 'benin' ? 'BJ' : 'CI'
  const images = getImagesByDepartmentAndCountry(department, countryCode)

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (images.length === 0) {
    return null
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {images.map((image) => (
        <div key={image.id} className="group relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
          {/* Image */}
          <div className="aspect-video overflow-hidden">
            <img
              src={image.image_url}
              alt={image.title || department}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-image.jpg';
              }}
            />
          </div>
          
          {/* Overlay avec informations */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
            <div className="w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className="bg-white rounded-lg p-3 shadow-lg">
                {image.title && (
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{image.title}</h3>
                )}
                {image.description && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{image.description}</p>
                )}
                
                {/* Bouton WhatsApp */}
                {image.whatsapp_link && (
                  <a
                    href={image.whatsapp_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors duration-300"
                  >
                    <MessageCircle className="w-3 h-3" />
                    Contacter via WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DynamicGalleryImages
