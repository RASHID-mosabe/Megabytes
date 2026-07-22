import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, ShoppingBag, Plus, Minus, Trash2, Tag, Percent, ArrowRight, ClipboardCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(() => {
    return localStorage.getItem('megabytes_discount_applied') === 'true';
  });
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'form' | 'success'>('cart');

  // Checkout Form states
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [drawerError, setDrawerError] = useState<string | null>(null);

  // Lock background body scroll when cart drawer is open
  React.useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const discountRate = isCouponApplied ? 0.15 : 0;
  const discountAmount = cartTotal * discountRate;
  const deliveryFee = cartTotal > 2000 || cartTotal === 0 ? 0 : 150;
  const grandTotal = cartTotal - discountAmount + deliveryFee;

  const applyCoupon = () => {
    setDrawerError(null);
    const code = couponCode.toUpperCase();
    if (code === 'MEGABYTES15' || code === 'FRESH15') {
      setIsCouponApplied(true);
      localStorage.setItem('megabytes_discount_applied', 'true');
      setCouponCode('');
    } else {
      setDrawerError('Invalid promo code! Try "MEGABYTES15".');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDrawerError(null);
    if (!name || !address || !phone) {
      setDrawerError('Please fill in all checkout contact & address fields.');
      return;
    }
    setCheckoutStep('success');
  };

  const handleClose = () => {
    if (checkoutStep === 'success') {
      clearCart();
      setIsCouponApplied(false);
      localStorage.removeItem('megabytes_discount_applied');
      setCheckoutStep('cart');
    }
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-xs"
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-[#C4430E]" />
              <h3 className="font-display font-extrabold text-sm uppercase tracking-widest text-[#100906]">
                {checkoutStep === 'cart' && 'YOUR ORDER'}
                {checkoutStep === 'form' && 'DELIVERY DETAILS'}
                {checkoutStep === 'success' && 'ORDER COMPLETED'}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-md bg-gray-50 hover:bg-gray-100 text-[#100906] flex items-center justify-center border border-gray-200 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {drawerError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-center justify-between gap-3 animate-fadeIn">
                <span>{drawerError}</span>
                <button
                  type="button"
                  onClick={() => setDrawerError(null)}
                  className="p-1 text-red-600 hover:text-red-900 rounded-md hover:bg-red-100 transition-colors shrink-0"
                  aria-label="Dismiss error"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <AnimatePresence mode="wait">
              {checkoutStep === 'cart' && (
                <motion.div
                  key="cart-step"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                      <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 text-[#C4430E] flex items-center justify-center">
                        <ShoppingBag size={24} />
                      </div>
                      <div className="space-y-1">
                        <p className="font-sans font-extrabold text-sm text-[#100906] uppercase tracking-wide">
                          Your basket is empty
                        </p>
                        <p className="font-sans text-xs text-[#100906]/60">
                          Head over to the menu to add delicious sizzlers, curries, and Swahili specialties!
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Items List */
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 p-3.5 rounded-lg bg-gray-50 border border-gray-100 transition-colors"
                        >
                          {item.menuItem.image ? (
                            <img
                              src={item.menuItem.image}
                              alt={item.menuItem.name}
                              referrerPolicy="no-referrer"
                              className="w-16 h-16 rounded-md object-cover shrink-0 border border-gray-200"
                            />
                          ) : null}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h4 className="font-sans font-bold text-xs text-[#100906] uppercase tracking-wide">
                                  {item.menuItem.name}
                                </h4>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-[#100906]/40 hover:text-red-600 transition-colors"
                                  title="Remove item"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                              <p className="font-sans text-[10px] uppercase tracking-wider text-[#C4430E] font-extrabold mt-0.5">
                                {item.size} — Sh {item.selectedPrice.toLocaleString()}
                              </p>
                              {item.extraNotes && (
                                <p className="font-sans text-[10px] text-[#100906]/60 italic mt-1 line-clamp-1">
                                  Note: "{item.extraNotes}"
                                </p>
                              )}
                            </div>

                            {/* Quantity buttons */}
                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200/50">
                              <div className="flex items-center bg-white rounded-md p-0.5 border border-gray-200">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-5 h-5 rounded-sm bg-gray-50 hover:bg-gray-100 text-[#100906] flex items-center justify-center border border-gray-200 transition-colors"
                                >
                                  <Minus size={9} />
                                </button>
                                <span className="w-6 text-center font-sans font-extrabold text-[11px] text-[#100906]">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-5 h-5 rounded-sm bg-gray-50 hover:bg-gray-100 text-[#100906] flex items-center justify-center border border-gray-200 transition-colors"
                                >
                                  <Plus size={9} />
                                </button>
                              </div>
                              <span className="font-display font-extrabold text-xs text-[#100906]">
                                Sh {(item.selectedPrice * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {cart.length > 0 && (
                    /* Coupon Area */
                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      <span className="block font-sans text-[9px] font-extrabold uppercase tracking-widest text-[#100906]/55">
                        Promo Code
                      </span>
                      {isCouponApplied ? (
                        <div className="flex items-center justify-between bg-green-50 text-green-700 px-3 py-2.5 rounded-md border border-green-100 text-[11px] font-sans font-bold">
                          <div className="flex items-center gap-1.5">
                            <Percent size={12} />
                            <span>"MEGABYTES15" Active (15% OFF)</span>
                          </div>
                          <button
                            onClick={() => {
                              setIsCouponApplied(false);
                              localStorage.removeItem('megabytes_discount_applied');
                            }}
                            className="text-green-700/60 hover:text-green-700 underline text-[10px] font-extrabold tracking-wider uppercase"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Tag size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#100906]/40" />
                            <input
                              type="text"
                              placeholder="Enter MEGABYTES15"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              className="w-full h-10 bg-gray-50 border border-gray-200 rounded-md pl-9 pr-3 text-xs font-sans text-[#100906] outline-none focus:border-[#D95413] focus:bg-white transition-all"
                            />
                          </div>
                          <button
                            onClick={applyCoupon}
                            className="px-4 h-10 bg-[#100906] hover:bg-[#8D370B] text-white font-sans font-extrabold text-xs rounded-md tracking-widest uppercase transition-colors"
                          >
                            APPLY
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {checkoutStep === 'form' && (
                <motion.form
                  key="form-step"
                  onSubmit={handleCheckoutSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <p className="font-sans text-xs text-[#100906]/75 leading-relaxed bg-gray-50 p-4 rounded-md border border-gray-100">
                    Your meal will be prepared fresh by our expert chefs and dispatched immediately. Estimated arrival: <span className="font-extrabold text-[#C4430E]">30 minutes</span>.
                  </p>

                  <div className="space-y-1.5">
                    <label className="font-sans text-[9px] font-extrabold uppercase tracking-widest text-[#100906]/55">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Connor"
                      className="w-full h-10 bg-gray-50 border border-gray-200 rounded-md px-3 text-xs font-sans text-[#100906] outline-none focus:border-[#D95413] focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-sans text-[9px] font-extrabold uppercase tracking-widest text-[#100906]/55">
                      Delivery Address in Kitale
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 2925 Mak Asembo Street, Kitale"
                      className="w-full h-10 bg-gray-50 border border-gray-200 rounded-md px-3 text-xs font-sans text-[#100906] outline-none focus:border-[#D95413] focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-sans text-[9px] font-extrabold uppercase tracking-widest text-[#100906]/55">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +254 714 069599"
                      className="w-full h-10 bg-gray-50 border border-gray-200 rounded-md px-3 text-xs font-sans text-[#100906] outline-none focus:border-[#D95413] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Back button */}
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="text-[10px] font-sans font-extrabold uppercase tracking-widest text-[#C4430E] hover:underline block pt-2"
                  >
                    ← Back to order basket
                  </button>
                </motion.form>
              )}

              {checkoutStep === 'success' && (
                <motion.div
                  key="success-step"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center space-y-5 py-12"
                >
                  <div className="w-16 h-16 rounded-md bg-green-50 border border-green-500 text-green-600 flex items-center justify-center shadow-md">
                    <ClipboardCheck size={28} />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-display font-extrabold text-lg text-[#100906] uppercase tracking-wider">
                      YOUR FEAST IS ON THE WAY!
                    </h4>
                    <p className="font-sans text-xs text-[#100906]/70 leading-relaxed px-4">
                      Thank you for dining with Mega Bytes Restaurant, <span className="font-bold text-[#100906]">{name}</span>! Our chefs have received your ticket and are cooking up your fresh Indian, Chinese, or Swahili feast.
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 p-4 rounded-md w-full max-w-[300px] text-left space-y-2 text-xs font-sans shadow-xs">
                    <p className="text-[9px] uppercase font-extrabold tracking-widest text-[#C4430E]">
                      Order Highlights
                    </p>
                    <p className="text-[#100906]/85"><span className="font-bold text-[#100906]">Deliver to:</span> {address}</p>
                    <p className="text-[#100906]/85"><span className="font-bold text-[#100906]">ETA:</span> ~30 Minutes</p>
                    <p className="text-[#100906]/85"><span className="font-bold text-[#100906]">Total Charged:</span> Sh {grandTotal.toLocaleString()}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Receipt Summary */}
          {cart.length > 0 && checkoutStep !== 'success' && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
              <div className="space-y-2 text-[11px] font-sans text-[#100906]/60">
                <div className="flex justify-between">
                  <span className="uppercase tracking-wider">Subtotal</span>
                  <span className="font-bold text-[#100906]">Sh {cartTotal.toLocaleString()}</span>
                </div>
                {isCouponApplied && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span className="uppercase tracking-wider">15% Welcome Discount</span>
                    <span>-Sh {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="uppercase tracking-wider">Delivery Fee</span>
                  <span className="font-bold">{deliveryFee === 0 ? 'FREE' : `Sh ${deliveryFee.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-sm font-display font-extrabold text-[#100906] pt-2 border-t border-gray-200 uppercase tracking-wider">
                  <span>Grand Total</span>
                  <span className="text-[#C4430E]">Sh {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {checkoutStep === 'cart' ? (
                <button
                  onClick={() => setCheckoutStep('form')}
                  className="w-full h-11 bg-[#C4430E] hover:bg-[#8D370B] text-white font-sans font-extrabold text-xs tracking-widest uppercase rounded-md flex items-center justify-center gap-1.5 shadow-md transition-all duration-200"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight size={13} />
                </button>
              ) : (
                <button
                  onClick={handleCheckoutSubmit}
                  className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-sans font-extrabold text-xs tracking-widest uppercase rounded-md flex items-center justify-center gap-1.5 shadow-md transition-all duration-200"
                >
                  <span>CONFIRM & PLACE ORDER</span>
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
