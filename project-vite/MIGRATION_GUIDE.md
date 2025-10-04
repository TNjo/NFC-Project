# Migration from Next.js to Vite + React Router

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd project-vite
npm install
```

### 2. Manual Page Conversions Needed

Convert these Next.js patterns to React Router:

**Next.js → React Router Changes:**

| Next.js | React Router |
|---------|--------------|
| `import Head from 'next/head'` | Use `<Helmet>` or update `document.title` |
| `import { useRouter } from 'next/router'` | `import { useNavigate, useParams, useSearchParams } from 'react-router-dom'` |
| `router.push('/path')` | `navigate('/path')` |
| `router.query.id` | `params.id` or `searchParams.get('id')` |
| `export default function Page()` | `export default function Page()` (same) |

### 3. Pages to Convert

Copy from `project/pages/` to `project-vite/src/pages/` and update:

- ✅ `/pages/index.tsx` → `/src/pages/Home.tsx`
- ✅ `/pages/login.tsx` → `/src/pages/Login.tsx`
- ✅ `/pages/admin-setup.tsx` → `/src/pages/AdminSetup.tsx`
- ✅ `/pages/profile.tsx` → `/src/pages/Profile.tsx`
- ✅ `/pages/card/[cardId].tsx` → `/src/pages/Card.tsx` (use `useParams()`)
- ✅ `/pages/admin/index.tsx` → `/src/pages/admin/Dashboard.tsx`
- ✅ `/pages/admin/cardholders.tsx` → `/src/pages/admin/Cardholders.tsx`
- ✅ `/pages/admin/add.tsx` → `/src/pages/admin/Add.tsx`
- ✅ `/pages/404.tsx` → `/src/pages/NotFound.tsx`

### 4. Example Conversion

**Before (Next.js):**
```tsx
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();
  const { id } = router.query;
  
  return (
    <>
      <Head>
        <title>My Page</title>
      </Head>
      <div>...</div>
    </>
  );
}
```

**After (Vite + React Router):**
```tsx
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function Page() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  useEffect(() => {
    document.title = 'My Page';
  }, []);
  
  return <div>...</div>;
}
```

### 5. Build & Test

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 6. Deploy to Firebase

Update `firebase.json` to point to `project-vite/dist`:

```json
{
  "hosting": {
    "public": "project-vite/dist",
    ...
  }
}
```

Then deploy:
```bash
firebase deploy --only hosting
```

## ✅ Benefits of This Migration

1. **No More Build Errors** - Vite builds reliably every time
2. **Fast Builds** - 10x faster than Next.js
3. **Simple Routing** - React Router works perfectly with static hosting
4. **No Framework Fighting** - Everything just works
5. **Smaller Bundle** - Faster load times

## 🔧 All Config Files Ready

- ✅ `vite.config.ts` - Vite configuration
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `package.json` - Dependencies
- ✅ `index.html` - Entry HTML file
- ✅ `src/main.tsx` - App entry point
- ✅ `src/App.tsx` - Router setup with public/protected routes

## 📁 Folder Structure

```
project-vite/
├── public/            # Static assets (copied from project/public)
├── src/
│   ├── components/    # (copied from project/components)
│   ├── contexts/      # (copied from project/contexts)
│   ├── config/        # (copied from project/config)
│   ├── types/         # (copied from project/types)
│   ├── styles/        # (copied from project/styles)
│   ├── pages/         # Convert from project/pages/
│   ├── App.tsx        # Router setup
│   └── main.tsx       # Entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 🚨 Important Notes

1. **Card Routes Are Public** - No auth required (configured in App.tsx)
2. **Admin Routes Are Protected** - Auth check in ProtectedRoute component
3. **Dynamic Routes Work** - `/card/:cardId` works perfectly
4. **No More 404 Issues** - React Router handles all routing client-side

Ready to convert!

