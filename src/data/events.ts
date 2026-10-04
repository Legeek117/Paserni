// Sample events data for the calendar
export interface Event {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  price: string;
  category: 'workshop' | 'cultural' | 'social' | 'formation';
  ageGroup: string;
  recurring: 'weekly' | 'monthly' | 'none';
  location: string;
}

// Helper function to get location based on country

export const getEventLocation = (country: string): string => {
  return country === 'cote-ivoire' ? 'Espace Paserni, Abidjan' : 'Espace Paserni, Porto-Novo';
};

export const weeklyEvents: Event[] = [
  {
    id: 'bricolart',
    title: "Bricol'Art",
    description: "Atelier créatif pour enfants mêlant bricolage et art. Développement de la créativité et des compétences manuelles.",
    start: new Date(2025, 0, 15, 15, 0), // January 15, 2025, 3:00 PM
    end: new Date(2025, 0, 15, 17, 0),   // January 15, 2025, 5:00 PM
    price: "2 000 F CFA",
    category: 'workshop',
    ageGroup: "5 à 15 ans",
    recurring: 'weekly',
    location: "Espace Paserni, Porto-Novo"
  },
  {
    id: 'soiree-artistique',
    title: "Soirée Artistique",
    description: "Rencontre créative ouverte à tous. Échanges, performances, découvertes artistiques.",
    start: new Date(2025, 0, 17, 18, 0), // January 17, 2025, 6:00 PM
    end: new Date(2025, 0, 17, 22, 0),   // January 17, 2025, 10:00 PM
    price: "Gratuit",
    category: 'social',
    ageGroup: "Tout public",
    recurring: 'weekly',
    location: "Espace Paserni, Porto-Novo"
  },
  {
    id: 'matinee-culturelle',
    title: "Matinée Culturelle",
    description: "Découverte de la culture béninoise et africaine à travers conférences, projections et débats.",
    start: new Date(2025, 0, 18, 10, 0), // January 18, 2025, 10:00 AM
    end: new Date(2025, 0, 18, 12, 0),   // January 18, 2025, 12:00 PM
    price: "Gratuit",
    category: 'cultural',
    ageGroup: "Tout public",
    recurring: 'weekly',
    location: "Espace Paserni, Porto-Novo"
  },
  {
    id: 'apres-midi-cocreatif',
    title: "Après-midi Co-créatif",
    description: "Session collaborative de création artistique. Projets collectifs et partage de compétences.",
    start: new Date(2025, 0, 18, 15, 0), // January 18, 2025, 3:00 PM
    end: new Date(2025, 0, 18, 17, 0),   // January 18, 2025, 5:00 PM
    price: "3 000 F CFA",
    category: 'workshop',
    ageGroup: "Adolescents et adultes",
    recurring: 'weekly',
    location: "Espace Paserni, Porto-Novo"
  }
];
export const formations: Event[] = [
  {
    id: 'alonuzo',
    title: "Programme ALONUZO",
    description: "Formation complète en arts appliqués, design graphique et communication visuelle. Programme intensif avec suivi personnalisé.",
    start: new Date(2025, 9, 1, 9, 0),  // October 1, 2025, 9:00 AM
    end: new Date(2026, 9, 1, 17, 0),   // October 1, 2026, 5:00 PM
    price: "500 000 F CFA",
    category: 'formation',
    ageGroup: "Adultes",
    recurring: 'none',
    location: "Espace Paserni, Porto-Novo"
  },
  {
    id: 'global-design',
    title: "Formation Global Design",
    description: "Formation polyvalente couvrant le design global : graphisme, web design, décoration intérieure et créativité digitale.",
    start: new Date(2026, 1, 1, 9, 0),  // February 1, 2026, 9:00 AM
    end: new Date(2026, 10, 1, 17, 0),  // November 1, 2026, 5:00 PM
    price: "300 000 F CFA",
    category: 'formation',
    ageGroup: "Adultes",
    recurring: 'none',
    location: "Espace Paserni, Porto-Novo"
  }
];
