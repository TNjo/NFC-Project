// functions/src/handlers/deleteUser.ts
import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import cors from 'cors';

const corsHandler = cors({ origin: true });

export const deleteUser = (req: Request, res: Response): void => {
  corsHandler(req, res, async (): Promise<void> => {
    try {
      // 1) Get user ID from URL parameter or body
      const userId = req.params.userId || req.body.userId || req.query.userId;
      
      if (!userId) {
        res.status(400).json({ error: 'Missing userId parameter' });
        return;
      }

      // 2) Validate that user exists and get user data before deletion
      const db = admin.firestore();
      const userRef = db.collection('users').doc(userId as string);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // 3) Store user data for response (optional, for logging/audit purposes)
      const userData = userDoc.data();
      const userInfo = {
        fullName: userData?.fullName || 'Unknown',
        emailAddress: userData?.emailAddress || 'Unknown',
        displayName: userData?.displayName || 'Unknown'
      };

      // 4) Delete the user document
      await userRef.delete();

      // 5) Send success response
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        userId: userId,
        deletedUser: userInfo
      });

    } catch (err) {
      console.error('deleteUser error:', err);
      
      // Handle specific Firestore errors
      if (err instanceof Error) {
        if (err.message.includes('PERMISSION_DENIED')) {
          res.status(403).json({ error: 'Permission denied to delete user' });
        } else if (err.message.includes('NOT_FOUND')) {
          res.status(404).json({ error: 'User not found' });
        } else {
          res.status(500).json({ error: 'Internal server error' });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });
};
