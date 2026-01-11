# User Dashboard - Quick Start Guide

## 🚀 Deploy in 5 Minutes

### 1. Deploy Backend (2 minutes)
```bash
cd functions
npm run build
firebase deploy --only functions
```

### 2. Update API URLs (1 minute)
After deployment, copy the function URLs from Firebase Console and update `project/config/api.ts`:
- `USER_LOGIN`
- `VERIFY_USER_TOKEN`
- `REQUEST_USER_ACCESS`
- `GET_USER_ANALYTICS`

### 3. Deploy Frontend (2 minutes)
```bash
cd project
npm run build
npm run deploy
```

---

## 🔑 User Login

### Login URL
```
https://your-domain.com/user-login
```

### Login Methods
1. **Email**: User enters their registered email
2. **URL Slug**: User enters their unique slug (e.g., "john-doe-123")

---

## 📊 Dashboard Features

- ✅ Profile view count with trends
- ✅ Contact save count with trends
- ✅ Conversion rate calculation
- ✅ Interactive activity charts
- ✅ Recent activity feed
- ✅ Profile sharing & QR code

---

## 🧪 Quick Test

1. Create a test user in admin panel
2. Visit `/user-login`
3. Login with user's email or slug
4. View dashboard at `/dashboard`
5. Visit user's public profile to generate views
6. Refresh dashboard to see updated analytics

---

## 📁 New Files Created

### Backend
- `functions/src/handlers/userAuth.ts` - User authentication
- `functions/src/handlers/getUserAnalytics.ts` - Analytics API

### Frontend
- `project/contexts/UserAuthContext.tsx` - User auth context
- `project/pages/user-login.tsx` - Login page
- `project/pages/dashboard.tsx` - Main dashboard
- `project/components/Dashboard/` - Dashboard components

### Configuration
- Updated `functions/src/index.ts`
- Updated `project/config/api.ts`
- Updated `project/types/index.ts`
- Updated `project/pages/_app.tsx`

---

## 🔒 Security

### Firestore Rules (Required!)
```bash
firebase deploy --only firestore:rules
```

Add to `firestore.rules`:
```javascript
// Users can read their own data
match /users/{userId} {
  allow read: if request.auth.uid == userId;
}

// Users can read their own events
match /viewEvents/{eventId} {
  allow read: if resource.data.userId == request.auth.uid;
}
```

---

## 🎯 Key Endpoints

| Endpoint | URL | Method | Purpose |
|----------|-----|--------|---------|
| User Login | `/user-login` | GET | Login page |
| Dashboard | `/dashboard` | GET | User dashboard |
| Admin Login | `/login` | GET | Admin login (existing) |
| Admin Dashboard | `/admin` | GET | Admin panel (existing) |

---

## 💡 Tips

1. **First Time Setup**: Deploy Cloud Functions first, then update API URLs
2. **Testing**: Use admin panel to create test users
3. **Analytics**: Visit public profile pages to generate analytics data
4. **Customization**: Edit dashboard components to match your brand

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "User not found" | Check user has `emailAddress` or `urlSlug` in Firestore |
| No analytics data | Ensure tracking functions are called on public profile |
| CORS errors | Verify Cloud Functions are deployed correctly |
| Can't login | Check user exists and API endpoints are updated |

---

## 📞 Need Help?

1. Check `USER_DASHBOARD_GUIDE.md` for detailed documentation
2. Review Firebase Console logs for errors
3. Check browser console for frontend errors
4. Verify Firestore data structure matches schema

---

## ✨ What's Next?

- Set up email notifications
- Add QR code generation
- Enable profile editing for users
- Add geographic analytics
- Export analytics to CSV/PDF

---

**Happy Deploying! 🎉**




