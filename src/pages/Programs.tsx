import React, { useState } from 'react';
import { Calendar, Clock, Users, Plus } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import { useCountry } from '../contexts/CountryContext';
import { getCountryContent } from '../data/countryContent';








const Programs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('weekly');
  const { countryData } = useCountry();
  const whatsappNumber = countryData.phone.replace(/\D/g, '');
  const buildWhatsapp = (service: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Bonjour, je souhaite m'inscrire à : " + service + " (Espace Paserni)")}`;
  
  // URLs des formulaires Google Forms
  const getRegistrationUrl = (programTitle: string) => {
    switch (programTitle) {
      case "Bricol'Art":
        return "https://docs.google.com/forms/d/e/1FAIpQLSeWRTizrqUy5IK5OOUvjqVegaUu0EA1cOatfc4hEmPFGUK7nw/viewform";
      case "Après-midi Co-créatif":
        return "https://docs.google.com/forms/d/e/1FAIpQLSf_un_sboZUO52YC2Hobl6Fcd0pnEyAZdbf8_cNBy7j40MQ2Q/viewform";
      case "Formation Global Design":
        return "https://docs.google.com/forms/d/e/1FAIpQLScASDqZn59iH_HMRWD3sFM8cQXMDSTqL_N3tUUVYkroUs-8xg/viewform";
      case "Programme ALONUZO":
        return "https://docs.google.com/forms/d/e/1FAIpQLSez1GuaklLy7Aa1nmZ3YMpki2PdhaBQKjtwOVaNLeqPnZD5VQ/viewform";
      default:
        return buildWhatsapp(programTitle);
    }
  };
  
  const content = getCountryContent(countryData.id);
  
  // Prix spécifiques selon le pays
  const getBricolArtPrice = () => {
    return countryData.id === 'cote-ivoire' ? "5 000 F CFA/séance" : "3 000 F CFA/séance";
  };
  
  const getCoCreativePrice = () => {
    return countryData.id === 'cote-ivoire' ? "10 000 F CFA/séance" : "5 000 F CFA/séance";
  };
  
  const weeklyPrograms = [
    { title: "Bricol'Art", day: "Mercredi", time: "15h - 17h", ages: "5 à 15 ans", price: getBricolArtPrice(), description: "Atelier créatif pour enfants mêlant bricolage et art. Développement de la créativité et des compétences manuelles.", recurring: "Mercredi 15h-17h, Samedi 10h-12h" },
    { title: "Soirée Artistique", day: "Vendredi", time: "À partir de 18h", ages: "Tout public", price: "Gratuit", description: "RDV de détente et de spectacles artistiques.", recurring: "Chaque vendredi" },
    { title: content.programs.culturalMorning.title, day: "Samedi", time: "10h - 12h", ages: "Tout public", price: "Gratuit", description: content.programs.culturalMorning.description, recurring: "Chaque samedi" },
    { title: "Après-midi Co-créatif", day: "Samedi", time: "15h - 17h", ages: "Adolescents et adultes", price: getCoCreativePrice(), description: "Session collaborative de création artistique. Projets collectifs et partage de compétences.", recurring: "Chaque samedi" }
  ];
  const formations = [
    { title: "Programme ALONUZO", startDate: "Octobre 2025", duration: "1 mois", price: "50 000 F CFA", description: "Rejoignez notre programme ALONUZO, une formation complète et pratique qui vous permettra d'acquérir des compétences dans divers domaines artistiques. Pendant un mois, vous travaillerez avec des professionnels expérimentés pour développer vos talents.", modules: ["Sérigraphie", "Graphisme", "Arts plastiques", "Peinture", "Chantournage", "Décor scénique", "Décoration d'intérieur", "Couture"], status: "Inscriptions ouvertes" },
    { title: "Formation Global Design", startDate: "Février 2026", duration: "9 mois", price: "300 000 F CFA", description: "Devenez un expert en design avec notre formation Global Design, qui couvre une large gamme de disciplines. Pendant 9 mois, vous bénéficierez d'un enseignement de haute qualité, dispensé par des professionnels du secteur et travaillerez sur des projets concrets pour développer vos compétences. L'inscription inclut un kit et un polo.", modules: ["Design graphique", "Design produit", "Design d'intérieur", "Sérigraphie/Design d'espace"], status: "Pré-inscriptions" }
  ];
  return (
    <div className="min-h-screen py-8 pt-6 md:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="section-title">Programme & Formations</h1>
          <p className="text-xl text-gray-1000 max-w-3xl mx-auto">Découvrez nos programmes créatifs hebdomadaires et nos programmes de formations pour développer vos compétences artistiques dans un cadre inspirant et équipé avec un suivi personnalisé.</p>
        </div>
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button onClick={() => setActiveTab('weekly')} className={`px-6 py-3 rounded-md font-medium transition-colors ${activeTab === 'weekly' ? 'bg-orange-800 text-white' : 'text-gray-600 hover:text-gray-900'}`}>Programmes créatifs Hebdomadaires</button>
            <button onClick={() => setActiveTab('formations')} className={`px-6 py-3 rounded-md font-medium transition-colors ${activeTab === 'formations' ? 'bg-orange-800 text-white' : 'text-gray-600 hover:text-gray-900'}`}>Programmes de Formations</button>
          </div>
        </div>
        {activeTab === 'weekly' && (
          <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8" initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
            {weeklyPrograms.map((program, index) => (
              <motion.div key={index} variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.45 }}>
                <Tilt tiltMaxAngleX={7} tiltMaxAngleY={7} transitionSpeed={140} perspective={720}>
                  <div className="bg-white rounded-xl shadow-lg p-6 card-hover border border-accent-dark">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-serif font-bold text-gray-900">{program.title}</h3>
                      <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">{program.recurring}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-gray-600"><Calendar size={18} className="mr-2 text-orange-600" /><span>{program.day}</span></div>
                      <div className="flex items-center text-gray-600"><Clock size={18} className="mr-2 text-orange-600" /><span>{program.time}</span></div>
                      <div className="flex items-center text-gray-600"><Users size={18} className="mr-2 text-orange-600" /><span>{program.ages}</span></div>
                      <div className="text-right"><span className="text-lg font-semibold text-gray-900">{program.price}</span></div>
                    </div>
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    <div className="flex gap-3">
                      <a href={getRegistrationUrl(program.title)} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 text-center">S'inscrire</a>
                      <a href={buildWhatsapp(program.title)} target="_blank" rel="noopener noreferrer" className="btn-outline inline-flex items-center justify-center"><Plus size={18} /></a>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </motion.div>
        )}
        {activeTab === 'formations' && (
          <div className="space-y-8">
            {formations.map((formation, index) => (
              <motion.div key={index} initial={{ opacity: 0, scale: 0.97, y: 18 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
                <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} transitionSpeed={140} perspective={700}>
                  <div className="bg-white rounded-xl shadow-lg p-8 border border-accent-dark">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                      <div>
                        <h3 className="text-3xl font-serif font-bold text-gray-900 mb-2">{formation.title}</h3>
                        <div className="flex items-center space-x-4 text-gray-600"><span>Rentrée: {formation.startDate}</span><span>•</span><span>Durée: {formation.duration}</span></div>
                      </div>
                      <div className="mt-4 lg:mt-0">
                        <div className="text-3xl font-bold text-orange-600">{formation.price}</div>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${formation.status === 'Inscriptions ouvertes' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{formation.status}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6">{formation.description}</p>
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-3">Modules inclus:</h4>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {formation.modules.map((module, moduleIndex) => (
                          <div key={moduleIndex} className="bg-gray-50 p-3 rounded-lg text-center"><span className="text-sm font-medium text-gray-800">{module}</span></div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a href={getRegistrationUrl(formation.title)} target="_blank" rel="noopener noreferrer" className="btn-primary text-center">{formation.status === 'Inscriptions ouvertes' ? "S'inscrire" : "S'inscrire"}</a>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Programs;
