import React from 'react';
// no router navigation needed in footer
import { MapPin, Phone, Facebook, Mail } from 'lucide-react';
import { useCountry } from '../contexts/CountryContext';
import { getCountryContent } from '../data/countryContent';

const Footer: React.FC = () => {
  const { countryData } = useCountry();
  const content = getCountryContent(countryData.id as any);
  const partners = content.partners || [];

  // navigation helper removed (not used here)

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Espace Paserni</h3>
            <p className="text-gray-500 mb-4 leading-relaxed">
              Espace Paserni est un Centre Créatif Artistique et Culturel basé {countryData.city ? `à ${countryData.city}, ${countryData.name}` : countryData.name}
              {' '}et dans d'autres pays de la sous-région. Notre vision est de créer le meilleur Espace d'Expressions Créatives en Afrique pour l'éclosion et la promotion de façon inclusive des talents.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/bigpaserni" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://www.tiktok.com/@espace.paserni.bn" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/espace.paserni.229" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0  0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0  0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0  0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0  0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                </svg>
              </a>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-400"/>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li><a href="/home" className="text-gray-300 hover:text-orange-600 transition-colors">Accueil</a></li>
              <li><a href="/departements" className="text-gray-300 hover:text-orange-600 transition-colors">Nos départements</a></li>
              <li><a href="/services" className="text-gray-300 hover:text-orange-600 transition-colors">Nos services</a></li>
              <li><a href="/programmes" className="text-gray-300 hover:text-orange-600 transition-colors">Programmes</a></li>
              <li><a href="/projet" className="text-gray-300 hover:text-orange-600 transition-colors">Projets</a></li>
              <li><a href="/galeries" className="text-gray-300 hover:text-orange-600 transition-colors">Galerie</a></li>
              <li><a href="/restaurant" className="text-gray-300 hover:text-orange-600 transition-colors">Restaurant</a></li>
              <li><a href="/mes-commandes" className="text-gray-300 hover:text-orange-600 transition-colors">Mes commandes</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-orange-600 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-orange-600" />
                <span className="text-gray-300">{countryData.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-orange-600" />
                {
                  (() => {
                    const raw = (countryData.phone || '').toString();
                    // sanitize for display and tel href
                    let display = raw;
                    let href = raw.replace(/\s/g, '');
                    // If Côte d'Ivoire data wrongly uses 229, replace leading 229 with +225
                    if (countryData.id === 'cote-ivoire') {
                      href = href.replace(/^(\+?)229/, '+225');
                      display = display.replace(/^(\+?)229/, '+225');
                    }
                    // ensure tel: uses numeric with plus if present
                    return (
                      <a href={`tel:${href}`} className="text-gray-300 hover:text-orange-600 transition-colors">
                        {display}
                      </a>
                    );
                  })()
                }
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-orange-600" />
                <a href="mailto:serge@espacepaserni.org" className="text-gray-300 hover:text-orange-600 transition-colors">
                  serge@espacepaserni.org
                </a>
              </div>
              {countryData.specialPhone && (
                <div className="flex items-center space-x-3">
                  <Phone size={18} className="text-orange-600" />
                  {
                    (() => {
                      const raw2 = countryData.specialPhone.toString();
                      let display2 = raw2;
                      let href2 = raw2.replace(/\s/g, '');
                      if (countryData.id === 'cote-ivoire') {
                        href2 = href2.replace(/^(\+?)229/, '+225');
                        display2 = display2.replace(/^(\+?)229/, '+225');
                      }
                      return (
                        <a href={`tel:${href2}`} className="text-gray-300 hover:text-orange-600 transition-colors">
                          {display2}
                        </a>
                      );
                    })()
                  }
                </div>
              )}
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Horaires Restaurant</h3>
            <div className="space-y-2 text-gray-300">
              <div>Mardi - Samedi: 10h - 22h</div>
              <div>Dimanche: 12h - 22h</div>
            </div>
          </div>
        </div>

        {/* Nos partenaires (conservé) */}
        {partners.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-800">
            <h3 className="text-xl font-semibold mb-6 text-center">Ils nous font confiance</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
              {partners.map((src: string, idx: number) => (
                <div key={idx} className="bg-white rounded-md p-3 flex items-center justify-center h-20">
                  <img src={src} alt="Logo partenaire" className="max-h-14 object-contain" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-gray-800 mt-10 pt-8 text-center">
          <p className="text-gray-400">&copy; {currentYear} Espace Paserni. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;