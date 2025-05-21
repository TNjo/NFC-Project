import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import cors from 'cors';

const corsHandler = cors({ origin: true });

export const getUser = (req: Request, res: Response): void => {
  corsHandler(req, res, async () => {
    const { userId } = req.query;

    if (!userId) {
      res.status(400).json({ error: 'Missing userId parameter' });
      return;
    }

    try {
      const docRef = admin.firestore().collection('users').doc(userId as string);
      const doc = await docRef.get();

      if (!doc.exists) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (err) {
      console.error('getUser error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
};
