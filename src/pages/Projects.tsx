import React from 'react';
import { Trophy, ShoppingBag, ArrowRight } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import { useCountry } from '../contexts/CountryContext';






const AutoCarousel: React.FC<{ images: string[]; intervalMs?: number; className?: string; alt?: string; fallbackSrc?: string }> = ({ images, intervalMs = 3500, className, alt, fallbackSrc }) => {
  const [valid, setValid] = React.useState<string[]>([]);
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    let cancelled = false;
    const validate = async () => {
      const checks = await Promise.all(
        images.map((src) =>
          new Promise<string | null>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => resolve(null);
            img.src = src;
          })
        )
      );
      if (!cancelled) setValid(checks.filter((x): x is string => Boolean(x)));
    };
    validate();
    return () => {
      cancelled = true;
    };
  }, [images]);
  React.useEffect(() => {
    if (valid.length <= 1) return; // no need to swap
    const id = setInterval(() => setIdx((i) => (i + 1) % valid.length), intervalMs);
    return () => clearInterval(id);
  }, [valid, intervalMs]);
  if (valid.length === 0) {
    return fallbackSrc ? (
      <img src={fallbackSrc} alt={alt || 'fallback'} className={`w-full h-full object-cover rounded-xl ${className || ''}`} />
    ) : null;
  }
  return (
    <div className={`relative ${className || ''}`}>
      {valid.map((src, i) => (
        <motion.img
          key={src}
          src={src}
          alt={alt || 'carousel'}
          className="absolute inset-0 w-full h-full object-cover rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: i === idx ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ pointerEvents: 'none' }}
        />
      ))}
      <div className="pt-[56.25%]" />
    </div>
  );
};

const ValidatedImgMulti: React.FC<{ candidates: string[]; fallback: string; alt: string; className?: string }> = ({ candidates, fallback, alt, className }) => {
  const [src, setSrc] = React.useState<string | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const c of candidates) {
        const ok = await new Promise<boolean>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = c;
        });
        if (ok) { if (!cancelled) { setSrc(c); } return; }
      }
      if (!cancelled) setSrc(fallback);
    })();
    return () => { cancelled = true; };
  }, [candidates, fallback]);
  if (!src) return null;
  return <img src={src} alt={alt} className={className} />;
};



  // Candidates for 'Meilleur vendeur numérique' from public with different extensions








        

const Projects: React.FC = () => {
  const { countryData } = useCountry();
  const buildEmail = (projectTitle: string) => `mailto:serge@espacepaserni.org?subject=${encodeURIComponent("Participation au projet " + projectTitle)}&body=${encodeURIComponent("Bonjour,\n\nJe souhaite participer au projet : " + projectTitle + "\n\nMerci de me recontacter.\n\nCordialement")}`;
  
  // URL du formulaire Google Forms pour le Championnat de Puzzles
  const getProjectRegistrationUrl = (projectTitle: string) => {
    switch (projectTitle) {
      case "Championnat de Puzzles":
        return "https://docs.google.com/forms/d/e/1FAIpQLSc4Hi040jfcGC--fUh9SV0DJzXeOfRGHLFnxJ3dEktUbz2hZw/viewform";
      default:
        return buildEmail(projectTitle);
    }
  };
  const projects = [
    {
      id: 1,
      title: "Championnat de Puzzles",
      subtitle: "Concours Créatif",
      description: "Participez à notre championnat de puzzles, un défi stimulant et amusant qui mettra vos compétences en puzzle à l'épreuve ! Avec des récompenses pour les meilleurs participants et une atmosphère de compétition amicale.",
      image: "https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg",
      status: "En cours",
      participants: "Enfants et Adultes",
      details: [
        "Épreuves de puzzles culturels",
        "Promotion du patrimoine touristique",
        "Prix et reconnaissances",
        "Networking entre participants"
      ]
    },
    {
      id: 2,
      title: "Best Digital Seller",
      subtitle: "Accompagnement E-commerce",
      description: "Programme d'accompagnement pour créateurs et artistes souhaitant développer leur présence en ligne. Partenariat avec griffperso.com pour la vente digitale.",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
      status: "Actif",
      participants: "Créateurs,Étudiants et promoteurs de marques",
      details: [
        "Formation au e-commerce",
        "Création de boutiques en ligne",
        "Stratégies de marketing digital",
        "Accompagnement personnalisé"
      ],
      partner: "griffperso.com"
    }
  ];
  const puzzleImages = [
    "/images-projet/puzzle-1.jpeg",
    "/images-projet/puzzle-2.jpeg",
  ];
  const bestSellerCandidates = [
    "/images-projet/meilleur-vendeur.jpeg",
    "/images-projet/meilleur-vendeur.jpg",
    "/images-projet/meilleur-vendeur.png",
  ];
  return (
    <div className="min-h-screen py-8 pt-6 md:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="section-title">Nos Projets</h1>
          <p className="text-xl text-gray-1000 max-w-3xl mx-auto">
            Découvrez les projets innovants d'Espace Paserni, conçus pour soutenir 
            et développer la créativité de notre communauté artistique.
          </p>
        </div>
        <div className="space-y-12">
          {projects.map((project, index) => (
            <motion.div key={project.id} className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              initial={{ opacity: 0, rotateX: index % 2 === 0 ? -8 : 8, y: 24 }} whileInView={{ opacity: 1, rotateX: 0, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="w-full lg:w-1/2">
                <Tilt tiltMaxAngleX={9} tiltMaxAngleY={9} transitionSpeed={150} perspective={760} className="will-change-transform">
                  <div className="relative rounded-xl overflow-hidden shadow-2xl card-hover">
                    {project.id === 1 ? (
                      <AutoCarousel images={puzzleImages} alt={project.title} className="w-full h-64 lg:h-80" fallbackSrc={project.image} />
                    ) : (
                      <ValidatedImgMulti candidates={bestSellerCandidates} fallback={project.image} alt={project.title} className="w-full h-64 lg:h-80 object-cover" />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${project.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{project.status}</span>
                    </div>
                    {project.id === 1 && (
                      <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-2 rounded-full"><Trophy className="text-orange-600" size={24} /></div>
                    )}
                    {project.id === 2 && (
                      <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-2 rounded-full"><ShoppingBag className="text-orange-600" size={24} /></div>
                    )}
                  </div>
                </Tilt>
              </div>
              <div className="w-full lg:w-1/2">
                <div className="space-y-6">
                  <div>
                    <p className="text-orange-600 font-medium mb-2">{project.subtitle}</p>
                    <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">{project.title}</h2>
                    <p className="text-gray-600 text-lg leading-relaxed">{project.description}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-900 mb-1">Public cible:</p>
                    <p className="text-gray-600">{project.participants}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Caractéristiques du projet:</h3>
                    <ul className="space-y-2">
                      {project.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center text-gray-600"><ArrowRight className="text-orange-600 mr-3" size={16} />{detail}</li>
                      ))}
                    </ul>
                  </div>
                  {project.partner && (
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg"><p className="text-orange-800"><strong>Partenaire:</strong> {project.partner}</p></div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href={getProjectRegistrationUrl(project.title)} target="_blank" rel="noopener noreferrer" className="btn-primary text-center">Participer au Projet</a>
                    <a href={buildEmail(project.title)} target="_blank" rel="noopener noreferrer" className="btn-outline text-center">En Savoir Plus</a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Projects;
