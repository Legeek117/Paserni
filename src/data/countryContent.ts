import { Country } from '../contexts/CountryContext';

export interface CountryContent {
  restaurant: {
    description: string;
    menuItems: Array<{
      name: string;
      description: string;
      price: string;
      dietary: string;
      image: string;
    }>;
  };
  gallery: {
    description: string;
    artworks: Array<{
      title: string;
      description: string;
      image: string;
      artist: string;
    }>;
  };
  programs: {
    culturalMorning: {
      title: string;
      description: string;
    };
  };
  events: {
    location: string;
  };
  seo: {
    description: string;
    keywords: string;
  };
  partners?: string[];
}

      // Placez vos fichiers dans public/partners/BJ et ajustez les noms ci-dessous
      // Placez vos fichiers dans public/partners/CI et ajustez les noms ci-dessous

export const countryContent: Record<Country, CountryContent> = {
  'benin': {
    restaurant: {
      description: "Savourez une cuisine créative dans un cadre artistique unique. Notre menu mélange traditions culinaires béninoises et créativité moderne.",
      menuItems: [
        { name: "Akassa aux Légumes", description: "Plat traditionnel béninois revisité avec légumes frais de saison", price: "3 500 F CFA", dietary: "Végétarien", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg" },
        { name: "Mousse au Chocolat Local", description: "Mousse onctueuse au chocolat béninois, servie avec fruits frais", price: "2 200 F CFA", dietary: "Chocolat local", image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg" }
      ]
    },
    gallery: {
      description: "Chaque œuvre raconte une histoire et porte en elle l'âme créative du Bénin.",
      artworks: [
        { title: "Harmonie Africaine", description: "Peinture acrylique sur toile représentant la diversité culturelle du Bénin.", image: "/galerie/harmonie-africaine.jpg", artist: "Artiste Béninois" }
      ]
    },
    programs: {
      culturalMorning: {
        title: "Matinée Culturelle",
        description: "Découverte de la culture béninoise et africaine à travers conférences, projections et débats."
      }
    },
    events: {
      location: "Espace Paserni, Porto-Novo"
    },
    seo: {
      description: "Centre créatif, artistique et culturel au Bénin. Formations, galerie d'art, restaurant et événements culturels à Porto-Novo.",
      keywords: "Espace Paserni, art Bénin, culture Bénin, formation artistique, galerie art, restaurant Porto-Novo"
    },
    partners: [
      '/Partenaires/BJ/adac.jpeg',
      '/Partenaires/BJ/fundlab.jpeg',
      '/Partenaires/BJ/La-Centrale-Company.png',
      '/Partenaires/BJ/canal-plus-sport.jpeg',
      '/Partenaires/BJ/hiris.jpeg',
      '/Partenaires/BJ/Programme-Alimentaire-Mondial.jpeg'
    ]
  },
  'cote-ivoire': {
    restaurant: {
      description: "Savourez une cuisine créative dans un cadre artistique unique. Notre menu mélange traditions culinaires ivoiriennes et créativité moderne.",
      menuItems: [
        { name: "Attiéké aux Légumes", description: "Plat traditionnel ivoirien revisité avec légumes frais de saison", price: "3 500 F CFA", dietary: "Végétarien", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg" },
        { name: "Mousse au Chocolat Local", description: "Mousse onctueuse au chocolat ivoirien, servie avec fruits frais", price: "2 200 F CFA", dietary: "Chocolat local", image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg" }
      ]
    },
    gallery: {
      description: "Chaque œuvre raconte une histoire et porte en elle l'âme créative de la Côte d'Ivoire.",
      artworks: [
        { title: "Harmonie Africaine", description: "Peinture acrylique sur toile représentant la diversité culturelle de la Côte d'Ivoire.", image: "/galerie/harmonie-africaine.jpg", artist: "Artiste Ivoirien" }
      ]
    },
    programs: {
      culturalMorning: {
        title: "Matinée Culturelle",
        description: "Découverte de la culture ivoirienne et africaine à travers conférences, projections et débats."
      }
    },
    events: {
      location: "Espace Paserni, Abidjan"
    },
    seo: {
      description: "Centre créatif, artistique et culturel en Côte d'Ivoire. Formations, galerie d'art, restaurant et événements culturels à Abidjan.",
      keywords: "Espace Paserni, art Côte d'Ivoire, culture Côte d'Ivoire, formation artistique, galerie art, restaurant Abidjan"
    },
    partners: [
      '/Partenaires/CI/Biomérieux.jpeg',
      '/Partenaires/CI/cgm.png',
      '/Partenaires/CI/cerco.png',
      '/Partenaires/CI/cocan.jpeg',
      '/Partenaires/CI/Group.jpeg'
    ]
  }
};
export const getCountryContent = (country: Country): CountryContent => {
  return countryContent[country];
};
