// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const enquiryRoutes = require('./App/routes/web/enquiryRoutes');

const app = express();

// Enable CORS for all routes - allow all origins in development
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'User Enquiry API Server',
    endpoints: {
      health: '/health',
      api: '/web/api',
      enquiryList: '/web/api/enquiry-list',
      enquiryInsert: '/web/api/enquiry-insert'
    }
  });
});

// ✅ Connect to MongoDB
const DBURL = process.env.DBURL || 'mongodb://127.0.0.1:27017/enquirydb';

// Optimize MongoDB connection for Vercel serverless
mongoose.set('strictQuery', false);

// Connect to MongoDB (reuse connection if exists - important for serverless)
let isConnected = false;

const connectDB = async () => {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  // Don't reconnect if already connecting
  if (mongoose.connection.readyState === 2) {
    return;
  }

  try {
    await mongoose.connect(DBURL, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB');
    
    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      isConnected = false;
    });
    
    mongoose.connection.on('error', (err) => {
      console.log('❌ MongoDB error:', err.message);
      isConnected = false;
    });
  } catch (err) {
    console.log('❌ MongoDB connection failed: ' + err.message);
    isConnected = false;
    throw err;
  }
};

// Middleware to ensure MongoDB connection before handling requests (for serverless)
app.use(async (req, res, next) => {
  try {
    // Always ensure connection for API routes
    if (req.path.startsWith('/web/api')) {
      const state = mongoose.connection.readyState;
      // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
      
      if (state === 0 || state === 3) {
        // Disconnected or disconnecting - reconnect
        try {
          await connectDB();
        } catch (err) {
          console.error('Connection error in middleware:', err);
          // Continue anyway - let the controller handle it
        }
      }
      
      // Wait if still connecting
      if (state === 2) {
        let attempts = 0;
        while (mongoose.connection.readyState === 2 && attempts < 15) {
          await new Promise(resolve => setTimeout(resolve, 200));
          attempts++;
        }
      }
      
      // Final check - if still not connected, try one more time
      if (mongoose.connection.readyState !== 1) {
        try {
          await connectDB();
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (err) {
          console.error('Final connection attempt failed:', err);
          // Continue - let controller handle the error
        }
      }
    }
    next();
  } catch (err) {
    console.error('Middleware error:', err);
    next(err); // Pass to error handler
  }
});

app.use("/web/api", enquiryRoutes);

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  console.error('Error stack:', err.stack);
  
  // Don't send response if headers already sent
  if (res.headersSent) {
    return next(err);
  }
  
  res.status(500).json({ 
    status: 0, 
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Always export the app for Vercel serverless functions
// Vercel will handle the serverless execution
module.exports = app;

// For local development, start the server
if (!process.env.VERCEL && !process.env.VERCEL_ENV) {
  const PORT = process.env.PORT || 5000;
  mongoose.connect(DBURL)
    .then(() => {
      console.log('✅ Connected to MongoDB');
      app.listen(PORT, () => {
        console.log('🚀 Server running on port ' + PORT);
        console.log('📡 API available at: http://localhost:' + PORT + '/web/api');
      });
    })
    .catch(err => {
      console.log('❌ MongoDB connection failed: ' + err.message);
      console.log('💡 Make sure MongoDB is running and DBURL is correct in .env file');
    });
}
