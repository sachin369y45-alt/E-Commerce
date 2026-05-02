import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, Star, Minus, Plus, Package, Truck, Shield, ArrowLeft, Heart } from 'lucide-react';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, isItemInCart, getItemQuantity } = useCart();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error('Failed to fetch product');
      }
      
      const data = await response.json();
      setProduct(data.data.product);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    await addToCart(product._id, quantity);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist functionality
  };

  const renderStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-5 w-5 fill-yellow-200 text-yellow-400" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
    }
    
    return stars;
  };

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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-gray-700">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-gray-700">Products</Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden bg-gray-100 rounded-xl">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square overflow-hidden bg-gray-100 rounded-lg cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all">
                <img
                  src={product.image}
                  alt={`${product.name} - View ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {renderStars()}
                <span className="ml-2 text-sm text-gray-600">(4.5) • 128 reviews</span>
              </div>
              <span className="badge badge-success">In Stock</span>
            </div>
            <p className="text-3xl font-bold text-primary-600">${product.price}</p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Category */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Category</h3>
            <span className="badge badge-secondary">{product.category}</span>
          </div>

          {/* Stock Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Availability</h3>
            <p className="text-gray-600">
              {product.stock > 0 ? (
                <span className="text-success-600 font-medium">
                  {product.stock} items in stock
                </span>
              ) : (
                <span className="text-error-600 font-medium">Out of stock</span>
              )}
            </p>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <span className="text-sm text-gray-600">
                  Total: ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="large"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isItemInCart(product._id)}
                className="flex-1 flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>
                  {isItemInCart(product._id) 
                    ? `In Cart (${getItemQuantity(product._id)})` 
                    : 'Add to Cart'
                  }
                </span>
              </Button>
              
              <Button
                variant="outline"
                size="large"
                onClick={toggleWishlist}
                className="flex items-center justify-center space-x-2"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Truck className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Free Shipping</h4>
                <p className="text-sm text-gray-600">On orders over $50</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Secure Payment</h4>
                <p className="text-sm text-gray-600">100% secure</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Easy Returns</h4>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button className="py-2 px-1 border-b-2 border-primary-500 text-primary-600 font-medium">
              Description
            </button>
            <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium">
              Reviews (128)
            </button>
            <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium">
              Shipping & Returns
            </button>
          </nav>
        </div>
        
        <div className="py-8">
          <div className="prose max-w-none">
            <h3>Product Description</h3>
            <p>{product.description}</p>
            
            <h3>Key Features</h3>
            <ul>
              <li>High-quality materials and construction</li>
              <li>Modern and stylish design</li>
              <li>Easy to use and maintain</li>
              <li>Perfect for everyday use</li>
            </ul>
            
            <h3>Specifications</h3>
            <ul>
              <li><strong>Category:</strong> {product.category}</li>
              <li><strong>Stock:</strong> {product.stock} units available</li>
              <li><strong>SKU:</strong> {product._id.slice(-8).toUpperCase()}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* TODO: Implement related products */}
          <div className="text-center text-gray-500 col-span-full">
            Related products coming soon...
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
