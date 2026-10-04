/**
 * Utilitaires de sécurité pour les paiements
 */

// Interface pour la validation des paiements
export interface PaymentValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData?: any;
}

// Fonction pour valider les données de paiement
export const validatePaymentData = (paymentData: any): PaymentValidationResult => {
  const errors: string[] = [];
  
  // Validation du montant
  if (!paymentData.amount || typeof paymentData.amount !== 'number' || paymentData.amount <= 0) {
    errors.push('Montant invalide');
  }
  
  // Validation du numéro de commande
  if (!paymentData.orderNumber || typeof paymentData.orderNumber !== 'string') {
    errors.push('Numéro de commande invalide');
  }
  
  // Validation des données client
  if (!paymentData.customer_name || typeof paymentData.customer_name !== 'string') {
    errors.push('Nom client invalide');
  }
  
  if (!paymentData.customer_phone || typeof paymentData.customer_phone !== 'string') {
    errors.push('Téléphone client invalide');
  }
  
  // Sanitisation des données
  const sanitizedData = {
    amount: Math.round(paymentData.amount * 100) / 100, // Arrondir à 2 décimales
    orderNumber: sanitizeString(paymentData.orderNumber),
    customer_name: sanitizeString(paymentData.customer_name),
    customer_phone: sanitizePhone(paymentData.customer_phone),
    customer_email: paymentData.customer_email ? sanitizeEmail(paymentData.customer_email) : undefined,
    customer_address: paymentData.customer_address ? sanitizeString(paymentData.customer_address) : undefined,
    customer_city: paymentData.customer_city ? sanitizeString(paymentData.customer_city) : undefined
  };
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  };
};

// Fonction pour sanitiser les chaînes de caractères
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Supprimer les scripts
    .replace(/javascript:/gi, '') // Supprimer les URLs javascript
    .replace(/on\w+\s*=/gi, '') // Supprimer les événements inline
    .substring(0, 500); // Limiter la longueur
};

// Fonction pour sanitiser les emails
export const sanitizeEmail = (email: string): string => {
  const sanitized = sanitizeString(email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(sanitized)) {
    throw new Error('Format email invalide');
  }
  
  return sanitized.toLowerCase();
};

// Fonction pour sanitiser les numéros de téléphone
export const sanitizePhone = (phone: string): string => {
  const sanitized = sanitizeString(phone);
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,20}$/;
  
  if (!phoneRegex.test(sanitized)) {
    throw new Error('Format téléphone invalide');
  }
  
  return sanitized.replace(/\D/g, ''); // Garder seulement les chiffres
};

// Fonction pour valider la signature webhook (à implémenter avec FeeXPay)
export const validateWebhookSignature = (payload: string, signature: string, secret: string): boolean => {
  try {
    // Implémentation de la validation de signature HMAC
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    return false;
  }
};

// Fonction pour générer un token CSRF
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Fonction pour valider un token CSRF
export const validateCSRFToken = (token: string, sessionToken: string): boolean => {
  return token === sessionToken && token.length === 64;
};

// Fonction pour limiter les tentatives de paiement
export class PaymentRateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private maxAttempts = 5;
  private timeWindow = 15 * 60 * 1000; // 15 minutes
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier);
    
    if (!userAttempts) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }
    
    // Reset si la fenêtre de temps est dépassée
    if (now - userAttempts.lastAttempt > this.timeWindow) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }
    
    // Vérifier le nombre de tentatives
    if (userAttempts.count >= this.maxAttempts) {
      return false;
    }
    
    // Incrémenter le compteur
    userAttempts.count++;
    userAttempts.lastAttempt = now;
    this.attempts.set(identifier, userAttempts);
    
    return true;
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Instance globale du rate limiter
export const paymentRateLimiter = new PaymentRateLimiter();
