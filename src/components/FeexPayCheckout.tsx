import React, { useEffect } from 'react';
import { FeexPayProvider, FeexPayButton } from '@feexpay/react-sdk';
import '@feexpay/react-sdk/style.css';
import { CartItem } from '../lib/supabase';
import { FEEXPAY_CONFIG, generatePaymentReference } from '../config/feexpay';

interface FeexPayCheckoutProps {
  amount: number;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
  };
  cartItems: CartItem[];
  onSuccess: (response: any) => void;
  onError?: (error: any) => void;
  orderNumber: string;
}

const FeexPayCheckout: React.FC<FeexPayCheckoutProps> = ({
  amount,
  customerInfo,
  cartItems,
  onSuccess,
  onError,
  orderNumber
}) => {
  // Générer une référence unique pour la transaction
  const customId = generatePaymentReference(orderNumber);
  
  // Description de la commande
  const description = `Commande Espace Paserni ${orderNumber} - ${cartItems.length} article(s)`;

  // Écouter les événements FeexPay globaux
  useEffect(() => {
    const handleFeexPaySuccess = (event: any) => {
      const response = event.detail || event;
      
      // FeexPay retourne "SUCCESSFUL" en majuscules
      if (response.status === 'SUCCESSFUL' || response.status === 'success' || response.status === 'completed') {
        // Paiement réussi
        const successData = {
          ...response,
          payment_provider: 'feexpay',
          payment_reference: customId,
          transaction_id: response.transaction_id || response.reference,
          payment_status: 'completed'
        };
        onSuccess(successData);
      }
    };

    const handleFeexPayError = (event: any) => {
      const error = event.detail || event;
      if (onError) {
        onError(error);
      }
    };

    // Écouter les événements personnalisés FeexPay
    window.addEventListener('feexpay-success', handleFeexPaySuccess);
    window.addEventListener('feexpay-error', handleFeexPayError);

    return () => {
      window.removeEventListener('feexpay-success', handleFeexPaySuccess);
      window.removeEventListener('feexpay-error', handleFeexPayError);
    };
  }, [customId, onSuccess, onError]);

  const handlePaymentCallback = (response: any) => {
    // FeexPay retourne "SUCCESSFUL" en majuscules
    if (response.status === 'SUCCESSFUL' || response.status === 'success' || response.status === 'completed') {
      // Paiement réussi
      const successData = {
        ...response,
        payment_provider: 'feexpay',
        payment_reference: customId,
        transaction_id: response.transaction_id || response.reference,
        payment_status: 'completed'
      };
      onSuccess(successData);
    } else {
      // Paiement échoué
      const error = {
        message: response.message || 'Paiement échoué',
        status: response.status,
        ...response
      };
      
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <div className="feexpay-checkout-container">
      <FeexPayProvider>
        <FeexPayButton
          // Montant en XOF (min SANDBOX=1, LIVE=100)
          amount={Math.max(FEEXPAY_CONFIG.mode === 'LIVE' ? 100 : 1, Math.round(Number(amount) || 0))}
          
          // Description (sans caractères spéciaux)
          description={description}
          
          // Clé API depuis la configuration
          token={FEEXPAY_CONFIG.token}
          
          // ID de la boutique depuis la configuration
          id={FEEXPAY_CONFIG.shopId}
          
          // Référence personnalisée unique
          customId={customId}

          // Redirection navigateur après paiement réussi.
          // Le SDK fait window.location.href = `${callback_url}?ref=…`.
          // Ce n'est PAS le webhook serveur : le SDK n'envoie à FeeXPay que
          // merchant_domain (l'origine navigateur). L'URL du webhook serveur
          // se configure dans le dashboard FeeXPay (FEEXPAY_CONFIG.callbackServer).
          callback_url={FEEXPAY_CONFIG.callbackUrl}

          // Redirection navigateur en cas d'échec (mêmes mechanics)
          error_callback_url={FEEXPAY_CONFIG.errorCallbackUrl}
          
          // Informations client
          callback_info={{
            address: `${customerInfo.address}, ${customerInfo.city}`,
            phone: customerInfo.phone,
            email: customerInfo.email,
            fullname: customerInfo.name,
            order_number: orderNumber,
            items_count: cartItems.length.toString()
          }}
          
          // Mode depuis la configuration (compat SANDBOX/LIVE)
          mode={FEEXPAY_CONFIG.mode}
          
          // Fonction de callback
          callback={handlePaymentCallback}
          
          // Texte du bouton
          buttonText="Payer maintenant"
          
          // Style du bouton
          buttonClass="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center text-lg"
          
          // Devise depuis la configuration
          currency={FEEXPAY_CONFIG.currency}
          
          // Cacher certains champs (ils sont déjà remplis)
          fields_to_hide={["email", "name", "phone"]}
        />
      </FeexPayProvider>
    </div>
  );
};

export default FeexPayCheckout;
