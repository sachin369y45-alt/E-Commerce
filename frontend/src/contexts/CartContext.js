import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

// Create context
const CartContext = createContext();

// Initial state
const initialState = {
  cart: null,
  items: [],
  totalAmount: 0,
  itemCount: 0,
  isLoading: false,
  error: null
};

// Action types
const CART_ACTIONS = {
  CART_START: 'CART_START',
  CART_SUCCESS: 'CART_SUCCESS',
  CART_FAILURE: 'CART_FAILURE',
  ADD_ITEM_START: 'ADD_ITEM_START',
  ADD_ITEM_SUCCESS: 'ADD_ITEM_SUCCESS',
  ADD_ITEM_FAILURE: 'ADD_ITEM_FAILURE',
  UPDATE_ITEM_START: 'UPDATE_ITEM_START',
  UPDATE_ITEM_SUCCESS: 'UPDATE_ITEM_SUCCESS',
  UPDATE_ITEM_FAILURE: 'UPDATE_ITEM_FAILURE',
  REMOVE_ITEM_START: 'REMOVE_ITEM_START',
  REMOVE_ITEM_SUCCESS: 'REMOVE_ITEM_SUCCESS',
  REMOVE_ITEM_FAILURE: 'REMOVE_ITEM_FAILURE',
  CLEAR_CART_START: 'CLEAR_CART_START',
  CLEAR_CART_SUCCESS: 'CLEAR_CART_SUCCESS',
  CLEAR_CART_FAILURE: 'CLEAR_CART_FAILURE',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.CART_START:
    case CART_ACTIONS.ADD_ITEM_START:
    case CART_ACTIONS.UPDATE_ITEM_START:
    case CART_ACTIONS.REMOVE_ITEM_START:
    case CART_ACTIONS.CLEAR_CART_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case CART_ACTIONS.CART_SUCCESS:
    case CART_ACTIONS.ADD_ITEM_SUCCESS:
    case CART_ACTIONS.UPDATE_ITEM_SUCCESS:
    case CART_ACTIONS.REMOVE_ITEM_SUCCESS:
    case CART_ACTIONS.CLEAR_CART_SUCCESS:
      return {
        ...state,
        cart: action.payload.cart,
        items: action.payload.cart?.items || [],
        totalAmount: action.payload.cart?.totalAmount || 0,
        itemCount: action.payload.cart?.items?.reduce((count, item) => count + item.quantity, 0) || 0,
        isLoading: false,
        error: null
      };

    case CART_ACTIONS.CART_FAILURE:
    case CART_ACTIONS.ADD_ITEM_FAILURE:
    case CART_ACTIONS.UPDATE_ITEM_FAILURE:
    case CART_ACTIONS.REMOVE_ITEM_FAILURE:
    case CART_ACTIONS.CLEAR_CART_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case CART_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Get cart
  const getCart = async () => {
    if (!isAuthenticated) return;
    
    dispatch({ type: CART_ACTIONS.CART_START });
    
    try {
      const response = await axios.get('/cart');
      const cart = response.data.data.cart;
      
      dispatch({
        type: CART_ACTIONS.CART_SUCCESS,
        payload: { cart }
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load cart';
      dispatch({
        type: CART_ACTIONS.CART_FAILURE,
        payload: message
      });
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return { success: false };
    }
    
    dispatch({ type: CART_ACTIONS.ADD_ITEM_START });
    
    try {
      const response = await axios.post('/cart/add', { productId, quantity });
      const cart = response.data.data.cart;
      
      dispatch({
        type: CART_ACTIONS.ADD_ITEM_SUCCESS,
        payload: { cart }
      });
      
      toast.success('Item added to cart!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      dispatch({
        type: CART_ACTIONS.ADD_ITEM_FAILURE,
        payload: message
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId, quantity) => {
    if (!isAuthenticated) return;
    
    dispatch({ type: CART_ACTIONS.UPDATE_ITEM_START });
    
    try {
      const response = await axios.put('/cart/update', { productId, quantity });
      const cart = response.data.data.cart;
      
      dispatch({
        type: CART_ACTIONS.UPDATE_ITEM_SUCCESS,
        payload: { cart }
      });
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      dispatch({
        type: CART_ACTIONS.UPDATE_ITEM_FAILURE,
        payload: message
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;
    
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM_START });
    
    try {
      const response = await axios.delete(`/cart/remove/${productId}`);
      const cart = response.data.data.cart;
      
      dispatch({
        type: CART_ACTIONS.REMOVE_ITEM_SUCCESS,
        payload: { cart }
      });
      
      toast.success('Item removed from cart');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item from cart';
      dispatch({
        type: CART_ACTIONS.REMOVE_ITEM_FAILURE,
        payload: message
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!isAuthenticated) return;
    
    dispatch({ type: CART_ACTIONS.CLEAR_CART_START });
    
    try {
      const response = await axios.delete('/cart/clear');
      const cart = response.data.data.cart;
      
      dispatch({
        type: CART_ACTIONS.CLEAR_CART_SUCCESS,
        payload: { cart }
      });
      
      toast.success('Cart cleared');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      dispatch({
        type: CART_ACTIONS.CLEAR_CART_FAILURE,
        payload: message
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Get cart item count
  const getCartCount = async () => {
    if (!isAuthenticated) return 0;
    
    try {
      const response = await axios.get('/cart/count');
      return response.data.data.count;
    } catch (error) {
      console.error('Get cart count error:', error);
      return 0;
    }
  };

  // Check if item is in cart
  const isItemInCart = (productId) => {
    return state.items.some(item => item.product._id === productId);
  };

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  };

  // Calculate subtotal for a specific item
  const getItemSubtotal = (productId) => {
    const item = state.items.find(item => item.product._id === productId);
    return item ? item.price * item.quantity : 0;
  };

  // Calculate total items in cart
  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate total price
  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
  };

  // Load cart when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      getCart();
    } else {
      // Clear cart when user logs out
      dispatch({
        type: CART_ACTIONS.CART_SUCCESS,
        payload: { cart: null }
      });
    }
  }, [isAuthenticated]);

  // Context value
  const value = {
    ...state,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartCount,
    isItemInCart,
    getItemQuantity,
    getItemSubtotal,
    getTotalItems,
    getTotalPrice,
    clearError
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
