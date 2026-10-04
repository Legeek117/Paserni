import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCountry } from '../contexts/CountryContext';
import ImageCarousel from '../components/ImageCarousel';
import DepartmentScroll from '../components/DepartmentScroll';

// Avis component stored per selected country in localStorage
const ReviewsForm: React.FC = () => {
  const { selectedCountry } = useCountry();
  const storageKey = `reviews_${selectedCountry}`;
  // reviewerId stored locally so the poster can delete their own reviews
  const [reviewerId] = React.useState<string>(() => {
    try {
      const existing = localStorage.getItem('reviews_owner_id');
      if (existing) return existing;
      const gen = `r_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem('reviews_owner_id', gen);
      return gen;
    } catch {
      return `r_${Date.now()}`;
    }
  });

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [stars, setStars] = React.useState(5);
  const [reviews, setReviews] = React.useState<Array<{name:string; email?:string; comment:string; stars:number; date:string; reviewerId?:string}>>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(reviews));
  }, [reviews, storageKey]);

  // Supprimer automatiquement les avis du Bénin au chargement
  React.useEffect(() => {
    if (selectedCountry === 'benin') {
      localStorage.removeItem('reviews_benin');
      setReviews([]);
    }
  }, [selectedCountry]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    const entry = { name: name.trim(), email: email.trim(), comment: comment.trim(), stars, date: new Date().toISOString(), reviewerId };
    setReviews([entry, ...reviews]);
    setName('');
    setEmail('');
    setComment('');
    setStars(5);
  };

  const handleDelete = (date: string) => {
    if (!confirm('Supprimer cet avis ?')) return;
    setReviews(prev => prev.filter(r => r.date !== date));
  };

  // Fonction pour supprimer tous les avis du Bénin
  const clearBeninReviews = () => {
    if (selectedCountry === 'benin') {
      if (confirm('Supprimer tous les avis du Bénin ?')) {
        setReviews([]);
        localStorage.removeItem('reviews_benin');
      }
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
      <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow">
        <h3 className="text-2xl font-serif font-bold mb-4">Votre avis ({selectedCountry.toUpperCase()})</h3>
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
            <textarea value={comment} onChange={(e)=>setComment(e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <div className="flex items-center space-x-2">
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={()=>setStars(n)} className={`px-2 py-1 rounded ${n<=stars? 'bg-orange-600 text-white':'bg-gray-200 text-gray-700'}`}>{n}★</button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="btn-primary">Envoyer</button>
          </div>
        </form>
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-serif font-bold">Avis récents</h3>
          {selectedCountry === 'benin' && reviews.length > 0 && (
            <button 
              onClick={clearBeninReviews}
              className="text-sm text-red-600 hover:text-red-800 hover:underline font-medium"
            >
              Supprimer tous les avis
            </button>
          )}
        </div>
        <div className="space-y-4">
          {reviews.length === 0 && <p className="text-gray-500">Aucun avis pour ce pays pour le moment.</p>}
          {reviews.map((r) => (
            <div key={r.date} className="border border-gray-200 rounded-xl p-4 bg-white/80 backdrop-blur">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <div className="font-medium text-gray-900">{r.name}</div>
                  {r.email && <div className="text-xs text-gray-500">{r.email}</div>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-orange-600">{r.stars}★</span>
                  {r.reviewerId === reviewerId && (
                    <button onClick={() => handleDelete(r.date)} className="text-sm text-red-600 hover:underline">Supprimer</button>
                  )}
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-line">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const { countryData } = useCountry();
  const whatsappNumber = (countryData?.phone || '').replace(/\D/g, '') || '22996231304';
  const buildWhatsapp = (service: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Bonjour, je souhaite m'inscrire à : " + service + " (Espace Paserni)")}`;
  
  // URLs des formulaires Google Forms pour la page d'accueil
  const getRegistrationUrl = (programTitle: string) => {
    switch (programTitle) {
      case "Bricol'Art":
        return "https://docs.google.com/forms/d/e/1FAIpQLSeWRTizrqUy5IK5OOUvjqVegaUu0EA1cOatfc4hEmPFGUK7nw/viewform";
      case "Après-midi Co-créatif":
        return "https://docs.google.com/forms/d/e/1FAIpQLSf_un_sboZUO52YC2Hobl6Fcd0pnEyAZdbf8_cNBy7j40MQ2Q/viewform";
      default:
        return buildWhatsapp(programTitle);
    }
  };

  // Images différentes selon le pays
  const getCarouselImages = () => {
    if (countryData?.id === 'cote-ivoire') {
      return [
        { src: "/images-galeries/batiment-espace-paserni-ci.jpeg", alt: "Bâtiment Espace Paserni Côte d'Ivoire" },
        { src: "/images-galeries/lion-roi-art-mural-ci.jpeg", alt: "Lion Roi - Art Mural Côte d'Ivoire" },
        { src: "/images-galeries/abidjan-skyline-ci.jpeg", alt: "Skyline d'Abidjan Côte d'Ivoire" }
      ];
    } else {
      // Images spécifiques pour le Bénin
      return [
        { src: "/images-galeries/espace-culturel-interieur-benin.jpeg", alt: "Espace Culturel Intérieur - Bénin" },
        { src: "/images-galeries/espace-exterieur-nocturne-benin.jpeg", alt: "Espace Extérieur Nocturne - Bénin" },
        { src: "/images-galeries/espace-artistique-colore-benin.jpeg", alt: "Espace Artistique Coloré - Bénin" }
      ];
    }
  };
  // Prix spécifiques selon le pays
  const getBricolArtPrice = () => {
    return countryData?.id === 'cote-ivoire' ? "5 000 F CFA" : "3 000 F CFA";
  };
  
  const getCoCreativePrice = () => {
    return countryData?.id === 'cote-ivoire' ? "10 000 F CFA" : "5 000 F CFA";
  };

  const upcomingEvents = [
    { title: "Bricol'Art", date: "Mercredi 15h-17h, Samedi 10h-12h", price: getBricolArtPrice(), description: "Activité créative pour enfants (5-15 ans)" },
    { title: "Soirée Artistique", date: "Vendredi à partir de 18h", price: "Gratuit", description: "RDV de détente et de spectacles artistiques  " },
    { title: "Après-midi Co-créatif", date: "Samedi 15h-17h", price: getCoCreativePrice(), description: "Session collaborative de création" }
  ];
  
  
  return (
    <div className="min-h-screen">
      <section className="relative text-white -mt-20 md:-mt-24">
        <div className="relative">
          <ImageCarousel 
            images={getCarouselImages()} 
          />
          {/* Overlay fixe avec dégradé */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />
        </div>
        {/* Contenu fixe qui reste toujours au-dessus */}
        <div className="absolute inset-0 z-20 pt-16 sm:pt-20 md:pt-24 pb-8">
          <div className="h-full flex items-center justify-center min-h-0">
            <motion.div 
              className="text-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
              initial={{ opacity: 0, y: 30, scale: 0.98 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              transition={{ type: 'spring', stiffness: 80, damping: 14, mass: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold mb-4 sm:mb-6 tracking-tight text-shadow-lg leading-tight">
                Espace Paserni
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 text-white leading-relaxed text-shadow-md px-2">
                Bienvenue au temple de la créativité
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
                <Link to="/services" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg hover:shadow-xl inline-flex items-center hover:scale-105 transition-all duration-300 text-sm sm:text-base lg:text-lg w-full sm:w-auto justify-center">
                  Découvrir nos Services <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link to="/programmes" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg hover:shadow-xl inline-flex items-center hover:scale-105 transition-all duration-300 text-sm sm:text-base lg:text-lg w-full sm:w-auto justify-center">
                  Voir les Programmes <ArrowRight className="ml-2" size={18} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Services horizontal scroll */}
      <section className="pt-0 pb-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 className="section-title text-center mt-5" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>Nos départements</motion.h2>
          <div className="mt-8">
            <DepartmentScroll />
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center">Programmes de la Semaine</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {upcomingEvents.map((event, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.06 }}>
                <div className="bg-white border border-accent-dark rounded-xl p-6 shadow-lg card-hover">
                  <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <div className="text-orange-600 font-medium mb-2">{event.date}</div>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">{event.price}</span>
                    <a href={getRegistrationUrl(event.title)} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 font-medium">S'inscrire</a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/programmes" className="btn-primary">Voir Tous les Programmes</Link>
          </div>
        </div>
      </section>
      <motion.section className="py-20 text-white" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-bold mb-6 tracking-tight">Rejoignez Notre Communauté Créative</h2>
          <p className="text-xl text-gray-800 mb-8 max-w-5xl mx-auto leading-relaxed">Découvrez un espace unique où l'art, la culture et la créativité se rencontrent pour créer des expériences inoubliables.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary">Nous Contacter</Link>
            <Link to="/galeries" className="btn-outline">Voir la Galerie</Link>
          </div>
        </div>
      </motion.section>
      {/* Avis / Reviews per country */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 className="section-title text-center" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>Donnez votre avis</motion.h2>
          <ReviewsForm />
        </div>
      </section>
    </div>
  );
};

export default Home;