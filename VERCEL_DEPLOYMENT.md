# Vercel Deployment Guide

## ✅ Your Deployment URLs

- **Backend:** https://backend-five-zeta-19.vercel.app
- **Frontend:** https://myproject-three-liart.vercel.app

---

## 🔧 Configuration Updates Made

### Backend (`userEnquiry/Server/index.js`)
- ✅ Updated for Vercel serverless functions
- ✅ Exports app instead of starting server
- ✅ Optimized MongoDB connection for serverless
- ✅ Handles both Vercel and local development

### Frontend (`userEnquiry/client/src/Enquiry.jsx`)
- ✅ Updated API URL to use Vercel backend
- ✅ Health check uses Vercel backend URL
- ✅ Falls back to localhost for local development

### Vercel Config (`userEnquiry/Server/vercel.json`)
- ✅ Configured for serverless functions
- ✅ Routes all requests to index.js

---

## 📋 Environment Variables Setup

### Backend (Vercel Dashboard)

Go to your backend project in Vercel → Settings → Environment Variables:

1. **DBURL**
   - Value: Your MongoDB Atlas connection string
   - Example: `mongodb+srv://user:pass@cluster.mongodb.net/enquirydb?retryWrites=true&w=majority`
   - Environment: Production, Preview, Development

2. **VERCEL** (Optional - already set in vercel.json)
   - Value: `1`
   - This tells the app it's running on Vercel

### Frontend (Vercel Dashboard)

Go to your frontend project in Vercel → Settings → Environment Variables:

1. **VITE_API_URL** (Optional)
   - Value: `https://backend-five-zeta-19.vercel.app/web/api`
   - If not set, it will use the hardcoded URL in the code
   - Environment: Production, Preview, Development

---

## 🚀 Deployment Steps

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Configure for Vercel deployment"
git push
```

### 2. Deploy Backend

1. Go to https://vercel.com/dashboard
2. Select your backend project (`backend-five-zeta-19`)
3. Go to Settings → Environment Variables
4. Add `DBURL` with your MongoDB connection string
5. Go to Deployments → Redeploy (or it will auto-deploy on push)

### 3. Deploy Frontend

1. Select your frontend project (`myproject-three-liart`)
2. Go to Settings → Environment Variables
3. Add `VITE_API_URL` = `https://backend-five-zeta-19.vercel.app/web/api` (optional)
4. Go to Deployments → Redeploy

---

## 🧪 Testing

### Test Backend Health:
Visit: https://backend-five-zeta-19.vercel.app/health

Should return:
```json
{"status":"ok","message":"Server is running"}
```

### Test API Endpoint:
Visit: https://backend-five-zeta-19.vercel.app/web/api/enquiry-list

Should return:
```json
{"status":1,"message":"Enquiry list","data":[]}
```

### Test Frontend:
Visit: https://myproject-three-liart.vercel.app

- Should show "Server connected" (green badge)
- Form should work
- Enquiries should appear on the right side

---

## 🔍 Troubleshooting

### Backend Issues:

1. **"MongoDB connection failed"**
   - Check `DBURL` environment variable in Vercel
   - Verify MongoDB Atlas connection string
   - Make sure IP is whitelisted (use `0.0.0.0/0` for all IPs)

2. **"Function timeout"**
   - Vercel free tier has 10s timeout for serverless functions
   - MongoDB connection might be slow on first request
   - Consider upgrading or optimizing connection

3. **"Module not found"**
   - Make sure all dependencies are in `package.json`
   - Check Vercel build logs

### Frontend Issues:

1. **"Cannot connect to server"**
   - Check if backend URL is correct
   - Verify backend is deployed and working
   - Check browser console (F12) for CORS errors

2. **"CORS error"**
   - Backend already allows all origins
   - If still having issues, check Vercel logs

3. **"API calls fail"**
   - Verify `VITE_API_URL` is set correctly
   - Check network tab in browser DevTools
   - Make sure backend is accessible

---

## 📝 Important Notes

1. **MongoDB Atlas Required**
   - Vercel serverless functions can't connect to local MongoDB
   - You MUST use MongoDB Atlas (free tier available)

2. **Cold Starts**
   - First request after inactivity may be slow (~2-5 seconds)
   - This is normal for serverless functions
   - Subsequent requests are fast

3. **Environment Variables**
   - Must be set in Vercel dashboard
   - `.env` files don't work in Vercel
   - Set them in project settings

4. **Build Directory**
   - Backend: Root directory should be `userEnquiry/Server`
   - Frontend: Root directory should be `userEnquiry/client`

---

## ✅ Quick Checklist

- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string ready
- [ ] Backend `DBURL` environment variable set in Vercel
- [ ] Backend deployed and health check works
- [ ] Frontend `VITE_API_URL` set (optional)
- [ ] Frontend deployed
- [ ] Test form submission
- [ ] Test enquiry list display

---

## 🎉 You're Done!

Your app should now be working on Vercel!

**Backend:** https://backend-five-zeta-19.vercel.app  
**Frontend:** https://myproject-three-liart.vercel.app

If you encounter any issues, check:
1. Vercel deployment logs
2. Browser console (F12)
3. Network tab for API calls
4. MongoDB Atlas connection status

