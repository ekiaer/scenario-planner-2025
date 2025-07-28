#!/bin/bash

echo "🚀 Deploying Scenario Planning App to GitHub for ekiaer"
echo "=================================================="

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git branch -M main
fi

# Add all files
echo "📁 Adding files to Git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy scenario planning application with Vercel config

- AI-powered scenario generation with Claude/OpenAI
- Full-stack React + Express + TypeScript
- PostgreSQL database with Drizzle ORM
- Professional dashboard interface
- Event tracking and probability calculation
- Ready for Vercel deployment"

# Add remote origin (update this URL if needed)
echo "🔗 Setting up GitHub remote..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/ekiaer/scenario-planning-app.git

echo "✅ Ready to push! Run this command to upload to GitHub:"
echo ""
echo "git push -u origin main"
echo ""
echo "Then follow the Vercel deployment steps in DEPLOYMENT_GUIDE.md"
echo ""
echo "🌟 Your app will be live at: https://scenario-planning-app-ekiaer.vercel.app"