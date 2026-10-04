/**
 * Utilitaires de validation et sanitisation des entrées utilisateur
 */

// Interface pour les résultats de validation
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: any;
}

// Fonction pour valider et sanitiser les emails
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email || typeof email !== 'string') {
    errors.push('Email requis');
    return { isValid: false, errors };
  }
  
  const sanitized = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(sanitized)) {
    errors.push('Format email invalide');
  }
  
  if (sanitized.length > 254) {
    errors.push('Email trop long');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: errors.length === 0 ? sanitized : undefined
  };
};

// Fonction pour valider et sanitiser les numéros de téléphone
export const validatePhone = (phone: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!phone || typeof phone !== 'string') {
    errors.push('Téléphone requis');
    return { isValid: false, errors };
  }
  
  const sanitized = phone.trim();
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,20}$/;
  
  if (!phoneRegex.test(sanitized)) {
    errors.push('Format téléphone invalide');
  }
  
  const digits = sanitized.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15) {
    errors.push('Numéro de téléphone invalide (8-15 chiffres)');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: errors.length === 0 ? digits : undefined
  };
};

// Fonction pour valider et sanitiser les noms
export const validateName = (name: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name || typeof name !== 'string') {
    errors.push('Nom requis');
    return { isValid: false, errors };
  }
  
  const sanitized = name.trim();
  
  if (sanitized.length < 2) {
    errors.push('Nom trop court (minimum 2 caractères)');
  }
  
  if (sanitized.length > 100) {
    errors.push('Nom trop long (maximum 100 caractères)');
  }
  
  // Vérifier qu'il n'y a pas de caractères dangereux
  const dangerousChars = /<script|javascript:|on\w+\s*=/i;
  if (dangerousChars.test(sanitized)) {
    errors.push('Caractères non autorisés détectés');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: errors.length === 0 ? sanitized : undefined
  };
};

// Fonction pour valider et sanitiser les adresses
export const validateAddress = (address: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!address || typeof address !== 'string') {
    errors.push('Adresse requise');
    return { isValid: false, errors };
  }
  
  const sanitized = address.trim();
  
  if (sanitized.length < 5) {
    errors.push('Adresse trop courte (minimum 5 caractères)');
  }
  
  if (sanitized.length > 500) {
    errors.push('Adresse trop longue (maximum 500 caractères)');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: errors.length === 0 ? sanitized : undefined
  };
};

// Fonction pour valider et sanitiser les messages/commentaires
export const validateMessage = (message: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!message || typeof message !== 'string') {
    errors.push('Message requis');
    return { isValid: false, errors };
  }
  
  const sanitized = message.trim();
  
  if (sanitized.length < 10) {
    errors.push('Message trop court (minimum 10 caractères)');
  }
  
  if (sanitized.length > 2000) {
    errors.push('Message trop long (maximum 2000 caractères)');
  }
  
  // Supprimer les balises HTML dangereuses
  const cleaned = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: errors.length === 0 ? cleaned : undefined
  };
};

// Fonction pour valider les montants
export const validateAmount = (amount: number): ValidationResult => {
  const errors: string[] = [];
  
  if (typeof amount !== 'number' || isNaN(amount)) {
    errors.push('Montant invalide');
    return { isValid: false, errors };
  }
  
  if (amount <= 0) {
    errors.push('Montant doit être positif');
  }
  
  if (amount > 1000000) {
    errors.push('Montant trop élevé (maximum 1,000,000)');
  }
  
  const sanitized = Math.round(amount * 100) / 100; // Arrondir à 2 décimales
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: errors.length === 0 ? sanitized : undefined
  };
};

// Fonction pour valider les quantités
export const validateQuantity = (quantity: number): ValidationResult => {
  const errors: string[] = [];
  
  if (typeof quantity !== 'number' || isNaN(quantity)) {
    errors.push('Quantité invalide');
    return { isValid: false, errors };
  }
  
  if (!Number.isInteger(quantity)) {
    errors.push('Quantité doit être un nombre entier');
  }
  
  if (quantity <= 0) {
    errors.push('Quantité doit être positive');
  }
  
  if (quantity > 100) {
    errors.push('Quantité trop élevée (maximum 100)');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: errors.length === 0 ? Math.floor(quantity) : undefined
  };
};

// Fonction pour valider les URLs
export const validateUrl = (url: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!url || typeof url !== 'string') {
    errors.push('URL requise');
    return { isValid: false, errors };
  }
  
  const sanitized = url.trim();
  
  try {
    const urlObj = new URL(sanitized);
    
    // Vérifier que c'est HTTPS en production
    if (urlObj.protocol !== 'https:' && import.meta.env.PROD) {
      errors.push('URL doit utiliser HTTPS en production');
    }
    
    // Vérifier que ce n'est pas un domaine suspect
    const suspiciousDomains = ['localhost', '127.0.0.1', '0.0.0.0'];
    if (suspiciousDomains.includes(urlObj.hostname)) {
      errors.push('Domaine non autorisé');
    }
    
  } catch {
    errors.push('Format URL invalide');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: errors.length === 0 ? sanitized : undefined
  };
};

// Fonction pour valider les formulaires complets
export const validateForm = (formData: Record<string, any>, rules: Record<string, (value: any) => ValidationResult>): ValidationResult => {
  const errors: string[] = [];
  const sanitizedData: Record<string, any> = {};
  
  for (const [field, value] of Object.entries(formData)) {
    const rule = rules[field];
    if (rule) {
      const result = rule(value);
      if (!result.isValid) {
        errors.push(...result.errors.map(error => `${field}: ${error}`));
      } else if (result.sanitizedValue !== undefined) {
        sanitizedData[field] = result.sanitizedValue;
      }
    } else {
      sanitizedData[field] = value;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: errors.length === 0 ? sanitizedData : undefined
  };
};
