# Setup Instructions

## Prerequisites
- Node.js installed
- MongoDB running locally (or update DBURL in .env)

## Backend Setup

1. Navigate to the Server directory:
   ```bash
   cd userEnquiry/Server
   ```

2. Create a `.env` file in the Server directory with:
   ```
   PORT=5000
   DBURL=mongodb://127.0.0.1:27017/enquirydb
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   node index.js
   ```
   Or with nodemon (if installed):
   ```bash
   npx nodemon index.js
   ```

   You should see:
   - ✅ Connected to MongoDB
   - 🚀 Server running on port 5000

## Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd userEnquiry/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The app will be available at: http://localhost:5173

## Features

- **Left Side**: Form to submit enquiries with fields:
  - Name
  - Mobile
  - Email
  - Message

- **Right Side**: Displays all submitted enquiries with:
  - All enquiry details
  - Delete functionality
  - Auto-refresh after submission
  - Timestamp display

## API Endpoints

- `POST /web/api/enquiry-insert` - Submit new enquiry
- `GET /web/api/enquiry-list` - Get all enquiries
- `DELETE /web/api/enquiry-delete/:id` - Delete an enquiry
- `PUT /web/api/enquiry-update/:id` - Update an enquiry

## Troubleshooting

1. **CORS Errors**: Make sure the backend is running on port 5000 and frontend on 5173
2. **MongoDB Connection**: Ensure MongoDB is running and the DBURL is correct
3. **Port Conflicts**: Change ports in .env (backend) or vite.config.js (frontend) if needed

