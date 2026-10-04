// Centralized seed data built from current public pages
// Used to import existing site items into Supabase products

export type SeedProduct = {
  name: string
  description: string
  price: number
  image: string
  category: 'restaurant' | 'gallery' | 'mobilier'
  subcategory?: string
  is_available: boolean
}

// Restaurant items (from src/pages/Restaurant.tsx)
  // plats
  // accompagnements
  // jus
  // bieres
  // liqueur

// Galerie (COM & EVENTS + BUILDING)
export const restaurantSeed: SeedProduct[] = [
  // restaurant seed intentionally left empty — removed items per request
]

export const gallerySeed: SeedProduct[] = [
  { name: 'Puzzle Chien Numérique', description: "Un puzzle éducatif plein de couleurs qui éveille l'esprit des petits artistes.", price: 15000, image: '/galeries/puzzle-chien.jpg.jpg', category: 'gallery', subcategory: 'decorative', is_available: true },
  { name: 'Sac Amazone', description: "Sac à dos inspiré des amazones, alliant style, résistance et fierté culturelle.", price: 25000, image: '/galeries/sac-amazone.jpg.jpg', category: 'gallery', subcategory: 'fashion', is_available: true },
  { name: 'CafébArt – Comptoir', description: "Un espace chaleureux où la créativité sert de décor et de moteur.", price: 50000, image: '/galeries/cafebart-comptoir.jpg.jpg', category: 'gallery', subcategory: 'decorative', is_available: true },
  { name: 'Sac Guerrière', description: "Sac à dos unique, célébrant la force et l'élégance à la béninoise.", price: 25000, image: '/galeries/sac-guerriere.jpg.jpg', category: 'gallery', subcategory: 'fashion', is_available: true },
  { name: 'Terrasse Nocturne', description: 'Ambiance lumineuse et conviviale pour des soirées créatives inoubliables.', price: 30000, image: '/galeries/terasse-nuit.jpg.jpg', category: 'gallery', subcategory: 'decorative', is_available: true },
  { name: 'Masque Bleu', description: 'Un masque stylisé qui rend hommage aux traditions avec une touche moderne.', price: 20000, image: '/galeries/masque-bleu.jpg.jpg', category: 'gallery', subcategory: 'decorative', is_available: true },
  { name: 'Bienvenue au Temple de la Créativité', description: 'Notre credo gravé sur les murs : inspirer, créer et partager.', price: 40000, image: '/galeries/mur-bienvenue.jpg.jpg', category: 'gallery', subcategory: 'decorative', is_available: true },
]
