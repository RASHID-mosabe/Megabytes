import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWebsiteData } from '../context/WebsiteDataContext';
import { MenuItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Eye, Check } from 'lucide-react';

export default function Menu() {
  const { addToCart, setSelectedItemForModal } = useCart();
  const { menuItems, menuCategories } = useWebsiteData();
  
  // Compute categories dynamically
  const categoriesList = menuCategories.length > 0 
    ? menuCategories.filter(c => c.isVisible).sort((a, b) => a.displayOrder - b.displayOrder).map(c => c.name)
    : ['Sizzlers', 'Swahili', 'Indian', 'Chinese', 'Sides'];

  const [activeCategory, setActiveCategory] = useState<string>(() => categoriesList[0] || 'Sizzlers');
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);

  // Automatically update active category if the dynamic categories change
  React.useEffect(() => {
    if (categoriesList.length > 0 && !categoriesList.includes(activeCategory)) {
      setActiveCategory(categoriesList[0]);
    }
  }, [menuCategories]);

  const filteredItems = menuItems.filter((item) => item.category === activeCategory);

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    addToCart(item, 'Medium', 1);
    
    // Toast-like notification on the button itself
    setAddedItemIds((prev) => [...prev, item.id]);
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter((id) => id !== item.id));
    }, 2000);
  };

  return (
    <section 
      id="menu" 
      className="w-full py-20 px-6 md:px-12 bg-[#4A2412] border-y border-[#2A160E]/50 relative"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
        backgroundSize: 'auto'
      }}
    >
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Section Heading */}
        <div className="text-center space-y-3">
          <h2 className="font-display font-extrabold text-2xl md:text-3xl lg:text-4xl text-white tracking-widest uppercase">
            OUR FUSION MENU
          </h2>
          <div className="w-12 h-[2px] bg-[#D95413] mx-auto" />
        </div>

        {/* Categories Tab Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {categoriesList.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative px-6 py-2.5 rounded-md font-sans font-extrabold text-[11px] md:text-xs tracking-widest uppercase transition-all duration-300 ${
                  isActive
                    ? 'text-white bg-[#D95413] shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/10 bg-white/5 border border-white/10'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Menu Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const isAdded = addedItemIds.includes(item.id);
              return (
                <motion.article
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-xl p-3 shadow-xl overflow-hidden flex flex-col h-[380px] transition-all duration-300 relative group border border-gray-100"
                >
                  {/* Badge */}
                  {item.badge && (
                    <span className="absolute top-5 left-5 z-10 bg-[#D95413] text-white font-sans font-extrabold text-[8px] px-2.5 py-0.5 rounded-sm uppercase tracking-wider shadow-sm">
                      {item.badge}
                    </span>
                  )}

                  {/* Image Container - 60% height visual balance */}
                  <div className="w-full h-[170px] rounded-lg overflow-hidden relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={() => setSelectedItemForModal(item)}
                        className="p-2.5 bg-white text-[#D95413] hover:text-white hover:bg-[#D95413] rounded-md shadow-md transition-all scale-90 group-hover:scale-100 duration-300"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Info Area - Sleek side-by-side spacing & deep-brown tones */}
                  <div className="flex-1 flex flex-col justify-between pt-1">
                    <div>
                      <div className="flex items-center justify-between mt-2.5">
                        <h3 className="font-display font-extrabold text-sm text-[#100906] tracking-wide uppercase line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-[#8D370B] font-extrabold text-sm whitespace-nowrap ml-2">
                          Sh {item.priceMin.toLocaleString()}+
                        </p>
                      </div>
                      <p className="font-sans text-[11px] text-[#100906]/65 line-clamp-2 mt-1 leading-normal">
                        {item.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedItemForModal(item)}
                        className="h-9 border border-[#100906]/20 hover:border-[#100906] text-[#100906] font-sans font-bold text-[9px] tracking-widest rounded-md flex items-center justify-center gap-1 transition-colors"
                      >
                        <Eye size={11} />
                        <span>DETAILS</span>
                      </button>
                      
                      <button
                        onClick={(e) => handleQuickAdd(e, item)}
                        className={`h-9 font-sans font-extrabold text-[9px] tracking-widest uppercase rounded-md flex items-center justify-center gap-1 shadow-sm transition-all duration-300 ${
                          isAdded
                            ? 'bg-green-600 text-white'
                            : 'bg-[#100906] hover:bg-[#8D370B] text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={11} />
                            <span>ADDED</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={11} />
                            <span>ADD TO BAG</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
