import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import cors from 'cors';

const corsHandler = cors({ origin: true });

// Helper function to generate simple token for users
const generateUserToken = (userId: string, email: string, googleUid: string): string => {
  const tokenData = {
    userId: userId,
    email: email,
    googleUid: googleUid,
    role: 'user',
    type: 'cardholder',
    timestamp: Date.now()
  };
  
  return Buffer.from(JSON.stringify(tokenData)).toString('base64');
};

// Google User login handler
export const googleUserLogin = (req: Request, res: Response): void => {
  corsHandler(req, res, async (): Promise<void> => {
    try {
      console.log('Google user login attempt');

      const { idToken } = req.body;

      if (!idToken) {
        res.status(400).json({
          success: false,
          error: 'ID token is required'
        });
        return;
      }

      // Verify the Firebase ID token
      let decodedToken;
      try {
        decodedToken = await admin.auth().verifyIdToken(idToken);
      } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({
          success: false,
          error: 'Invalid or expired token'
        });
        return;
      }

      const googleUid = decodedToken.uid;
      const googleEmail = decodedToken.email;

      console.log('Google login verified:', { googleUid, googleEmail });

      const db = admin.firestore();

      // Find user by Google UID
      const googleMappingDoc = await db.collection('googleUserMappings').doc(googleUid).get();

      if (!googleMappingDoc.exists) {
        console.log('Google account not registered');
        res.status(404).json({
          success: false,
          error: 'This Google account is not registered. Please use the registration link provided by your administrator.'
        });
        return;
      }

      const mappingData = googleMappingDoc.data();
      const userId = mappingData?.userId;

      if (!userId) {
        res.status(500).json({
          success: false,
          error: 'Invalid user mapping'
        });
        return;
      }

      // Get user data
      const userDoc = await db.collection('users').doc(userId).get();

      if (!userDoc.exists) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      const userData = userDoc.data();

      // Verify Google account is still linked
      if (userData?.googleUid !== googleUid) {
        res.status(403).json({
          success: false,
          error: 'Google account link mismatch'
        });
        return;
      }

      // Generate token for the user
      const token = generateUserToken(userId, userData.emailAddress, googleUid);

      // Update last login timestamp
      await userDoc.ref.update({
        lastLoginAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now()
      });

      console.log('Login successful for user:', userId);

      // Return user data with token
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          userId: userId,
          token: token,
          email: userData.emailAddress,
          fullName: userData.fullName,
          displayName: userData.displayName,
          profilePicture: userData.profilePictureBase64 || userData.profilePicture || null,
          designation: userData.designation || null,
          companyName: userData.companyName || null,
          urlSlug: userData.urlSlug || null,
          publicUrl: userData.publicUrl || null,
          googleEmail: googleEmail,
          googlePhotoURL: userData.googlePhotoURL || null,
          role: 'user'
        }
      });

    } catch (error) {
      console.error('googleUserLogin error:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      res.status(500).json({
        success: false,
        error: 'Failed to login',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
};
