# Railway Quick Start Guide - Python Service

## Step-by-Step Instructions

### 1️⃣ First Time Setup - Create Workspace

**If you see error: "You must specify a workspaceId to create a project"**

1. Go to [railway.app](https://railway.app) and **Login/Sign up**
2. Click **"New Workspace"** button
3. Enter workspace name (e.g., "PashuVision")
4. Select **"Hobby" plan** (Free tier)
5. Click **"Create Workspace"**

✅ **Now you can create projects!**

---

### 2️⃣ Create New Project

1. On Railway dashboard, click **"New Project"** (green button, top right)
2. Select **"Deploy from GitHub repo"**
3. **Authorize Railway** to access GitHub (if first time)
4. Find and click on your repository: `-PashuVision`

---

### 3️⃣ Configure Service

1. Railway will create a service automatically
2. Click on the service name
3. Go to **"Settings"** tab
4. Scroll to **"Root Directory"** section
5. Set Root Directory to: `backend/models`
6. Scroll to **"Start Command"** section  
7. Set Start Command to: `python pytorch_service.py`
8. Click **"Save"** or changes save automatically

---

### 4️⃣ Get Service URL

1. Still in **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"** button
4. Copy the generated URL (e.g., `https://pytorch-service-production.up.railway.app`)
5. **Save this URL** - you'll need it!

---

### 5️⃣ Test Service

1. Open the URL in browser: `https://your-url.up.railway.app/health`
2. You should see:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cpu"
}
```

✅ **Service is working!**

---

### 6️⃣ Configure Vercel

1. Go to [vercel.com](https://vercel.com) → Your Project
2. Click **"Settings"** tab
3. Click **"Environment Variables"** (left sidebar)
4. Click **"Add New"**
5. Enter:
   - **Key:** `PYTORCH_SERVICE_URL`
   - **Value:** Your Railway URL (from step 4)
   - **Environment:** Check "Production" (and Preview if you want)
6. Click **"Save"**

---

### 7️⃣ Redeploy Vercel

1. Go to **"Deployments"** tab in Vercel
2. Click **"..."** (three dots) on latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

✅ **Done! Predictions should work now!**

---

## Common Issues

### ❌ "workspaceId must be specified"
**Fix:** Create a workspace first (see Step 1 above)

### ❌ Build fails - "Module not found"
**Fix:** Check that `requirements.txt` exists in `backend/models/` folder

### ❌ Service URL not accessible
**Fix:** Make sure you clicked "Generate Domain" in Settings → Networking

### ❌ Model not loading
**Fix:** Ensure `best_model_convnext_base_acc0.7007.pth` exists in `backend/models/` folder (upload it if needed)

---

## Need Help?

Check the detailed guide: `DEPLOY_PYTHON_SERVICE.md`

