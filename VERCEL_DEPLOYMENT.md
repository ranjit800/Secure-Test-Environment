# 🚀 Vercel Deployment - Quick Guide

## ✅ Prerequisites Completed
- [x] Backend deployed: https://secure-test-backend.onrender.com
- [x] Production build tested successfully
- [x] Environment variables configured

---

## 📝 Step-by-Step Vercel Deployment

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

### 2. Import Project
1. Click **"Add New"** → **"Project"**
2. Click **"Import"** next to your `Secure-Test-Environment` repository
3. Click **"Import"** to confirm

### 3. Configure Build Settings

**Project Settings:**
- Framework Preset: **Vite**
- Root Directory: **`frontend`** ← Click "Edit" and type this
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 4. Add Environment Variables

Click **"Environment Variables"** tab and add:

**Variable Name:**
```
VITE_API_URL
```

**Value:**
```
https://secure-test-backend.onrender.com/api
```

Click **"Add"**

### 5. Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. ✅ Success! Your app is live

---

## 🔍 After Deployment

### Test Your App

1. Click **"Visit"** to open your app
2. Test student registration and login
3. Start a test and complete it
4. Login as admin (`admin@gmail.com` / `admin1234`)
5. Check dashboard

### Save Your URL

Your app URL will be something like:
```
https://your-project-name.vercel.app
```

or

```
https://secure-test-environment.vercel.app
```

---

## ⚙️ Update Backend CORS (Important!)

After getting your Vercel URL, update backend:

1. Go to Render Dashboard
2. Select your backend service
3. Click "Environment" tab
4. Add:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
5. Save (auto-redeploys)

Or update `server.js` CORS to allow your Vercel domain.

---

## 🎯 You're Done!

Your secure assessment platform is now live!

**Backend:** https://secure-test-backend.onrender.com  
**Frontend:** https://your-app.vercel.app
