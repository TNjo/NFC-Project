// functions/src/handlers/getUserByUrl.ts
import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import cors from 'cors';

const corsHandler = cors({ origin: true });

export const getUserByUrl = (req: Request, res: Response): void => {
  corsHandler(req, res, async (): Promise<void> => {
    try {
      // Get slug from URL parameter or query
      const slug = req.params.slug || req.query.slug;
      
      if (!slug) {
        res.status(400).json({ error: 'Missing URL slug parameter' });
        return;
      }

      const db = admin.firestore();

      // First, get userId from URL mapping
      const urlMappingRef = db.collection('urlMappings').doc(slug as string);
      const urlMappingDoc = await urlMappingRef.get();

      if (!urlMappingDoc.exists) {
        res.status(404).json({ error: 'URL not found' });
        return;
      }

      const urlMappingData = urlMappingDoc.data();
      
      if (!urlMappingData?.isActive) {
        res.status(404).json({ error: 'URL is no longer active' });
        return;
      }

      const userId = urlMappingData.userId;

      // Get full user data
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        res.status(404).json({ error: 'User data not found' });
        return;
      }

      const userData = userDoc.data();

      // Prepare response data (exclude sensitive information if any)
      const publicUserData = {
        id: userDoc.id,

        // Basic Information
        prefixes: userData?.prefixes || null,
        profilePicture: userData?.profilePicture || null,
        profilePictureBase64: userData?.profilePictureBase64 || null,
        backgroundImageUrl: userData?.backgroundImageUrl || null,
        backgroundColors: userData?.backgroundColors || null,
        fullName: userData?.fullName || '',
        displayName: userData?.displayName || '',
        cardPrintName: userData?.cardPrintName || '',
        
        // Contact Information
        primaryContactNumber: userData?.primaryContactNumber || '',
        secondaryContactNumber: userData?.secondaryContactNumber || null,
        whatsappNumber: userData?.whatsappNumber || null,
        emailAddress: userData?.emailAddress || '',
        
        // Professional Information
        designation: userData?.designation || null,
        companyName: userData?.companyName || null,
        companyWebsiteUrl: userData?.companyWebsiteUrl || null,
        companyLocation: userData?.companyLocation || null,
        
        // Social Media Profiles
        linkedinProfile: userData?.linkedinProfile || null,
        instagramProfile: userData?.instagramProfile || null,
        facebookProfile: userData?.facebookProfile || null,
        twitterProfile: userData?.twitterProfile || null,
        personalWebsite: userData?.personalWebsite || null,
        
        // Platforms
        platforms: userData?.platforms || [],
        
        // Business Information
        googleReviewLink: userData?.googleReviewLink || null,
        businessContact: userData?.businessContact || null,
        businessEmailAddress: userData?.businessEmailAddress || null,
        
        // Public URL info
        publicUrl: userData?.publicUrl || null,
        urlSlug: userData?.urlSlug || null,
        
        // System fields (formatted for display)
        createdAt: userData?.createdAt ? userData.createdAt.toDate() : null,
        updatedAt: userData?.updatedAt ? userData.updatedAt.toDate() : null
      };

      // Track page view
      try {
        const now = admin.firestore.Timestamp.now();
        const batch = db.batch();

        // 1. Update user's total view count
        const userUpdateRef = db.collection('users').doc(userId);
        batch.update(userUpdateRef, {
          totalViews: admin.firestore.FieldValue.increment(1),
          lastViewedAt: now
        });

        // 2. Add to global analytics
        const analyticsRef = db.collection('analytics').doc('global');
        batch.set(analyticsRef, {
          totalProfileViews: admin.firestore.FieldValue.increment(1),
          lastUpdated: now
        }, { merge: true });

        // 3. Record individual view event (for detailed analytics)
        const viewEventRef = db.collection('viewEvents').doc();
        batch.set(viewEventRef, {
          userId: userId,
          slug: slug,
          timestamp: now,
          userAgent: req.headers['user-agent'] || null,
          referer: req.headers.referer || null,
          ip: req.ip || req.connection.remoteAddress || null
        });

        // Execute all updates
        await batch.commit();
        
        console.log(`Page view tracked for user ${userId} (${slug})`);
      } catch (viewError) {
        console.error('Error tracking page view:', viewError);
        // Don't fail the main request if view tracking fails
      }

      // Send success response
      res.status(200).json({
        success: true,
        message: 'User data retrieved successfully',
        slug: slug,
        data: publicUserData
      });

    } catch (err) {
      console.error('getUserByUrl error:', err);
      
      // Handle specific Firestore errors
      if (err instanceof Error) {
        if (err.message.includes('PERMISSION_DENIED')) {
          res.status(403).json({ error: 'Permission denied to read user data' });
        } else if (err.message.includes('NOT_FOUND')) {
          res.status(404).json({ error: 'URL or user not found' });
        } else {
          res.status(500).json({ error: 'Internal server error' });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });
};
