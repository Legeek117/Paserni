/**
 * Service d'alertes pour l'administration
 */

import React from 'react';

export interface AdminAlert {
  id: string;
  type: 'new_order' | 'payment_received' | 'order_updated';
  title: string;
  message: string;
  timestamp: Date;
  orderId?: string;
  orderNumber?: string;
  read: boolean;
}

class AdminAlertService {
  private alerts: AdminAlert[] = [];
  private listeners: Array<(alerts: AdminAlert[]) => void> = [];
  private soundEnabled: boolean = true;

  /**
   * Ajoute un écouteur pour les nouvelles alertes
   */
  addListener(callback: (alerts: AdminAlert[]) => void): () => void {
    this.listeners.push(callback);
    
    // Retourner une fonction pour supprimer l'écouteur
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notifie tous les écouteurs
   */
  private notifyListeners(): void {
    this.listeners.forEach(callback => callback([...this.alerts]));
  }

  /**
   * Ajoute une nouvelle alerte
   */
  addAlert(alert: Omit<AdminAlert, 'id' | 'timestamp' | 'read'>): void {
    const newAlert: AdminAlert = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };

    this.alerts.unshift(newAlert);
    
    // Limiter à 50 alertes maximum
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(0, 50);
    }

    // Jouer le son d'alerte
    if (this.soundEnabled) {
      this.playAlertSound();
    }

    // Notifier les écouteurs
    this.notifyListeners();

    // Nouvelle alerte admin ajoutée
  }

  /**
   * Alerte pour nouvelle commande
   */
  alertNewOrder(orderId: string, orderNumber: string, customerName: string, total: number): void {
    this.addAlert({
      type: 'new_order',
      title: 'Nouvelle commande !',
      message: `Commande ${orderNumber} de ${customerName} (${total.toLocaleString()} XOF)`,
      orderId,
      orderNumber
    });
  }

  /**
   * Alerte pour paiement reçu
   */
  alertPaymentReceived(orderId: string, orderNumber: string, amount: number): void {
    this.addAlert({
      type: 'payment_received',
      title: 'Paiement reçu !',
      message: `Paiement confirmé pour la commande ${orderNumber} (${amount.toLocaleString()} XOF)`,
      orderId,
      orderNumber
    });
  }

  /**
   * Marque une alerte comme lue
   */
  markAsRead(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.read = true;
      this.notifyListeners();
    }
  }

  /**
   * Marque toutes les alertes comme lues
   */
  markAllAsRead(): void {
    this.alerts.forEach(alert => alert.read = true);
    this.notifyListeners();
  }

  /**
   * Supprime une alerte
   */
  removeAlert(alertId: string): void {
    this.alerts = this.alerts.filter(a => a.id !== alertId);
    this.notifyListeners();
  }

  /**
   * Supprime toutes les alertes
   */
  clearAllAlerts(): void {
    this.alerts = [];
    this.notifyListeners();
  }

  /**
   * Obtient toutes les alertes
   */
  getAlerts(): AdminAlert[] {
    return [...this.alerts];
  }

  /**
   * Obtient le nombre d'alertes non lues
   */
  getUnreadCount(): number {
    return this.alerts.filter(alert => !alert.read).length;
  }

  /**
   * Active/désactive le son d'alerte
   */
  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  /**
   * Joue le son d'alerte
   */
  private playAlertSound(): void {
    try {
      // Vérifier si on est sur mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Créer un contexte audio
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // S'assurer que le contexte audio est actif (requis sur mobile)
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          this.playAdminSound(audioContext, isMobile);
        });
      } else {
        this.playAdminSound(audioContext, isMobile);
      }
      
      // Vibration pour les alertes admin (pattern d'urgence)
      this.playAdminVibration();
    } catch (error) {
      // Impossible de jouer le son d'alerte
    }
  }

  private playAdminSound(audioContext: AudioContext, isMobile: boolean): void {
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (isMobile) {
        // Son simplifié pour mobile
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1500, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      } else {
        // Son détaillé pour desktop
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1500, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(1500, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      }
    } catch (error) {
      // Impossible de jouer le son admin
    }
  }

  private playAdminVibration(): void {
    try {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (!isMobile) {
        return; // Pas de vibration sur desktop
      }

      if ('vibrate' in navigator) {
        // Pattern d'urgence pour admin
        navigator.vibrate([200, 100, 200, 100, 200]);
      } else if ('vibrate' in window) {
        (window as any).vibrate([200, 100, 200, 100, 200]);
      }
    } catch (error) {
      // Impossible de jouer la vibration admin
    }
  }

  /**
   * Teste le son d'alerte
   */
  testAlertSound(): void {
    this.playAlertSound();
  }
}

// Instance singleton
export const adminAlertService = new AdminAlertService();

// Hook React pour utiliser le service
export const useAdminAlerts = () => {
  const [alerts, setAlerts] = React.useState<AdminAlert[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    const removeListener = adminAlertService.addListener((newAlerts) => {
      setAlerts(newAlerts);
      setUnreadCount(adminAlertService.getUnreadCount());
    });

    // Charger les alertes existantes
    setAlerts(adminAlertService.getAlerts());
    setUnreadCount(adminAlertService.getUnreadCount());

    return removeListener;
  }, []);

  return {
    alerts,
    unreadCount,
    markAsRead: adminAlertService.markAsRead.bind(adminAlertService),
    markAllAsRead: adminAlertService.markAllAsRead.bind(adminAlertService),
    removeAlert: adminAlertService.removeAlert.bind(adminAlertService),
    clearAllAlerts: adminAlertService.clearAllAlerts.bind(adminAlertService),
    testAlertSound: adminAlertService.testAlertSound.bind(adminAlertService),
    setSoundEnabled: adminAlertService.setSoundEnabled.bind(adminAlertService)
  };
};
