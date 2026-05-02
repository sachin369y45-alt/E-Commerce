import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center px-4">
        {/* 404 Graphic */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-600">404</div>
          <div className="text-2xl font-medium text-gray-900 mt-4">Page Not Found</div>
        </div>

        {/* Error Message */}
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. The page might have been removed, renamed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link to="/">
            <Button variant="primary" size="large" className="w-full flex items-center justify-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Go to Homepage</span>
            </Button>
          </Link>
          
          <Link to="/products">
            <Button variant="outline" size="large" className="w-full flex items-center justify-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Browse Products</span>
            </Button>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Check if you typed the URL correctly</p>
            <p>Try searching for what you're looking for</p>
            <p>Contact our support team if you need assistance</p>
          </div>
          
          <div className="mt-4">
            <Button variant="outline" size="small">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
