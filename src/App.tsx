import React from 'react';
import Home from './pages/Home';
import { CartProvider } from './context/CartContext';
import { WebsiteDataProvider } from './context/WebsiteDataContext';

export default function App() {
  return (
    <WebsiteDataProvider>
      <CartProvider>
        <Home />
      </CartProvider>
    </WebsiteDataProvider>
  );
}
