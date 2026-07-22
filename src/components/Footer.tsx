import React from 'react';
import { Utensils, Facebook, Instagram, Twitter, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWebsiteData } from '../context/WebsiteDataContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { setActivePage } = useCart();
  const { contactData, navbarData } = useWebsiteData();

  const logoBgColor = navbarData?.logoColor || "#C4430E";
  const isImageLogo = navbarData?.logoType === 'image' && navbarData?.logoImage;

  const handleScrollToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    setActivePage('home');
  };

  const handleLinkClick = (e: React.MouseEvent, pageId: string) => {
    e.preventDefault();
    setActivePage(pageId);
  };

  const renderFooterLogoText = () => {
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

  return (
    <footer id="footer" className="relative w-full bg-[#100906] text-white/80 py-16 px-6 md:px-12 border-t border-gray-900">
      <div className="relative z-10 max-w-[1400px] mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          
          {/* Column 1: Logo & Branding */}
          <div className="space-y-5">
            <a href="#home" onClick={handleScrollToHome} className="flex items-center gap-2 group w-fit">
              {isImageLogo ? (
                <div className="h-10 flex items-center bg-white/5 px-2.5 py-1 rounded-md">
                  <img 
                    src={navbarData.logoImage} 
                    alt={navbarData.logoText || "Logo"} 
                    className="max-h-8 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-md flex items-center justify-center text-white" style={{ backgroundColor: logoBgColor }}>
                    <Utensils size={15} className="group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <span className="font-display font-extrabold text-sm tracking-widest text-white uppercase">
                    {renderFooterLogoText()}
                  </span>
                </>
              )}
            </a>
            <p className="font-sans text-xs text-white/50 leading-relaxed max-w-[280px]">
              Enjoy a serene atmosphere and attentive service in Kitale. We serve a diverse and flavorful menu featuring exquisite Indian curries, sizzling Chinese platters, and authentic Swahili delicacies.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-md border border-white/15 hover:border-[#C4430E] hover:bg-[#C4430E] text-white flex items-center justify-center transition-all duration-300"
              >
                <Facebook size={14} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-md border border-white/15 hover:border-[#C4430E] hover:bg-[#C4430E] text-white flex items-center justify-center transition-all duration-300"
              >
                <Instagram size={14} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 rounded-md border border-white/15 hover:border-[#C4430E] hover:bg-[#C4430E] text-white flex items-center justify-center transition-all duration-300"
              >
                <Twitter size={14} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-display font-extrabold text-xs text-white tracking-widest uppercase border-l-[2px] border-[#C4430E] pl-3">
              About & Support
            </h3>
            <ul className="space-y-2.5 pl-3">
              {[
                { name: 'About Us', page: 'about' },
                { name: 'Our Kitchen', page: 'about' },
                { name: 'Careers', page: 'about' },
                { name: 'FAQs & Help', page: 'about' },
                { name: 'Terms of Service', page: 'about' },
                { name: 'Privacy Policy', page: 'about' }
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={`#${link.page}`} 
                    onClick={(e) => handleLinkClick(e, link.page)}
                    className="font-sans text-xs text-white/60 hover:text-[#C4430E] transition-colors duration-200 uppercase tracking-wider text-[10px]"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Custom Stylized Map */}
          <div className="space-y-4">
            <h3 className="font-display font-extrabold text-xs text-white tracking-widest uppercase border-l-[2px] border-[#C4430E] pl-3">
              Our Map Location
            </h3>
            <div className="relative w-full h-[120px] rounded-md overflow-hidden border border-white/10 bg-[#E7E7E7]/10 flex items-center justify-center">
              {/* schematic map vector visual */}
              <div className="absolute inset-0 bg-[#FAF9F6] p-2 flex flex-col justify-between pointer-events-none">
                {/* Simulated streets lines */}
                <div className="absolute top-4 left-0 right-0 h-[1px] bg-black/10 transform rotate-12" />
                <div className="absolute top-12 left-0 right-0 h-[1px] bg-black/10 transform -rotate-6" />
                <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-black/10 transform -rotate-12" />
                <div className="absolute top-0 bottom-0 left-28 w-[1px] bg-black/10 transform rotate-45" />
                {/* Rivers/Water placeholder */}
                <div className="absolute right-0 bottom-0 top-6 w-8 bg-blue-400/10 rounded-l-md" />
                {/* Styled marker pin overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-md bg-[#C4430E] flex items-center justify-center text-white shadow-lg animate-bounce duration-1000">
                    <Utensils size={12} />
                  </div>
                  <div className="w-2 h-1 rounded-full bg-[#C4430E]/40 blur-xs mt-0.5" />
                </div>
                {/* Mini label */}
                <div className="absolute bottom-1.5 left-1.5 bg-[#100906] px-2 py-0.5 rounded-sm text-[8px] font-sans text-white uppercase tracking-wider font-bold">
                  Kitale, Kenya
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Contact Details */}
          <div className="space-y-4">
            <h3 className="font-display font-extrabold text-xs text-white tracking-widest uppercase border-l-[2px] border-[#C4430E] pl-3">
              Location Info
            </h3>
            <div className="space-y-3.5 pl-3 font-sans text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="text-[#C4430E] shrink-0 mt-0.5" />
                <span className="text-white/60">
                  {contactData.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-[#C4430E] shrink-0" />
                <span className="text-white/60">{contactData.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-[#C4430E] shrink-0" />
                <span className="text-white/60">{contactData.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe size={14} className="text-[#C4430E] shrink-0" />
                <span className="text-white/60">{contactData.website}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom copyright Row */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-[10px] uppercase tracking-widest text-white/30">
          <p>© {currentYear} Mega Bytes Restaurant. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="hover:text-[#C4430E] transition-colors">Privacy Policy</a>
            <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="hover:text-[#C4430E] transition-colors">Terms of Use</a>
            <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="hover:text-[#C4430E] transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
