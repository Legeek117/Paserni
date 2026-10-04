import React from 'react';
import { Palette, Calendar, Home, Hammer, PaintBucket, Shirt, Lightbulb, Building, Coffee } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import { useCountry } from '../contexts/CountryContext';

const Services: React.FC = () => {
  const { countryData } = useCountry();
  const buildEmail = (service: string) => `mailto:serge@espacepaserni.org?subject=${encodeURIComponent("Devis pour " + service)}&body=${encodeURIComponent("Bonjour,\n\nJe souhaite obtenir un devis pour : " + service + "\n\nMerci de me recontacter.\n\nCordialement")}`;

  // Unified services list with optional category labels
  const services = [
    { icon: Palette, title: "Identité Visuelle & Communication", description: "Création de logos, chartes graphiques, supports de communication et stratégies visuelles pour votre marque.", image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg" },
    { icon: Calendar, title: "Gestion d'Événements", description: "Organisation complète d'événements culturels, artistiques et corporatifs. De la conception à la réalisation.", image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg" },
    { icon: Home, title: "Décors Scéniques", description: "Conception et réalisation de décors pour spectacles et événements : scènes, éléments scéniques, décors modulaires et accessoires.", category: "Décors Scéniques", image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg" },
    { icon: Home, title: "Décors d'Intérieurs", description: "Conception et réalisation de décors et aménagements intérieurs personnalisés pour lieux commerciaux et domiciles.", category: "Décors d'Intérieurs", image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg" },
    { icon: Hammer, title: "Menuiserie d'Art", description: "Création de meubles uniques, sculptures en bois et objets décoratifs alliant tradition et modernité.", image: "https://images.pexels.com/photos/175709/pexels-photo-175709.jpeg" },
    { icon: PaintBucket, title: "Arts Plastiques", description: "Cours et ateliers de peinture, sculpture, dessin. Accompagnement d'artistes et expositions.", image: "https://images.pexels.com/photos/1053687/pexels-photo-1053687.jpeg" },
    { icon: Shirt, title: "Création de Mode", description: "Design vestimentaire, patronage, confection de vêtements sur mesure et collections uniques.", image: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg" },
    { icon: Lightbulb, title: "Objets Décoratifs", description: "Création d'objets d'art décoratifs, luminaires, accessoires de maison et cadeaux personnalisés.", image: "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg" },
    { icon: Building, title: "Plans Architecturaux & Construction", description: "Conception de plans, suivi de projets de construction, rénovation et aménagement d'espaces.", image: "https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg" },
    { icon: Coffee, title: "Bar, Resto & Service Traiteur", description: "Restauration sur place, service traiteur pour événements, bar à thème artistique et culturel.", image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg" }
  ];

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="section-title">Nos services</h1>
          <p className="text-xl text-gray-1000 max-w-3xl mx-auto">PASERNI DESIGN GLOBAL (Les ateliers PDG) offre une gamme complète de services en Design : Graphique, d'intérieur, de produit et d'Espaces pour accompagner vos projets et donner vie à vos idées.</p>
        </div>

        {/* Unified grid for all services — visually tag decor categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {services.map((service, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: index % 2 === 0 ? -18 : 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
              <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} transitionSpeed={160} perspective={750} className="will-change-transform">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden card-hover relative">
                  {/* No category badges — simplified display */}

                  <div className="h-52 bg-cover bg-center" style={{ backgroundImage: `url(${service.image})` }}>
                    <div className="h-full bg-black/35 flex items-center justify-center">
                      <service.icon className="text-white" size={54} />
                    </div>
                  </div>
                  <div className="p-7 md:p-8 space-y-3">
                    <h3 className="text-xl font-serif font-semibold text-gray-900">{service.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{service.description}</p>
                    <div className="pt-1">
                      <a href={buildEmail(service.title)} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 font-medium">Envoyer un Mail</a>
                    </div>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>

        <motion.div className="mt-20 text-center bg-white p-10 rounded-xl shadow-lg" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Besoin d'un Service Personnalisé ?</h2>
          <p className="text-gray-600 mb-6">Contactez-nous pour discuter de votre projet ou pour toute question.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${countryData.phone.replace(/\s/g, '')}`}
              className="btn-outline"
            >
              Nous Appeler
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default Services;
