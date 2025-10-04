import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import cors from 'cors';

const corsHandler = cors({ origin: true });

export const trackPageView = (req: Request, res: Response): void => {
  corsHandler(req, res, async (): Promise<void> => {
    try {
      const { userId, slug, metadata } = req.body;

      if (!userId) {
        res.status(400).json({ error: 'Missing userId parameter' });
        return;
      }

      const db = admin.firestore();
      const now = admin.firestore.Timestamp.now();
      const batch = db.batch();

      // 1. Update user's total view count
      const userRef = db.collection('users').doc(userId);
      batch.update(userRef, {
        totalViews: admin.firestore.FieldValue.increment(1),
        lastViewedAt: now
      });

      // 2. Update global analytics
      const analyticsRef = db.collection('analytics').doc('global');
      batch.set(analyticsRef, {
        totalProfileViews: admin.firestore.FieldValue.increment(1),
        lastUpdated: now
      }, { merge: true });

      // 3. Record individual view event
      const viewEventRef = db.collection('viewEvents').doc();
      batch.set(viewEventRef, {
        userId: userId,
        slug: slug || null,
        timestamp: now,
        userAgent: req.headers['user-agent'] || null,
        referer: req.headers.referer || null,
        ip: req.ip || req.connection.remoteAddress || null,
        metadata: metadata || null
      });

      // Execute all updates
      await batch.commit();

      res.status(200).json({
        success: true,
        message: 'Page view tracked successfully',
        timestamp: now
      });

    } catch (error) {
      console.error('trackPageView error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to track page view',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
};
