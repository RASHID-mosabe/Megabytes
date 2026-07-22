import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (menuItem: MenuItem, size: 'Small' | 'Medium' | 'Large', quantity: number, notes?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedItemForModal: MenuItem | null;
  setSelectedItemForModal: (item: MenuItem | null) => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('pepperoni_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const getPageFromUrl = () => {
    const path = window.location.pathname.replace(/\/$/, '').toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path === '/admin' || hash === '#admin') return 'admin';
    if (path === '/menu' || hash === '#menu') return 'menu';
    if (path === '/about' || hash === '#about' || hash === '#features') return 'about';
    if (path === '/contact' || hash === '#contact' || hash === '#footer') return 'contact';
    return 'home';
  };

  const [activePage, setActivePageState] = useState<string>(getPageFromUrl);

  useEffect(() => {
    const handleUrlChange = () => {
      setActivePageState(getPageFromUrl());
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const setActivePage = (page: string) => {
    setActivePageState(page);
    const pathMapping: Record<string, string> = {
      home: '/',
      menu: '/menu',
      about: '/about',
      contact: '/contact',
      admin: '/admin',
    };
    const hashMapping: Record<string, string> = {
      home: '#home',
      menu: '#menu',
      about: '#features',
      contact: '#footer',
      admin: '#admin',
    };
    const targetPath = pathMapping[page] || '/';
    const targetHash = hashMapping[page] || '#home';

    if (window.location.pathname !== targetPath) {
      try {
        window.history.pushState(null, '', targetPath + targetHash);
      } catch {
        window.location.hash = targetHash;
      }
    } else {
      window.location.hash = targetHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    localStorage.setItem('pepperoni_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (menuItem: MenuItem, size: 'Small' | 'Medium' | 'Large', quantity: number, notes?: string) => {
    setCart((prevCart) => {
      // Find if same item with same size exists
      const existingIndex = prevCart.findIndex(
        (item) => item.menuItem.id === menuItem.id && item.size === size
      );

      const price = menuItem.prices[size];

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          extraNotes: notes || updated[existingIndex].extraNotes
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: `${menuItem.id}-${size}-${Date.now()}`,
            menuItem,
            size,
            quantity,
            selectedPrice: price,
            extraNotes: notes
          }
        ];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.selectedPrice * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        selectedItemForModal,
        setSelectedItemForModal,
        activePage,
        setActivePage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
