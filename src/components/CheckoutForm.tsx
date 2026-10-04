import React, { useState } from 'react';
import { supabase, CartItem } from '../lib/supabase';
import { useCountry } from '../contexts/CountryContext';
import FeexPayCheckout from './FeexPayCheckout';
import { X, ShoppingBag, User, Phone, Mail, MapPin, MessageSquare, Navigation, Loader2 } from 'lucide-react';
import { simpleNotificationService } from '../services/simpleNotificationService';
import { adminAlertService } from '../services/adminAlertService';
import { validatePaymentData, sanitizeString, sanitizePhone, sanitizeEmail, paymentRateLimiter } from '../utils/paymentSecurity';

interface CheckoutFormProps {
  items: CartItem[];
  total: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ items, total, onClose, onSuccess }) => {
  const { selectedCountry } = useCountry();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    customer_city: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const generateOrderNumber = () => {
    const letters = Array.from({ length: 7 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('')
    return `CMD-${letters}`
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Utiliser l'API de géocodage inverse pour obtenir l'adresse
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY&language=fr&pretty=1`
      );
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'adresse');
      }
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const components = result.components;
        
        setFormData(prev => ({
          ...prev,
          customer_address: result.formatted || `${components.road || ''} ${components.house_number || ''}`.trim(),
          customer_city: components.city || components.town || components.village || components.county || ''
        }));
      } else {
        // Fallback: utiliser les coordonnées si pas d'adresse trouvée
        setFormData(prev => ({
          ...prev,
          customer_address: `Position: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          customer_city: 'Position GPS'
        }));
      }
    } catch (error: any) {
      if (error.code === 1) {
        setLocationError('Permission de géolocalisation refusée. Veuillez autoriser l\'accès à votre position.');
      } else if (error.code === 2) {
        setLocationError('Position indisponible. Vérifiez votre connexion internet.');
      } else if (error.code === 3) {
        setLocationError('Délai d\'attente dépassé. Veuillez réessayer.');
      } else {
        setLocationError('Erreur lors de la récupération de votre position. Veuillez saisir manuellement votre adresse.');
      }
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Rate limiting - Vérifier les tentatives de paiement
      const userIdentifier = formData.customer_phone || 'anonymous';
      if (!paymentRateLimiter.isAllowed(userIdentifier)) {
        throw new Error('Trop de tentatives de paiement. Veuillez attendre 15 minutes.');
      }

      // Validation et sanitisation des données
      const paymentData = {
        amount: total,
        orderNumber: generateOrderNumber(),
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_email: formData.customer_email,
        customer_address: formData.customer_address,
        customer_city: formData.customer_city
      };

      const validation = validatePaymentData(paymentData);
      
      if (!validation.isValid) {
        throw new Error(`Données invalides: ${validation.errors.join(', ')}`);
      }

      // Utiliser les données sanitizées
      const sanitizedData = validation.sanitizedData!;
      
      // Mettre à jour le formulaire avec les données sanitizées
      setFormData({
        customer_name: sanitizedData.customer_name,
        customer_phone: sanitizedData.customer_phone,
        customer_email: sanitizedData.customer_email || '',
        customer_address: sanitizedData.customer_address || '',
        customer_city: sanitizedData.customer_city || ''
      });

      // Générer le numéro de commande
      setOrderNumber(sanitizedData.orderNumber);

      // Passer à l'étape de paiement
      setShowPayment(true);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la préparation de la commande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentResponse: any) => {
    try {
      setIsSubmitting(true);
      // Créer la commande dans Supabase avec les informations de paiement
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          payment_provider: paymentResponse.payment_provider,
          transaction_id: paymentResponse.transaction_id,
          payment_reference: paymentResponse.payment_reference,
          payment_status: paymentResponse.payment_status,
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          customer_email: formData.customer_email,
          customer_address: formData.customer_address,
          customer_city: formData.customer_city,
          total_amount: total,
          country: selectedCountry,
          status: 'confirmed',
          notes: formData.notes
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Créer les articles de la commande
      const orderItems = items.map(item => ({
        order_id: order.id,
        item_name: item.name,
        item_type: item.type,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        item_image: item.image
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Envoyer notification simple de confirmation
      try {
        await simpleNotificationService.notifyOrderConfirmation(orderNumber);
      } catch (error) {
        }

      // Envoyer alerte admin pour nouvelle commande
      try {
        adminAlertService.alertNewOrder(
          order.id,
          orderNumber,
          formData.customer_name,
          total
        );
      } catch (error) {
        }

      // Succès !
      alert(`🎉 Commande ${orderNumber} créée avec succès !\nMontant: ${total.toLocaleString()} XOF\nTransaction: ${paymentResponse.transaction_id}`);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la finalisation de la commande');
      setIsSubmitting(false);
    }
  };

  const handlePaymentError = (error: any) => {
    setError(error.message || 'Erreur lors du paiement');
    setShowPayment(false);
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (showPayment) {
    // Normaliser le numéro en E.164 simple pour le passer à FeexPay
    const phoneDigits = formData.customer_phone.replace(/\D/g, '');
    const defaultCountryDial = selectedCountry === 'benin' ? '+229' : '+225';
    const phoneInternational = formData.customer_phone.startsWith('+') ? formData.customer_phone : `${defaultCountryDial}${phoneDigits}`;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto">
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">EP</span>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Paiement sécurisé</h2>
                </div>
                <div className="mt-1 text-sm text-gray-500">Commande {orderNumber} • Total {total.toLocaleString()} XOF</div>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold inline-flex items-center justify-center">1</span>
                <span className="text-sm text-gray-600 hidden sm:inline">Informations</span>
              </div>
              <div className="h-px flex-1 bg-gray-200" />
              <div className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-orange-600 text-white text-xs font-semibold inline-flex items-center justify-center">2</span>
                <span className="text-sm text-gray-900 font-medium hidden sm:inline">Paiement</span>
              </div>
              <div className="h-px flex-1 bg-gray-200" />
              <div className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold inline-flex items-center justify-center">3</span>
                <span className="text-sm text-gray-600 hidden sm:inline">Confirmation</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Col gauche: widget paiement */}
              <div className="md:col-span-2">
                <div className="rounded-xl border border-gray-200 p-4 md:p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center text-gray-700">💳</div>
                    <div className="text-gray-900 font-semibold">Choisissez votre méthode et validez</div>
                  </div>

                  <FeexPayCheckout
                    amount={total}
                    customerInfo={{
                      name: formData.customer_name,
                      phone: phoneInternational,
                      email: formData.customer_email,
                      address: formData.customer_address,
                      city: formData.customer_city
                    }}
                    cartItems={items}
                    orderNumber={orderNumber}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />

                  <div className="mt-3 text-[12px] text-gray-500">Astuce: utilisez un numéro Mobile Money actif et assurez-vous d'avoir du solde. En cas d'échec, réessayez après quelques minutes.</div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button onClick={() => setShowPayment(false)} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Annuler / Modifier les informations</button>
                  <div className="flex items-center gap-2 text-[12px] text-gray-500 sm:w-1/2">
                    <span className="inline-block h-5 w-5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center">✓</span>
                    Paiement chiffré, aucune donnée bancaire n'est stockée par le site.
                  </div>
                </div>
              </div>

              {/* Col droite: récapitulatif */}
              <div className="md:col-span-1">
                <div className="rounded-xl border border-gray-200 p-5 bg-white/60">
                  <h3 className="font-semibold text-gray-900 mb-3">Récapitulatif</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Commande</span><span className="font-medium">{orderNumber}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Client</span><span className="font-medium">{formData.customer_name}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Total</span><span className="font-bold text-gray-900">{total.toLocaleString()} XOF</span></div>
                  </div>
                  <div className="mt-4 pt-4 border-t text-[12px] text-gray-500">
                    Besoin d'aide ? Contactez-nous: {formData.customer_email || 'infos@espacepaserni.org'}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 text-center text-[11px] text-gray-600">
                  <div className="rounded-lg border p-2">🔒 Sécurisé</div>
                  <div className="rounded-lg border p-2">⚡ Rapide</div>
                  <div className="rounded-lg border p-2">💬 Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag size={24} />
              Finaliser la commande
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-1" />
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Votre nom complet"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="+229 XX XX XX XX"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="inline mr-1" />
                Email
              </label>
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="votre@email.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Adresse *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="customer_address"
                    value={formData.customer_address}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Votre adresse"
                    required
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                    title="Utiliser ma position actuelle"
                  >
                    {isGettingLocation ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Navigation size={16} />
                    )}
                    <span className="hidden sm:inline">
                      {isGettingLocation ? 'Localisation...' : 'Ma position'}
                    </span>
                  </button>
                </div>
                {locationError && (
                  <p className="text-red-600 text-sm mt-1">{locationError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville *
                </label>
                <input
                  type="text"
                  name="customer_city"
                  value={formData.customer_city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Votre ville"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare size={16} className="inline mr-1" />
                Notes (optionnel)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Instructions spéciales, allergies, etc."
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Récapitulatif</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{(item.price * item.quantity).toLocaleString()} XOF</span>
                  </div>
                ))}
                <div className="border-t pt-2 font-semibold flex justify-between">
                  <span>Total</span>
                  <span>{total.toLocaleString()} XOF</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Préparation...' : 'Procéder au paiement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};