# Google OAuth Authentication System - Setup & Usage Guide

## Overview

This system replaces the old email/URL login with a secure Google OAuth-based authentication system where:

1. **Admin creates user profiles** in the admin dashboard
2. **Admin generates registration link** for each user
3. **User registers** with their Google account using the link
4. **User logs in** with Google thereafter

---

## 🔧 Setup Instructions

### 1. Enable Google Sign-In in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `burjcode-profile-dev`
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Click **Enable**
6. Add your **Project public-facing name** (e.g., "NFC Digital Profile")
7. Add **Project support email** (use your admin email)
8. Click **Save**

### 2. Deploy Cloud Functions

Deploy the new Google OAuth Cloud Functions:

```bash
cd "d:\Burjcode\Cloud Functions\functions"
firebase deploy --only functions:registerGoogleUserFn,functions:googleUserLoginFn
```

This will deploy:
- `registerGoogleUserFn` - Handles user registration with Google
- `googleUserLoginFn` - Handles user login with Google

### 3. Update Function URLs (if needed)

After deployment, if the URLs changed, update them in:

**File:** `project/config/api.ts`

```typescript
export const API_ENDPOINTS = {
  // ... other endpoints ...
  
  // Google OAuth Functions
  REGISTER_GOOGLE_USER: 'https://registergoogleuserfn-uupdjznjhq-uc.a.run.app',
  GOOGLE_USER_LOGIN: 'https://googleuserloginfn-uupdjznjhq-uc.a.run.app',
}
```

Replace with your actual deployed function URLs.

---

## 📋 How It Works

### For Administrators

#### 1. Create User Profile

1. Login to admin dashboard at `/login`
2. Navigate to **Cardholders** section
3. Click **Add New** to create a new cardholder profile
4. Fill in all user details (name, email, phone, etc.)
5. Save the profile

#### 2. Generate & Send Registration Link

1. In the **Cardholders** list, find the user
2. Click the **🔗 Link** icon (purple) to copy registration link
3. Send this link to the user via email, WhatsApp, or any preferred method

**Registration Link Format:**
```
https://yourapp.com/register?userId=ABC123&slug=john-doe-abc123
```

### For Users

#### 1. Registration (One-Time)

1. Click the registration link received from admin
2. Review your profile information displayed
3. Click **"Continue with Google"**
4. Select your Google account
5. Account is linked successfully!
6. Automatically redirected to login page

#### 2. Login (Subsequent Access)

1. Go to `/user-login`
2. Click **"Sign in with Google"**
3. Select the same Google account used for registration
4. Access your dashboard

---

## 🔐 Security Features

### Authentication Flow

1. **Registration Phase:**
   - User must have valid registration link with `userId` and `slug`
   - System verifies link validity
   - Firebase verifies Google ID token
   - Google UID is linked to existing user profile
   - Creates `googleUserMappings` document for quick lookups

2. **Login Phase:**
   - User signs in with Google
   - Firebase verifies Google ID token
   - System checks if Google account is registered
   - Generates session token
   - User gains access to dashboard

### Security Measures

- ✅ Firebase Authentication for Google Sign-In
- ✅ ID Token verification on backend
- ✅ One Google account per user profile
- ✅ One user profile per Google account
- ✅ Slug validation during registration
- ✅ Secure token generation for sessions
- ✅ Token expiration (7 days)
- ✅ HTTPS-only in production

---

## 🗄️ Database Schema

### Users Collection

Each user document now includes:

```typescript
{
  // ... existing fields ...
  
  // New Google OAuth fields
  googleUid: string,              // Firebase Auth UID
  googleEmail: string,            // Google account email
  googleDisplayName: string,      // Name from Google
  googlePhotoURL: string,         // Profile photo from Google
  isGoogleLinked: boolean,        // Registration status
  registeredAt: Timestamp,        // When registered with Google
  lastLoginAt: Timestamp          // Last login timestamp
}
```

### Google User Mappings Collection

New collection for quick lookups:

```typescript
// Document ID: googleUid
{
  userId: string,        // Reference to users collection
  email: string,         // Google email
  urlSlug: string,       // User's URL slug
  linkedAt: Timestamp    // When linked
}
```

---

## 🧪 Testing the Flow

### Test Registration

1. Create a test user in admin dashboard
2. Copy registration link
3. Open link in incognito/private window
4. Complete Google sign-in
5. Verify successful registration message
6. Check Firestore:
   - User document should have `googleUid` and `isGoogleLinked: true`
   - `googleUserMappings` collection should have new document

### Test Login

1. Go to `/user-login`
2. Click "Sign in with Google"
3. Use the same Google account from registration
4. Should redirect to `/dashboard`
5. Verify analytics data loads

### Test Error Cases

1. **Unregistered Google Account:**
   - Try logging in with Google account that hasn't registered
   - Should show error: "This Google account is not registered"

2. **Invalid Registration Link:**
   - Try accessing `/register` without parameters
   - Should show "Invalid Registration Link" error

3. **Already Registered:**
   - Try registering with same link twice
   - Should show "Account already registered" error

---

## 🚨 Troubleshooting

### Issue: "Pop-up blocked" error

**Solution:** Enable pop-ups for your domain in browser settings

### Issue: "This Google account is not registered"

**Solution:** User needs to complete registration first using the link from admin

### Issue: "Invalid or expired token"

**Solution:** 
- Check Firebase Console that Google auth is enabled
- Verify API keys in `firebase.ts` are correct
- Ensure ID token is being sent in requests

### Issue: Registration link doesn't work

**Solution:**
- Verify `userId` and `slug` parameters are in URL
- Check user exists in Firestore
- Verify slug matches user's `urlSlug` field

### Issue: Functions not deploying

**Solution:**
```bash
# Ensure you're logged in
firebase login

# Check project
firebase use --add

# Deploy with verbose logging
firebase deploy --only functions --debug
```

---

## 🔄 Migration from Old System

If you have existing users with email/URL login:

### Option 1: Force Re-registration

1. Send registration links to all existing users
2. Users register with Google
3. Old login methods become inactive

### Option 2: Keep Old Login Temporarily

1. Modify `user-login.tsx` to show both options
2. Add "Register with Google" flow for existing users
3. Gradually phase out old login

---

## 📱 User Experience Flow

### Registration Email Template

```
Subject: Activate Your NFC Digital Profile

Hi [User Name],

Your digital profile has been created! To access your profile dashboard and view analytics, please register using the link below:

🔗 Registration Link: [REGISTRATION_URL]

Steps:
1. Click the link above
2. Sign in with your Google account
3. Your account will be activated instantly

After registration, you can login anytime at:
https://yourapp.com/user-login

Questions? Contact support@burjcodetech.com

Best regards,
BurjCode Technologies
```

---

## 🎯 Key Benefits

1. **Enhanced Security:** Google's OAuth 2.0 authentication
2. **No Password Management:** Users don't need to remember passwords
3. **Easy Access:** One-click login after registration
4. **Admin Control:** Admins control who can register
5. **Audit Trail:** Track registration and login times
6. **Better UX:** Familiar Google sign-in experience

---

## 📊 Analytics & Monitoring

Monitor authentication in Firebase Console:

1. **Authentication → Users** - See all registered Google users
2. **Authentication → Usage** - Track sign-in activity
3. **Firestore → googleUserMappings** - See all linked accounts

---

## 🔮 Future Enhancements

Potential improvements:

1. **Multi-factor Authentication** - Add 2FA option
2. **Email Notifications** - Auto-send registration links
3. **Link Expiration** - Add time-limited registration links
4. **Account Recovery** - Google account disconnection/recovery
5. **Social Login Options** - Add Facebook, Apple Sign-In

---

## 📞 Support

For issues or questions:
- Email: support@burjcodetech.com
- Documentation: Check this guide
- Firebase Console: Check logs and authentication status

---

## ✅ Deployment Checklist

Before going live:

- [ ] Google Sign-In enabled in Firebase Console
- [ ] Cloud Functions deployed successfully
- [ ] API endpoints updated in `api.ts`
- [ ] Tested registration flow
- [ ] Tested login flow
- [ ] Tested error scenarios
- [ ] Updated domain in Firebase Auth settings
- [ ] SSL certificate active (HTTPS)
- [ ] Registration email template ready
- [ ] User documentation sent to admins

---

**Last Updated:** January 2026
**Version:** 2.0 - Google OAuth Authentication
