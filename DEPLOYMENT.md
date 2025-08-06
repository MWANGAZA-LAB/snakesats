# 🚀 GitHub Pages Deployment Guide

This guide will walk you through deploying SnakeSats to GitHub Pages.

## 📋 Prerequisites

- A GitHub account
- Git installed on your computer
- Basic knowledge of Git commands

## 🎯 Step-by-Step Deployment

### 1. Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository: `snakesats`
5. Make it **Public** (required for free GitHub Pages)
6. Don't initialize with README (we already have one)
7. Click "Create repository"

### 2. Update Repository URLs

Before pushing, update the URLs in these files with your actual GitHub username:

**In `package.json`:**
```json
{
  "repository": {
    "url": "https://github.com/YOUR_USERNAME/snakesats.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/snakesats/issues"
  },
  "homepage": "https://YOUR_USERNAME.github.io/snakesats"
}
```

**In `index.html`:**
```html
<meta property="og:url" content="https://YOUR_USERNAME.github.io/snakesats">
<meta property="og:image" content="https://YOUR_USERNAME.github.io/snakesats/og-image.png">
<meta name="twitter:image" content="https://YOUR_USERNAME.github.io/snakesats/og-image.png">
```

### 3. Initialize Git and Push to GitHub

Open your terminal/command prompt in the project directory and run:

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: SnakeSats Bitcoin education game"

# Add GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/snakesats.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 4. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section (in the left sidebar)
4. Under "Source", select "Deploy from a branch"
5. Choose "gh-pages" branch
6. Click "Save"

### 5. Automatic Deployment

The GitHub Actions workflow will automatically:
- Build and deploy your site when you push to main/master branch
- Create a `gh-pages` branch with your site files
- Deploy to `https://YOUR_USERNAME.github.io/snakesats`

## 🔧 Manual Deployment (Alternative)

If you prefer manual deployment:

1. Go to repository Settings → Pages
2. Under "Source", select "Deploy from a branch"
3. Choose "main" or "master" branch
4. Select "/ (root)" folder
5. Click "Save"

## 🌐 Custom Domain (Optional)

To use a custom domain:

1. In repository Settings → Pages
2. Enter your domain in "Custom domain" field
3. Click "Save"
4. Add a `CNAME` file to your repository with your domain name
5. Configure DNS with your domain provider

## 📱 Testing Your Deployment

1. Wait 5-10 minutes for deployment to complete
2. Visit `https://YOUR_USERNAME.github.io/snakesats`
3. Test the game functionality
4. Check mobile responsiveness

## 🔄 Updating Your Site

To update your deployed site:

```bash
# Make your changes
# Then commit and push
git add .
git commit -m "Update game features"
git push origin main
```

The GitHub Actions workflow will automatically redeploy your site.

## 🐛 Troubleshooting

### Site Not Loading
- Check if the repository is public
- Verify GitHub Pages is enabled in Settings
- Wait 10-15 minutes for initial deployment

### Game Not Working
- Check browser console for JavaScript errors
- Ensure all files are committed and pushed
- Test locally first with `python -m http.server 8000`

### Custom Domain Issues
- Verify DNS settings with your provider
- Check if CNAME file is in the repository root
- Wait up to 24 hours for DNS propagation

## 📊 Analytics (Optional)

To add Google Analytics:

1. Get your Google Analytics tracking ID
2. Add this to the `<head>` section of `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🎉 Success!

Your SnakeSats game is now live at:
`https://YOUR_USERNAME.github.io/snakesats`

Share it with the Bitcoin community and help educate people about proper investment practices! 🚀 