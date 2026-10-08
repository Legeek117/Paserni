// Configuration FeexPay
//
// Les secrets ne doivent JAMAIS être codés en dur ici : ce fichier est inclus
// dans le bundle navigateur, donc lisible par n'importe qui sur le site.
// Les variables doivent provenir de l'environnement de build (VITE_*) et
// l'absence doit être une erreur explicite au démarrage, pas un fallback silencieux.

const env = import.meta.env ?? {}

const requireEnv = (key: string): string => {
  const value = env[key]
  if (!value || typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      `[FeexPay] Variable d'environnement manquante: ${key}. ` +
        'Définis-la dans .env (ou les variables du builder) avant de builder.'
    )
  }
  return value.trim()
}

const feexpayApiKey = env.VITE_FEEXPAY_API_KEY
const feexpayMerchantId = env.VITE_FEEXPAY_MERCHANT_ID
const feexpayMode = env.VITE_FEEXPAY_MODE
const feexpayCallbackUrl = env.VITE_FEEXPAY_CALLBACK_URL
const appUrl = env.VITE_APP_URL

// Mode par défaut : SANDBOX tant que LIVE n'est pas explicitement demandé,
// pour ne jamais déclencher une transaction réelle par accident.
const finalMode = (feexpayMode as 'SANDBOX' | 'LIVE') || 'SANDBOX'

export const FEEXPAY_CONFIG = {
  // Clé API - obligatoire, fournie par l'environnement de build
  token: feexpayApiKey ?? '',

  // ID de la boutique - obligatoire, fourni par l'environnement de build
  shopId: feexpayMerchantId ?? '',

  mode: finalMode,

  // Devise par défaut
  currency: 'XOF',

  // callbackServer : URL du webhook serveur, appelée par FeexPay.
  // À configurer côté dashboard FeeXPay ET via build-filter
  // (cf. FEEXPAY_API_BASE dans vite.config.ts) - le SDK React ne transmet
  // pas d'URL de webhook, il n'envoie que merchant_domain (l'origine navigateur).
  callbackServer: feexpayCallbackUrl ?? '',

  // callbackUrl / errorCallbackUrl : redirections navigateur après paiement,
  // supportées nativement par le SDK via window.location.href.
  callbackUrl: appUrl ? `${appUrl}/paiement/retour` : '/paiement/retour',
  errorCallbackUrl: appUrl ? `${appUrl}/paiement/erreur` : '/paiement/erreur'
}

// Fonction pour générer une référence unique
export const generatePaymentReference = (orderNumber: string): string => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 4).toUpperCase()
  return `EP_${orderNumber}_${timestamp}${random}`
}

// Fonction pour valider la configuration
export const validateFeexPayConfig = (): boolean => {
  return Boolean(
    FEEXPAY_CONFIG.token &&
    FEEXPAY_CONFIG.shopId &&
    FEEXPAY_CONFIG.callbackUrl &&
    FEEXPAY_CONFIG.errorCallbackUrl
  )
}

// Liste des variables d'environnement requises (utile pour le diagnostic)
export const getMissingFeexPayEnv = (): string[] =>
  ['VITE_FEEXPAY_API_KEY', 'VITE_FEEXPAY_MERCHANT_ID'].filter(
    (key) => !env[key]
  )

// Fonction pour vérifier si on est en mode production
export const isProductionMode = (): boolean => {
  return FEEXPAY_CONFIG.mode === 'LIVE'
}

export { requireEnv }

export default FEEXPAY_CONFIG