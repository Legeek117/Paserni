import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface SessionTimerProps {
  onSessionExpired: () => void;
}

const SessionTimer: React.FC<SessionTimerProps> = ({ onSessionExpired }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isWarning, setIsWarning] = useState<boolean>(false);

  useEffect(() => {
    const updateTimer = () => {
      try {
        const expiryTime = localStorage.getItem('admin_session_expiry');
        if (!expiryTime) {
          // Ne pas déclencher l'expiration si la session n'existe pas encore
          setTimeRemaining(0);
          return;
        }

        const expiry = parseInt(expiryTime, 10);
        const now = Date.now();
        const remaining = expiry - now;

        if (remaining <= 0) {
          onSessionExpired();
          return;
        }

        setTimeRemaining(remaining);
        
        // Afficher un avertissement 30 minutes avant l'expiration
        setIsWarning(remaining <= 30 * 60 * 1000);
      } catch (error) {
        // Ne pas déclencher l'expiration en cas d'erreur
        setTimeRemaining(0);
      }
    };

    // Mise à jour immédiate
    updateTimer();

    // Mise à jour toutes les minutes
    const interval = setInterval(updateTimer, 60000);

    return () => clearInterval(interval);
  }, [onSessionExpired]);

  const formatTime = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (timeRemaining === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
      isWarning 
        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
        : 'bg-blue-100 text-blue-800 border border-blue-200'
    }`}>
      {isWarning ? (
        <AlertTriangle className="w-4 h-4" />
      ) : (
        <Clock className="w-4 h-4" />
      )}
      <span className="font-medium">
        Session expire dans {formatTime(timeRemaining)}
      </span>
    </div>
  );
};

export default SessionTimer;
