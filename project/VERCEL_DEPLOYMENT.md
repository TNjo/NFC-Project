# Deploying to Vercel

This guide will help you deploy your Next.js project to Vercel.

## Prerequisites

1. A [GitHub](https://github.com) account (or GitLab/Bitbucket)
2. A [Vercel](https://vercel.com) account (sign up with GitHub for easier integration)
3. Your project code pushed to a Git repository

## Deployment Methods

### Method 1: Deploy via Vercel Dashboard (Recommended for First Time)

#### Step 1: Push Your Code to GitHub

If you haven't already, initialize a Git repository and push to GitHub:

```bash
# Navigate to your project directory
cd "D:\Burjcode\Cloud Functions\project"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit for Vercel deployment"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

#### Step 2: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `project` (or leave as `.` if deploying from project folder)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

#### Step 3: Configure Environment Variables (Optional)

Since your Firebase config is currently hardcoded, you don't need to add environment variables immediately. However, for better security in the future:

1. In Vercel Dashboard, go to **Settings** → **Environment Variables**
2. Add these variables (from `.env.example`):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

3. Select which environments to apply them to (Production, Preview, Development)

#### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your app
3. You'll get a live URL like: `your-project-name.vercel.app`

### Method 2: Deploy via Vercel CLI

#### Install Vercel CLI

```bash
npm i -g vercel
```

#### Login to Vercel

```bash
vercel login
```

#### Deploy from Project Directory

```bash
cd "D:\Burjcode\Cloud Functions\project"
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N** (first time) or **Y** (subsequent deploys)
- What's your project's name? Enter a name
- In which directory is your code located? `./`

#### Deploy to Production

```bash
vercel --prod
```

## Post-Deployment

### Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Domains**
3. Add your custom domain
4. Update your domain's DNS records as instructed by Vercel

### Environment-Specific Settings

Your current setup uses:
- **Firebase Authentication**: Already configured ✅
- **Cloud Functions URLs**: Hardcoded in `config/api.ts` ✅

These will work immediately on Vercel without additional configuration.

## Automatic Deployments

Once connected to GitHub:
- **Every push to main branch** → Deploys to production
- **Every pull request** → Creates a preview deployment
- **Every branch push** → Creates a development deployment

## Troubleshooting

### Build Failures

Check the build logs in Vercel Dashboard. Common issues:
- **TypeScript errors**: Fix in your code
- **Missing dependencies**: Ensure `package.json` is complete
- **Environment variables**: Check they're set correctly

### 404 Errors

- Ensure dynamic routes use proper Next.js conventions
- Check that all page files are in the `pages/` directory
- Verify `next.config.js` doesn't have conflicting settings

### API/Firebase Issues

- Check that Firebase API keys are accessible (NEXT_PUBLIC_ prefix required)
- Verify Cloud Functions URLs are correct in `config/api.ts`
- Ensure Firebase project allows your Vercel domain

## Benefits of Vercel vs Firebase Hosting

✅ **Native Next.js support** (Vercel created Next.js)
✅ **Automatic preview deployments** for pull requests
✅ **Edge functions** for API routes
✅ **Better performance** with global CDN
✅ **Automatic HTTPS** with custom domains
✅ **Built-in analytics** and monitoring
✅ **Zero configuration** for most Next.js features

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Support](https://vercel.com/support)

---

**Your project is now ready for Vercel deployment! 🚀**

