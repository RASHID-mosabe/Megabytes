import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWebsiteData } from '../context/WebsiteDataContext';
import { Utensils, ShoppingCart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { cartCount, setIsCartOpen, activePage, setActivePage } = useCart();
  const { navbarData } = useWebsiteData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', id: 'home', href: '#home' },
    { name: 'Menu', id: 'menu', href: '#menu' },
    { name: 'About Us', id: 'about', href: '#features' },
    { name: 'Contact', id: 'contact', href: '#footer' },
  ];

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, pageId: string) => {
    e.preventDefault();
    setActivePage(pageId);
    setIsMobileMenuOpen(false);
  };

  const renderLogoText = () => {
    const text = navbarData?.logoText || "MEGA BYTES.";
    const color = navbarData?.logoColor || "#C4430E";
    const parts = text.split(' ');
    if (parts.length > 1) {
      const lastPart = parts.pop();
      const firstPart = parts.join(' ');
      return (
        <>
          {firstPart} <span style={{ color }}>{lastPart}</span>
        </>
      );
    }
    return <span style={{ color }}>{text}</span>;
  };

  const logoBgColor = navbarData?.logoColor || "#C4430E";
  const isImageLogo = navbarData?.logoType === 'image' && navbarData?.logoImage;

  return (
    <>
      <header className="sticky top-0 z-50 w-full h-[78px] bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-6 md:px-12">
        {/* Logo */}
        <div className="flex items-center shrink-0">
          <a href="#home" className="flex items-center gap-2 group" onClick={(e) => handleNavigation(e, 'home')}>
            {isImageLogo ? (
              <div className="h-10 flex items-center">
                <img 
                  src={navbarData.logoImage} 
                  alt={navbarData.logoText || "Logo"} 
                  className="max-h-10 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div 
                className="w-8 h-8 rounded-md flex items-center justify-center text-white transition-all duration-300"
                style={{ backgroundColor: logoBgColor }}
              >
                <Utensils size={15} className="group-hover:rotate-12 transition-transform duration-300" />
              </div>
            )}
            {!isImageLogo && (
              <span className="font-display font-extrabold text-lg tracking-widest text-[#100906] uppercase whitespace-nowrap">
                {renderLogoText()}
              </span>
            )}
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center flex-1 mx-4 gap-1 lg:gap-3 font-semibold text-sm">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavigation(e, link.id)}
                className={`font-sans font-extrabold text-[11px] tracking-widest uppercase relative px-2.5 lg:px-4 py-2 rounded-md transition-colors duration-300 shrink-0 ${
                  isActive
                    ? 'text-[#C4430E]'
                    : 'text-[#100906]/70 hover:text-[#100906]'
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {isActive && (
                  <>
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 bg-[#C4430E]/8 rounded-md"
                      style={{ originY: '0px' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-1.5 left-2.5 lg:left-4 right-2.5 lg:right-4 h-[2px] bg-[#C4430E] rounded-full z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  </>
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center shrink-0 gap-6">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative h-10 px-5 bg-[#C4430E] hover:bg-[#8D370B] text-white font-sans font-extrabold text-xs tracking-widest uppercase rounded-md flex items-center gap-2 shadow-sm transition-all duration-200"
          >
            <ShoppingCart size={14} />
            <span>Cart</span>
            <span className="absolute -top-1.5 -right-1.5 bg-[#100906] border-2 border-white text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-sm font-extrabold shadow-xs">
              {cartCount}
            </span>
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative h-9 px-4 bg-[#C4430E] text-white font-sans font-extrabold text-xs rounded-md flex items-center gap-1 shadow-sm"
          >
            <ShoppingCart size={13} />
            <span>({cartCount})</span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-9 h-9 rounded-md flex items-center justify-center text-[#100906] hover:bg-gray-50 transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[78px] left-0 w-full bg-white z-30 shadow-lg border-b border-gray-100 px-6 py-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavigation(e, link.id)}
                className={`font-sans font-extrabold text-xs uppercase tracking-widest transition-colors duration-200 border-b border-gray-50 pb-2 ${
                  activePage === link.id
                    ? 'text-[#C4430E]'
                    : 'text-[#100906]/80 hover:text-[#C4430E]'
                }`}
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
