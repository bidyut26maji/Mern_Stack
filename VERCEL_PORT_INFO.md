# Vercel Port Configuration - Important Information

## ❌ You DON'T Need to Set a Port!

**Vercel serverless functions don't use ports like traditional servers.**

Vercel automatically:
- Handles routing
- Assigns ports internally
- Manages the serverless execution
- Provides HTTPS automatically

## ✅ What You Need to Configure Instead

### 1. **Root Directory** (Required)
- Set to: `userEnquiry/Server`
- This tells Vercel where your backend code is

### 2. **Build Command** (Optional)
- Leave empty OR set to: `npm install`
- Vercel will auto-detect Node.js projects

### 3. **Output Directory** (Leave Empty)
- Not needed for Node.js backend
- Only used for static sites

### 4. **Install Command** (Default is Fine)
- Default: `npm install`
- Usually doesn't need to be changed

### 5. **Start Command** (Leave Empty)
- **DO NOT SET A PORT HERE**
- Vercel uses `vercel.json` configuration
- Your `index.js` exports the app (not starts a server)

## 🔧 Vercel Settings Summary

When configuring your backend in Vercel:

| Setting | Value |
|---------|-------|
| **Framework Preset** | "Other" or "Node.js" |
| **Root Directory** | `userEnquiry/Server` ✅ |
| **Build Command** | (empty) or `npm install` |
| **Output Directory** | (empty) |
| **Install Command** | `npm install` (default) |
| **Start Command** | (empty) ✅ |
| **Port** | ❌ **NOT NEEDED** |

## 📝 How It Works

### Traditional Server (Local Development):
```javascript
app.listen(5000); // You specify port
// Server runs on http://localhost:5000
```

### Vercel Serverless (Production):
```javascript
module.exports = app; // Just export the app
// Vercel handles everything automatically
// Your URL: https://your-backend.vercel.app
```

## ✅ Your Current Setup is Correct

Your `index.js` already handles this correctly:

```javascript
// Always export the app for Vercel
module.exports = app;

// Only start server locally (not on Vercel)
if (!process.env.VERCEL && !process.env.VERCEL_ENV) {
  // Local development code
  app.listen(PORT, ...);
}
```

## 🎯 What Vercel Does Automatically

1. **Detects** your Node.js app
2. **Builds** it using `@vercel/node`
3. **Routes** all requests to your `index.js`
4. **Handles** HTTPS, ports, and scaling automatically
5. **Provides** a URL like `https://your-backend.vercel.app`

## ❌ Common Mistakes to Avoid

1. **Don't set a port** in Vercel settings
2. **Don't use** `app.listen()` on Vercel (it won't work)
3. **Don't set** `PORT` environment variable (Vercel ignores it)
4. **Don't configure** port in `vercel.json` (not needed)

## ✅ What You Actually Need

1. **Root Directory:** `userEnquiry/Server` ✅
2. **Environment Variables:**
   - `DBURL` - Your MongoDB connection string ✅
   - `NODE_ENV` - `production` (optional) ✅
3. **vercel.json** - Already configured correctly ✅

## 🚀 Your Backend URL

After deployment, Vercel gives you:
- **URL:** `https://backend-five-zeta-19.vercel.app`
- **No port needed** - it's HTTPS on port 443 (automatic)
- **All routes work:** `/health`, `/web/api/enquiry-list`, etc.

## 📋 Quick Checklist

- [x] Root Directory set to `userEnquiry/Server`
- [x] Build Command empty (or `npm install`)
- [x] Start Command empty
- [x] Port setting: **NOT NEEDED** (leave as default/empty)
- [x] `DBURL` environment variable set
- [x] `vercel.json` exists in `userEnquiry/Server/`

## 💡 Summary

**You don't need to configure a port in Vercel!**

Just make sure:
1. Root Directory = `userEnquiry/Server`
2. Environment Variables are set (especially `DBURL`)
3. Your code exports the app (already done ✅)

Vercel handles everything else automatically! 🎉

