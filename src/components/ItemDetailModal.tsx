import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { MenuItem } from '../types';
import { X, Plus, Minus, ShoppingBag, Flame } from 'lucide-react';
import { motion } from 'motion/react';

export default function ItemDetailModal() {
  const { selectedItemForModal, setSelectedItemForModal, addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<'Small' | 'Medium' | 'Large'>('Medium');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Reset local state and lock background scroll when item changes
  useEffect(() => {
    if (selectedItemForModal) {
      setSelectedSize('Medium');
      setQuantity(1);
      setNotes('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedItemForModal]);

  if (!selectedItemForModal) return null;

  const item = selectedItemForModal;
  const unitPrice = item.prices[selectedSize];
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(item, selectedSize, quantity, notes);
    setSelectedItemForModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark blur backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedItemForModal(null)}
        className="absolute inset-0 bg-black/75 backdrop-blur-xs"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 15 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative bg-white w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-none border border-gray-100"
      >
        {/* Close Button - Sleek square */}
        <button
          onClick={() => setSelectedItemForModal(null)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-md bg-white border border-gray-200 text-[#100906] shadow-sm flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          <X size={14} />
        </button>

        {/* Left Side: Product Image & Highlights */}
        <div className="w-full md:w-1/2 h-[200px] md:h-auto min-h-[220px] relative bg-gray-50">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          
          {item.badge && (
            <span className="absolute top-4 left-4 bg-[#D95413] text-white font-sans font-extrabold text-[8px] px-2.5 py-1 rounded-sm uppercase tracking-widest shadow-sm">
              {item.badge}
            </span>
          )}
        </div>

        {/* Right Side: Configuration & Selection */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-[550px]">
          <div className="space-y-6">
            {/* Title & Calories */}
            <div className="space-y-2">
              <h3 className="font-display font-extrabold text-xl text-[#100906] uppercase tracking-wide">
                {item.name}
              </h3>
              <div className="flex flex-wrap gap-2 items-center">
                {item.calories && (
                  <span className="font-sans text-[10px] text-[#100906]/60 flex items-center gap-1 font-bold uppercase tracking-wider">
                    <Flame size={12} className="text-[#D95413]" />
                    {item.calories} kcal
                  </span>
                )}
                {item.tags?.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-[#C4430E] font-sans font-extrabold text-[8px] px-2 py-0.5 rounded-sm uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="font-sans text-xs text-[#100906]/70 leading-relaxed">
              {item.description}
            </p>

            {/* Ingredients */}
            {item.ingredients && (
              <div className="space-y-1.5">
                <span className="block font-sans text-[9px] font-extrabold uppercase tracking-widest text-[#100906]/55">
                  Ingredients Included
                </span>
                <p className="font-sans text-[11px] text-[#100906]/80 leading-relaxed italic bg-gray-50 p-2.5 rounded-md border border-gray-100">
                  {item.ingredients.join(', ')}
                </p>
              </div>
            )}

            {/* Size Options */}
            <div className="space-y-2">
              <span className="block font-sans text-[9px] font-extrabold uppercase tracking-widest text-[#100906]/55">
                Select Size
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['Small', 'Medium', 'Large'] as const).map((size) => {
                  const active = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-11 rounded-md font-sans font-extrabold text-xs tracking-wider transition-all duration-200 border flex flex-col items-center justify-center ${
                        active
                          ? 'bg-[#100906] border-[#100906] text-white shadow-sm'
                          : 'bg-white border-gray-200 hover:border-gray-300 text-[#100906]'
                      }`}
                    >
                      <span className="uppercase text-[9px] tracking-widest">{size}</span>
                      <span className={`text-[9px] font-bold mt-0.5 ${active ? 'text-white/80' : 'text-[#100906]/55'}`}>
                        Sh {item.prices[size].toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <span className="block font-sans text-[9px] font-extrabold uppercase tracking-widest text-[#100906]/55">
                Special Instructions
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Example: Extra spicy, no coriander, no garlic..."
                className="w-full h-18 bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#D95413] rounded-md p-2.5 text-xs font-sans text-[#100906] outline-none resize-none transition-all"
              />
            </div>
          </div>

          {/* Quantity and CTA Button */}
          <div className="pt-5 border-t border-gray-100 mt-5 flex items-center justify-between gap-4">
            {/* Quantity Selector - Sleek segmented square */}
            <div className="flex items-center bg-gray-50 rounded-md p-1 border border-gray-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-sm bg-white border border-gray-200 hover:bg-gray-100 text-[#100906] flex items-center justify-center transition-all shadow-xs"
              >
                <Minus size={11} />
              </button>
              <span className="w-8 text-center font-sans font-extrabold text-xs text-[#100906]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-sm bg-white border border-gray-200 hover:bg-gray-100 text-[#100906] flex items-center justify-center transition-all shadow-xs"
              >
                <Plus size={11} />
              </button>
            </div>

            {/* Add to Order Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 h-10 bg-[#C4430E] hover:bg-[#8D370B] text-white font-sans font-extrabold text-xs tracking-widest uppercase rounded-md flex items-center justify-center gap-1.5 shadow-sm transition-all duration-200"
            >
              <ShoppingBag size={13} />
              <span>ADD - Sh {totalPrice.toLocaleString()}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
