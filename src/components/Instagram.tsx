import React from 'react';
import { useWebsiteData } from '../context/WebsiteDataContext';
import { useCart } from '../context/CartContext';
import { Utensils, Eye, Flame, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function OurMealsSection() {
  const { menuItems, settings } = useWebsiteData();
  const { setSelectedItemForModal, setActivePage } = useCart();

  const currencySymbol = settings?.currency || 'KSh';

  // We display the signature meals that have been highlighted as Must Order, Popular, Swahili Heritage, Kitale Favorite, Chef Special, or Best Seller.
  const allowedBadges = [
    'MUST ORDER',
    'POPULAR',
    'SWAHILI HERITAGE',
    'KITALE FAVORITE',
    'CHEF SPECIAL',
    'BEST SELLER'
  ];

  const featuredMeals = menuItems
    ? menuItems.filter(item => {
        if (!item.badge) return false;
        const cleanBadge = item.badge.trim().toUpperCase();
        return allowedBadges.includes(cleanBadge);
      })
    : [];

  return (
    <section className="w-full bg-[#661C12] py-14 px-6 md:px-12 border-b border-deep-brown overflow-hidden">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Our Meals Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-2 text-[#F5E3C7]/90 font-sans font-bold text-sm tracking-widest uppercase">
            <Utensils size={18} className="text-[#D96A1D]" />
            <span>Chef's Choice</span>
          </div>

          <h2 className="font-display font-black text-2xl md:text-3xl lg:text-4xl text-white text-center sm:absolute sm:left-1/2 sm:-translate-x-1/2 tracking-tight uppercase">
            OUR MEALS
          </h2>

          <div className="flex sm:justify-end">
            <button
              onClick={() => {
                setActivePage('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="h-10 px-6 bg-gradient-to-br from-[#D96A1D] to-[#C45A1E] hover:from-[#E86924] hover:to-[#F17E30] text-white font-sans font-extrabold text-xs tracking-wider rounded-[12px] flex items-center justify-center gap-1.5 transition-all shadow-md group"
            >
              <span>EXPLORE FULL MENU</span>
              <ChevronRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Horizontal scrollable / Grid Gallery */}
        {featuredMeals.length === 0 ? (
          <div className="text-center py-12 text-white/60 font-sans text-sm">
            No meals available in the menu yet. Add some in the Admin panel!
          </div>
        ) : (
          <div className="flex gap-5 overflow-x-auto pb-4 pt-2 no-scrollbar snap-x snap-mandatory touch-pan-x">
            {featuredMeals.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItemForModal(item)}
                className="relative min-w-[260px] sm:min-w-[280px] md:min-w-[300px] md:flex-1 aspect-[4/5] rounded-2xl overflow-hidden group snap-center bg-[#4E140C] shadow-lg border border-white/5 cursor-pointer flex flex-col justify-end"
              >
                {/* Meal Image */}
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                ) : null}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300" />

                {/* Top Badge */}
                {item.badge && (
                  <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-[#C4430E] text-white text-[9px] font-sans font-extrabold tracking-widest uppercase rounded-full shadow-sm flex items-center gap-1">
                    <Flame size={10} className="fill-white" />
                    {item.badge}
                  </div>
                )}

                {/* Category Label */}
                <div className="absolute top-4 right-4 z-10 px-2 py-0.5 bg-black/40 backdrop-blur-xs text-[#F5E3C7] text-[8px] font-sans font-bold tracking-wider uppercase rounded-md border border-white/10">
                  {item.category}
                </div>

                {/* Info Block */}
                <div className="relative p-5 space-y-2 z-10 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-[10px] text-[#D96A1D] font-sans font-extrabold uppercase tracking-widest">
                    {item.calories ? `${item.calories} Calories` : 'Freshly Prepared'}
                  </span>
                  
                  <h3 className="font-display font-black text-lg md:text-xl text-white leading-tight">
                    {item.name}
                  </h3>

                  <p className="text-white/70 text-xs font-sans line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-sans font-extrabold text-sm text-[#F5E3C7]">
                      {currencySymbol} {item.priceMin || item.prices?.Medium || 500}
                    </span>
                    
                    <span className="flex items-center gap-1 text-[10px] text-[#D96A1D] font-sans font-extrabold uppercase tracking-wider group-hover:text-white transition-colors">
                      <Eye size={12} />
                      <span>Order Now</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

