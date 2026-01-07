# Railway CLI Setup - Step by Step

## Install Railway CLI

### On Windows (PowerShell):

1. **Open PowerShell** (as Administrator if possible)
2. **Install Railway CLI:**
   ```powershell
   npm install -g @railway/cli
   ```
   
   If you get permission errors, try:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   npm install -g @railway/cli
   ```

3. **Verify installation:**
   ```powershell
   railway --version
   ```
   You should see a version number like `v3.x.x`

---

## Login to Railway

1. **Login to Railway:**
   ```powershell
   railway login
   ```
   This will open your browser and ask you to authorize Railway CLI

2. **Follow the browser prompts:**
   - Click "Authorize Railway CLI"
   - You should see a success message

---

## Link to Your Project

1. **Navigate to your project directory:**
   ```powershell
   cd D:\bpa-breed-recognition
   ```

2. **Link to your Railway project:**
   ```powershell
   railway link
   ```
   
   You'll see a list of projects. Select your project (it will show as something like "vivacious-flow" or similar)

   If you have multiple workspaces, you'll first select workspace, then project.

---

## Configure Root Directory and Start Command

1. **Set Root Directory (THIS IS THE KEY!):**
   ```powershell
   railway variables set RAILWAY_ROOT_DIRECTORY=backend/models
   ```

2. **Set Start Command:**
   ```powershell
   railway variables set RAILWAY_START_COMMAND="python pytorch_service.py"
   ```

3. **Verify variables are set:**
   ```powershell
   railway variables
   ```
   
   You should see:
   - `RAILWAY_ROOT_DIRECTORY=backend/models`
   - `RAILWAY_START_COMMAND=python pytorch_service.py`

---

## Deploy

1. **Deploy to Railway:**
   ```powershell
   railway up
   ```
   
   This will:
   - Upload your code
   - Build the service using the root directory you set
   - Deploy it to Railway

2. **Watch the logs:**
   ```powershell
   railway logs
   ```
   
   You should see:
   - Python being detected
   - `pip install -r requirements.txt`
   - `python pytorch_service.py` starting
   - Model loading messages

---

## Get Your Service URL

1. **Open Railway dashboard** in browser
2. Go to your service → **Settings** tab
3. Scroll to **Networking** section
4. Click **"Generate Domain"** if not already generated
5. Copy the URL (e.g., `https://pytorch-service-production.up.railway.app`)

---

## Test Service

1. **Test health endpoint:**
   ```powershell
   curl https://your-service-url.up.railway.app/health
   ```
   
   Or open in browser: `https://your-service-url.up.railway.app/health`
   
   You should see:
   ```json
   {
     "status": "healthy",
     "model_loaded": true,
     "device": "cpu"
   }
   ```

---

## Troubleshooting

### Error: "railway: command not found"
- Make sure npm is installed: `npm --version`
- Try restarting PowerShell after installing Railway CLI
- Check if npm global bin is in your PATH

### Error: "Not logged in"
- Run `railway login` again
- Make sure browser authorization completed

### Error: "No project linked"
- Make sure you're in the project directory: `cd D:\bpa-breed-recognition`
- Run `railway link` and select your project

### Build still shows Node.js errors
- Verify variables are set: `railway variables`
- Make sure `RAILWAY_ROOT_DIRECTORY=backend/models` is there
- Try deleting and recreating: `railway service delete` then `railway up`

---

## Next Steps After Deployment

Once your service is deployed:

1. **Get the service URL** from Railway dashboard
2. **Configure Vercel:**
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Add: `PYTORCH_SERVICE_URL` = Your Railway service URL
3. **Redeploy Vercel**
4. **Test predictions** on your app!

