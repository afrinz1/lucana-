import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { getActivePrice } from '../utils/productUtils';

interface ShopContextProps {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSpecs?: Record<string, string>, selectedColor?: string) => void;
  removeFromCart: (productId: number, selectedColor?: string) => void;
  updateCartQuantity: (productId: number, quantity: number, selectedColor?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  checkoutSuccess: boolean;
  setCheckoutSuccess: (success: boolean) => void;
}

const ShopContext = createContext<ShopContextProps | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('lucana_cart');
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      // Ignore corrupted cart data and start fresh
      return [];
    }
  });
  const [isCartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem('lucana_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1, selectedSpecs?: Record<string, string>, selectedColor?: string) => {
    const color = selectedColor ?? product.color_variants?.[0]?.name;
    setCart(prev => {
      const existingIndex = prev.findIndex(item =>
        item.product.id === product.id && item.selectedColor === color
      );
      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }
      return [...prev, { product, quantity, selectedSpecs, selectedColor: color }];
    });
    setCartOpen(true); // Automatically open the cart drawer when adding an item
  };

  const removeFromCart = (productId: number, selectedColor?: string) => {
    setCart(prev => prev.filter(item =>
      item.product.id !== productId || item.selectedColor !== selectedColor
    ));
  };

  const updateCartQuantity = (productId: number, quantity: number, selectedColor?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId && item.selectedColor === selectedColor ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = cart.reduce((total, item) => total + getActivePrice(item.product) * item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setCartOpen,
        searchQuery,
        setSearchQuery,
        checkoutSuccess,
        setCheckoutSuccess,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
