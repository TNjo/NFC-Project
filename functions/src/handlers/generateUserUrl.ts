// functions/src/handlers/generateUserUrl.ts
import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import cors from 'cors';

const corsHandler = cors({ origin: true });

// Function to generate a URL-friendly slug from user name
function generateSlug(fullName: string, userId: string): string {
  // Remove special characters and convert to lowercase
  const baseSlug = fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  // Add first 6 characters of userId to ensure uniqueness
  const uniqueSuffix = userId.substring(0, 6);
  
  return `${baseSlug}-${uniqueSuffix}`;
}

export const generateUserUrl = (req: Request, res: Response): void => {
  corsHandler(req, res, async (): Promise<void> => {
    try {
      // Get userId from request
      const { userId } = req.body;
      
      if (!userId) {
        res.status(400).json({ error: 'Missing userId parameter' });
        return;
      }

      // Get user data from Firestore
      const db = admin.firestore();
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const userData = userDoc.data();
      if (!userData?.fullName) {
        res.status(400).json({ error: 'User missing required fullName field' });
        return;
      }

      // Generate unique slug
      const slug = generateSlug(userData.fullName, userId);
      
      // Get base URL dynamically from request or environment
      let baseUrl = process.env.PUBLIC_URL;
      if (!baseUrl) {
        const origin = req.get('origin') || req.get('referer');
        if (origin) {
          // Extract base URL from origin/referer
          baseUrl = origin.replace(/\/$/, ''); // Remove trailing slash
        } else {
          // Fallback to production URL
          baseUrl = 'https://burjcode-profile-dev.web.app';
        }
      }
      
      const publicUrl = `${baseUrl}/card/${slug}`;

      // Update user document with public URL and slug
      await userRef.update({
        publicUrl: publicUrl,
        urlSlug: slug,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Create URL mapping document for quick lookups
      const urlMappingRef = db.collection('urlMappings').doc(slug);
      await urlMappingRef.set({
        userId: userId,
        slug: slug,
        fullName: userData.fullName,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Send response
      res.status(200).json({
        success: true,
        message: 'Public URL generated successfully',
        userId: userId,
        publicUrl: publicUrl,
        slug: slug,
        data: {
          fullName: userData.fullName,
          displayName: userData.displayName || userData.fullName
        }
      });

    } catch (err) {
      console.error('generateUserUrl error:', err);
      
      // Handle specific Firestore errors
      if (err instanceof Error) {
        if (err.message.includes('PERMISSION_DENIED')) {
          res.status(403).json({ error: 'Permission denied to generate URL' });
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
