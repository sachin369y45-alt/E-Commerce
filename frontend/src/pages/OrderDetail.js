import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Package, 
  Calendar, 
  DollarSign, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  User,
  Download
} from 'lucide-react';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const OrderDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchOrderDetail();
  }, [id, isAuthenticated]);

  const fetchOrderDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/orders/${id}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found');
        }
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      setOrder(data.data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setIsCancelling(true);
    try {
      const response = await fetch(`/api/orders/${id}/cancel`, {
        method: 'PUT',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      const data = await response.json();
      setOrder(data.data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'badge-warning';
      case 'Processing':
        return 'badge-primary';
      case 'Shipped':
        return 'badge-secondary';
      case 'Delivered':
        return 'badge-success';
      case 'Cancelled':
        return 'badge-error';
      default:
        return 'badge-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-5 w-5" />;
      case 'Processing':
        return <Package className="h-5 w-5" />;
      case 'Shipped':
        return <Truck className="h-5 w-5" />;
      case 'Delivered':
        return <CheckCircle className="h-5 w-5" />;
      case 'Cancelled':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimelineSteps = (status) => {
    const steps = [
      { key: 'ordered', label: 'Order Placed', completed: true, date: order.orderDate },
      { key: 'processing', label: 'Processing', completed: ['Processing', 'Shipped', 'Delivered'].includes(status), date: status === 'Processing' ? new Date() : null },
      { key: 'shipped', label: 'Shipped', completed: ['Shipped', 'Delivered'].includes(status), date: status === 'Shipped' ? new Date() : null },
      { key: 'delivered', label: 'Delivered', completed: status === 'Delivered', date: order.deliveredDate }
    ];

    if (status === 'Cancelled') {
      return [
        { key: 'ordered', label: 'Order Placed', completed: true, date: order.orderDate },
        { key: 'cancelled', label: 'Cancelled', completed: true, date: new Date() }
      ];
    }

    return steps;
  };

  if (!isAuthenticated) {
    return null; // Will be handled by ProtectedRoute
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/orders" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Orders</span>
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <div className="flex items-center space-x-4">
              <div className={`badge ${getStatusColor(order.status)} flex items-center space-x-2`}>
                {getStatusIcon(order.status)}
                <span>{order.status}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(order.orderDate)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2 mt-4 sm:mt-0">
            {order.status === 'Delivered' && (
              <Button variant="outline" className="flex items-center space-x-1">
                <Download className="h-4 w-4" />
                <span>Download Invoice</span>
              </Button>
            )}
            
            {['Pending', 'Processing'].includes(order.status) && (
              <Button
                variant="danger"
                onClick={handleCancelOrder}
                disabled={isCancelling}
                loading={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Timeline</h2>
            
            <div className="space-y-4">
              {getTimelineSteps(order.status).map((step, index) => (
                <div key={step.key} className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.completed ? 'bg-success-100 text-success-600' : 'bg-gray-100 text-gray-400'}`}>
                    {step.completed ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.label}
                    </h3>
                    {step.date && (
                      <p className="text-sm text-gray-600">
                        {formatDate(step.date)}
                      </p>
                    )}
                  </div>
                  {index < getTimelineSteps(order.status).length - 1 && (
                    <div className="absolute left-5 mt-10 w-0.5 h-8 bg-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
            
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-0">
                  <div className="w-20 h-20 overflow-hidden bg-gray-100 rounded-lg flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">
                      <Link 
                        to={`/products/${item.product}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Price: ${item.price}</p>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Shipping Address
            </h2>
            
            <div className="space-y-2">
              <p className="font-medium text-gray-900">{order.user.name}</p>
              <p className="text-gray-600">{order.shippingAddress.street}</p>
              <p className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{order.user.phoneNumber}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{order.user.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${(order.totalPrice * 0.08).toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Payment Method</h3>
              <p className="text-gray-600">
                {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
              </p>
            </div>

            {/* Customer Support */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Customer Support: support@shophub.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Hours: Mon-Fri 9AM-6PM EST</p>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
