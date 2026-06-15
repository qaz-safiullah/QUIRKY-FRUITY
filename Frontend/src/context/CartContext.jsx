import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

const CART_KEY = 'quirky-fruity-cart';

function loadCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          title: product.title,
          price: product.price,
          image: product.image,
          burstImage: product.burstImage,
          quantity: 1,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((item) => item.id !== productId);
      }
      return prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, cartCount, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
