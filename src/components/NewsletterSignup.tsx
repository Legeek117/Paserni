import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';

      // Here you would integrate with your newsletter service

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };
  return (
    <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Restez Informé de Nos Actualités
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Inscrivez-vous à notre newsletter pour recevoir les dernières nouvelles, 
            événements et créations d'Espace Paserni.
          </p>
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-white text-orange-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Mail size={20} />
                  <span>S'abonner</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-center space-x-2 text-xl">
              <Check size={24} className="text-green-300" />
              <span>Merci pour votre inscription !</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default NewsletterSignup;
