// functions/src/handlers/addUserDetails.ts
import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import cors from 'cors';

const corsHandler = cors({ origin: true });

export const addUserDetails = (req: Request, res: Response): void => {
  corsHandler(req, res, async (): Promise<void> => {
    try {
      // 1) Verify ID token
      const authHeader = req.headers.authorization || '';
      const match = authHeader.match(/^Bearer (.*)$/);
      if (!match) {
        res.status(401).json({ error: 'Unauthorized: token missing' });
        return;
      }
      const decoded = await admin.auth().verifyIdToken(match[1]);
      const uid = decoded.uid;

      // 2) Validate input
      const {
        firstName,
        lastName,
        dob,
        phoneNumber,
        address,
        theme,
        profileImageUrl
      } = req.body;
      if (!firstName || !lastName || !dob || !phoneNumber || !address || !theme) {
        res.status(400).json({ error: 'Missing fields' });
        return;
      }

      // 3) Upsert under /users/{uid}
      const db = admin.firestore();
      const userRef = db.collection('users').doc(uid);
      await userRef.set({
        firstName,
        lastName,
        dob,
        phoneNumber,
        address,
        theme,
        profileImageUrl: profileImageUrl || null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      // 4) Send response
      res.status(200).json({ userId: uid });
    } catch (err) {
      console.error('addUserDetails error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
};
