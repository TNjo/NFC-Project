import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import cors from 'cors';

const corsHandler = cors({ origin: true });

export const trackContactSave = (req: Request, res: Response): void => {
  corsHandler(req, res, async (): Promise<void> => {
    try {
      const { userId, metadata } = req.body;

      if (!userId) {
        res.status(400).json({ error: 'Missing userId parameter' });
        return;
      }

      const db = admin.firestore();
      const now = admin.firestore.Timestamp.now();
      const batch = db.batch();

      // 1. Update user's total contact saves count
      const userRef = db.collection('users').doc(userId);
      batch.update(userRef, {
        totalContactSaves: admin.firestore.FieldValue.increment(1),
        lastContactSavedAt: now
      });

      // 2. Update global analytics
      const analyticsRef = db.collection('analytics').doc('global');
      batch.set(analyticsRef, {
        totalContactSaves: admin.firestore.FieldValue.increment(1),
        lastUpdated: now
      }, { merge: true });

      // 3. Record individual contact save event (for detailed analytics)
      const contactSaveEventRef = db.collection('contactSaveEvents').doc();
      batch.set(contactSaveEventRef, {
        userId: userId,
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
        message: 'Contact save tracked successfully',
        timestamp: now
      });

    } catch (error) {
      console.error('trackContactSave error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to track contact save',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
};
