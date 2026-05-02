# ShopHub - Full-Stack E-Commerce Application

A production-level e-commerce web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Features

### User Features
- **Authentication**: User registration, login, logout with JWT tokens
- **User Profile**: View and update personal information
- **Product Browsing**: Search, filter, and sort products
- **Product Details**: Detailed product information with reviews
- **Shopping Cart**: Add, update, and remove cart items
- **Checkout Process**: Complete order placement with address management
- **Order History**: View and track order status
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Admin Dashboard**: Overview of store metrics and statistics
- **Product Management**: Create, read, update, delete products
- **User Management**: View and manage user accounts
- **Order Management**: View all orders, update order status
- **Order Analytics**: Track sales and order statistics
- **Role-based Access**: Secure admin-only routes

### Technical Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Proper error management and user feedback
- **Security Best Practices**: CORS, rate limiting, helmet security
- **Database Design**: Optimized MongoDB schemas with relationships
- **State Management**: React Context for global state
- **Modern UI**: Tailwind CSS with custom components

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **cookie-parser** - Cookie handling
- **cors** - Cross-origin resource sharing
- **helmet** - Security middleware
- **express-rate-limit** - Rate limiting
- **express-validator** - Input validation

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ecommerce-app
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env` file in the backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Cookie Configuration
COOKIE_EXPIRE=7

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

#### Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For Windows
net start MongoDB

# For macOS (using Homebrew)
brew services start mongodb-community

# For Linux
sudo systemctl start mongod
```

#### Run Backend Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### Start Frontend Server
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

## 📁 Project Structure

```
ecommerce-app/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   └── orders.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   └── layout/
│   │   ├── contexts/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── admin/
│   │   │   ├── Home.js
│   │   │   ├── Products.js
│   │   │   ├── ProductDetail.js
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   ├── Orders.js
│   │   │   ├── OrderDetail.js
│   │   │   ├── Profile.js
│   │   │   └── NotFound.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🔐 Default Admin Account

To create an admin account, register a new user and then manually update their role in the MongoDB database:

```javascript
// Connect to MongoDB and run:
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## 🎯 Usage Guide

### For Users
1. **Register**: Create a new account with your details
2. **Browse Products**: Explore available products with search and filters
3. **Add to Cart**: Select products and add them to your cart
4. **Checkout**: Complete your purchase with shipping details
5. **Track Orders**: View your order history and status

### For Admins
1. **Login**: Use your admin credentials to access the admin panel
2. **Dashboard**: View store statistics and recent orders
3. **Manage Products**: Add, edit, or remove products from inventory
4. **Manage Orders**: View all orders and update their status
5. **Manage Users**: Monitor user accounts and activity

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Products
- `GET /api/products` - Get all products (with pagination, search, filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `GET /api/products/categories/list` - Get all categories
- `GET /api/products/featured/list` - Get featured products

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart
- `GET /api/cart/count` - Get cart item count

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/admin/all` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `GET /api/orders/admin/stats` - Get order statistics (Admin only)

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats/overview` - Get user statistics
- `GET /api/users/:id/orders` - Get user orders

## 🎨 Customization

### Adding New Product Categories
1. Update the `category` enum in `backend/models/Product.js`
2. Update the categories array in `frontend/pages/admin/AdminProducts.js`
3. Update the categories array in `frontend/pages/Products.js`

### Customizing Theme
1. Modify `tailwind.config.js` for color palette and theme settings
2. Update `frontend/src/index.css` for custom component styles
3. Modify component-specific styles in respective files

### Adding New Features
1. Create new models in `backend/models/`
2. Add corresponding routes in `backend/routes/`
3. Create API endpoints and middleware
4. Build frontend components and pages
5. Update routing in `frontend/src/App.js`

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error
- Ensure MongoDB is running
- Check the MongoDB URI in your `.env` file
- Verify network connectivity

#### JWT Token Issues
- Check JWT_SECRET in backend `.env`
- Ensure cookies are enabled in browser
- Verify token expiration settings

#### CORS Errors
- Check FRONTEND_URL in backend `.env`
- Ensure proper CORS configuration
- Verify API URLs in frontend

#### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for missing dependencies
- Verify Node.js version compatibility

### Debug Mode
For development, use:
```bash
# Backend
npm run dev

# Frontend
npm start
```

Both servers will show detailed error messages and logs.

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Configure production database
3. Use environment-specific JWT secrets
4. Enable HTTPS in production
5. Configure reverse proxy (nginx/Apache)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to static hosting service
3. Configure API URL for production
4. Enable HTTPS and security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@shophub.com
- Documentation: Check this README file
- Issues: Report bugs via GitHub issues

## 🔄 Version History

- **v1.0.0** - Initial release with full e-commerce functionality
- User authentication and authorization
- Product management system
- Shopping cart and checkout
- Order management
- Admin dashboard
- Responsive design

---

**Built with ❤️ using MERN stack**
