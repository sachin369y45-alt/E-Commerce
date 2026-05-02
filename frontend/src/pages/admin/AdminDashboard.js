import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Eye
} from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
    orderStats: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch order stats
      const orderStatsResponse = await fetch('/api/orders/admin/stats', {
        credentials: 'include'
      });

      if (!orderStatsResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const orderData = await orderStatsResponse.json();
      
      // Fetch products count
      const productsResponse = await fetch('/api/products?page=1&limit=1', {
        credentials: 'include'
      });
      const productsData = await productsResponse.json();

      // Fetch users count
      const usersResponse = await fetch('/api/users?page=1&limit=1', {
        credentials: 'include'
      });
      const usersData = await usersResponse.json();

      setStats({
        totalRevenue: orderData.data.totalRevenue || 0,
        totalOrders: orderData.data.recentOrders?.length || 0,
        totalProducts: productsData.data.total || 0,
        totalUsers: usersData.data.total || 0,
        recentOrders: orderData.data.recentOrders || [],
        orderStats: orderData.data.stats || []
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Error loading dashboard</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={fetchDashboardData}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your e-commerce store</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-success-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-success-600">12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-success-600">8% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6 text-warning-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingDown className="h-4 w-4 text-error-500 mr-1" />
            <span className="text-error-600">3% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-secondary-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-success-600">15% from last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Status Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status</h2>
          <div className="space-y-4">
            {stats.orderStats.map((stat) => (
              <div key={stat._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    stat._id === 'Pending' ? 'bg-warning-500' :
                    stat._id === 'Processing' ? 'bg-primary-500' :
                    stat._id === 'Shipped' ? 'bg-secondary-500' :
                    stat._id === 'Delivered' ? 'bg-success-500' :
                    'bg-error-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">{stat._id}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{stat.count} orders</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(stat.totalRevenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <Button variant="outline" size="small">
              <a href="/admin/orders">View All</a>
            </Button>
          </div>
          
          {stats.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">{order.user?.name}</p>
                    <p className="text-sm text-gray-600">{formatDate(order.orderDate)}</p>
                  </div>
                  <div className="text-right">
                    <div className={`badge ${getStatusColor(order.status)} mb-2`}>
                      {order.status}
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.totalPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent orders</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="flex items-center justify-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Add New Product</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Manage Users</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>View Reports</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
