import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Menu from '../components/Menu';
import AboutView from '../components/AboutView';
import ContactView from '../components/ContactView';
import AdminView from '../components/AdminView';
import OurMealsSection from '../components/Instagram';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import ItemDetailModal from '../components/ItemDetailModal';
import { AnimatePresence, motion } from 'motion/react';
import { useCart } from '../context/CartContext';

export default function Home() {
  const { activePage } = useCart();

  return (
    <div className="min-h-screen bg-[#F5E3C7] text-dark-brown selection:bg-btn-orange selection:text-white flex flex-col">
      {/* Structural layout wrapper centering with a maximum boundary of 1400px as requested */}
      <div className="w-full mx-auto relative flex-1 flex flex-col justify-between">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Dynamic page router with smooth motion transitions */}
        <main className="flex-1 w-full flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="w-full flex-1 flex flex-col"
            >
              {activePage === 'home' && (
                <>
                  <Hero />
                  <OurMealsSection />
                </>
              )}
              {activePage === 'menu' && <Menu />}
              {activePage === 'about' && <AboutView />}
              {activePage === 'contact' && <ContactView />}
              {activePage === 'admin' && <AdminView />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer Area with stylized mini map pointer */}
        <Footer />

        {/* Sticky side Drawer and config Modal overlays inside AnimatePresence for clean transitions */}
        <AnimatePresence mode="wait">
          <CartDrawer />
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          <ItemDetailModal />
        </AnimatePresence>

      </div>
    </div>
  );
}
