import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send, Clock, Facebook } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import { useCountry } from '../contexts/CountryContext';











const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const { countryData } = useCountry();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Créer le message email avec toutes les informations du formulaire
    const emailSubject = encodeURIComponent(`Contact Espace Paserni - ${formData.subject}`);
    const emailBody = encodeURIComponent(
      `Bonjour Espace Paserni,

Informations de contact :
• Nom : ${formData.name}
• Email : ${formData.email}
• Sujet : ${formData.subject}

Message :
${formData.message}

Merci de me recontacter.

Cordialement,
${formData.name}`
    );
    
    // Rediriger vers l'email avec le message prérempli
    const emailUrl = `mailto:serge@espacepaserni.org?subject=${emailSubject}&body=${emailBody}`;
    window.open(emailUrl, '_blank');
    
    // Réinitialiser le formulaire
    setFormData({ name: '', email: '', subject: '', message: '' });
  };
  const emailMessage = encodeURIComponent(`Bonjour, je souhaite obtenir des informations sur Espace Paserni (${countryData.name}).`);
  return (
  <div className="min-h-screen py-8 pt-6 md:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="section-title">Nous Contacter</h1>
          <p className="text-xl text-gray-1000 max-w-3xl mx-auto">Vous avez une question, un projet ou souhaitez nous rendre visite ? N'hésitez pas à nous contacter, nous serons ravis de vous répondre.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div className="space-y-8" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Informations de Contact</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <MapPin className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Adresse</h3>
                    <p className="text-gray-600">{countryData.address}</p>
                    {countryData.id === 'cote-ivoire' ? (
                      countryData.mapsUrl && (
                        <a 
                          href={countryData.mapsUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center mt-2 text-orange-600 hover:text-orange-700 transition-colors"
                        >
                          <MapPin size={16} className="mr-1" />
                          Voir sur Google Maps
                        </a>
                      )
                    ) : (
                      <p className="text-gray-600 mt-1">Située derrière le stade GMK Maison après la 4ème rue (portail noir)</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Phone className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Téléphone</h3>
                    <div className="flex items-center space-x-3">
                      <p className="text-gray-600">{countryData.phone}</p>
                      <a href="mailto:serge@espacepaserni.org?subject=Contact Espace Paserni" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
                        <Mail size={20} />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Mail className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <div className="space-y-1">
                      {countryData.email.split(',').map((email, index) => (
                        <p key={index} className="text-gray-600">
                          <a 
                            href={`mailto:${email.trim()}`} 
                            className="text-orange-600 hover:text-orange-700 transition-colors"
                          >
                            {email.trim()}
                          </a>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-4"><div className="bg-orange-100 p-3 rounded-lg"><Clock className="text-orange-600" size={24} /></div><div><h3 className="font-semibold text-gray-900">Horaires d'Ouverture</h3><div className="text-gray-600"><p>Lundi - Jeudi: 09h - 22h</p><p>Vendredi - Samedi: 09h - 00h</p><p>Dimanche: 09h - 00h</p></div></div></div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Contact Rapide</h3>
              <p className="text-gray-600 mb-4">Pour une réponse immédiate, envoyez-nous un email</p>
              <a href="mailto:serge@espacepaserni.org?subject=Contact Espace Paserni" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                <Mail size={20} />
                <span>Envoyer un Email</span>
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Suivez-nous</h3>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/bigpaserni" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="https://www.tiktok.com/@espace.paserni.bn" target="_blank" rel="noopener noreferrer" className="bg-black hover:bg-gray-800 text-white p-3 rounded-lg transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/espace.paserni.229" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 text-white p-3 rounded-lg transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
          <Tilt className="will-change-transform" tiltMaxAngleX={6} tiltMaxAngleY={6} transitionSpeed={140} perspective={720}>
            <motion.div className="bg-white rounded-xl shadow-lg p-8" initial={{ opacity: 0, scale: 0.97, y: 16 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Envoyez-nous un Message</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 text-green-800">
                  <MessageCircle size={20} />
                  <span className="font-medium">Message WhatsApp</span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Remplissez le formulaire ci-dessous et cliquez sur "Envoyer via WhatsApp" pour nous contacter directement sur WhatsApp avec toutes vos informations.
                </p>
              </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div><label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label><input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600 transition-colors" placeholder="Votre nom et prénom" /></div>
                <div><label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email *</label><input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600 transition-colors" placeholder="votre.email@exemple.com" /></div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Sujet *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600 transition-colors"
                  >
                    <option value="">Sélectionner un sujet</option>
                    <option value="info">Demande d'informations</option>
                    <option value="services">Services</option>
                    <option value="formations">Formations</option>
                    <option value="galerie">Galerie d'art</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="evenement">Organisation d'événement</option>
                    <option value="partenariat">Partenariat</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div><label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label><textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required rows={6} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600 transition-colors resize-vertical" placeholder="Décrivez votre demande en détail..."></textarea></div>
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"><MessageCircle size={20} /><span>Envoyer via WhatsApp</span></button>
            </form>
            </motion.div>
          </Tilt>
        </div>
        <motion.div className="mt-12 bg-white rounded-xl shadow-lg p-8 text-center" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6 text-center">Notre Localisation</h2>
          <a href={countryData.mapsUrl || "https://maps.app.goo.gl/vtwT6H86NiuB6ehg6?g_st=aw"} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center space-x-2">
            <MapPin size={20} />
            <span>Ouvrir dans Google Maps</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
};
export default Contact;
