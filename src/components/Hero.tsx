import React from 'react';
import { useWebsiteData } from '../context/WebsiteDataContext';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Hero() {
  const { setActivePage } = useCart();
  const { heroData } = useWebsiteData();

  const handleGoToMenu = () => {
    setActivePage('menu');
  };

  return (
    <section 
      id="home"
      className="relative w-full min-h-[640px] lg:h-[720px] flex items-center overflow-hidden bg-[#100906]"
    >
      {/* Background Image with theme opacity */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url(${heroData.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Exact required gradient overlay */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 100%)'
        }}
      />

      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left column (Text & CTA) */}
        <div className="lg:col-span-5 flex flex-col items-start text-white space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tighter uppercase">
              {heroData.titleLine1}<br />
              {heroData.titleLine2}<br />
              {heroData.titleLine3}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans font-light text-base md:text-lg tracking-normal text-[#E7E7E7] max-w-sm leading-relaxed"
          >
            {heroData.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <button
              onClick={handleGoToMenu}
              className="h-14 px-8 bg-[#C4430E] hover:bg-[#8D370B] text-white font-sans font-extrabold text-xs tracking-widest uppercase rounded-md flex items-center gap-2.5 shadow-lg shadow-black/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>ORDER NOW</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={handleGoToMenu}
              className="h-14 px-8 border border-white/30 backdrop-blur-md text-white font-sans font-bold text-xs tracking-widest uppercase rounded-md hover:bg-white/10 transition-colors"
            >
              VIEW MENU
            </button>
          </motion.div>
        </div>

        {/* Right column (Hero Image with Float Card) */}
        <div className="lg:col-span-7 flex justify-center lg:justify-end relative w-full h-full min-h-[350px] md:min-h-[450px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[550px] lg:max-w-none lg:w-[110%] lg:translate-x-12 flex items-center justify-center lg:justify-end"
          >
            {/* Soft, beautiful floating pizza container */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut"
              }}
              className="relative w-full h-auto aspect-square flex items-center justify-center"
            >
              {/* Realistic soft shadow behind the pizza */}
              <div className="absolute w-[80%] h-[15%] bottom-6 bg-black/40 blur-[40px] rounded-[100%] scale-x-[0.95] pointer-events-none" />
              
              {heroData.pizzaImage ? (
                <img
                  src={heroData.pizzaImage}
                  alt="Mega Bytes Featured Dish"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform rotate-[2deg]"
                />
              ) : null}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
