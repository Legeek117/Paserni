// Configuration FeexPay - SÉCURISÉE (Variables d'environnement avec fallback)
const feexpayApiKey = import.meta.env?.VITE_FEEXPAY_API_KEY
const feexpayMerchantId = import.meta.env?.VITE_FEEXPAY_MERCHANT_ID
const feexpayMode = import.meta.env?.VITE_FEEXPAY_MODE
const feexpayCallbackUrl = import.meta.env?.VITE_FEEXPAY_CALLBACK_URL
const appUrl = import.meta.env?.VITE_APP_URL

// Fallback temporaire pour le développement
const finalApiKey = feexpayApiKey || 'fp_Mzpfp9SkSsuxi5bLkenKykkVrQNpsGxYmim3yc51nDE3VIgHoEAIDoEtrX3r5FYa'
const finalMerchantId = feexpayMerchantId || '681535f823d328ae65ff37d4'
const finalMode = (feexpayMode as 'SANDBOX' | 'LIVE') || 'LIVE'
// Webhook hébergé sur Supabase Edge Functions (toujours actif, pas de mise en veille)
const finalCallbackUrl = feexpayCallbackUrl || 'https://ferumuzfwegshuezfdbq.supabase.co/functions/v1/feexpay-webhook'
const finalAppUrl = appUrl || 'https://www.espacepaserni.org'

// Utilisation des fallbacks si les variables d'environnement ne sont pas chargées

export const FEEXPAY_CONFIG = {
  // Clé API - depuis .env ou fallback
  token: finalApiKey,

  // ID de la boutique - depuis .env ou fallback
  shopId: finalMerchantId,

  // Mode: depuis .env ou fallback
  mode: finalMode,

  // Devise par défaut
  currency: 'XOF',

  // URLs de callback FeexPay (serveur) et retour (front)
  // callbackServer est l'URL appelée par FeexPay (webhook Render)
  // callbackUrl est l'URL de retour navigateur après paiement
  callbackServer: finalCallbackUrl,
  callbackUrl: `${finalAppUrl}/paiement/retour`,
  errorCallbackUrl: `${finalAppUrl}/paiement/erreur`
};

// Fonction pour générer une référence unique
export const generatePaymentReference = (orderNumber: string): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `EP_${orderNumber}_${timestamp}${random}`;
};

// Fonction pour valider la configuration - SÉCURISÉE
export const validateFeexPayConfig = (): boolean => {
  if (!FEEXPAY_CONFIG.token || !FEEXPAY_CONFIG.shopId) {
    return false;
  }
  
  if (!FEEXPAY_CONFIG.callbackServer) {
    return false;
  }
  
  if (!FEEXPAY_CONFIG.callbackUrl || !FEEXPAY_CONFIG.errorCallbackUrl) {
    return false;
  }
  
  return true;
};

// Fonction pour vérifier si on est en mode production
export const isProductionMode = (): boolean => {
  return FEEXPAY_CONFIG.mode === 'LIVE';
};

// Fonction pour obtenir l'URL de callback sécurisée
export const getSecureCallbackUrl = (): string => {
  if (!import.meta.env?.VITE_APP_URL) {
    return 'https://www.espacepaserni.org';
  }
  return import.meta.env.VITE_APP_URL;
};

export default FEEXPAY_CONFIG;
