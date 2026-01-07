# 🔧 Vercel Environment Variables Setup

## ❌ Current Error: Login failed (500)

The 500 error is caused by **missing or incorrect Supabase environment variables** in Vercel.

## ✅ Required Environment Variables

Go to your Vercel Dashboard → Project → Settings → Environment Variables and add these:

### 1. Supabase Configuration (REQUIRED)
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
USE_SUPABASE=true
```

**Where to find these:**
1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on **Settings** → **API**
3. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

### 2. JWT Secret (REQUIRED)
```env
JWT_SECRET=your-random-secret-string-here-min-32-chars
```

**Generate a secure JWT secret:**
```bash
# Option 1: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Use OpenSSL
openssl rand -hex 32

# Option 3: Use an online generator
# https://generate-secret.vercel.app/32
```

### 3. Node Environment (Optional but Recommended)
```env
NODE_ENV=production
```

### 4. Python Service (Optional - only if deploying separately)
```env
PYTORCH_SERVICE_URL=https://your-pytorch-service-url.com
```

## 📝 Steps to Fix

1. **Go to Vercel Dashboard:**
   - Navigate to: https://vercel.com/dashboard
   - Select your project: **pashu-vision**

2. **Add Environment Variables:**
   - Click **Settings** → **Environment Variables**
   - Add each variable above
   - **Important:** Select **Production**, **Preview**, and **Development** environments

3. **Redeploy:**
   - After adding variables, go to **Deployments**
   - Click the **⋮** (three dots) on the latest deployment
   - Click **Redeploy**
   - Or trigger a new deployment by pushing to GitHub

## 🔍 Verify Environment Variables

After redeploying, you can verify the variables are set:
1. Go to Vercel Dashboard → Deployments
2. Click on the latest deployment
3. Check the build logs - you should see: `✅ Connected to Supabase database`

## ⚠️ Common Issues

### Issue 1: "Supabase credentials are required"
- **Cause:** Missing `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY`
- **Fix:** Add both variables in Vercel

### Issue 2: "Invalid API key"
- **Cause:** Wrong key copied (e.g., copied anon key instead of service_role)
- **Fix:** Double-check you're using the correct keys

### Issue 3: "Database connection failed"
- **Cause:** Supabase project is paused or deleted
- **Fix:** Check Supabase dashboard to ensure project is active

### Issue 4: Still getting 500 error after adding variables
- **Cause:** Need to redeploy after adding variables
- **Fix:** Redeploy the application in Vercel

## 🧪 Test After Setup

1. Go to: `https://pashu-vision.vercel.app/api/test`
   - Should return: `{"message":"Server is working!"}`

2. Try login again at: `https://pashu-vision.vercel.app/login`
   - Should work if environment variables are correct

## 📞 Need Help?

If you still get errors after setting up environment variables:
1. Check Vercel deployment logs for specific error messages
2. Verify Supabase project is active and accessible
3. Ensure all required environment variables are set for **all environments** (Production, Preview, Development)

