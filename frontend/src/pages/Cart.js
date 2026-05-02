import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Package,
  ShoppingBag
} from 'lucide-react';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { 
    cart, 
    items, 
    totalAmount, 
    isLoading, 
    updateCartItem, 
    removeFromCart, 
    clearCart,
    getTotalItems 
  } = useCart();

  const [updatingItems, setUpdatingItems] = useState(new Set());

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
    }
  }, [isAuthenticated, navigate]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity === 0) {
      await handleRemoveItem(productId);
      return;
    }

    setUpdatingItems(prev => new Set(prev).add(productId));
    await updateCartItem(productId, newQuantity);
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const handleRemoveItem = async (productId) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    await removeFromCart(productId);
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const calculateItemSubtotal = (item) => {
    return (item.price * item.quantity).toFixed(2);
  };

  const calculateShipping = () => {
    return totalAmount >= 50 ? 0 : 9.99;
  };

  const calculateTax = () => {
    return (totalAmount * 0.08).toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = totalAmount;
    const shipping = calculateShipping();
    const tax = parseFloat(calculateTax());
    return (subtotal + shipping + tax).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/products" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearCart}
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear Cart</span>
            </Button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        // Empty Cart
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added any products to your cart yet. Start shopping to fill it up!
          </p>
          <Link to="/products">
            <Button variant="primary" size="large" className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <span>Start Shopping</span>
            </Button>
          </Link>
        </div>
      ) : (
        // Cart with Items
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product._id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 overflow-hidden bg-gray-100 rounded-lg flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          <Link 
                            to={`/products/${item.product._id}`}
                            className="hover:text-primary-600 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {item.product.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          Category: {item.product.category}
                        </p>
                      </div>
                      
                      <div className="text-right mt-4 sm:mt-0">
                        <p className="text-lg font-semibold text-gray-900">
                          ${item.price}
                        </p>
                        <p className="text-sm text-gray-500">
                          Total: ${calculateItemSubtotal(item)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700">Quantity:</span>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                            disabled={updatingItems.has(item.product._id) || item.quantity <= 1}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                            {updatingItems.has(item.product._id) ? '...' : item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                            disabled={updatingItems.has(item.product._id)}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => handleRemoveItem(item.product._id)}
                        disabled={updatingItems.has(item.product._id)}
                        className="flex items-center space-x-1 text-error-600 border-error-300 hover:bg-error-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Remove</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {calculateShipping() === 0 ? (
                      <span className="text-success-600 font-medium">FREE</span>
                    ) : (
                      `$${calculateShipping().toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${calculateTax()}</span>
                </div>
                
                {totalAmount < 50 && (
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                    <p className="text-sm text-primary-800">
                      Add ${(50 - totalAmount).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link to="/checkout">
                  <Button variant="primary" size="large" className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <Link to="/products">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Package className="h-4 w-4" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
