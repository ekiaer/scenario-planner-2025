# Vercel Deployment Guide for ekiaer

## Step 1: Push Code to GitHub

1. Create a new repository on GitHub:
   - Go to https://github.com/ekiaer
   - Click "New repository"
   - Name it: `scenario-planning-app`
   - Make it public or private (your choice)
   - Don't initialize with README (we already have one)

2. Push your code from Replit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Scenario Planning Application"
   git branch -M main
   git remote add origin https://github.com/ekiaer/scenario-planning-app.git
   git push -u origin main
   ```

## Step 2: Set Up Database (Neon - Free Tier)

1. Go to https://neon.tech
2. Sign up with your GitHub account (@ekiaer)
3. Create a new project:
   - Project name: `scenario-planning`
   - Region: Choose closest to your users
4. Copy the connection string (DATABASE_URL)

## Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Sign up with your GitHub account (@ekiaer)
3. Click "New Project"
4. Import `ekiaer/scenario-planning-app`
5. Configure project:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm ci`

## Step 4: Add Environment Variables in Vercel

In your Vercel project dashboard:
1. Go to "Settings" → "Environment Variables"
2. Add these variables:
   - `DATABASE_URL` = (your Neon connection string)
   - `ANTHROPIC_API_KEY` = (your Claude API key)
   - `NODE_ENV` = `production`

## Step 5: Initialize Database

After first deployment:
1. In Vercel dashboard, go to "Functions" tab
2. Or run locally: `npm run db:push` (with your DATABASE_URL)

## Step 6: Test Your Live Application

Your app will be available at: `https://scenario-planning-app-ekiaer.vercel.app`

## Automatic Updates

Every time you push to the `main` branch, Vercel will automatically:
- Build your application
- Deploy to production
- Update your live site

## Custom Domain (Optional)

In Vercel dashboard:
1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions

## Monitoring & Analytics

Vercel provides built-in:
- Performance monitoring
- Error tracking
- Usage analytics
- Function logs

Your scenario planning application will be live and globally accessible!