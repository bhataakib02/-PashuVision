# 🚨 FIX RAILWAY NOW - Step by Step

## The Problem
Railway is STILL detecting Node.js instead of Python because Root Directory is not set.

## SOLUTION: Use Railway CLI (100% Guaranteed)

### Step 1: Open PowerShell

Open a **NEW** PowerShell window (important - restart it if needed)

### Step 2: Install Railway CLI (if not done)

```powershell
npm install -g @railway/cli
```

### Step 3: Login

```powershell
railway login
```

A browser will open - click "Authorize Railway CLI"

### Step 4: Navigate to Project

```powershell
cd D:\bpa-breed-recognition
```

### Step 5: Link to Your Service

```powershell
railway link
```

Select:
1. Your workspace (probably "vivacious-flow")
2. Your service: "-PashuVision" or "distinguished-optimism"

### Step 6: Set Root Directory (CRITICAL!)

```powershell
railway variables set RAILWAY_ROOT_DIRECTORY=backend/models
```

**VERIFY it worked:**
```powershell
railway variables
```

You should see: `RAILWAY_ROOT_DIRECTORY=backend/models`

### Step 7: Set Start Command

```powershell
railway variables set RAILWAY_START_COMMAND="python pytorch_service.py"
```

**VERIFY:**
```powershell
railway variables
```

You should see both variables.

### Step 8: Deploy

```powershell
railway up
```

This will deploy. Watch the logs - you should see:
- ✅ Python packages (`pip install`)
- ✅ NOT Node.js (`npm install`)

---

## Verify in Railway Dashboard

1. Go to Railway dashboard
2. Click your service → **Variables** tab
3. You should see:
   - `RAILWAY_ROOT_DIRECTORY = backend/models`
   - `RAILWAY_START_COMMAND = python pytorch_service.py`

If these are there, the next deployment will work!

---

## Alternative: Delete Service and Start Fresh

If CLI doesn't work, delete and recreate:

1. **In Railway dashboard:**
   - Go to Settings tab
   - Scroll to bottom
   - Click **"Delete service"**
   - Confirm deletion

2. **Create new service:**
   - Click **"+ New"** → **"GitHub Repo"**
   - Select your repo

3. **IMMEDIATELY** (before build starts):
   - Click **"Settings"** tab
   - Look for **"Root Directory"** field
   - If you see it, set to: `backend/models`
   - If you DON'T see it, use CLI method above

---

## Still Not Working?

If Railway still shows Node.js after setting variables:

1. **Check variables are set:**
   ```powershell
   railway variables
   ```

2. **Force redeploy:**
   ```powershell
   railway up --detach
   ```

3. **Check logs:**
   ```powershell
   railway logs
   ```

If you see `npm install` in logs, variables aren't being applied. Try deleting service and recreating.

