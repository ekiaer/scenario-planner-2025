# Manual GitHub Setup Guide

## Method 1: Copy-Paste Individual Files

### Step 1: Create GitHub Repository
1. Go to https://github.com/ekiaer
2. Click "New repository"
3. Name: `scenario-planning-app`
4. Public, no README
5. Click "Create repository"

### Step 2: Create Files Manually

In your GitHub repository, click "Create new file" for each:

#### Key Files to Create:

**1. package.json**
- Click "Create new file"
- Name: `package.json`
- Copy content from your Replit package.json file

**2. README.md**  
- Create new file: `README.md`
- Copy from your Replit README.md

**3. vercel.json**
- Create new file: `vercel.json`
- Copy from your Replit vercel.json

**4. Folders** (create with initial file, then add more):
- `client/src/App.tsx` (copy from Replit)
- `server/index.ts` (copy from Replit)  
- `shared/schema.ts` (copy from Replit)

### Step 3: Alternative - GitHub CLI
If you have Git installed locally:
```bash
# Create local folder
mkdir scenario-planning-app
cd scenario-planning-app

# Copy files from Replit (download first)
# Initialize and push
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ekiaer/scenario-planning-app.git
git push -u origin main
```

## Method 2: Use GitHub Codespaces

1. Create empty repository on GitHub
2. Click "Code" → "Codespaces" → "Create codespace"  
3. This gives you a VS Code environment
4. Upload files directly or copy-paste code

## After Setup: Deploy to Vercel

1. Go to vercel.com
2. Import your GitHub repository
3. Add environment variables
4. Deploy!