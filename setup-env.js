const fs = require('fs');
const path = require('path');

// Backend .env content
const backendEnv = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://sachin369y45_db_user:nC0r9STvK3QP8E70@cluster0.yrxfmkz.mongodb.net/ecommerce

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_123456
JWT_EXPIRE=7d

# Cookie Configuration
COOKIE_EXPIRE=7

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000`;

// Frontend .env content
const frontendEnv = `# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Environment
NODE_ENV=development`;

// Write backend .env
fs.writeFileSync(path.join(__dirname, 'backend', '.env'), backendEnv);
console.log('✅ Backend .env file created/updated');

// Write frontend .env
fs.writeFileSync(path.join(__dirname, 'frontend', '.env'), frontendEnv);
console.log('✅ Frontend .env file created/updated');

console.log('\n🚀 Setup complete! Please restart both servers:');
console.log('1. Backend: cd backend && npm start');
console.log('2. Frontend: cd frontend && npm start');
