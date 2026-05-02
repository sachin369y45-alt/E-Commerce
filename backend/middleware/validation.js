const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  
  body('phoneNumber')
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Please enter a valid phone number')
    .notEmpty()
    .withMessage('Phone number is required'),
  
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('address.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Zip code is required'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Product creation validation
const validateProductCreation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 100 })
    .withMessage('Product name cannot exceed 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),
  
  body('category')
    .isIn(['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports & Outdoors', 'Toys & Games', 'Health & Beauty', 'Food & Beverages', 'Automotive', 'Other'])
    .withMessage('Invalid category'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  
  body('image')
    .isURL()
    .withMessage('Image must be a valid URL')
    .optional(),
  
  handleValidationErrors
];

// Product update validation
const validateProductUpdate = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 100 })
    .withMessage('Product name cannot exceed 100 characters')
    .optional(),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters')
    .optional(),
  
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative')
    .optional(),
  
  body('category')
    .isIn(['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports & Outdoors', 'Toys & Games', 'Health & Beauty', 'Food & Beverages', 'Automotive', 'Other'])
    .withMessage('Invalid category')
    .optional(),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
    .optional(),
  
  body('image')
    .isURL()
    .withMessage('Image must be a valid URL')
    .optional(),
  
  handleValidationErrors
];

// Cart item validation
const validateCartItem = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  
  handleValidationErrors
];

// Order validation
const validateOrder = [
  body('orderItems')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  
  body('orderItems.*.product')
    .isMongoId()
    .withMessage('Invalid product ID in order items'),
  
  body('orderItems.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('shippingAddress.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Zip code is required'),
  
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateProductCreation,
  validateProductUpdate,
  validateCartItem,
  validateOrder,
  handleValidationErrors
};
