/**
 * Système de monitoring de sécurité
 */

// Interface pour les événements de sécurité
export interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'payment_attempt' | 'suspicious_activity' | 'rate_limit_exceeded' | 'validation_error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  userAgent?: string;
  ip?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Interface pour les statistiques de sécurité
export interface SecurityStats {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsBySeverity: Record<string, number>;
  recentEvents: SecurityEvent[];
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private maxEvents = 1000; // Limiter le nombre d'événements en mémoire
  
  // Ajouter un événement de sécurité
  logEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date()
    };
    
    this.events.push(securityEvent);
    
    // Limiter le nombre d'événements
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
    
    // Log dans la console en développement
    if (import.meta.env.DEV) {
      // Log de sécurité en développement
    }
    
    // En production, envoyer à un service de monitoring
    if (import.meta.env.PROD) {
      this.sendToMonitoringService(securityEvent);
    }
  }
  
  // Générer un ID unique pour l'événement
  private generateEventId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  
  // Envoyer à un service de monitoring (à implémenter)
  private sendToMonitoringService(event: SecurityEvent): void {
    // TODO: Implémenter l'envoi vers un service de monitoring
    // Exemple: Sentry, LogRocket, ou service personnalisé
    }
  
  // Obtenir les statistiques de sécurité
  getStats(): SecurityStats {
    const eventsByType: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};
    
    this.events.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
    });
    
    return {
      totalEvents: this.events.length,
      eventsByType,
      eventsBySeverity,
      recentEvents: this.events.slice(-50) // 50 événements récents
    };
  }
  
  // Obtenir les événements par type
  getEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
    return this.events.filter(event => event.type === type);
  }
  
  // Obtenir les événements par sévérité
  getEventsBySeverity(severity: SecurityEvent['severity']): SecurityEvent[] {
    return this.events.filter(event => event.severity === severity);
  }
  
  // Nettoyer les anciens événements
  clearOldEvents(olderThanHours: number = 24): void {
    const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    this.events = this.events.filter(event => event.timestamp > cutoff);
  }
}

// Instance globale du moniteur de sécurité
export const securityMonitor = new SecurityMonitor();

// Fonctions utilitaires pour logger des événements spécifiques
export const logLoginAttempt = (email: string, success: boolean, userAgent?: string) => {
  securityMonitor.logEvent({
    type: 'login_attempt',
    severity: success ? 'low' : 'medium',
    message: `Tentative de connexion ${success ? 'réussie' : 'échouée'} pour ${email}`,
    userAgent,
    metadata: { email, success }
  });
};

export const logPaymentAttempt = (amount: number, success: boolean, userAgent?: string) => {
  securityMonitor.logEvent({
    type: 'payment_attempt',
    severity: success ? 'low' : 'high',
    message: `Tentative de paiement ${success ? 'réussie' : 'échouée'} de ${amount} XOF`,
    userAgent,
    metadata: { amount, success }
  });
};

export const logSuspiciousActivity = (activity: string, userAgent?: string, metadata?: Record<string, any>) => {
  securityMonitor.logEvent({
    type: 'suspicious_activity',
    severity: 'high',
    message: `Activité suspecte détectée: ${activity}`,
    userAgent,
    metadata
  });
};

export const logRateLimitExceeded = (endpoint: string, userAgent?: string) => {
  securityMonitor.logEvent({
    type: 'rate_limit_exceeded',
    severity: 'medium',
    message: `Rate limit dépassé pour ${endpoint}`,
    userAgent,
    metadata: { endpoint }
  });
};

export const logValidationError = (field: string, error: string, userAgent?: string) => {
  securityMonitor.logEvent({
    type: 'validation_error',
    severity: 'low',
    message: `Erreur de validation sur ${field}: ${error}`,
    userAgent,
    metadata: { field, error }
  });
};

// Fonction pour détecter des patterns suspects
export const detectSuspiciousPatterns = (userAgent: string, ip?: string): boolean => {
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /php/i
  ];
  
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));
  
  if (isSuspicious) {
    logSuspiciousActivity(`User-Agent suspect: ${userAgent}`, userAgent, { ip });
  }
  
  return isSuspicious;
};

// Fonction pour obtenir l'IP de l'utilisateur (approximative)
export const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || 'unknown';
  } catch {
    return 'unknown';
  }
};

// Fonction pour obtenir le User-Agent
export const getUserAgent = (): string => {
  return navigator.userAgent || 'unknown';
};
