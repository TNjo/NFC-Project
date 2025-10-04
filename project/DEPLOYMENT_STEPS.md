# 🚀 Deploy Your Next.js Project to Vercel

Your repository: https://github.com/TNjo/NFC-Project.git

## ✅ Preparation Complete!

I've already:
- ✅ Updated `next.config.js` for Vercel optimization
- ✅ Created proper `.gitignore` file
- ✅ Added your GitHub repository as remote
- ✅ Created `vercel.json` configuration

---

## 📋 Next Steps: Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended) 🌐

#### Step 1: Push Your Code to GitHub

Run these commands to push your code:

```powershell
cd "D:\Burjcode\Cloud Functions\project"

# Stage all files
git add .

# Commit
git commit -m "Initial commit - Ready for Vercel"

# Push to GitHub
git push origin main
```

If you encounter authentication issues, you may need to:
- Use a [GitHub Personal Access Token](https://github.com/settings/tokens) instead of password
- Or configure GitHub CLI: `gh auth login`

#### Step 2: Deploy on Vercel

1. **Sign up/Login to Vercel:**
   - Go to https://vercel.com
   - Click **"Sign Up"** and choose **"Continue with GitHub"**
   - Authorize Vercel to access your GitHub account

2. **Import Your Project:**
   - Click **"Add New..."** button (top right)
   - Select **"Project"**
   - Click **"Import Git Repository"**
   - Find and select `TNjo/NFC-Project`
   - Click **"Import"**

3. **Configure Project Settings:**
   
   Vercel will auto-detect Next.js, but verify:
   
   - **Framework Preset**: Next.js ✓ (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Environment Variables (Optional for now):**
   
   Your Firebase config is currently hardcoded, so you can skip this step initially.
   
   If you want to use environment variables later:
   - Click **"Environment Variables"**
   - Add each variable from `.env.example`:
     - `NEXT_PUBLIC_FIREBASE_API_KEY`
     - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
     - etc.

5. **Deploy:**
   - Click **"Deploy"** button
   - Wait 2-3 minutes for build to complete
   - You'll get a live URL like: `nfc-project.vercel.app`

---

### Option 2: Deploy via Vercel CLI ⚡ (Faster)

#### Step 1: Install Vercel CLI

```powershell
npm install -g vercel
```

#### Step 2: Login to Vercel

```powershell
vercel login
```

Follow the prompts to authenticate (email verification).

#### Step 3: Deploy

```powershell
cd "D:\Burjcode\Cloud Functions\project"

# First deployment (interactive)
vercel
```

You'll be asked:
- **Set up and deploy?** → Press `Y`
- **Which scope?** → Select your account
- **Link to existing project?** → Press `N` (first time)
- **What's your project's name?** → `nfc-project` (or your choice)
- **In which directory is your code located?** → `./`
- **Want to override the settings?** → Press `N`

#### Step 4: Deploy to Production

```powershell
vercel --prod
```

Your site will be live at the URL shown in the terminal!

---

## 🎯 Post-Deployment Checklist

### 1. Test Your Deployment

Visit your Vercel URL and test:
- ✓ Homepage loads correctly
- ✓ Firebase authentication works
- ✓ Cloud Functions API calls succeed
- ✓ All pages navigate properly

### 2. Custom Domain (Optional)

To add a custom domain:

1. In Vercel Dashboard → Your Project
2. Go to **Settings** → **Domains**
3. Click **"Add"**
4. Enter your domain (e.g., `mycards.com`)
5. Follow DNS configuration instructions
6. Wait for DNS propagation (5-60 minutes)

### 3. Configure Firebase (If Needed)

If you see CORS or authentication errors:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `burjcode-profile-dev`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domain(s):
   - `nfc-project.vercel.app`
   - `nfc-project-*.vercel.app` (for preview deployments)
   - Your custom domain (if applicable)

---

## 🔄 Automatic Deployments

Once connected to GitHub, Vercel will automatically:

- **Push to `main` branch** → Deploy to Production 🚀
- **Open a Pull Request** → Create Preview Deployment 👀
- **Push to any branch** → Create Development Deployment 🛠️

Every deployment gets its own unique URL!

---

## 📊 Monitor Your Deployment

### Vercel Dashboard Features:

1. **Deployments Tab**: View all deployment history
2. **Analytics**: Track page views and performance
3. **Logs**: Debug runtime errors
4. **Functions**: Monitor API routes (if you add any)
5. **Speed Insights**: Analyze Core Web Vitals

---

## 🐛 Troubleshooting

### Build Fails

**Check the build logs in Vercel Dashboard:**

Common issues:
```
❌ TypeScript errors → Fix type issues in your code
❌ Missing dependencies → Check package.json
❌ Import errors → Verify all imports are correct
```

### 404 Errors on Routes

- Ensure `pages/` directory structure is correct
- Dynamic routes need `[paramName].tsx` format
- Check `next.config.js` for conflicting settings

### Firebase Connection Issues

1. Verify Firebase config in `config/firebase.ts`
2. Check authorized domains in Firebase Console
3. Ensure API keys are accessible (use `NEXT_PUBLIC_` prefix)

### Build is Slow

- First deployment takes longer (2-5 minutes)
- Subsequent deploys are faster (30 seconds - 2 minutes)
- Vercel caches dependencies

---

## 🎉 Success Indicators

You'll know deployment succeeded when:

✅ Vercel shows **"Building"** → **"Deployment Ready"**
✅ You can access your site at the Vercel URL
✅ All pages load without errors
✅ Firebase authentication works
✅ Cloud Functions respond correctly

---

## 📱 Share Your Project

Your production URL will be:
```
https://nfc-project.vercel.app
```

Or with custom domain:
```
https://yourdomain.com
```

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Next.js on Vercel**: https://vercel.com/docs/frameworks/nextjs
- **Vercel Support**: https://vercel.com/support
- **Community Discord**: https://vercel.com/discord

---

## 🚀 Ready to Deploy!

**Quick Command Summary:**

```powershell
# Navigate to project
cd "D:\Burjcode\Cloud Functions\project"

# Add & commit changes
git add .
git commit -m "Initial commit - Ready for Vercel"

# Push to GitHub
git push origin main

# OR use Vercel CLI
npm install -g vercel
vercel login
vercel
vercel --prod
```

---

**Your Next.js project is ready for deployment! Choose your preferred method above and let's go live! 🎊**

