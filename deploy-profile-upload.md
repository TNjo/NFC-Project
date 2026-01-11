# Quick Deployment Commands

## 1. Deploy Backend (Cloud Functions)
```bash
cd "D:\Burjcode\Cloud Functions\functions"
npm run build
cd ..
firebase deploy --only functions:updateProfilePictureFn
```

## 2. Commit and Push Frontend
```bash
cd "D:\Burjcode\Cloud Functions"
git add .
git commit -m "feat: Add profile picture upload functionality

- Created updateProfilePicture Cloud Function with Firebase Storage integration
- Added ProfilePictureUpload component with preview and validation
- Integrated upload feature into user dashboard
- Added base64 conversion for VCF file compatibility
- Updated API configuration and ProfileHeader component"
git push origin main
```

## 3. Verify Deployment
- ✅ Check Firebase Console: Functions section
- ✅ Check Vercel: Auto-deployment status
- ✅ Test on live site: Login and try uploading profile picture

## Files Changed
### Backend:
- `functions/src/handlers/updateProfilePicture.ts` (NEW)
- `functions/src/index.ts`
- `functions/package.json`

### Frontend:
- `project/components/Dashboard/ProfilePictureUpload.tsx` (NEW)
- `project/components/Dashboard/ProfileHeader.tsx`
- `project/components/Dashboard/index.ts`
- `project/pages/dashboard.tsx`
- `project/config/api.ts`

### Documentation:
- `PROFILE_PICTURE_UPLOAD_GUIDE.md` (NEW)
- `deploy-profile-upload.md` (NEW)
