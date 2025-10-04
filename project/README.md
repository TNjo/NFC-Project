# NFC Digital Profile - Next.js Application

A modern digital profile card system built with Next.js, Firebase, and Tailwind CSS.

## 🚀 Quick Deploy to Vercel

### Method 1: Vercel Dashboard (Easiest)

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Deploy:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New..." → "Project"
   - Import: `TNjo/NFC-Project`
   - Click "Deploy"

### Method 2: Vercel CLI (Fastest)

```bash
npm install -g vercel
vercel login
vercel --prod
```

📖 **See [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md) for detailed instructions**

---

## 📦 Tech Stack

- **Framework**: Next.js 15.5.3
- **Auth**: Firebase Authentication
- **Database**: Firebase Firestore (via Cloud Functions)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Hosting**: Vercel

---

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
project/
├── pages/              # Next.js pages
│   ├── _app.tsx       # App wrapper
│   ├── _document.tsx  # HTML document
│   ├── index.tsx      # Homepage
│   ├── login.tsx      # Login page
│   ├── profile.tsx    # User profile
│   ├── admin/         # Admin pages
│   └── card/          # Dynamic card pages
├── components/        # React components
├── config/           # Configuration files
│   ├── api.ts        # API endpoints
│   └── firebase.ts   # Firebase config
├── contexts/         # React contexts
├── styles/          # Global styles
├── types/           # TypeScript types
└── utils/           # Utility functions
```

---

## 🔐 Environment Variables

Currently, Firebase configuration is hardcoded in `config/firebase.ts`.

For better security, you can use environment variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## 🌐 API Endpoints

Cloud Functions are configured in `config/api.ts`:

- User Management (Add, Update, Delete)
- URL Generation
- Analytics Tracking
- Admin Authentication

---

## 📄 License

Private - Burjcode

---

## 🆘 Support

For deployment help, see [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md)

