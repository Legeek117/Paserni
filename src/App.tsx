import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CountryProvider } from './contexts/CountryContext';
import { CartProvider } from './contexts/CartContext';
import BannerManager from './components/BannerManager';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Programs from './pages/Programs';
import Projects from './pages/Projects';
import Gallery from './pages/Gallery';
import Restaurant from './pages/Restaurant';
import OrdersTrack from './pages/OrdersTrack';
import PaymentReturn from './pages/PaymentReturn';
import PaymentError from './pages/PaymentError';
import PaymentCancelled from './pages/PaymentCancelled';
import Contact from './pages/Contact';
import Departments from './pages/Departments';
import PDGBuildingGallery from './pages/PDGBuildingGallery';
import PDGComEventsGallery from './pages/PDGComEventsGallery';
import PDGMobilierGallery from './pages/PDGMobilierGallery';
import PDGPuzzlesGallery from './pages/PDGPuzzlesGallery';
import PDGDigitalSolutionsGallery from './pages/PDGDigitalSolutionsGallery';
import PDGGalerieGallery from './pages/PDGGalerieGallery';
import PDGLearningGallery from './pages/PDGLearningGallery';
import PDGProjectsGallery from './pages/PDGProjectsGallery';
import PDGCafeGallery from './pages/PDGCafeGallery';
import LesAteliersPDGGallery from './pages/LesAteliersPDGGallery';
import AdminLogin from './pages/AdminLogin';
import RequireAdmin from './components/RequireAdmin';
import RequireCountry from './components/RequireCountry';
import AdminLayout from './admin/AdminLayout';
import OrdersPage from './admin/OrdersPage';
import ProductsPage from './admin/ProductsPage';
import AnalyticsPage from './admin/AnalyticsPage';
import SettingsPage from './admin/SettingsPage';
import DepartmentImagesPage from './admin/DepartmentImagesPage';
import DepartmentsPage from './admin/DepartmentsPage';
import BannersPage from './admin/BannersPage';
import CartFab from './components/CartFab';
import { Cart } from './components/Cart';
import CountrySelection from './pages/CountrySelection';
import NewsletterSignup from './components/NewsletterSignup';
import ScrollToTop from './components/ScrollToTop';

const transitions = [
  { initial: { opacity: 0, rotateX: -8, y: 24 }, animate: { opacity: 1, rotateX: 0, y: 0 }, exit: { opacity: 0, rotateX: 8, y: -24 } },
  { initial: { opacity: 0, rotateY: -12, x: -30 }, animate: { opacity: 1, rotateY: 0, x: 0 }, exit: { opacity: 0, rotateY: 12, x: 30 } },
  { initial: { opacity: 0, scale: 0.94 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.06 } },
  { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -40 } },
];

const PageTransitionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navCountRef = React.useRef(0);

  React.useEffect(() => {
    navCountRef.current += 1;
    // Force reset scroll to top on route change
    try {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      (document.scrollingElement || document.body).scrollTop = 0;
    } catch (err) {
      // Not critical, log for debugging
      }
  }, [location.pathname]);

  const preset = transitions[navCountRef.current % transitions.length];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={preset.initial}
        animate={preset.animate}
        exit={preset.exit}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{ transformOrigin: '50% 0%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  const location = useLocation();
  const [showCart, setShowCart] = React.useState(false);
  
  const isAdmin = location.pathname.startsWith('/admin');
  const isCountrySelection = location.pathname === '/';

  return (
    <CountryProvider>
      <CartProvider>
        <div className="min-h-screen bg-white">
          {!isCountrySelection && !isAdmin && <Header />}
          
          <main className={isAdmin ? '' : "pt-0"}>
            {isAdmin ? (
              <Routes>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<RequireCountry><RequireAdmin><AdminLayout /></RequireAdmin></RequireCountry>}>
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="department-images" element={<DepartmentImagesPage />} />
                  <Route path="departments" element={<DepartmentsPage />} />
                  <Route path="banners" element={<BannersPage />} />
                  <Route index element={<OrdersPage />} />
                </Route>
              </Routes>
            ) : (
              <PageTransitionWrapper>
                <Routes>
                  <Route path="/" element={<CountrySelection />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/departements" element={<Departments />} />
                  <Route path="/departements/pdg-building-gallery" element={<PDGBuildingGallery />} />
                  <Route path="/departements/pdg-com-events-gallery" element={<PDGComEventsGallery />} />
                  <Route path="/departements/pdg-mobilier-gallery" element={<PDGMobilierGallery />} />
                  <Route path="/departements/pdg-puzzles-gallery" element={<PDGPuzzlesGallery />} />
                  <Route path="/departements/pdg-digital-solutions-gallery" element={<PDGDigitalSolutionsGallery />} />
                  <Route path="/departements/pdg-galerie-gallery" element={<PDGGalerieGallery />} />
                  <Route path="/departements/pdg-learning-gallery" element={<PDGLearningGallery />} />
                  <Route path="/departements/pdg-projects-gallery" element={<PDGProjectsGallery />} />
                  <Route path="/departements/pdg-cafe-gallery" element={<PDGCafeGallery />} />
                  <Route path="/departements/les-ateliers-pdg-gallery" element={<LesAteliersPDGGallery />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/programmes" element={<Programs />} />
                  <Route path="/projet" element={<Projects />} />
                  <Route path="/galeries" element={<Gallery />} />
                  <Route path="/restaurant" element={<Restaurant />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/mes-commandes" element={<OrdersTrack />} />
                  <Route path="/paiement/retour" element={<PaymentReturn />} />
                  <Route path="/paiement/erreur" element={<PaymentError />} />
                  <Route path="/paiement/annule" element={<PaymentCancelled />} />
                </Routes>
              </PageTransitionWrapper>
            )}
          </main>

          {!isAdmin && <CartFab onClick={() => setShowCart(true)} />}
          
          {!isAdmin && showCart && (
            <div className="fixed inset-0 bg-black/40 z-[60]" onClick={() => setShowCart(false)}>
              <div className="absolute right-0 top-20 md:top-24 h-[calc(100%-5rem)] md:h-[calc(100%-6rem)] w-full sm:w-[420px] bg-white shadow-xl p-4 z-[70]" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Votre Panier</h3>
                  <button onClick={() => setShowCart(false)} className="text-gray-600 hover:text-gray-900">Fermer</button>
                </div>
                <Cart />
              </div>
            </div>
          )}

          {!isCountrySelection && !isAdmin && (
            <>
              <NewsletterSignup />
              <Footer />
              <ScrollToTop />
            </>
          )}

          {/* Système de bannières publicitaires */}
          {!isAdmin && <BannerManager />}
        </div>
      </CartProvider>
    </CountryProvider>
  );
}

export default App;