const enquiryModel = require('../../models/enquiry.model');

// ✅ Insert Enquiry
const EnquiryInsert = (req, res) => {
  const { sName, sEmail, sPhone, sMessage } = req.body;

  // Validation
  if (!sName || !sEmail || !sPhone || !sMessage) {
    return res.status(400).send({ status: 0, message: 'All fields are required' });
  }

  const enquiry = new enquiryModel({
    name: sName,
    email: sEmail,
    phone: sPhone,
    message: sMessage
  });

  enquiry.save()
    .then((savedEnquiry) => {
      console.log('✅ Enquiry saved:', savedEnquiry._id);
      res.send({ status: 1, message: 'Enquiry saved successfully' });
    })
    .catch(err => {
      console.error('❌ Error saving enquiry:', err);
      // Handle duplicate key error
      if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).send({ 
          status: 0, 
          message: `This ${field} is already registered. Please use a different ${field}.` 
        });
      }
      res.status(500).send({ status: 0, message: 'Error while saving enquiry', error: err.message });
    });
};

// ✅ Get Enquiry List
const EnquiryList = (_req, res) => {
  enquiryModel.find()
    .sort({ createdAt: -1 }) // Sort by newest first
    .then(enquiryList => {
      console.log('📋 Fetched', enquiryList.length, 'enquiries');
      res.status(200).json({ status: 1, message: 'Enquiry list', data: enquiryList });
    })
    .catch(err => {
      console.error('❌ Error fetching enquiries:', err);
      res.status(500).json({ status: 0, message: 'Error fetching enquiries', error: err.message });
    });
};

// ✅ Delete Enquiry
const DeleteRes = (req, res) => {
  const enquiryId = req.params.id;

  if (!enquiryId) {
    return res.status(400).json({ status: 0, message: 'Enquiry ID is required' });
  }

  enquiryModel.deleteOne({ _id: enquiryId })
    .then(delRes => {
      if (delRes.deletedCount === 0) {
        return res.status(404).json({ status: 0, message: 'Enquiry not found' });
      }
      console.log('🗑️ Enquiry deleted:', enquiryId);
      res.send({ status: 1, message: 'Enquiry deleted successfully', id: enquiryId });
    })
    .catch(err => {
      console.error('❌ Error deleting enquiry:', err);
      res.status(500).json({ status: 0, message: 'Error deleting enquiry', error: err.message });
    });
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
