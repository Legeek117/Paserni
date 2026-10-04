
import React from 'react'
import { MessageCircle } from 'lucide-react'
import { useDepartmentImages } from '../hooks/useDepartmentImages'
import { useCountry } from '../contexts/CountryContext'

interface DepartmentImagesProps {
  department: string
  showWhatsApp?: boolean
  showTitle?: boolean
  showDescription?: boolean
  className?: string
  imageClassName?: string
}

const DepartmentImages: React.FC<DepartmentImagesProps> = ({
  department,
  showWhatsApp = true,
  showTitle = true,
  showDescription = true,
  className = '',
  imageClassName = ''
}) => {
  const { getImagesByDepartmentAndCountry, loading } = useDepartmentImages()
  const { selectedCountry } = useCountry()

  // Récupérer les images pour ce département et ce pays
  const images = getImagesByDepartmentAndCountry(department, selectedCountry === 'benin' ? 'BJ' : 'CI')

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
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center ${className} ${imageClassName}`}>
      {images.map((image) => (
        <div key={image.id} className={`w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300`}>
          {/* Image */}
          <div className="w-full bg-gray-100 overflow-hidden">
            {/* Fixed height containers to force landscape crop on md+ */}
            <div className="h-40 md:h-44 lg:h-48 xl:h-52 overflow-hidden">
              <img
                src={image.image_url}
                alt={image.title || department}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.jpg' }}
              />
            </div>
          </div>

          {/* Contenu sous l'image */}
          <div className="p-4">
            {showTitle && image.title && (
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{image.title}</h3>
            )}

            {showDescription && image.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{image.description}</p>
            )}

            {/* Bouton WhatsApp */}
            {showWhatsApp && image.whatsapp_link && (
              <a
                href={image.whatsapp_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-sm hover:shadow-md"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Voir plus sur WhatsApp
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default DepartmentImages
