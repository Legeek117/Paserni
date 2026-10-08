import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDepartmentImages } from '../hooks/useDepartmentImages';
import { useCountry } from '../contexts/CountryContext';
import { matchesCountry } from '../lib/country';

const sections = [
  { id: 'building', title: 'PDG BUILDING', image: '/images-galeries/PDG%20building.jpg.jpeg', description: "Envie de construire la maison de votre rêve ou de transformer vos espaces (maison, bureau, boutique...) en un bout de paradis, notre département PDG BUILDING met à votre disposition un panel de compétences en architecture d'intérieur et en ingénierie du bâtiment. Nous vous accompagnons depuis votre idée jusqu'à sa mise en œuvre avec la motivation de rendre votre projet exceptionnel et fonctionnel. Nos équipes d'ingénieurs, d'architectes, de designers et d'artisans n'attendent que vous pour relever le défi de sublimer vos espaces et vos projets de construction." },
  { id: 'com-events', title: 'PDG COM & EVENTS', image: '/images-galeries/PDG COM & EVENTS.jpg', description: "Nous exerçons l'art de la communication avec beaucoup de passion en vous proposant des stratégies qui sortent des sentiers battus afin de décrocher et fidéliser vos cibles rapidement. Chez nous l'événementiel est un véritable terrain de créativité où nous déployons grâce à notre équipe expérimentée et professionnelle une scénographie et une organisation qui subliment vos événements et les rendent juste exquis. De la déco aux couverts passant par la logistique générale, tout est pensé de façon personnalisée afin de rendre votre événement unique. Nos années d'expériences en matière de décors et de scénographie sur de grands projets événementiels nationaux et internationaux nous permettent de vous offrir un design d'espace hors du commun pour tous types d'événements." },
  { id: 'digital', title: 'PDG DIGITAL SOLUTIONS', image: '/images-galeries/PDG Digital solutions.jpg.jpeg', description: "La digitalisation est la clé des entreprises qui se veulent pérennes et en phase avec les exigences du marché actuel. Nous vous proposons nos services de conception de solutions digitales qu'elle soit web, mobile ou de logiciels, afin d'affirmer votre présence professionnelle sur le marché virtuel et d'améliorer la gestion de votre entreprise. PDG DIGITAL SOLUTIONS via sa solution griffperso.com démontre sa force créative digitale en ouvrant un marché varié de qualité afin de permettre à tous les créateurs et promoteurs de marques de trouver un espace commercial florissant. Nos équipes de développeurs et de designers numériques sont engagés à vous satisfaire au-delà de vos attentes quelque soit votre projet." },
  { id: 'galerie', title: 'PDG GALERIE', image: '/images-galeries/PDG galerie.jpg.jpeg', description: "L'Art, l'Artisanat et le Design Africains ont beaucoup de valeur et restent encore peu exploités et valorisés. Notre Galerie se veut offrir au public, amoureux du beau et passionnés d'arts, des œuvres inspirées et inspirantes qui tirent leurs sources créatives des racines africaines tout en répondant aux exigences contemporaines. Nous proposons en exposition permanente, les créations du promoteur de la Galerie PDG, l'Artiste Global Designer PASERNI. Nous accueillons aussi des expositions et des résidences de création d'artistes plasticiens ou de designers qui s'alignent dans la vision de la valorisation du savoir-faire africain ou engagés sur des thématiques qui impactent la société positivement. Chaque œuvre que vous achetez chez nous est un bout de bonheur que vous emportez chez vous pour illuminer vos espaces." },
  { id: 'learning', title: 'PDG LEARNING', image: '/images-galeries/PDG learning.jpg.jpeg', description: "PDG LEARNING est notre entité dédiée à la formation dans les métiers d'art et dans le Global Design. La transmission du savoir-faire est plus qu'une vocation chez nous, c'est notre engagement RSE qui permet de donner à chaque jeune une compétence professionnelle et au final un emploi libre. Notre approche de formation transversale en Global Design permet d'aborder le Design Graphique, le Design d'Intérieur, le Design de Produit et le Design d'Espace dans une même formation afin de rendre nos stagiaires plus compétitifs de par leur pluridisciplinarité. Nous proposons également plusieurs programmes de formations sociales et personnalisées en artisanat d'art afin d'offrir aux passionnés d'arts une alternative de reconversion professionnelle." },
  { id: 'mobilier', title: 'PDG MOBILIER', image: '/images-galeries/PDG mobilier.jpg.jpeg', description: "Un meuble ça raconte une histoire ou déclame une poésie en hommage à la beauté du bois. Nous ne fabriquons pas des meubles juste par besoin, nous tissons un lien entre vous et votre mobilier en les créant pour répondre à votre personnalité. PDG MOBILIER est la solution pour la conception de vos meubles sur mesure, la réalisation et l'installation de votre mobilier domestique ou commercial avec une précision et une finition rigoureuse. Envie d'aménager votre maison, votre boutique, votre bureau... Nous sommes votre solution." },
  { id: 'projects', title: 'PDG PROJECTS', image: '/images-galeries/PDG projects.jpg.jpeg', description: "Combien de fois vous avez trouvé la meilleure idée de projet sans pouvoir la développer ? Combien de projets lancés souffrent de structuration et de suivi pour croître ? Vous n'êtes plus seul face à tous ces enjeux, notre département PDG PROJECTS vous accompagne avec son dispositif La Clinique de l'Innovation qui vous propose des consultations, des diagnostics et divers soins professionnels sur vos projets afin de favoriser leur éclosion et leur mise en orbite. Nos experts en élaboration de projets vous assistent pas à pas de l'incubation à l'acceptation de votre entreprise. Chez nous aucune idée n'est mauvaise, il faut juste la soigner." },
  { id: 'puzzles', title: 'PDG PUZZLES', image: '/images-galeries/PDG puzzles.jpg.jpeg', description: "Pour résoudre la problématique d'absence de jouets éducatifs dans nos systèmes pédagogiques africains, nous avons mis en place une unité de production de puzzles et jouets africains faits mains en bois ou matériaux recyclés écologiques sur des thématiques culturelles, touristiques, académiques ou historiques. Pour la vulgarisation des bienfaits des puzzles, nous organisons le championnat de puzzles pour l'épanouissement cognitif des enfants et des adultes. Une occasion unique de développer chez les plus jeunes l'esprit compétitif, la concentration, l'intelligence, l'habileté manuelle, la culture générale. Merci de soutenir l'initiative."},
  { id: 'cafe-bart', title: 'CAFÉ B\'ART PDG', image: '/images-galeries/Café b\'art pdg .jpg.jpeg', description: "Si vous avez envie de faire vivre une expérience sensorielle fabuleuse à vos papilles gustatives, faites un tour au Café b'Art PDG. Ici nous vous faisons voyager par nos plats cuisinés avec dextérité et beaucoup d'amour. Nous allions la gastronomie traditionnelle à une touche d'art et de modernité afin de satisfaire votre appétit comme jamais auparavant. Notre cadre inspirant et apaisant vous accueille et vous détend le temps d'une pause déjeuner ou dîner. Nous nous déplaçons aussi sur vos événements en déployant nos concepts de buffet, de bar et de service traiteur artistiquement pensés pour le bonheur de vos invités. Avec le Café b'Art PDG, c'est l'Art Culinaire à votre service."},
  { id: 'les-ateliers-pdg', title: 'Les Ateliers PDG', image: '/images-galeries/les-ateliers-pdg.jpeg', description: "Les Ateliers PDG est le cœur de l'ensemble de nos activités du fait de sa diversité technique et du vaste champ de créativité proposé au travers de ses nombreux  ateliers professionnels notamment : la sérigraphie, le chantournage, la menuiserie, la peinture, la ferronnerie, la couture, la tapisserie, la décoration, les Arts plastiques, le marquage sur tout support. Ce grand plateau technique et créatif est mis à disposition sur tous vos projets avec notre entreprise PASERNI DESIGN GLOBAL afin de vous sortir des solutions sur mesures et un résultat qui vous démarquent de la concurrence et du \"déjà vu\".... N'hésitez donc pas à nous solliciter dans ces différents métiers que nous pratiquons avec passion et efficacité."}

];

const scrollIntoViewIfHash = () => {
  const hash = decodeURIComponent(window.location.hash.replace('#', ''));
  if (!hash) return;
  const el = document.getElementById(hash);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const Departments: React.FC = () => {
  const { countryData } = useCountry()
  const { departments: dbDepartments, loading: imagesLoading } = useDepartmentImages()
  
  // Filtrer les départements par pays et mapper les données.
  // Les deux formats sont tolérés : 'BJ' comme 'benin'.
  const countryDepartments = dbDepartments.filter(dept =>
    matchesCountry(dept.country, countryData.id)
  ).map(dept => ({
    id: dept.department.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    title: dept.title || dept.department,
    image: dept.image_url,
    description: dept.description || ''
  }))
  
  // Utiliser les données de la BDD si disponibles, sinon les données par défaut
  const renderedSections = countryDepartments.length > 0 ? countryDepartments : sections
  
  // Debug temporaire
  React.useEffect(() => {
    scrollIntoViewIfHash();
    const onHashChange = () => scrollIntoViewIfHash();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-6 md:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="section-title text-center mt-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          Nos départements
        </motion.h1>
        
        {(imagesLoading) && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-600">Chargement des départements...</span>
          </div>
        )}
        
        <div className="mt-12 space-y-12">
          {renderedSections.map((s, i) => (
            <motion.section
              key={s.id}
              id={s.id}
              className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-accent-dark"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.03 }}
            >
              <h2 className="text-2xl font-serif font-bold text-gray-900">{s.title}</h2>
              
              {/* Image par défaut si aucune image configurée */}
              {s.image && (
                <div className="mt-6">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Image de présentation</h3>
                    {
                      (() => {
                        const routes: Record<string, string> = {
                          building: '/departements/pdg-building-gallery',
                          'com-events': '/departements/pdg-com-events-gallery',
                          mobilier: '/departements/pdg-mobilier-gallery',
                          puzzles: '/departements/pdg-puzzles-gallery',
                          digital: '/departements/pdg-digital-solutions-gallery',
                          galerie: '/departements/pdg-galerie-gallery',
                          learning: '/departements/pdg-learning-gallery',
                          projects: '/departements/pdg-projects-gallery',
                          'cafe-bart': '/departements/pdg-cafe-gallery',
                          'les-ateliers-pdg': '/departements/les-ateliers-pdg-gallery'
                        }
                        const href = routes[s.id]
                        const imgEl = (
                          <img
                            src={s.image}
                            alt={s.title}
                            className={`w-full max-h-[260px] object-contain rounded-lg border border-gray-200 bg-white ${href ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''}`}
                          />
                        )
                        return href ? <Link to={href}>{imgEl}</Link> : imgEl
                      })()
                    }
                  </div>
                </div>
              )}

              <p className="text-gray-700 mt-2">{s.description}</p>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Departments;
