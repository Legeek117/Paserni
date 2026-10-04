import React from 'react'
// Dynamic images are intentionally excluded from the homepage per product spec
import ServicesScroll from './ServicesScroll'
import { createImageWithFallback } from '../utils/imageFallback'

interface DepartmentScrollProps {
  className?: string
  speedPxPerStep?: number
  intervalMs?: number
}

const DepartmentScroll: React.FC<DepartmentScrollProps> = ({ 
  className, 
  speedPxPerStep = 1, 
}) => {
  // No dynamic fetch here: homepage shows only the static department entries

  // Images statiques par défaut
  const staticDepartmentImages = [
    { id: 'building', src: "/images-galeries/PDG%20building.jpg.jpeg", alt: "PDG Building", title: "PDG BUILDING" },
    { id: 'com-events', src: "/images-galeries/PDG COM & EVENTS.jpg", alt: "PDG Com & Events", title: "PDG COM & EVENTS" },
    { id: 'digital', src: "/images-galeries/PDG Digital solutions.jpg.jpeg", alt: "PDG Digital Solutions", title: "PDG DIGITAL SOLUTIONS" },
    { id: 'galerie', src: "/images-galeries/PDG galerie.jpg.jpeg", alt: "PDG Galerie", title: "PDG GALERIE" },
    { id: 'learning', src: "/images-galeries/PDG learning.jpg.jpeg", alt: "PDG Learning", title: "PDG LEARNING" },
    { id: 'mobilier', src: "/images-galeries/PDG mobilier.jpg.jpeg", alt: "PDG Mobilier", title: "PDG MOBILIER" },
    { id: 'projects', src: "/images-galeries/PDG projects.jpg.jpeg", alt: "PDG Projects", title: "PDG PROJECTS" },
    { id: 'puzzles', src: "/images-galeries/PDG puzzles.jpg.jpeg", alt: "PDG Puzzles", title: "PDG PUZZLES" },
    { id: 'cafe-bart', src: "/images-galeries/Café b'art pdg .jpg.jpeg", alt: "Café b'Art PDG", title: "CAFÉ B'ART PDG" },
    { id: 'les-ateliers', src: "/images-galeries/les-ateliers-pdg.jpeg", alt: "Les Ateliers PDG", title: "LES ATELIERS PDG" },
  ]

  // Récupérer les images dynamiques pour chaque département
  // const countryCode = selectedCountry === 'benin' ? 'BJ' : 'CI'
  
  // Commencer avec les images statiques par défaut
  const deptPages: Record<string, string> = {
    building: '/departements/pdg-building-gallery',
    'com-events': '/departements/pdg-com-events-gallery',
    mobilier: '/departements/pdg-mobilier-gallery',
    puzzles: '/departements/pdg-puzzles-gallery',
    digital: '/departements/pdg-digital-solutions-gallery',
    galerie: '/departements/pdg-galerie-gallery',
    learning: '/departements/pdg-learning-gallery',
    projects: '/departements/pdg-projects-gallery',
    'cafe-bart': '/departements/pdg-cafe-gallery',
    'les-ateliers': '/departements/les-ateliers-pdg-gallery'
  }

  const allImages = staticDepartmentImages.map(dept => ({
    id: dept.id,
    imageSrc: dept.src,
    alt: dept.alt,
    title: dept.title,
    href: deptPages[dept.id] || `/departements#${dept.id}`,
    whatsappLink: undefined
  }))

  // Dynamic images are excluded from the homepage

  // No loading state needed since we don't fetch here

  return (
    <ServicesScroll 
      services={allImages}
      className={className}
      speedPxPerStep={speedPxPerStep}
    />
  )
}

export default DepartmentScroll



