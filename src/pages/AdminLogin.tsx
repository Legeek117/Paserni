import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useCountry, countries, Country } from '../contexts/CountryContext'
import { logLoginAttempt, getUserAgent, detectSuspiciousPatterns } from '../utils/securityMonitoring'

const AdminLogin: React.FC = () => {
  const navigate = useNavigate()
  const { selectedCountry, setCountry } = useCountry()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionExpired, setSessionExpired] = useState(false)

  // Vérifier si la session a expiré au chargement
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const reason = params.get('reason')
    if (reason === 'session-expired') {
      setSessionExpired(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    const userAgent = getUserAgent()
    
    try {
      // Détecter les patterns suspects
      if (detectSuspiciousPatterns(userAgent)) {
        setError('Accès non autorisé détecté')
        return
      }
      
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      
      if (error) {
        // Logger la tentative échouée
        logLoginAttempt(email, false, userAgent)
        throw error
      }
      
      // Logger la connexion réussie
      logLoginAttempt(email, true, userAgent)
      
      // Définir l'expiration de session immédiatement après la connexion
      const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 heures
      const expiryTime = Date.now() + SESSION_DURATION;
      localStorage.setItem('admin_session_expiry', expiryTime.toString());
      
      // Redirige vers la route demandée si fournie
      const params = new URLSearchParams(window.location.search)
      const redirectTo = params.get('redirectTo')
      navigate(redirectTo || '/admin')
    } catch (err: any) {
      setError(err.message || 'Connexion échouée')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Branding / Illustration */}
      <div className="hidden lg:flex items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <img
              src="/LOGO%20EP%20insubation%20(1).jpg"
              alt="Espace Paserni"
              className="w-16 h-16 rounded-lg object-contain bg-white shadow"
              onError={(e) => { const i = e.currentTarget as HTMLImageElement; i.src = '/logo.png' }}
            />
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">Espace Paserni</h1>
              <p className="text-gray-600">Administration</p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border border-orange-100 bg-white">
            <div className="h-48 bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
              <div className="text-white text-center">
                <Lock size={48} className="mx-auto mb-4 opacity-90" />
                <h2 className="text-xl font-semibold">Accès Sécurisé</h2>
                <p className="text-orange-100 mt-2">Tableau de bord administrateur</p>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Gestion des commandes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Suivi des ventes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Analytics avancées</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
              <img
                src="/LOGO%20EP%20insubation%20(1).jpg"
                alt="Espace Paserni"
                className="w-12 h-12 rounded-lg object-contain bg-white shadow"
                onError={(e) => { const i = e.currentTarget as HTMLImageElement; i.src = '/logo.png' }}
              />
              <div className="text-left">
                <h1 className="text-2xl font-serif font-bold text-gray-900">Espace Paserni</h1>
                <p className="text-gray-600 text-sm">Administration</p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Connexion Admin</h2>
            <p className="text-gray-600">Accédez à votre tableau de bord</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pays
              </label>
              <div className="relative">
                <select
                  value={selectedCountry}
                  onChange={(e) => setCountry(e.target.value as Country)}
                  className="w-full appearance-none pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white"
                >
                  {Object.values(countries).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
              </div>
            </div>
            {sessionExpired && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-yellow-800 text-xs">!</span>
                  </div>
                  <span className="font-medium">Session expirée</span>
                </div>
                <p className="mt-1">Votre session a expiré pour des raisons de sécurité. Veuillez vous reconnecter.</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="admin@espacepaserni.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Connexion...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/home')}
              className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
            >
              ← Retour au site
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin