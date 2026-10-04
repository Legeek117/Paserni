import React from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { LogOut, BarChart3, PackageSearch, Settings, ClipboardList, Image as ImageIcon, Building, Megaphone } from 'lucide-react'
import AdminAlertPanel from '../components/AdminAlertPanel'
import SessionTimer from '../components/SessionTimer'

const AdminLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = React.useState<string | null>(null)
  
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null))
  }, [])
  
  React.useLayoutEffect(() => {
    try {
      const prev = document.documentElement.style.scrollBehavior
      document.documentElement.style.scrollBehavior = 'auto'
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      ;(document.scrollingElement || document.body).scrollTop = 0
      setTimeout(() => { document.documentElement.style.scrollBehavior = prev }, 0)
    } catch {}
  }, [location.pathname])
  
  const signOut = async () => {
    await supabase.auth.signOut()
    // Nettoyer l'expiration de session
    localStorage.removeItem('admin_session_expiry')
    navigate('/admin/login')
  }

  const handleSessionExpired = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('admin_session_expiry')
    navigate('/admin/login?reason=session-expired')
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-gradient-to-r from-slate-900 to-slate-800 text-white p-3 sm:p-4 sticky top-0 z-50 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <img src="/LOGO%20EP%20insubation%20(1).jpg" alt="EP" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-contain bg-white/10 p-1 flex-shrink-0" onError={(e)=>{const i=e.currentTarget as HTMLImageElement; i.src='/logo.png'}} />
            <div className="min-w-0 flex-1">
              <div className="text-base sm:text-lg font-bold truncate">Espace Paserni</div>
              <div className="text-xs text-white/70">Administration</div>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden sm:block">
              <SessionTimer onSessionExpired={handleSessionExpired} />
            </div>
            <AdminAlertPanel />
            {email && (
              <div className="hidden sm:block text-xs text-white/70 truncate max-w-24">{email}</div>
            )}
            <button
              onClick={signOut}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 rounded-lg transition-all duration-300 border border-red-500/30 hover:border-red-400/50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
        {/* Session Timer pour mobile - en dessous */}
        <div className="sm:hidden mt-2">
          <SessionTimer onSessionExpired={handleSessionExpired} />
        </div>
      </div>

      <div className="md:grid md:grid-cols-[280px,1fr]">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex md:flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 md:min-h-screen sticky top-0 shadow-2xl">
        <div className="mb-8 flex items-center gap-4">
          <div className="relative">
            <img src="/LOGO%20EP%20insubation%20(1).jpg" alt="EP" className="w-12 h-12 rounded-xl object-contain bg-white/10 p-2 shadow-lg" onError={(e)=>{const i=e.currentTarget as HTMLImageElement; i.src='/logo.png'}} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <div>
            <div className="text-lg font-bold tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Espace Paserni</div>
            <div className="text-xs text-white/70 uppercase tracking-wider font-medium">Administration</div>
            {email && (
              <div className="text-xs text-white/50 mt-1">{email}</div>
            )}
          </div>
        </div>
        <nav className="space-y-2">
          <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Navigation</div>
          <NavLink to="/admin/orders" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25' : 'text-white/80 hover:text-white hover:bg-white/10 hover:shadow-md'}`}>
            <ClipboardList className="w-5 h-5" />
            <span className="font-medium">Commandes</span>
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25' : 'text-white/80 hover:text-white hover:bg-white/10 hover:shadow-md'}`}>
            <PackageSearch className="w-5 h-5" />
            <span className="font-medium">Catalogue</span>
          </NavLink>
          <NavLink to="/admin/analytics" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25' : 'text-white/80 hover:text-white hover:bg-white/10 hover:shadow-md'}`}>
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </NavLink>
          <NavLink to="/admin/department-images" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25' : 'text-white/80 hover:text-white hover:bg-white/10 hover:shadow-md'}`}>
            <ImageIcon className="w-5 h-5" />
            <span className="font-medium">Images Départements</span>
          </NavLink>
          <NavLink to="/admin/departments" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25' : 'text-white/80 hover:text-white hover:bg-white/10 hover:shadow-md'}`}>
            <Building className="w-5 h-5" />
            <span className="font-medium">Départements</span>
          </NavLink>
          <NavLink to="/admin/banners" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25' : 'text-white/80 hover:text-white hover:bg-white/10 hover:shadow-md'}`}>
            <Megaphone className="w-5 h-5" />
            <span className="font-medium">Bannières</span>
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25' : 'text-white/80 hover:text-white hover:bg-white/10 hover:shadow-md'}`}>
            <Settings className="w-5 h-5" />
            <span className="font-medium">Paramètres</span>
          </NavLink>
        </nav>
        
        {/* User info and logout */}
        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="mb-4">
            <SessionTimer onSessionExpired={handleSessionExpired} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{email}</div>
                <div className="text-xs text-white/50">Administrateur</div>
              </div>
            <AdminAlertPanel />
          </div>
          <button
            onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 group"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Déconnexion</span>
          </button>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 pb-20 md:pb-6 min-h-screen">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50 shadow-lg">
        <div className="grid grid-cols-6">
          <NavLink to="/admin/orders" className={({ isActive }) => `flex flex-col items-center justify-center gap-1 py-2 px-1 text-xs transition-all duration-300 ${isActive ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'}`}>
            <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-[10px] sm:text-xs leading-tight">Commandes</span>
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `flex flex-col items-center justify-center gap-1 py-2 px-1 text-xs transition-all duration-300 ${isActive ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'}`}>
            <PackageSearch className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-[10px] sm:text-xs leading-tight">Catalogue</span>
          </NavLink>
          <NavLink to="/admin/analytics" className={({ isActive }) => `flex flex-col items-center justify-center gap-1 py-2 px-1 text-xs transition-all duration-300 ${isActive ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'}`}>
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-[10px] sm:text-xs leading-tight">Analytics</span>
          </NavLink>
          <NavLink to="/admin/department-images" className={({ isActive }) => `flex flex-col items-center justify-center gap-1 py-2 px-1 text-xs transition-all duration-300 ${isActive ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'}`}>
            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-[10px] sm:text-xs leading-tight">Images</span>
          </NavLink>
          <NavLink to="/admin/banners" className={({ isActive }) => `flex flex-col items-center justify-center gap-1 py-2 px-1 text-xs transition-all duration-300 ${isActive ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'}`}>
            <Megaphone className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-[10px] sm:text-xs leading-tight">Bannières</span>
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => `flex flex-col items-center justify-center gap-1 py-2 px-1 text-xs transition-all duration-300 ${isActive ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'}`}>
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-[10px] sm:text-xs leading-tight">Paramètres</span>
          </NavLink>
        </div>
      </nav>
    </div>
  )
}

export default AdminLayout