const enquiryModel = require('../../models/enquiry.model');

// ✅ Insert Enquiry
const EnquiryInsert = async (req, res) => {
  try {
    const { sName, sEmail, sPhone, sMessage } = req.body;

    // Validation
    if (!sName || !sEmail || !sPhone || !sMessage) {
      return res.status(400).send({ status: 0, message: 'All fields are required' });
    }

    // Ensure MongoDB connection is ready
    const mongoose = require('mongoose');
    let connectionState = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    
    // Wait for connection if not ready (with timeout)
    if (connectionState !== 1) {
      let attempts = 0;
      while (connectionState !== 1 && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        connectionState = mongoose.connection.readyState;
        attempts++;
      }
      
      if (connectionState !== 1) {
        return res.status(503).send({ 
          status: 0, 
          message: 'Database connection not ready. Please try again in a moment.' 
        });
      }
    }

    const enquiry = new enquiryModel({
      name: sName,
      email: sEmail,
      phone: sPhone,
      message: sMessage
    });

    const savedEnquiry = await enquiry.save();
    console.log('✅ Enquiry saved:', savedEnquiry._id);
    res.send({ status: 1, message: 'Enquiry saved successfully' });
  } catch (err) {
    console.error('❌ Error saving enquiry:', err);
    console.error('Error details:', {
      name: err.name,
      code: err.code,
      message: err.message,
      stack: err.stack
    });
    
    // Handle duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'field';
      return res.status(400).send({ 
        status: 0, 
        message: `This ${field} is already registered. Please use a different ${field}.` 
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors || {}).map(e => e.message).join(', ');
      return res.status(400).send({ 
        status: 0, 
        message: `Validation error: ${errors || err.message}` 
      });
    }
    
    // Handle MongoDB connection errors
    if (err.name === 'MongoServerError' || err.name === 'MongoNetworkError') {
      return res.status(503).send({ 
        status: 0, 
        message: 'Database connection error. Please try again.' 
      });
    }
    
    // Generic error response
    res.status(500).send({ 
      status: 0, 
      message: err.message || 'Error while saving enquiry',
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// ✅ Get Enquiry List
const EnquiryList = async (_req, res) => {
  try {
    console.log('📋 Fetching enquiry list...');
    
    // Ensure MongoDB connection is ready
    const mongoose = require('mongoose');
    let connectionState = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    
    // Wait for connection if not ready (with timeout)
    if (connectionState !== 1) {
      console.log('⏳ Waiting for MongoDB connection... State:', connectionState);
      let attempts = 0;
      while (connectionState !== 1 && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        connectionState = mongoose.connection.readyState;
        attempts++;
      }
      
      if (connectionState !== 1) {
        console.error('❌ MongoDB connection not ready after waiting. State:', connectionState);
        return res.status(503).json({ 
          status: 0, 
          message: 'Database connection not ready. Please try again in a moment.' 
        });
      }
    }

    console.log('✅ MongoDB connected, fetching enquiries...');
    const enquiryList = await enquiryModel.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .exec();
    
    console.log('📋 Fetched', enquiryList.length, 'enquiries');
    res.status(200).json({ status: 1, message: 'Enquiry list', data: enquiryList || [] });
  } catch (err) {
    console.error('❌ Error fetching enquiries:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack
    });
    
    // Handle MongoDB connection errors
    if (err.name === 'MongoServerError' || err.name === 'MongoNetworkError' || err.name === 'MongooseError') {
      return res.status(503).json({ 
        status: 0, 
        message: 'Database connection error. Please try again.' 
      });
    }
    
    res.status(500).json({ 
      status: 0, 
      message: err.message || 'Error fetching enquiries',
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// ✅ Delete Enquiry
const DeleteRes = async (req, res) => {
  try {
    const enquiryId = req.params.id;

    if (!enquiryId) {
      return res.status(400).json({ status: 0, message: 'Enquiry ID is required' });
    }

    // Ensure MongoDB connection is ready
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ 
          status: 0, 
          message: 'Database connection not ready. Please try again.' 
        });
      }
    }

    const delRes = await enquiryModel.deleteOne({ _id: enquiryId });
    
    if (delRes.deletedCount === 0) {
      return res.status(404).json({ status: 0, message: 'Enquiry not found' });
    }
    console.log('🗑️ Enquiry deleted:', enquiryId);
    res.send({ status: 1, message: 'Enquiry deleted successfully', id: enquiryId });
  } catch (err) {
    console.error('❌ Error deleting enquiry:', err);
    res.status(500).json({ status: 0, message: 'Error deleting enquiry', error: err.message });
  }
};

// ✅ Update Enquiry
const UpdateRes = (req, res) => {
  const enquiryId = req.params.id;
  const { sName, sEmail, sPhone, sMessage } = req.body;

  const updateObj = { name: sName, email: sEmail, phone: sPhone, message: sMessage };

  enquiryModel.updateOne({ _id: enquiryId }, updateObj)
    .then(updateRes =>
      res.send({ status: 1, message: 'Enquiry updated successfully', updateRes })
    )
    .catch(err =>
      res.status(500).json({ status: 0, message: 'Error updating enquiry', error: err.message })
    );
};

// ✅ Export (so index.js can import directly)
module.exports = { EnquiryInsert, EnquiryList, DeleteRes, UpdateRes };
