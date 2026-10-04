/**
 * Service de notifications simples et efficaces
 * Remplace OneSignal par des solutions natives
 */

export interface NotificationData {
  title: string;
  message: string;
  icon?: string;
  badge?: string;
  url?: string;
}

class SimpleNotificationService {
  private isInitialized: boolean = false;
  private permission: NotificationPermission = 'default';

  /**
   * Initialise le service de notifications
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // Vérifier si on est sur mobile et activer le contexte audio
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Créer et activer le contexte audio pour mobile
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          if (audioContext.state === 'suspended') {
            await audioContext.resume();
            // Contexte audio activé pour mobile
          }
        } catch (audioError) {
          // Impossible d'activer le contexte audio mobile
        }
      }

      // Vérifier le support des notifications
      if (!('Notification' in window)) {
        // Notifications non supportées par ce navigateur
        this.isInitialized = true;
        return true;
      }

      // Demander la permission si nécessaire
      if (Notification.permission === 'default') {
        this.permission = await Notification.requestPermission();
      } else {
        this.permission = Notification.permission;
      }

      this.isInitialized = true;
      // Service de notifications initialisé
      return true;
    } catch (error) {
      // Erreur lors de l'initialisation des notifications
      this.isInitialized = true; // Marquer comme initialisé pour éviter les boucles
      return true;
    }
  }

  /**
   * Joue un son de notification selon le type (compatible mobile)
   */
  private playNotificationSound(type: 'success' | 'error' | 'info' | 'warning' = 'info'): void {
    try {
      // Vérifier si on est sur mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Sur mobile, utiliser un son plus simple et compatible
        this.playMobileNotificationSound(type);
        return;
      }

      // Créer un contexte audio (desktop)
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // S'assurer que le contexte audio est actif (requis sur mobile)
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          this.playDesktopNotificationSound(audioContext, type);
        });
      } else {
        this.playDesktopNotificationSound(audioContext, type);
      }
    } catch (error) {
            // Impossible de jouer le son de notification
    }
  }

  /**
   * Joue un son simplifié pour mobile
   */
  private playMobileNotificationSound(type: 'success' | 'error' | 'info' | 'warning'): void {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Son plus simple pour mobile
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Sons simplifiés pour mobile
      const mobileSoundConfigs = {
        success: { frequency: 800, duration: 0.2 },
        error: { frequency: 400, duration: 0.3 },
        warning: { frequency: 600, duration: 0.25 },
        info: { frequency: 700, duration: 0.2 }
      };
      
      const config = mobileSoundConfigs[type];
      
      oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Volume plus faible sur mobile
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + config.duration);
    } catch (error) {
            // Impossible de jouer le son mobile
    }
  }

  /**
   * Joue un son détaillé pour desktop
   */
  private playDesktopNotificationSound(audioContext: AudioContext, type: 'success' | 'error' | 'info' | 'warning'): void {
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Sons différents selon le type
      const soundConfigs = {
        success: { frequencies: [800, 1000, 1200], duration: 0.4 },
        error: { frequencies: [400, 300, 200], duration: 0.5 },
        warning: { frequencies: [600, 800, 600], duration: 0.3 },
        info: { frequencies: [800, 600, 800], duration: 0.3 }
      };
      
      const config = soundConfigs[type];
      
      // Configuration du son
      oscillator.frequency.setValueAtTime(config.frequencies[0], audioContext.currentTime);
      oscillator.frequency.setValueAtTime(config.frequencies[1], audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(config.frequencies[2], audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);
      
      // Jouer le son
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + config.duration);
    } catch (error) {
            // Impossible de jouer le son desktop
    }
  }

  /**
   * Déclenche une vibration sur mobile (compatible tous navigateurs)
   */
  private vibrateDevice(): void {
    try {
      // Vérifier si on est sur mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (!isMobile) {
        return; // Pas de vibration sur desktop
      }

      if ('vibrate' in navigator) {
        // Pattern de vibration mobile optimisé
        navigator.vibrate([100, 50, 100]);
      } else if ('vibrate' in window) {
        // Fallback pour certains navigateurs
        (window as any).vibrate([100, 50, 100]);
      }
    } catch (error) {
            // Vibration non supportée
    }
  }

  /**
   * Détermine le type de notification basé sur le titre et le message
   */
  private getNotificationType(title: string, message: string): 'success' | 'error' | 'info' | 'warning' {
    const text = (title + ' ' + message).toLowerCase();
    
    if (text.includes('succès') || text.includes('confirmé') || text.includes('ajouté') || text.includes('félicitations')) {
      return 'success';
    }
    
    if (text.includes('erreur') || text.includes('échec') || text.includes('problème') || text.includes('échec')) {
      return 'error';
    }
    
    if (text.includes('attention') || text.includes('avertissement') || text.includes('attention')) {
      return 'warning';
    }
    
    return 'info';
  }

  /**
   * Envoie une notification native
   */
  async sendNotification(data: NotificationData): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Déterminer le type de notification (par défaut 'info')
      const notificationType = this.getNotificationType(data.title, data.message);

      // Jouer le son de notification
      this.playNotificationSound(notificationType);

      // Déclencher la vibration sur mobile
      this.vibrateDevice();

      // Si les notifications ne sont pas supportées, utiliser les toast
      if (!('Notification' in window) || this.permission !== 'granted') {
        this.showToast(data.title, data.message, notificationType);
        return true;
      }

      // Créer et afficher la notification native
      const notification = new Notification(data.title, {
        body: data.message,
        icon: data.icon || '/logo%201.jpeg', // Logo principal du site
        badge: data.badge || '/favicon-32x32.png',
        tag: 'espace-paserni-notification', // Éviter les doublons
        requireInteraction: false,
        silent: false, // S'assurer que le son est activé
        image: '/logo%201.jpeg' // Image principale pour les notifications riches
      });

      // Fermer automatiquement après 5 secondes
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Action au clic
      notification.onclick = () => {
        window.focus();
        if (data.url) {
          window.location.href = data.url;
        }
        notification.close();
      };

      // Notification native envoyée avec son et vibration
      return true;
    } catch (error) {
      // Erreur lors de l'envoi de notification
      // Fallback vers toast avec son
      this.showToast(data.title, data.message, 'error');
      return false;
    }
  }

  /**
   * Affiche une notification toast dans l'interface
   */
  showToast(title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info'): void {
    try {
      // Jouer le son de notification pour les toasts aussi
      this.playNotificationSound(type);

      // Déclencher la vibration sur mobile
      this.vibrateDevice();

      // Créer le conteneur toast s'il n'existe pas
      let toastContainer = document.getElementById('toast-container');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(toastContainer);
      }

      // Créer le toast
      const toast = document.createElement('div');
      toast.className = `toast toast-${type} transform translate-x-full opacity-0 transition-all duration-300 ease-in-out`;
      
      // Icône selon le type
      const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
      };

      toast.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg border-l-4 border-${this.getBorderColor(type)} p-4 min-w-80 max-w-96">
          <div class="flex items-start gap-3">
            <div class="text-2xl">${icons[type]}</div>
            <div class="flex-1">
              <h4 class="font-semibold text-gray-900 text-sm">${title}</h4>
              <p class="text-gray-600 text-sm mt-1">${message}</p>
            </div>
            <button class="text-gray-400 hover:text-gray-600 transition-colors" onclick="this.parentElement.parentElement.remove()">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      `;

      toastContainer.appendChild(toast);

      // Animation d'entrée
      setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
      }, 100);

      // Suppression automatique après 5 secondes
      setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
          if (toast.parentElement) {
            toast.remove();
          }
        }, 300);
      }, 5000);

      // Toast affiché
    } catch (error) {
      // Erreur lors de l'affichage du toast
    }
  }

  /**
   * Obtient la couleur de bordure selon le type
   */
  private getBorderColor(type: string): string {
    const colors = {
      success: 'green-500',
      error: 'red-500',
      warning: 'yellow-500',
      info: 'blue-500'
    };
    return colors[type as keyof typeof colors] || 'blue-500';
  }

  /**
   * Notification pour ajout au panier
   */
  async notifyAddToCart(itemName: string): Promise<boolean> {
    // Son spécifique pour ajout au panier (success)
    this.playNotificationSound('success');
    this.vibrateDevice();
    
    return this.sendNotification({
      title: 'Article ajouté au panier',
      message: `${itemName} a été ajouté à votre panier. Voir.`,
      url: '/galeries',
      icon: '/logo%201.jpeg'
    });
  }

  /**
   * Notification pour confirmation de commande
   */
  async notifyOrderConfirmation(orderNumber: string): Promise<boolean> {
    // Son spécifique pour confirmation (success avec variation)
    this.playNotificationSound('success');
    this.vibrateDevice();
    
    return this.sendNotification({
      title: 'Commande confirmée !',
      message: `Félicitations ! Votre commande ${orderNumber} est confirmée et payée.`,
      url: '/mes-commandes',
      icon: '/logo%201.jpeg'
    });
  }

  /**
   * Notification personnalisée
   */
  async sendCustomNotification(title: string, message: string, url?: string): Promise<boolean> {
    return this.sendNotification({
      title,
      message,
      url,
      icon: '/favicon-32x32.png'
    });
  }

  /**
   * Vérifie si les notifications sont supportées
   */
  isSupported(): boolean {
    return 'Notification' in window;
  }

  /**
   * Obtient le statut des permissions
   */
  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  /**
   * Demande la permission pour les notifications
   */
  async requestPermission(): Promise<boolean> {
    try {
      if (!('Notification' in window)) {
        return false;
      }

      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    } catch (error) {
      // Erreur lors de la demande de permission
      return false;
    }
  }
}

// Instance singleton
export const simpleNotificationService = new SimpleNotificationService();

// Hook React pour utiliser le service
export const useSimpleNotifications = () => {
  const [isSupported, setIsSupported] = React.useState(false);
  const [permission, setPermission] = React.useState<NotificationPermission>('default');

  React.useEffect(() => {
    const checkSupport = async () => {
      const supported = simpleNotificationService.isSupported();
      setIsSupported(supported);
      
      if (supported) {
        await simpleNotificationService.initialize();
        setPermission(simpleNotificationService.getPermissionStatus());
      }
    };

    checkSupport();
  }, []);

  return {
    isSupported,
    permission,
    requestPermission: simpleNotificationService.requestPermission.bind(simpleNotificationService),
    sendNotification: simpleNotificationService.sendNotification.bind(simpleNotificationService),
    notifyAddToCart: simpleNotificationService.notifyAddToCart.bind(simpleNotificationService),
    notifyOrderConfirmation: simpleNotificationService.notifyOrderConfirmation.bind(simpleNotificationService),
    showToast: simpleNotificationService.showToast.bind(simpleNotificationService)
  };
};
