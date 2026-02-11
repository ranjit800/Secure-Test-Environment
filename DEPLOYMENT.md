# 🚀 Deployment Guide

## Quick Start

This guide walks you through deploying:
- **Backend** → Render (Free Tier)
- **Frontend** → Vercel (Free Tier)

---

## 📋 Prerequisites

- [x] GitHub account
- [x] Render account ([render.com](https://render.com))
- [x] Vercel account ([vercel.com](https://vercel.com))
- [x] MongoDB Atlas cluster
- [x] Code committed to GitHub

---

## 🔧 Part 1: Deploy Backend to Render

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "feat: Ready for production deployment"
git push origin main
```

### Step 2: Create Web Service on Render

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect account"** to link GitHub
4. Select your repository: `Secure-Test-Environment`
5. Click **"Connect"**

### Step 3: Configure Service

**Basic Settings:**
- **Name**: `secure-test-backend` (or any name)
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Branch**: `main`

**Build & Start:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **"Free"**

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

```
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/YOUR_DB_NAME
JWT_SECRET=your-super-secret-jwt-key-change-this
ADMIN_SECRET_KEY=super-secret-admin-key-2024
NODE_ENV=production
```

> ⚠️ **Important:** Replace `MONGO_URI` with your actual MongoDB Atlas connection string!

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Once complete, you'll see: **"Your service is live 🎉"**
4. **Copy your URL**: `https://secure-test-backend.onrender.com`

### Step 6: Test Backend

```bash
curl https://YOUR_BACKEND_URL.onrender.com/api/questions
```

Should return 10 questions in JSON format.

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Update API URL

Create `.env.production` in `frontend/` directory:

```env
VITE_API_URL=https://YOUR_BACKEND_URL.onrender.com/api
```

Replace `YOUR_BACKEND_URL` with your actual Render URL.

### Step 2: Test Build Locally (Optional)

```bash
cd frontend
npm run build
```

Should complete without errors.

### Step 3: Commit Changes

```bash
git add frontend/.env.production
git commit -m "feat: Add production API URL"
git push origin main
```

### Step 4: Create Project on Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Click **"Import"** on your GitHub repository
4. Click **"Import"** again to confirm

### Step 5: Configure Project

**Framework Preset:** Vite  
**Root Directory:** `frontend`

**Build Settings:**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 6: Add Environment Variables

Click **"Environment Variables"** and add:

```
VITE_API_URL=https://YOUR_BACKEND_URL.onrender.com/api
```

### Step 7: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Once complete: **"Congratulations! 🎉"**
4. Click **"Visit"** to see your live app

---

## 🔒 Part 3: Update CORS (Important!)

After deploying frontend, update backend CORS:

1. Go to Render Dashboard → Your Service
2. Go to **"Environment"** tab
3. Add new variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
4. Click **"Save Changes"**
5. Service will auto-redeploy

---

## ✅ Testing Your Deployment

### Test Student Flow

1. Visit your Vercel URL
2. Click **"Enter as Student"**
3. Register a new account
4. Login and start test
5. Complete test
6. View results

### Test Admin Flow

1. Visit your Vercel URL
2. Click **"Admin Dashboard"**
3. Login:
   - Email: `admin@gmail.com`
   - Password: `admin1234`
4. View student attempts
5. Click on an attempt to see events

---

## 🔍 Troubleshooting

### CORS Error

**Symptom:** Console shows CORS policy error

**Solution:**
1. Check `FRONTEND_URL` env variable in Render
2. Restart backend service
3. Clear browser cache

### Environment Variables Not Loading

**Render:**
- Check "Environment" tab
- Ensure no typos in variable names
- Manual redeploy after changes

**Vercel:**
- Go to Settings → Environment Variables
- Ensure `VITE_` prefix for all variables
- Redeploy from Deployments tab

### Render Free Tier Cold Starts

**Note:** Free tier apps sleep after 15 minutes of inactivity.
- First request takes 50+ seconds
- Consider upgrading for production use

### Build Errors

**Frontend:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Backend:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Your URLs

After deployment, save these:

**Backend (Render):**
```
https://YOUR_APP_NAME.onrender.com
```

**Frontend (Vercel):**
```
https://your-app.vercel.app
```

---

## 🎯 Next Steps

1. Update README.md with live demo URLs
2. Test all features thoroughly
3. Create first admin account via API
4. Monitor Render logs for errors
5. Share with users!

---

## 📧 Support

If you encounter issues:
1. Check Render logs: Dashboard → Your Service → Logs
2. Check Vercel logs: Dashboard → Your Project → Deployments → View Function Logs
3. Check browser console for frontend errors

Good luck with your deployment! 🚀
