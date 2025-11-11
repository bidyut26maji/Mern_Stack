# Debugging Guide

## ✅ Debugging Improvements Made

### Backend Improvements:

1. **Enhanced Logging**
   - Added console logs for all CRUD operations
   - Logs show when enquiries are saved, fetched, or deleted
   - Better error messages with context

2. **Error Handling**
   - Added global error handling middleware
   - Better validation in controllers
   - Improved duplicate key error messages
   - Check if enquiry exists before deletion

3. **Health Check Endpoint**
   - Added `/health` endpoint to check if server is running
   - Returns: `{ status: 'ok', message: 'Server is running' }`

4. **Database Schema**
   - Added `timestamps: true` to automatically track `createdAt` and `updatedAt`
   - Enquiries are sorted by newest first

5. **Server Startup Messages**
   - Shows MongoDB connection status
   - Displays API endpoint URL on startup
   - Helpful error messages if MongoDB connection fails

### Frontend Improvements:

1. **Server Status Indicator**
   - Visual indicator showing if server is online/offline/checking
   - Color-coded status badges (green=online, red=offline, yellow=checking)
   - Automatically checks server on page load

2. **Better Error Messages**
   - More descriptive error messages
   - Shows specific error from server when available
   - Helpful guidance when server is offline

3. **Improved Error Handling**
   - Clears previous errors before new operations
   - Handles network errors gracefully
   - Shows loading states appropriately

## 🔍 How to Debug

### Check Server Status:

1. **Backend Server:**
   ```powershell
   cd userEnquiry\Server
   npm run dev
   ```
   You should see:
   - ✅ Connected to MongoDB
   - 🚀 Server running on port 8000
   - 📡 API available at: http://localhost:8000/web/api

2. **Test Health Endpoint:**
   Open browser: `http://localhost:8000/health`
   Should return: `{"status":"ok","message":"Server is running"}`

3. **Frontend:**
   ```powershell
   cd userEnquiry\client
   npm run dev
   ```
   Open: `http://localhost:5173`
   - Check the server status indicator at the top
   - Green = Connected, Red = Offline

### Common Issues:

1. **"Server offline" message:**
   - Make sure backend is running on port 8000
   - Check if MongoDB is running
   - Verify `.env` file has correct `DBURL`

2. **"Cannot fetch enquiries":**
   - Check browser console (F12) for errors
   - Verify CORS is working (check Network tab)
   - Make sure API endpoint is correct: `http://localhost:8000/web/api/enquiry-list`

3. **"Duplicate key error":**
   - The model has `unique: true` on email and phone
   - Each email and phone can only be used once
   - Use different email/phone for testing

4. **MongoDB Connection Failed:**
   - Make sure MongoDB is running
   - Check `.env` file has: `DBURL=mongodb://127.0.0.1:27017/enquirydb`
   - Verify MongoDB is accessible

### Browser Console Debugging:

1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab to see API requests:
   - Status 200 = Success
   - Status 400 = Bad Request (validation error)
   - Status 500 = Server Error
   - Status 0 = Network error (server offline)

### Server Console Debugging:

Watch the server terminal for:
- ✅ Enquiry saved: [ID] - When form is submitted
- 📋 Fetched X enquiries - When list is loaded
- 🗑️ Enquiry deleted: [ID] - When item is deleted
- ❌ Error messages - When something goes wrong

## 🧪 Testing Checklist

- [ ] Backend server starts without errors
- [ ] MongoDB connection successful
- [ ] Health endpoint returns OK
- [ ] Frontend shows "Server connected" status
- [ ] Form submission works
- [ ] Enquiry list displays on right side
- [ ] Delete button works
- [ ] Error messages show when server is offline
- [ ] Duplicate email/phone shows error message
- [ ] Form validation works (empty fields, invalid email)

## 📝 Notes

- Server runs on port 8000 (check your `.env` file)
- Frontend runs on port 5173 (Vite default)
- API base URL: `http://localhost:8000/web/api`
- Email and phone must be unique (can't submit same email/phone twice)

