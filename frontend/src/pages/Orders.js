import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Package, 
  Calendar, 
  DollarSign, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  Eye,
  Download
} from 'lucide-react';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchOrders();
  }, [isAuthenticated, pagination.page]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/orders?page=${pagination.page}&limit=10`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.data.orders || []);
      setPagination(prev => ({
        ...prev,
        page: data.page,
        pages: data.pages,
        total: data.total
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
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
        return <Clock className="h-4 w-4" />;
      case 'Processing':
        return <Package className="h-4 w-4" />;
      case 'Shipped':
        return <Truck className="h-4 w-4" />;
      case 'Delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'Cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return null; // Will be handled by ProtectedRoute
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">
          Track and manage your orders
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Error loading orders</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchOrders}>Try Again</Button>
        </div>
      )}

      {/* Orders List */}
      {!isLoading && !error && (
        <>
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(order.orderDate)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className={`badge ${getStatusColor(order.status)} flex items-center space-x-1`}>
                          {getStatusIcon(order.status)}
                          <span>{order.status}</span>
                        </div>
                        
                        <Link to={`/orders/${order._id}`}>
                          <Button variant="outline" size="small" className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>View Details</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.orderItems.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="w-16 h-16 overflow-hidden bg-gray-100 rounded-lg flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-2 mb-4 sm:mb-0">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <DollarSign className="h-4 w-4" />
                            <span>Total: ${order.totalPrice.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Package className="h-4 w-4" />
                            <span>{order.orderItems.length} items</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Truck className="h-4 w-4" />
                            <span>{order.paymentMethod}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          {order.status === 'Delivered' && (
                            <Button variant="outline" size="small" className="flex items-center space-x-1">
                              <Download className="h-4 w-4" />
                              <span>Invoice</span>
                            </Button>
                          )}
                          
                          {['Pending', 'Processing'].includes(order.status) && (
                            <Button variant="danger" size="small">
                              Cancel Order
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      disabled={pagination.page === 1}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                      Previous
                    </Button>
                    
                    <span className="text-sm text-gray-600">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    
                    <Button
                      variant="outline"
                      disabled={pagination.page === pagination.pages}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You haven't placed any orders yet. Start shopping to create your first order!
              </p>
              <Link to="/products">
                <Button variant="primary" size="large">
                  Start Shopping
                </Button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
