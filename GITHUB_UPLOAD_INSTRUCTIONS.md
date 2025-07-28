# GitHub Upload Instructions for ekiaer

## Method 1: Using GitHub Web Interface (Easiest)

### Step 1: Create Repository
1. Go to https://github.com/ekiaer
2. Click "New repository"
3. Name: `scenario-planning-app`
4. Description: `AI-powered scenario planning application`
5. Public repository
6. Don't add README (we have one)
7. Click "Create repository"

### Step 2: Upload Files
1. In your new empty repository, click "uploading an existing file"
2. Drag and drop these files from your Replit project:

**Essential Files to Upload:**
- `client/` (entire folder)
- `server/` (entire folder) 
- `shared/` (entire folder)
- `.github/` (entire folder)
- `components.json`
- `drizzle.config.ts`
- `package.json`
- `postcss.config.js`
- `tailwind.config.ts`
- `tsconfig.json`
- `vite.config.ts`
- `vercel.json`
- `README.md`
- `DEPLOYMENT_GUIDE.md`
- `.env.example`
- `.gitignore`
- `Dockerfile`
- `replit.md`

3. Commit message: "Initial commit - AI scenario planning app"
4. Click "Commit changes"

## Method 2: Using GitHub CLI (Alternative)

If you have GitHub CLI installed locally:
```bash
gh repo create scenario-planning-app --public
# Then upload your files
```

## Method 3: Download and Upload Locally

1. Download your project files from Replit
2. Extract to local folder
3. Initialize git locally:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ekiaer/scenario-planning-app.git
   git push -u origin main
   ```

## After Upload: Deploy to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Select `ekiaer/scenario-planning-app`
5. Vercel will auto-detect settings
6. Add environment variables:
   - `DATABASE_URL`
   - `ANTHROPIC_API_KEY`
7. Deploy!

Your app will be live at: `https://scenario-planning-app-ekiaer.vercel.app`