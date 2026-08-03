import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Scroll Restoration helper component
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    // Prevent scrolling during loader
    document.body.style.overflow = 'hidden';

    const step1 = setTimeout(() => setLoadingStep(1), 700);
    const step2 = setTimeout(() => setLoadingStep(2), 1400);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = 'unset';
    }, 2200);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <ShopProvider>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF9F9] text-gray-950 select-none overflow-hidden"
          >
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#C62828]/3 blur-[100px] pointer-events-none" />

            {/* Corner Bracket Borders for technical luxury aesthetic */}
            <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-gray-200" />
            <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-gray-200" />
            <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-gray-200" />
            <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-gray-200" />

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center max-w-sm px-6 text-center space-y-7 z-10 animate-none">
              <div className="space-y-1.5">
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-[10px] font-bold tracking-[0.35em] text-gray-500 uppercase"
                >
                  Tournament Rigging & Gear
                </motion.p>
              </div>

              {/* Luxury Minimalist Loading Bar */}
              <div className="relative w-44 h-[2px] bg-gray-200/80 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.0, ease: "easeInOut" }}
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#C62828]/80 via-[#C62828] to-[#C62828]/80"
                />
              </div>

              {/* Status Note Selector */}
              <div className="h-4 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={loadingStep}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 0.5 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="text-[9px] font-mono tracking-widest text-gray-600 uppercase font-bold"
                  >
                    {loadingStep === 0 && "CALIBRATING CARBON MATRICES"}
                    {loadingStep === 1 && "TUNING DRAG ASSEMBLIES"}
                    {loadingStep === 2 && "GEAR ENGINE SYNC COMPLETE"}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-[#FAF9F9]">
          
          {/* Main navigation & side cart */}
          <Navbar />
          <CartDrawer />

          {/* Master Pages router */}
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/category/:categorySlug" element={<CategoryPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/about" element={<AboutPage />} />
              {/* Unknown routes get a proper 404 page instead of silently loading home */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>

          {/* Footer banner */}
          <Footer />

        </div>
      </Router>
    </ShopProvider>
  );
}
