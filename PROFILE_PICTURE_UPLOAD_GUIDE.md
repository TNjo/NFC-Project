# Profile Picture Upload Feature - Implementation Guide

## Overview
This feature allows users to update their profile picture from the dashboard. The uploaded image is:
1. Stored in Firebase Storage with a public URL
2. Converted to base64 format
3. Both versions saved to the user's Firestore document

## 🎯 What Was Implemented

### Backend (Cloud Functions)

#### 1. New Cloud Function: `updateProfilePicture`
**File:** `functions/src/handlers/updateProfilePicture.ts`

**Features:**
- Handles multipart/form-data file uploads using `busboy`
- Validates file type (images only) and user authentication
- Uploads image to Firebase Storage at `profile-pictures/{userId}/{filename}`
- Makes the file publicly accessible
- Converts image to base64 format
- Updates Firestore with both `profilePicture` (URL) and `profilePhoto` (base64)

**API Endpoint:**
```
POST https://us-central1-burjcode-profile-dev.cloudfunctions.net/updateProfilePictureFn?userId={userId}
Content-Type: multipart/form-data
Body: FormData with 'profilePicture' field
```

**Response:**
```json
{
  "success": true,
  "message": "Profile picture updated successfully",
  "userId": "abc123",
  "data": {
    "profilePicture": "https://storage.googleapis.com/...",
    "profilePhoto": "data:image/jpeg;base64,...",
    "fullName": "John Doe",
    "displayName": "John"
  }
}
```

#### 2. Dependencies Added
**File:** `functions/package.json`
- `busboy`: ^1.6.0 (for handling file uploads)
- `@types/busboy`: ^1.5.4 (TypeScript types)

#### 3. Function Export
**File:** `functions/src/index.ts`
- Added `updateProfilePictureFn` export

### Frontend (Next.js)

#### 1. ProfilePictureUpload Component
**File:** `project/components/Dashboard/ProfilePictureUpload.tsx`

**Features:**
- Drag-and-drop style upload interface
- Camera icon overlay on hover
- File validation (type and size < 5MB)
- Preview modal before upload
- Upload progress indicator
- Automatic localStorage update after successful upload
- Error handling with toast notifications

**Props:**
```typescript
interface ProfilePictureUploadProps {
  currentPicture?: string;
  onUploadSuccess: (newPictureUrl: string, base64: string) => void;
  onUploadError: (error: string) => void;
}
```

#### 2. Updated ProfileHeader Component
**File:** `project/components/Dashboard/ProfileHeader.tsx`

**Changes:**
- Integrated `ProfilePictureUpload` component
- Added new props for upload callbacks
- Conditionally renders upload UI or static image based on callback presence

**New Props:**
```typescript
onProfilePictureUpdate?: (newUrl: string, base64: string) => void;
onUploadError?: (error: string) => void;
```

#### 3. Updated Dashboard Page
**File:** `project/pages/dashboard.tsx`

**Changes:**
- Added `handleProfilePictureUpdate` function
- Added `handleUploadError` function
- Passes callbacks to `ProfileHeader` component
- Automatically refreshes analytics after successful upload

#### 4. API Configuration
**File:** `project/config/api.ts`

**Added:**
- `UPDATE_PROFILE_PICTURE` endpoint
- `updateProfilePicture` method in `apiMethods`

**Usage:**
```typescript
apiMethods.updateProfilePicture(userId, file, token?)
```

## 🚀 How to Deploy

### Step 1: Install Dependencies
```bash
cd "D:\Burjcode\Cloud Functions\functions"
npm install
```

### Step 2: Build Functions
```bash
npm run build
```

### Step 3: Deploy to Firebase
```bash
cd "D:\Burjcode\Cloud Functions"
firebase deploy --only functions:updateProfilePictureFn
```

### Step 4: Commit and Push Frontend
```bash
git add .
git commit -m "feat: Add profile picture upload functionality

- Created updateProfilePicture Cloud Function with Firebase Storage integration
- Added ProfilePictureUpload component with preview and validation
- Integrated upload feature into user dashboard
- Added base64 conversion for VCF file compatibility
- Updated API configuration and ProfileHeader component"
git push origin main
```

### Step 5: Vercel Auto-Deploy
Vercel will automatically deploy the frontend changes from the main branch.

## 📝 Firebase Storage Setup

### Required Permissions
Ensure your Firebase Storage rules allow authenticated users to upload:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-pictures/{userId}/{allPaths=**} {
      // Allow users to upload their own profile pictures
      allow write: if request.auth != null;
      // Allow public read access
      allow read: if true;
    }
  }
}
```

### Storage Location
- **Path Pattern:** `profile-pictures/{userId}/{filename}`
- **Example:** `profile-pictures/abc123/john-doe_1673456789.jpg`
- **Access:** Public (anyone can view via URL)

## 🎨 User Experience Flow

1. **User visits dashboard** → Sees current profile picture with camera icon overlay
2. **Hovers over picture** → Camera icon appears, indicating clickable
3. **Clicks picture or upload button** → File picker opens
4. **Selects image** → Preview modal appears with selected image
5. **Clicks "Upload"** → Shows loading spinner
6. **Upload completes** → Success toast, modal closes, dashboard refreshes
7. **New picture displays** → Both in header and throughout the app

## 🔧 Technical Details

### Image Processing
- **Validation:** File type must be `image/*`, max size 5MB
- **Storage:** Original file uploaded to Firebase Storage
- **Base64:** Generated server-side for VCF embedding
- **URL:** Public HTTPS URL from Firebase Storage

### Data Flow
```
User selects file
  ↓
Frontend validation
  ↓
FormData created
  ↓
API call to Cloud Function
  ↓
Busboy parses multipart data
  ↓
File saved to temp directory
  ↓
Upload to Firebase Storage
  ↓
Make file public
  ↓
Convert to base64
  ↓
Update Firestore document
  ↓
Return URLs to frontend
  ↓
Update localStorage
  ↓
Refresh analytics
  ↓
UI updates with new picture
```

### Firestore Updates
The Cloud Function updates these fields in the user document:
```javascript
{
  profilePicture: "https://storage.googleapis.com/...",  // For web display
  profilePhoto: "data:image/jpeg;base64,...",            // For VCF files
  updatedAt: Timestamp
}
```

## 🐛 Error Handling

### Frontend Validation
- ✅ File type must be image
- ✅ File size must be < 5MB
- ✅ User must be authenticated

### Backend Validation
- ✅ Content-Type must be multipart/form-data
- ✅ User must exist in Firestore
- ✅ File must be uploaded with field name "profilePicture"

### Error Messages
- "Please select an image file"
- "Image size must be less than 5MB"
- "User not authenticated"
- "Failed to upload profile picture"

## 📱 Mobile Responsiveness
- Touch-friendly upload button
- Responsive modal design
- Optimized image preview sizes
- Works on all screen sizes

## 🔐 Security Considerations
1. **Authentication:** User must be logged in (userId from localStorage)
2. **File Validation:** Server-side validation of file types
3. **Storage Rules:** Only authenticated users can upload
4. **Public Access:** Images are public (suitable for profile pictures)

## 🎯 Future Enhancements (Optional)
- [ ] Image cropping/editing before upload
- [ ] Multiple image format optimization (WebP)
- [ ] Image compression to reduce file size
- [ ] Delete old profile pictures from Storage
- [ ] Avatar selection from predefined set
- [ ] Drag-and-drop file upload

## ✅ Testing Checklist
- [ ] Upload JPG image
- [ ] Upload PNG image
- [ ] Try uploading file > 5MB (should fail)
- [ ] Try uploading non-image file (should fail)
- [ ] Verify image appears in dashboard immediately
- [ ] Verify image appears in public card page
- [ ] Check Firebase Storage for uploaded file
- [ ] Check Firestore for updated URLs
- [ ] Test on mobile device
- [ ] Test with slow network connection

## 📞 Support
If you encounter any issues:
1. Check browser console for errors
2. Check Firebase Functions logs: `firebase functions:log`
3. Verify Firebase Storage rules are configured
4. Ensure billing is enabled on Firebase project

---

**Implementation Date:** January 11, 2026
**Status:** ✅ Ready for Deployment
