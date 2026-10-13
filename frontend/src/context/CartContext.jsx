import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import api from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshCart = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/cart');
      setCartItems(response.data.cart || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Unable to load your cart');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productId) => {
    await api.post(`/cart/${productId}`);
    await refreshCart();
  }, [refreshCart]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    await api.patch(`/cart/${productId}`, { quantity });
    await refreshCart();
  }, [refreshCart]);

  const removeFromCart = useCallback(async (productId) => {
    await api.delete(`/cart/${productId}`);
    await refreshCart();
  }, [refreshCart]);

  const itemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0),
    [cartItems],
  );

  const value = {
    cartItems,
    loading,
    error,
    itemCount,
    subtotal,
    refreshCart,
    addToCart,
    updateQuantity,
    removeFromCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
};
