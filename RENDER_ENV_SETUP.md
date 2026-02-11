# 🎯 Add This to Render Environment Variables

After pushing the updated code, add this environment variable to your Render backend:

## Steps:

1. Go to **https://render.com/dashboard**
2. Click on your **`secure-test-backend`** service
3. Go to **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add:

**Key:**
```
FRONTEND_URL
```

**Value:**
```
https://secure-test-environment-three.vercel.app
```

6. Click **"Save Changes"**
7. Render will **automatically redeploy** (takes 5-10 minutes)

---

## Why This is Better:

✅ **Flexible**: Can change frontend URL without touching code  
✅ **Secure**: No hardcoded URLs in repository  
✅ **Best Practice**: Follows 12-factor app methodology  
✅ **Multiple Environments**: Easy to add staging/preview URLs

---

## Current Environment Variables on Render:

You should have these set:

```
PORT=5000
MONGO_URI=mongodb+srv://...
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ADMIN_SECRET_KEY=super-secret-admin-key-2024
FRONTEND_URL=https://secure-test-environment-three.vercel.app
```

---

Once you add this and Render redeploys, your app will be fully functional! 🎉
