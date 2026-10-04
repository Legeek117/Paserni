import React from 'react'
import { supabase } from '../lib/supabase'
import { Navigate, useLocation } from 'react-router-dom'
import { useCountry } from '../contexts/CountryContext'

// Constantes pour la gestion des sessions
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 heures en millisecondes
const SESSION_STORAGE_KEY = 'admin_session_expiry';

// Fonction pour vérifier si la session a expiré
const isSessionExpired = (): boolean => {
  try {
    const expiryTime = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!expiryTime) return true;
    
    const expiry = parseInt(expiryTime, 10);
    const now = Date.now();
    
    return now > expiry;
  } catch {
    return true;
  }
};

// Fonction pour définir l'expiration de la session
const setSessionExpiry = (): void => {
  try {
    const expiryTime = Date.now() + SESSION_DURATION;
    localStorage.setItem(SESSION_STORAGE_KEY, expiryTime.toString());
  } catch (error) {
    }
};

// Fonction pour nettoyer l'expiration de la session
const clearSessionExpiry = (): void => {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    }
};

const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const { selectedCountry } = useCountry()
  const [loading, setLoading] = React.useState(true)
  const [allowed, setAllowed] = React.useState(false)
  const [reason, setReason] = React.useState<string | null>(null)
  
  React.useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setAllowed(false)
        setReason('no-session')
        setLoading(false)
        clearSessionExpiry()
        return
      }

      // Vérifier si la session a expiré seulement si elle existe
      if (isSessionExpired()) {
        setAllowed(false)
        setReason('session-expired')
        setLoading(false)
        // Nettoyer la session expirée
        await supabase.auth.signOut()
        clearSessionExpiry()
        return
      }
      
      const { data, error } = await supabase
        .from('admins')
        .select('email, country')
        .eq('email', session.user.email)
        .maybeSingle()
      if (error || !data) {
        setAllowed(false)
        setReason('not-admin')
        setLoading(false)
        clearSessionExpiry()
        return
      }
      // If country is set for admin, enforce match with selectedCountry
      if (data.country && data.country !== selectedCountry) {
        setAllowed(false)
        setReason('country-mismatch')
        setLoading(false)
        return
      }
      
      // Session valide - définir l'expiration
      setSessionExpiry()
      setAllowed(true)
      setLoading(false)
    })()
  }, [selectedCountry])
  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center text-gray-600">Vérification…</div>
  }
  if (!allowed) {
    const redirectTo = encodeURIComponent(location.pathname + location.search + location.hash)
    return <Navigate to={`/admin/login?redirectTo=${redirectTo}&reason=${reason || ''}`} replace />
  }
  return <>{children}</>
}

export default RequireAdmin

      // Check admin email in admins table
