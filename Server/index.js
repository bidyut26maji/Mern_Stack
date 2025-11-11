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

app.use("/web/api", enquiryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ status: 0, message: 'Internal server error', error: err.message });
});

// ✅ Connect to MongoDB and start server
mongoose.connect(process.env.DBURL)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log('🚀 Server running on port ' + process.env.PORT);
      console.log('📡 API available at: http://localhost:' + process.env.PORT + '/web/api');
    });
  })
  .catch(err => {
    console.log('❌ MongoDB connection failed: ' + err.message);
    console.log('💡 Make sure MongoDB is running and DBURL is correct in .env file');
  });
