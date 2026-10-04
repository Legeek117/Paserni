import React, { useState } from 'react';
import { Bell, X, Check, Trash2, Volume2, VolumeX, AlertCircle, ShoppingBag, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAlerts } from '../services/adminAlertService';

interface AdminAlertPanelProps {
  className?: string;
}

const AdminAlertPanel: React.FC<AdminAlertPanelProps> = ({ className = '' }) => {
  const { alerts, unreadCount, markAsRead, markAllAsRead, removeAlert, clearAllAlerts, testAlertSound, setSoundEnabled: setServiceSoundEnabled } = useAdminAlerts();
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSoundToggle = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    setServiceSoundEnabled(newSoundEnabled);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'new_order':
        return <ShoppingBag className="w-4 h-4 text-green-600" />;
      case 'payment_received':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bouton d'alerte */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </button>

      {/* Panel d'alertes */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Alertes</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSoundToggle}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title={soundEnabled ? 'Désactiver le son' : 'Activer le son'}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={testAlertSound}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Tester le son"
                  >
                    🔊
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {alerts.length > 0 && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Tout marquer comme lu
                  </button>
                  <button
                    onClick={clearAllAlerts}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Tout supprimer
                  </button>
                </div>
              )}
            </div>

            {/* Liste des alertes */}
            <div className="max-h-96 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>Aucune alerte</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {alerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !alert.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {alert.title}
                            </h4>
                            <span className="text-xs text-gray-500 ml-2">
                              {formatTime(alert.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {alert.message}
                          </p>
                          {alert.orderNumber && (
                            <p className="text-xs text-gray-500 mt-1">
                              Commande: {alert.orderNumber}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0 flex gap-1">
                          {!alert.read && (
                            <button
                              onClick={() => markAsRead(alert.id)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Marquer comme lu"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={() => removeAlert(alert.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Supprimer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAlertPanel;
