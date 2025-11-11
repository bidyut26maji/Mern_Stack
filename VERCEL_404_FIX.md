# Fixing 404 NOT_FOUND Error on Vercel

## ✅ Changes Made

1. **Updated `index.js`** - Always exports the app (required for Vercel)
2. **Fixed `vercel.json`** - Corrected route destination
3. **Improved export logic** - Works for both Vercel and local development

## 🔧 What Was Fixed

### Issue: 404 NOT_FOUND
**Cause:** Vercel couldn't find the exported app or route configuration was incorrect.

### Solution:
1. **Always export the app** - Changed from conditional export to always exporting
2. **Fixed route destination** - Changed from `/index.js` to `index.js`
3. **Better environment detection** - Checks for both `VERCEL` and `VERCEL_ENV`

## 📋 Next Steps

### 1. Push Changes to GitHub
```bash
git add .
git commit -m "Fix 404 error - always export app for Vercel"
git push
```

### 2. Redeploy on Vercel
- Go to Vercel Dashboard
- Your project should auto-redeploy
- OR manually trigger: Deployments → Redeploy

### 3. Verify Configuration in Vercel

**Check these settings:**

1. **Root Directory:** `userEnquiry/Server`
2. **Build Command:** Leave empty or `npm install`
3. **Output Directory:** Leave empty
4. **Install Command:** `npm install` (default)

### 4. Test Endpoints

After redeploy, test these URLs:

- **Health:** `https://your-backend-url.vercel.app/health`
- **API List:** `https://your-backend-url.vercel.app/web/api/enquiry-list`
- **API Insert:** POST `https://your-backend-url.vercel.app/web/api/enquiry-insert`

## 🐛 If Still Getting 404

### Check Vercel Logs:
1. Go to Vercel Dashboard → Your Project
2. Click "Logs" tab
3. Look for errors during build or runtime

### Common Issues:

1. **Wrong Root Directory**
   - Must be: `userEnquiry/Server`
   - Not: `userEnquiry` or root

2. **Missing Environment Variables**
   - `DBURL` must be set
   - Check Settings → Environment Variables

3. **Build Fails**
   - Check if `package.json` exists in `userEnquiry/Server/`
   - Verify all dependencies are listed

4. **Route Not Found**
   - Verify `vercel.json` is in `userEnquiry/Server/` folder
   - Check route configuration

## ✅ Expected Behavior

After fix:
- ✅ `/health` returns `{"status":"ok","message":"Server is running"}`
- ✅ `/web/api/enquiry-list` returns enquiry list
- ✅ `/web/api/enquiry-insert` accepts POST requests
- ✅ No more 404 errors

## 📝 File Structure

Your `userEnquiry/Server/` folder should have:
```
userEnquiry/Server/
├── index.js          ← Main entry point (exports app)
├── vercel.json       ← Vercel configuration
├── package.json      ← Dependencies
├── App/
│   ├── routes/
│   ├── controllers/
│   └── models/
└── ...
```

The key fix: **`index.js` now always exports the app**, which is required for Vercel serverless functions.

