# Vercel Backend Setup Guide

## 📋 Step-by-Step Instructions

### Step 1: Push Your Code to GitHub

1. Make sure all your code is committed:
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

---

### Step 2: Go to Vercel Dashboard

1. Go to https://vercel.com
2. Sign in (or create account if you don't have one)
3. Click **"Add New..."** → **"Project"**

---

### Step 3: Import Your Repository

1. **Connect GitHub** (if not already connected)
   - Click "Import Git Repository"
   - Authorize Vercel to access your GitHub
   - Select your repository

2. **Select Repository**
   - Choose the repository that contains your `userEnquiry` folder

---

### Step 4: Configure Project Settings

**Important Settings:**

1. **Framework Preset:** Select **"Other"** or **"Node.js"**

2. **Root Directory:** 
   - Click "Edit" next to Root Directory
   - Set to: `userEnquiry/Server`
   - This tells Vercel where your backend code is

3. **Build Command:** 
   - Leave empty OR set to: `npm install`
   - (Vercel will auto-detect)

4. **Output Directory:** 
   - Leave empty
   - (Not needed for Node.js backend)

5. **Install Command:** 
   - Leave as: `npm install`
   - (Default is fine)

6. **Start Command:** 
   - Leave empty
   - (Vercel uses `vercel.json` configuration)

---

### Step 5: Set Environment Variables

**This is CRITICAL!**

1. Click **"Environment Variables"** section

2. Add these variables:

   **Variable 1:**
   - **Key:** `DBURL`
   - **Value:** Your MongoDB Atlas connection string
     - Example: `mongodb+srv://username:password@cluster.mongodb.net/enquirydb?retryWrites=true&w=majority`
   - **Environments:** Check all (Production, Preview, Development)

   **Variable 2 (Optional but recommended):**
   - **Key:** `NODE_ENV`
   - **Value:** `production`
   - **Environments:** Check all

   **Variable 3 (Auto-set by Vercel):**
   - **Key:** `VERCEL`
   - **Value:** `1`
   - **Note:** This is automatically set by Vercel, but you can add it manually if needed

3. Click **"Save"** after adding each variable

---

### Step 6: Deploy

1. Click **"Deploy"** button
2. Wait for deployment (usually 2-5 minutes)
3. You'll see build logs in real-time

---

### Step 7: Get Your Backend URL

After deployment completes:

1. You'll see: **"Congratulations! Your project has been deployed"**
2. Your backend URL will be shown (e.g., `https://backend-five-zeta-19.vercel.app`)
3. **Copy this URL** - you'll need it for the frontend

---

### Step 8: Test Your Backend

1. **Test Health Endpoint:**
   - Visit: `https://your-backend-url.vercel.app/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

2. **Test API Endpoint:**
   - Visit: `https://your-backend-url.vercel.app/web/api/enquiry-list`
   - Should return: `{"status":1,"message":"Enquiry list","data":[]}`

---

## 🔧 Important Configuration Files

### Your `vercel.json` should be in `userEnquiry/Server/` folder:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ],
  "env": {
    "VERCEL": "1"
  }
}
```

---

## ✅ Checklist Before Deploying

- [ ] Code is pushed to GitHub
- [ ] `vercel.json` exists in `userEnquiry/Server/` folder
- [ ] MongoDB Atlas cluster is created
- [ ] MongoDB connection string is ready
- [ ] Root Directory is set to `userEnquiry/Server`
- [ ] `DBURL` environment variable is set
- [ ] `NODE_ENV` is set to `production` (optional)

---

## 🐛 Troubleshooting

### Issue: "Build Failed"

**Solutions:**
1. Check Root Directory is set to `userEnquiry/Server`
2. Make sure `package.json` exists in `userEnquiry/Server/`
3. Check build logs for specific errors
4. Verify all dependencies are in `dependencies` (not `devDependencies`)

### Issue: "Function Timeout"

**Solutions:**
1. MongoDB connection might be slow
2. Check MongoDB Atlas connection string
3. Verify IP whitelist in MongoDB Atlas (use `0.0.0.0/0`)
4. Check Vercel function logs

### Issue: "MongoDB Connection Failed"

**Solutions:**
1. Verify `DBURL` environment variable is set correctly
2. Check MongoDB Atlas cluster is running
3. Verify connection string format
4. Check network access in MongoDB Atlas (whitelist IPs)

### Issue: "Module Not Found"

**Solutions:**
1. Make sure all dependencies are in `package.json`
2. Check `node_modules` is not in `.gitignore` (it shouldn't be)
3. Verify all imports are correct

---

## 📝 After Deployment

1. **Update Frontend:**
   - Set `VITE_API_URL` in frontend Vercel project
   - Value: `https://your-backend-url.vercel.app/web/api`

2. **Monitor Logs:**
   - Go to your project → "Logs" tab
   - Check for any errors

3. **Test Endpoints:**
   - Health: `/health`
   - API: `/web/api/enquiry-list`
   - Insert: POST `/web/api/enquiry-insert`

---

## 🎯 Quick Summary

1. **Import** repository from GitHub
2. **Set Root Directory** to `userEnquiry/Server`
3. **Add Environment Variable** `DBURL` with MongoDB connection string
4. **Deploy**
5. **Copy backend URL** for frontend configuration

That's it! Your backend should be live on Vercel! 🚀

