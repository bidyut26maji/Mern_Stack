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

// ✅ Connect to MongoDB
const DBURL = process.env.DBURL || 'mongodb://127.0.0.1:27017/enquirydb';

// Optimize MongoDB connection for Vercel serverless
mongoose.set('strictQuery', false);

// Connect to MongoDB (reuse connection if exists - important for serverless)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }

  try {
    await mongoose.connect(DBURL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.log('❌ MongoDB connection failed: ' + err.message);
    isConnected = false;
  }
};

// Middleware to ensure MongoDB connection before handling requests (for serverless)
app.use(async (req, res, next) => {
  // Always ensure connection for API routes
  if (req.path.startsWith('/web/api')) {
    if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
      // 0 = disconnected, 3 = disconnecting
      await connectDB();
    }
    // Wait a bit if still connecting
    if (mongoose.connection.readyState === 2) {
      // 2 = connecting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  next();
});

app.use("/web/api", enquiryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ status: 0, message: 'Internal server error', error: err.message });
});

// For Vercel serverless functions, export the app
// For local development, start the server
if (process.env.VERCEL) {
  // Vercel serverless mode
  module.exports = app;
} else {
  // Local development mode
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
