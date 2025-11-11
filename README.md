# 🧾 User Enquiry System (MERN Stack + Vercel + MongoDB Atlas)

This is a full-stack web app for managing user enquiries, built using:

- **Frontend:** React (Vite)
- **Backend:** Express.js + Node.js
- **Database:** MongoDB Atlas
- **Hosting:** Vercel (both backend & frontend)

---

## 🚀 Features

✅ Submit enquiries with name, email, phone, and message  
✅ View all submitted enquiries  
✅ Delete individual enquiries  
✅ Real-time server connection status (“Server connected / offline”)  
✅ MongoDB Atlas integration  
✅ Deployed fully serverless on **Vercel**

---

## 📂 Folder Structure


project-root/
├── backend/
│ ├── index.js
│ ├── App/
│ │ └── routes/web/enquiryRoutes.js
│ ├── package.json
│ ├── vercel.json
│ └── .env (not committed to Git)
│
└── client/
├── src/
│ └── Enquiry.jsx
├── vite.config.js
├── package.json
└── .env

yaml
Copy code

---

## ⚙️ Backend Setup (Express + MongoDB)

### 1️⃣ Install dependencies
```bash
cd backend
npm install
2️⃣ Configure .env
Create a .env file inside the backend folder:

env
Copy code
DBURL=mongodb+srv://kihobe45_db_user:r2vkyzitfuexJmwa@cluster0.sssabcc.mongodb.net/enquirydb?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
3️⃣ Add vercel.json
In the same folder, add this file:

json
Copy code
{
  "version": 2,
  "builds": [
    { "src": "index.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "index.js" }
  ]
}
4️⃣ Test locally
bash
Copy code
npm run start
Visit → http://localhost:5000/health

Expected:

json
Copy code
{ "status": "ok", "message": "Server is running" }
5️⃣ Deploy to Vercel
Push your backend folder to GitHub.

Go to https://vercel.com

Import the project → select backend folder.

In Settings → Environment Variables, add:Click Deploy
Your backend URL will look like:

https://backend-mu-eight-48.vercel.app/


Test:
Visit → https://backend-mu-eight-48.vercel.app/health

✅ You should see:

{ "status": "ok", "message": "User Enquiry API Server" }

🌐 Frontend Setup (React + Vite)
1️⃣ Install dependencies
cd client
npm install

2️⃣ Configure .env

Create a .env file in your client folder:

VITE_API_URL=https://backend-mu-eight-48.vercel.app/web/api

3️⃣ Build and run locally
npm run dev


or build production files:

npm run build
npm run preview

4️⃣ Deploy to Vercel

Push your client folder to GitHub.

Deploy via Vercel, selecting the client folder.

After deployment, open your frontend URL.

You should now see:
✅ “Server connected” (green indicator)

🧠 Common Issues & Fixes
Problem	Cause	Fix
❌ "Server offline"	Frontend pointing to wrong backend URL	Update VITE_API_URL in .env and rebuild
❌ "MongoDB connection failed"	Wrong or local DB URL	Use MongoDB Atlas URL with correct user/password
❌ CORS error	Backend didn’t allow frontend origin	Set origin: "*" in backend CORS setup
❌ 404 on /web/api/...	Missing vercel.json in backend	Add correct routes in vercel.json
🧾 Example URLs
Endpoint	Description
/health	Health check
/web/api/enquiry-list	Get all enquiries
/web/api/enquiry-insert	Insert new enquiry
/web/api/enquiry-delete/:id	Delete enquiry
💡 Developer Notes

.env files are not committed to Git for security reasons.

When editing .env, always rebuild your frontend using npm run build.

Atlas IP whitelist must include: 0.0.0.0/0 (Allow from anywhere).

✅ Final Working URLs

Backend: https://backend-mu-eight-48.vercel.app/

Frontend: (Your Vercel frontend deployment URL)

API Base: https://backend-mu-eight-48.vercel.app/web/api

🧩 Credits

Developed by Bidyut Maji
Built using MERN + Vercel + MongoDB Atlas
