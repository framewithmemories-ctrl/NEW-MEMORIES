import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('memoriesCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        // Fix: Calculate total quantity, not just number of items
        const totalQuantity = parsedCart.reduce((total, item) => total + (item.quantity || 1), 0);
        setCartCount(totalQuantity);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes (but avoid initial empty save)
  useEffect(() => {
    // Only save if this is not the initial empty state
    if (cartItems.length > 0) {
      localStorage.setItem('memoriesCart', JSON.stringify(cartItems));
    }
    // Always update cart count
    const totalQuantity = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    setCartCount(totalQuantity);
  }, [cartItems]);

  const addToCart = (product, customOptions = {}) => {
    try {
      const cartItem = {
        id: `${product.id}_${Date.now()}`,
        productId: product.id,
        name: product.name,
        description: product.description,
        price: product.base_price,
        image: product.image_url,
        category: product.category,
        customOptions,
        quantity: 1,
        addedAt: new Date().toISOString()
      };

      setCartItems(prevItems => {
        const updatedItems = [...prevItems, cartItem];
        return updatedItems;
      });

      toast.success(`✅ ${product.name} added to cart!`, {
        description: `Price: ₹${product.base_price}`,
        duration: 3000,
      });

      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
      return false;
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== itemId);
      toast.success('Item removed from cart');
      return updatedItems;
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems => {
      return prevItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};